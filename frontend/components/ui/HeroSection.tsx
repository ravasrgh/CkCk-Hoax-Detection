"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";

export default function HeroSection() {
  const orbARef = useRef<HTMLDivElement>(null);
  const orbBRef = useRef<HTMLDivElement>(null);
  const orbCRef = useRef<HTMLDivElement>(null);

  // Kick animations after mount so SSR hydration is clean
  useEffect(() => {
    [orbARef, orbBRef, orbCRef].forEach((ref) => {
      if (ref.current) ref.current.style.animationPlayState = "running";
    });
  }, []);

  return (
    <section
      className="relative flex flex-col items-center justify-center text-center px-8 overflow-hidden"
      style={{ minHeight: "100svh", backgroundColor: "var(--bg-canvas)" }}
    >
      {/* ── Gradient mesh background ── */}
      <div aria-hidden className="absolute inset-0 pointer-events-none" style={{ zIndex: 0 }}>
        {/* Orb A — warm gold, top-left */}
        <div
          ref={orbARef}
          style={{
            position: "absolute",
            top: "10%",
            left: "15%",
            width: "55vw",
            height: "55vw",
            maxWidth: "640px",
            maxHeight: "640px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(212,165,116,0.15) 0%, rgba(212,165,116,0.04) 45%, transparent 70%)",
            animation: "mesh-orb-a 18s ease-in-out infinite",
            animationPlayState: "paused",
            willChange: "transform",
          }}
        />
        {/* Orb B — muted tan, bottom-right */}
        <div
          ref={orbBRef}
          style={{
            position: "absolute",
            bottom: "8%",
            right: "10%",
            width: "48vw",
            height: "48vw",
            maxWidth: "560px",
            maxHeight: "560px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(168,154,138,0.12) 0%, rgba(168,154,138,0.03) 50%, transparent 72%)",
            animation: "mesh-orb-b 22s ease-in-out infinite",
            animationPlayState: "paused",
            willChange: "transform",
          }}
        />
        {/* Orb C — deep brown, center-right */}
        <div
          ref={orbCRef}
          style={{
            position: "absolute",
            top: "35%",
            right: "20%",
            width: "36vw",
            height: "36vw",
            maxWidth: "420px",
            maxHeight: "420px",
            borderRadius: "50%",
            background:
              "radial-gradient(circle, rgba(107,98,88,0.18) 0%, rgba(107,98,88,0.04) 55%, transparent 75%)",
            animation: "mesh-orb-c 26s ease-in-out infinite",
            animationPlayState: "paused",
            willChange: "transform",
          }}
        />

        {/* Subtle noise texture overlay to break up pure gradients */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)' opacity='0.03'/%3E%3C/svg%3E\")",
            opacity: 0.6,
            mixBlendMode: "overlay",
          }}
        />
      </div>

      {/* ── Content ── */}
      <div className="relative max-w-4xl w-full flex flex-col items-center gap-8" style={{ zIndex: 1 }}>

        {/* Eyebrow label */}
        <p
          className="text-xs uppercase tracking-[0.35em] font-medium"
          style={{ color: "var(--text-dimmer)" }}
        >
          Deteksi Hoaks · Jaga Privasi
        </p>

        {/* Heading — Serif for premium feel */}
        <h1
          className="font-serif font-bold leading-[1.1]"
          style={{
            fontSize: "clamp(2.4rem, 7vw, 5rem)",
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
          }}
        >
          Verifikasi Sebelum<br />
          <span style={{ color: "var(--text-slogan)" }}>Kamu Bagikan</span>
        </h1>

        {/* Subheading */}
        <p
          className="font-sans font-light max-w-xl leading-relaxed"
          style={{
            fontSize: "clamp(1rem, 2vw, 1.25rem)",
            color: "var(--text-muted)",
          }}
        >
          AI yang berjalan 100% lokal di perangkat Anda. Analisis teks, gambar, dan audio — tanpa internet, tanpa jejak.
        </p>

        {/* CTAs */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
          <Link
            href="/analyzer"
            className="font-sans font-semibold text-sm uppercase tracking-wider px-8 py-3 transition-all duration-200 hover:shadow-lg hover:scale-105"
            style={{
              backgroundColor: "var(--accent-primary)",
              color: "var(--bg-canvas)",
              borderRadius: "6px",
            }}
          >
            Mulai Analisis →
          </Link>
          <Link
            href="/tentang"
            className="font-sans font-medium text-sm uppercase tracking-wider px-8 py-3 transition-all duration-200 hover:bg-opacity-10"
            style={{
              border: "1.5px solid var(--border-sidebar)",
              color: "var(--text-muted)",
              borderRadius: "6px",
            }}
          >
            Pelajari Lebih
          </Link>
        </div>

        {/* Subtle scroll hint */}
        <div
          className="absolute bottom-[-4rem] left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5"
          style={{ color: "var(--text-dimmer)" }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] font-sans">scroll</span>
          <svg width="12" height="20" viewBox="0 0 12 20" fill="none" aria-hidden>
            <rect x="1" y="1" width="10" height="18" rx="5" stroke="currentColor" strokeWidth="1.2" />
            <rect
              x="5" y="4" width="2" height="5" rx="1"
              fill="currentColor"
              style={{ animation: "mesh-orb-a 2s ease-in-out infinite", transformOrigin: "center" }}
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
