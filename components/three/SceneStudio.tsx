"use client";

import { Suspense, useEffect, useLayoutEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import { type MotionValue } from "framer-motion";
import * as THREE from "three";
import { type Finish } from "@/components/daylight/hero-config";

type SceneProps = {
  progress: MotionValue<number>;
  finish: Finish;
  active: boolean;
  onReady: () => void;
  onError: () => void;
};

function Vehicle({ finish, onReady }: Pick<SceneProps, "finish" | "onReady">) {
  const { scene } = useGLTF("/models/jaguar.glb");
  const invalidate = useThree((state) => state.invalidate);
  const paint = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#c91f16"),
        metalness: 0.65,
        roughness: 0.25,
        clearcoat: 1,
        clearcoatRoughness: 0.12,
      }),
    []
  );
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#29363d"),
        metalness: 0.25,
        roughness: 0.12,
        transparent: true,
        opacity: 0.86,
      }),
    []
  );
  const targetColor = useRef(new THREE.Color("#c91f16"));
  // Clone materials as well as the scene; never repaint the loader's shared cache.
  const model = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((object) => {
      if (!(object instanceof THREE.Mesh)) return;
      const source = Array.isArray(object.material) ? object.material[0] : object.material;
      const matName = (source?.name || "").toLowerCase();
      if (matName.includes("paint_material1") || matName === "color_2" || matName.includes("coloured_material1")) {
        object.material = paint;
      } else if (matName.includes("window_material1") || matName.includes("red_glass")) {
        object.material = glass;
      } else {
        const materials = (Array.isArray(object.material) ? object.material : [object.material]).map((material) => material.clone());
        object.material = Array.isArray(object.material) ? materials : materials[0];
      }
    });
    const bounds = new THREE.Box3().setFromObject(clone);
    const center = bounds.getCenter(new THREE.Vector3());
    const size = bounds.getSize(new THREE.Vector3());
    const scale = 4.4 / Math.max(size.x, size.y, size.z);
    clone.scale.setScalar(scale);
    clone.position.set(-center.x * scale, -bounds.min.y * scale + .015, -center.z * scale);
    return clone;
  }, [scene, paint, glass]);

  useLayoutEffect(() => {
    targetColor.current.set(finish.hex);
    paint.color.set(finish.hex);
    invalidate();
  }, [finish, paint, invalidate]);

  useFrame((_, delta) => {
    const k = Math.min(1, delta * 4);
    paint.color.lerp(targetColor.current, k);
  });

  useEffect(() => {
    onReady();
    return () => {
      model.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
    };
  }, [model]); // onReady only signals the loaded scene; it does not control resources.

  return <primitive object={model} dispose={null} />;
}

function CameraRig({ progress, active }: Pick<SceneProps, "progress" | "active">) {
  const invalidate = useThree((state) => state.invalidate);
  const size = useThree((state) => state.size);
  const target = useRef(new THREE.Vector3(0, .5, 0));

  useEffect(() => {
    if (!active) return;
    invalidate();
    return progress.on("change", () => invalidate());
  }, [progress, active, invalidate]);

  useEffect(() => { if (active) invalidate(); }, [size, active, invalidate]);

  useFrame(({ camera }) => {
    if (!active) return;
    const p = THREE.MathUtils.clamp(progress.get(), 0, 1);
    // Front three-quarter -> broadside -> elevated rear. Scroll is the only clock.
    const keys = [0, .38, .7, 1];
    const angles = [2.38, 1.55, .3, -.6];
    const elevations = [1.35, .95, 2.9, 1.7];
    const radii = [5.4, 5.8, 5.5, 5.6];
    const segment = p < keys[1] ? 0 : p < keys[2] ? 1 : 2;
    const t = THREE.MathUtils.smoothstep(p, keys[segment], keys[segment + 1]);
    const angle = THREE.MathUtils.lerp(angles[segment], angles[segment + 1], t);
    const elevation = THREE.MathUtils.lerp(elevations[segment], elevations[segment + 1], t);
    const radius = THREE.MathUtils.lerp(radii[segment], radii[segment + 1], t);
    const perspective = camera as THREE.PerspectiveCamera;
    // Fit the long side in narrow stage viewports without cropping the wheels.
    const fov = 35;
    const aspect = size.width / Math.max(size.height, 1);
    const fit = Math.max(1, 1.55 / aspect);
    perspective.position.set(Math.sin(angle) * radius * fit, elevation * fit, Math.cos(angle) * radius * fit);
    perspective.fov = fov;
    perspective.lookAt(target.current);
    perspective.updateProjectionMatrix();
  });
  return null;
}

function StudioFloor() {
  const shadow = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 128;
    canvas.height = 128;
    const context = canvas.getContext("2d")!;
    const gradient = context.createRadialGradient(64, 64, 10, 64, 64, 64);
    gradient.addColorStop(0, "rgba(30,28,24,.52)");
    gradient.addColorStop(.5, "rgba(30,28,24,.26)");
    gradient.addColorStop(1, "rgba(30,28,24,0)");
    context.fillStyle = gradient;
    context.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(canvas);
  }, []);
  useEffect(() => () => shadow.dispose(), [shadow]);
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, .005, 0]}>
      <planeGeometry args={[3.6, 6.2]} />
      <meshBasicMaterial map={shadow} transparent depthWrite={false} />
    </mesh>
  );
}

function ContextMonitor({ onError }: Pick<SceneProps, "onError">) {
  const gl = useThree((state) => state.gl);
  useEffect(() => {
    const lost = (event: Event) => { event.preventDefault(); onError(); };
    gl.domElement.addEventListener("webglcontextlost", lost);
    return () => gl.domElement.removeEventListener("webglcontextlost", lost);
  }, [gl, onError]);
  return null;
}

export function SceneStudio({ progress, finish, active, onReady, onError }: SceneProps) {
  return (
    <Canvas frameloop="demand" dpr={[1, 1.5]} gl={{ antialias: true, alpha: true, powerPreference: "high-performance", preserveDrawingBuffer: new URLSearchParams(window.location.search).has("heroCapture") }} camera={{ position: [4.6, 1.35, -4.9], fov: 35 }} fallback={<span>3D is unavailable. Showing the studio photograph.</span>}>
      <ContextMonitor onError={onError} />
      <ambientLight intensity={.5} />
      <directionalLight position={[3, 6, -4]} intensity={3} color="#fff5e4" />
      <directionalLight position={[-4, 3, 2]} intensity={2} color="#d7e9ff" />
      <Suspense fallback={null}>
        <Environment files="/env/studio_small_03_1k.hdr" environmentIntensity={1.1} />
        <Vehicle finish={finish} onReady={onReady} />
        <StudioFloor />
      </Suspense>
      <CameraRig progress={progress} active={active} />
    </Canvas>
  );
}

useGLTF.preload("/models/jaguar.glb");
