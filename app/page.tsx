import { Hero } from "@/components/sections/Hero";
import { Bridge } from "@/components/sections/Bridge";
import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { UpgradeStory } from "@/components/sections/UpgradeStory";
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
      {/* ACT 01 — THE MACHINE (4-shot cinematic hero) */}
      <Hero />

      {/* ACT 02 — CARTUNEZ HANDOFF */}
      <Bridge />

      {/* ACT 03 — FIND YOUR CAR */}
      <VehicleSelector />

      {/* ACT 04 — TRANSFORMATION STORY (three acts) */}
      <UpgradeStory />

      {/* ACT 05 — PRODUCTS (clean commerce interface) */}
      <Categories />
      <FeaturedProducts />

      {/* ACT 06 — BUILT BY CARTUNEZ */}
      <BuildsShowcase />

      {/* ACT 07 — CRAFTSMANSHIP / PROCESS */}
      <Craftsmanship />

      {/* ACT 08 — CONFIGURATOR */}
      <Configurator />

      {/* ACT 09 — PERFORMANCE NUMBERS */}
      <Stats />

      {/* ACT 10 — DETAILS / MACRO STORY */}
      <DetailsStory />

      {/* SOCIAL PROOF */}
      <Testimonials />
      <InstagramReels />

      {/* FINAL ACT */}
      <FinalCTA />
    </main>
  );
}
