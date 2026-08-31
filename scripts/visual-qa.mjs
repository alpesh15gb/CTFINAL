import { chromium } from "playwright";
import fs from "node:fs";

const BASE = "http://localhost:3000";
const OUT = "qa-shots";
fs.mkdirSync(OUT, { recursive: true });

const failedRequests = [];

async function settle(page, y, ms = 1000) {
  await page.evaluate((t) => window.scrollTo({ top: t, behavior: "instant" }), y);
  await page.waitForTimeout(ms);
  let actual = await page.evaluate(() => window.scrollY);
  if (Math.abs(actual - y) > 8) {
    await page.evaluate((t) => {
      document.documentElement.scrollTop = t;
      window.dispatchEvent(new Event("scroll"));
    }, y);
    await page.waitForTimeout(ms);
    actual = await page.evaluate(() => window.scrollY);
  }
  return actual;
}

async function shot(page, name, y) {
  const actual = await settle(page, y);
  await page.screenshot({ path: `${OUT}/${name}.png`, timeout: 60000 });
  console.log(`  captured ${name} @ scrollY=${Math.round(actual)} (target ${Math.round(y)})`);
}

async function pageReport(page, label) {
  const info = await page.evaluate(() => {
    const vh = window.innerHeight;
    const docH = document.documentElement.scrollHeight;
    const overflowX = document.documentElement.scrollWidth - window.innerWidth;
    const imgs = Array.from(document.querySelectorAll("img"))
      .filter((i) => !i.complete || i.naturalWidth === 0)
      .map((i) => i.currentSrc.slice(0, 100));
    const canvases = document.querySelectorAll("canvas").length;
    const mains = Array.from(document.querySelectorAll("main > *")).map(
      (el) => `${el.tagName}.${(el.className || "").slice(0, 30)}:${Math.round(el.getBoundingClientRect().height)}px (${(el.getBoundingClientRect().height / vh).toFixed(2)}vh)`
    );
    const acts = Array.from(
      document.querySelectorAll('[class*="h-[95vh]"], [class*="h-[70vh]"]')
    ).map((el) => ({
      cls: (el.className || "").slice(0, 40),
      top: Math.round(el.getBoundingClientRect().top + window.scrollY),
      h: Math.round(el.getBoundingClientRect().height),
    }));
    return { vh, docH, overflowX, brokenImgs: imgs, canvases, mains, acts };
  });
  console.log(`--- ${label} ---`);
  console.log(JSON.stringify(info, null, 1));
  return info;
}

function trackRequests(page) {
  page.on("requestfailed", (r) => failedRequests.push(`${r.method()} ${r.url().slice(0, 120)} :: ${r.failure()?.errorText}`));
  page.on("response", (r) => {
    if (r.status() >= 400) failedRequests.push(`HTTP ${r.status()} ${r.url().slice(0, 120)}`);
  });
}

async function waitForScene(page) {
  try {
    await page.waitForResponse((r) => r.url().includes("hero-car.glb"), { timeout: 30000 });
    console.log("  hero-car.glb loaded");
  } catch {
    console.log("  WARNING: hero-car.glb request not observed");
  }
  await page.waitForTimeout(3000);
}

async function withBrowser(fn) {
  const browser = await chromium.launch();
  try {
    await fn(browser);
  } finally {
    await browser.close();
  }
}

(async () => {
  /* ---------------- DESKTOP 1440x900 ---------------- */
  await withBrowser(async (browser) => {
    const ctx = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await ctx.newPage();
    trackRequests(page);
    const consoleErrors = [];
    page.on("console", (m) => { if (m.type() === "error") consoleErrors.push(m.text().slice(0, 160)); });

    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await waitForScene(page);
    const info = await pageReport(page, "DESKTOP 1440x900 structure");
    const vh = info.vh;

    console.log("Desktop cinematic frames:");
    await shot(page, "01-shot-a-silhouette", vh * 0.04);
    await shot(page, "02a-shot-b-early", vh * 0.2);
    await shot(page, "02-shot-b-sweep-mid", vh * 0.31);
    await shot(page, "02b-shot-b-late", vh * 0.42);
    await shot(page, "03-shot-c-peak", vh * 0.62);
    await shot(page, "04-shot-d-handoff-mid", vh * 0.86);
    await shot(page, "05-shot-d-macro-full", vh * 0.945);
    await shot(page, "06a-bridge-word", vh * 2.05);
    await shot(page, "06-bridge-wordmark", vh * 2.25);
    await shot(page, "07-bridge-spec", vh * 2.39);
    await shot(page, "08-vehicle-selector", vh * 2.9);

    if (info.acts.length >= 3) {
      const [perf, pres, cabin] = info.acts;
      await shot(page, "09-act-performance", perf.top - 20);
      await shot(page, "10-act-presence", pres.top + 240);
      await shot(page, "11-act-cabin", cabin.top + 170);
    } else {
      console.log("  WARNING: acts not found by class, skipping act captures");
    }

    console.log("Console errors:", consoleErrors.length ? consoleErrors : "none");
    await ctx.close();
  });

  /* ---------------- MOBILE 390x844 + 430x932 ---------------- */
  for (const [w, h] of [[390, 844], [430, 932]]) {
    await withBrowser(async (browser) => {
    const ctx = await browser.newContext({
      viewport: { width: w, height: h },
    });
    const page = await ctx.newPage();
    trackRequests(page);
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await waitForScene(page);
    await pageReport(page, `MOBILE ${w}x${h}`);
    const prefix = `${w}x${h}`;
    await shot(page, `m-${prefix}-shot-a`, h * 0.04);
    await shot(page, `m-${prefix}-shot-c`, h * 0.62);
    await shot(page, `m-${prefix}-shot-d`, h * 0.945);
    await shot(page, `m-${prefix}-bridge`, h * 2.17);
    await ctx.close();
    });
  }

  /* ---------------- REDUCED MOTION 1440x900 ---------------- */
  await withBrowser(async (browser) => {
    const ctx = await browser.newContext({
      viewport: { width: 1440, height: 900 },
      reducedMotion: "reduce",
    });
    const page = await ctx.newPage();
    trackRequests(page);
    await page.goto(BASE, { waitUntil: "domcontentloaded" });
    await page.waitForTimeout(3000);
    await pageReport(page, "REDUCED MOTION 1440x900");
    const vh = await page.evaluate(() => window.innerHeight);
    await shot(page, "rm-hero-static", 0);
    const rmTops = await page.evaluate(() => {
      const find = (text) => {
        const el = Array.from(document.querySelectorAll("h2, section")).find(
          (e) => (e.textContent || "").includes(text)
        );
        return el ? Math.round(el.getBoundingClientRect().top + window.scrollY) : null;
      };
      const sel = document.querySelector("#vehicle-selector");
      return {
        bridge: find("CARTUNEZ"),
        selector: sel ? Math.round(sel.getBoundingClientRect().top + window.scrollY) : null,
      };
    });
    if (rmTops.bridge) await shot(page, "rm-bridge", rmTops.bridge - vh * 0.2);
    if (rmTops.selector) await shot(page, "rm-selector", rmTops.selector - vh * 0.1);
    const acts = await page.evaluate(() =>
      Array.from(document.querySelectorAll('[class*="h-[95vh]"], [class*="h-[70vh]"], [class*="h-svh"], [class*="min-h"]'))
        .slice(0, 12)
        .map((el) => ({ cls: (el.className || "").slice(0, 40), top: Math.round(el.getBoundingClientRect().top + window.scrollY), h: Math.round(el.getBoundingClientRect().height) }))
    );
    console.log("RM candidates:", JSON.stringify(acts, null, 1));
    await ctx.close();
  });

  console.log("\nFailed requests:", failedRequests.length ? failedRequests : "none");
})();
