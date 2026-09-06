import { SceneHero } from "@/components/daylight/SceneHero";
import { BrandTicker } from "@/components/daylight/BrandTicker";
import { ProofStrip } from "@/components/daylight/ProofStrip";
import { ServicesJourney } from "@/components/daylight/ServicesJourney";
import { BuildsLight } from "@/components/daylight/BuildsLight";
import { ShopPreview } from "@/components/daylight/ShopPreview";
import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { FinaleCTA } from "@/components/daylight/FinaleCTA";

/**
 * Homepage — 3D observatory hero over the daylight chapters.
 * Hero pins ~360svh (scroll drives a camera orbit around the Huracán);
 * the rest of the film is the light theme.
 */
export default function HomePage() {
  return (
    <main>
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
