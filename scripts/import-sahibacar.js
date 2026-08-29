const {
  bootstrapMedusa,
  createOrUpdateProduct,
  fetchJson,
  getCommerceContext,
  getOrCreateCategory,
  getProductOptionMap,
  parseArgs,
  rupeesToPaise,
  slugify,
  stripHtml,
  upsertVariant,
  validateImageUrls,
} = require("./import-utils");

const BASE_URL = "https://www.sahibacar.in";
const PAGE_SIZE = 250;
const SOURCE = "sahibacar.in";

function productTags(product) {
  if (Array.isArray(product.tags)) return product.tags.filter(Boolean);
  return String(product.tags || "")
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);
}

function mapCategory(product) {
  const type = String(product.product_type || "").toLowerCase();
  const tags = productTags(product).join(" ").toLowerCase();
  const title = String(product.title || "").toLowerCase();
  const haystack = `${type} ${tags} ${title}`;

  const rules = [
    ["Car Speakers", /speaker|component|coaxial/],
    ["Car Amplifiers", /amplifier|\bamp\b/],
    ["Car Subwoofers", /subwoofer|woofer/],
    ["Sound Damping", /damping|deadening/],
    ["Dash Cameras", /dash\s*cam|dashcam/],
    ["Reverse Cameras", /reverse\s*camera|rear\s*camera|camera/],
    ["Ambient Lighting", /ambient\s*(light|lighting)/],
    ["Headlights", /head\s*light|headlamp/],
    ["Tail Lights", /tail\s*light|taillight/],
    ["LED Lights", /fog\s*light|led\s*light|indicator|reflector/],
    ["Android Stereos", /android|stereo|carplay|infotainment/],
    ["Wiring Harnesses", /harness/],
    ["Car Grills", /grill|grille/],
    ["Car Spoilers", /spoiler/],
    ["Body Kits", /body\s*kit|bumper|diffuser|splitter/],
    ["Floor Mats", /floor\s*mat|\bmats\b/],
    ["Seat Covers", /seat\s*cover/],
    ["Steering Covers", /steering.*cover/],
    ["Car Perfumes", /perfume|air\s*freshener|fragrance/],
    ["Sunshades", /sun\s*shade|sunshade|window\s*curtain/],
    ["Wireless Chargers", /wireless\s*charg|qi\s*charg/],
    ["Air Purifiers", /air\s*purifier|hepa/],
    ["Tyre Inflators", /tyre\s*inflator|tire\s*inflator|air\s*compressor/],
    ["OEM Parts", /\boem\b/],
  ];

  for (const [name, pattern] of rules) {
    if (pattern.test(haystack)) return name;
  }
  return "Car Accessories";
}

async function fetchAllProducts(limit) {
  const products = [];
  let page = 1;

  while (products.length < limit) {
    const data = await fetchJson(
      `${BASE_URL}/products.json?limit=${PAGE_SIZE}&page=${page}`
    );
    const batch = Array.isArray(data.products) ? data.products : [];
    if (!batch.length) break;
    products.push(...batch);
    if (batch.length < PAGE_SIZE) break;
    page += 1;
  }

  return products.slice(0, limit);
}

function sourceOptions(product) {
  const options = (product.options || [])
    .filter((option) => option && option.name)
    .filter(
      (option) =>
        String(option.name).toLowerCase() !== "title" ||
        (option.values || []).length > 1
    )
    .map((option) => ({ title: String(option.name).trim() }));

  return options.length ? options : [{ title: "Variant" }];
}

function optionValuesForVariant(product, variant, optionMap) {
  const source = (product.options || [])
    .filter((option) => option && option.name)
    .filter(
      (option) =>
        String(option.name).toLowerCase() !== "title" ||
        (option.values || []).length > 1
    );

  if (!source.length) {
    return optionMap.Variant
      ? [{ option_id: optionMap.Variant, value: "Default" }]
      : [];
  }

  return source
    .map((option, index) => {
      const optionId = optionMap[String(option.name).trim()];
      const value = variant[`option${index + 1}`];
      if (!optionId || value == null || value === "") return null;
      return { option_id: optionId, value: String(value) };
    })
    .filter(Boolean);
}

async function verifiedImages(sourceProduct, skipImageCheck) {
  const urls = (sourceProduct.images || []).map((image) => image.src).filter(Boolean);
  return validateImageUrls(urls, {
    max: Math.max(urls.length, 1),
    skipImageCheck,
  });
}

async function main() {
  const args = parseArgs();
  console.log("=== Sahiba Car live catalog import ===");
  console.log(
    `Mode: ${args.dryRun ? "DRY RUN" : "IMPORT"}; limit: ${
      Number.isFinite(args.limit) ? args.limit : "all"
    }`
  );

  const rawProducts = await fetchAllProducts(args.limit);
  console.log(`Fetched ${rawProducts.length} Shopify products from ${SOURCE}`);

  if (args.dryRun) {
    let ready = 0;
    for (const sourceProduct of rawProducts) {
      const images = await verifiedImages(sourceProduct, args.skipImageCheck);
      const variants = (sourceProduct.variants || []).filter(
        (variant) => rupeesToPaise(variant.price) > 0
      );
      if (!images.length || !variants.length) continue;
      ready += 1;
      console.log(
        `[OK] ${sourceProduct.title} | ${mapCategory(sourceProduct)} | ${variants.length} variants | ${images.length}/${(sourceProduct.images || []).length} images | ₹${sourceProduct.variants[0]?.price || "0"}`
      );
    }
    console.log(`Dry-run ready products: ${ready}/${rawProducts.length}`);
    return;
  }

  const container = await bootstrapMedusa();
  const { region, salesChannel, shippingProfile } = await getCommerceContext(
    container,
    false
  );

  let createdProducts = 0;
  let updatedProducts = 0;
  let createdVariants = 0;
  let updatedVariants = 0;
  let skipped = 0;
  let errors = 0;

  for (const sourceProduct of rawProducts) {
    try {
      const variants = (sourceProduct.variants || []).filter(
        (variant) => rupeesToPaise(variant.price) > 0
      );
      if (!variants.length) {
        console.log(`[SKIP] no priced variants: ${sourceProduct.title}`);
        skipped += 1;
        continue;
      }

      const images = await verifiedImages(sourceProduct, args.skipImageCheck);
      if (!images.length) {
        console.log(`[SKIP] no verified source images: ${sourceProduct.title}`);
        skipped += 1;
        continue;
      }

      const categoryName = mapCategory(sourceProduct);
      const categoryHandle = slugify(categoryName);
      const category = await getOrCreateCategory(
        container,
        {
          name: categoryName,
          handle: categoryHandle,
          description: `${categoryName} imported from Sahiba Car.`,
        },
        false
      );

      const handle = String(sourceProduct.handle || slugify(sourceProduct.title));
      const metadata = {
        source: SOURCE,
        source_product_id: String(sourceProduct.id),
        source_url: `${BASE_URL}/products/${sourceProduct.handle}`,
        brand: sourceProduct.vendor || "Sahiba Car",
        category: categoryName,
        category_slug: categoryHandle,
        tags: productTags(sourceProduct),
        in_stock: variants.some((variant) => variant.available !== false),
        source_image_urls: images,
      };

      const commonProductData = {
        title: sourceProduct.title,
        description: stripHtml(sourceProduct.body_html || "").slice(0, 4000),
        thumbnail: images[0],
        images,
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
          options: sourceOptions(sourceProduct),
        },
        updateData: commonProductData,
      });

      if (result.created) createdProducts += 1;
      else updatedProducts += 1;

      const { optionMap } = await getProductOptionMap(
        container,
        result.product.id
      );

      for (const sourceVariant of variants) {
        const price = rupeesToPaise(sourceVariant.price);
        const compareAtPrice = rupeesToPaise(sourceVariant.compare_at_price);
        const variantMetadata = {
          source: SOURCE,
          source_variant_id: String(sourceVariant.id),
          source_sku: sourceVariant.sku || null,
          compare_at_price: compareAtPrice || null,
          available: sourceVariant.available !== false,
          source_image_id: sourceVariant.featured_image?.id
            ? String(sourceVariant.featured_image.id)
            : null,
        };
        const optionValues = optionValuesForVariant(
          sourceProduct,
          sourceVariant,
          optionMap
        );
        const variantTitle =
          sourceVariant.title && sourceVariant.title !== "Default Title"
            ? sourceVariant.title
            : "Default";
        const priceData = [
          {
            currency_code: "inr",
            amount: price,
            region_id: region.id,
          },
        ];
        const variantResult = await upsertVariant({
          container,
          productId: result.product.id,
          sourceVariantId: sourceVariant.id,
          dryRun: false,
          createData: {
            title: variantTitle,
            sku: `SAHIBA-${sourceVariant.id}`,
            prices: priceData,
            options: optionValues,
            inventory_quantity: 10,
            manage_inventory: false,
            allow_backorder: false,
            metadata: variantMetadata,
          },
          updateData: {
            title: variantTitle,
            prices: priceData,
            options: optionValues,
            manage_inventory: false,
            allow_backorder: false,
            metadata: variantMetadata,
          },
        });
        if (variantResult.created) createdVariants += 1;
        else updatedVariants += 1;
      }

      console.log(
        `[${result.created ? "CREATE" : "UPDATE"}] ${sourceProduct.title} | ${variants.length} variants | ${images.length}/${(sourceProduct.images || []).length} images`
      );
    } catch (error) {
      errors += 1;
      console.error(`[ERROR] ${sourceProduct.title}: ${error.message}`);
    }
  }

  console.log("=== Sahiba Car import complete ===");
  console.log({
    createdProducts,
    updatedProducts,
    createdVariants,
    updatedVariants,
    skipped,
    errors,
  });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
