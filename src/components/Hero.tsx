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
    <section id="hero" className="relative w-full h-screen mx-auto">
      <div
        className={`${styles.paddingX} absolute inset-0 top-[120px] max-w-7xl mx-auto flex flex-row items-start gap-5`}
      >
        <div className="flex flex-col justify-center items-center mt-5">
          <div className="w-5 h-5 rounded-full bg-[#915EFF]" />
          <div className="w-1 sm:h-80 h-40 violet-gradient" />
        </div>

        <div className="hero-text z-10">
          <h1 className={`${styles.heroHeadText} text-white`}>
            Hi, I'm <span className="text-[#915EFF]">Anirban</span>
          </h1>
          <p className={`${styles.heroSubText} mt-2 text-white-100`}>
            Full Stack Developer & MCA Student
            <br className="sm:block hidden" />
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5, duration: 1 }}
              className="mt-1 block"
            >
              Crafting scalable web solutions with creative precision.
            </motion.span>
          </p>
        </div>
      </div>

      <div className="absolute w-full h-[50%] bottom-0 md:h-[70%] lg:h-[85%]">
        {show3D && (
          <ErrorBoundary onError={handleError} fallback={<div className="h-full flex items-center justify-center text-white-100">3D visualization not available</div>}>
            <ComputersCanvasWithNoSSR />
          </ErrorBoundary>
        )}
      </div>

      <div className="absolute xs:bottom-10 bottom-32 w-full flex justify-center items-center">
        <a href="#about">
          <div className="w-[35px] h-[64px] rounded-3xl border-4 border-secondary flex justify-center items-start p-2">
            <motion.div
              animate={{
                y: [0, 24, 0],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                repeatType: "loop",
              }}
              className="w-3 h-3 rounded-full bg-secondary mb-1"
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