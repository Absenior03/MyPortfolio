import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import SectionWrapper from "./SectionWrapper";
import { testimonials } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import gsap from "gsap";

interface TestimonialCardProps {
  index: number;
  testimonial: string;
  name: string;
  designation: string;
  company: string;
  image: string;
  active: boolean;
  handleClick: () => void;
}

const TestimonialCard = ({
  index,
  testimonial,
  name,
  designation,
  company,
  image,
  active,
  handleClick,
}: TestimonialCardProps) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (cardRef.current && imageRef.current && contentRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      if (active) {
        // Active card animation sequence
        tl.to(cardRef.current, {
          scale: 1.05,
          boxShadow: "0 20px 40px rgba(107, 33, 168, 0.4)",
          duration: 0.5,
          opacity: 1,
          rotationY: 0,
          z: 50,
        })
        .to(imageRef.current, {
          scale: 1.1,
          borderColor: "#915eff",
          borderWidth: 3,
          boxShadow: "0 8px 16px rgba(107, 33, 168, 0.4)",
          duration: 0.4,
          delay: -0.5,
        })
        .to(contentRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          delay: -0.4,
        });
      } else {
        // Inactive card animation sequence
        tl.to(cardRef.current, {
          scale: 0.95,
          boxShadow: "0 8px 15px rgba(0, 0, 0, 0.2)",
          duration: 0.4,
          opacity: 0.7,
          rotationY: 5,
          z: 0,
        })
        .to(imageRef.current, {
          scale: 1,
          borderColor: "rgba(145, 94, 255, 0.3)",
          borderWidth: 2,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.3)",
          duration: 0.3,
          delay: -0.4,
        })
        .to(contentRef.current, {
          y: 10,
          opacity: 0.8,
          duration: 0.3,
          delay: -0.3,
        });
      }
    }
  }, [active]);

  // Mouse parallax effect for active cards
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!active || !cardRef.current) return;
    
    const card = cardRef.current;
    const { left, top, width, height } = card.getBoundingClientRect();
    const x = e.clientX - left;
    const y = e.clientY - top;
    
    const rotateY = ((x - width / 2) / width) * 5; // -5 to 5 degrees
    const rotateX = ((y - height / 2) / height) * -5; // 5 to -5 degrees
    
    gsap.to(card, {
      rotateY,
      rotateX,
      duration: 0.5,
      ease: "power2.out",
    });
  };
  
  const handleMouseLeave = () => {
    if (!active || !cardRef.current) return;
    
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      duration: 0.5,
      ease: "elastic.out(1, 0.5)",
    });
  };

  return (
    <div
      ref={cardRef}
      className={`testimonial-card p-10 rounded-3xl flex flex-col items-start 
                ${active ? "bg-tertiary" : "bg-[rgba(21,17,43,0.8)]"} 
                transition-all duration-300 cursor-pointer`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: "100%",
        maxWidth: "500px",
        minHeight: "320px",
        border: active ? "1px solid rgba(145, 94, 255, 0.8)" : "1px solid rgba(145, 94, 255, 0.2)",
        backdropFilter: "blur(15px)",
        transform: active ? "scale(1.05)" : "scale(0.95)",
        opacity: active ? 1 : 0.7,
        boxShadow: active 
          ? "0 20px 40px rgba(107, 33, 168, 0.4)" 
          : "0 8px 15px rgba(0, 0, 0, 0.2)",
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        perspective: "1000px",
      }}
    >
      <div className="mb-7 flex justify-center items-center w-full">
        <img
          src="./quote.png"
          alt="quote"
          className="w-10 h-10 rounded-full object-cover drop-shadow-lg"
          style={{
            transform: active ? "scale(1.1) translateZ(20px)" : "scale(1) translateZ(0)",
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        />
      </div>
      <div 
        ref={contentRef}
        style={{
          transform: active ? "translateZ(20px)" : "translateZ(0)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      >
        <p className="text-white tracking-wider text-[16px] mb-6 leading-relaxed">{testimonial}</p>
        <div className="mt-auto flex justify-between items-center gap-4 w-full">
          <div className="flex-1 flex flex-col">
            <p className="text-white font-medium text-[16px]">
              <span className="blue-text-gradient">@</span> {name}
            </p>
            <p className="mt-1 text-secondary text-[12px]">
              {designation} of {company}
            </p>
          </div>
          <div 
            ref={imageRef}
            className="w-12 h-12 rounded-full overflow-hidden border-2"
            style={{ 
              borderColor: active ? "#915eff" : "rgba(145, 94, 255, 0.3)",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              boxShadow: active ? "0 8px 16px rgba(107, 33, 168, 0.4)" : "0 4px 8px rgba(0, 0, 0, 0.3)",
              transform: active ? "translateZ(30px)" : "translateZ(0)",
            }}
          >
            <img
              src={image}
              alt={`feedback-by-${name}`}
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [active, setActive] = useState(0);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  const testimonialsContainerRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  
  // Handle touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 100) {
      // Swipe left - go to next
      handleNext();
    } else if (touchStart - touchEnd < -100) {
      // Swipe right - go to previous
      handlePrev();
    }
  };
  
  // Animation for navigation between testimonials
  const animateNavigation = (direction: 'prev' | 'next') => {
    if (testimonialsContainerRef.current) {
      // Initial position based on direction
      const xMove = direction === 'next' ? 50 : -50;
      const rotation = direction === 'next' ? -5 : 5;
      
      // Create a timeline for smoother sequence of animations
      const tl = gsap.timeline();
      
      // Animate out current testimonials
      tl.to(testimonialsContainerRef.current, { 
        opacity: 0, 
        x: -xMove, 
        rotationY: -rotation,
        scale: 0.95,
        duration: 0.4, 
        ease: "power2.in" 
      })
      // Animate in new testimonials
      .to(testimonialsContainerRef.current, {
        opacity: 1, 
        x: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.5, 
        ease: "power3.out" 
      });
    }
    
    // Update progress bar
    updateProgressBar();
  };
  
  // Update progress bar to reflect current testimonial
  const updateProgressBar = () => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, {
        width: `${((active + 1) / testimonials.length) * 100}%`,
        duration: 0.5,
        ease: "power2.out"
      });
    }
  };
  
  // Initialize progress bar
  useEffect(() => {
    updateProgressBar();
  }, []);

  const handlePrev = () => {
    setActive((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
    animateNavigation('prev');
  };

  const handleNext = () => {
    setActive((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
    animateNavigation('next');
  };

  // Auto-advance testimonials every 8 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      handleNext();
    }, 8000);
    
    return () => clearInterval(interval);
  }, [active]);

  return (
    <div className="mt-20 relative">
      <div className={`${styles.padding} bg-tertiary rounded-2xl min-h-[300px]`}>
        <motion.div variants={textVariant()}>
          <p className={styles.sectionSubText}>What others say</p>
          <h2 className={styles.sectionHeadText}>Testimonials.</h2>
        </motion.div>
      </div>

      <div 
        ref={testimonialsContainerRef}
        className={`${styles.paddingX} -mt-20 pb-14 flex flex-wrap justify-center gap-7`}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
      >
        {testimonials.map((testimonial, index) => (
          <motion.div
            key={testimonial.name}
            variants={fadeIn("", "spring", index * 0.5, 0.75)}
            className={`relative ${
              active === index ? 'z-10' : 'z-0'
            } flex justify-center items-center w-full sm:w-[calc(100%/3-40px)] opacity-0`}
            initial="hidden"
            animate="show"
            style={{
              display: active === index || 
                     active === index - 1 || 
                     active === index + 1 || 
                     (active === 0 && index === testimonials.length - 1) || 
                     (active === testimonials.length - 1 && index === 0) 
                     ? "flex" : "none"
            }}
          >
            <TestimonialCard
              index={index}
              {...testimonial}
              active={active === index}
              handleClick={() => setActive(index)}
            />
          </motion.div>
        ))}
      </div>

      {/* Progress indicator */}
      <div className="flex flex-col items-center justify-center mb-4">
        <div className="w-full max-w-md h-1 bg-[rgba(145,94,255,0.2)] rounded-full overflow-hidden">
          <div 
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#915eff] to-[#6b21a8]"
            style={{ width: `${((active + 1) / testimonials.length) * 100}%` }}
          ></div>
        </div>
        <p className="text-sm text-secondary mt-2">
          {active + 1} / {testimonials.length}
        </p>
      </div>

      {/* Navigation buttons */}
      <div className="flex justify-center gap-4 mt-2">
        <button
          onClick={handlePrev}
          className="p-3 rounded-full bg-[rgba(21,17,43,0.9)] hover:bg-tertiary transition-all duration-300 transform hover:scale-110"
          style={{
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(145, 94, 255, 0.3)",
          }}
          aria-label="Previous testimonial"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </button>
        <button
          onClick={handleNext}
          className="p-3 rounded-full bg-[rgba(21,17,43,0.9)] hover:bg-tertiary transition-all duration-300 transform hover:scale-110"
          style={{
            boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
            border: "1px solid rgba(145, 94, 255, 0.3)",
          }}
          aria-label="Next testimonial"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-white"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 5l7 7-7 7"
            />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SectionWrapper(Testimonials, "testimonials"); 