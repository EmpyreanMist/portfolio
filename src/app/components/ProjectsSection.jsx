"use client";
import React, { useState, useRef } from "react";
import ProjectCard from "./ProjectCard";
import ProjectTag from "./ProjectTag";
import { motion, useInView } from "framer-motion";

const projectsData = [
  {
    id: 1,
    title: "Fullstack Wordle Game",
    description:
      "A Wordle-inspired game built with React, Express, and MongoDB. Players guess a hidden word with feedback on each letter, and their scores are ranked on a global leaderboard. Includes server-side validation, anti-cheat logic, and leaderboard filtering with pagination.",
    image: "/images/projects/wordle.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/EmpyreanMist/retro-wordle?tab=readme-ov-file",
    previewUrl: "https://retro-wordle.up.railway.app/",
  },
  {
    id: 2,
    title: "Todo List",
    description:
      "This project was part of my studies at Lernia, aimed at practicing frontend development with a focus on CSS and animations. It's a simple todo list built with HTML, CSS, and JavaScript, featuring smooth animations when adding, completing, and deleting tasks.",
    image: "/images/projects/Todo.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/EmpyreanMist/Todo-list",
    previewUrl: "https://empyreanmist.github.io/Todo-list/",
  },
  {
    id: 3,
    title: "Hacker Escape Rooms",
    description:
      "This project was developed collaboratively with my classmates at Lernia as part of our frontend development coursework. We created a responsive website for a fictional escape room company offering both online and on-site experiences. The site allows users to explore available challenges and book sessions, with a design optimized for both mobile and desktop devices. We utilized HTML, SCSS, and JavaScript for the frontend, and managed version control using Git and GitHub",
    image: "/images/projects/hacker-escape-rooms.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/EmpyreanMist/Hacker-Escape-Room-sass",
    previewUrl: "https://empyreanmist.github.io/Hacker-Escape-Room-sass/",
  },
  {
    id: 4,
    title: "Kino",
    description:
      "Kino is a fullstack cinema website built with Next.js, MongoDB, and Supabase as part of a team project during my studies at Lernia. The platform allows users to browse movies, view details and trailers, book tickets for upcoming screenings, and leave reviews. It features user authentication, server-side rendering, SEO-friendly metadata, and a dynamic API structure.",
    image: "/images/projects/seats.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/EmpyreanMist/fullstack-kino",
    previewUrl: "https://fullstack-kino.vercel.app/",
  },
  {
    id: 5,
    title: "BRT Höjd",
    description:
      "This is my first real client project: a modern, responsive website built for BRT Höjd AB, a company specializing in industrial climbing and height-related services. The site is built with Next.js and React-Bootstrap, and is primarily optimized for mobile devices to reflect the client's needs in the field. It features a clean design, image carousel, and dynamic content sections tailored to the brand.",
    image: "/images/projects/brt.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/EmpyreanMist/brt-hojd-ab",
    previewUrl: "https://www.brthojd.se/",
  },
  {
    id: 6,
    title: "Java CLI",
    description:
      "Electricity Price CLI (Java) – A command-line tool that fetches hourly electricity prices from the Elpris API, calculates daily averages, identifies cheapest/most expensive hours, and finds optimal charging windows (2/4/8 h) using a sliding-window algorithm.",
    image: "/images/projects/cli.png",
    tag: ["All", "Java"],
    gitUrl: "https://github.com/EmpyreanMist/electricity-price-cli",
  },
  {
    id: 7,
    title: "Dungeon Crawler CLI",
    description:
      "A text-based dungeon crawler game built in Java as part of a school project. The player explores procedurally generated dungeons, battles enemies, and manages health and items through command-line interactions. This project was submitted as a pull request to the school’s base repository and showcases object-oriented programming, combat systems, and unit testing in Java.",
    image: "/images/projects/dungeon-crawler.png",
    tag: ["All", "Java"],
    gitUrl: "https://github.com/fungover/exercise2025/pull/41",
  },
  {
    id: 8,
    title: "Kylkonsulten i Norr AB",
    description:
      "A modern, responsive website built with Next.js for Kylkonsulten i Norr AB, a company specializing in refrigeration examinations and preparatory courses. The site highlights their core mission of conducting practical and theoretical certification exams on behalf of Incert, while also promoting their preparatory training programs. It features a clear contact form for booking requests and a clean design inspired by industry-leading training websites.",
    image: "/images/projects/kylkonsulten.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/EmpyreanMist/kylkonsulten",
    previewUrl: "https://kylkonsulten.vercel.app/",
  },
];

const ProjectsSection = () => {
  const [tag, setTag] = useState("All");
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });

  const handleTagChange = (newTag) => {
    setTag(newTag);
  };

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

  const cardVariants = {
    initial: { y: 50, opacity: 0 },
    animate: { y: 0, opacity: 1 },
  };

  return (
    <section id="projects" className="px-4 xl:px-16 py-16">
      <h2 className="text-center text-4xl font-bold text-gray-900 dark:text-white mt-4 mb-8 md:mb-12">
        My Projects
      </h2>
      <div className="text-gray-900 dark:text-white flex flex-row justify-center items-center gap-2 py-6">
        <ProjectTag
          onClick={handleTagChange}
          name="Web"
          isSelected={tag === "Web"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Java"
          isSelected={tag === "Java"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="All"
          isSelected={tag === "All"}
        />
      </div>
      <ul ref={ref} className="grid md:grid-cols-3 gap-8 md:gap-12">
        {filteredProjects.map((project, index) => (
          <motion.li
            key={index}
            variants={cardVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
            transition={{ duration: 0.3, delay: index * 0.4 }}
          >
            <ProjectCard
              key={project.id}
              title={project.title}
              description={project.description}
              imgUrl={project.image}
              gitUrl={project.gitUrl}
              previewUrl={project.previewUrl}
            />
          </motion.li>
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
