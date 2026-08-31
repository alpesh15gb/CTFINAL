"use client";

import { Component, ReactNode, Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { MotionValue } from "framer-motion";
import * as THREE from "three";

class CanvasErrorBoundary extends Component<{ children: ReactNode }, { hasError: boolean }> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  render() {
    if (this.state.hasError) {
      return null;
    }
    return this.props.children;
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
      groupRef.current.position.set(-center.current.x * scale, -center.current.y * scale - 0.3, -center.current.z * scale);
      initialized.current = true;
    }

    if (reducedMotion) {
      groupRef.current.rotation.y = -Math.PI * 0.15;
      return;
    }

    const p = scrollProgress.get();
    // Subtle vehicle orientation change — camera does the moving
    const targetRotation = -Math.PI * 0.15 + p * Math.PI * 0.2;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      delta * 2
    );
  });

  return (
    <group ref={groupRef} rotation={[0, -Math.PI * 0.25, 0]}>
      <primitive object={scene} />
    </group>
  );
}

function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

function CameraRig({
  scrollProgress,
  reducedMotion,
}: {
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
}) {
  const { camera } = useThree();
  const initialPosition = useRef(new THREE.Vector3(5, 2, 7));
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame((_, delta) => {
    if (reducedMotion) {
      camera.position.copy(initialPosition.current);
      camera.lookAt(0, 0, 0);
      return;
    }
    const p = scrollProgress.get();

    let x: number, y: number, z: number;
    let lookX: number, lookY: number, lookZ: number;

    if (p < 0.2) {
      // Phase 1: Wide establishing shot, slowly approaching
      const t = smoothstep(p / 0.2);
      x = 5 - t * 1.2;
      y = 2 - t * 0.3;
      z = 7 - t * 1.5;
      lookX = 0; lookY = 0; lookZ = 0;
    } else if (p < 0.5) {
      // Phase 2: Slow dolly closer with gentle lateral movement
      const t = smoothstep((p - 0.2) / 0.3);
      x = 3.8 - t * 1.0;
      y = 1.7 - t * 0.3;
      z = 5.5 - t * 1.2;
      lookX = t * 0.2; lookY = -t * 0.05; lookZ = t * 0.1;
    } else if (p < 0.75) {
      // Phase 3: Push toward front-quarter detail
      const t = smoothstep((p - 0.5) / 0.25);
      x = 2.8 - t * 0.8;
      y = 1.4 - t * 0.3;
      z = 4.3 - t * 1.0;
      lookX = 0.2 + t * 0.2; lookY = -0.05 - t * 0.1; lookZ = 0.1 + t * 0.2;
    } else {
      // Phase 4: Gentle pullback for controlled exit
      const t = smoothstep((p - 0.75) / 0.25);
      x = 2.0 + t * 1.5;
      y = 1.1 + t * 0.5;
      z = 3.3 + t * 2.0;
      lookX = 0.4 - t * 0.2; lookY = -0.15 + t * 0.05; lookZ = 0.3 - t * 0.15;
    }

    targetPos.current.set(x, y, z);
    targetLook.current.set(lookX, lookY, lookZ);

    // Smooth interpolation for extra cinematic lag
    camera.position.lerp(targetPos.current, Math.min(1, delta * 4));
    const currentLook = new THREE.Vector3();
    camera.getWorldDirection(currentLook);
    const desiredDir = targetLook.current.clone().sub(camera.position).normalize();
    currentLook.lerp(desiredDir, Math.min(1, delta * 4));
    camera.lookAt(camera.position.clone().add(currentLook));
  });

  return null;
}

function StudioLighting({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const keyLightRef = useRef<THREE.SpotLight>(null);
  const fillLightRef = useRef<THREE.SpotLight>(null);
  const rimLightRef = useRef<THREE.SpotLight>(null);

  useFrame(() => {
    const p = scrollProgress.get();

    if (keyLightRef.current) {
      // Key light: barely visible at start, builds through reveal, holds steady
      let intensity: number;
      if (p < 0.1) {
        intensity = 5 + p * 80; // 5 → 13
      } else if (p < 0.35) {
        intensity = 13 + (p - 0.1) * 320; // 13 → 93
      } else if (p < 0.7) {
        intensity = 93; // hold
      } else {
        intensity = 93 - (p - 0.7) * 100; // settle for exit
      }
      keyLightRef.current.intensity = Math.max(5, intensity);
    }

    if (fillLightRef.current) {
      // Cyan fill: very subtle accent, never dominant
      let intensity: number;
      if (p < 0.15) {
        intensity = 2 + p * 20;
      } else if (p < 0.5) {
        intensity = 5 + (p - 0.15) * 40; // 5 → 19
      } else if (p < 0.7) {
        intensity = 19;
      } else {
        intensity = 19 - (p - 0.7) * 30;
      }
      fillLightRef.current.intensity = Math.max(2, intensity);
    }

    if (rimLightRef.current) {
      // Rim/back light: provides edge definition in silhouette phase
      let intensity: number;
      if (p < 0.08) {
        intensity = 30; // visible edge in darkness
      } else if (p < 0.3) {
        intensity = 30 + (p - 0.08) * 200; // build
      } else if (p < 0.6) {
        intensity = 74;
      } else {
        intensity = 74 - (p - 0.6) * 80;
      }
      rimLightRef.current.intensity = Math.max(10, intensity);
    }
  });

  return (
    <>
      <ambientLight intensity={0.08} />
      <spotLight
        ref={keyLightRef}
        position={[5, 8, 6]}
        angle={0.35}
        penumbra={0.5}
        intensity={5}
        color="#f5f5f5"
      />
      <spotLight
        ref={fillLightRef}
        position={[-6, 3, -4]}
        angle={0.6}
        penumbra={0.8}
        intensity={2}
        color="#02bbfc"
      />
      <spotLight
        ref={rimLightRef}
        position={[-3, 5, -6]}
        angle={0.4}
        penumbra={0.6}
        intensity={30}
        color="#e8e8e8"
      />
    </>
  );
}

export function HeroCanvas({
  scrollProgress,
  reducedMotion,
  active,
}: {
  scrollProgress: MotionValue<number>;
  reducedMotion: boolean;
  active: boolean;
}) {
  return (
    <div className="absolute inset-0 z-[5]">
      <CanvasErrorBoundary>
        <Canvas
          gl={{ antialias: true, alpha: true, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
          dpr={[1, 1.5]}
          camera={{ position: [5, 2, 7], fov: 35 }}
          frameloop={active && !reducedMotion ? "always" : "demand"}
          shadows={false}
        >
          <fog attach="fog" args={["#030405", 8, 22]} />
          <Suspense fallback={null}>
            <StudioLighting scrollProgress={scrollProgress} />
            <Environment preset="city" environmentIntensity={0.15} />
            <CarModel scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
          </Suspense>
          <CameraRig scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
