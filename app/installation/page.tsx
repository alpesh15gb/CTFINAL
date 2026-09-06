import type { Metadata } from "next";

export const metadata: Metadata = { title: "Installation | Cartunez" };

const POINTS = [
  {
    title: "Studio installation",
    body: "Stereos, speakers, lighting, and wheels bought from us can be installed at our Hyderabad studio by trained technicians — calibrated, torqued, and road-tested.",
  },
  {
    title: "What to book",
    body: "Alloys need balancing and alignment; audio needs DSP tuning; cameras need calibration. Mention your vehicle variant while ordering so we prep the right harnesses and rings.",
  },
  {
    title: "Warranty on workmanship",
    body: "Studio installations carry workmanship warranty. If anything we fitted rattles, leaks, or throws an error, bring it back and we fix it free.",
  },
  {
    title: "DIY & outstation",
    body: "Outstation orders ship with fitment notes and phone support. Electrical work outside our studio should be done by a qualified installer to keep product warranty valid.",
  },
];

export default function InstallationPage() {
  return (
    <main className="min-h-screen bg-background pb-24 pt-28">
      <div className="mx-auto max-w-4xl px-4 md:px-8">
        <span className="mb-3 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-cyan-deep">
          Ownership
        </span>
        <h1 className="font-display text-5xl font-bold uppercase tracking-tight text-foreground md:text-6xl">
          Installation
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
