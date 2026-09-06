import type { Metadata } from "next";

export const metadata: Metadata = { title: "FAQs | Cartunez" };

const FAQS = [
  {
    q: "Will these wheels fit my car?",
    a: "Use the vehicle selector on the homepage or the “Fits my car” filter in the shop. Wheels are matched on exact PCD, size, and offset from official specifications — never just diameter.",
  },
  {
    q: "Do Android stereos support my steering controls?",
    a: "Most listings include the required CANbus/harness for popular models. Check the product’s compatibility notes or talk to an expert before ordering.",
  },
  {
    q: "Is installation included in the price?",
    a: "Product prices are for the hardware. Studio installation is quoted per job depending on the vehicle and the upgrade — contact us for an exact figure.",
  },
  {
    q: "How do I track my order?",
    a: "Tracking links go out by SMS/email at dispatch. For any delay beyond the stated window, reply to your order email and we trace it the same day.",
  },
  {
    q: "What if my item arrives damaged?",
    a: "Share unboxing photos within 48 hours. We replace or refund defective and transit-damaged items and handle the courier claim ourselves.",
  },
];

export default function FaqsPage() {
  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan-deep">
          Ownership
        </span>
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
          FAQs
        </h1>
        <div className="mt-10 space-y-6">
          {FAQS.map((f) => (
            <section key={f.q} className="rounded-xl border border-border bg-raised p-6">
              <h2 className="font-display text-xl font-bold uppercase tracking-tight text-foreground">
                {f.q}
              </h2>
              <p className="mt-2 leading-relaxed text-silver-muted">{f.a}</p>
            </section>
          ))}
        </div>
      </div>
    </main>
  );
}
