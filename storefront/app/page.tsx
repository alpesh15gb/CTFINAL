import OrbitHero from "@/components/OrbitHero"
import Marquee from "@/components/Marquee"
import BentoStats from "@/components/BentoStats"
import FeatureRows from "@/components/FeatureRows"
import CtaCapture from "@/components/CtaCapture"
import Footer from "@/components/Footer"

// ISR so Medusa-backed sections refresh at runtime (not baked at build)
export const revalidate = 300

export default function HomePage() {
  return (
    <main>
      <OrbitHero />
      <Marquee />
      <BentoStats />
      <FeatureRows />
      <CtaCapture />
      <Footer />
    </main>
  )
}
