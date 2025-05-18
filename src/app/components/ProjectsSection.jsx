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
    <section id="projects">
      <h2 className="text-center text-4xl font-bold text-white mt-4 mb-8 md:mb-12">
        My Projects
      </h2>
      <div className="text-white flex flex-row justify-center items-center gap-2 py-6">
        <ProjectTag
          onClick={handleTagChange}
          name="All"
          isSelected={tag === "All"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Web"
          isSelected={tag === "Web"}
        />
        <ProjectTag
          onClick={handleTagChange}
          name="Mobile"
          isSelected={tag === "Mobile"}
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
