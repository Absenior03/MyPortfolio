import { useState, useEffect } from "react";
import Link from "next/link";
import { styles } from "../styles";
import { navLinks } from "../constants";
import { motion } from "framer-motion";

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
    <nav
      className={`${
        styles.paddingX
      } w-full flex items-center py-5 fixed top-0 z-20 ${
        scrolled ? "bg-primary/90 backdrop-blur-sm" : "bg-transparent"
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
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1 }}
          >
            <h1 className="text-white text-[24px] font-bold cursor-pointer flex">
              Anirban&nbsp;
              <span className="text-[#915EFF]">Banerjee</span>
            </h1>
          </motion.div>
        </Link>

        <ul className="list-none hidden sm:flex flex-row gap-10">
          {navLinks.map((nav) => (
            <motion.li
              key={nav.id}
              initial={{ y: -50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ 
                duration: 0.5, 
                delay: navLinks.indexOf(nav) * 0.1 + 0.5 
              }}
              className={`${
                active === nav.title ? "text-white" : "text-secondary"
              } hover:text-white text-[18px] font-medium cursor-pointer`}
              onClick={() => setActive(nav.title)}
            >
              <a href={`#${nav.id}`}>{nav.title}</a>
            </motion.li>
          ))}
        </ul>

        <div className="sm:hidden flex flex-1 justify-end items-center">
          <div
            className="w-[28px] h-[28px] cursor-pointer flex flex-col justify-between"
            onClick={() => setToggle(!toggle)}
          >
            <motion.span 
              animate={{ 
                rotate: toggle ? 45 : 0, 
                y: toggle ? 8 : 0,
              }}
              className="w-full h-[2px] bg-white block"
            />
            <motion.span 
              animate={{ opacity: toggle ? 0 : 1 }}
              className="w-full h-[2px] bg-white block"
            />
            <motion.span 
              animate={{ 
                rotate: toggle ? -45 : 0, 
                y: toggle ? -8 : 0,
              }}
              className="w-full h-[2px] bg-white block"
            />
          </div>

          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              scale: toggle ? 1 : 0,
              opacity: toggle ? 1 : 0,
            }}
            className={`${
              !toggle ? "hidden" : "flex"
            } p-6 black-gradient absolute top-20 right-0 mx-4 my-2 min-w-[140px] z-10 rounded-xl`}
          >
            <ul className="list-none flex justify-end items-start flex-1 flex-col gap-4">
              {navLinks.map((nav) => (
                <li
                  key={nav.id}
                  className={`font-poppins font-medium cursor-pointer text-[16px] ${
                    active === nav.title ? "text-white" : "text-secondary"
                  }`}
                  onClick={() => {
                    setToggle(!toggle);
                    setActive(nav.title);
                  }}
                >
                  <a href={`#${nav.id}`}>{nav.title}</a>
                </li>
              ))}
            </ul>
          </motion.div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 