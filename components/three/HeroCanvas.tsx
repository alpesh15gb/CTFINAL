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
      return (
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-raised" />
      );
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
    // Extended rotation for the longer scroll range
    const targetRotation = -Math.PI * 0.25 + p * Math.PI * 1.1;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      delta * 3
    );
  });

  return (
    <group ref={groupRef} rotation={[0, -Math.PI * 0.25, 0]}>
      <primitive object={scene} />
    </group>
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
  const initialPosition = useRef(new THREE.Vector3(4.5, 1.8, 6));

  useFrame(() => {
    if (reducedMotion) {
      camera.position.copy(initialPosition.current);
      camera.lookAt(0, 0, 0);
      return;
    }
    const p = scrollProgress.get();

    // Multi-phase camera choreography
    // Phase 1 (0–0.2): Wide establishing shot, slowly approaching
    // Phase 2 (0.2–0.5): Orbit around the vehicle, closer
    // Phase 3 (0.5–0.75): Push toward front detail
    // Phase 4 (0.75–1): Pull back slightly for exit

    let x: number, y: number, z: number;
    let lookX: number, lookY: number, lookZ: number;

    if (p < 0.2) {
      const t = p / 0.2;
      x = 4.5 - t * 1.0;
      y = 1.8 - t * 0.3;
      z = 6 - t * 1.2;
      lookX = 0; lookY = 0; lookZ = 0;
    } else if (p < 0.5) {
      const t = (p - 0.2) / 0.3;
      x = 3.5 - t * 1.5;
      y = 1.5 - t * 0.4;
      z = 4.8 - t * 1.5;
      lookX = t * 0.3; lookY = -t * 0.1; lookZ = t * 0.2;
    } else if (p < 0.75) {
      const t = (p - 0.5) / 0.25;
      x = 2.0 - t * 1.2;
      y = 1.1 - t * 0.5;
      z = 3.3 - t * 1.5;
      lookX = 0.3 + t * 0.4; lookY = -0.1 - t * 0.15; lookZ = 0.2 + t * 0.4;
    } else {
      const t = (p - 0.75) / 0.25;
      x = 0.8 + t * 1.5;
      y = 0.6 + t * 0.6;
      z = 1.8 + t * 2.0;
      lookX = 0.7 - t * 0.3; lookY = -0.25 + t * 0.1; lookZ = 0.6 - t * 0.3;
    }

    camera.position.set(x, y, z);
    camera.lookAt(lookX, lookY, lookZ);
  });

  return null;
}

function StudioLighting({ scrollProgress }: { scrollProgress: MotionValue<number> }) {
  const keyLightRef = useRef<THREE.SpotLight>(null);
  const fillLightRef = useRef<THREE.SpotLight>(null);

  useFrame(() => {
    const p = scrollProgress.get();
    // Light intensity evolves with scroll — starts dim, peaks mid, settles
    if (keyLightRef.current) {
      const intensity = p < 0.15 ? 20 + p * 500 : p < 0.6 ? 100 : 100 - (p - 0.6) * 80;
      keyLightRef.current.intensity = Math.max(20, intensity);
    }
    if (fillLightRef.current) {
      const intensity = p < 0.15 ? 10 + p * 300 : p < 0.6 ? 60 : 60 - (p - 0.6) * 50;
      fillLightRef.current.intensity = Math.max(10, intensity);
    }
  });

  return (
    <>
      <ambientLight intensity={0.15} />
      <spotLight
        ref={keyLightRef}
        position={[5, 8, 6]}
        angle={0.35}
        penumbra={0.5}
        intensity={20}
        color="#f2f2f2"
      />
      <spotLight
        ref={fillLightRef}
        position={[-6, 3, -4]}
        angle={0.6}
        penumbra={0.8}
        intensity={10}
        color="#02bbfc"
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
    <div className="absolute inset-0 z-0">
      <CanvasErrorBoundary>
        <Canvas
          gl={{ antialias: false, alpha: false, powerPreference: "high-performance", failIfMajorPerformanceCaveat: false }}
          dpr={[1, 1.5]}
          camera={{ position: [4.5, 1.8, 6], fov: 35 }}
          frameloop={active && !reducedMotion ? "always" : "demand"}
          shadows={false}
        >
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 8, 22]} />
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
