import { Hero } from "@/components/sections/Hero";
import { Bridge } from "@/components/sections/Bridge";
import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { WheelScrubber } from "@/components/configurator/WheelScrubber";
import { UpgradeStory } from "@/components/sections/UpgradeStory";
import { EngineeringBento } from "@/components/sections/EngineeringBento";
import { Categories } from "@/components/sections/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { BuildsShowcase } from "@/components/sections/BuildsShowcase";
import { Craftsmanship } from "@/components/sections/Craftsmanship";
import { Configurator } from "@/components/sections/Configurator";
import { Stats } from "@/components/sections/Stats";
import { DetailsStory } from "@/components/sections/DetailsStory";
import { Testimonials } from "@/components/sections/Testimonials";
import { InstagramReels } from "@/components/sections/InstagramReels";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main className="relative overflow-x-clip bg-background">
      {/* ACT 01 — THE MACHINE (Cinematic Hero) */}
      <Hero />

      {/* ACT 02 — CARTUNEZ HANDOFF */}
      <Bridge />

      {/* ACT 03 — FIND YOUR CAR */}
      <VehicleSelector />

      {/* ACT 04 — INTERACTIVE WHEEL SCRUBBER & SPEC DECK */}
      <WheelScrubber />

      {/* ACT 05 — TRANSFORMATION STORY (Three Acts) */}
      <UpgradeStory />

      {/* ACT 06 — AEROSPACE METALLURGY & PERFORMANCE BENTO */}
      <EngineeringBento />

      {/* ACT 07 — PRODUCTS (Clean Commerce Interface) */}
      <Categories />
      <FeaturedProducts />

      {/* ACT 08 — BUILT BY CARTUNEZ */}
      <BuildsShowcase />

      {/* ACT 09 — CRAFTSMANSHIP / PROCESS */}
      <Craftsmanship />

      {/* ACT 10 — CONFIGURATOR */}
      <Configurator />

      {/* ACT 11 — PERFORMANCE NUMBERS */}
      <Stats />

      {/* ACT 12 — DETAILS / MACRO STORY */}
      <DetailsStory />

      {/* SOCIAL PROOF */}
      <Testimonials />
      <InstagramReels />

      {/* FINAL ACT */}
      <FinalCTA />
    </main>
  );
}
