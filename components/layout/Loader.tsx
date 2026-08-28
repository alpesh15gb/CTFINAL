"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export function Loader({ children }: { children: React.ReactNode }) {
  const reducedMotion = useReducedMotion();
  const [showLoader, setShowLoader] = useState(true);

  useEffect(() => {
    if (reducedMotion) {
      setShowLoader(false);
      return;
    }
    const alreadyLoaded = sessionStorage.getItem("cartunez-loaded");
    if (alreadyLoaded) {
      setShowLoader(false);
      return;
    }

    const timer = setTimeout(() => {
      setShowLoader(false);
      sessionStorage.setItem("cartunez-loaded", "true");
    }, 1400);

    return () => clearTimeout(timer);
  }, [reducedMotion]);

  return (
    <>
      {children}
      <AnimatePresence>
        {showLoader && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background"
            aria-hidden="true"
          >
            <div className="relative flex flex-col items-center">
              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mb-8 h-px w-32 origin-left bg-cyan"
              />

              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
              >
                <Image
                  src="/logo/cartunez-logo.png"
                  alt="Cartunez"
                  width={220}
                  height={80}
                  className="h-auto w-48 object-contain md:w-64"
                  priority
                />
              </motion.div>

              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="mt-6 text-xs font-medium uppercase tracking-[0.3em] text-silver-muted"
              >
                Get your car rolling in style.
              </motion.p>

              <motion.div
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="mt-10 h-px w-48 origin-left bg-gradient-to-r from-cyan/0 via-cyan to-cyan/0"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
