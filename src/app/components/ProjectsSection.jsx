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
      "This project was developed collaboratively with my classmates at Lernia as part of our frontend development coursework. We created a responsive website for a fictional escape room company offering both online and on-site experiences.",
    image: "/images/projects/hacker-escape-rooms.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/EmpyreanMist/Hacker-Escape-Room-sass",
    previewUrl: "https://empyreanmist.github.io/Hacker-Escape-Room-sass/",
  },
  {
    id: 4,
    title: "Kino",
    description:
      "Kino is a fullstack cinema website built with Next.js, MongoDB, and Supabase. Users can browse movies, book tickets, and leave reviews. Features SSR, authentication, and a clean UI.",
    image: "/images/projects/seats.png",
    tag: ["All", "Web"],
    gitUrl: "https://github.com/EmpyreanMist/fullstack-kino",
    previewUrl: "https://fullstack-kino.vercel.app/",
  },
  {
    id: 6,
    title: "Java CLI",
    description:
      "Electricity Price CLI – Fetches hourly electricity prices, calculates averages, and finds optimal charging times using a sliding window algorithm.",
    image: "/images/projects/cli.png",
    tag: ["All", "Java"],
    gitUrl: "https://github.com/EmpyreanMist/electricity-price-cli",
  },
  {
    id: 7,
    title: "Dungeon Crawler CLI",
    description:
      "A text-based dungeon crawler in Java with procedural dungeons, combat, and item management. Built with OOP and tested using JUnit.",
    image: "/images/projects/dungeon-crawler.png",
    tag: ["All", "Java"],
    gitUrl: "https://github.com/fungover/exercise2025/pull/41",
  },
  {
    id: 8,
    title: "Fishing Diary",
    description:
      "A mobile app built with React Native and Expo for logging catches, tracking species, and visualizing fishing spots. Uses Supabase for backend and Gluestack UI for styling.",
    image: "/images/projects/fishing-diary.png",
    tag: ["All", "App"],
    gitUrl: "https://github.com/EmpyreanMist/Fishing-Diary",
  },
];

const AnimatedProjectCard = ({ project, index }) => {
  const cardRef = useRef(null);
  const cardInView = useInView(cardRef, {
    once: true,
    margin: "-100px",
  });

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <motion.li
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      animate={cardInView ? "visible" : "hidden"}
      transition={{ duration: 0.5, ease: "easeOut" }}
    >
      <ProjectCard
        title={project.title}
        description={project.description}
        imgUrl={project.image}
        gitUrl={project.gitUrl}
        previewUrl={project.previewUrl}
      />
    </motion.li>
  );
};

const ProjectsSection = () => {
  const [tag, setTag] = useState("All");

  const handleTagChange = (newTag) => setTag(newTag);

  const filteredProjects = projectsData.filter((project) =>
    project.tag.includes(tag)
  );

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
          name="App"
          isSelected={tag === "App"}
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

      <ul className="grid md:grid-cols-3 gap-8 md:gap-12">
        {[...filteredProjects].reverse().map((project, index) => (
          <AnimatedProjectCard
            key={project.id}
            project={project}
            index={index}
          />
        ))}
      </ul>
    </section>
  );
};

export default ProjectsSection;
