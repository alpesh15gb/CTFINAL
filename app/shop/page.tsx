"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header, Footer } from "@/components/site-content";
import { listStoreProducts } from "@/lib/medusa";
import {
  adaptStoreProduct,
  type MedusaStoreProduct,
} from "@/lib/store-adapter";
import type { Product } from "@/types";

const WA = (subject: string) =>
  "https://wa.me/919949695030?text=" +
  encodeURIComponent(`Hi Cartunez, I'm interested in ${subject}. Can you help with options for my car?`);

/**
 * Shop — live Medusa catalog in the Cartunez dark studio language.
 * Client-fetched against NEXT_PUBLIC_MEDUSA_BACKEND_URL; WhatsApp CTA per
 * product so enquiries keep working even without checkout.
 */
export default function ShopPage() {
  const [items, setItems] = useState<Product[] | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    listStoreProducts({ limit: 100 })
      .then((page) => {
        if (cancelled) return;
        setItems((page.products as MedusaStoreProduct[]).map(adaptStoreProduct));
      })
      .catch((error) => {
        console.error("[shop] failed to load live products:", error);
        if (!cancelled) {
          setFailed(true);
          setItems([]);
        }
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <>
      <Header />
      <main style={{ paddingTop: 108 }}>
        <section className="section" style={{ paddingTop: 60 }}>
          <div className="section-label">
            <span className="cyan">01 /</span> LIVE CATALOG
          </div>
          <div className="upgrades-heading">
            <h2>
              STRAIGHT OFF
              <br />
              THE LIFT.
            </h2>
            <p>
              Live stock from our store.
              <br />
              Ask us what fits your car.
            </p>
          </div>

          {items === null && (
            <div
              style={{
                display: "grid",
                gap: 16,
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                marginTop: 40,
              }}
            >
              {[0, 1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  aria-hidden
                  style={{
                    height: 340,
                    borderRadius: 8,
                    background:
                      "linear-gradient(135deg,#14181c,#0b0e11)",
                    border: "1px solid #ffffff14",
                    animation: "pulse 1.6s ease-in-out infinite",
                  }}
                />
              ))}
            </div>
          )}

          {items !== null && items.length === 0 && (
            <p style={{ color: "#b9c0c6", marginTop: 40 }}>
              {failed
                ? "Could not reach the live store right now. Message us on WhatsApp and we'll share current stock."
                : "No products live at the moment — check back soon."}{" "}
              <a
                className="text-link"
                href="https://wa.me/919949695030"
                target="_blank"
                rel="noopener"
              >
                Chat on WhatsApp ↗
              </a>
            </p>
          )}

          {items !== null && items.length > 0 && (
            <div
              style={{
                display: "grid",
                gap: 16,
                gridTemplateColumns: "repeat(auto-fill,minmax(240px,1fr))",
                marginTop: 40,
              }}
            >
              {items.map((p) => (
                <article
                  key={p.id}
                  style={{
                    border: "1px solid #ffffff14",
                    borderRadius: 8,
                    overflow: "hidden",
                    background: "#101316",
                  }}
                >
                  <Link
                    href={`/products/${p.slug}`}
                    aria-label={`View ${p.name}`}
                    style={{ display: "block", position: "relative", aspectRatio: "4/3" }}
                  >
                    {p.images[0] ? (
                      <Image
                        src={p.images[0]}
                        alt={p.name}
                        fill
                        sizes="(max-width:768px) 100vw, 33vw"
                        style={{ objectFit: "cover" }}
                      />
                    ) : (
                      <span
                        style={{
                          display: "flex",
                          height: "100%",
                          alignItems: "center",
                          justifyContent: "center",
                          color: "#858b92",
                          fontSize: 12,
                          letterSpacing: "0.2em",
                        }}
                      >
                        CARTUNEZ
                      </span>
                    )}
                  </Link>
                  <div style={{ padding: 18 }}>
                    <p
                      style={{
                        fontSize: 10,
                        letterSpacing: "0.22em",
                        color: "#08bcec",
                        margin: "0 0 8px",
                      }}
                    >
                      {p.category}
                    </p>
                    <Link href={`/products/${p.slug}`}>
                      <h3
                        style={{
                          fontFamily:
                            "var(--font-display),system-ui,sans-serif",
                          fontSize: 30,
                          margin: "0 0 6px",
                          lineHeight: 1,
                        }}
                      >
                        {p.name}
                      </h3>
                    </Link>
                    <p style={{ margin: "0 0 14px", color: "#f2f3f3" }}>
                      {p.currency}
                      {p.price.toLocaleString("en-IN")}{" "}
                      <span
                        style={{
                          fontSize: 11,
                          letterSpacing: "0.14em",
                          color: p.inStock ? "#7ee2a8" : "#858b92",
                        }}
                      >
                        {p.inStock ? "IN STOCK" : "SOLD OUT"}
                      </span>
                    </p>
                    <a
                      className="text-link"
                      href={WA(p.name)}
                      target="_blank"
                      rel="noopener"
                    >
                      Enquire on WhatsApp ↗
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
      <Footer />
      <style>{`@keyframes pulse{0%,100%{opacity:1}50%{opacity:.45}}`}</style>
    </>
  );
}
