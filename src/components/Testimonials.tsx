import { useState } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import SectionWrapper from "./SectionWrapper";
import { testimonials } from "../constants";
import { fadeIn, textVariant } from "../utils/motion";

// Simplified testimonial card component with inline styles
const TestimonialCard = ({
  testimonial,
  name,
  designation,
  company,
  isActive,
}: {
  testimonial: string;
  name: string;
  designation: string;
  company: string;
  isActive: boolean;
}) => {
  return (
    <div 
      style={{
        backgroundColor: "#15112b",
        padding: "2.5rem",
        borderRadius: "1.5rem",
        border: "2px solid rgba(145, 94, 255, 0.5)",
        boxShadow: "0 10px 30px rgba(0, 0, 0, 0.5)",
        width: "100%",
        maxWidth: "500px",
        margin: "0 auto",
        height: "100%",
        transform: isActive ? "scale(1.05)" : "scale(0.95)",
        opacity: isActive ? 1 : 0.7,
        transition: "all 0.3s ease-in-out",
        zIndex: isActive ? 10 : 1
      }}
    >
      <p style={{ 
        color: "white", 
        fontWeight: 900, 
        fontSize: "3rem", 
        marginBottom: "0.5rem",
        textShadow: "0 2px 4px rgba(0,0,0,0.8)" 
      }}>&quot;</p>

      <div>
        <p style={{ 
          color: "white", 
          fontSize: "1.125rem", 
          fontWeight: 500, 
          marginBottom: "1.75rem",
          textShadow: "0 2px 4px rgba(0,0,0,0.8)",
          lineHeight: 1.6
        }}>
          {testimonial}
        </p>

        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          gap: "0.25rem" 
        }}>
          <div style={{ flex: 1 }}>
            <p style={{ 
              color: "white", 
              fontWeight: 500, 
              fontSize: "1rem",
              textShadow: "0 2px 4px rgba(0,0,0,0.8)" 
            }}>
              <span className="blue-text-gradient">@</span> {name}
            </p>
            <p style={{ 
              marginTop: "0.25rem", 
              color: "white", 
              fontSize: "0.75rem",
              opacity: 0.9,
              textShadow: "0 1px 2px rgba(0,0,0,0.8)" 
            }}>
              {designation} at {company}
            </p>
          </div>

          <div style={{ 
            width: "2.5rem", 
            height: "2.5rem", 
            borderRadius: "50%", 
            backgroundColor: "#915EFF",
            display: "flex",
            justifyContent: "center",
            alignItems: "center" 
          }}>
            <div style={{ 
              color: "white", 
              fontSize: "1rem", 
              fontWeight: "bold",
              textShadow: "0 1px 2px rgba(0,0,0,0.8)" 
            }}>
              {name.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Testimonials = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  return (
    <div>
      <motion.div variants={textVariant()}>
        <p className={styles.sectionSubText}>What others say</p>
        <h2 className={styles.sectionHeadText}>Testimonials.</h2>
      </motion.div>

      <div style={{ 
        marginTop: "5rem", 
        position: "relative",
        padding: "0 1rem" 
      }}>
        {/* Navigation buttons */}
        <button 
          onClick={handlePrev}
          style={{
            position: "absolute",
            top: "50%",
            left: "1rem",
            transform: "translateY(-50%)",
            zIndex: 20,
            backgroundColor: "#915EFF",
            padding: "0.75rem",
            borderRadius: "9999px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
            border: "none",
            transition: "all 0.3s"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#7e3cf7"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#915EFF"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "1.5rem", width: "1.5rem", color: "white" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        
        <button 
          onClick={handleNext}
          style={{
            position: "absolute",
            top: "50%",
            right: "1rem",
            transform: "translateY(-50%)",
            zIndex: 20,
            backgroundColor: "#915EFF",
            padding: "0.75rem",
            borderRadius: "9999px",
            cursor: "pointer",
            boxShadow: "0 4px 8px rgba(0,0,0,0.5)",
            border: "none",
            transition: "all 0.3s"
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#7e3cf7"}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#915EFF"}
        >
          <svg xmlns="http://www.w3.org/2000/svg" style={{ height: "1.5rem", width: "1.5rem", color: "white" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Display the active testimonial only */}
        <div style={{ margin: "0 auto", maxWidth: "800px", minHeight: "400px" }}>
          <motion.div
            key={activeIndex}
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ duration: 0.5 }}
          >
            <TestimonialCard
              {...testimonials[activeIndex]}
              isActive={true}
            />
          </motion.div>
        </div>

        {/* Pagination dots */}
        <div style={{ 
          display: "flex", 
          justifyContent: "center", 
          marginTop: "2.5rem", 
          gap: "0.5rem" 
        }}>
          {testimonials.map((_, index) => (
            <button
              key={`dot-${index}`}
              style={{
                width: "0.75rem",
                height: "0.75rem",
                borderRadius: "50%",
                backgroundColor: index === activeIndex ? "#915EFF" : "#2d2758",
                transition: "all 0.3s",
                border: "none",
                padding: 0,
                cursor: "pointer"
              }}
              onClick={() => setActiveIndex(index)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Testimonials, "testimonials"); 