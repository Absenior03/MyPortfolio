import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { styles } from "../styles";
import SectionWrapper from "./SectionWrapper";
import { slideIn } from "../utils/motion";
import { FiGithub, FiLinkedin, FiMail, FiMapPin, FiPhone, FiDownload } from "react-icons/fi";
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
    <div id="contact-section" className="xl:mt-8 xl:flex-row flex-col-reverse flex gap-10 overflow-hidden">
      <div
        className="flex-[0.75] bg-[rgba(21,19,40,0.7)] p-8 rounded-lg border border-[rgba(145,94,255,0.2)]"
      >
        <p className="sectionSubText">Get in touch</p>
        <h3 className="sectionHeadText">Contact.</h3>

        {formSubmitted ? (
          <div
            className="mt-10 flex flex-col bg-[rgba(26,23,41,0.8)] p-6 rounded-lg border border-green-500/20"
          >
            <div className="mb-4 flex items-center justify-center">
              <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
            <h4 className="text-white font-bold text-lg mb-2 text-center">Thank you!</h4>
            <p className="text-[#aaa6c3] text-center">
              Your message has been sent successfully. I'll get back to you as soon as possible.
            </p>
          </div>
        ) : (
          <form
            ref={formRef}
            onSubmit={handleSubmit}
            className="mt-8 flex flex-col gap-6"
          >
            <label className="flex flex-col">
              <span className="text-white font-medium mb-2">Your Name</span>
              <input
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="What's your name?"
                className={`${errors.name ? "border-red-500" : ""}`}
              />
              {errors.name && (
                <span className="text-red-500 mt-1 text-sm">{errors.name}</span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-2">Your Email</span>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="What's your email?"
                className={`${errors.email ? "border-red-500" : ""}`}
              />
              {errors.email && (
                <span className="text-red-500 mt-1 text-sm">{errors.email}</span>
              )}
            </label>

            <label className="flex flex-col">
              <span className="text-white font-medium mb-2">Your Message</span>
              <textarea
                rows={5}
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="What would you like to say?"
                className={`resize-none ${errors.message ? "border-red-500" : ""}`}
              />
              {errors.message && (
                <span className="text-red-500 mt-1 text-sm">{errors.message}</span>
              )}
            </label>

            <button
              type="submit"
              disabled={loading}
              className="button-primary py-3 px-8 w-fit mt-2"
            >
              {loading ? "Sending..." : "Send Message"}
            </button>
          </form>
        )}
      </div>

      <div
        className="xl:flex-1 xl:h-auto md:h-[550px] h-[350px]"
      >
        <div className="h-full flex flex-col justify-center">
          <h3 className="sectionHeadText mb-6 text-center xl:text-left">
            Contact Info
          </h3>
          
          <div className="grid gap-5">
            <div className="contact-info-card flex items-center gap-5">
              <div className="contact-icon-container">
                <FiMail className="text-white text-xl" />
              </div>
              <div>
                <h4 className="contact-title">Email</h4>
                <p className="contact-text">anirbanbanerjee1087@gmail.com</p>
              </div>
            </div>
            
            <div className="contact-info-card flex items-center gap-5">
              <div className="contact-icon-container">
                <FiPhone className="text-white text-xl" />
              </div>
              <div>
                <h4 className="contact-title">Phone</h4>
                <p className="contact-text">+91-7908940076</p>
              </div>
            </div>
            
            <div className="contact-info-card flex items-center gap-5">
              <div className="contact-icon-container">
                <FiMapPin className="text-white text-xl" />
              </div>
              <div>
                <h4 className="contact-title">Location</h4>
                <p className="contact-text">Bengaluru, India</p>
              </div>
            </div>
            
            <div className="contact-info-card flex items-center justify-between gap-5 mt-2">
              <div className="flex items-center gap-5">
                <div className="contact-icon-container">
                  <FiDownload className="text-white text-xl" />
                </div>
                <div>
                  <h4 className="contact-title">Resume</h4>
                  <p className="contact-text">Download my CV</p>
                </div>
              </div>
              <a 
                href="/assets/Anirban_Banerjee_Resume.pdf" 
                download
                className="button-primary py-2 px-4 text-sm"
              >
                Download
              </a>
            </div>
            
            <div className="flex items-center justify-center gap-6 mt-6">
              <a
                href="https://github.com/Absenior03"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-icon-container hover:scale-110 transition-transform"
                aria-label="GitHub"
              >
                <FiGithub className="text-white text-xl" />
              </a>
              
              <a
                href="https://www.linkedin.com/in/anirban-banerjee-b8a75b1a9/"
                target="_blank"
                rel="noopener noreferrer"
                className="contact-icon-container hover:scale-110 transition-transform"
                aria-label="LinkedIn"
              >
                <FiLinkedin className="text-white text-xl" />
              </a>
              
              <a
                href={`mailto:anirbanbanerjee1087@gmail.com`}
                className="contact-icon-container hover:scale-110 transition-transform"
                aria-label="Email"
              >
                <FiMail className="text-white text-xl" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SectionWrapper(Contact, "contact"); 