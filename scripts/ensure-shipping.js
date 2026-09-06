// Ensures manual (COD-eligible) shipping options exist in the India/INR region.
// Run on the server after the catalog imports:
//   npm run ensure:shipping
//
// Creates (idempotently, matched by name):
//   - "Standard Shipping" flat ₹99
//   - "Free Shipping" flat ₹0, eligible only when cart subtotal >= ₹5,000
// Both ride the `manual` fulfillment provider, matching the manual payment
// provider used for Cash on Delivery at checkout.

const { bootstrapMedusa } = require("./import-utils");

const OPTIONS = [
  { name: "Standard Shipping", amount: 9900, requirements: [] },
  {
    name: "Free Shipping",
    amount: 0,
    requirements: [{ type: "min_subtotal", amount: 500000 }],
  },
];

async function main() {
  const container = await bootstrapMedusa();
  const regionService = container.resolve("regionService");
  const regions = await regionService.list();
  const region = regions.find(
    (r) => String(r.currency_code || "").toLowerCase() === "inr"
  );
  if (!region) {
    throw new Error("INR region not found — run the catalog imports first.");
  }

  const shippingProfileService = container.resolve("shippingProfileService");
  const profile = await shippingProfileService.retrieveDefault();
  const optionService = container.resolve("shippingOptionService");
  const existing = await optionService.list({ region_id: region.id });

  for (const opt of OPTIONS) {
    const found = existing.find(
      (o) => o.name === opt.name && o.is_return !== true
    );
    if (found) {
      console.log(`[OK] ${opt.name} (${found.id})`);
      continue;
    }
    const created = await optionService.create({
      name: opt.name,
      region_id: region.id,
      profile_id: profile.id,
      provider_id: "manual",
      price_type: "flat_rate",
      amount: opt.amount,
      requirements: opt.requirements,
      admin_only: false,
      metadata: { cod_eligible: true },
    });
    console.log(`[CREATE] ${opt.name} (${created.id})`);
  }

  console.log("=== Shipping options ensured ===");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
