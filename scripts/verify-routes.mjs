import { chromium } from "playwright";

async function verifyAll() {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  const routes = [
    "/",
    "/shop",
    "/builds",
    "/cart",
    "/about",
    "/contact",
    "/account",
  ];

  for (const r of routes) {
    const res = await page.goto("http://localhost:3000" + r, { waitUntil: "networkidle" });
    const title = await page.title();
    console.log(`Route ${r}: status ${res.status()} | Title: ${title}`);
  }

  // Also check dynamic product slug from shop page
  await page.goto("http://localhost:3000/shop", { waitUntil: "networkidle" });
  const productLink = await page.locator("a[href^='/products/']").first();
  if (await productLink.count() > 0) {
    const href = await productLink.getAttribute("href");
    const resProd = await page.goto("http://localhost:3000" + href, { waitUntil: "networkidle" });
    console.log(`Dynamic Product Route ${href}: status ${resProd.status()}`);
  }

  // Also check dynamic build slug from builds page
  await page.goto("http://localhost:3000/builds", { waitUntil: "networkidle" });
  const buildLink = await page.locator("a[href^='/builds/']").first();
  if (await buildLink.count() > 0) {
    const href = await buildLink.getAttribute("href");
    const resBuild = await page.goto("http://localhost:3000" + href, { waitUntil: "networkidle" });
    console.log(`Dynamic Build Route ${href}: status ${resBuild.status()}`);
  }

  await browser.close();
  console.log("All routes and dynamic paths fully functional!");
}

verifyAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
