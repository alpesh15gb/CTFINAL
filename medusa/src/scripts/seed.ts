import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createInventoryLevelsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  uploadFilesWorkflow,
} from "@medusajs/medusa/core-flows"
import { readFile } from "fs/promises"
import path from "path"

const UPLOAD_DIR = path.join(process.cwd(), "uploads-seed")

type SeedProduct = {
  title: string
  handle: string
  category: string
  description: string
  sku: string
  price: number
  images: string[]
}

const CATEGORIES = [
  { name: "Audio & Infotainment", handle: "audio-infotainment" },
  { name: "Comfort & Cabin", handle: "comfort-cabin" },
  { name: "Lighting & Exterior", handle: "lighting-exterior" },
  { name: "Wheels", handle: "wheels" },
  { name: "Performance", handle: "performance" },
]

const PRODUCTS: SeedProduct[] = [
  {
    title: "Stage 2 Speaker Upgrade Package",
    handle: "stage-2-speaker-upgrade",
    category: "audio-infotainment",
    description:
      "Component speakers up front, coaxials in the rear, sound deadening on all four doors. Tuned in-house for your cabin.",
    sku: "CTZ-AUD-STAGE2",
    price: 24999,
    images: ["speaker.webp", "audio.webp"],
  },
  {
    title: "10.1\" Android Infotainment Screen",
    handle: "android-infotainment-screen-10",
    category: "audio-infotainment",
    description:
      "QLED Android head unit with wireless CarPlay and Android Auto, 4GB RAM, steering-control integration, reverse camera input.",
    sku: "CTZ-AUD-ANDROID10",
    price: 18499,
    images: ["infotainment.webp"],
  },
  {
    title: "DSP Amplifier — 6 Channel",
    handle: "dsp-amplifier-6ch",
    category: "audio-infotainment",
    description:
      "6-channel DSP amp with 31-band EQ per channel, time alignment and active crossover. The brain of a serious system.",
    sku: "CTZ-AUD-DSP6",
    price: 21999,
    images: ["audio.webp"],
  },
  {
    title: "Compact Under-Seat Subwoofer",
    handle: "under-seat-subwoofer",
    category: "audio-infotainment",
    description:
      "Powered 8-inch slim sub that hides under the seat and fills in everything the door speakers can't reach.",
    sku: "CTZ-AUD-SUB8",
    price: 12999,
    images: ["speaker.webp"],
  },
  {
    title: "Dual-Channel Dashcam (Front + Rear)",
    handle: "dual-channel-dashcam",
    category: "audio-infotainment",
    description:
      "2K front and 1080p rear recording, parking surveillance, hardwired install with hidden cabling.",
    sku: "CTZ-AUD-DASH2",
    price: 9499,
    images: ["infotainment.webp"],
  },
  {
    title: "7D Precision Floor Mats",
    handle: "7d-floor-mats",
    category: "comfort-cabin",
    description:
      "Laser-measured mats with raised edges, anti-slip base and double-layer protection. Cut for your exact variant.",
    sku: "CTZ-COM-MAT7D",
    price: 6999,
    images: ["upholstery.webp"],
  },
  {
    title: "Nappa Leather Seat Upholstery",
    handle: "nappa-leather-upholstery",
    category: "comfort-cabin",
    description:
      "Full-cabin Nappa retrim with your choice of stitch pattern and thread colour. Foam corrected, airbags respected.",
    sku: "CTZ-COM-NAPPA",
    price: 34999,
    images: ["upholstery-detail.webp", "upholstery.webp"],
  },
  {
    title: "Magnetic Climate Sunshades (Set of 4)",
    handle: "magnetic-sunshades",
    category: "comfort-cabin",
    description:
      "Frame-matched magnetic shades that cut cabin heat without killing visibility. Two-second fit, no clips.",
    sku: "CTZ-COM-SHADE4",
    price: 3499,
    images: ["interior.webp"],
  },
  {
    title: "Memory Foam Lumbar Cushion",
    handle: "lumbar-cushion",
    category: "comfort-cabin",
    description:
      "Orthopaedic lumbar support shaped for long Hyderabad commutes. Breathable mesh, adjustable strap.",
    sku: "CTZ-COM-LUMBAR",
    price: 1999,
    images: ["upholstery.webp"],
  },
  {
    title: "Ambient LED Cabin Kit — 64 Colour",
    handle: "ambient-led-kit-64",
    category: "lighting-exterior",
    description:
      "App-controlled 64-colour ambient lighting for dash, doors and footwells, with music sync. Invisible install, OEM-level routing.",
    sku: "CTZ-LGT-AMB64",
    price: 8999,
    images: ["interior.webp", "lighting.webp"],
  },
  {
    title: "LED Projector Headlight Upgrade",
    handle: "led-projector-headlights",
    category: "lighting-exterior",
    description:
      "Bi-LED projector retrofit with proper cut-off, DRL integration and aimed on our alignment rig. See more, dazzle less.",
    sku: "CTZ-LGT-PROJ",
    price: 27999,
    images: ["headlight.webp"],
  },
  {
    title: "17\" Performance Alloy Wheels (Set of 4)",
    handle: "performance-alloys-17",
    category: "wheels",
    description:
      "Flow-formed 17-inch alloys, weight-optimised and hub-centric for your car. Includes fitting, balancing and alignment check.",
    sku: "CTZ-WHL-17FF",
    price: 48999,
    images: ["wheel.webp", "wheels.webp"],
  },
  {
    title: "Stage 1 ECU Remap",
    handle: "stage-1-ecu-remap",
    category: "performance",
    description:
      "Conservative daily-drivable tune on stock hardware. Dyno-backed maps, stock file archived, before/after logs shared.",
    sku: "CTZ-PRF-ECU1",
    price: 19999,
    images: ["ecu.webp", "engine.webp"],
  },
  {
    title: "Performance Air Intake Kit",
    handle: "performance-intake",
    category: "performance",
    description:
      "High-flow intake with heat-shielded filter housing. Sharper throttle response, honest induction note.",
    sku: "CTZ-PRF-INTAKE",
    price: 7499,
    images: ["engine.webp"],
  },
]

export default async function seedCartunez({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(Modules.FULFILLMENT)
  const paymentModuleService = container.resolve(Modules.PAYMENT)

  // Idempotency guard: if our sales channel exists, the seed has already run.
  const { data: existingChannels } = await query.graph({
    entity: "sales_channel",
    fields: ["id", "name"],
    filters: { name: "Cartunez Storefront" },
  })
  if (existingChannels.length > 0) {
    logger.info("Cartunez seed already applied, skipping.")
    return
  }

  logger.info("Uploading product images...")
  const uploadedUrls = new Map<string, string>()
  const imageNames = [...new Set(PRODUCTS.flatMap((p) => p.images))]
  for (const name of imageNames) {
    const filePath = path.join(UPLOAD_DIR, name)
    try {
      const content = await readFile(filePath)
      const { result } = await uploadFilesWorkflow(container).run({
        input: {
          files: [
            {
              filename: name,
              mimeType: "image/webp",
              content: content.toString("base64"),
              access: "public",
            },
          ],
        },
      })
      uploadedUrls.set(name, result[0].url)
    } catch {
      logger.warn(`Image ${name} not found in uploads-seed, skipping.`)
    }
  }
  const img = (name: string) =>
    uploadedUrls.has(name) ? [{ url: uploadedUrls.get(name)! }] : []

  logger.info("Seeding sales channel + API key...")
  const {
    result: [salesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        { name: "Cartunez Storefront", description: "cartunez.in web store" },
      ],
    },
  })

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        {
          title: "Cartunez Web Store",
          type: "publishable",
          created_by: "",
        },
      ],
    },
  })

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [salesChannel.id] },
  })

  await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Cartunez",
          supported_currencies: [{ currency_code: "inr", is_default: true }],
          default_sales_channel_id: salesChannel.id,
        },
      ],
    },
  })

  logger.info("Seeding region...")
  const paymentProviders = (
    await paymentModuleService.listPaymentProviders({})
  ).map((p) => p.id)
  const razorpayProvider = paymentProviders.find((id) =>
    id.includes("razorpay")
  )
  const regionProviders = [
    "pp_system_default",
    ...(razorpayProvider ? [razorpayProvider] : []),
  ]
  logger.info(`Region payment providers: ${regionProviders.join(", ")}`)

  const {
    result: [region],
  } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "India",
          currency_code: "inr",
          countries: ["in"],
          payment_providers: regionProviders,
        },
      ],
    },
  })

  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "in", provider_id: "tp_system" }],
  })

  logger.info("Seeding stock location + fulfillment...")
  const {
    result: [stockLocation],
  } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Cartunez Studio — S.P. Road",
          address: {
            address_1: "Shop 12 & 13, Veer Hanuman Temple, S.P. Road",
            city: "Secunderabad",
            province: "Telangana",
            postal_code: "500003",
            country_code: "in",
          },
        },
      ],
    },
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  const { data: shippingProfileResult } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  const shippingProfile = shippingProfileResult[0]

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Cartunez delivery",
    type: "shipping",
    service_zones: [
      {
        name: "India",
        geo_zones: [{ country_code: "in", type: "country" }],
      },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Studio Installation (Free)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Install at Studio",
          description: "Get it fitted at our S.P. Road studio, free.",
          code: "studio-install",
        },
        prices: [
          { currency_code: "inr", amount: 0 },
          { region_id: region.id, amount: 0 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
      {
        name: "Pan-India Courier",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfile.id,
        type: {
          label: "Courier",
          description: "Insured courier, 3-5 working days.",
          code: "courier",
        },
        prices: [
          { currency_code: "inr", amount: 499 },
          { region_id: region.id, amount: 499 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [salesChannel.id] },
  })

  logger.info("Seeding categories + products...")
  const { result: categoryResult } = await createProductCategoriesWorkflow(
    container
  ).run({
    input: {
      product_categories: CATEGORIES.map((c) => ({
        name: c.name,
        handle: c.handle,
        is_active: true,
      })),
    },
  })

  await createProductsWorkflow(container).run({
    input: {
      products: PRODUCTS.map((p) => ({
        title: p.title,
        handle: p.handle,
        description: p.description,
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: shippingProfile.id,
        category_ids: [
          categoryResult.find((c) => c.handle === p.category)!.id,
        ],
        images: p.images.flatMap((name) => img(name)),
        options: [{ title: "Package", values: ["Standard"] }],
        variants: [
          {
            title: "Standard",
            sku: p.sku,
            manage_inventory: false,
            options: { Package: "Standard" },
            prices: [{ amount: p.price, currency_code: "inr" }],
          },
        ],
        sales_channels: [{ id: salesChannel.id }],
      })),
    },
  })

  logger.info("Seeding inventory levels...")
  const { data: inventoryItems } = await query.graph({
    entity: "inventory_item",
    fields: ["id"],
  })
  if (inventoryItems.length > 0) {
    await createInventoryLevelsWorkflow(container).run({
      input: {
        inventory_levels: inventoryItems.map((item) => ({
          location_id: stockLocation.id,
          stocked_quantity: 100,
          inventory_item_id: item.id,
        })),
      },
    })
  }

  logger.info("============================================")
  logger.info(`Cartunez seed complete.`)
  logger.info(`Publishable API key: ${publishableApiKey.token}`)
  logger.info(`Sales channel: ${salesChannel.id}`)
  logger.info(`Region: ${region.id} (INR)`)
  logger.info("============================================")
}
