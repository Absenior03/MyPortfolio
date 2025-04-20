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
        
        {/* Section divider at the top */}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
        
        <div className="animate-fadeInUp">
          <Component />
        </div>
        
        {/* Section divider at the bottom */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-40 h-[1px] bg-gradient-to-r from-transparent via-purple-500/20 to-transparent"></div>
      </motion.section>
    );
  };

export default SectionWrapper; 