import { styles } from "../styles";
import { experiences } from "../constants";
import SectionWrapper from "./SectionWrapper";
import { useEffect, useRef, useCallback } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// ── tunables ────────────────────────────────────────────────────────────────
const STEP_Y = 320; // vertical gap between nodes (SVG user-units)
const TOP_OFFSET = 200; // y of the first node
const START_EXT = 180; // bus wire extension above first node
const END_EXT = 320; // bus wire extension below last node (space for label)
const RAMP_START_OFFSET = 0; // shift ramp start point upward to delay charge arrival
const VISUAL_PROGRESS_OFFSET = 0.032; // nudge visible current lower to align with active junction charge
const SPARK_Y_OFFSET = -56; // place spark closer to connector intersection
const CHARGE_WINDOW = 0.044; // progress-fraction width of the charge pulse
const CARD_HOLD = 0.1; // progress-fraction a card stays fully lit after peak
const ARC_DIP = 0; // how far (y-units) the branch ramp dips below the node
const NEON_START = 0.87; // progress at which the end-label neon begins
// ────────────────────────────────────────────────────────────────────────────

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const corridorRef = useRef<HTMLDivElement>(null);

  // Bus wire — three SVG layers: trail glow + wide glow + thin bright core
  const busCoreRef = useRef<SVGPathElement>(null);
  const busGlowRef = useRef<SVGPathElement>(null);
  const busTrailRef = useRef<SVGPathElement>(null);

  // Per-node off-ramp connectors
  const rampCoreRefs = useRef<(SVGPathElement | null)[]>([]);
  const rampGlowRefs = useRef<(SVGPathElement | null)[]>([]);

  // Node junction dots (lit when charged)
  const junctionRefs = useRef<(SVGCircleElement | null)[]>([]);

  // Spark riding the bus front
  const sparkRef = useRef<HTMLDivElement>(null);

  // Cards
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  // End label ("to be continued")
  const endLabelRef = useRef<HTMLDivElement>(null);
  const endLineRef = useRef<HTMLDivElement>(null);

  // ── geometry ───────────────────────────────────────────────────────────────
  const pathStartY = TOP_OFFSET - START_EXT;
  const pathEndY = TOP_OFFSET + STEP_Y * (experiences.length - 1) + END_EXT;
  const corridorH = pathEndY + 120;

  /** Perfectly straight vertical bus wire */
  const busPathD = `M 50 ${pathStartY} L 50 ${pathEndY}`;

  /**
   * Off-ramp connector for node `idx`.
   *
   * Quadratic bezier that leaves the bus going downward (matching bus direction),
   * arcs outward to the card side, and arrives at the card edge.
   * Visually: a smooth highway off-ramp / Y-junction arm.
   */
  const buildRampPath = (idx: number): string => {
    const y = TOP_OFFSET + idx * STEP_Y;
    const rampStartY = y - RAMP_START_OFFSET; // offset up to delay charge arrival
    const isRight = idx % 2 === 0;
    const endX = isRight ? 74 : 26;
    const cpX = isRight ? 65 : 35;
    // Q cp_x cp_y, end_x end_y
    // Control point is shifted to the card side and below the node so the
    // ramp "peels off" with a smooth curve rather than a right-angle kink.
    return `M 50 ${rampStartY} Q ${cpX} ${y + ARC_DIP}, ${endX} ${y}`;
  };

  // ── per-frame update ───────────────────────────────────────────────────────
  const update = useCallback(
    (progress: number) => {
      const p = gsap.utils.clamp(0, 1, progress);
      const visualP = gsap.utils.clamp(0, 1, p + VISUAL_PROGRESS_OFFSET);
      const bCore = busCoreRef.current;
      const bGlow = busGlowRef.current;
      const spark = sparkRef.current;
      if (!bCore || !bGlow || !spark) return;

      // ── 1. Draw bus wire + residual trail ────────────────────────────
      const busLen = bCore.getTotalLength();
      const drawn = busLen * visualP;
      [bCore, bGlow].forEach((el) => {
        el.style.strokeDashoffset = `${busLen - drawn}`;
      });
      // Trail: show glow along the path already traveled
      const bTrail = busTrailRef.current;
      if (bTrail) {
        const trailDashArray = bTrail.style.strokeDasharray;
        if (trailDashArray) {
          const tLen = parseFloat(trailDashArray);
          bTrail.style.strokeDashoffset = `${tLen - drawn}`;
        }
      }

      // ── 2. Spark at the tip of the current ───────────────────────────
      if (visualP > 0.005 && visualP < 0.995) {
        const pt = bCore.getPointAtLength(drawn);
        gsap.set(spark, {
          left: `${pt.x}%`,
          top: pt.y + SPARK_Y_OFFSET,
          xPercent: -50,
          yPercent: -50,
          opacity: 1,
          scale: 0.88 + Math.sin(visualP * Math.PI * 12) * 0.14,
        });
      } else {
        gsap.set(spark, { opacity: 0 });
      }

      // ── 3. Scroll corridor ────────────────────────────────────────────
      const trackLen = Math.max(1, (experiences.length - 1) * STEP_Y);
      gsap.set(corridorRef.current, { y: -trackLen * p });

      // ── 4. Per-node charge logic ──────────────────────────────────────
      experiences.forEach((_, idx) => {
        const card = cardRefs.current[idx];
        const rCore = rampCoreRefs.current[idx];
        const rGlow = rampGlowRefs.current[idx];
        const junction = junctionRefs.current[idx];
        if (!card) return;

        // Where the ramp junction sits on the bus as a 0-1 progress fraction
        // (account for RAMP_START_OFFSET which moves the junction upward)
        const rampJunctionY = TOP_OFFSET + idx * STEP_Y - RAMP_START_OFFSET;
        const junctionProg = gsap.utils.clamp(
          0,
          1,
          (rampJunctionY - pathStartY) / (pathEndY - pathStartY),
        );
        const dist = p - junctionProg; // negative → current hasn't arrived at junction yet

        // Charge: peaks at arrival, decays forward slowly, back quickly
        const charge = gsap.utils.clamp(
          0,
          1,
          dist < 0
            ? Math.max(0, 1 + dist / CHARGE_WINDOW)
            : Math.max(0, 1 - dist / (CHARGE_WINDOW * 3)),
        );

        // Card visibility
        const visible = gsap.utils.clamp(
          0,
          1,
          dist < 0
            ? Math.max(0, 1 + dist / CHARGE_WINDOW)
            : dist < CARD_HOLD
              ? 1
              : Math.max(0, 1 - (dist - CARD_HOLD) / (CHARGE_WINDOW * 2)),
        );

        // ── Junction dot pulse ────────────────────────────────────────
        if (junction) {
          junction.setAttribute("r", `${0.75 + charge * 0.6}`);
          junction.style.opacity = `${0.35 + charge * 0.65}`;
          junction.style.filter =
            charge > 0.05
              ? `drop-shadow(0 0 ${1.5 + charge * 4}px rgba(0,245,255,${0.7 + charge * 0.3}))`
              : "none";
        }

        // ── Off-ramp wire draws as current charges the node ───────────
        if (rCore && rGlow) {
          const rLen = rCore.getTotalLength();
          // The ramp draws over the period [nodeProg, nodeProg + CHARGE_WINDOW * 2]
          const rampT = gsap.utils.clamp(
            0,
            1,
            dist < 0 ? 0 : dist / (CHARGE_WINDOW * 2),
          );
          [rCore, rGlow].forEach((el) => {
            el.style.strokeDashoffset = `${rLen * (1 - rampT)}`;
          });
          rGlow.style.opacity = `${charge * 0.92}`;
          rCore.style.opacity = `${0.2 + charge * 0.76}`;
        }

        // ── Card neon border glow ─────────────────────────────────────
        gsap.set(card, {
          opacity: visible,
          y: visible < 1 && dist < 0 ? 26 * (1 - visible) : 0,
          filter:
            visible < 0.92 && dist < 0
              ? `blur(${(1 - visible) * 4}px)`
              : "none",
          borderColor: `rgba(0,245,255,${0.12 + charge * 0.88})`,
          boxShadow: [
            "0 20px 52px rgba(0,0,0,0.58)",
            `0 0 ${5 + charge * 30}px rgba(0,245,255,${0.04 + charge * 0.36})`,
            `inset 0 0 ${2 + charge * 14}px rgba(0,245,255,${0.02 + charge * 0.17})`,
            charge > 0.62
              ? `0 0 ${charge * 5}px rgba(255,255,255,${(charge - 0.62) * 0.28})`
              : "",
          ]
            .filter(Boolean)
            .join(", "),
        });
      });

      // ── 5. End-label neon animation ───────────────────────────────────
      const endEl = endLabelRef.current;
      const endLine = endLineRef.current;
      if (endEl) {
        const neonT = gsap.utils.clamp(
          0,
          1,
          (p - NEON_START) / (1 - NEON_START),
        );
        endEl.style.opacity = `${Math.max(0.22, neonT)}`;

        if (neonT > 0.04) {
          endEl.style.textShadow = [
            `0 0 ${4 + neonT * 18}px rgba(0,245,255,${0.55 + neonT * 0.45})`,
            `0 0 ${neonT * 38}px rgba(0,245,255,${neonT * 0.48})`,
            `0 0 ${neonT * 75}px rgba(56,189,248,${neonT * 0.28})`,
          ].join(", ");
          endEl.style.color = `rgba(${Math.round(160 + neonT * 95)}, 255, 255, 1)`;
        } else {
          endEl.style.textShadow = "none";
          endEl.style.color = "rgba(200,255,255,0.4)";
        }

        // Full glow → start CSS pulse animation
        if (neonT >= 1) {
          endEl.setAttribute("data-neon", "active");
        } else {
          endEl.removeAttribute("data-neon");
        }

        // Vertical line above text also glows
        if (endLine) {
          endLine.style.boxShadow =
            neonT > 0.1
              ? `0 0 ${neonT * 8}px rgba(0,245,255,${neonT * 0.8})`
              : "none";
          endLine.style.opacity = `${0.3 + neonT * 0.7}`;
        }
      }
    },
    [busPathD, pathStartY, pathEndY, RAMP_START_OFFSET],
  );

  // ── mount + effects ────────────────────────────────────────────────────────
  useEffect(() => {
    // Inject Orbitron font for the end label
    if (!document.querySelector("link[data-orbitron]")) {
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href =
        "https://fonts.googleapis.com/css2?family=Orbitron:wght@500;700&display=swap";
      link.setAttribute("data-orbitron", "true");
      document.head.appendChild(link);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!window.matchMedia("(min-width: 768px)").matches) return;
    if (!stageRef.current) return;

    // Init dash arrays
    const initDash = (el: SVGPathElement | null) => {
      if (!el) return;
      const l = el.getTotalLength();
      el.style.strokeDasharray = `${l}`;
      el.style.strokeDashoffset = `${l}`;
    };
    initDash(busCoreRef.current);
    initDash(busGlowRef.current);
    initDash(busTrailRef.current);
    rampCoreRefs.current.forEach(initDash);
    rampGlowRefs.current.forEach(initDash);

    // Hide ramps and cards until charged
    rampCoreRefs.current.forEach((el) => {
      if (el) el.style.opacity = "0";
    });
    rampGlowRefs.current.forEach((el) => {
      if (el) el.style.opacity = "0";
    });
    cardRefs.current.forEach((c) => {
      if (c) gsap.set(c, { opacity: 0 });
    });
    if (endLabelRef.current) endLabelRef.current.style.opacity = "0.22";

    const ctx = gsap.context(() => {
      ScrollTrigger.create({
        trigger: stageRef.current!,
        start: "top top+=80",
        end: `+=${Math.max(1800, experiences.length * 560)}`,
        scrub: true,
        pin: stageRef.current!,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => update(self.progress),
        onRefresh: (self) => update(self.progress),
      });
      update(0);
    });

    return () => ctx.revert();
  }, [update]);

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div id="experience-section" ref={sectionRef}>
      {/* ── Neon keyframe styles ─────────────────────────────────────────── */}
      <style>{`
        @keyframes neonPulse {
          0%, 100% {
            text-shadow:
              0 0 8px  rgba(0,245,255,0.85),
              0 0 22px rgba(0,245,255,0.48),
              0 0 55px rgba(56,189,248,0.22);
            color: rgba(210,255,255,1);
          }
          50% {
            text-shadow:
              0 0 14px rgba(0,245,255,1),
              0 0 40px rgba(0,245,255,0.68),
              0 0 90px rgba(56,189,248,0.38),
              0 0 130px rgba(0,245,255,0.14);
            color: rgba(255,255,255,1);
          }
        }
        [data-neon="active"] {
          animation: neonPulse 1.7s ease-in-out infinite;
        }
      `}</style>

      {/* ── MOBILE ────────────────────────────────────────────────────────── */}
      <div className="mb-6 md:hidden">
        <p className={styles.sectionSubText}>What I've done so far</p>
        <h2 className={styles.sectionHeadText}>Experience & Leadership.</h2>
      </div>

      <div className="relative pl-7 grid gap-5 md:hidden">
        <div className="pointer-events-none absolute left-2.5 top-4 bottom-4 w-[2px] rounded-full bg-gradient-to-b from-cyan-300/80 via-cyan-300/35 to-cyan-300/10" />
        {experiences.map((exp, idx) => (
          <article
            key={`${exp.title}-${idx}`}
            className="relative rounded-2xl border border-cyan-300/25 bg-[rgba(16,22,46,0.82)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
          >
            <span className="pointer-events-none absolute -left-[22px] top-7 h-3.5 w-3.5 rounded-full border border-cyan-200/80 bg-cyan-300/75 shadow-[0_0_14px_rgba(103,232,249,0.5)]" />
            <div className="mb-3 inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-200/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200">
              {exp.date}
            </div>
            <h3 className="text-white text-[20px] font-bold leading-tight">
              {exp.title}
            </h3>
            <p className="mt-1 text-cyan-100/80 text-[14px] font-semibold">
              {exp.company_name}
            </p>
            <ul className="mt-4 space-y-2">
              {exp.points.map((pt, pi) => (
                <li
                  key={pi}
                  className="flex text-[13px] leading-relaxed text-slate-100/90"
                >
                  <span className="mr-2 text-cyan-300">●</span>
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      {/* ── DESKTOP ───────────────────────────────────────────────────────── */}
      <div
        ref={stageRef}
        className="hidden md:block mt-16 h-[82vh] min-h-[640px] relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-[rgba(7,11,26,0.88)] backdrop-blur-xl"
      >
        {/* Pinned title */}
        <div className="pointer-events-none absolute left-4 top-4 z-30 md:left-8 md:top-6">
          <div className="rounded-2xl border border-cyan-300/20 bg-[rgba(5,10,24,0.68)] px-4 py-3 backdrop-blur-md md:px-6 md:py-4">
            <p className={styles.sectionSubText}>What I've done so far</p>
            <h2 className={styles.sectionHeadText}>Experience & Leadership.</h2>
          </div>
        </div>

        {/* Ambient grid */}
        <div className="pointer-events-none absolute inset-0 z-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_8%,rgba(0,245,255,0.10),transparent_55%)]" />
          <div
            className="absolute inset-0 opacity-[0.22]"
            style={{
              backgroundImage:
                "linear-gradient(rgba(0,245,255,0.06) 1px,transparent 1px)," +
                "linear-gradient(90deg,rgba(0,245,255,0.06) 1px,transparent 1px)",
              backgroundSize: "46px 46px",
              maskImage:
                "radial-gradient(circle at center,black 28%,transparent 82%)",
            }}
          />
        </div>

        {/* ── Scrollable corridor ─────────────────────────────────────────── */}
        <div
          ref={corridorRef}
          className="absolute left-0 top-0 w-full z-10"
          style={{ height: corridorH }}
        >
          {/* ── Wire SVG ──────────────────────────────────────────────────── */}
          <svg
            className="pointer-events-none absolute inset-0 w-full h-full"
            viewBox={`0 0 100 ${corridorH}`}
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <defs>
              {/* Wide bloom for glow layers */}
              <filter
                id="wireBloom"
                x="-80%"
                y="-80%"
                width="260%"
                height="260%"
              >
                <feGaussianBlur stdDeviation="0.9" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
              {/* Tight glow for core wires */}
              <filter
                id="coreGlow"
                x="-60%"
                y="-60%"
                width="220%"
                height="220%"
              >
                <feGaussianBlur stdDeviation="0.32" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* ── Static dim bus track (always visible — shows full route) ─ */}
            <path
              d={busPathD}
              fill="none"
              stroke="rgba(56,189,248,0.11)"
              strokeWidth="0.38"
              strokeLinecap="round"
            />

            {/* ── Trail glow: residual glow on path already traveled ───────── */}
            <path
              ref={busTrailRef}
              d={busPathD}
              fill="none"
              stroke="rgba(0,245,255,0.28)"
              strokeWidth="1.8"
              strokeLinecap="round"
              filter="url(#wireBloom)"
              style={{ mixBlendMode: "screen" }}
            />

            {/* ── Live bus: outer glow ─────────────────────────────────── */}
            <path
              ref={busGlowRef}
              d={busPathD}
              fill="none"
              stroke="rgba(0,245,255,0.50)"
              strokeWidth="1.6"
              strokeLinecap="round"
              filter="url(#wireBloom)"
              style={{ mixBlendMode: "screen" }}
            />

            {/* ── Live bus: bright thin core ───────────────────────────── */}
            <path
              ref={busCoreRef}
              d={busPathD}
              fill="none"
              stroke="rgba(210,255,255,0.97)"
              strokeWidth="0.28"
              strokeLinecap="round"
              filter="url(#coreGlow)"
            />

            {/* ── Per-node: static ramp track + live ramp + junction dot ── */}
            {experiences.map((_, idx) => {
              const y = TOP_OFFSET + idx * STEP_Y;
              const isRight = idx % 2 === 0;
              const endX = isRight ? 74 : 26;
              const rPath = buildRampPath(idx);

              return (
                <g key={`node-${idx}`}>
                  {/* dim static ramp track */}
                  <path
                    d={rPath}
                    fill="none"
                    stroke="rgba(56,189,248,0.08)"
                    strokeWidth="0.38"
                    strokeLinecap="round"
                  />

                  {/* live ramp: outer glow */}
                  <path
                    ref={(el) => {
                      rampGlowRefs.current[idx] = el;
                    }}
                    d={rPath}
                    fill="none"
                    stroke="rgba(0,245,255,0.52)"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    filter="url(#wireBloom)"
                    style={{ mixBlendMode: "screen", opacity: 0 }}
                  />

                  {/* live ramp: bright thin core */}
                  <path
                    ref={(el) => {
                      rampCoreRefs.current[idx] = el;
                    }}
                    d={rPath}
                    fill="none"
                    stroke="rgba(210,255,255,0.97)"
                    strokeWidth="0.28"
                    strokeLinecap="round"
                    filter="url(#coreGlow)"
                    style={{ opacity: 0 }}
                  />

                  {/* Junction dot — the Y-split point on the bus */}
                  <circle
                    ref={(el) => {
                      junctionRefs.current[idx] = el;
                    }}
                    cx="50"
                    cy={y}
                    r="0.75"
                    fill="rgba(180,255,255,0.92)"
                    style={{ opacity: 0.35 }}
                  />

                  {/* Terminal dot at card entry (end of ramp) */}
                  <circle
                    cx={endX}
                    cy={y}
                    r="0.5"
                    fill="rgba(0,245,255,0.45)"
                    style={{
                      filter: "drop-shadow(0 0 1.2px rgba(0,245,255,0.65))",
                    }}
                  />
                </g>
              );
            })}
          </svg>

          {/* ── Spark — rides the tip of the bus current ──────────────────── */}
          <div
            ref={sparkRef}
            className="pointer-events-none absolute z-20"
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              opacity: 0,
              background:
                "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(0,245,255,0.92) 45%, transparent 80%)",
              boxShadow:
                "0 0 9px 3px rgba(0,245,255,0.65), 0 0 3px 1px rgba(255,255,255,0.9)",
              mixBlendMode: "screen",
            }}
            aria-hidden="true"
          />

          {/* ── End-of-line neon label ────────────────────────────────────── */}
          <div
            className="pointer-events-none absolute left-1/2 -translate-x-1/2 text-center"
            style={{ top: pathEndY + 12 }}
          >
            {/* Vertical lead-in line that also glows */}
            <div
              ref={endLineRef}
              className="mx-auto mb-3 w-px"
              style={{
                height: 28,
                background:
                  "linear-gradient(to bottom, rgba(0,245,255,0.65), rgba(0,245,255,0.08))",
                opacity: 0.3,
              }}
            />

            {/* Neon text — powered by Orbitron + gsap text-shadow + CSS pulse */}
            <div
              ref={endLabelRef}
              style={{
                fontFamily: "'Orbitron', 'Rajdhani', monospace",
                fontSize: "14px",
                fontWeight: 700,
                letterSpacing: "0.30em",
                textTransform: "uppercase",
                color: "rgba(180,255,255,0.4)",
                opacity: 0.22,
              }}
            >
              to be continued
            </div>
          </div>

          {/* ── Experience cards ──────────────────────────────────────────── */}
          {experiences.map((exp, idx) => {
            const top = TOP_OFFSET + idx * STEP_Y;
            const isRight = idx % 2 === 0;

            return (
              <div key={`${exp.title}-${idx}`}>
                <div
                  ref={(el) => {
                    cardRefs.current[idx] = el;
                  }}
                  className={[
                    "absolute w-[90%] sm:w-[74%] lg:w-[42%] max-w-[510px]",
                    "rounded-2xl border p-6 md:p-7",
                    "bg-[rgba(8,14,32,0.90)]",
                    isRight
                      ? "left-1/2 -translate-x-1/2 lg:left-[calc(50%+56px)] lg:translate-x-0"
                      : "left-1/2 -translate-x-1/2 lg:left-auto lg:right-[calc(50%+56px)] lg:translate-x-0",
                  ].join(" ")}
                  style={{
                    top: top - 86,
                    zIndex: 12,
                    borderColor: "rgba(0,245,255,0.12)",
                    boxShadow: "0 20px 50px rgba(0,0,0,0.55)",
                    opacity: 0,
                  }}
                >
                  {/* Neon corner accents */}
                  <span className="pointer-events-none absolute top-0 left-0  w-5 h-5 border-t border-l border-cyan-300/40 rounded-tl-2xl" />
                  <span className="pointer-events-none absolute top-0 right-0 w-5 h-5 border-t border-r border-cyan-300/40 rounded-tr-2xl" />
                  <span className="pointer-events-none absolute bottom-0 left-0  w-5 h-5 border-b border-l border-cyan-300/40 rounded-bl-2xl" />
                  <span className="pointer-events-none absolute bottom-0 right-0 w-5 h-5 border-b border-r border-cyan-300/40 rounded-br-2xl" />

                  <div className="mb-3 inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-200/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                    {exp.date}
                  </div>

                  <h3 className="text-white text-[22px] md:text-[24px] font-bold leading-tight">
                    {exp.title}
                  </h3>
                  <p className="mt-1 text-cyan-100/80 text-[15px] font-semibold">
                    {exp.company_name}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {exp.points.map((pt, pi) => (
                      <li
                        key={pi}
                        className="text-[14px] text-slate-100/90 leading-relaxed flex"
                      >
                        <span className="mr-2 text-cyan-300 select-none">
                          ●
                        </span>
                        <span>{pt}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Experience, "work");
