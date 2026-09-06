"use client";

import Link from "next/link";
import dynamic from "next/dynamic";
import { Component, useEffect, useRef, useState, type ReactNode } from "react";
import { motion, useInView, useMotionValueEvent, useSpring, useTransform } from "framer-motion";
import { ArrowDown, ArrowRight, ArrowUpRight, Check } from "lucide-react";
import { useMountedReducedMotion, usePinnedProgress } from "./fx";
import { FINISHES, type Finish } from "./hero-config";
import styles from "./SceneHero.module.css";

const SceneStudio = dynamic(
  () => import("@/components/three/SceneStudio").then((module) => module.SceneStudio),
  { ssr: false, loading: () => null }
);

class SceneBoundary extends Component<{ children: ReactNode; onError: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { this.props.onError(); }
  render() { return this.state.failed ? null : this.props.children; }
}

const CHAPTERS = [
  { label: "Presence", title: "Never ordinary.", copy: "Alloys, audio, protection and light. Make every detail unmistakably yours." },
  { label: "Precision", title: "Different. Down to the detail.", copy: "The right stance. The perfect finish. Upgrades selected around your vehicle, not the other way around." },
  { label: "Signature", title: "Your car. Your signature.", copy: "Start with your vehicle. Find the upgrades that belong on it." },
];

export function SceneHero() {
  const ref = useRef<HTMLElement>(null);
  const progress = usePinnedProgress(ref);
  const scrub = useSpring(progress, { stiffness: 90, damping: 26, restDelta: 0.0001 });
  const reduce = useMountedReducedMotion();
  const inView = useInView(ref, { margin: "100px" });
  const [finish, setFinish] = useState<Finish>(FINISHES[0]);
  const [chapter, setChapter] = useState(0);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    try {
      const probe = document.createElement("canvas");
      const context = probe.getContext("webgl2") || probe.getContext("webgl");
      if (!context) setFailed(true);
      context?.getExtension("WEBGL_lose_context")?.loseContext();
    } catch { setFailed(true); }
    setMounted(true);
    const update = () => setVisible(!document.hidden);
    update();
    document.addEventListener("visibilitychange", update);
    return () => document.removeEventListener("visibilitychange", update);
  }, []);

  const staticMode = reduce || failed;
  useMotionValueEvent(scrub, "change", (value) => {
    const next = value < 0.36 ? 0 : value < 0.73 ? 1 : 2;
    setChapter((current) => current === next ? current : next);
  });
  const titleX = useTransform(scrub, [0, 0.45, 1], ["0%", "-9%", "-22%"]);
  const titleY = useTransform(scrub, [0, 1], [0, -65]);
  const titleScale = useTransform(scrub, [0, 0.55, 1], [1, 1.08, 0.95]);
  const ringRotate = useTransform(scrub, [0, 1], [-18, 48]);
  const ringY = useTransform(scrub, [0, 1], [40, -90]);
  const lineX = useTransform(scrub, [0, 1], ["-15%", "25%"]);
  const currentChapter = staticMode ? 0 : chapter;

  return (
    <section ref={ref} className={`${styles.hero} ${staticMode ? styles.static : ""}`} aria-label="Cartunez custom automotive studio" data-hero>
      <div className={styles.frame}>
        <div className={styles.grain} aria-hidden="true" />
        <div className={styles.eyebrow}>
          <span><i /> Cartunez / The custom studio</span>
          <span className={styles.edition}>Built around you. Not the ordinary.</span>
        </div>

        <motion.div className={styles.orbit} aria-hidden="true" style={staticMode ? undefined : { rotate: ringRotate, y: ringY }}>
          <span /><span /><span />
        </motion.div>
        <motion.div className={styles.speedLines} aria-hidden="true" style={staticMode ? undefined : { x: lineX }} />

        <motion.h1 className={styles.headline} style={staticMode ? undefined : { x: titleX, y: titleY, scale: titleScale }}>
          <span>Get your</span>
          <span className={styles.outline}>car rolling</span>
          <span>in style.</span>
        </motion.h1>

        <div className={styles.stage} role="img" aria-label={`Jaguar XE SV Project 8 design study in ${finish.label}${staticMode ? "" : ", with scroll-controlled camera angles"}`}>
          {/* The poster stays underneath WebGL during loading or context failure. */}
          <img src="/images/hero-jaguar.webp" alt="" width={1183} height={504} fetchPriority="high" className={styles.poster} style={{ opacity: ready && !staticMode ? 0 : 1 }} />
          {mounted && !staticMode && (
            <SceneBoundary onError={() => setFailed(true)}>
              <SceneStudio progress={scrub} finish={finish} active={inView && visible} onReady={() => setReady(true)} onError={() => setFailed(true)} />
            </SceneBoundary>
          )}
        </div>

        <div className={styles.modelTag} aria-hidden="true">
          <span className={styles.crosshair}>+</span>
          <span>XE SV / Design study<br /><b>{staticMode ? "Signal Red" : finish.label}</b></span>
        </div>

        <div className={styles.story}>
          <p className={styles.chapterLabel}>0{currentChapter + 1} / {CHAPTERS[currentChapter].label}</p>
          <h2>{CHAPTERS[currentChapter].title}</h2>
          <p className={styles.description}>{CHAPTERS[currentChapter].copy}</p>
          <div className={styles.actions}>
            <Link href="/#vehicle-selector" className={styles.primary}>Build your signature <ArrowUpRight size={18} aria-hidden="true" /></Link>
            <Link href="/shop" className={styles.secondary}>Explore upgrades <ArrowRight size={16} aria-hidden="true" /></Link>
          </div>
        </div>

        {!staticMode && ready && (
          <fieldset className={styles.finishes}>
            <legend>Finish / {finish.label}</legend>
            <div>
              {FINISHES.map((option) => (
                <button key={option.id} type="button" aria-label={`${option.label} finish`} aria-pressed={finish.id === option.id} onClick={() => setFinish(option)} style={{ "--swatch": option.hex } as React.CSSProperties}>
                  <span>{finish.id === option.id && <Check size={13} aria-hidden="true" />}</span>
                </button>
              ))}
            </div>
          </fieldset>
        )}

        <div className={styles.footer}>
          {!staticMode ? (
            <a href="#hero-end" className={styles.scrollCue}><ArrowDown size={15} aria-hidden="true" /> Scroll to explore <span>/ Skip intro</span></a>
          ) : <span className={styles.scrollCue}>Designed to be different.</span>}
          <div className={styles.timeline} aria-hidden="true">
            {CHAPTERS.map((item, index) => <span key={item.label} data-active={index === currentChapter}>0{index + 1} <b>{item.label}</b></span>)}
          </div>
          <a className={styles.credit} href="/models/ATTRIBUTION.md" target="_blank" rel="noreferrer">3D credits <ArrowUpRight size={11} aria-hidden="true" /></a>
        </div>
        {!staticMode && <motion.div className={styles.progress} style={{ scaleX: scrub }} aria-hidden="true" />}
      </div>
      <div id="hero-end" className={styles.end} />
    </section>
  );
}
