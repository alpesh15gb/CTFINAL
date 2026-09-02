"use client";

import { Component, ReactNode, Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

const HERO_MODEL = "/models/huracan.glb";

function clamp01(value: number) {
  return Math.min(1, Math.max(0, value));
}

function smoothstep(value: number) {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
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

function tuneMaterial(material: THREE.Material, key: string) {
  const tuned = material.clone();

  if (tuned instanceof THREE.MeshStandardMaterial || tuned instanceof THREE.MeshPhysicalMaterial) {
    const body =
      key.includes("body") ||
      key.includes("paint") ||
      key.includes("carpaint") ||
      key.includes("exterior") ||
      key.includes("livery");
    const tire = key.includes("tire") || key.includes("tyre") || key.includes("rubber");
    const wheel = key.includes("wheel") || key.includes("rim") || key.includes("alloy");
    const glass = key.includes("glass") || key.includes("window") || key.includes("windshield");
    const light =
      key.includes("light") ||
      key.includes("lamp") ||
      key.includes("head") ||
      key.includes("tail");
    const carbon = key.includes("carbon") || key.includes("splitter") || key.includes("diffuser");

    if (body) {
      tuned.color.set("#151719");
      tuned.metalness = 0.72;
      tuned.roughness = 0.2;
      tuned.envMapIntensity = 1.55;
      if (tuned instanceof THREE.MeshPhysicalMaterial) {
        tuned.clearcoat = 0.9;
        tuned.clearcoatRoughness = 0.08;
      }
    } else if (tire) {
      tuned.color.set("#08090a");
      tuned.metalness = 0;
      tuned.roughness = 0.95;
      tuned.envMapIntensity = 0.08;
    } else if (wheel) {
      tuned.color.set("#676c72");
      tuned.metalness = 0.95;
      tuned.roughness = 0.18;
      tuned.envMapIntensity = 1.8;
    } else if (carbon) {
      tuned.color.multiplyScalar(0.45);
      tuned.metalness = Math.max(tuned.metalness, 0.45);
      tuned.roughness = Math.max(tuned.roughness, 0.32);
    } else if (glass) {
      tuned.color.set("#080a0c");
      tuned.metalness = 0.1;
      tuned.roughness = 0.08;
      tuned.transparent = true;
      tuned.opacity = 0.84;
    } else if (light) {
      tuned.envMapIntensity = 1.6;
      if ("emissive" in tuned) {
        tuned.emissive = new THREE.Color("#f3f7ff");
        tuned.emissiveIntensity = 0.55;
      }
    } else {
      tuned.envMapIntensity = Math.max(tuned.envMapIntensity ?? 1, 0.9);
      tuned.roughness = Math.min(Math.max(tuned.roughness, 0.18), 0.72);
    }
  }

  return tuned;
}

function HuracanModel({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const group = useRef<THREE.Group>(null);
  const inner = useRef<THREE.Group>(null);
  const initialized = useRef(false);
  const { scene } = useGLTF(HERO_MODEL);

  const clone = useMemo(() => {
    const next = scene.clone(true);

    next.traverse((child) => {
      if (!(child instanceof THREE.Mesh)) return;

      child.castShadow = false;
      child.receiveShadow = false;

      const meshName = (child.name || "").toLowerCase();
      if (Array.isArray(child.material)) {
        child.material = child.material.map((material) =>
          tuneMaterial(material, `${meshName} ${(material.name || "").toLowerCase()}`)
        );
      } else if (child.material) {
        child.material = tuneMaterial(
          child.material,
          `${meshName} ${(child.material.name || "").toLowerCase()}`
        );
      }
    });

    return next;
  }, [scene]);

  useEffect(() => {
    initialized.current = false;
    return () => {
      clone.traverse((child) => {
        if (!(child instanceof THREE.Mesh)) return;
        const materials = Array.isArray(child.material) ? child.material : [child.material];
        materials.forEach((material) => material?.dispose());
      });
    };
  }, [clone]);

  useFrame((_, delta) => {
    if (!group.current || !inner.current) return;

    if (!initialized.current) {
      const bounds = new THREE.Box3().setFromObject(clone);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      bounds.getCenter(center);
      bounds.getSize(size);

      const longest = Math.max(size.x, size.y, size.z) || 1;
      const scale = 4.35 / longest;
      group.current.scale.setScalar(scale);

      const floorOffset = bounds.min.y - center.y;
      inner.current.position.set(-center.x, -center.y - floorOffset, -center.z);

      group.current.rotation.y = -0.28;
      initialized.current = true;
    }

    if (reducedMotion) {
      group.current.rotation.y = -0.24;
      return;
    }

    const progress = scrollProgress.get();
    const targetRotation = -0.34 + progress * 0.24;
    group.current.rotation.y = THREE.MathUtils.lerp(
      group.current.rotation.y,
      targetRotation,
      Math.min(1, delta * 8)
    );
  });

  return (
    <group ref={group} position={[0.28, 0, 0]}>
      <group ref={inner}>
        <primitive object={clone} />
      </group>
    </group>
  );
}

function Lighting({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const key = useRef<THREE.SpotLight>(null);
  const rim = useRef<THREE.SpotLight>(null);
  const front = useRef<THREE.DirectionalLight>(null);
  const target = useMemo(() => new THREE.Object3D(), []);

  useFrame(() => {
    const p = reducedMotion ? 0.45 : scrollProgress.get();

    if (key.current) key.current.intensity = 5.2 + smoothstep((p - 0.08) / 0.4) * 2.4;
    if (rim.current) rim.current.intensity = 4.6 + (1 - smoothstep(p / 0.55)) * 2.2;
    if (front.current) front.current.intensity = 0.75 + smoothstep((p - 0.2) / 0.5) * 0.45;
  });

  return (
    <>
      <primitive object={target} position={[0.15, 0.55, 0]} />
      <ambientLight intensity={0.14} />
      <spotLight
        ref={key}
        position={[4.8, 6.5, 4.2]}
        target={target}
        angle={0.58}
        penumbra={0.92}
        intensity={5.4}
        color="#f6f7f8"
        distance={24}
        decay={1.8}
      />
      <spotLight
        ref={rim}
        position={[-5.8, 3.2, -4.5]}
        target={target}
        angle={0.72}
        penumbra={0.86}
        intensity={5.2}
        color="#dce5ee"
        distance={28}
        decay={1.6}
      />
      <directionalLight
        ref={front}
        position={[-3.4, 1.5, 4.8]}
        intensity={0.9}
        color="#e9edf1"
      />
    </>
  );
}

function DarkStudioFloor() {
  return (
    <>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]}>
        <planeGeometry args={[70, 70]} />
        <meshStandardMaterial color="#030303" roughness={0.94} metalness={0.08} />
      </mesh>
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0.35, 0, 0]}>
        <circleGeometry args={[3.5, 64]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.44} depthWrite={false} />
      </mesh>
    </>
  );
}

function CameraRig({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const targetPosition = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());
  const currentLook = useRef(new THREE.Vector3());
  const initialized = useRef(false);

  useFrame((state, delta) => {
    const cam = camera as THREE.PerspectiveCamera;
    const p = reducedMotion ? 0.38 : scrollProgress.get();

    let x: number;
    let y: number;
    let z: number;
    let lx: number;
    let ly: number;
    let lz: number;
    let fov: number;

    if (p < 0.3) {
      const t = smoothstep(p / 0.3);
      x = 3.9 - t * 0.28;
      y = 1.0 - t * 0.08;
      z = 5.05 - t * 0.35;
      lx = -0.2;
      ly = 0.48;
      lz = 0.12;
      fov = 30.5;
    } else if (p < 0.72) {
      const t = smoothstep((p - 0.3) / 0.42);
      x = 3.62 - t * 0.45;
      y = 0.92 - t * 0.08;
      z = 4.7 - t * 0.5;
      lx = -0.12 + t * 0.16;
      ly = 0.46;
      lz = 0.1 + t * 0.08;
      fov = 31 + t * 1.8;
    } else {
      const t = smoothstep((p - 0.72) / 0.28);
      x = 3.17 - t * 1.5;
      y = 0.84 - t * 0.3;
      z = 4.2 - t * 2.1;
      lx = 0.04 + t * 0.65;
      ly = 0.46 - t * 0.18;
      lz = 0.18 + t * 0.5;
      fov = 32.8 - t * 6;
    }

    const aspect = state.size.width / state.size.height;
    if (aspect < 0.85) {
      const portrait = Math.min(1, (0.85 - aspect) / 0.45);
      z *= 1 + 0.34 * portrait;
      x *= 1 - 0.08 * portrait;
      y += 0.12 * portrait;
      fov += 8 * portrait;
    }

    targetPosition.current.set(x, y, z);
    targetLook.current.set(lx, ly, lz);
    const direction = targetLook.current.clone().sub(targetPosition.current).normalize();

    if (!initialized.current) {
      cam.position.copy(targetPosition.current);
      currentLook.current.copy(direction);
      cam.lookAt(targetPosition.current.clone().add(direction));
      cam.fov = fov;
      cam.updateProjectionMatrix();
      initialized.current = true;
      return;
    }

    cam.position.lerp(targetPosition.current, Math.min(1, delta * 9));
    cam.getWorldDirection(currentLook.current);
    currentLook.current.lerp(direction, Math.min(1, delta * 9));
    cam.lookAt(cam.position.clone().add(currentLook.current));
    cam.fov = THREE.MathUtils.lerp(cam.fov, fov, Math.min(1, delta * 9));
    cam.updateProjectionMatrix();
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
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
        }}
        dpr={[1, 1.45]}
        camera={{ position: [3.9, 1, 5.05], fov: 30.5 }}
        frameloop={active ? "always" : "never"}
        shadows={false}
      >
        <fog attach="fog" args={["#020202", 9, 24]} />
        <Suspense fallback={null}>
          <Environment preset="studio" environmentIntensity={0.38} />
          <Lighting scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
          <DarkStudioFloor />
          <HuracanModel scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        </Suspense>
        <CameraRig scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
      </Canvas>
    </CanvasErrorBoundary>
  );
}

useGLTF.preload(HERO_MODEL);
