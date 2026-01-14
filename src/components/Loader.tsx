import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";

const Loader = () => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Simulate loading progress
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + 5;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-primary">
      <div className="flex flex-col items-center">
        <motion.div
          animate={{
            scale: [1, 1.5, 1],
            rotate: [0, 360, 0],
          }}
          transition={{
            duration: 2,
            ease: "easeInOut",
            repeat: Infinity,
          }}
          className="h-24 w-24 rounded-full border-b-2 border-white"
        />
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className={`${styles.heroHeadText} mt-8 text-center`}
        >
          Anirban Banerjee
        </motion.h1>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className={`${styles.heroSubText} mt-2 text-center`}
        >
          Software Engineer & Full Stack Developer
        </motion.p>
        <div className="w-64 h-2 bg-gray-700 mt-8 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-[#915EFF]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Loader; 
