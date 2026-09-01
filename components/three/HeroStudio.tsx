"use client";

import { Component, ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

/**
 * Director's Cut V2 Visual Recovery — 3 Photographic Moments:
 *   FRAME A (0.00–0.25): Dark Machine — photographic low 3/4 stance, graphite paint, negative space on left
 *   FRAME B (0.25–0.70): Campaign Hero — car 78–82% width, clear body midtones, restrained DOM typography
 *   FRAME C (0.70–1.00): Detail & Macro Handoff — camera pushes toward front wheel into dark aperture handoff
 */

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
  const innerRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF("/models/hero-car.glb");

  const boundingBox = useRef(new THREE.Box3());
  const center = useRef(new THREE.Vector3());
  const size = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  // Selective high-end automotive materials:
  // Body paint: deep metallic graphite with visible midtones (bonnet, fender & shoulder curves clearly readable)
  // Wheels: brushed titanium gunmetal
  // Calipers: dark metallic titanium (no cyan gimmick)
  // Tires: clean matte vulcanized rubber
  const materials = useMemo(() => {
    return {
      paint: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#262a30"),
        metalness: 0.60,
        roughness: 0.24,
        clearcoat: 0.70,
        clearcoatRoughness: 0.10,
        reflectivity: 0.88,
        envMapIntensity: 1.15,
      }),
      carbon: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#16181b"),
        metalness: 0.50,
        roughness: 0.38,
        envMapIntensity: 0.7,
      }),
      rims: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#b8bcc0"),
        metalness: 0.90,
        roughness: 0.22,
        envMapIntensity: 1.6,
      }),
      caliper: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#444950"),
        metalness: 0.85,
        roughness: 0.30,
        envMapIntensity: 0.8,
      }),
      tire: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0c0d0e"),
        metalness: 0.0,
        roughness: 0.96,
        envMapIntensity: 0.04,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#080a0d"),
        metalness: 0.1,
        roughness: 0.08,
        transmission: 0.55,
        transparent: true,
        opacity: 0.94,
        ior: 1.50,
      }),
      lights: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ffffff"),
        metalness: 0.2,
        roughness: 0.08,
        emissive: new THREE.Color("#e8f0f8"),
        emissiveIntensity: 0.60,
      }),
      exhaust: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#707880"),
        metalness: 0.92,
        roughness: 0.16,
      }),
    };
  }, []);

  // Dispose component-owned custom materials on unmount
  useEffect(() => {
    return () => {
      Object.values(materials).forEach((mat) => {
        mat.dispose();
      });
    };
  }, [materials]);

  // Clone scene per instance to avoid mutating globally cached GLTF
  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        const name = (mesh.name || "").toLowerCase();
        const matName = (Array.isArray(mesh.material) ? mesh.material[0]?.name : mesh.material?.name || "").toLowerCase();

        if (name.includes("mat_0") || name.includes("livery") || matName.includes("mat_0") || matName.includes("livery") || name.includes("body") || matName.includes("body")) {
          mesh.material = materials.paint;
        } else if (name.includes("glass") || name.includes("window") || matName.includes("glass") || matName.includes("window")) {
          mesh.material = materials.glass;
        } else if (name.includes("rims") || name.includes("misc_silver") || name.includes("disc") || matName.includes("rims") || matName.includes("misc_silver") || matName.includes("disc")) {
          mesh.material = materials.rims;
        } else if (name.includes("caliper") || matName.includes("caliper")) {
          mesh.material = materials.caliper;
        } else if (name.includes("tire") || matName.includes("tire")) {
          mesh.material = materials.tire;
        } else if (name.includes("lights") || matName.includes("lights")) {
          mesh.material = materials.lights;
        } else if (name.includes("mumfkler") || matName.includes("mumfkler") || name.includes("exhaust")) {
          mesh.material = materials.exhaust;
        } else {
          mesh.material = materials.carbon;
        }
      }
    });
    return clone;
  }, [scene, materials]);

  useEffect(() => {
    initialized.current = false;
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    if (!initialized.current) {
      boundingBox.current.setFromObject(clonedScene);
      boundingBox.current.getCenter(center.current);
      boundingBox.current.getSize(size.current);
      const maxDim = Math.max(size.current.x, size.current.y, size.current.z);
      const scale = 3.65 / maxDim;
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
      const initialRot = reducedMotion ? 0.08 : -0.04;
      groupRef.current.rotation.y = initialRot;
      initialized.current = true;
      return;
    }

    if (reducedMotion) {
      groupRef.current.rotation.y = 0.08;
      return;
    }

    const p = scrollProgress.get();
    // Subtle, heavy automotive track drift
    const targetRotation = -0.04 + p * 0.12;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      Math.min(1, delta * 12)
    );
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -0.04, 0]}>
      <group ref={innerRef}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

/** Soft photographic studio lighting — restrained intensities, rich graphite midtones, dark floor. */
function StudioLights({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const keyLightRef = useRef<THREE.DirectionalLight>(null);
  const rimLightRef = useRef<THREE.SpotLight>(null);
  const fillLightRef = useRef<THREE.DirectionalLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const p = reducedMotion ? 0.5 : scrollProgress.get();

    // Key light: soft overhead-right illumination revealing hood and body surfacing
    if (keyLightRef.current) {
      const keyIntensity = 1.25 + smoothstep((p - 0.15) / 0.40) * 0.45;
      keyLightRef.current.intensity = keyIntensity;
    }

    // Rim light: traces roofline, A-pillar and rear haunch softly
    if (rimLightRef.current) {
      const rimIntensity = 1.6 + (1 - smoothstep(p / 0.35)) * 0.5;
      rimLightRef.current.intensity = rimIntensity;
    }

    // Soft front-left fill: keeps shadow side readable without washing out blacks
    if (fillLightRef.current) {
      fillLightRef.current.intensity = 0.55 + smoothstep((p - 0.2) / 0.4) * 0.25;
    }
  });

  return (
    <>
      <primitive object={target} position={[-0.10, 0.35, 0.15]} />
      {/* Soft ambient ground fill */}
      <ambientLight intensity={0.22} />

      {/* Main Key: Soft angled high-right studio light */}
      <directionalLight
        ref={keyLightRef}
        position={[3.5, 4.5, 3.8]}
        intensity={1.35}
        color="#f2f5f8"
      />

      {/* Silhouette Rim: Rear-left specular edge */}
      <spotLight
        ref={rimLightRef}
        position={[-4.5, 3.2, -3.8]}
        target={target}
        angle={0.65}
        penumbra={0.85}
        intensity={1.7}
        color="#edf2f7"
        distance={22}
        decay={1.2}
      />

      {/* Front-left gentle fill for front splitter & grille readability */}
      <directionalLight
        ref={fillLightRef}
        position={[-2.8, 1.8, 3.5]}
        intensity={0.60}
        color="#dce4ec"
      />
    </>
  );
}

/** Tarmac / dark studio floor with subtle localized contact shadow under the wheels. */
function StudioEnvironment() {
  const shadowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 512, 256);
      // Tight, dark contact shadow directly under car footprint
      const rad = ctx.createRadialGradient(256, 128, 15, 256, 128, 110);
      rad.addColorStop(0, "rgba(0, 0, 0, 0.96)");
      rad.addColorStop(0.45, "rgba(0, 0, 0, 0.65)");
      rad.addColorStop(0.80, "rgba(0, 0, 0, 0.18)");
      rad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, 512, 256);
    }
    const tex = new THREE.CanvasTexture(c);
    return tex;
  }, []);

  // Dispose CanvasTexture on unmount
  useEffect(() => {
    return () => {
      shadowTex?.dispose();
    };
  }, [shadowTex]);

  return (
    <group>
      {/* Tight contact grounding shadow under tires */}
      {shadowTex && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[4.2, 2.2]} />
          <meshBasicMaterial map={shadowTex} transparent opacity={0.90} depthWrite={false} />
        </mesh>
      )}

      {/* Dark charcoal studio floor — rough, non-reflective, zero white pool */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial
          color="#040506"
          roughness={0.96}
          metalness={0.05}
        />
      </mesh>
    </group>
  );
}

/** Photographic camera rig: low angle, cinematic framing, negative space on left. */
function CameraRig({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const initializedCam = useRef(false);

  useFrame((state, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const p = reducedMotion ? 0.45 : scrollProgress.get();

    let x: number, y: number, z: number;
    let lx: number, ly: number, lz: number;
    let fov: number;

    if (p < 0.30) {
      // FRAME A — Dark Machine: photographic low 3/4 pose, negative black space on left
      const t = smoothstep(p / 0.30);
      x = 2.25 - t * 0.10;
      y = 0.48 + t * 0.02;
      z = 3.75 - t * 0.15;
      lx = -0.25; ly = 0.32; lz = 0.08;
      fov = 33.5;
    } else if (p < 0.70) {
      // FRAME B — Campaign Hero: car occupies ~78-82% width, low powerful stance
      const t = smoothstep((p - 0.30) / 0.40);
      x = 2.15 - t * 0.20;
      y = 0.50 - t * 0.02;
      z = 3.60 - t * 0.25;
      lx = -0.20 - t * 0.02;
      ly = 0.32;
      lz = 0.10 + t * 0.04;
      fov = 34 + t * 1.5;
    } else {
      // FRAME C — Detail Push into front wheel / fender before dark aperture handoff
      const t = smoothstep((p - 0.70) / 0.30);
      x = 1.95 - t * 0.95;
      y = 0.48 - t * 0.24;
      z = 3.35 - t * 1.65;
      lx = -0.22 + t * 0.70;
      ly = 0.32 - t * 0.10;
      lz = 0.14 + t * 0.65;
      fov = 35.5 - t * 8.0;
    }

    // Mobile / Portrait aspect compensation
    const aspect = state.size.width / state.size.height;
    if (aspect < 0.8) {
      const portraitFactor = Math.min(1, (0.8 - aspect) / 0.35);
      z *= 1 + 0.28 * portraitFactor;
      y += 0.05 * portraitFactor;
      fov += 8 * portraitFactor;
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

    cam.position.lerp(targetPos.current, Math.min(1, delta * 12));
    cam.getWorldDirection(currentLook.current);
    currentLook.current.lerp(desiredDir, Math.min(1, delta * 12));
    cam.lookAt(cam.position.clone().add(currentLook.current));

    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, fov, Math.min(1, delta * 12));
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

export function HeroStudio({
  scrollProgress,
  reducedMotion,
  active = true,
}: {
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
  active?: boolean;
}) {
  return (
    <CanvasErrorBoundary>
      <Canvas
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        dpr={[1, 1.5]}
        camera={{ position: [2.25, 0.48, 3.75], fov: 33.5 }}
        frameloop="always"
        shadows={false}
      >
        <fog attach="fog" args={["#030405", 10, 26]} />
        <Suspense fallback={null}>
          <StudioLights scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
          <Environment preset="studio" environmentIntensity={0.16} />
          <StudioEnvironment />
          <CarModel scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        </Suspense>
        <CameraRig scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      </Canvas>
    </CanvasErrorBoundary>
  );
}

useGLTF.preload("/models/hero-car.glb");
