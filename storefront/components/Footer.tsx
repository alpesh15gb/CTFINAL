export default function Footer() {
  return (
    <footer className="border-t hairline">
      <div className="mx-auto flex max-w-[1440px] flex-col items-start justify-between gap-8 px-6 py-16 md:flex-row md:items-end">
        <div>
          <img
            src="/images/cartunez-logo.png"
            alt="Cartunez"
            className="h-24 w-24 [mix-blend-mode:screen]"
          />
          <p className="eyebrow mt-4">Get your car rolling in style.</p>
        </div>
        <div className="flex gap-10 text-sm text-muted">
          <div className="flex flex-col gap-2">
            <span className="eyebrow">Studio</span>
            <span>S.P. Road, Secunderabad</span>
            <span>Hyderabad 500003</span>
          </div>
          <div className="flex flex-col gap-2">
            <span className="eyebrow">Contact</span>
            <a href="tel:+919949695030" className="transition-colors hover:text-signal">+91 99496 95030</a>
            <a href="mailto:adnan@cartunez.in" className="transition-colors hover:text-signal">adnan@cartunez.in</a>
          </div>
        </div>
      </div>
      <div className="border-t hairline py-6 text-center text-xs text-muted">
        © {new Date().getFullYear()} Cartunez. Your car. Only better.
      </div>
    </footer>
  )
}
