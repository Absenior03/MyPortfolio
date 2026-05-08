import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { styles } from "../styles";
import { gsap, ScrollTrigger } from "../utils/gsap";

// ─── Dynamic import (no SSR) ──────────────────────────────────────────────────

const ComputersCanvasWithNoSSR = dynamic(
  () => import("./canvas/Computers").then((mod) => ({ default: mod.default })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-full items-center justify-center text-xs uppercase tracking-widest text-[#7dd3fc]/60">
        Initialising scene…
      </div>
    ),
  },
);

// ─── Typed text component ─────────────────────────────────────────────────────

const DESIGNATION = "Software Engineer";

/**
 * Renders the designation letter-by-letter.
 * `charsVisible` is a float 0→DESIGNATION.length; integer part = chars shown.
 * Cursor blinks independently via CSS animation.
 */
const TypedDesignation = ({ charsVisible }: { charsVisible: number }) => {
  const count = Math.min(Math.floor(charsVisible), DESIGNATION.length);
  const done = count >= DESIGNATION.length;

  return (
    <span className="inline-flex items-baseline">
      <span className="text-[#c4b5fd]">{DESIGNATION.slice(0, count)}</span>
      <span
        className={`ml-[2px] inline-block h-[1em] w-[2px] translate-y-[1px] bg-[#c4b5fd] ${
          done ? "hero-cursor-blink" : "hero-cursor-solid"
        }`}
      />
    </span>
  );
};

// ─── Hero component ───────────────────────────────────────────────────────────

const Hero = () => {
  // Shared refs passed into R3F scene
  const progressRef = useRef(0); // 0→1 overall scroll progress
  const keystrokeRef = useRef(0); // monotonically-increasing keystroke count (float)

  // DOM refs for GSAP
  const heroRef = useRef<HTMLElement | null>(null);
  const upperRef = useRef<HTMLDivElement | null>(null);
  const canvasWrapRef = useRef<HTMLDivElement | null>(null);

  const [isMounted, setIsMounted] = useState(false);
  const [show3D, setShow3D] = useState(true);
  const [charsVisible, setCharsVisible] = useState(0); // drives TypedDesignation

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted || !heroRef.current) return;

    let trigger: ScrollTrigger | undefined;
    let resizeHandler: (() => void) | undefined;

    // How many keystrokes to fire per character (keeps animation legible)
    const TOTAL_CHARS = DESIGNATION.length;
    // Phase timings as fractions of total scroll progress
    // Phase 1: 0 → 0.30  typing  (robot types + letters appear)
    // Phase 2: 0.30 → 0.70 orbit (camera sweeps 180°, scene shrinks, copy scales up)
    // Phase 3: 0.70 → 1.00 hold
    const P1_END = 0.3;
    const P2_START = 0.3;
    const P2_END = 0.7;

    const ease = gsap.parseEase("power2.inOut");

    const applyFrame = (rawProg: number) => {
      progressRef.current = rawProg;

      // ── Typing phase (0 → P1_END) ─────────────────────────────────────────
      const typingFrac = Math.min(rawProg / P1_END, 1);
      const chars = typingFrac * TOTAL_CHARS;
      // keystrokeRef advances one tick per character (two hands alternating)
      keystrokeRef.current = chars;
      setCharsVisible(chars);

      // ── Copy scale (phase 2) ───────────────────────────────────────────────
      if (upperRef.current) {
        const p2 = ease(
          THREE_clamp((rawProg - P2_START) / (P2_END - P2_START), 0, 1),
        );
        gsap.set(upperRef.current, {
          scale: 1 + p2 * 0.08, // grow gently as scene shrinks
          opacity: 0.6 + p2 * 0.4,
        });
      }

      // ── Canvas opacity fade in phase 2 ────────────────────────────────────
      if (canvasWrapRef.current) {
        const p2 = ease(
          THREE_clamp((rawProg - P2_START) / (P2_END - P2_START), 0, 1),
        );
        gsap.set(canvasWrapRef.current, {
          opacity: 1 - p2 * 0.55,
        });
      }
    };

    const context = gsap.context(() => {
      applyFrame(0);

      trigger = ScrollTrigger.create({
        trigger: heroRef.current,
        start: "top top",
        end: "+=200%",
        scrub: 0.5,
        invalidateOnRefresh: true,
        onUpdate: (self) => applyFrame(self.progress),
      });

      resizeHandler = () => {
        if (trigger) applyFrame(trigger.progress);
      };
      window.addEventListener("resize", resizeHandler);
    }, heroRef);

    return () => {
      resizeHandler && window.removeEventListener("resize", resizeHandler);
      trigger?.kill();
      context.revert();
    };
  }, [isMounted]);

  const handleError = () => {
    console.error("Failed to load 3D component");
    setShow3D(false);
  };

  return (
    <section
      id="hero"
      ref={heroRef}
      className="hero-scroll-stage relative mx-auto -mt-12 md:-mt-14 min-h-[240vh] md:min-h-[300vh] w-full"
    >
      {/* ── Sticky viewport ─────────────────────────────────────────────── */}
      <div className="sticky top-0 flex h-[100svh] flex-col overflow-hidden bg-[#040816]">
        {/* Background layers */}
        <div className="hero-grid pointer-events-none absolute inset-0 z-0 opacity-50" />
        <div className="pointer-events-none absolute inset-0 z-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(120,119,198,0.18),transparent)]" />
        <div className="pointer-events-none absolute left-[-6%] top-[5%] z-0 h-96 w-96 rounded-full bg-[#7c3aed]/8 blur-[110px]" />
        <div className="pointer-events-none absolute bottom-[-6%] right-[-4%] z-0 h-80 w-80 rounded-full bg-[#2563eb]/10 blur-[110px]" />

        {/* ── UPPER HALF: name + typed designation ──────────────────────── */}
        <div
          ref={upperRef}
          className="hero-upper relative z-10 flex flex-col items-center justify-center px-4 pt-8 pb-4 text-center md:px-0 md:pt-10"
          style={{ flex: "0 0 44%", transformOrigin: "center 80%" }}
        >
          {/* Pre-name label */}
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#7dd3fc]/25 bg-[#07101f]/70 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.24em] text-[#7dd3fc]/80 md:px-4 md:text-[10px] md:tracking-[0.3em]">
            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#7dd3fc]" />
            Portfolio · 2026
          </div>

          <h1 className={`${styles.heroHeadText} mb-0`}>
            <span className="text-white/90">Hi, I&apos;m </span>
            <span className="bg-gradient-to-r from-[#a78bfa] via-[#c4b5fd] to-[#7dd3fc] bg-clip-text text-transparent">
              Anirban
            </span>
          </h1>

          {/* Typed designation – synced to keystrokeRef */}
          <p
            className={`${styles.heroSubText} mt-3 flex items-baseline justify-center gap-0`}
          >
            <TypedDesignation charsVisible={charsVisible} />
          </p>

          {/* CTA row */}
          <div className="mt-6 flex flex-wrap justify-center gap-3 md:mt-8 md:gap-4">
            <a href="#contact" className="button-primary text-sm">
              Let&apos;s Connect
            </a>
            <a
              href="/assets/Anirban_Banerjee_Resume.pdf"
              download
              className="inline-flex items-center gap-2 rounded-md border border-[#a78bfa]/50 px-5 py-2 text-sm text-white/90 transition-all duration-300 hover:bg-[#a78bfa]/10"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Resume
            </a>
          </div>
        </div>

        {/* ── LOWER HALF: 3D robot + typewriter scene ───────────────────── */}
        <div
          ref={canvasWrapRef}
          className="hero-canvas-lower relative z-10 min-h-[44svh] overflow-hidden md:min-h-0"
          style={{ flex: "1 1 56%" }}
        >
          {/* Top feather so canvas bleeds into upper section smoothly */}
          <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-20 bg-gradient-to-b from-[#040816] to-transparent" />
          {/* Bottom feather */}
          <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-10 bg-gradient-to-t from-[#040816] to-transparent" />

          {show3D && (
            <ErrorBoundary
              onError={handleError}
              fallback={
                <div className="flex h-full items-center justify-center text-white/40">
                  3D scene unavailable
                </div>
              }
            >
              <ComputersCanvasWithNoSSR
                progressRef={progressRef}
                keystrokeRef={keystrokeRef}
              />
            </ErrorBoundary>
          )}
        </div>

        {/* ── Scroll hint ────────────────────────────────────────────────── */}
        <div className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 flex-col items-center gap-2 md:bottom-6">
          <span className="text-[10px] uppercase tracking-[0.25em] text-white/30">
            scroll
          </span>
          <a href="#about">
            <div className="flex h-14 w-8 items-start justify-center rounded-full border border-white/20 p-2 hover:border-[#a78bfa]/60 transition-colors">
              <motion.div
                animate={{ y: [0, 20, 0] }}
                transition={{
                  duration: 1.6,
                  repeat: Infinity,
                  repeatType: "loop",
                }}
                className="h-2.5 w-2.5 rounded-full bg-white/70"
              />
            </div>
          </a>
        </div>
      </div>
    </section>
  );
};

// ─── Tiny inline clamp helper (avoids importing THREE in Hero) ────────────────
const THREE_clamp = (v: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, v));

// ─── Error boundary ───────────────────────────────────────────────────────────

class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: () => void;
}> {
  state = { hasError: false };
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: Error) {
    console.error("3D Component Error:", error);
    this.props.onError?.();
  }
  render() {
    return this.state.hasError ? this.props.fallback : this.props.children;
  }
}

export default Hero;
