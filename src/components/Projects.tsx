import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import SectionWrapper from "./SectionWrapper";
import { projects } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import { FiGithub, FiExternalLink } from "react-icons/fi";
import gsap from "gsap";
import IconWrapper from "./IconWrapper";

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

  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.5, 0.75)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-tertiary p-5 rounded-2xl sm:w-[360px] w-full h-[480px] overflow-hidden cursor-pointer project-card"
      style={{ 
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        border: "2px solid rgba(145, 94, 255, 0.5)",
        backgroundColor: "#15112b" 
      }}
    >
      <div className="relative w-full h-[230px] overflow-hidden rounded-2xl" 
        style={{ border: "2px solid rgba(145, 94, 255, 0.5)" }}
      >
        {/* Placeholder for project image */}
        <div
          className={`w-full h-full transition-all duration-500 ${
            isHovered ? "scale-105" : "scale-100"
          }`}
          style={{
            background: "linear-gradient(to right, #7928CA, #4338CA)"
          }}
        >
          <div className="absolute inset-0 flex justify-center items-center">
            <h3 style={{ color: "white", fontSize: "1.875rem", fontWeight: "bold", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
              {name.charAt(0)}
            </h3>
          </div>
        </div>
      </div>

      <div className="mt-5" style={{ backgroundColor: "#0e0a1f", padding: "12px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.5)", border: "1px solid rgba(145, 94, 255, 0.3)" }}>
        <div className="flex justify-between items-center">
          <h3 style={{ color: "white", fontWeight: "bold", fontSize: "1.5rem", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
            {name}
          </h3>
          <div className="flex gap-2">
            <a
              href={source_code_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                backgroundColor: "#915EFF", 
                width: "2.5rem", 
                height: "2.5rem", 
                borderRadius: "9999px", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                cursor: "pointer"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <IconWrapper icon={FiGithub} className="w-1/2 h-1/2 text-white" />
            </a>
            <a
              href={live_demo_link}
              target="_blank"
              rel="noopener noreferrer"
              style={{ 
                backgroundColor: "#915EFF", 
                width: "2.5rem", 
                height: "2.5rem", 
                borderRadius: "9999px", 
                display: "flex", 
                justifyContent: "center", 
                alignItems: "center",
                cursor: "pointer"
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <IconWrapper icon={FiExternalLink} className="w-1/2 h-1/2 text-white" />
            </a>
          </div>
        </div>
        <p style={{ 
          color: "white", 
          marginTop: "0.5rem", 
          fontSize: "0.875rem", 
          fontWeight: "500",
          textShadow: "0 1px 2px rgba(0,0,0,0.8)" 
        }}>
          {description}
        </p>
      </div>

      <div className="mt-4 flex flex-wrap gap-2" style={{ 
        padding: "0.5rem",
        backgroundColor: "#0e0a1f", 
        borderRadius: "0.5rem", 
        boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
        border: "1px solid rgba(145, 94, 255, 0.3)"
      }}>
        {tags.map((tag) => (
          <p
            key={`${name}-${tag.name}`}
            className={`${tag.color}`}
            style={{ 
              fontSize: "0.875rem", 
              fontWeight: "500",
              padding: "0.25rem 0.5rem",
              backgroundColor: "rgba(0, 0, 0, 0.5)",
              backdropFilter: "blur(5px)",
              borderRadius: "0.25rem",
              border: "1px solid rgba(145, 94, 255, 0.2)",
              textShadow: "0 1px 2px rgba(0,0,0,0.8)"
            }}
          >
            #{tag.name}
          </p>
        ))}
      </div>

      {isHovered && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="absolute inset-0 flex items-center justify-center"
          style={{ backgroundColor: "rgba(0, 0, 0, 0.95)" }}
        >
          <div className="text-center p-5">
            <h3 style={{ color: "white", fontWeight: "bold", fontSize: "1.5rem", marginBottom: "0.75rem", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
              {name}
            </h3>
            <p style={{ color: "white", marginBottom: "1.25rem", fontWeight: "500", textShadow: "0 1px 2px rgba(0,0,0,0.8)" }}>
              {description}
            </p>
            <div className="flex space-x-4 justify-center">
              <a
                href={source_code_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#915EFF",
                  color: "white",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
                onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
              >
                <IconWrapper icon={FiGithub} /> GitHub
              </a>
              <a
                href={live_demo_link}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  padding: "0.5rem 1rem",
                  backgroundColor: "#00cea8",
                  color: "white",
                  borderRadius: "0.5rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                  transition: "all 0.3s",
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.3)"
                }}
                onMouseOver={(e) => e.currentTarget.style.opacity = "0.8"}
                onMouseOut={(e) => e.currentTarget.style.opacity = "1"}
              >
                <IconWrapper icon={FiExternalLink} /> Live Demo
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
};

const Projects = () => {
  const projectsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // GSAP animation for the project cards
    if (projectsRef.current) {
      const cards = projectsRef.current.querySelectorAll(".project-card");
      
      gsap.from(cards, {
        y: 100,
        opacity: 0,
        stagger: 0.1,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: projectsRef.current,
          start: "top 80%",
          end: "bottom 20%",
        },
      });
    }
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

      <div ref={projectsRef} className="mt-20 flex flex-wrap gap-7 justify-center">
        {projects.map((project, index) => (
          <div key={`project-${index}`} className="project-card">
            <ProjectCard index={index} {...project} />
          </div>
        ))}
      </div>
    </>
  );
};

export default SectionWrapper(Projects, "projects"); 