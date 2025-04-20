import { motion } from "framer-motion";
import { useEffect, useRef } from "react";
import { styles } from "../styles";
import { services } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";
import SectionWrapper from "./SectionWrapper";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const ServiceCard = ({ index, title, icon }: { index: number, title: string, icon: string }) => {
  return (
    <motion.div
      variants={fadeIn("right", "spring", index * 0.5, 0.75)}
      className="w-full sm:w-[250px] green-pink-gradient p-[1px] rounded-[20px] shadow-card"
    >
      <div
        className="bg-tertiary rounded-[20px] py-5 px-12 min-h-[280px] flex justify-evenly items-center flex-col"
      >
        <div className="w-16 h-16 object-contain flex items-center justify-center">
          <h1 className="text-4xl">{title.charAt(0)}</h1>
        </div>

        <h3 className="text-white text-[20px] font-bold text-center">
          {title}
        </h3>
      </div>
    </motion.div>
  );
};

const About = () => {
  const timelineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (timelineRef.current) {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: timelineRef.current,
          start: "top 80%",
          end: "bottom 20%",
          scrub: 1,
        },
      });

      timeline.fromTo(
        ".timeline-item-mca",
        { x: 100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5 }
      );
      
      timeline.fromTo(
        ".timeline-item-bca",
        { x: -100, opacity: 0 },
        { x: 0, opacity: 1, duration: 0.5 },
        "-=0.3"
      );
    }
  }, []);

  return (
    <>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>Introduction</p>
        <h2 className={styles.sectionHeadText}>About Me.</h2>
      </motion.div>

      <motion.p
        variants={fadeIn("", "", 0.1, 1)}
        className="mt-4 text-secondary text-[17px] max-w-3xl leading-[30px]"
      >
        I'm a skilled full-stack developer with experience in TypeScript and JavaScript, 
        specializing in frameworks like React, Node.js, and Next.js. I'm a quick learner 
        and collaborate closely with clients to create efficient, scalable, and user-friendly 
        solutions that solve real-world problems. I have a strong passion for performance 
        optimization, backend systems, and scalable architectures.
      </motion.p>

      <div className="mt-12 flex flex-wrap gap-10 justify-center">
        {services.map((service, index) => (
          <ServiceCard key={service.title} index={index} {...service} />
        ))}
      </div>

      <div ref={timelineRef} className="mt-20">
        <h3 className={`${styles.sectionSubText} mb-10`}>EDUCATION TIMELINE</h3>
        
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-0 md:left-1/2 top-0 bottom-0 w-1 bg-gradient-to-b from-[#915EFF] to-[#00cea8] transform -translate-x-1/2"></div>
          
          {/* Timeline items */}
          <div className="space-y-8 md:space-y-0 md:grid md:grid-cols-2 md:gap-8">
            {/* MCA */}
            <div className="timeline-item-mca md:col-start-2 relative pb-10 pl-8 md:pl-0 md:pr-8">
              <div className="absolute left-0 md:left-0 top-0 w-4 h-4 rounded-full bg-[#915EFF] transform -translate-x-1/2"></div>
              <div className="bg-tertiary p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white">MCA</h3>
                <p className="text-secondary">Christ University, 2024–26</p>
                <p className="mt-2 text-white-100">
                  Pursuing Master of Computer Applications with a focus on advanced computing, cloud technologies, and distributed systems.
                </p>
              </div>
            </div>
            
            {/* BCA */}
            <div className="timeline-item-bca md:col-start-1 md:text-right relative pb-10 pl-8 md:pl-8 md:pr-0">
              <div className="absolute left-0 md:left-auto md:right-0 top-0 w-4 h-4 rounded-full bg-[#00cea8] transform md:translate-x-1/2 -translate-x-1/2"></div>
              <div className="bg-tertiary p-6 rounded-lg shadow-lg">
                <h3 className="text-xl font-bold text-white">BCA</h3>
                <p className="text-secondary">Kristu Jayanti College, 2021–24</p>
                <p className="mt-2 text-white-100">
                  Completed Bachelor of Computer Applications with distinction, establishing a strong foundation in programming and computer science fundamentals.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <motion.div 
        variants={fadeIn("up", "spring", 0.5, 1)}
        className="mt-16 p-8 bg-tertiary rounded-2xl"
      >
        <h3 className="text-xl font-bold text-white mb-4">Fun Fact</h3>
        <p className="text-secondary">
          When I'm not coding, you'll find me playing football, solving chess puzzles, or exploring the latest tech innovations. 
          I believe in continuous learning and strive to improve my skills every day.
        </p>
      </motion.div>
    </>
  );
};

export default SectionWrapper(About, "about"); 