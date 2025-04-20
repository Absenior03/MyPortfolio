import React, { useState, useEffect } from "react";
import Link from "next/link";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { motion } from "framer-motion";

// Animation variants
const navVariants = {
  hidden: { opacity: 0, y: -20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 70,
      damping: 20,
      mass: 0.5
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({ 
    opacity: 1, 
    y: 0,
    transition: {
      delay: i * 0.07 + 0.2,
      duration: 0.4,
      ease: "easeOut"
    }
  })
};

const Navbar = () => {
  const [active, setActive] = useState("");
  const [scrolled, setScrolled] = useState(false);
  const [toggle, setToggle] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      if (scrollTop > 100) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="w-full flex justify-between items-center max-w-7xl mx-auto">
        <Link
          href="/"
          className="flex items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <motion.div
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <h1 className="text-white text-[20px] font-medium cursor-pointer flex">
              Anirban&nbsp;
              <span className="text-[#915EFF]">Banerjee</span>
            </h1>
            <motion.span 
              className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-[#915EFF] to-transparent" 
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </motion.div>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-8">
          {navLinks.map((nav, index) => (
            <motion.li
              key={nav.id}
              custom={index}
              variants={itemVariants}
              initial="hidden"
              animate="visible"
              className={`${
                active === nav.title ? "text-white" : "text-secondary"
              } hover:text-white text-[16px] font-normal cursor-pointer relative group`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`} className="inline-block py-2">{nav.title}</a>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#915EFF] group-hover:w-full transition-all duration-300" />
            </motion.li>
          ))}
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <div
            className="w-[24px] h-[24px] cursor-pointer flex flex-col justify-between"
            onClick={() => setToggle(!toggle)}
          >
            <motion.span 
              animate={{ 
                rotate: toggle ? 45 : 0, 
                y: toggle ? 7 : 0,
              }}
              className="w-full h-[1px] bg-white block"
            />
            <motion.span 
              animate={{ opacity: toggle ? 0 : 1 }}
              className="w-full h-[1px] bg-white block"
            />
            <motion.span 
              animate={{ 
                rotate: toggle ? -45 : 0, 
                y: toggle ? -7 : 0,
              }}
              className="w-full h-[1px] bg-white block"
            />
          </div>

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ 
              scale: toggle ? 1 : 0.9,
              opacity: toggle ? 1 : 0,
            }}
            className={`${
              !toggle ? "hidden" : "flex"
            } p-5 bg-black/70 backdrop-blur-lg absolute top-20 right-0 mx-4 my-2 min-w-[160px] z-10 rounded-lg border border-gray-800/30`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-3">
              {navLinks.map((nav) => (
                <motion.li
                  key={nav.id}
                  whileHover={{ x: 3 }}
                  className={`font-poppins font-normal cursor-pointer text-[15px] ${
                    active === nav.title ? "text-white" : "text-secondary"
                  } transition-colors duration-200 ease-in-out w-full`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a 
                    href={`#${nav.id}`}
                    className="w-full block py-1 px-1"
                  >
                    {nav.title}
                  </a>
                </motion.li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar; 