import { styles } from "../styles";
import { experiences } from "../constants";
import SectionWrapper from "./SectionWrapper";
import { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const Experience = () => {
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const corridorRef = useRef<HTMLDivElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);

  const STEP_Y = 320;
  const TOP_OFFSET = 190;

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const isDesktop = window.matchMedia("(min-width: 768px)").matches;
    if (!isDesktop) {
      return;
    }

    if (
      !sectionRef.current ||
      !stageRef.current ||
      !corridorRef.current ||
      !glowRef.current
    ) {
      return;
    }

    const ctx = gsap.context(() => {
      const cards = cardRefs.current.filter(Boolean) as HTMLDivElement[];
      const nodes = nodeRefs.current.filter(Boolean) as HTMLDivElement[];
      const stageHeight = stageRef.current?.offsetHeight ?? 640;

      gsap.set(cards, {
        opacity: 0,
        y: 64,
        scale: 0.88,
        rotateX: 12,
        filter: "blur(4px)",
        transformOrigin: "50% 50% -120px",
      });

      gsap.set(nodes, {
        scale: 0.82,
        opacity: 0.35,
      });

      const trackDistance = Math.max(1, (experiences.length - 1) * STEP_Y);

      const timelineScrollDistance = Math.max(1600, experiences.length * 520);

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: stageRef.current,
          start: "top top+=88",
          end: `+=${timelineScrollDistance}`,
          scrub: 1,
          pin: stageRef.current,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      tl.to(corridorRef.current, { y: -trackDistance, ease: "none" }, 0).to(
        glowRef.current,
        { y: trackDistance, ease: "none" },
        0,
      );

      nodes.forEach((node, index) => {
        const isLast = index === experiences.length - 1;
        const nodeTop = TOP_OFFSET + index * STEP_Y;
        const startAtY = stageHeight * 0.86;
        const settleAtY = stageHeight * 0.72;
        const dimAtY = stageHeight * 0.3;
        const hideAtY = stageHeight * 0.16;
        const lateCardBoost = index >= 3 ? 120 : 0;
        const revealLead = Math.min(index * 96 + lateCardBoost, 360);
        const revealTop = nodeTop - revealLead;

        const start = gsap.utils.clamp(
          0,
          1,
          (revealTop - startAtY) / trackDistance,
        );
        const settle = gsap.utils.clamp(
          0,
          1,
          (revealTop - settleAtY) / trackDistance,
        );
        const dim = gsap.utils.clamp(0, 1, (nodeTop - dimAtY) / trackDistance);
        const hide = gsap.utils.clamp(
          0,
          1,
          (nodeTop - hideAtY) / trackDistance,
        );
        const hideAt = isLast ? Math.min(0.96, hide) : hide;

        tl.to(
          node,
          {
            scale: 1.22,
            opacity: 1,
            boxShadow: "0 0 24px rgba(103, 232, 249, 0.7)",
            duration: 0.06,
            ease: "power2.out",
          },
          start,
        )
          .to(
            cards[index],
            {
              opacity: 1,
              y: 0,
              scale: 1,
              rotateX: 0,
              filter: "blur(0px)",
              duration: 0.08,
              ease: "power2.out",
            },
            settle,
          )
          .to(
            cards[index],
            {
              opacity: isLast ? 0.5 : 0.56,
              scale: isLast ? 0.92 : 0.94,
              duration: 0.05,
              ease: "power1.out",
            },
            dim,
          )
          .to(
            cards[index],
            {
              opacity: 0,
              y: -36,
              scale: 0.9,
              duration: 0.04,
              ease: "power1.in",
            },
            hideAt,
          )
          .to(
            node,
            {
              scale: 1,
              opacity: 0.75,
              boxShadow: "0 0 10px rgba(103, 232, 249, 0.25)",
              duration: 0.05,
              ease: "power1.out",
            },
            dim,
          )
          .to(
            node,
            {
              opacity: 0,
              scale: 0.82,
              boxShadow: "0 0 0 rgba(0, 0, 0, 0)",
              duration: 0.04,
              ease: "power1.in",
            },
            hideAt,
          );
      });
    });

    return () => ctx.revert();
  }, [STEP_Y]);

  const corridorHeight = TOP_OFFSET + STEP_Y * (experiences.length - 1) + 620;

  return (
    <div id="experience-section" ref={sectionRef}>
      <div className="mb-6 md:hidden">
        <p className={styles.sectionSubText}>What I've done so far</p>
        <h2 className={styles.sectionHeadText}>Experience & Leadership.</h2>
      </div>

      <div className="relative pl-7 grid gap-5 md:hidden">
        <div className="pointer-events-none absolute left-2.5 top-4 bottom-4 w-[2px] rounded-full bg-gradient-to-b from-cyan-300/80 via-cyan-300/35 to-cyan-300/10" />
        {experiences.map((experience, index) => (
          <article
            key={`${experience.title}-${index}`}
            className="relative rounded-2xl border border-cyan-300/25 bg-[rgba(16,22,46,0.82)] p-5 shadow-[0_12px_30px_rgba(0,0,0,0.3)]"
          >
            <span className="pointer-events-none absolute -left-[22px] top-7 h-3.5 w-3.5 rounded-full border border-cyan-200/80 bg-cyan-300/75 shadow-[0_0_14px_rgba(103,232,249,0.5)]" />

            <div className="mb-3 inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-200/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] text-cyan-200">
              {experience.date}
            </div>

            <h3 className="text-white text-[20px] font-bold leading-tight">
              {experience.title}
            </h3>
            <p className="mt-1 text-cyan-100/80 text-[14px] font-semibold">
              {experience.company_name}
            </p>

            <ul className="mt-4 space-y-2">
              {experience.points.map((point, pointIndex) => (
                <li
                  key={`experience-mobile-point-${index}-${pointIndex}`}
                  className="flex text-[13px] leading-relaxed text-slate-100/90"
                >
                  <span className="mr-2 text-cyan-300">●</span>
                  <span>{point}</span>
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <div
        ref={stageRef}
        className="hidden md:block mt-16 h-[82vh] min-h-[640px] relative overflow-hidden rounded-3xl border border-cyan-400/20 bg-[rgba(7,11,26,0.72)] backdrop-blur-xl"
      >
        {/* Keep title visible while the stage is pinned */}
        <div className="pointer-events-none absolute left-4 top-4 z-30 md:left-8 md:top-6">
          <div className="rounded-2xl border border-cyan-300/25 bg-[rgba(5,10,24,0.62)] px-4 py-3 backdrop-blur-md md:px-6 md:py-4">
            <p className={styles.sectionSubText}>What I've done so far</p>
            <h2 className={styles.sectionHeadText}>Experience & Leadership.</h2>
          </div>
        </div>

        {/* Corridor ambience */}
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_10%,rgba(34,211,238,0.16),transparent_55%)]" />
          <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(56,189,248,0.08),transparent_18%,transparent_82%,rgba(56,189,248,0.08))]" />
          <div
            className="absolute inset-0 opacity-35"
            style={{
              backgroundImage:
                "linear-gradient(rgba(56,189,248,0.09) 1px, transparent 1px), linear-gradient(90deg, rgba(56,189,248,0.09) 1px, transparent 1px)",
              backgroundSize: "42px 42px",
              maskImage:
                "radial-gradient(circle at center, black 35%, transparent 88%)",
            }}
          />
        </div>

        <div
          ref={corridorRef}
          className="absolute left-0 top-0 w-full"
          style={{ height: corridorHeight }}
        >
          {/* Timeline spine */}
          <div className="absolute left-1/2 top-0 h-full w-[3px] -translate-x-1/2 bg-gradient-to-b from-cyan-300/20 via-cyan-200/45 to-cyan-300/20" />

          {/* Progress glow travelling along spine */}
          <div
            ref={glowRef}
            className="absolute left-1/2 -translate-x-1/2 h-24 w-8 rounded-full blur-lg"
            style={{
              top: TOP_OFFSET - 42,
              background:
                "radial-gradient(circle, rgba(103,232,249,0.9) 0%, rgba(14,116,144,0.16) 68%, transparent 100%)",
            }}
          />

          {experiences.map((experience, index) => {
            const top = TOP_OFFSET + index * STEP_Y;
            const isRight = index % 2 === 0;

            return (
              <div key={`${experience.title}-${index}`}>
                <div
                  ref={(el) => {
                    nodeRefs.current[index] = el;
                  }}
                  className="absolute left-1/2 -translate-x-1/2 h-5 w-5 rounded-full border border-cyan-200/80 bg-cyan-300/70"
                  style={{ top }}
                />

                <div
                  ref={(el) => {
                    cardRefs.current[index] = el;
                  }}
                  className={`absolute w-[90%] sm:w-[74%] lg:w-[42%] max-w-[520px] rounded-2xl border border-cyan-300/30 bg-[rgba(16,22,46,0.82)] p-6 md:p-7 shadow-[0_24px_50px_rgba(0,0,0,0.45)] ${
                    isRight
                      ? "left-1/2 -translate-x-1/2 lg:left-[calc(50%+56px)] lg:translate-x-0"
                      : "left-1/2 -translate-x-1/2 lg:left-auto lg:right-[calc(50%+56px)] lg:translate-x-0"
                  }`}
                  style={{ top: top - 84, transformStyle: "preserve-3d" }}
                >
                  <div className="mb-3 inline-flex items-center rounded-full border border-cyan-300/35 bg-cyan-200/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.16em] text-cyan-200">
                    {experience.date}
                  </div>

                  <h3 className="text-white text-[22px] md:text-[24px] font-bold leading-tight">
                    {experience.title}
                  </h3>
                  <p className="mt-1 text-cyan-100/80 text-[15px] font-semibold">
                    {experience.company_name}
                  </p>

                  <ul className="mt-5 space-y-2.5">
                    {experience.points.map((point, pointIndex) => (
                      <li
                        key={`experience-point-${index}-${pointIndex}`}
                        className="text-[14px] text-slate-100/90 leading-relaxed flex"
                      >
                        <span className="mr-2 text-cyan-300">●</span>
                        <span>{point}</span>
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
