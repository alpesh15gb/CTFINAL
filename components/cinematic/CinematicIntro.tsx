"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { EASE_CINEMATIC } from "./primitives";

/**
 * Very short cinematic loader — black screen, CARTUNEZ mask rise,
 * microcopy fade, thin line grow, vertical wipe reveal. ~1.2s, once per session.
 */
export function CinematicIntro() {
  const [show, setShow] = useState(false);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let timers: ReturnType<typeof setTimeout>[] = [];
    try {
      if (sessionStorage.getItem("ctz-intro-seen")) return;
    } catch {
      /* storage unavailable — play once anyway */
    }
    setShow(true);
    timers = [
      setTimeout(() => setLeaving(true), 1050),
      setTimeout(() => {
        setShow(false);
        try {
          sessionStorage.setItem("ctz-intro-seen", "1");
        } catch {
          /* ignore */
        }
      }, 1500),
    ];
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[200] flex flex-col items-center justify-center bg-[#020202]"
          initial={{ y: 0 }}
          animate={leaving ? { y: "-100%" } : { y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.65, ease: EASE_CINEMATIC }}
          aria-hidden
        >
          <span className="clip-mask px-6">
            <motion.span
              className="campaign-title block text-center text-[clamp(2.6rem,9vw,6rem)]"
              initial={{ y: "112%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 0.7, ease: EASE_CINEMATIC }}
            >
              CARTUNEZ
            </motion.span>
          </span>
          <motion.p
            className="mt-3 font-mono text-[9px] uppercase tracking-[0.42em] text-white/50 md:text-[10px]"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.45 }}
          >
            Performance / Design / Engineering
          </motion.p>
          <div className="mt-6 h-px w-44 overflow-hidden bg-white/10 md:w-64">
            <motion.div
              className="h-full w-full origin-left bg-white/80"
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.85, ease: EASE_CINEMATIC }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
