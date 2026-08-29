"use client";

import { Component, ReactNode, Suspense, useEffect, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, useGLTF } from "@react-three/drei";
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
    const targetRotation = -Math.PI * 0.15 + p * Math.PI * 0.6;
    groupRef.current.rotation.y = THREE.MathUtils.lerp(
      groupRef.current.rotation.y,
      targetRotation,
      delta * 3
    );
  });

  return (
    <group ref={groupRef} rotation={[0, -Math.PI * 0.15, 0]}>
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
  const initialPosition = useRef(new THREE.Vector3(3.5, 1.2, 4.5));

  useFrame(() => {
    if (reducedMotion) {
      camera.position.copy(initialPosition.current);
      camera.lookAt(0, 0, 0);
      return;
    }
    const p = scrollProgress.get();
    // Ease-in push: full vehicle, then camera drives toward the front detail
    const push = p * p;
    const x = 3.5 - push * 2.6;
    const y = 1.2 - push * 0.85;
    const z = 4.5 - push * 2.6;
    camera.position.set(x, y, z);
    // Aim shifts from centre to the front wheel as we push in
    camera.lookAt(0.6 * push, 0.1 - 0.2 * push, 0.6 * push);
  });

  return null;
}

function StudioLighting() {
  return (
    <>
      <ambientLight intensity={0.3} />
      <spotLight
        position={[5, 8, 6]}
        angle={0.35}
        penumbra={0.5}
        intensity={100}
        color="#f2f2f2"
      />
      <spotLight
        position={[-6, 3, -4]}
        angle={0.6}
        penumbra={0.8}
        intensity={60}
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
          dpr={[1, 1]}
          camera={{ position: [3.5, 1.2, 4.5], fov: 35 }}
          frameloop={active && !reducedMotion ? "always" : "demand"}
          shadows={false}
        >
          <color attach="background" args={["#000000"]} />
          <fog attach="fog" args={["#000000", 8, 20]} />
          <Suspense fallback={null}>
            <StudioLighting />
            <Environment preset="city" environmentIntensity={0.2} />
            <CarModel scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
          </Suspense>
          <CameraRig scrollProgress={scrollProgress} reducedMotion={reducedMotion} />
        </Canvas>
      </CanvasErrorBoundary>
    </div>
  );
}
