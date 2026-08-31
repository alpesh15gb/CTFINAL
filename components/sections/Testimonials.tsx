"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Quote } from "lucide-react";
import { staggerContainer, fadeInUp } from "@/lib/animations";

const testimonials = [
  {
    quote:
      "The fit and finish completely changed the car. It finally feels like it was built for me.",
    vehicle: "Hyundai Creta",
    location: "Bengaluru",
    image: "https://images.unsplash.com/photo-1617788138017-80ad40651399?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "Cartunez made the upgrade process simple. Fitment check saved me from ordering the wrong parts.",
    vehicle: "Kia Seltos",
    location: "Mumbai",
    image: "https://images.unsplash.com/photo-1494976388531-d1058494cdd8?q=80&w=400&auto=format&fit=crop",
  },
  {
    quote:
      "Quality is next level. The forged wheels and lighting kit turned every drive into an event.",
    vehicle: "Tata Harrier",
    location: "Delhi",
    image: "https://images.unsplash.com/photo-1549064233-945d7063292f?q=80&w=400&auto=format&fit=crop",
  },
];

export function Testimonials() {
  return (
    <section className="relative z-20 border-t border-border bg-raised py-24 md:py-32">
      <div className="mx-auto max-w-[1600px] px-4 md:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
          className="mb-16"
        >
          <motion.span
            variants={fadeInUp}
            className="mb-3 inline-block font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-cyan"
          >
            08 / Trust
          </motion.span>
          <motion.h2
            variants={fadeInUp}
            className="font-display text-[clamp(3rem,6vw,6rem)] font-bold uppercase leading-[0.85] tracking-[-0.04em] text-foreground"
          >
            10,000+
            <br />
            <span className="text-silver">Cars Transformed.</span>
          </motion.h2>
        </motion.div>

        {/* Large editorial testimonial cards */}
        <div className="grid gap-0 lg:grid-cols-3">
          {testimonials.map((t, idx) => (
            <motion.div
              key={idx}
              variants={fadeInUp}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-50px" }}
              className="group relative border-l border-white/[0.06] py-10 pl-0 first:border-l-0 lg:pl-10"
            >
              <Quote className="mb-6 h-8 w-8 text-cyan/30" />
              <p className="text-xl leading-relaxed text-foreground md:text-2xl lg:text-[1.6rem]">
                &ldquo;{t.quote}&rdquo;
              </p>
              <div className="mt-8 flex items-center gap-4">
                <div className="relative h-14 w-14 overflow-hidden rounded-full border border-border">
                  <Image
                    src={t.image}
                    alt={t.vehicle}
                    fill
                    className="object-cover saturate-[0.8]"
                    sizes="56px"
                  />
                </div>
                <div>
                  <p className="font-display text-lg font-semibold uppercase text-foreground">{t.vehicle}</p>
                  <p className="font-mono text-[10px] uppercase tracking-[0.15em] text-silver-muted">{t.location}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
