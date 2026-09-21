import HeroScroll from "@/components/HeroScroll"
import Philosophy from "@/components/Philosophy"
import Pillars from "@/components/Pillars"
import FeaturedProducts from "@/components/FeaturedProducts"
import ServicesGrid from "@/components/ServicesGrid"
import ConversionBanner from "@/components/ConversionBanner"
import Visit from "@/components/Visit"
import Footer from "@/components/Footer"

// ISR so featured products refresh from Medusa at runtime (not baked at build)
export const revalidate = 300

export default function HomePage() {
  return (
    <main>
      <HeroScroll />
      <Philosophy />
      <Pillars />
      <FeaturedProducts />
      <ServicesGrid />
      <ConversionBanner />
      <Visit />
      <Footer />
    </main>
  )
}
