"use client";

import { Component, ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, MeshReflectorMaterial, useGLTF } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

/**
 * Director's Cut V2 — Shot progress map (hero is 200vh):
 *   A  0.00–0.14  Silhouette, sharp rim light, car ~58–64% width
 *   B  0.14–0.48  Light rig physically travels front (+Z) → rear (-Z)
 *   C  0.48–0.72  Hero impact campaign frame, car ~72–78% width, occluding BUILT/BEYOND
 *   D  0.72–0.96  Camera pushes aggressively into front forged wheel & hands off to macro
 */
const SHOT_B_START = 0.14;
const SHOT_B_END = 0.48;
const SHOT_C_END = 0.72;
const SHOT_D_END = 0.96;

function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
}

function fadeWindow(p: number, a: number, b: number, c: number, d: number) {
  return smoothstep((p - a) / (b - a)) * (1 - smoothstep((p - c) / (d - c)));
}

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    return this.state.hasError ? null : this.props.children;
  }
}

function CarModel({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/hero-car.glb");

  const boundingBox = useRef(new THREE.Box3());
  const center = useRef(new THREE.Vector3());
  const size = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  // Shared high-end automotive studio materials (stealth obsidian/graphite clearcoat, forged silver, cyan caliper)
  const materials = useMemo(() => {
    return {
      paint: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0e1013"),
        metalness: 0.88,
        roughness: 0.14,
        clearcoat: 1.0,
        clearcoatRoughness: 0.04,
        reflectivity: 1.0,
        envMapIntensity: 1.6,
      }),
      carbon: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#060708"),
        metalness: 0.5,
        roughness: 0.35,
        envMapIntensity: 0.6,
      }),
      rims: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#c8ccd0"),
        metalness: 0.94,
        roughness: 0.16,
        envMapIntensity: 2.2,
      }),
      caliper: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#00c8f8"),
        metalness: 0.8,
        roughness: 0.22,
        emissive: new THREE.Color("#004060"),
        emissiveIntensity: 0.3,
      }),
      tire: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#000000"),
        metalness: 0.0,
        roughness: 0.98,
        envMapIntensity: 0.05,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#040506"),
        metalness: 0.1,
        roughness: 0.04,
        transmission: 0.65,
        transparent: true,
        opacity: 0.92,
        ior: 1.52,
      }),
      lights: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ffffff"),
        metalness: 0.2,
        roughness: 0.08,
        emissive: new THREE.Color("#f0f6fa"),
        emissiveIntensity: 0.95,
      }),
      exhaust: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#7a8288"),
        metalness: 0.95,
        roughness: 0.12,
      }),
    };
  }, []);

  useEffect(() => {
    initialized.current = false;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        const name = mesh.name.toLowerCase();

        if (name.includes("mat_0") || name.includes("livery")) {
          mesh.material = materials.paint;
        } else if (name.includes("glass") || name.includes("window")) {
          mesh.material = materials.glass;
        } else if (name.includes("rims") || name.includes("misc_silver") || name.includes("disc")) {
          mesh.material = materials.rims;
        } else if (name.includes("caliper")) {
          mesh.material = materials.caliper;
        } else if (name.includes("tire")) {
          mesh.material = materials.tire;
        } else if (name.includes("lights")) {
          mesh.material = materials.lights;
        } else if (name.includes("mumfkler")) {
          mesh.material = materials.exhaust;
        } else {
          mesh.material = materials.carbon;
        }
      }
    });
  }, [scene, materials]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!initialized.current) {
      boundingBox.current.setFromObject(scene);
      boundingBox.current.getCenter(center.current);
      boundingBox.current.getSize(size.current);
      const maxDim = Math.max(size.current.x, size.current.y, size.current.z);
      const scale = 3.65 / maxDim; // Dominant physical scale
      groupRef.current.scale.setScalar(scale);
      groupRef.current.position.set(0, 0, 0);

      if (innerRef.current) {
        const minY = boundingBox.current.min.y - center.current.y;
        innerRef.current.position.set(
          -center.current.x,
          -center.current.y - minY,
          -center.current.z
        );
      }
      const initialRot = reducedMotion ? 0.06 : -0.06 + scrollProgress.get() * 0.16;
      groupRef.current.rotation.y = initialRot;
      initialized.current = true;
      return;
    }

    if (reducedMotion) {
      groupRef.current.rotation.y = 0.06; // Low front 3/4 stance
      return;
    }

    const p = scrollProgress.get();
    // Front-three-quarter low stance with subtle, heavy automotive track drift
    const targetRotation = -0.06 + p * 0.16;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      Math.min(1, delta * 15)
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -0.06, 0]}>
      <group ref={innerRef}>
        <primitive object={scene} />
      </group>
    </group>
  );
}

/** Overhead rectangular light rig that physically travels front (+Z) → rear (-Z). */
function TravelingLightRig({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const rigRef = useRef<THREE.Group>(null);
  const barMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const p = reducedMotion ? SHOT_C_END : scrollProgress.get();
    if (!rigRef.current || !spotRef.current || !barMaterialRef.current) return;

    let rigX = 0.6;
    let rigZ = 2.4;
    let spotIntensity = 0;
    let barGlow = 0;

    if (p < SHOT_B_START) {
      rigX = 0.6;
      rigZ = 2.4;
      spotIntensity = 0;
      barGlow = 0;
    } else if (p < SHOT_B_END) {
      // Spatial sweep: sweeps down the length of the hood, side bodywork, and rear haunches
      const t = smoothstep((p - SHOT_B_START) / (SHOT_B_END - SHOT_B_START));
      rigX = 0.6 + t * 0.6;
      rigZ = 2.4 - t * 4.8;
      const ignite = smoothstep((p - SHOT_B_START) / 0.05);
      spotIntensity = ignite * 360;
      barGlow = ignite * 2.8;
    } else if (p < SHOT_C_END) {
      const t = smoothstep((p - SHOT_B_END) / (SHOT_C_END - SHOT_B_END));
      rigX = 1.2 - t * 0.2;
      rigZ = -2.4 + t * 0.8;
      spotIntensity = 360 - t * 180;
      barGlow = 2.8 - t * 1.4;
    } else {
      const t = smoothstep((p - SHOT_C_END) / (SHOT_D_END - SHOT_C_END));
      rigX = 1.0;
      rigZ = -1.6;
      spotIntensity = 180 - t * 110;
      barGlow = 1.4 - t * 0.8;
    }

    rigRef.current.position.set(rigX, 3.2, rigZ);
    spotRef.current.intensity = spotIntensity;
    barMaterialRef.current.emissiveIntensity = barGlow;
    barMaterialRef.current.opacity = Math.min(1, barGlow);
  });

  return (
    <>
      <primitive object={target} position={[-0.05, 0.4, 0.1]} />
      <group ref={rigRef} position={[0.6, 3.2, 2.4]}>
        <mesh rotation={[0, Math.PI * 0.12, 0]}>
          <boxGeometry args={[2.8, 0.05, 0.4]} />
          <meshStandardMaterial
            ref={barMaterialRef}
            color="#111111"
            emissive="#f4f6f8"
            emissiveIntensity={0}
            transparent
            opacity={0}
          />
        </mesh>
        <spotLight
          ref={spotRef}
          position={[0, -0.1, 0]}
          target={target}
          angle={0.68}
          penumbra={0.65}
          intensity={0}
          color="#f4f6fa"
          distance={18}
          decay={1.4}
        />
      </group>
    </>
  );
}

/** Fixed studio lights: rear silhouette rim + front key fill. */
function StudioLights({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const rimRef = useRef<THREE.SpotLight>(null);
  const fillRef = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const p = reducedMotion ? 0.6 : scrollProgress.get();

    if (rimRef.current) {
      let intensity: number;
      if (p < SHOT_B_START) intensity = 85;
      else if (p < SHOT_B_END) intensity = 85 - smoothstep((p - SHOT_B_START) / (SHOT_B_END - SHOT_B_START)) * 40;
      else intensity = 45;
      rimRef.current.intensity = intensity;
    }

    if (fillRef.current) {
      let intensity: number;
      if (p < SHOT_B_END) intensity = 0;
      else if (p < SHOT_C_END) intensity = smoothstep((p - SHOT_B_END) / (SHOT_C_END - SHOT_B_END)) * 160;
      else intensity = 160;
      fillRef.current.intensity = intensity;
    }
  });

  return (
    <>
      <primitive object={target} position={[-0.05, 0.35, 0.15]} />
      <ambientLight intensity={0.035} />
      <directionalLight position={[0, 6, 0]} intensity={0.10} color="#e8edf2" />
      {/* Sharp silhouette rim light — rear-left roof/flank */}
      <spotLight
        ref={rimRef}
        position={[-4.2, 3.2, -4.0]}
        target={target}
        angle={0.55}
        penumbra={0.65}
        intensity={85}
        color="#edf2f7"
        distance={22}
        decay={1.3}
      />
      {/* Front-right key/fill light — illuminates front splitter, grille, and wheel face in Shot C */}
      <spotLight
        ref={fillRef}
        position={[2.4, 2.0, 3.6]}
        target={target}
        angle={0.85}
        penumbra={0.85}
        intensity={0}
        color="#f4f6fa"
        distance={18}
        decay={1.4}
      />
    </>
  );
}

/** Floor contact grounding shadow to eliminate floating. */
function ContactGrounding() {
  const shadowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 512, 256);
      const rad = ctx.createRadialGradient(256, 128, 20, 256, 128, 120);
      rad.addColorStop(0, "rgba(0, 0, 0, 0.98)");
      rad.addColorStop(0.5, "rgba(0, 0, 0, 0.70)");
      rad.addColorStop(0.85, "rgba(0, 0, 0, 0.25)");
      rad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, 512, 256);
    }
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  if (!shadowTex) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
      <planeGeometry args={[4.4, 2.4]} />
      <meshBasicMaterial map={shadowTex} transparent opacity={0.92} depthWrite={false} />
    </mesh>
  );
}

/** Dark studio: reflective obsidian floor, cyclorama wall, grounding shadow. */
function StudioEnvironment() {
  return (
    <group>
      <ContactGrounding />
      {/* Floor — rich obsidian reflection, restrained mix */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[400, 150]}
          resolution={512}
          mixBlur={0.8}
          mixStrength={1.8}
          roughness={0.80}
          depthScale={1.2}
          minDepthThreshold={0.2}
          maxDepthThreshold={1.2}
          color="#050607"
          metalness={0.5}
          mirror={0.26}
        />
      </mesh>
      {/* Cyclorama backdrop */}
      <mesh position={[0, 6, -11]}>
        <planeGeometry args={[50, 16]} />
        <meshStandardMaterial color="#040506" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

function makeWordTexture(word: string) {
  if (typeof document === "undefined") return new THREE.Texture();
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 2048, 640);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 480px 'Barlow Condensed', 'Arial Black', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(word, 1024, 340);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

/** BUILT / BEYOND physical set pieces positioned behind the car. */
function BackdropType({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const builtTex = useMemo(() => makeWordTexture("BUILT"), []);
  const beyondTex = useMemo(() => makeWordTexture("BEYOND"), []);
  const builtMat = useRef<THREE.MeshBasicMaterial>(null);
  const beyondMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    if (reducedMotion) {
      if (builtMat.current) builtMat.current.opacity = 0;
      if (beyondMat.current) beyondMat.current.opacity = 0;
      return;
    }
    const p = scrollProgress.get();
    if (builtMat.current) builtMat.current.opacity = 0.44 * fadeWindow(p, 0.46, 0.54, 0.72, 0.78);
    if (beyondMat.current) beyondMat.current.opacity = 0.36 * fadeWindow(p, 0.50, 0.58, 0.72, 0.78);
  });

  return (
    <group>
      <mesh position={[-1.2, 2.8, -6.0]}>
        <planeGeometry args={[11.5, 3.6]} />
        <meshBasicMaterial ref={builtMat} map={builtTex} transparent opacity={0} depthWrite={false} fog={false} toneMapped={false} />
      </mesh>
      <mesh position={[1.8, 1.4, -5.5]}>
        <planeGeometry args={[14.0, 4.2]} />
        <meshBasicMaterial ref={beyondMat} map={beyondTex} transparent opacity={0} depthWrite={false} fog={false} toneMapped={false} />
      </mesh>
    </group>
  );
}

function CameraRig({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const initializedCam = useRef(false);

  useFrame((state, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const p = reducedMotion ? 0.6 : scrollProgress.get();

    let x: number, y: number, z: number;
    let lx: number, ly: number, lz: number;
    let fov: number;

    if (p < SHOT_B_START) {
      // SHOT A — Low front-three-quarter silhouette, car dominates 58–64% width
      const t = smoothstep(p / SHOT_B_START);
      x = 2.2 - t * 0.1;
      y = 0.52 + t * 0.02;
      z = 3.9 - t * 0.15;
      lx = -0.05; ly = 0.35; lz = 0.10;
      fov = 34;
    } else if (p < SHOT_B_END) {
      // SHOT B — Slow camera pan & track while light rig sweeps front → rear
      const t = smoothstep((p - SHOT_B_START) / (SHOT_B_END - SHOT_B_START));
      x = 2.1 - t * 0.20;
      y = 0.54 + t * 0.02;
      z = 3.75 - t * 0.20;
      lx = -0.05 - t * 0.03;
      ly = 0.35 - t * 0.01;
      lz = 0.10 + t * 0.05;
      fov = 34 + t * 1.5;
    } else if (p < SHOT_C_END) {
      // SHOT C — Peak hero campaign frame, car occupies 72–78% usable width
      const t = smoothstep((p - SHOT_B_END) / (SHOT_C_END - SHOT_B_END));
      x = 1.90 - t * 0.10;
      y = 0.56 - t * 0.04;
      z = 3.55 - t * 0.10;
      lx = -0.05 - t * 0.02;
      ly = 0.34 - t * 0.01;
      lz = 0.15 + t * 0.03;
      fov = 35.5 + t * 1.0;
    } else {
      // SHOT D — Deliberate macro push-in targeting the front-left forged wheel
      const t = smoothstep((p - SHOT_C_END) / (SHOT_D_END - SHOT_C_END));
      x = 1.80 - t * 0.85;
      y = 0.52 - t * 0.26;
      z = 3.45 - t * 1.75;
      lx = -0.07 + t * 0.62;
      ly = 0.33 - t * 0.11;
      lz = 0.18 + t * 0.67;
      fov = 36.5 - t * 8.5;
    }

    // Portrait / Mobile viewports: scale distance and FOV so the car remains heroically framed
    const aspect = state.size.width / state.size.height;
    if (aspect < 0.8) {
      const portraitFactor = Math.min(1, (0.8 - aspect) / 0.35);
      z *= 1 + 0.30 * portraitFactor;
      y += 0.06 * portraitFactor;
      fov += 9 * portraitFactor;
    }

    targetPos.current.set(x, y, z);
    targetLook.current.set(lx, ly, lz);

    const desiredDir = targetLook.current.clone().sub(targetPos.current).normalize();

    if (!initializedCam.current) {
      cam.position.copy(targetPos.current);
      currentLook.current.copy(desiredDir);
      cam.lookAt(targetPos.current.clone().add(desiredDir));
      cam.fov = fov;
      cam.updateProjectionMatrix();
      initializedCam.current = true;
      return;
    }

    cam.position.lerp(targetPos.current, Math.min(1, delta * 15));
    cam.getWorldDirection(currentLook.current);
    currentLook.current.lerp(desiredDir, Math.min(1, delta * 15));
    cam.lookAt(cam.position.clone().add(currentLook.current));

    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, fov, Math.min(1, delta * 15));
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

export function HeroStudio({
  scrollProgress,
  reducedMotion,
  active,
}: {
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
  active: boolean;
}) {
  return (
    <CanvasErrorBoundary>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        camera={{ position: [2.2, 0.52, 3.9], fov: 34 }}
        frameloop={active && !reducedMotion ? "always" : "demand"}
        shadows={false}
      >
        <fog attach="fog" args={["#030405", 9, 24]} />
        <Suspense fallback={null}>
          <StudioLights scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
          <TravelingLightRig scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
          <Environment preset="city" environmentIntensity={0.06} />
          <StudioEnvironment />
          <BackdropType scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
          <CarModel scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        </Suspense>
        <CameraRig scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      </Canvas>
    </CanvasErrorBoundary>
  );
}
