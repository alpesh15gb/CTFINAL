import { DaylightHero } from "@/components/daylight/DaylightHero";
import { BrandTicker } from "@/components/daylight/BrandTicker";
import { ProofStrip } from "@/components/daylight/ProofStrip";

/**
 * DAYLIGHT STUDIO homepage (feat/daylight-studio).
 * P1 slice: parallax hero + live brand ticker + live proof.
 * P2 adds: services journey, builds showcase, shop preview, dark finale.
 */
export default function HomePage() {
  return (
    <main>
      <DaylightHero />
      <BrandTicker />
      <ProofStrip />
    </main>
  );
}
