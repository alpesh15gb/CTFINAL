import { ApexHomeNav } from "@/components/layout/ApexHomeNav";
import { ApexCloneExperience } from "@/components/sections/ApexCloneExperience";
import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { Categories } from "@/components/sections/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { BuildsShowcase } from "@/components/sections/BuildsShowcase";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main className="relative overflow-x-clip bg-[#050505]">
      <ApexHomeNav />

      {/* APEX-style cinematic brand film, directed by scroll */}
      <ApexCloneExperience />

      {/* Commerce handoff — preserve existing Cartunez fitment and shopping flows */}
      <VehicleSelector />
      <Categories />
      <FeaturedProducts />
      <BuildsShowcase />
      <FinalCTA />
    </main>
  );
}
