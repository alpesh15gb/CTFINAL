"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { Header, Footer } from "@/components/site-content";
import { getStoreProductByHandle } from "@/lib/medusa";
import {
  adaptStoreProduct,
  type MedusaStoreProduct,
} from "@/lib/store-adapter";
import type { Product } from "@/types";

const WA = (subject: string) =>
  "https://wa.me/919949695030?text=" +
  encodeURIComponent(`Hi Cartunez, I'm interested in ${subject}. Can you help with options for my car?`);

/**
 * Product detail — live Medusa product by handle, WhatsApp enquiry CTA.
 */
export default function ProductPage({
  params,
}: {
  params: { slug: string };
}) {
  const { slug } = params;
  const [product, setProduct] = useState<Product | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    getStoreProductByHandle(slug)
      .then((raw) => {
        if (cancelled) return;
        setProduct(
          raw ? adaptStoreProduct(raw as MedusaStoreProduct) : null
        );
        if (!raw) setFailed(true);
      })
      .catch((error) => {
        console.error("[product] failed to load live product:", error);
        if (!cancelled) setFailed(true);
      });
    return () => {
      cancelled = true;
    };
  }, [slug]);

  if (failed && !product) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: 108 }}>
          <section className="section">
            <p className="section-label">
              <span className="cyan">01 /</span> PRODUCT
            </p>
            <h2 style={{ fontFamily: "var(--font-display),system-ui,sans-serif", fontSize: 48 }}>
              NOT ON THE LIFT RIGHT NOW.
            </h2>
            <p style={{ color: "#b9c0c6" }}>
              This product is unavailable.{" "}
              <Link className="text-link" href="/shop">
                Back to shop
              </Link>
            </p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  if (!product) {
    return (
      <>
        <Header />
        <main style={{ paddingTop: 108 }}>
          <section className="section">
            <p style={{ color: "#858b92" }}>Rolling it onto the lift…</p>
          </section>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main style={{ paddingTop: 108 }}>
        <section className="section">
          <p className="section-label">
            <span className="cyan">01 /</span> {product.category}
          </p>
          <div
            style={{
              display: "grid",
              gap: 32,
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))",
              alignItems: "start",
            }}
          >
            <div
              style={{
                position: "relative",
                aspectRatio: "4/3",
                borderRadius: 8,
                overflow: "hidden",
                background: "#101316",
                border: "1px solid #ffffff14",
              }}
            >
              {product.images[0] ? (
                <Image
                  src={product.images[0]}
                  alt={product.name}
                  fill
                  sizes="(max-width:768px) 100vw, 50vw"
                  style={{ objectFit: "cover" }}
                />
              ) : null}
            </div>
            <div>
              <h1
                style={{
                  fontFamily: "var(--font-display),system-ui,sans-serif",
                  fontSize: "clamp(44px,6vw,84px)",
                  lineHeight: 0.9,
                  margin: "0 0 12px",
                }}
              >
                {product.name}
              </h1>
              <p style={{ fontSize: 24, margin: "0 0 8px" }}>
                {product.currency}
                {product.price.toLocaleString("en-IN")}
                {product.originalPrice ? (
                  <span
                    style={{
                      marginLeft: 12,
                      fontSize: 15,
                      color: "#858b92",
                      textDecoration: "line-through",
                    }}
                  >
                    {product.currency}
                    {product.originalPrice.toLocaleString("en-IN")}
                  </span>
                ) : null}
              </p>
              <p
                style={{
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: product.inStock ? "#7ee2a8" : "#858b92",
                }}
              >
                {product.inStock ? "IN STOCK" : "SOLD OUT"}
              </p>
              {product.description ? (
                <p style={{ color: "#b9c0c6", lineHeight: 1.7 }}>
                  {product.description}
                </p>
              ) : null}
              <div style={{ display: "flex", gap: 12, marginTop: 24, flexWrap: "wrap" }}>
                <a
                  className="button"
                  href={WA(product.name)}
                  target="_blank"
                  rel="noopener"
                >
                  Enquire on WhatsApp ↗
                </a>
                <Link className="text-link" href="/shop">
                  Back to shop
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
