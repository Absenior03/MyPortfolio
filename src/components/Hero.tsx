import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import dynamic from "next/dynamic";
import { styles } from "../styles";
import { gsap } from "../utils/gsap";

// Dynamically import ComputersCanvas with no SSR
const ComputersCanvasWithNoSSR = dynamic(
  () => import("./canvas/Computers").then((mod) => ({ default: mod.default })),
  { ssr: false, loading: () => <div className="h-full flex items-center justify-center">Loading 3D Model...</div> }
);

// Animation variants
const textVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: "easeOut" }
  }
};

const lineVariants = {
  hidden: { height: 0, opacity: 0 },
  visible: { 
    height: "70px", 
    opacity: 1,
    transition: { duration: 1, delay: 0.5, ease: "easeOut" }
  }
};

const Hero = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [show3D, setShow3D] = useState(true);

  useEffect(() => {
    setIsMounted(true);

    if (isMounted) {
      // Parallax effect on scroll
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: "#hero",
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      tl.to(".hero-text", {
        y: 100,
        opacity: 0,
      });
    }
  }, [isMounted]);

  // Error handler for 3D component
  const handleError = () => {
    console.error("Failed to load 3D component");
    setShow3D(false);
  };

  return (
    <section id="hero" className="relative w-full h-screen mx-auto overflow-hidden">
      {/* Minimal background with subtle gradient */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-[-10%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-[#2a1363] opacity-5 blur-[100px] animate-pulse" style={{ animationDuration: '15s' }} />
        <div className="absolute bottom-[-5%] right-[10%] w-[25vw] h-[25vw] rounded-full bg-[#2a1363] opacity-5 blur-[100px] animate-pulse" style={{ animationDuration: '20s' }} />
      </div>

      <div
        className={`${styles.paddingX} absolute inset-0 top-[150px] max-w-7xl mx-auto flex flex-row items-start gap-8 z-10`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-1 sm:h-80 h-40 bg-gradient-to-b from-[#915EFF] to-transparent" />
        </div>

        <div className="z-10 max-w-2xl fade-in">
          <h1 className={`${styles.heroHeadText}`}>
            <span className="text-white">Hi, I'm</span> <span className="text-[#915EFF]">Anirban</span>
          </h1>
          <p className={`${styles.heroSubText} mt-4 text-white-100 opacity-80`}>
            Software Engineer
            <br className="sm:block hidden" />
            <span className="mt-5 block text-sm md:text-base leading-relaxed text-[#aaa6c3]">
              Crafting scalable web solutions with creative precision.
            </span>
          </p>

          {/* CTA buttons with simplified styling */}
          <div className="mt-10 flex flex-wrap gap-5">
            <a href="#contact" className="button-primary">
              Let's Connect
            </a>
            <a 
              href="/assets/Anirban_Banerjee_Resume.pdf" 
              download
              className="border border-[#915EFF] py-[0.6rem] px-6 rounded-md text-sm text-white transition-all duration-300 inline-flex items-center gap-2 hover:bg-[#915EFF]/10"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Resume
            </a>
          </div>
        </div>
      </div>

      <div className="absolute w-full h-[45%] bottom-0 md:h-[65%] lg:h-[75%]">
        {show3D && (
          <ErrorBoundary onError={handleError} fallback={<div className="h-full flex items-center justify-center text-white-100">3D visualization not available</div>}>
            <ComputersCanvasWithNoSSR />
          </ErrorBoundary>
        )}
      </div>

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-full border border-[#aaa6c3] flex justify-center items-start p-2 hover:border-[#915EFF] transition-colors duration-300">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-white mb-1"
            />
          </div>
        </a>
      </div>
    </section>
  );
};

// Simple error boundary component
class ErrorBoundary extends React.Component<{
  children: React.ReactNode;
  fallback: React.ReactNode;
  onError?: () => void;
}> {
  state = { hasError: false };

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.error("3D Component Error:", error);
    if (this.props.onError) this.props.onError();
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

export default Hero; 
