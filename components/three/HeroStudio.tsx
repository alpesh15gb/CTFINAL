"use client";

import { Component, ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, MeshReflectorMaterial, useGLTF } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

/**
 * Shot progress map (hero is 200vh):
 *   A  0.00–0.14  silhouette, rim light only
 *   B  0.14–0.48  light rig physically travels front → rear
 *   C  0.48–0.72  campaign hero frame, full studio state
 *   D  0.72–0.96  camera pushes into front wheel (hands off to macro still)
 */
const SHOT_B_START = 0.14;
const SHOT_B_END = 0.48;
const SHOT_C_END = 0.72;
const SHOT_D_END = 0.96;

function smoothstep(t: number) {
  const c = Math.min(1, Math.max(0, t));
  return c * c * (3 - 2 * c);
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
  const { scene } = useGLTF("/models/hero-car.glb");

  const boundingBox = useRef(new THREE.Box3());
  const center = useRef(new THREE.Vector3());
  const size = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  useEffect(() => {
    initialized.current = false;
    scene.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        child.castShadow = false;
        child.receiveShadow = false;
      }
    });
  }, [scene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!initialized.current) {
      boundingBox.current.setFromObject(scene);
      boundingBox.current.getCenter(center.current);
      boundingBox.current.getSize(size.current);
      const maxDim = Math.max(size.current.x, size.current.y, size.current.z);
      const scale = 3 / maxDim;
      groupRef.current.scale.setScalar(scale);
      // Center on X/Z, rest wheels exactly on the floor plane (y=0)
      const minY = (boundingBox.current.min.y - center.current.y) * scale;
      groupRef.current.position.set(
        -center.current.x * scale,
        -center.current.y * scale - minY,
        -center.current.z * scale
      );
      initialized.current = true;
    }

    if (reducedMotion) {
      groupRef.current.rotation.y = -Math.PI * 0.1;
      return;
    }

    const p = scrollProgress.get();
    // Car barely rotates — the camera and the light do the moving
    const targetRotation = -Math.PI * 0.1 + p * Math.PI * 0.08;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      delta * 2
    );
  });

  return (
    <group ref={groupRef} rotation={[0, -Math.PI * 0.1, 0]}>
      <primitive object={scene} />
    </group>
  );
}

/** Overhead rectangular light rig that physically travels front → rear. */
function TravelingLightRig({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const rigRef = useRef<THREE.Group>(null);
  const barMaterialRef = useRef<THREE.MeshStandardMaterial>(null);
  const spotRef = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const p = reducedMotion ? SHOT_C_END : scrollProgress.get();
    if (!rigRef.current || !spotRef.current || !barMaterialRef.current) return;

    // Rig X position: parked at the nose, sweeps to the tail during SHOT B,
    // then holds near the rear for the hero frame.
    let rigX = 3.4;
    let spotIntensity = 0;
    let barGlow = 0;

    if (p < SHOT_B_START) {
      rigX = 3.4;
      spotIntensity = 0;
      barGlow = 0;
    } else if (p < SHOT_B_END) {
      const t = smoothstep((p - SHOT_B_START) / (SHOT_B_END - SHOT_B_START));
      rigX = 3.4 - t * 6.8; // front → rear, spatial travel
      const ignite = smoothstep((p - SHOT_B_START) / 0.06); // quick ignition
      spotIntensity = ignite * 300;
      barGlow = ignite * 2.4;
    } else if (p < SHOT_C_END) {
      const t = smoothstep((p - SHOT_B_END) / (SHOT_C_END - SHOT_B_END));
      rigX = -3.4 + t * 0.4;
      spotIntensity = 300 - t * 140; // settles as the fill takes over
      barGlow = 2.4 - t * 1.0;
    } else {
      const t = smoothstep((p - SHOT_C_END) / (SHOT_D_END - SHOT_C_END));
      rigX = -3.0;
      spotIntensity = 160 - t * 60;
      barGlow = 1.4 - t * 0.6;
    }

    rigRef.current.position.x = rigX;
    spotRef.current.intensity = spotIntensity;
    barMaterialRef.current.emissiveIntensity = barGlow;
    barMaterialRef.current.opacity = Math.min(1, barGlow);
  });

  return (
    <>
      <primitive object={target} position={[0, 0.5, 1.2]} />
      <group ref={rigRef} position={[3.4, 3.1, 0.4]}>
        {/* Visible light bar — the viewer sees where the light comes from */}
        <mesh>
          <boxGeometry args={[2.9, 0.05, 0.42]} />
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
          angle={0.5}
          penumbra={0.55}
          intensity={0}
          color="#f5f5f5"
          distance={18}
          decay={1.6}
        />
      </group>
    </>
  );
}

/** Fixed studio lights: rear-left rim (silhouette edge) + front fill (hero frame). */
function StudioLights({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const rimRef = useRef<THREE.SpotLight>(null);
  const fillRef = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const p = reducedMotion ? 0.6 : scrollProgress.get();

    if (rimRef.current) {
      // Rim traces the silhouette in SHOT A, stays as a subtle edge afterwards
      let intensity: number;
      if (p < SHOT_B_START) intensity = 40;
      else if (p < SHOT_B_END) intensity = 40 - smoothstep((p - SHOT_B_START) / (SHOT_B_END - SHOT_B_START)) * 12;
      else intensity = 28;
      rimRef.current.intensity = intensity;
    }

    if (fillRef.current) {
      // Soft front fill fades up for the SHOT C money frame — bodywork readability
      let intensity: number;
      if (p < SHOT_B_END) intensity = 0;
      else if (p < SHOT_C_END) intensity = smoothstep((p - SHOT_B_END) / (SHOT_C_END - SHOT_B_END)) * 120;
      else intensity = 120;
      fillRef.current.intensity = intensity;
    }
  });

  return (
    <>
      <primitive object={target} position={[0, 0.3, 0]} />
      <ambientLight intensity={0.04} />
      <spotLight
        ref={rimRef}
        position={[-5, 3.6, -5.5]}
        target={target}
        angle={0.5}
        penumbra={0.65}
        intensity={55}
        color="#eef0f2"
        distance={20}
        decay={1.5}
      />
      <spotLight
        ref={fillRef}
        position={[2.6, 1.7, 5.2]}
        target={target}
        angle={0.8}
        penumbra={0.9}
        intensity={0}
        color="#f2f3f5"
        distance={16}
        decay={1.6}
      />
    </>
  );
}

/** Dark studio: reflective floor (soft, not a mirror), cyclorama wall, depth bars. */
function StudioEnvironment() {
  return (
    <group>
      {/* Floor — soft dark reflection, strongest under the car */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={512}
          mixBlur={0.9}
          mixStrength={14}
          roughness={0.9}
          depthScale={1.1}
          minDepthThreshold={0.4}
          maxDepthThreshold={1.4}
          color="#0a0b0c"
          metalness={0.4}
          mirror={0.35}
        />
      </mesh>
      {/* Cyclorama backdrop */}
      <mesh position={[0, 6, -11]}>
        <planeGeometry args={[50, 16]} />
        <meshStandardMaterial color="#050607" roughness={1} metalness={0} />
      </mesh>
    </group>
  );
}

function makeWordTexture(word: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 2048;
  canvas.height = 640;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.clearRect(0, 0, 2048, 640);
    ctx.fillStyle = "#ffffff";
    ctx.font = "900 440px 'Arial Black', 'Helvetica Neue', system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(word, 1024, 340);
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.anisotropy = 4;
  return tex;
}

function fadeWindow(p: number, a: number, b: number, c: number, d: number) {
  return smoothstep((p - a) / (b - a)) * (1 - smoothstep((p - c) / (d - c)));
}

/** BUILT / BEYOND as physical set pieces behind the car — the car occludes them. */
function BackdropType({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const builtTex = useMemo(() => makeWordTexture("BUILT"), []);
  const beyondTex = useMemo(() => makeWordTexture("BEYOND"), []);
  const builtMat = useRef<THREE.MeshBasicMaterial>(null);
  const beyondMat = useRef<THREE.MeshBasicMaterial>(null);

  useFrame(() => {
    const p = reducedMotion ? 0.6 : scrollProgress.get();
    if (builtMat.current) builtMat.current.opacity = 0.34 * fadeWindow(p, 0.5, 0.56, 0.72, 0.78);
    if (beyondMat.current) beyondMat.current.opacity = 0.28 * fadeWindow(p, 0.52, 0.58, 0.72, 0.78);
  });

  return (
    <group>
      <mesh position={[-2.4, 2.9, -7.5]}>
        <planeGeometry args={[9.5, 2.97]} />
        <meshBasicMaterial ref={builtMat} map={builtTex} transparent opacity={0} depthWrite={false} fog={false} toneMapped={false} />
      </mesh>
      <mesh position={[0.6, 1.5, -7]}>
        <planeGeometry args={[11, 3.44]} />
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

  useFrame((state, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const p = reducedMotion ? 0.6 : scrollProgress.get();

    let x: number, y: number, z: number;
    let lx: number, ly: number, lz: number;
    let fov: number;
    let fade: number;

    if (p < SHOT_B_START) {
      // SHOT A — locked low three-quarter, car at ~60% width
      const t = smoothstep(p / SHOT_B_START);
      x = 3.35 + t * 0.05;
      y = 0.62;
      z = 5.3 - t * 0.08;
      lx = 0.1; ly = 0.45; lz = 0;
      fov = 35;
      fade = 1;
    } else if (p < SHOT_B_END) {
      // SHOT B — slow lateral truck + slight push while light travels
      const t = smoothstep((p - SHOT_B_START) / (SHOT_B_END - SHOT_B_START));
      x = 3.4 - t * 1.15;
      y = 0.62 + t * 0.2;
      z = 5.22 - t * 0.35;
      lx = 0.1 - t * 0.1;
      ly = 0.45 - t * 0.07;
      lz = 0;
      fov = 35;
      fade = 1;
    } else if (p < SHOT_C_END) {
      // SHOT C — settle into the low-angle money frame, car 70–80% width
      const t = smoothstep((p - SHOT_B_END) / (SHOT_C_END - SHOT_B_END));
      x = 2.25 - t * 0.4;
      y = 0.82 - t * 0.28;
      z = 4.87 - t * 0.3;
      lx = 0 - t * 0.15;
      ly = 0.38 - t * 0.06;
      lz = t * 0.1;
      fov = 35 + t * 3;
      fade = 1;
    } else {
      // SHOT D — deliberate push into the front wheel corner
      const t = smoothstep((p - SHOT_C_END) / (SHOT_D_END - SHOT_C_END));
      x = 1.85 - t * 0.75;
      y = 0.54 - t * 0.22;
      z = 4.57 - t * 2.15;
      lx = -0.15 + t * 1.0;
      ly = 0.32 - t * 0.08;
      lz = 0.1 + t * 0.62;
      fov = 38 - t * 8;
      fade = 1 - t;
    }

    // Portrait viewports crop the car's long axis; swing steeper + wider.
    const aspect = state.size.width / state.size.height;
    const n = aspect < 0.8 ? Math.min(1, (0.8 - aspect) / 0.35) : 0;
    fade *= n;
    if (fade > 0) {
      x *= 1 - 0.45 * fade;
      y += 0.08 * fade;
      z *= 1 + 0.4 * fade;
      fov += 12 * fade;
    }

    targetPos.current.set(x, y, z);
    targetLook.current.set(lx, ly, lz);

    camera.position.lerp(targetPos.current, Math.min(1, delta * 5));

    const desiredDir = targetLook.current.clone().sub(camera.position).normalize();
    camera.getWorldDirection(currentLook.current);
    currentLook.current.lerp(desiredDir, Math.min(1, delta * 5));
    camera.lookAt(camera.position.clone().add(currentLook.current));

    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, fov, Math.min(1, delta * 5));
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
        camera={{ position: [3.35, 0.62, 5.3], fov: 35 }}
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
