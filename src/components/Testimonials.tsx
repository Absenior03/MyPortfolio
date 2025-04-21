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
  const quoteRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (cardRef.current && imageRef.current && contentRef.current && quoteRef.current) {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      
      if (active) {
        // Active card animation sequence
        tl.to(cardRef.current, {
          scale: 1,
          boxShadow: "0 25px 50px rgba(107, 33, 168, 0.5)",
          duration: 0.6,
          opacity: 1,
          rotationY: 0,
          z: 50,
          backgroundColor: "rgba(30, 25, 50, 0.95)",
          borderColor: "#915eff",
        })
        .to(imageRef.current, {
          scale: 1.15,
          borderColor: "#915eff",
          borderWidth: 3,
          boxShadow: "0 10px 20px rgba(107, 33, 168, 0.6)",
          duration: 0.4,
          delay: -0.6,
        })
        .to(contentRef.current, {
          y: 0,
          opacity: 1,
          duration: 0.4,
          delay: -0.4,
        })
        .to(quoteRef.current, {
          scale: 1.2,
          opacity: 1,
          rotation: 0,
          duration: 0.5,
          delay: -0.4,
        });
      } else {
        // Inactive card animation sequence
        tl.to(cardRef.current, {
          scale: 0.9,
          boxShadow: "0 8px 15px rgba(0, 0, 0, 0.15)",
          duration: 0.4,
          opacity: 0.6,
          rotationY: 10,
          z: 0,
          backgroundColor: "rgba(21, 17, 43, 0.7)",
          borderColor: "rgba(145, 94, 255, 0.2)",
        })
        .to(imageRef.current, {
          scale: 1,
          borderColor: "rgba(145, 94, 255, 0.3)",
          borderWidth: 2,
          boxShadow: "0 4px 8px rgba(0, 0, 0, 0.2)",
          duration: 0.3,
          delay: -0.4,
        })
        .to(contentRef.current, {
          y: 10,
          opacity: 0.6,
          duration: 0.3,
          delay: -0.3,
        })
        .to(quoteRef.current, {
          scale: 0.8,
          opacity: 0.5,
          rotation: -5,
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
    
    // Mouse position relative to card center (-1 to 1)
    const rotateY = ((x - width / 2) / width) * 7; // -7 to 7 degrees
    const rotateX = ((y - height / 2) / height) * -7; // 7 to -7 degrees
    
    // Calculate distance from center for shadow intensity
    const centerX = width / 2;
    const centerY = height / 2;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const maxDistance = Math.sqrt(Math.pow(width, 2) + Math.pow(height, 2)) / 2;
    const shadowIntensity = Math.min(25, (distance / maxDistance) * 30);

    // Dynamic shadow based on mouse position
    const shadowX = (x - centerX) / 15;
    const shadowY = (y - centerY) / 15;
    
    gsap.to(card, {
      rotateY,
      rotateX,
      boxShadow: `${shadowX}px ${shadowY}px ${shadowIntensity}px rgba(145, 94, 255, 0.4)`,
      duration: 0.3,
      ease: "power2.out",
    });
    
    // Move content slightly in the opposite direction for depth effect
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        x: -rotateY * 0.5,
        y: -rotateX * 0.5,
        duration: 0.5,
      });
    }
    
    // Move image in the same direction but more pronounced
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: rotateY * 1.2,
        y: rotateX * 1.2,
        duration: 0.3,
      });
    }
  };
  
  const handleMouseLeave = () => {
    if (!active || !cardRef.current) return;
    
    gsap.to(cardRef.current, {
      rotateY: 0,
      rotateX: 0,
      boxShadow: "0 25px 50px rgba(107, 33, 168, 0.5)",
      duration: 0.6,
      ease: "elastic.out(1, 0.5)",
    });
    
    if (contentRef.current) {
      gsap.to(contentRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
      });
    }
    
    if (imageRef.current) {
      gsap.to(imageRef.current, {
        x: 0,
        y: 0,
        duration: 0.5,
      });
    }
  };

  return (
    <div
      ref={cardRef}
      className={`testimonial-card p-7 md:p-10 rounded-2xl flex flex-col items-start 
                transition-all duration-300 cursor-pointer backdrop-blur-lg`}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        width: "100%",
        maxWidth: "500px",
        minHeight: "320px",
        border: active ? "1px solid rgba(145, 94, 255, 0.8)" : "1px solid rgba(145, 94, 255, 0.2)",
        background: active ? "rgba(30, 25, 50, 0.95)" : "rgba(21, 17, 43, 0.7)",
        transform: `scale(${active ? 1 : 0.9})`,
        opacity: active ? 1 : 0.6,
        boxShadow: active 
          ? "0 25px 50px rgba(107, 33, 168, 0.5)" 
          : "0 8px 15px rgba(0, 0, 0, 0.15)",
        transformStyle: "preserve-3d",
        transformOrigin: "center center",
        perspective: "1000px",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
      }}
    >
      <div className="mb-5 flex justify-center items-center w-full relative">
        <img
          ref={quoteRef}
          src="./quote.png"
          alt="quote"
          className="w-10 h-10 object-contain drop-shadow-lg"
          style={{
            filter: "hue-rotate(240deg) drop-shadow(0 0 8px rgba(145, 94, 255, 0.6))",
            transform: active ? "scale(1.2) translateZ(30px) rotate(0deg)" : "scale(0.8) translateZ(0) rotate(-5deg)",
            opacity: active ? 1 : 0.5,
            transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
          }}
        />
      </div>
      <div 
        ref={contentRef}
        className="flex-1 flex flex-col"
        style={{
          transform: active ? "translateZ(30px)" : "translateZ(0)",
          transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        }}
      >
        <p className="text-white tracking-wide text-[16px] leading-relaxed italic">"{testimonial}"</p>
        
        <div className="mt-8 flex items-center gap-4 w-full border-t border-purple-500/20 pt-4">
          <div 
            ref={imageRef}
            className="w-14 h-14 rounded-full overflow-hidden border-2 flex-shrink-0"
            style={{ 
              borderColor: active ? "#915eff" : "rgba(145, 94, 255, 0.3)",
              transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              boxShadow: active ? "0 10px 20px rgba(107, 33, 168, 0.6)" : "0 4px 8px rgba(0, 0, 0, 0.2)",
              transform: active ? "translateZ(40px) scale(1.15)" : "translateZ(0) scale(1)",
            }}
          >
            <img
              src={image}
              alt={`feedback-by-${name}`}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex-1 flex flex-col">
            <p className="text-white font-medium text-[17px]">
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-purple-600">{name}</span>
            </p>
            <p className="mt-1 text-gray-300 text-[13px]">
              {designation} · {company}
            </p>
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
  const cardsContainerRef = useRef<HTMLDivElement>(null);
  
  // Handle touch events for swipe gestures
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.targetTouches[0].clientX);
  };
  
  const handleTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
  };
  
  const handleTouchEnd = () => {
    if (touchStart - touchEnd > 80) {
      // Swipe left - go to next
      handleNext();
    } else if (touchStart - touchEnd < -80) {
      // Swipe right - go to previous
      handlePrev();
    }
  };
  
  // Animation for navigation between testimonials
  const animateNavigation = (direction: 'prev' | 'next') => {
    if (testimonialsContainerRef.current) {
      // Initial position based on direction
      const xMove = direction === 'next' ? 80 : -80;
      const rotation = direction === 'next' ? -8 : 8;
      
      // Create a timeline for smoother sequence of animations
      const tl = gsap.timeline();
      
      // Animate out current testimonials
      tl.to(testimonialsContainerRef.current, { 
        opacity: 0, 
        x: -xMove, 
        rotationY: -rotation,
        scale: 0.9,
        duration: 0.4, 
        ease: "power2.in" 
      })
      // Animate in new testimonials
      .to(testimonialsContainerRef.current, {
        opacity: 1, 
        x: 0,
        rotationY: 0,
        scale: 1,
        duration: 0.6, 
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
        duration: 0.6,
        ease: "power2.out"
      });
    }
    
    // Highlight active dot
    if (cardsContainerRef.current) {
      const dots = cardsContainerRef.current.querySelectorAll('.nav-dot');
      dots.forEach((dot, index) => {
        if (index === active) {
          gsap.to(dot, {
            scale: 1.5,
            backgroundColor: '#915eff',
            boxShadow: '0 0 10px rgba(145, 94, 255, 0.7)',
            duration: 0.3
          });
        } else {
          gsap.to(dot, {
            scale: 1,
            backgroundColor: 'rgba(145, 94, 255, 0.3)',
            boxShadow: 'none',
            duration: 0.3
          });
        }
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
    <div className="mt-12 relative">
      <div className="text-center mb-12">
        <motion.div variants={textVariant()} className="space-y-3">
          <p className={`${styles.sectionSubText} inline-block`}>What others say</p>
          <h2 className={`${styles.sectionHeadText} relative`}>
            Testimonials
            <span className="absolute -bottom-3 left-0 w-2/3 h-[3px] bg-gradient-to-r from-purple-500 to-transparent"></span>
          </h2>
        </motion.div>
      </div>

      <div className="relative max-w-7xl mx-auto">
        {/* Background decorative elements */}
        <div className="absolute top-1/4 -left-10 w-40 h-40 bg-purple-600/10 rounded-full filter blur-3xl"></div>
        <div className="absolute bottom-1/3 -right-10 w-60 h-60 bg-indigo-600/10 rounded-full filter blur-3xl"></div>
        
        <div 
          ref={testimonialsContainerRef}
          className="flex items-center justify-center py-10 px-4"
          style={{ perspective: "1200px" }}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div 
            className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full max-w-5xl mx-auto relative"
            ref={cardsContainerRef}
          >
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                variants={fadeIn("", "spring", index * 0.25, 0.75)}
                className={`testimonial-wrapper ${
                  active === index ? 'lg:col-span-1 order-first lg:order-none z-20' : 'lg:hidden'
                }`}
                initial="hidden"
                animate="show"
                style={{
                  display: (active === index || 
                          (window.innerWidth >= 1024 && (
                            index === (active + 1) % testimonials.length || 
                            index === (active - 1 + testimonials.length) % testimonials.length
                          )))
                           ? "block" : "none",
                  opacity: 1
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
        </div>

        {/* Navigation dots */}
        <div className="flex justify-center gap-3 mt-4 mb-8">
          {testimonials.map((_, index) => (
            <button
              key={`dot-${index}`}
              className="nav-dot w-3 h-3 rounded-full bg-purple-500/30 transition-all duration-300"
              onClick={() => setActive(index)}
              aria-label={`Go to testimonial ${index + 1}`}
              style={{
                transform: `scale(${active === index ? 1.5 : 1})`,
                backgroundColor: active === index ? '#915eff' : 'rgba(145, 94, 255, 0.3)',
                boxShadow: active === index ? '0 0 10px rgba(145, 94, 255, 0.7)' : 'none'
              }}
            />
          ))}
        </div>

        {/* Progress bar (now more subtle) */}
        <div className="w-full max-w-md mx-auto h-1 bg-[rgba(145,94,255,0.1)] rounded-full overflow-hidden">
          <div 
            ref={progressBarRef}
            className="h-full bg-gradient-to-r from-[#915eff] to-[#6b21a8]"
            style={{ width: `${((active + 1) / testimonials.length) * 100}%` }}
          ></div>
        </div>

        {/* Navigation buttons */}
        <div className="flex justify-center gap-6 mt-8">
          <button
            onClick={handlePrev}
            className="p-3 rounded-full bg-[rgba(21,17,43,0.7)] hover:bg-[#1e1932] transition-all duration-300 transform hover:scale-110"
            style={{
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(145, 94, 255, 0.3)",
              backdropFilter: "blur(10px)",
            }}
            aria-label="Previous testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-300"
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
            className="p-3 rounded-full bg-[rgba(21,17,43,0.7)] hover:bg-[#1e1932] transition-all duration-300 transform hover:scale-110"
            style={{
              boxShadow: "0 4px 15px rgba(0, 0, 0, 0.2)",
              border: "1px solid rgba(145, 94, 255, 0.3)",
              backdropFilter: "blur(10px)",
            }}
            aria-label="Next testimonial"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-purple-300"
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
    </div>
  );
};

export default SectionWrapper(Testimonials, "testimonials"); 