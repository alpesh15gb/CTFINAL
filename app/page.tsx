import { Hero } from "@/components/sections/Hero";
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
    <main className="relative overflow-hidden bg-background">
      {/* ACT 01 — Desire */}
      <Hero />
      {/* ACT 02 — Find your car */}
      <VehicleSelector />
      {/* ACT 03 — Transform it (cinematic scroll story) */}
      <UpgradeStory />
      {/* Conventional shopping interface */}
      <Categories />
      <FeaturedProducts />
      {/* Built by Cartunez */}
      <BuildsShowcase />
      <Craftsmanship />
      {/* Take a closer look */}
      <Configurator />
      {/* Performance story */}
      <Stats />
      <DetailsStory />
      {/* Reviews */}
      <Testimonials />
      {/* Social */}
      <InstagramReels />
      <FinalCTA />
    </main>
  );
}
