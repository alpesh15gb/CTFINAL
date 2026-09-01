import { chromium } from "playwright";

async function capture() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });

  console.log("Navigating to http://localhost:3000...");
  const glbPromise = page.waitForResponse((r) => r.url().includes("hero-car.glb"), { timeout: 30000 }).catch(() => null);
  await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });
  await glbPromise;
  await page.waitForTimeout(3500);

  // FRAME A — Dark Machine (Initial Hero, scrollY = 0)
  console.log("Capturing FRAME A...");
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(800);
  await page.screenshot({ path: "qa-shots/recovery-frame-a.png" });
  console.log("Saved qa-shots/recovery-frame-a.png");

  // FRAME B — Campaign Hero Peak (scrollY = 240)
  console.log("Capturing FRAME B...");
  await page.evaluate(() => window.scrollTo(0, 240));
  await page.waitForTimeout(800);
  await page.screenshot({ path: "qa-shots/recovery-frame-b.png" });
  console.log("Saved qa-shots/recovery-frame-b.png");

  // FRAME C — Macro / Detail (scrollY = 450)
  console.log("Capturing FRAME C...");
  await page.evaluate(() => window.scrollTo(0, 450));
  await page.waitForTimeout(800);
  await page.screenshot({ path: "qa-shots/recovery-frame-c.png" });
  console.log("Saved qa-shots/recovery-frame-c.png");

  // Bridge — (scrollY = 900)
  console.log("Capturing Bridge...");
  await page.evaluate(() => window.scrollTo(0, 900));
  await page.waitForTimeout(800);
  await page.screenshot({ path: "qa-shots/recovery-bridge.png" });
  console.log("Saved qa-shots/recovery-bridge.png");

  await browser.close();
  console.log("All recovery frames captured!");
}

capture().catch(console.error);
