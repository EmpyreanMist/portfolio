"use client";
import React, { useState, useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { FaGithub, FaExternalLinkAlt } from "react-icons/fa";
import Image from "next/image";

const experiencesData = [
  {
    id: 1,
    title: "BRT Höjd AB Website (Next.js, React-Bootstrap)",
    company: "Freelance Client Work",
    description:
      "Delivered a fully responsive, production-ready website for a real client.",
    date: "July 2025",
    tag: ["All", "Web"],
    image: "/images/projects/brt.png",
    gitUrl: "https://github.com/EmpyreanMist/brt-hojd-ab",
    previewUrl: "https://www.brthojd.se/",
  },
  {
    id: 2,
    title: "Kylkonsulten i Norr AB Website (Next.js, Tailwind, Sanity)",
    company: "Freelance Client Work",
    description:
      "Built and deployed a modern corporate site integrated with Sanity CMS.",
    date: "October 2025",
    tag: ["All", "Web"],
    image: "/images/projects/kylkonsulten.png",
    gitUrl: "https://github.com/EmpyreanMist/kylkonsulten",
    previewUrl: "https://kylkonsulten.vercel.app/",
  },
];

const ExperienceCard = ({ exp, index }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-100px" });

  const variants = {
    hidden: { opacity: 0, y: 80, scale: 0.98 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] },
    },
  };

  const isLeft = index % 2 === 0;

  return (
    <motion.li
      ref={ref}
      variants={variants}
      initial="hidden"
      animate={inView ? "visible" : "hidden"}
      className={`relative flex flex-col md:flex-row items-center md:items-start ${
        isLeft ? "md:justify-start" : "md:justify-end"
      }`}
    >
      <span className="absolute left-1/2 transform -translate-x-1/2 w-5 h-5 rounded-full bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 border-4 border-black dark:border-black shadow-lg"></span>

      <div
        className={`mt-10 md:mt-0 md:w-[46%] ${
          isLeft ? "md:mr-auto md:text-right" : "md:ml-auto"
        }`}
      >
        <div className="relative p-6 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-md hover:shadow-xl transition bg-white dark:bg-black">
          <div className="absolute inset-0 blur-3xl opacity-40 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,_rgba(96,165,250,0.3)_0%,_rgba(168,85,247,0.25)_35%,_transparent_70%)] dark:opacity-10" />
          <div className="relative z-10">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {exp.title}
              </h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 md:mt-0">
                {exp.date}
              </p>
            </div>
            <p className="text-blue-600 dark:text-blue-400 font-medium mt-1 mb-3">
              {exp.company}
            </p>
            <div className="relative w-full h-56 mb-4 rounded-lg overflow-hidden">
              <Image
                src={exp.image}
                alt={exp.title}
                fill
                className="object-cover hover:scale-105 transition-transform duration-700 ease-out"
              />
            </div>
            <p className="text-gray-700 dark:text-[#ADB7BE] mb-4">
              {exp.description}
            </p>
            <div className="flex gap-3">
              {exp.gitUrl && (
                <a
                  href={exp.gitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-300 dark:border-gray-700 rounded-md text-gray-800 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
                >
                  <FaGithub /> Code
                </a>
              )}
              {exp.previewUrl && (
                <a
                  href={exp.previewUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 text-sm px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                  <FaExternalLinkAlt /> Live
                </a>
              )}
            </div>
          </div>
        </div>
      </div>
    </motion.li>
  );
};

const WorkExperienceSection = () => {
  const [tag] = useState("All");
  const filteredExperiences = experiencesData.filter((exp) =>
    exp.tag.includes(tag)
  );

  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 70%", "end end"],
  });

  const lineHeight = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section id="experience" className="px-4 xl:px-16 py-20 dark:bg-black">
      <h2 className="text-center text-4xl font-bold text-gray-900 dark:text-white mb-16">
        Work Experience
      </h2>

      <div ref={containerRef} className="relative max-w-3xl mx-auto">
        <motion.div
          className="absolute left-1/2 transform -translate-x-1/2 top-0 w-[3px] bg-gradient-to-b from-sky-400 via-blue-500 to-indigo-600 rounded-full origin-top"
          style={{ height: lineHeight }}
        />

        <ul className="space-y-16">
          {[...filteredExperiences].reverse().map((exp, index) => (
            <ExperienceCard key={exp.id} exp={exp} index={index} />
          ))}
        </ul>
      </div>
    </section>
  );
};

export default WorkExperienceSection;
