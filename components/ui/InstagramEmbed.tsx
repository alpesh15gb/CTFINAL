"use client";

import { useEffect, useRef, useState } from "react";

export function InstagramEmbed({ url, className }: { url: string; className?: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted || !containerRef.current) return;

    const container = containerRef.current;
    container.innerHTML = "";

    const iframe = document.createElement("iframe");
    iframe.src = `${url}embed/`;
    iframe.setAttribute("allowfullscreen", "");
    iframe.setAttribute("scrolling", "no");
    iframe.style.cssText = "width: 100%; height: 100%; min-height: 500px; border: 0; display: block;";
    iframe.loading = "lazy";

    container.appendChild(iframe);
  }, [url, mounted]);

  if (!mounted) {
    return (
      <div className={className}>
        <div className="flex aspect-[4/5] items-center justify-center bg-raised">
          <div className="flex flex-col items-center gap-3 text-silver-muted">
            <div className="h-8 w-8 animate-pulse rounded-full border-2 border-cyan/40" />
            <span className="text-sm">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return <div ref={containerRef} className={className} style={{ minHeight: "500px" }} />;
}
