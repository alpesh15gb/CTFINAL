import type { Metadata } from "next";

export const metadata: Metadata = { title: "Returns | Cartunez" };

const POINTS = [
  {
    title: "7-day returns",
    body: "Unused accessories in original packaging can be returned within 7 days of delivery. Electricals and stereos must be uninstalled and unmarked.",
  },
  {
    title: "Non-returnable",
    body: "For hygiene and safety, installed PPF/ceramic jobs, cut wiring harnesses, and custom-painted or vehicle-specific machined parts cannot be returned unless defective.",
  },
  {
    title: "Defects & damage",
    body: "Dead-on-arrival or transit-damaged items are replaced or refunded. Share unboxing photos within 48 hours and we handle the courier claim.",
  },
  {
    title: "Refunds",
    body: "Approved refunds go back to the original payment method within 5–7 business days of quality check.",
  },
];

export default function ReturnsPage() {
  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan-deep">
          Ownership
        </span>
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
          Returns
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
