"use client";

import { Suspense, useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, useGLTF } from "@react-three/drei";
import * as THREE from "three";

/**
 * SceneStudio — the Cartunez 3D hero observatory.
 * Scroll drives the camera orbit: silhouette → reveal → detail → convert.
 * Body shells are repainted at runtime; swatches lerp the clearcoat.
 */

export const MODEL_URL = "/models/huracan-eagle.glb";

export type Finish = { id: string; label: string; hex: string };
export const FINISHES: Finish[] = [
  { id: "obsidian", label: "Obsidian", hex: "#0b0b0c" },
  { id: "hyper-silver", label: "Hyper-Silver", hex: "#9aa2ab" },
  { id: "signal-red", label: "Signal Red", hex: "#a1120c" },
  { id: "azure", label: "Azure", hex: "#14536e" },
];

const BODY_MATS = ["palettematerial002", "palettematerial003"];
const GLASS_MATS = ["palettematerial001"];

function lerpAngle(a: number, b: number, t: number) {
  return a + (b - a) * t;
}

function CarModel({ finish }: { finish: Finish }) {
  const groupRef = useRef<THREE.Group>(null);
  const innerRef = useRef<THREE.Group>(null);
  const { scene } = useGLTF(MODEL_URL);
  const initialized = useRef(false);

  const paint = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color(FINISHES[0].hex),
        metalness: 0.82,
        roughness: 0.16,
        clearcoat: 1,
        clearcoatRoughness: 0.08,
        reflectivity: 0.9,
        envMapIntensity: 1.35,
      }),
    []
  );
  const glass = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: new THREE.Color("#07090c"),
        metalness: 0.1,
        roughness: 0.08,
        transmission: 0.5,
        transparent: true,
        opacity: 0.95,
        ior: 1.5,
      }),
    []
  );
  const targetColor = useRef(new THREE.Color(FINISHES[0].hex));

  useEffect(() => {
    targetColor.current.set(finish.hex);
  }, [finish]);

  useEffect(() => {
    return () => {
      paint.dispose();
      glass.dispose();
    };
  }, [paint, glass]);

  const clonedScene = useMemo(() => {
    const clone = scene.clone(true);
    clone.traverse((child) => {
      if ((child as THREE.Mesh).isMesh) {
        const mesh = child as THREE.Mesh;
        mesh.castShadow = false;
        mesh.receiveShadow = false;
        const matName = (Array.isArray(mesh.material) ? mesh.material[0]?.name : mesh.material?.name || "").toLowerCase();
        if (BODY_MATS.some((m) => matName.includes(m))) {
          mesh.material = paint;
        } else if (GLASS_MATS.some((m) => matName.includes(m))) {
          mesh.material = glass;
        }
      }
    });
    return clone;
  }, [scene, paint, glass]);

  useEffect(() => {
    initialized.current = false;
  }, [clonedScene]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;
    if (!initialized.current) {
      const box = new THREE.Box3().setFromObject(clonedScene);
      const center = new THREE.Vector3();
      const size = new THREE.Vector3();
      box.getCenter(center);
      box.getSize(size);
      const maxDim = Math.max(size.x, size.y, size.z);
      groupRef.current.scale.setScalar(3.3 / maxDim);
      if (innerRef.current) {
        const minY = box.min.y - center.y;
        innerRef.current.position.set(-center.x, -center.y - minY, -center.z);
      }
      initialized.current = true;
    }
    // finish lerp
    const k = Math.min(1, delta * 4);
    (paint.color as THREE.Color).lerp(targetColor.current, k);
  });

  return (
    <group ref={groupRef}>
      <group ref={innerRef}>
        <primitive object={clonedScene} />
      </group>
    </group>
  );
}

function CameraRig({ getP }: { getP: () => number }) {
  const cam = useRef({ az: 0.9, el: 0.16, r: 5.6 });
  const ready = useRef(false);

  useFrame((state, delta) => {
    const p = getP();
    const compactViewport = state.size.width < 640;
    // orbit: front 3/4 → rear 3/4; two slight height swells; end close
    const az = lerpAngle(lerpAngle(0.9, -0.85, Math.min(1, p / 0.55)), -2.35, Math.max(0, (p - 0.55) / 0.45));
    const el = 0.16 + 0.12 * Math.sin(p * Math.PI * 1.5);
    const r = 5.6 - 1.5 * Math.max(0, p - 0.55) / 0.45 + (compactViewport ? 1.4 : 0);
    const k = ready.current ? Math.min(1, delta * 6) : 1;
    cam.current.az += (az - cam.current.az) * k;
    cam.current.el += (el - cam.current.el) * k;
    cam.current.r += (r - cam.current.r) * k;
    ready.current = true;

    const c = state.camera as THREE.PerspectiveCamera;
    const fov = compactViewport ? 56 : 34;
    if (c.fov !== fov) {
      c.fov = fov;
      c.updateProjectionMatrix();
    }
    const y = 0.9 + cam.current.el * 2.2;
    c.position.set(
      Math.sin(cam.current.az) * cam.current.r,
      y,
      Math.cos(cam.current.az) * cam.current.r
    );
    c.lookAt(0, 0.45, 0);
  });
  return null;
}

function LightRig({ getP }: { getP: () => number }) {
  const key = useRef<THREE.DirectionalLight>(null);
  const rim = useRef<THREE.SpotLight>(null);
  const fill = useRef<THREE.DirectionalLight>(null);

  useFrame(() => {
    const p = getP();
    const ramp = Math.min(1, p / 0.2);
    if (key.current) key.current.intensity = 0.15 + ramp * 1.7;
    if (rim.current) rim.current.intensity = 0.4 + ramp * 2.6;
    if (fill.current) fill.current.intensity = 0.1 + ramp * 0.5;
  });

  return (
    <>
      <ambientLight intensity={0.06} />
      <directionalLight ref={key} position={[3.2, 5.2, 3.4]} intensity={0.3} color="#f4f1ea" />
      <spotLight ref={rim} position={[-4.6, 3.4, -3.8]} angle={0.55} penumbra={0.9} intensity={1.0} color="#ffffff" distance={26} decay={1.1} />
      <directionalLight ref={fill} position={[-2.8, 1.6, 3.6]} intensity={0.12} color="#e8e6e1" />
    </>
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
      const rad = ctx.createRadialGradient(256, 128, 15, 256, 128, 120);
      rad.addColorStop(0, "rgba(0,0,0,0.9)");
      rad.addColorStop(0.5, "rgba(0,0,0,0.55)");
      rad.addColorStop(0.85, "rgba(0,0,0,0.12)");
      rad.addColorStop(1, "rgba(0,0,0,0)");
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
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.006, 0]}>
          <planeGeometry args={[5.4, 2.9]} />
          <meshBasicMaterial map={shadowTex} transparent opacity={0.95} depthWrite={false} />
        </mesh>
      )}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[60, 60]} />
        <meshStandardMaterial color="#0a0a0b" roughness={0.92} metalness={0.1} />
      </mesh>
    </group>
  );
}

export function SceneStudio({ getP, finish }: { getP: () => number; finish: Finish }) {
  return (
    <Canvas
      gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
      dpr={[1, 1.5]}
      camera={{ position: [Math.sin(0.9) * 5.6, 1.25, Math.cos(0.9) * 5.6], fov: 34 }}
    >
      <Suspense fallback={null}>
        <LightRig getP={getP} />
        <Environment files="/env/studio_small_03_1k.hdr" environmentIntensity={0.2} background={false} />
        <StudioFloor />
        <CarModel finish={finish} />
      </Suspense>
      <CameraRig getP={getP} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
