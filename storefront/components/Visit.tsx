import Reveal from "./Reveal"

// REQ-SEC-6
export default function Visit() {
  return (
    <section id="visit" className="border-t hairline">
      <div className="mx-auto grid max-w-[1440px] gap-16 px-6 py-32 md:grid-cols-2">
        <div>
          <Reveal>
            <p className="eyebrow mb-6">The Studio</p>
            <h2 className="display-lg">Visit us</h2>
          </Reveal>
          <Reveal delay={0.1}>
            <address className="mt-10 space-y-6 not-italic text-lg">
              <p className="text-paper">
                Shop No. 12 &amp; 13, Veer Hanuman Temple,
                <br />
                S.P. Road, Secunderabad,
                <br />
                Hyderabad, Telangana 500003
              </p>
              <p className="text-muted">
                Open Monday – Saturday
                <br />
                10:00 – 20:00
              </p>
              <p>
                <a href="tel:+919949695030" className="text-paper transition-colors hover:text-signal">
                  +91 99496 95030
                </a>
                <br />
                <a href="mailto:adnan@cartunez.in" className="text-muted transition-colors hover:text-signal">
                  adnan@cartunez.in
                </a>
              </p>
            </address>
          </Reveal>
        </div>
        <Reveal delay={0.15} className="min-h-[420px]">
          <iframe
            title="Cartunez studio location — S.P. Road, Secunderabad"
            src="https://www.google.com/maps?q=S.P.+Road,+Secunderabad,+Hyderabad,+Telangana+500003&output=embed"
            className="h-full min-h-[420px] w-full border hairline grayscale invert-[0.9] contrast-[0.9]"
            loading="lazy"
          />
        </Reveal>
      </div>
    </section>
  )
}
