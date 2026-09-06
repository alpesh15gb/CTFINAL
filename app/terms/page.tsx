import type { Metadata } from "next";

export const metadata: Metadata = { title: "Terms of Service | Cartunez" };

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan-deep">
          Legal
        </span>
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
          Terms of Service
        </h1>
        <div className="mt-10 space-y-6 leading-relaxed text-silver-muted">
          <p>
            All products are sold for the fitments stated on their pages.
            Fitment guidance is advisory — confirm PCD, size, and electrical
            compatibility for your exact vehicle variant before ordering.
          </p>
          <p>
            Prices and availability may change without notice. Orders are
            confirmed on payment; custom and made-to-order items cannot be
            cancelled once work has begun.
          </p>
          <p>
            Product warranties are provided by the respective brands and are
            voided by unauthorized modification or incorrect installation.
            Studio installations carry separate workmanship warranty as stated
            on the installation page.
          </p>
        </div>
      </div>
    </main>
  );
}
