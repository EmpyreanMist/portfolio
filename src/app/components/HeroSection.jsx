"use client";
import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { TypeAnimation } from "react-type-animation";
import { motion } from "framer-motion";

const HeroSection = ({ onDownloadCV }) => {
  const [currentImage, setCurrentImage] = useState("/images/christian.jpg");
  const [rotation, setRotation] = useState(0);

  const typeRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setRotation(360);
      setTimeout(() => {
        setCurrentImage("/images/christian-fly.png");
      }, 1000);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    const element = typeRef.current;
    if (element) observer.observe(element);

    return () => {
      if (element) observer.unobserve(element);
    };
  }, []);

  const handleDownload = () => {
    onDownloadCV?.();
    setTimeout(() => {
      const link = document.createElement("a");
      link.href = "/cv-christian-fryksten.pdf";
      link.download = "Christian-Fryksten-CV.pdf";
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }, 400);
  };

  return (
    <section className="lg:py-16">
      <div className="grid grid-cols-1 sm:grid-cols-12">
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="col-span-8 place-self-center text-center sm:text-left justify-self-start"
        >
          <h1 className="mb-4 text-4xl sm:text-5xl lg:text-8xl lg:leading-normal font-extrabold">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600">
              Hello, I&apos;m{" "}
            </span>
            <br />
            <span className="text-black dark:text-white" ref={typeRef}>
              {isVisible && (
                <TypeAnimation
                  sequence={[
                    "Christian",
                    1000,
                    "Fullstack developer",
                    1000,
                    "Web enthusiast",
                    1000,
                    "Tech Lover",
                    1000,
                    "Problem solver",
                    1000,
                  ]}
                  wrapper="span"
                  speed={50}
                  repeat={Infinity}
                />
              )}
            </span>
          </h1>
          <p className="text-black dark:text-white text-base sm:text-lg mb-6 lg:text-xl">
            I break things just to see how they work. Don’t worry, I fix them
            too.
          </p>
          <div>
            <button
              onClick={handleDownload}
              className="px-1 inline-block py-1 w-full sm:w-fit rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:brightness-110 transition-all text-white mt-3"
            >
              <span className="block bg-[#0f172a] hover:bg-[#1e293b] rounded-full px-5 py-2 text-white font-semibold shadow-md transition-colors duration-200">
                Download CV
              </span>
            </button>
          </div>
        </motion.div>
        <motion.div
          className="rounded-full bg-[#181818] w-[250px] h-[250px] lg:w-[400px] lg:h-[400px] relative overflow-hidden mt-10 mx-auto"
          animate={{ rotate: rotation }}
          transition={{ duration: 1, ease: "easeInOut" }}
        >
          <motion.div
            key={currentImage}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="absolute w-full h-full"
          >
            <Image
              src={currentImage}
              alt="hero image"
              className="w-full h-full object-cover"
              width={350}
              height={350}
              priority
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;
