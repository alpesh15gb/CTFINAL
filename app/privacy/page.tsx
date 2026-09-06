import type { Metadata } from "next";

export const metadata: Metadata = { title: "Privacy Policy | Cartunez" };

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan-deep">
          Legal
        </span>
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
          Privacy Policy
        </h1>
        <div className="mt-10 space-y-6 leading-relaxed text-silver-muted">
          <p>
            Cartunez collects only what it needs to run the store: contact
            details, vehicle fitment selections, order history, and basic
            analytics. We never sell personal data.
          </p>
          <p>
            Payments are processed by our payment providers — card and UPI
            credentials never touch our servers. Support conversations over
            phone, email, or Instagram are used solely to fulfil orders and
            improve fitment guidance.
          </p>
          <p>
            To access, correct, or delete your data, write to us via the
            contact page. Marketing messages are opt-in and every message
            carries an opt-out.
          </p>
        </div>
      </div>
    </main>
  );
}
