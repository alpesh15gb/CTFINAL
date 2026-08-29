const cheerio = require("cheerio");
const {
  absoluteUrl,
  bootstrapMedusa,
  createOrUpdateProduct,
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
  validateImageUrls,
} = require("./import-utils");

const BASE_URL = "https://www.neowheels.com";
const SOURCE = "neowheels.com";
const CATEGORY_NAME = "Wheels";
const CATEGORY_HANDLE = "wheels";
const REQUEST_DELAY_MS = 300;

const STOREFRONT_VEHICLES = [
  {
    make: "hyundai",
    model: "creta",
    slugs: ["hyundai-creta-2026-sxo", "hyundai-creta-2025-sx"],
  },
  {
    make: "kia",
    model: "seltos",
    slugs: ["kia-seltos-2026-gtxplus"],
  },
  {
    make: "tata",
    model: "harrier",
    slugs: ["tata-harrier-2026-xzaplus"],
  },
  {
    make: "mahindra",
    model: "xuv700",
    slugs: ["mahindra-xuv700-2026-ax7l"],
  },
];

function compact(value) {
  return String(value || "").replace(/\s+/g, " ").trim();
}

function parseMoney(text) {
  const values = [...String(text || "").matchAll(/(?:INR|₹)\s*([\d,]+)/gi)].map(
    (match) => Number(match[1].replace(/,/g, ""))
  );
  const positive = values.filter((value) => Number.isFinite(value) && value > 0);
  return {
    salePrice: positive[0] || 0,
    mrp: positive[1] || positive[0] || 0,
  };
}

function labelFromHeading($, label) {
  let value = "";
  $("h1,h2,h3,h4,h5,h6,th,td,li,p,div").each((_, element) => {
    if (value) return;
    const text = compact($(element).text());
    const match = text.match(new RegExp(`^${label}\\s*:\\s*(.+)$`, "i"));
    if (match) value = compact(match[1]);
  });
  return value;
}

function extractSpec(fullText, label) {
  const expression = new RegExp(`${label}\\s*:?\\s*([\\d.+-]+)`, "i");
  const match = fullText.match(expression);
  return match ? compact(match[1]) : "";
}

function variantCardText($, anchor) {
  let node = $(anchor);
  for (let depth = 0; depth < 8 && node.length; depth += 1) {
    const text = compact(node.text());
    if (/(?:INR|₹)\s*[\d,]+/i.test(text) && /PCD\s*:/i.test(text)) {
      return text;
    }
    node = node.parent();
  }
  return compact($(anchor).parent().text());
}

async function getDesignSlugs() {
  const candidates = ["/catalog/product", "/product"];
  for (const path of candidates) {
    try {
      const html = await fetchText(`${BASE_URL}${path}`);
      const $ = cheerio.load(html);
      const slugs = new Set();
      $('a[href*="/catalog/product/"],a[href^="/product/"]').each((_, element) => {
        const href = $(element).attr("href") || "";
        let match = href.match(/\/catalog\/product\/([^/?#]+)/i);
        if (!match) match = href.match(/^\/product\/([^/?#]+)\/?$/i);
        if (match && match[1] && match[1] !== "product") slugs.add(match[1]);
      });
      if (slugs.size) return [...slugs];
    } catch (error) {
      console.warn(`Neo design listing failed at ${path}: ${error.message}`);
    }
  }
  throw new Error("Could not discover Neo Wheels design pages");
}

async function getVariantCards(designSlug) {
  const candidates = [
    `${BASE_URL}/catalog/product/${designSlug}`,
    `${BASE_URL}/product/${designSlug}`,
  ];

  for (const pageUrl of candidates) {
    try {
      const html = await fetchText(pageUrl);
      const $ = cheerio.load(html);
      const variants = new Map();
      $(`a[href*="/catalog/${designSlug}/"],a[href*="/${designSlug}/"]`).each(
        (_, element) => {
          const href = $(element).attr("href") || "";
          const url = absoluteUrl(href, BASE_URL);
          if (!url) return;
          const pathname = new URL(url).pathname;
          const match = pathname.match(
            new RegExp(`/catalog/${designSlug}/([^/?#]+)$`, "i")
          );
          if (!match) return;
          const text = variantCardText($, element);
          const money = parseMoney(text);
          const previous = variants.get(url) || {};
          variants.set(url, {
            url,
            variantSlug: match[1],
            salePrice: money.salePrice || previous.salePrice || 0,
            mrp: money.mrp || previous.mrp || 0,
          });
        }
      );
      if (variants.size) return [...variants.values()];
    } catch (error) {
      console.warn(`Neo design page failed ${pageUrl}: ${error.message}`);
    }
  }
  return [];
}

function parseCompatibleCars($) {
  const cars = [];
  $('a[href*="/car/"]').each((_, element) => {
    const href = $(element).attr("href") || "";
    const match = href.match(/\/car\/([^/?#]+)/i);
    if (!match) return;
    const slug = match[1].toLowerCase();
    const ownText = compact($(element).text());
    const parentText = compact($(element).closest("li,div,a").text());
    const label = ownText || parentText || slug.replace(/-/g, " ");
    if (!cars.some((car) => car.slug === slug)) cars.push({ slug, label });
  });
  return cars;
}

function mapOfficialCompatibility(cars) {
  const mapped = new Set();
  for (const car of cars) {
    const normalized = slugify(`${car.slug} ${car.label}`).replace(/-/g, " ");
    for (const vehicle of STOREFRONT_VEHICLES) {
      const makeMatches = normalized.includes(vehicle.make);
      const modelCompact = vehicle.model.replace(/[^a-z0-9]/g, "");
      const normalizedCompact = normalized.replace(/[^a-z0-9]/g, "");
      const modelMatches = normalizedCompact.includes(modelCompact);
      if (makeMatches && modelMatches) {
        vehicle.slugs.forEach((slug) => mapped.add(slug));
      }
    }
  }
  return [...mapped];
}

async function parseVariantPage(designSlug, card, skipImageCheck) {
  const html = await fetchText(card.url);
  const $ = cheerio.load(html);
  const title = compact($("h1").first().text());
  const bodyText = compact($("body").text());

  const design = labelFromHeading($, "Design") || designSlug.replace(/-/g, " ");
  const size = labelFromHeading($, "Size") || (title.match(/^(\d+(?:\.\d+)?x\d+(?:\.\d+)?)/i)?.[1] || "");
  const rawPcd = labelFromHeading($, "PCD") || (title.match(/\b([456]\s*x\s*[\d.]+(?:\s*x\s*[\d.]+)?)\b/i)?.[1] || "");
  const finish = labelFromHeading($, "Finish") || "";
  const pcd = normalizePcd(rawPcd);
  const offset = extractSpec(bodyText, "OFFSET");
  const centerBore = extractSpec(bodyText, "BORE\\s*SIZE");
  const compatibleCars = parseCompatibleCars($);
  const compatibility = mapOfficialCompatibility(compatibleCars);

  const imageCandidates = [];
  $("img").each((_, image) => {
    const src = $(image).attr("src") || $(image).attr("data-src") || "";
    const alt = compact($(image).attr("alt"));
    if (/Upload\/product/i.test(src) || (title && alt.toLowerCase() === title.toLowerCase())) {
      const absolute = absoluteUrl(src, BASE_URL);
      if (absolute) imageCandidates.push(absolute);
    }
  });
  const images = await validateImageUrls(imageCandidates, {
    max: 8,
    skipImageCheck,
  });

  const description =
    compact($("meta[name='description']").attr("content")) ||
    `${title}. Neo Wheels alloy wheel with ${size || "listed"} size and ${pcd.display || rawPcd || "listed"} PCD.`;

  return {
    ...card,
    title,
    design: compact(design),
    size: compact(size),
    pcd,
    finish: compact(finish),
    offset,
    centerBore,
    compatibleCars,
    compatibility,
    images,
    description: stripHtml(description).slice(0, 4000),
  };
}

function featureList(wheel) {
  return [
    wheel.size ? `Wheel size: ${wheel.size}` : null,
    wheel.pcd.display ? `PCD: ${wheel.pcd.display}` : null,
    wheel.offset ? `Offset: ${wheel.offset}` : null,
    wheel.centerBore ? `Center bore: ${wheel.centerBore}` : null,
    wheel.finish ? `Finish: ${wheel.finish}` : null,
    "Neo Wheels official specification",
  ].filter(Boolean);
}

async function collectWheels(limit, skipImageCheck) {
  const designs = await getDesignSlugs();
  console.log(`Discovered ${designs.length} Neo wheel designs`);
  const wheels = [];

  for (const designSlug of designs) {
    if (wheels.length >= limit) break;
    const cards = await getVariantCards(designSlug);
    console.log(`${designSlug}: ${cards.length} exact specifications`);

    for (const card of cards) {
      if (wheels.length >= limit) break;
      try {
        const wheel = await parseVariantPage(
          designSlug,
          card,
          skipImageCheck
        );
        if (!wheel.title || !wheel.pcd.patterns.length) {
          console.log(`[SKIP] incomplete PCD specification: ${card.url}`);
        } else if (!wheel.salePrice) {
          console.log(`[SKIP] no sale price: ${wheel.title}`);
        } else if (!wheel.images.length) {
          console.log(`[SKIP] no verified official image: ${wheel.title}`);
        } else {
          wheels.push(wheel);
        }
      } catch (error) {
        console.error(`[ERROR] ${card.url}: ${error.message}`);
      }
      await sleep(REQUEST_DELAY_MS);
    }
  }

  return wheels;
}

async function main() {
  const args = parseArgs();
  console.log("=== Neo Wheels exact-spec live import ===");
  console.log(
    `Mode: ${args.dryRun ? "DRY RUN" : "IMPORT"}; limit: ${
      Number.isFinite(args.limit) ? args.limit : "all"
    }`
  );

  const wheels = await collectWheels(args.limit, args.skipImageCheck);
  console.log(`Validated ${wheels.length} exact Neo wheel specifications`);

  if (args.dryRun) {
    for (const wheel of wheels) {
      console.log(
        `[OK] ${wheel.title} | PCD ${wheel.pcd.display} | offset ${wheel.offset || "n/a"} | bore ${wheel.centerBore || "n/a"} | ₹${wheel.salePrice} | cars ${wheel.compatibleCars.length} | images ${wheel.images.length}`
      );
    }
    return;
  }

  const container = await bootstrapMedusa();
  const { region, salesChannel, shippingProfile } = await getCommerceContext(
    container,
    false
  );
  const category = await getOrCreateCategory(
    container,
    {
      name: CATEGORY_NAME,
      handle: CATEGORY_HANDLE,
      description: "Neo Wheels alloy wheels with exact PCD and fitment specifications.",
    },
    false
  );

  let createdProducts = 0;
  let updatedProducts = 0;
  let createdVariants = 0;
  let updatedVariants = 0;
  let errors = 0;

  for (const wheel of wheels) {
    try {
      const sourceVariantId = new URL(wheel.url).pathname;
      const handle = `neowheels-${slugify(`${wheel.design}-${wheel.variantSlug}`)}`;
      const features = featureList(wheel);
      const metadata = {
        source: SOURCE,
        source_variant_id: sourceVariantId,
        source_url: wheel.url,
        source_image_urls: wheel.images,
        brand: "Neo Wheels",
        category: CATEGORY_NAME,
        category_slug: CATEGORY_HANDLE,
        design: wheel.design,
        size: wheel.size,
        pcd: wheel.pcd.display,
        pcd_patterns: wheel.pcd.patterns,
        finish: wheel.finish,
        offset: wheel.offset || null,
        center_bore: wheel.centerBore || null,
        neo_compatible_cars: wheel.compatibleCars.map((car) => car.label),
        neo_compatible_car_slugs: wheel.compatibleCars.map((car) => car.slug),
        compatibility: wheel.compatibility,
        compatibility_basis: "neo_official_model_match",
        features,
        in_stock: true,
        mrp: rupeesToPaise(wheel.mrp || wheel.salePrice),
      };

      const commonProductData = {
        title: `Neo Wheels ${wheel.title}`,
        description: wheel.description,
        thumbnail: wheel.images[0],
        images: wheel.images,
        metadata,
        status: "published",
        discountable: true,
        categories: [{ id: category.id }],
        sales_channels: [{ id: salesChannel.id }],
      };

      const result = await createOrUpdateProduct({
        container,
        dryRun: false,
        handle,
        createData: {
          ...commonProductData,
          handle,
          is_giftcard: false,
          profile_id: shippingProfile.id,
          options: [{ title: "Specification" }],
        },
        updateData: commonProductData,
      });
      if (result.created) createdProducts += 1;
      else updatedProducts += 1;

      const { optionMap } = await getProductOptionMap(
        container,
        result.product.id
      );
      const priceData = [
        {
          currency_code: "inr",
          amount: rupeesToPaise(wheel.salePrice),
          region_id: region.id,
        },
      ];
      const variantMetadata = {
        source: SOURCE,
        source_variant_id: sourceVariantId,
        pcd: wheel.pcd.display,
        pcd_patterns: wheel.pcd.patterns,
        size: wheel.size,
        finish: wheel.finish,
        offset: wheel.offset || null,
        center_bore: wheel.centerBore || null,
        mrp: rupeesToPaise(wheel.mrp || wheel.salePrice),
        source_url: wheel.url,
      };
      const optionValues = optionMap.Specification
        ? [
            {
              option_id: optionMap.Specification,
              value: `${wheel.size} | ${wheel.pcd.display} | ${wheel.finish}`,
            },
          ]
        : [];

      const variantResult = await upsertVariant({
        container,
        productId: result.product.id,
        sourceVariantId,
        dryRun: false,
        createData: {
          title: `${wheel.size} ${wheel.pcd.display} ${wheel.finish}`.trim(),
          sku: `NEO-${slugify(`${wheel.design}-${wheel.variantSlug}`)
            .toUpperCase()
            .slice(0, 120)}`,
          prices: priceData,
          options: optionValues,
          inventory_quantity: 10,
          manage_inventory: false,
          allow_backorder: false,
          metadata: variantMetadata,
        },
        updateData: {
          title: `${wheel.size} ${wheel.pcd.display} ${wheel.finish}`.trim(),
          prices: priceData,
          options: optionValues,
          manage_inventory: false,
          allow_backorder: false,
          metadata: variantMetadata,
        },
      });
      if (variantResult.created) createdVariants += 1;
      else updatedVariants += 1;

      console.log(
        `[${result.created ? "CREATE" : "UPDATE"}] ${wheel.title} | PCD ${wheel.pcd.display} | ₹${wheel.salePrice} | ${wheel.compatibility.length} storefront vehicle matches`
      );
    } catch (error) {
      errors += 1;
      console.error(`[ERROR] ${wheel.title}: ${error.message}`);
    }
  }

  console.log("=== Neo Wheels import complete ===");
  console.log({
    createdProducts,
    updatedProducts,
    createdVariants,
    updatedVariants,
    errors,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
