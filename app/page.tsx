import { SceneHero } from "@/components/daylight/SceneHero";
import { BrandTicker } from "@/components/daylight/BrandTicker";
import { ProofStrip } from "@/components/daylight/ProofStrip";
import { ServicesJourney } from "@/components/daylight/ServicesJourney";
import { BuildsLight } from "@/components/daylight/BuildsLight";
import { ShopPreview } from "@/components/daylight/ShopPreview";
import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { FinaleCTA } from "@/components/daylight/FinaleCTA";

/**
 * Homepage — scroll-directed design study, followed by the daylight chapters.
 */
export default function HomePage() {
  return (
    <main className="home-performance">
      <SceneHero />
      <BrandTicker />
      <ProofStrip />
      <ServicesJourney />
      <BuildsLight />
      <ShopPreview />
      <VehicleSelector />
      <FinaleCTA />
    </main>
  );
}
