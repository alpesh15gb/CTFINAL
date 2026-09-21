import Reveal from "./Reveal"

// REQ-SEC-1
export default function Philosophy() {
  return (
    <section id="experience" className="border-t hairline">
      <div className="mx-auto max-w-[1440px] px-6 py-32 md:py-48">
        <Reveal>
          <p className="eyebrow mb-10">The Philosophy</p>
        </Reveal>
        <Reveal delay={0.1}>
          <h2 className="display-lg max-w-5xl">
            A car gets you there.{" "}
            <span className="text-signal">Character</span> makes it yours.
          </h2>
        </Reveal>
        <Reveal delay={0.2}>
          <p className="mt-10 max-w-xl text-lg text-muted">
            Factory spec is a compromise made for everyone. We exist for the
            owners who refuse it — one car at a time, in our Secunderabad
            studio, with an obsession for the details you can feel.
          </p>
        </Reveal>
      </div>
    </section>
  )
}
