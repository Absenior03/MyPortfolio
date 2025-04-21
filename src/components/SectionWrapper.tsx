import { motion } from "framer-motion";
import { styles } from "../styles";
import { staggerContainer } from "../utils/motion";
import { ReactNode } from "react";

const SectionWrapper = (Component: React.ComponentType<any>, idName: string) => 
  function HOC() {
    return (
      <motion.section
        variants={staggerContainer()}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.25 }}
        className={`${styles.padding} section-padding max-w-7xl mx-auto relative z-0`}
      >
        <span className="hash-span" id={idName}>
          &nbsp;
        </span>
        
        <div className="animate-fadeInUp">
          <Component />
        </div>
      </motion.section>
    );
  };

export default SectionWrapper; 