import { DaylightHero } from "@/components/daylight/DaylightHero";
import { BrandTicker } from "@/components/daylight/BrandTicker";
import { ProofStrip } from "@/components/daylight/ProofStrip";
import { ServicesJourney } from "@/components/daylight/ServicesJourney";
import { BuildsLight } from "@/components/daylight/BuildsLight";
import { ShopPreview } from "@/components/daylight/ShopPreview";
import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { FinaleCTA } from "@/components/daylight/FinaleCTA";

/**
 * DAYLIGHT STUDIO homepage (feat/daylight-studio).
 * P2: full chapter arc — hero, ticker, proof, services journey,
 * builds, shop preview, fitment, dark finale.
 */
export default function HomePage() {
  return (
    <main>
      <DaylightHero />
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
