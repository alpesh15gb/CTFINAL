import { CinematicIntro } from "@/components/cinematic/CinematicIntro";
import { DarkMachineHero } from "@/components/cinematic/DarkMachineHero";
import { NumbersLightning } from "@/components/cinematic/NumbersLightning";
import { GiantMark } from "@/components/cinematic/GiantMark";
import { WovenNotWelded } from "@/components/cinematic/WovenNotWelded";
import { ObsidianBlack } from "@/components/cinematic/ObsidianBlack";
import { EveryAngle } from "@/components/cinematic/EveryAngle";
import { FutureArrived, Philosophy } from "@/components/cinematic/FutureArrived";
import { Services } from "@/components/cinematic/Services";
import { SelectedMachines } from "@/components/cinematic/SelectedMachines";
import { CinematicBridge } from "@/components/cinematic/CinematicBridge";
import { VehicleSelector } from "@/components/sections/VehicleSelector";
import { Categories } from "@/components/sections/Categories";
import { FeaturedProducts } from "@/components/sections/FeaturedProducts";
import { BuildsShowcase } from "@/components/sections/BuildsShowcase";
import { Configurator } from "@/components/sections/Configurator";
import { FinalCTA } from "@/components/sections/FinalCTA";

export default function Home() {
  return (
    <main className="relative overflow-x-clip bg-[#020202]">
      {/* Cinematic loader (once per session) */}
      <CinematicIntro />

      {/* ACT 01 — DARK MACHINE + HERO REVEAL */}
      <DarkMachineHero />

      {/* ACT 02 — NUMBERS WRITTEN IN LIGHTNING */}
      <NumbersLightning />

      {/* ACT 03 — GIANT MARK */}
      <GiantMark />

      {/* ACT 04 — WOVEN, NOT WELDED */}
      <WovenNotWelded />

      {/* ACT 05 — OBSIDIAN BLACK */}
      <ObsidianBlack />

      {/* ACT 06 — EVERY ANGLE, AN ARGUMENT */}
      <EveryAngle />

      {/* ACT 07 — THE MACHINE HAS EVOLVED (night) */}
      <FutureArrived />

      {/* ACT 08 — PHILOSOPHY */}
      <Philosophy />

      {/* ACT 09 — SERVICES INDEX */}
      <Services />

      {/* ACT 10 — SELECTED MACHINES */}
      <SelectedMachines />

      {/* HANDOFF — cinematic → commerce */}
      <CinematicBridge />
      <VehicleSelector />
      <Categories />
      <FeaturedProducts />
      <BuildsShowcase />
      <Configurator />

      {/* FINAL ACT */}
      <FinalCTA />
    </main>
  );
}
