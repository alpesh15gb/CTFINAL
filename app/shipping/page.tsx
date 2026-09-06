import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping | Cartunez" };

const POINTS = [
  {
    title: "Dispatch",
    body: "In-stock accessories dispatch from Hyderabad within 1–2 business days. Custom and made-to-order fitments ship once ready — we confirm timelines on every order.",
  },
  {
    title: "Delivery timelines",
    body: "Metro cities typically receive orders in 2–4 business days; the rest of India in 4–7 business days. Alloy wheels ship in reinforced packaging and may take a day longer.",
  },
  {
    title: "Tracking",
    body: "Every shipment carries tracking. You receive the tracking link by SMS/email as soon as the order leaves our studio.",
  },
  {
    title: "Inspection",
    body: "Please inspect high-value items (wheels, stereos, lighting) at delivery and report transit damage within 48 hours with unboxing photos so we can file the claim immediately.",
  },
];

export default function ShippingPage() {
  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan-deep">
          Ownership
        </span>
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
          Shipping
        </h1>
        <div className="mt-10 space-y-6">
          {POINTS.map((p) => (
            <section key={p.title} className="rounded-xl border border-border bg-raised p-6">
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                {p.title}
              </h2>
              <p className="mt-2 leading-relaxed text-silver-muted">{p.body}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
