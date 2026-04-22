import React, { useState, useEffect } from "react";
import Link from "next/link";
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
      mass: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: -10 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.07 + 0.2,
      duration: 0.4,
      ease: "easeOut",
    },
  }),
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

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 768) {
        setToggle(false);
      }
    };

    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return (
    <motion.nav
      variants={navVariants}
      initial="hidden"
      animate="visible"
      className={`w-full flex items-center py-4 md:py-5 px-3 sm:px-6 md:px-10 lg:px-16 fixed top-0 left-0 right-0 z-30 overflow-x-clip relative ${
        scrolled ? "bg-primary/80 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
      style={{
        paddingLeft: "max(env(safe-area-inset-left), 1rem)",
        paddingRight: "max(env(safe-area-inset-right), 1rem)",
        paddingTop: "max(env(safe-area-inset-top), 0px)",
      }}
    >
      <div className="w-full min-w-0 flex justify-between items-center max-w-7xl mx-auto gap-2 pr-11 md:pr-0">
        <Link
          href="/"
          className="flex min-w-0 max-w-[calc(100%-3.5rem)] items-center gap-2"
          onClick={() => {
            setActive("");
            window.scrollTo(0, 0);
          }}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <h1 className="truncate text-white text-[16px] min-[380px]:text-[18px] sm:text-[20px] font-medium cursor-pointer flex whitespace-nowrap">
              <span>Anirban</span>
              <span className="text-[#915EFF] hidden min-[380px]:inline">
                &nbsp;Banerjee
              </span>
            </h1>
            <motion.span
              className="absolute -bottom-1 left-0 h-[1px] bg-gradient-to-r from-[#915EFF] to-transparent"
              initial={{ width: 0 }}
              animate={{ width: "80%" }}
              transition={{ delay: 0.8, duration: 0.6 }}
            />
          </motion.div>
        </Link>

        <ul className="list-none hidden md:flex flex-row gap-6 lg:gap-8">
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
              <a href={`#${nav.id}`} className="inline-block py-2">
                {nav.title}
              </a>
              <span className="absolute bottom-0 left-0 w-0 h-[1px] bg-[#915EFF] group-hover:w-full transition-all duration-300" />
            </motion.li>
          ))}
        </ul>

        <div
          className="md:hidden absolute right-0 top-1/2 -translate-y-1/2 z-40"
          style={{ right: "max(env(safe-area-inset-right), 0.5rem)" }}
        >
          <div
            className="w-9 h-9 cursor-pointer flex flex-col justify-center gap-[6px] shrink-0"
            onClick={() => setToggle(!toggle)}
            aria-label="Toggle navigation menu"
            aria-expanded={toggle}
          >
            <motion.span
              animate={{
                rotate: toggle ? 45 : 0,
                y: toggle ? 7 : 0,
              }}
              className="w-full h-[1.5px] bg-white block"
            />
            <motion.span
              animate={{ opacity: toggle ? 0 : 1 }}
              className="w-full h-[1.5px] bg-white block"
            />
            <motion.span
              animate={{
                rotate: toggle ? -45 : 0,
                y: toggle ? -7 : 0,
              }}
              className="w-full h-[1.5px] bg-white block"
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
            } p-4 bg-black/70 backdrop-blur-lg absolute top-[calc(64px+env(safe-area-inset-top))] left-0 right-0 mx-4 my-2 z-20 rounded-xl border border-gray-800/30`}
          >
            <ul className="list-none flex justify-start items-start flex-1 flex-col gap-1">
              {navLinks.map((nav, index) => (
                <motion.li
                  key={nav.id}
                  custom={index}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ x: 3 }}
                  className={`font-poppins font-normal cursor-pointer text-[15px] ${
                    active === nav.title ? "text-white" : "text-secondary"
                  } transition-colors duration-200 ease-in-out w-full`}
                  onClick={() => {
                    setToggle(false);
                    setActive(nav.title);
                  }}
                >
                  <a
                    href={`#${nav.id}`}
                    className="w-full block py-2 px-2 rounded-md hover:bg-white/5"
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
