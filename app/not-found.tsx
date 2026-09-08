import Link from "next/link";

export default function NotFound() {
  return (
    <main
      style={{
        minHeight: "100svh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 16,
        background: "#080a0c",
        color: "#f2f3f3",
        textAlign: "center",
        padding: 24,
      }}
    >
      <p style={{ fontSize: 12, letterSpacing: "0.25em", color: "#858b92" }}>
        404
      </p>
      <h1
        style={{
          fontFamily: "var(--font-display),system-ui,sans-serif",
          fontSize: "clamp(48px,8vw,96px)",
          margin: 0,
          lineHeight: 1,
        }}
      >
        LOST THE TRAIL.
      </h1>
      <p style={{ color: "#b9c0c6", maxWidth: 420 }}>
        This page was moved, removed, or never existed.
      </p>
      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        <Link
          href="/"
          style={{
            border: "1px solid #08bcec",
            borderRadius: 30,
            padding: "14px 24px",
            fontSize: 14,
          }}
        >
          Back home
        </Link>
        <Link
          href="/shop"
          style={{
            border: "1px solid #ffffff60",
            borderRadius: 30,
            padding: "14px 24px",
            fontSize: 14,
          }}
        >
          Shop upgrades
        </Link>
      </div>
    </main>
  );
}
