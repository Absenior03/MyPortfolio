import { useLayoutEffect, useRef } from "react";
import { styles } from "../styles";
import { projects } from "../constants";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Tilt from "react-parallax-tilt";
import { github, external } from "../assets";

// Register ScrollTrigger plugin
gsap.registerPlugin(ScrollTrigger);

interface ProjectCardProps {
  index: number;
  name: string;
  description: string;
  tags: {
    name: string;
    color: string;
  }[];
  image: string;
  source_code_link: string;
  live_demo_link: string;
}

const ProjectCard = ({
  index,
  name,
  description,
  tags,
  image,
  source_code_link,
  live_demo_link,
}: ProjectCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  return (
    <div className="w-full">
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        scale={1}
        transitionSpeed={1500}
        gyroscope={true}
        className="w-full"
        perspective={1000}
        glareEnable={true}
        glareMaxOpacity={0.15}
        glareColor="#915eff"
        glarePosition="all"
        onMove={(values) => {
          if (cardRef.current) {
            const card = cardRef.current;
            const { tiltAngleX, tiltAngleY } = values;

            // Calculate shadow position based on tilt angles
            const shadowX = tiltAngleY / 2;
            const shadowY = -tiltAngleX / 2;
            const shadowIntensity = Math.min(
              20,
              Math.sqrt(shadowX ** 2 + shadowY ** 2) * 2,
            );

            gsap.to(card, {
              boxShadow: `${shadowX}px ${shadowY}px ${shadowIntensity}px rgba(145, 94, 255, 0.3), 
                          0 15px 35px rgba(0, 0, 0, 0.2)`,
              duration: 0.5,
            });
          }
        }}
        tiltAngleXInitial={0}
        tiltAngleYInitial={0}
        tiltEnable={true}
      >
        <div
          ref={cardRef}
          className="bg-tertiary rounded-2xl w-full min-h-[460px] flex flex-col relative"
          style={{
            transition: "box-shadow 0.25s ease",
            boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
          }}
        >
          {/* Project image with links to source code and live demo */}
          <div className="relative w-full h-[220px] overflow-hidden rounded-t-2xl">
            <img
              src={image}
              alt={`Project ${name} screenshot`}
              className="w-full h-full object-cover"
              style={{
                transition:
                  "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            />

            {/* Overlay gradient */}
            <div className="absolute inset-0 bg-gradient-to-t from-tertiary to-transparent opacity-60 transition-opacity duration-300"></div>

            <div className="absolute inset-0 flex justify-end gap-2 m-3">
              {/* GitHub link */}
              {source_code_link && (
                <div
                  onClick={() => window.open(source_code_link, "_blank")}
                  className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform duration-300"
                  aria-label="View source code"
                  style={{
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <img
                    src={github}
                    alt="source code"
                    className="w-1/2 h-1/2 object-contain"
                  />
                </div>
              )}

              {/* Live demo link (if available) */}
              {live_demo_link && (
                <div
                  onClick={() => window.open(live_demo_link, "_blank")}
                  className="black-gradient w-10 h-10 rounded-full flex justify-center items-center cursor-pointer hover:scale-110 transition-transform duration-300"
                  aria-label="View live demo"
                  style={{
                    backdropFilter: "blur(4px)",
                    border: "1px solid rgba(255, 255, 255, 0.1)",
                  }}
                >
                  <img
                    src={external}
                    alt="live demo"
                    className="w-1/2 h-1/2 object-contain"
                  />
                </div>
              )}
            </div>
          </div>

          {/* Project details */}
          <div className="p-6 flex-1 flex flex-col justify-between">
            <div>
              <h3 className="text-white font-bold text-[22px] leading-tight mb-2">
                {name}
              </h3>
              <p className="mt-1 text-secondary text-[14px] leading-relaxed overflow-hidden line-clamp-3">
                {description}
              </p>
            </div>

            {/* Project tags */}
            <div className="mt-4 flex flex-wrap gap-2">
              {tags.map((tag, tagIndex) => (
                <p
                  key={`${name}-${tag.name}`}
                  className={`text-[12px] ${tag.color} py-1 px-2 rounded-full bg-black bg-opacity-30 backdrop-blur-sm whitespace-nowrap`}
                  style={{
                    border: `1px solid ${
                      tag.color === "text-blue-500"
                        ? "rgba(59, 130, 246, 0.5)"
                        : tag.color === "text-green-500"
                          ? "rgba(34, 197, 94, 0.5)"
                          : tag.color === "text-pink-500"
                            ? "rgba(236, 72, 153, 0.5)"
                            : tag.color === "text-purple-500"
                              ? "rgba(168, 85, 247, 0.5)"
                              : tag.color === "text-red-500"
                                ? "rgba(239, 68, 68, 0.5)"
                                : tag.color === "text-orange-500"
                                  ? "rgba(249, 115, 22, 0.5)"
                                  : tag.color === "text-yellow-500"
                                    ? "rgba(234, 179, 8, 0.5)"
                                    : "rgba(255, 255, 255, 0.2)"
                    }`,
                    boxShadow: "0 2px 5px rgba(0, 0, 0, 0.15)",
                    transition: "all 0.3s ease",
                  }}
                >
                  #{tag.name}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </div>
  );
};

const Projects = () => {
  const pinWrapRef = useRef<HTMLDivElement>(null);
  const stickyRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    let resizeHandler: (() => void) | null = null;
    let initTimeoutId: number | null = null;

    const ctx = gsap.context(() => {
      // Small delay helps React finish layout/image sizing before measuring widths.
      initTimeoutId = window.setTimeout(() => {
        const setupHorizontalScroll = () => {
          const pinWrap = pinWrapRef.current;
          const viewport = viewportRef.current;
          const track = trackRef.current;

          if (!pinWrap || !viewport || !track) {
            return;
          }

          // Retry once layout settles; avoids zero-width calculations on first pass.
          if (viewport.clientWidth === 0 || track.scrollWidth === 0) {
            requestAnimationFrame(setupHorizontalScroll);
            return;
          }

          const horizontalDistance = Math.max(
            0,
            track.scrollWidth - viewport.clientWidth,
          );

          pinWrap.style.minHeight = `${Math.round(
            window.innerHeight +
              horizontalDistance +
              viewport.clientHeight * 0.5,
          )}px`;

          gsap.set(track, { x: 0 });

          if (horizontalDistance <= 0) {
            ScrollTrigger.refresh();
            return;
          }

          const horizontalTween = gsap.to(track, {
            x: -horizontalDistance,
            ease: "none",
            paused: true,
          });

          ScrollTrigger.create({
            trigger: pinWrap,
            start: "top top",
            end: () => `+=${horizontalDistance + viewport.clientHeight * 0.5}`,
            scrub: 1,
            animation: horizontalTween,
            invalidateOnRefresh: true,
            onRefresh: () => {
              const nextDistance = Math.max(
                0,
                (trackRef.current?.scrollWidth ?? 0) -
                  (viewportRef.current?.clientWidth ?? 0),
              );
              gsap.set(track, {
                x: -Math.min(horizontalDistance, nextDistance),
              });
              gsap.set(track, { x: 0 });
            },
          });

          resizeHandler = () => ScrollTrigger.refresh();
          window.addEventListener("resize", resizeHandler);
          ScrollTrigger.refresh();
        };

        requestAnimationFrame(setupHorizontalScroll);
      }, 120);
    }, pinWrapRef);

    return () => {
      if (initTimeoutId !== null) {
        window.clearTimeout(initTimeoutId);
      }
      if (resizeHandler) {
        window.removeEventListener("resize", resizeHandler);
      }
      ctx.revert();
    };
  }, []);

  return (
    <section
      className={`${styles.padding} section-padding max-w-7xl mx-auto relative z-10`}
    >
      <span className="hash-span" id="projects">
        &nbsp;
      </span>

      <div ref={pinWrapRef} className="mt-4 relative z-20">
        <div
          ref={stickyRef}
          className="sticky top-0 h-screen flex flex-col justify-start gap-8 py-10"
        >
          <div className="shrink-0">
            <p className={`${styles.sectionSubText}`}>My work</p>
            <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
          </div>

          <div className="w-full flex">
            <p className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]">
              The following projects showcase my skills and experience through
              real-world examples of my work. Each project is briefly described
              with links to code repositories and live demos. These projects
              reflect my ability to solve complex problems, work with different
              technologies, and manage projects effectively.
            </p>
          </div>

          <div className="mt-6">
            <div
              ref={viewportRef}
              className="h-[72vh] md:h-[74vh] overflow-hidden rounded-2xl"
            >
              <div
                ref={trackRef}
                className="flex h-full items-start gap-6 md:gap-8 will-change-transform"
              >
                {projects.map((project, index) => (
                  <div
                    key={`project-${index}`}
                    className="project-card-wrapper flex-shrink-0 self-start w-[80vw] md:w-[58vw] lg:w-[46vw] max-w-[720px] py-3"
                  >
                    <ProjectCard index={index} {...project} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Projects;
