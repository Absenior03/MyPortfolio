import { useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import SectionWrapper from "./SectionWrapper";
import { skillCategories } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Canvas, useFrame } from "@react-three/fiber";
import { Preload } from "@react-three/drei";
import * as THREE from "three";

gsap.registerPlugin(ScrollTrigger);

interface SkillTagProps {
  name: string;
  index: number;
  categoryIndex: number;
}

const SkillTag = ({ name, index, categoryIndex }: SkillTagProps) => {
  return (
    <motion.div
      variants={fadeIn("up", "spring", index * 0.1 + categoryIndex * 0.3, 0.75)}
      className="py-2 px-4 bg-tertiary rounded-full m-2 cursor-pointer hover:bg-[#915EFF] transition-colors duration-300"
    >
      <p className="text-white text-[14px] font-medium">{name}</p>
    </motion.div>
  );
};

// Simplified 3D Skills visualization without BVH dependency
const SkillsGraph = () => {
  const groupRef = useRef<THREE.Group>(null);
  
  useEffect(() => {
    if (groupRef.current) {
      // Create particles manually
      const createParticle = (x: number, y: number, z: number) => {
        const geometry = new THREE.SphereGeometry(0.08, 8, 8);
        const material = new THREE.MeshBasicMaterial({
          color: new THREE.Color(
            0.5 + x / 8,
            0.5 + y / 8,
            0.8
          ),
          transparent: true,
          opacity: 0.8,
        });
        
        const particle = new THREE.Mesh(geometry, material);
        particle.position.set(x, y, z);
        return particle;
      };
      
      // Create 100 particles in a sphere formation
      for (let i = 0; i < 100; i++) {
        const radius = Math.random() * 4;
        const theta = Math.random() * Math.PI * 2;
        const phi = Math.acos(2 * Math.random() - 1);
        
        const x = radius * Math.sin(phi) * Math.cos(theta);
        const y = radius * Math.sin(phi) * Math.sin(theta);
        const z = radius * Math.cos(phi);
        
        const particle = createParticle(x, y, z);
        groupRef.current.add(particle);
      }
    }
  }, []);
  
  useFrame((state, delta) => {
    if (groupRef.current) {
      groupRef.current.rotation.x += delta * 0.05;
      groupRef.current.rotation.y += delta * 0.07;
    }
  });
  
  return <group ref={groupRef} />;
};

const SkillsCanvas = () => {
  return (
    <div className="w-full h-[400px]">
      <Canvas camera={{ position: [0, 0, 6], fov: 60 }}>
        <ambientLight intensity={0.5} />
        <SkillsGraph />
        <Preload all />
      </Canvas>
    </div>
  );
};

const Skills = () => {
  useEffect(() => {
    // GSAP scrolling animation
    gsap.fromTo(
      ".skills-title",
      { y: 50, opacity: 0 },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: "#skills-section",
          start: "top 80%",
          end: "top 30%",
          scrub: 1,
        },
      }
    );
  }, []);

  return (
    <div id="skills-section">
      <motion.div className="skills-title" variants={textVariant()}>
        <p className={styles.sectionSubText}>What I can do</p>
        <h2 className={styles.sectionHeadText}>Skills & Technologies.</h2>
      </motion.div>

      <motion.div
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I'm proficient in a wide range of programming languages and technologies, 
        with expertise in web development, cloud technologies, and software engineering. 
        Here's a comprehensive look at my technical skills:
      </motion.div>

      <SkillsCanvas />

      <div className="mt-8">
        {skillCategories.map((category, categoryIndex) => (
          <div key={category.title} className="mb-8">
            <h3 className="text-white text-[20px] font-bold mb-5">{category.title}</h3>
            <div className="flex flex-wrap">
              {category.skills.map((skill, index) => (
                <SkillTag
                  key={skill}
                  name={skill}
                  index={index}
                  categoryIndex={categoryIndex}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SectionWrapper(Skills, "skills"); 