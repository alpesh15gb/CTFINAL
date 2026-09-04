"use client";

import { Component, ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

/**
 * ObsidianStudio — APEX-grade dark showroom for the CARTUNEZ Dark Machine hero.
 * Deep obsidian paint, neutral-white spot rig, volumetric beam cones,
 * near-black floor. Scroll progress 0→1 drives light ramp + camera push.
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

  // Obsidian paint per art direction: near-black metallic, clearcoat, bright reflections
  const materials = useMemo(() => {
    return {
      paint: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#0b0b0c"),
        metalness: 0.8,
        roughness: 0.15,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        reflectivity: 0.9,
        envMapIntensity: 1.5,
      }),
      carbon: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#101114"),
        metalness: 0.5,
        roughness: 0.4,
        envMapIntensity: 0.6,
      }),
      rims: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#8f959b"),
        metalness: 0.9,
        roughness: 0.28,
        envMapIntensity: 1.2,
      }),
      caliper: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#2a2d31"),
        metalness: 0.85,
        roughness: 0.32,
        envMapIntensity: 0.7,
      }),
      tire: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#0a0b0c"),
        metalness: 0.0,
        roughness: 0.96,
        envMapIntensity: 0.04,
      }),
      glass: new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#07090c"),
        metalness: 0.1,
        roughness: 0.08,
        transmission: 0.5,
        transparent: true,
        opacity: 0.95,
        ior: 1.5,
      }),
      lights: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#ffffff"),
        metalness: 0.2,
        roughness: 0.08,
        emissive: new THREE.Color("#dfe6ee"),
        emissiveIntensity: 0.5,
      }),
      exhaust: new THREE.MeshStandardMaterial({
        color: new THREE.Color("#5c636b"),
        metalness: 0.92,
        roughness: 0.2,
      }),
    };
  }, []);

  useEffect(() => {
    return () => {
      Object.values(materials).forEach((mat) => mat.dispose());
    };
  }, [materials]);

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
        } else if (name.includes("tire") || name.includes("tire")) {
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
        innerRef.current.position.set(-center.current.x, -center.current.y - minY, -center.current.z);
      }
      groupRef.current.rotation.y = reducedMotion ? 0.08 : -0.04;
      initialized.current = true;
      return;
    }
    if (reducedMotion) {
      groupRef.current.rotation.y = 0.08;
      return;
    }
    const p = scrollProgress.get();
    const targetRotation = -0.04 + p * 0.14;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(groupRef.current.rotation.y, targetRotation, Math.min(1, delta * 12));
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]} rotation={[0, -0.04, 0]}>
      <group ref={innerRef}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

/** Neutral-white spot rig. Opens near-black; ramps with scroll. No color cast. */
function StudioLights({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const keyRef = useRef<THREE.DirectionalLight>(null);
  const rimRef = useRef<THREE.SpotLight>(null);
  const fillRef = useRef<THREE.DirectionalLight>(null);
  const stripRef = useRef<THREE.SpotLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const p = reducedMotion ? 0.5 : scrollProgress.get();
    const ramp = smoothstep(p / 0.2); // 0→1 across the opening darkness
    const reveal = smoothstep((p - 0.14) / 0.42);
    if (keyRef.current) keyRef.current.intensity = (0.04 + reveal * 1.6) * (0.12 + 0.88 * ramp);
    if (rimRef.current) rimRef.current.intensity = 0.12 + ramp * 2.4;
    if (fillRef.current) fillRef.current.intensity = 0.04 + reveal * 0.5;
    if (stripRef.current) stripRef.current.intensity = ramp * 3.2;
  });

  return (
    <>
      <primitive object={target} position={[-0.1, 0.35, 0.15]} />
      <ambientLight intensity={0.05} />

      {/* Broad overhead softbox */}
      <directionalLight ref={keyRef} position={[3.2, 5.2, 3.4]} intensity={0.4} color="#f4f1ea" />
      {/* Narrow rim — traces shoulder lines out of the dark */}
      <spotLight
        ref={rimRef}
        position={[-4.6, 3.4, -3.8]}
        target={target}
        angle={0.55}
        penumbra={0.9}
        intensity={1.0}
        color="#ffffff"
        distance={24}
        decay={1.2}
      />
      {/* Subtle front fill */}
      <directionalLight ref={fillRef} position={[-2.8, 1.6, 3.6]} intensity={0.15} color="#e8e6e1" />
      {/* Overhead strip softbox shimmer on the bonnet */}
      <spotLight
        ref={stripRef}
        position={[0.4, 4.4, 0.9]}
        angle={0.7}
        penumbra={1}
        intensity={1.2}
        color="#fdfbf6"
        distance={14}
        decay={1.4}
      />
    </>
  );
}

/** Fake-volumetric spotlight beams + emissive strip bars. Cheap, GPU-friendly. */
function BeamRig({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const matRef = useRef<THREE.MeshBasicMaterial>(null);
  useFrame(() => {
    const p = reducedMotion ? 0.5 : scrollProgress.get();
    if (matRef.current) matRef.current.opacity = 0.005 + smoothstep(p / 0.25) * 0.055;
  });
  const beams: Array<{ x: number; tilt: number }> = [
    { x: -1.7, tilt: 0.22 },
    { x: 0, tilt: 0.05 },
    { x: 1.7, tilt: -0.18 },
  ];
  return (
    <group>
      {beams.map((b, i) => (
        <group key={i} position={[b.x, 2.6, 0.2]} rotation={[0.1, 0, b.tilt]}>
          <mesh position={[0, 0.6, 0]}>
            <coneGeometry args={[1.05, 3.6, 24, 1, true]} />
            <meshBasicMaterial
              ref={i === 0 ? matRef : undefined}
              color="#fff6e8"
              transparent
              opacity={0.05}
              blending={THREE.AdditiveBlending}
              depthWrite={false}
              side={THREE.DoubleSide}
              fog={false}
            />
          </mesh>
          {/* Emissive strip bar */}
          <mesh position={[0, 2.45, 0]}>
            <boxGeometry args={[1.5, 0.035, 0.1]} />
            <meshBasicMaterial color="#f5f2ea" fog={false} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

function StudioFloor() {
  const shadowTex = useMemo(() => {
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 512;
    c.height = 256;
    const ctx = c.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, 512, 256);
      const rad = ctx.createRadialGradient(256, 128, 15, 256, 128, 110);
      rad.addColorStop(0, "rgba(0, 0, 0, 0.96)");
      rad.addColorStop(0.45, "rgba(0, 0, 0, 0.65)");
      rad.addColorStop(0.8, "rgba(0, 0, 0, 0.18)");
      rad.addColorStop(1, "rgba(0, 0, 0, 0)");
      ctx.fillStyle = rad;
      ctx.fillRect(0, 0, 512, 256);
    }
    return new THREE.CanvasTexture(c);
  }, []);

  useEffect(() => {
    return () => shadowTex?.dispose();
  }, [shadowTex]);

  return (
    <group>
      {shadowTex && (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.005, 0]}>
          <planeGeometry args={[4.4, 2.3]} />
          <meshBasicMaterial map={shadowTex} transparent opacity={0.92} depthWrite={false} />
        </mesh>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#020203" roughness={0.9} metalness={0.12} />
      </mesh>
    </group>
  );
}

/** Low 3/4 camera: silhouette hold → dominant stance → detail push. */
function CameraRig({ scrollProgress, reducedMotion }: { scrollProgress: MotionValue<number>; reducedMotion: boolean }) {
  const { camera } = useThree();
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const ready = useRef(false);

  useFrame((state, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const p = reducedMotion ? 0.45 : scrollProgress.get();
    let x: number, y: number, z: number, lx: number, ly: number, lz: number, fov: number;

    if (p < 0.36) {
      const t = smoothstep(p / 0.36);
      x = 2.3 - t * 0.12;
      y = 0.5 + t * 0.02;
      z = 3.85 - t * 0.2;
      lx = -0.25; ly = 0.32; lz = 0.08;
      fov = 33.5;
    } else if (p < 0.62) {
      const t = smoothstep((p - 0.36) / 0.26);
      x = 2.18 - t * 0.22;
      y = 0.52 - t * 0.03;
      z = 3.65 - t * 0.3;
      lx = -0.22; ly = 0.32; lz = 0.1 + t * 0.04;
      fov = 33.5 + t * 1.5;
    } else {
      const t = smoothstep((p - 0.62) / 0.38);
      x = 1.96 - t * 0.95;
      y = 0.49 - t * 0.24;
      z = 3.35 - t * 1.6;
      lx = -0.22 + t * 0.72;
      ly = 0.32 - t * 0.1;
      lz = 0.14 + t * 0.64;
      fov = 35 - t * 7.5;
    }

    const aspect = state.size.width / state.size.height;
    if (aspect < 0.8) {
      const pf = Math.min(1, (0.8 - aspect) / 0.35);
      z *= 1 + 0.3 * pf;
      y += 0.05 * pf;
      fov += 8 * pf;
    }

    targetPos.current.set(x, y, z);
    targetLook.current.set(lx, ly, lz);
    const dir = targetLook.current.clone().sub(targetPos.current).normalize();

    if (!ready.current) {
      cam.position.copy(targetPos.current);
      currentLook.current.copy(dir);
      cam.lookAt(targetPos.current.clone().add(dir));
      cam.fov = fov;
      cam.updateProjectionMatrix();
      ready.current = true;
      return;
    }
    cam.position.lerp(targetPos.current, Math.min(1, delta * 12));
    cam.getWorldDirection(currentLook.current);
    currentLook.current.lerp(dir, Math.min(1, delta * 12));
    cam.lookAt(cam.position.clone().add(currentLook.current));
    if (Math.abs(cam.fov - fov) > 0.05) {
      cam.fov = THREE.MathUtils.lerp(cam.fov, fov, Math.min(1, delta * 12));
      cam.updateProjectionMatrix();
    }
  });
  return null;
}

export function ObsidianStudio({
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
        camera={{ position: [2.3, 0.5, 3.85], fov: 33.5 }}
        frameloop={active ? "always" : "never"}
        shadows={false}
      >
        <fog attach="fog" args={["#020202", 10, 26]} />
        <Suspense fallback={null}>
          <StudioLights scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
          <Environment preset="studio" environmentIntensity={0.14} />
          <StudioFloor />
          <BeamRig scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
          <CarModel scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        </Suspense>
        <CameraRig scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      </Canvas>
    </CanvasErrorBoundary>
  );
}

useGLTF.preload("/models/hero-car.glb");
