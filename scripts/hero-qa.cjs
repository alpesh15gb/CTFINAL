/* Start the app and Chromium with --remote-debugging-port=9222 before running. */
const fs = require("node:fs");
const path = require("node:path");
const assert = require("node:assert/strict");
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function main() {
  const tabs = await fetch("http://127.0.0.1:9222/json").then((response) => response.json());
  const tab = tabs.find((entry) => entry.type === "page");
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  const pending = new Map();
  const errors = [];
  let id = 0;
  ws.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (message.method === "Runtime.exceptionThrown") errors.push(message.params.exceptionDetails.exception?.description || message.params.exceptionDetails.text);
    if (!pending.has(message.id)) return;
    const { resolve, reject, timeout } = pending.get(message.id);
    clearTimeout(timeout);
    pending.delete(message.id);
    message.error ? reject(new Error(message.error.message)) : resolve(message.result);
  });
  await new Promise((resolve) => ws.addEventListener("open", resolve));
  const call = (method, params = {}) => new Promise((resolve, reject) => {
    const requestId = ++id;
    const timeout = setTimeout(() => { pending.delete(requestId); reject(new Error(`Timed out: ${method}`)); }, 60000);
    pending.set(requestId, { resolve, reject, timeout });
    ws.send(JSON.stringify({ id: requestId, method, params }));
  });
  const evaluate = async (expression) => {
    const response = await call("Runtime.evaluate", { expression, returnByValue: true, awaitPromise: true });
    if (response.exceptionDetails) throw new Error(response.exceptionDetails.text);
    return response.result.value;
  };
  const out = path.resolve("qa-shots/hero");
  fs.mkdirSync(out, { recursive: true });
  try {
    await call("Page.enable");
    await call("Runtime.enable");
    const sizes = [[1440, 900], [1920, 1080], [390, 844], [375, 667], [844, 390]];
    for (const [width, height] of sizes) {
      await call("Emulation.setDeviceMetricsOverride", { width, height, deviceScaleFactor: 1, mobile: false });
      await call("Emulation.setEmulatedMedia", { features: [] });
      await call("Page.navigate", { url: `${process.env.QA_URL || "http://localhost:3000/"}?heroCapture=1` });
      let loaded = false;
      for (let attempt = 0; attempt < 60; attempt++) {
        loaded = await evaluate(`!!document.querySelector('[data-hero] button[aria-label="Chalk finish"]')`);
        if (loaded) break;
        await sleep(1000);
      }
      assert(loaded, `3D scene did not load at ${width}x${height}`);
      await evaluate("window.scrollTo(0,0)");
      await sleep(1800);
      if (process.argv.includes("--poster") && width === 1440) {
        const data = await evaluate(`document.querySelector('[data-hero] canvas').toDataURL('image/webp',.92).split(',')[1]`);
        fs.mkdirSync(path.resolve("public/images"), { recursive: true });
        fs.writeFileSync(path.resolve("public/images/hero-jaguar.webp"), data, "base64");
        console.log("Generated static poster from the opening 3D camera.");
        await evaluate(`document.querySelector('[data-hero] img').src='/images/hero-jaguar.webp?generated='+Date.now()`);
      }
      const imageHashes = [];
      for (const progress of [0, .5, .9, 0]) {
        await evaluate(`window.scrollTo(0, (document.querySelector('[data-hero]').offsetHeight - innerHeight) * ${progress})`);
        await sleep(1800);
        const report = await evaluate(`(() => {
          const hero = document.querySelector('[data-hero]');
          const canvas = hero.querySelector('canvas');
          const rect = canvas.getBoundingClientRect();
          const sample = document.createElement('canvas'); sample.width=120; sample.height=80;
          const context = sample.getContext('2d'); context.drawImage(canvas,0,0,120,80);
          const pixels = context.getImageData(0,0,120,80).data;
          let painted=0, red=0;
          for(let i=0;i<pixels.length;i+=4) { if(pixels[i+3]>128) painted++; if(pixels[i]>pixels[i+1]*1.3 && pixels[i]>pixels[i+2]*1.3 && pixels[i+3]>128) red++; }
          const controls = [...hero.querySelectorAll('a,button')].filter(el=>el.getBoundingClientRect().width).map(el=>({name:el.getAttribute('aria-label')||el.textContent.trim(), x:Math.round(el.getBoundingClientRect().x),right:Math.round(el.getBoundingClientRect().right), bottom:Math.round(el.getBoundingClientRect().bottom)}));
          let hash=0; for(let i=0;i<pixels.length;i++) hash=(Math.imul(hash,31)+pixels[i])|0;
          return {width:innerWidth, overflow:document.documentElement.scrollWidth-innerWidth, canvases:hero.querySelectorAll('canvas').length, heading:hero.querySelector('h2').textContent, painted, red, hash, controls, stage:[Math.round(rect.width),Math.round(rect.height)]};
        })()`);
        assert(report.overflow <= 0, "Horizontal document overflow");
        assert(report.painted > 150, "Canvas appears empty");
        assert.equal(report.heading, progress === 0 ? "Never ordinary." : progress === .5 ? "Different. Down to the detail." : "Your car. Your signature.");
        imageHashes.push(report.hash);
        assert(report.controls.every((control) => control.x >= 0 && control.right <= width + 1), "Hero controls overflow horizontally");
        assert(report.controls.every((control) => control.bottom <= height + 1), "Hero controls fall below viewport");
        const screenshot = await call("Page.captureScreenshot", { format: "png" });
        fs.writeFileSync(path.join(out, `${width}-${height}-${progress}.png`), screenshot.data, "base64");
        console.log(JSON.stringify({ viewport: `${width}x${height}`, progress, ...report }));
      }
      assert.notEqual(imageHashes[0], imageHashes[1], "Scroll did not change rendered camera");
      assert.notEqual(imageHashes[1], imageHashes[2], "Rear camera did not change");
      await evaluate(`document.querySelector('[aria-label="Chalk finish"]').click()`);
      await sleep(800);
      assert(await evaluate(`document.querySelector('[aria-label="Chalk finish"]').getAttribute('aria-pressed')==='true'`), "Finish selection failed");
      const chalkRed = await evaluate(`(() => { const s=document.createElement('canvas');s.width=120;s.height=80;const c=s.getContext('2d');c.drawImage(document.querySelector('[data-hero] canvas'),0,0,120,80);const p=c.getImageData(0,0,120,80).data;let red=0;for(let i=0;i<p.length;i+=4)if(p[i]>p[i+1]*1.3&&p[i]>p[i+2]*1.3&&p[i+3]>128)red++;return red;})()`);
      assert(chalkRed < 200, "Chalk paint did not replace the red body pixels");
      await call("Emulation.setEmulatedMedia", { features: [{ name: "prefers-reduced-motion", value: "reduce" }] });
      await sleep(1200);
      assert.equal(await evaluate(`document.querySelectorAll('[data-hero] canvas').length`), 0, "Reduced motion should not mount WebGL");
      const poster = await evaluate(`(() => {const image=document.querySelector('[data-hero] img'); return {loaded:image.complete&&image.naturalWidth>0,height:document.querySelector('[data-hero]').offsetHeight};})()`);
      assert(poster.loaded, "Static poster failed to load");
      assert(poster.height <= Math.max(height, 680) + 2, "Reduced motion still pinned");
      // Toggling the preference back must not change hook order or lose the scene.
      await call("Emulation.setEmulatedMedia", { features: [] });
      await sleep(1800);
    }
    await call("Emulation.setEmulatedMedia", { features: [] });
    const injection = await call("Page.addScriptToEvaluateOnNewDocument", { source: `const originalGetContext=HTMLCanvasElement.prototype.getContext;HTMLCanvasElement.prototype.getContext=function(type,...args){return type.includes('webgl')?null:originalGetContext.call(this,type,...args);};` });
    await call("Page.navigate", { url: process.env.QA_URL || "http://localhost:3000/" });
    await sleep(4000);
    assert(await evaluate(`document.querySelector('[data-hero] img').naturalWidth>0 && !document.querySelector('[data-hero] canvas') && document.querySelector('[data-hero]').offsetHeight<=innerHeight+1`), "No-WebGL fallback failed");
    await call("Page.removeScriptToEvaluateOnNewDocument", { identifier: injection.identifier });
    assert.deepEqual(errors, [], "Browser runtime errors");
    console.log("Hero QA passed: viewports, reverse scroll, canvas pixels, controls, finish state, live reduced-motion toggle.");
  } finally { ws.close(); }
}
main().catch((error) => { console.error(error); process.exit(1); });
