const express = require("express");
const loaders = require("@medusajs/medusa/dist/loaders").default;

const USER_AGENT =
  "Mozilla/5.0 (compatible; CartunezCatalogImporter/1.0; +https://cartunez.in)";

function parseArgs(argv = process.argv.slice(2)) {
  const options = {
    dryRun: false,
    limit: Infinity,
    skipImageCheck: false,
  };

  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === "--dry-run") options.dryRun = true;
    if (arg === "--skip-image-check") options.skipImageCheck = true;
    if (arg === "--limit" && argv[i + 1]) {
      const value = Number(argv[i + 1]);
      if (Number.isFinite(value) && value > 0) options.limit = Math.floor(value);
      i += 1;
    }
  }

  return options;
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function slugify(value) {
  return String(value || "")
    .toLowerCase()
    .trim()
    .replace(/&/g, "-and-")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function rupeesToPaise(value) {
  const amount = Number(String(value ?? "0").replace(/,/g, ""));
  return Number.isFinite(amount) && amount > 0 ? Math.round(amount * 100) : 0;
}

function decodeHtml(value) {
  return String(value || "")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;|&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">");
}

function stripHtml(value) {
  return decodeHtml(
    String(value || "")
      .replace(/<script[\s\S]*?<\/script>/gi, " ")
      .replace(/<style[\s\S]*?<\/style>/gi, " ")
      .replace(/<br\s*\/?\s*>/gi, "\n")
      .replace(/<\/p>|<\/li>|<\/div>|<\/h[1-6]>|<\/tr>/gi, "\n")
      .replace(/<[^>]+>/g, " ")
  )
    .replace(/[\t ]+/g, " ")
    .replace(/\n\s*\n+/g, "\n")
    .trim();
}

function absoluteUrl(url, baseUrl) {
  if (!url) return "";
  try {
    if (String(url).startsWith("//")) return `https:${url}`;
    return new URL(url, baseUrl).toString();
  } catch (_) {
    return "";
  }
}

async function fetchWithTimeout(url, options = {}, timeoutMs = 20000) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      ...options,
      redirect: "follow",
      signal: controller.signal,
      headers: {
        "User-Agent": USER_AGENT,
        Accept: "*/*",
        ...(options.headers || {}),
      },
    });
  } finally {
    clearTimeout(timer);
  }
}

async function fetchText(url) {
  const response = await fetchWithTimeout(url);
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.text();
}

async function fetchJson(url) {
  const response = await fetchWithTimeout(url, {
    headers: { Accept: "application/json,text/plain,*/*" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status} for ${url}`);
  return response.json();
}

async function validateImageUrl(url, skipImageCheck = false) {
  if (!/^https?:\/\//i.test(url || "")) return false;
  if (skipImageCheck) return true;

  try {
    const head = await fetchWithTimeout(url, { method: "HEAD" }, 12000);
    const type = head.headers.get("content-type") || "";
    if (head.ok && type.toLowerCase().startsWith("image/")) return true;
  } catch (_) {
    // Some CDNs reject HEAD. Fall back to a tiny ranged GET below.
  }

  try {
    const response = await fetchWithTimeout(
      url,
      { method: "GET", headers: { Range: "bytes=0-1023" } },
      15000
    );
    const type = response.headers.get("content-type") || "";
    if (response.body && typeof response.body.cancel === "function") {
      await response.body.cancel().catch(() => {});
    }
    return response.ok && type.toLowerCase().startsWith("image/");
  } catch (_) {
    return false;
  }
}

async function validateImageUrls(urls, options = {}) {
  const max = options.max || 8;
  const unique = [...new Set((urls || []).filter(Boolean))].slice(0, max);
  const valid = [];

  for (const url of unique) {
    if (await validateImageUrl(url, options.skipImageCheck)) valid.push(url);
  }

  return valid;
}

async function bootstrapMedusa() {
  process.env.LOG_LEVEL = process.env.LOG_LEVEL || "error";
  const app = express();
  const { container } = await loaders({
    directory: process.cwd(),
    expressApp: app,
    isTest: false,
  });
  return container;
}

async function ensureIndiaRegion(container, dryRun = false) {
  const regionService = container.resolve("regionService");
  const regions = await regionService.list();
  let region = regions.find(
    (item) => String(item.currency_code || "").toLowerCase() === "inr"
  );

  if (region) return region;
  if (dryRun) {
    return { id: "dry_run_india_region", name: "India", currency_code: "inr" };
  }

  console.log("Creating India / INR region...");
  region = await regionService.create({
    name: "India",
    currency_code: "inr",
    tax_rate: 0,
    payment_providers: ["manual"],
    fulfillment_providers: ["manual"],
    countries: ["in"],
  });
  return region;
}

async function getCommerceContext(container, dryRun = false) {
  const region = await ensureIndiaRegion(container, dryRun);
  if (dryRun) {
    return {
      region,
      salesChannel: { id: "dry_run_sales_channel" },
      shippingProfile: { id: "dry_run_shipping_profile" },
    };
  }

  const salesChannelService = container.resolve("salesChannelService");
  const shippingProfileService = container.resolve("shippingProfileService");
  const salesChannel = await salesChannelService.retrieveDefault();
  const shippingProfile = await shippingProfileService.retrieveDefault();

  return { region, salesChannel, shippingProfile };
}

async function getOrCreateCategory(
  container,
  { name, handle, description = "" },
  dryRun = false
) {
  const manager = container.resolve("manager");
  const productCategoryService = container.resolve("productCategoryService");
  const rows = await manager.query(
    "SELECT id, name, handle FROM product_category WHERE handle = $1 LIMIT 1",
    [handle]
  );
  if (rows.length) return rows[0];
  if (dryRun) return { id: `dry_run_${handle}`, name, handle };

  return productCategoryService.create({
    name,
    handle,
    description,
    is_active: true,
    is_internal: false,
  });
}

async function findProductByHandle(productService, handle) {
  const products = await productService.list({ handle });
  return products && products.length ? products[0] : null;
}

async function createOrUpdateProduct({
  container,
  dryRun,
  handle,
  createData,
  updateData,
}) {
  const productService = container.resolve("productService");
  const existing = await findProductByHandle(productService, handle);

  if (dryRun) {
    return {
      product: existing || { id: `dry_run_${handle}`, handle, options: [] },
      created: !existing,
    };
  }

  if (!existing) {
    const product = await productService.create(createData);
    return { product, created: true };
  }

  const product = await productService.update(existing.id, updateData);
  return { product, created: false };
}

async function getProductOptionMap(container, productId) {
  const productService = container.resolve("productService");
  const product = await productService.retrieve(productId, {
    relations: ["options", "variants"],
  });
  const optionMap = {};
  for (const option of product.options || []) optionMap[option.title] = option.id;
  return { product, optionMap };
}

async function upsertVariant({
  container,
  productId,
  sourceVariantId,
  createData,
  updateData,
  dryRun,
}) {
  const productService = container.resolve("productService");
  const productVariantService = container.resolve("productVariantService");
  const product = await productService.retrieve(productId, { relations: ["variants"] });
  const existing = (product.variants || []).find(
    (variant) => String(variant.metadata?.source_variant_id || "") === String(sourceVariantId)
  );

  if (dryRun) return { created: !existing, variant: existing || createData };

  if (existing) {
    return {
      created: false,
      variant: await productVariantService.update(existing.id, updateData),
    };
  }

  return {
    created: true,
    variant: await productVariantService.create(productId, createData),
  };
}

function normalizePcd(rawValue) {
  const raw = String(rawValue || "")
    .toLowerCase()
    .replace(/\s+/g, "")
    .replace(/×/g, "x");
  const match = raw.match(/^(\d+)x([\d.]+)(?:x([\d.]+))?$/);
  if (!match) return { display: rawValue || "", patterns: [] };

  const holes = match[1];
  const patterns = [`${holes}x${match[2]}`];
  if (match[3]) patterns.push(`${holes}x${match[3]}`);
  return {
    display: patterns.length > 1 ? patterns.join("/") : patterns[0],
    patterns,
  };
}

module.exports = {
  USER_AGENT,
  absoluteUrl,
  bootstrapMedusa,
  createOrUpdateProduct,
  decodeHtml,
  ensureIndiaRegion,
  fetchJson,
  fetchText,
  getCommerceContext,
  getOrCreateCategory,
  getProductOptionMap,
  normalizePcd,
  parseArgs,
  rupeesToPaise,
  sleep,
  slugify,
  stripHtml,
  upsertVariant,
  validateImageUrl,
  validateImageUrls,
};
