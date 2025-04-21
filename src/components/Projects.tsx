import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import SectionWrapper from "./SectionWrapper";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
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
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  // Track mouse position for dynamic shadow
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const card = cardRef.current;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left; // x position within the element
    const y = e.clientY - rect.top;  // y position within the element
    
    setMousePosition({ x, y });
    
    // Calculate shadow position and intensity based on mouse position
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const shadowX = (x - centerX) / 10;
    const shadowY = (y - centerY) / 10;
    const distance = Math.sqrt(Math.pow(x - centerX, 2) + Math.pow(y - centerY, 2));
    const shadowIntensity = Math.min(20, distance / 10);
    
    // Apply dynamic shadow based on mouse position
    gsap.to(card, {
      boxShadow: `${shadowX}px ${shadowY}px ${shadowIntensity}px rgba(145, 94, 255, 0.3), 
                  0 15px 35px rgba(0, 0, 0, 0.2)`,
      duration: 0.5,
    });
  };

  // Enhanced hover effects
  useEffect(() => {
    if (cardRef.current && imageRef.current && contentRef.current) {
      if (isHovered) {
        // Create a timeline for more coordinated animations
        const tl = gsap.timeline();
        tl.to(cardRef.current, {
          y: -10,
          boxShadow: "0 22px 40px rgba(145, 94, 255, 0.3)",
          duration: 0.3,
          ease: "power2.out",
        })
        .to(imageRef.current, {
          scale: 1.05,
          duration: 0.4,
          delay: -0.3,
          ease: "power2.out",
        })
        .to(contentRef.current, {
          y: -5,
          duration: 0.3,
          delay: -0.4,
          ease: "power2.out",
        });
      } else {
        // Reset animations
        const tl = gsap.timeline();
        tl.to(cardRef.current, {
          y: 0,
          boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
          duration: 0.5,
          ease: "power3.out",
        })
        .to(imageRef.current, {
          scale: 1,
          duration: 0.5,
          delay: -0.5,
          ease: "power3.out",
        })
        .to(contentRef.current, {
          y: 0,
          duration: 0.4,
          delay: -0.5,
          ease: "power3.out",
        });
      }
    }
  }, [isHovered]);

  return (
    <motion.div 
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      className="h-full flex"
    >
      <Tilt
        tiltMaxAngleX={10}
        tiltMaxAngleY={10}
        scale={1.05}
        transitionSpeed={1500}
        gyroscope={true}
        className="h-full w-full"
        perspective={1000}
        glareEnable={true}
        glareMaxOpacity={0.15}
        glareColor="#915eff"
        glarePosition="all"
        onEnter={() => setIsHovered(true)}
        onLeave={() => setIsHovered(false)}
        onMove={(values) => {
          if (cardRef.current) {
            const card = cardRef.current;
            const { tiltAngleX, tiltAngleY } = values;
            
            // Calculate shadow position based on tilt angles
            const shadowX = tiltAngleY / 2;
            const shadowY = -tiltAngleX / 2;
            const shadowIntensity = Math.min(20, Math.sqrt(shadowX**2 + shadowY**2) * 2);
            
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
          className="bg-tertiary rounded-2xl w-full h-full flex flex-col relative"
          style={{
            transition: "all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            transform: isHovered ? "translateY(-10px)" : "translateY(0)",
            boxShadow: isHovered 
              ? "0 22px 40px rgba(145, 94, 255, 0.3)" 
              : "0 10px 20px rgba(0, 0, 0, 0.2)",
            border: "1px solid rgba(255, 255, 255, 0.1)",
            transformStyle: "preserve-3d",
          }}
        >
          {/* Project image with links to source code and live demo */}
          <div className="relative w-full h-[220px] overflow-hidden rounded-t-2xl">
            <img
              ref={imageRef}
              src={image}
              alt={`Project ${name} screenshot`}
              className="w-full h-full object-cover"
              style={{
                transition: "transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
              }}
            />

            {/* Overlay gradient */}
            <div 
              className={`absolute inset-0 bg-gradient-to-t from-tertiary to-transparent opacity-60 transition-opacity duration-300 ${isHovered ? 'opacity-40' : 'opacity-60'}`}
            ></div>

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
          <div 
            ref={contentRef}
            className="p-6 flex-1 flex flex-col justify-between"
            style={{
              transition: "transform 0.3s ease-out",
              transform: `translateZ(${isHovered ? '20' : '0'}px)`,
            }}
          >
            <div>
              <h3 className="text-white font-bold text-[22px] leading-tight mb-2" style={{ transform: `translateZ(${isHovered ? '30' : '0'}px)` }}>{name}</h3>
              <p className="mt-1 text-secondary text-[14px] leading-relaxed overflow-hidden line-clamp-3" style={{ transform: `translateZ(${isHovered ? '15' : '0'}px)` }}>
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
                    border: `1px solid ${tag.color === 'text-blue-500' ? 'rgba(59, 130, 246, 0.5)' : 
                             tag.color === 'text-green-500' ? 'rgba(34, 197, 94, 0.5)' : 
                             tag.color === 'text-pink-500' ? 'rgba(236, 72, 153, 0.5)' : 
                             tag.color === 'text-purple-500' ? 'rgba(168, 85, 247, 0.5)' : 
                             tag.color === 'text-red-500' ? 'rgba(239, 68, 68, 0.5)' : 
                             tag.color === 'text-orange-500' ? 'rgba(249, 115, 22, 0.5)' : 
                             tag.color === 'text-yellow-500' ? 'rgba(234, 179, 8, 0.5)' : 'rgba(255, 255, 255, 0.2)'}`,
                    boxShadow: '0 2px 5px rgba(0, 0, 0, 0.15)',
                    transition: 'all 0.3s ease',
                    transform: isHovered ? `translateY(-2px) translateZ(${10 + tagIndex * 2}px)` : 'translateY(0) translateZ(0)',
                  }}
                >
                  #{tag.name}
                </p>
              ))}
            </div>
          </div>
        </div>
      </Tilt>
    </motion.div>
  );
};

const Projects = () => {
  const projectsRef = useRef<HTMLDivElement>(null);
  const projectCardsRefs = useRef<HTMLDivElement[]>([]);

  useEffect(() => {
    // Set up GSAP animations for the project cards
    if (projectsRef.current) {
      // Clear any previous refs
      projectCardsRefs.current = [];
      
      // Get all project cards
      const cards = projectsRef.current.querySelectorAll(".project-card-wrapper");
      cards.forEach((card, index) => {
        projectCardsRefs.current[index] = card as HTMLDivElement;
      });
      
      // Set up ScrollTrigger for staggered animations
      projectCardsRefs.current.forEach((card, index) => {
        gsap.fromTo(
          card,
          { 
            y: 100, 
            opacity: 0,
            scale: 0.9,
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            duration: 0.8,
            ease: "power3.out",
            scrollTrigger: {
              trigger: card,
              start: "top bottom-=100",
              end: "bottom center",
              toggleActions: "play none none none",
            },
            delay: index * 0.15,
          }
        );
      });
    }
    
    return () => {
      // Clean up ScrollTrigger instances when component unmounts
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={`${styles.sectionSubText}`}>My work</p>
        <h2 className={`${styles.sectionHeadText}`}>Projects.</h2>
      </motion.div>

      <div className="w-full flex">
        <motion.p
          variants={fadeIn("", "", 0.1, 1)}
          className="mt-3 text-secondary text-[17px] max-w-3xl leading-[30px]"
        >
          The following projects showcase my skills and experience through real-world examples of my work. 
          Each project is briefly described with links to code repositories and live demos. These projects 
          reflect my ability to solve complex problems, work with different technologies, and manage projects effectively.
        </motion.p>
      </div>

      <div 
        ref={projectsRef} 
        className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7 auto-rows-fr"
      >
        {projects.map((project, index) => (
          <div key={`project-${index}`} className="project-card-wrapper h-full">
            <ProjectCard index={index} {...project} />
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Projects, "projects"); 