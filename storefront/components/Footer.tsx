import Link from "next/link"

const WA = `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "919949695030"}`

const COLS: { title: string; links: { label: string; href: string; external?: boolean }[] }[] = [
  {
    title: "Main pages",
    links: [
      { label: "Home", href: "/" },
      { label: "Shop", href: "/shop" },
      { label: "Build list", href: "/cart" },
      { label: "Packages", href: "/#packages" },
    ],
  },
  {
    title: "Studio",
    links: [
      { label: "Visit us", href: "/#cta" },
      { label: "S.P. Road, Secunderabad", href: "https://maps.google.com/?q=S.P.+Road+Secunderabad", external: true },
      { label: "Mon–Sat · 10:00–20:00", href: "/#cta" },
    ],
  },
  {
    title: "Contact",
    links: [
      { label: "WhatsApp the studio", href: WA, external: true },
      { label: "+91 99496 95030", href: "tel:+919949695030" },
      { label: "adnan@cartunez.in", href: "mailto:adnan@cartunez.in" },
    ],
  },
]

export default function Footer() {
  return (
    <footer data-ghost="footer" className="border-t hairline px-6 pb-10 pt-16 md:pt-20">
      <div className="mx-auto grid max-w-[1200px] gap-12 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
        <div>
          <img
            src="/images/cartunez-logo.png"
            alt="Cartunez"
            className="h-20 w-20 [mix-blend-mode:screen]"
          />
          <p className="headline-2 mt-5 !text-[clamp(1.5rem,2.4vw,2.25rem)]">
            Get your car rolling in style.
          </p>
          <p className="mt-4 max-w-xs text-[13px] leading-relaxed text-muted">
            Automotive customization studio in Secunderabad — performance,
            interiors, audio and exterior, all under one roof.
          </p>
        </div>
        {COLS.map((col) => (
          <div key={col.title}>
            <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-muted">{col.title}</p>
            <ul className="mt-5 space-y-3 text-sm">
              {col.links.map((l) => (
                <li key={l.label}>
                  <Link
                    href={l.href}
                    target={l.external ? "_blank" : undefined}
                    rel={l.external ? "noreferrer" : undefined}
                    className="text-muted transition-colors hover:text-paper"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="mx-auto mt-14 flex max-w-[1200px] flex-col items-center justify-between gap-3 border-t hairline pt-6 text-xs text-muted sm:flex-row">
        <span>© {new Date().getFullYear()} Cartunez. Your car. Only better.</span>
        <span>Built around you · Not for everyone</span>
      </div>
    </footer>
  )
}
