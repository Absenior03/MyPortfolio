import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import SectionWrapper from "./SectionWrapper";
import { slideIn } from "../utils/motion";
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone } from "react-icons/fi";
import gsap from "gsap";
import IconWrapper from "./IconWrapper";

const Contact = () => {
  const formRef = useRef<HTMLFormElement>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({ name: "", email: "", message: "" });
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    // Animation for the contact items
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: "#contact-section",
        start: "top 80%",
      },
    });

    tl.from(".contact-item", {
      y: 50,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: "power3.out",
    });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { name: "", email: "", message: "" };

    if (!form.name.trim()) {
      newErrors.name = "Name is required";
      valid = false;
    }

    if (!form.email.trim()) {
      newErrors.email = "Email is required";
      valid = false;
    } else if (!/^\S+@\S+\.\S+$/.test(form.email)) {
      newErrors.email = "Email is invalid";
      valid = false;
    }

    if (!form.message.trim()) {
      newErrors.message = "Message is required";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) return;

    setLoading(true);

    // Simulate form submission
    setTimeout(() => {
      setLoading(false);
      setFormSubmitted(true);
      setForm({ name: "", email: "", message: "" });

      // Reset form submission status after 5 seconds
      setTimeout(() => {
        setFormSubmitted(false);
      }, 5000);
    }, 1500);
  };

  return (
    <div id="contact-section" className="xl:mt-12 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
      <motion.div
        variants={slideIn("left", "tween", 0.2, 1)}
        className="flex-[0.75] bg-black-100 p-8 rounded-2xl"
      >
        <p className={styles.sectionSubText}>Get in touch</p>
        <h3 className={styles.sectionHeadText}>Contact.</h3>

        {formSubmitted ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 flex flex-col bg-tertiary p-8 rounded-2xl"
          >
            <h4 className="text-white font-bold text-2xl mb-4">Thank you!</h4>
            <p className="text-white-100">
              Your message has been sent successfully. I'll get back to you as soon as possible.
            </p>
          </motion.div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-12 flex flex-col gap-8"
          >
            <label className="flex flex-col">
              <span className="text-white font-medium mb-4">Your Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="What's your name?"
                className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium ${
                  errors.name ? "border-2 border-red-500" : ""
                }`}
              />
              {errors.name && (
                <span className="text-red-500 mt-1">{errors.name}</span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-4">Your Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="What's your email?"
                className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium ${
                  errors.email ? "border-2 border-red-500" : ""
                }`}
              />
              {errors.email && (
                <span className="text-red-500 mt-1">{errors.email}</span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-4">Your Message</span>
              <textarea
                rows={7}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What would you like to say?"
                className={`bg-tertiary py-4 px-6 placeholder:text-secondary text-white rounded-lg outline-none border-none font-medium resize-none ${
                  errors.message ? "border-2 border-red-500" : ""
                }`}
              />
              {errors.message && (
                <span className="text-red-500 mt-1">{errors.message}</span>
              )}
            </label>

            <button
              type="submit"
              disabled={loading}
              className="bg-tertiary hover:bg-[#915EFF] transition-colors py-3 px-8 outline-none w-fit text-white font-bold shadow-md shadow-primary rounded-xl"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </motion.div>

      <motion.div
        variants={slideIn("right", "tween", 0.2, 1)}
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <div className="h-full flex flex-col justify-center">
          <h3 className={`${styles.sectionHeadText} mb-10`} style={{ color: "white", textShadow: "0 2px 4px rgba(0,0,0,0.8)" }}>
            Contact Info.
          </h3>
          
          <div className="grid gap-4">
            <div className="contact-item flex items-center gap-4" style={{ backgroundColor: "#15112b", padding: "16px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.5)", border: "2px solid rgba(145, 94, 255, 0.5)" }}>
              <div style={{ backgroundColor: "#915EFF", padding: "12px", borderRadius: "9999px", flexShrink: 0 }}>
                <IconWrapper icon={FiMail} className="text-white text-xl" />
              </div>
              <div>
                <h4 style={{ color: "#ffffff", fontWeight: "800", fontSize: "1.25rem", marginBottom: "4px", textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}>Email</h4>
                <p style={{ color: "#ffffff", fontWeight: "600", textShadow: "0 2px 4px rgba(0,0,0,0.9)", letterSpacing: "0.02em" }}>anirbanbanerjee1087@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-item flex items-center gap-4" style={{ backgroundColor: "#15112b", padding: "16px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.5)", border: "2px solid rgba(145, 94, 255, 0.5)" }}>
              <div style={{ backgroundColor: "#915EFF", padding: "12px", borderRadius: "9999px", flexShrink: 0 }}>
                <IconWrapper icon={FiPhone} className="text-white text-xl" />
              </div>
              <div>
                <h4 style={{ color: "#ffffff", fontWeight: "800", fontSize: "1.25rem", marginBottom: "4px", textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}>Phone</h4>
                <p style={{ color: "#ffffff", fontWeight: "600", textShadow: "0 2px 4px rgba(0,0,0,0.9)", letterSpacing: "0.02em" }}>+91-7908940076</p>
              </div>
            </div>
            
            <div className="contact-item flex items-center gap-4" style={{ backgroundColor: "#15112b", padding: "16px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.5)", border: "2px solid rgba(145, 94, 255, 0.5)" }}>
              <div style={{ backgroundColor: "#915EFF", padding: "12px", borderRadius: "9999px", flexShrink: 0 }}>
                <IconWrapper icon={FiMapPin} className="text-white text-xl" />
              </div>
              <div>
                <h4 style={{ color: "#ffffff", fontWeight: "800", fontSize: "1.25rem", marginBottom: "4px", textShadow: "0 2px 4px rgba(0,0,0,0.9)" }}>Location</h4>
                <p style={{ color: "#ffffff", fontWeight: "600", textShadow: "0 2px 4px rgba(0,0,0,0.9)", letterSpacing: "0.02em" }}>Bengaluru, India</p>
              </div>
            </div>
            
            <div className="contact-item flex items-center gap-4 mt-6" style={{ backgroundColor: "#15112b", padding: "16px", borderRadius: "8px", boxShadow: "0 4px 8px rgba(0,0,0,0.5)", border: "2px solid rgba(145, 94, 255, 0.5)" }}>
              <a
                href="https://github.com/Absenior03"
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#915EFF", padding: "12px", borderRadius: "9999px", display: "flex", justifyContent: "center", alignItems: "center", transition: "all 0.3s" }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#7e3cf7"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#915EFF"}
              >
                <IconWrapper icon={FiGithub} className="text-white text-xl" />
              </a>
              
              <a
                href="https://www.linkedin.com/in/anirban-banerjee-b8a75b1a9/"
                target="_blank"
                rel="noopener noreferrer"
                style={{ backgroundColor: "#915EFF", padding: "12px", borderRadius: "9999px", display: "flex", justifyContent: "center", alignItems: "center", transition: "all 0.3s" }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = "#7e3cf7"}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = "#915EFF"}
              >
                <IconWrapper icon={FiLinkedin} className="text-white text-xl" />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact"); 