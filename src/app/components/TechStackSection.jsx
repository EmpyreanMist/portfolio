"use client";
import React from "react";
import {
  FaCode,
  FaCubes,
  FaDraftingCompass,
  FaJava,
  FaServer,
} from "react-icons/fa";
import {
  SiBootstrap,
  SiCss3,
  SiCypress,
  SiDocker,
  SiEjs,
  SiElasticsearch,
  SiExpress,
  SiFigma,
  SiGit,
  SiGithub,
  SiGithubactions,
  SiHtml5,
  SiJavascript,
  SiJest,
  SiJunit5,
  SiMongodb,
  SiMysql,
  SiNextdotjs,
  SiNodedotjs,
  SiNpm,
  SiPostgresql,
  SiRailway,
  SiReact,
  SiRender,
  SiSass,
  SiSupabase,
  SiTailwindcss,
  SiTypescript,
  SiVercel,
  SiVite,
} from "react-icons/si";

const techIcons = {
  HTML: SiHtml5,
  CSS: SiCss3,
  SCSS: SiSass,
  "Node.js": SiNodedotjs,
  JavaScript: SiJavascript,
  React: SiReact,
  Vite: SiVite,
  "Tailwind CSS": SiTailwindcss,
  Bootstrap: SiBootstrap,
  "React Native": SiReact,
  Gluestack: FaCubes,
  "Next.js": SiNextdotjs,
  Figma: SiFigma,
  Wireframe: FaDraftingCompass,
  Sass: SiSass,
  TypeScript: SiTypescript,
  "Express.js": SiExpress,
  "Rest API": FaServer,
  MongoDB: SiMongodb,
  PostgreSQL: SiPostgresql,
  MySQL: SiMysql,
  Supabase: SiSupabase,
  EJS: SiEjs,
  Java: FaJava,
  ElasticSearch: SiElasticsearch,
  Cypress: SiCypress,
  Jest: SiJest,
  JUnit: SiJunit5,
  Git: SiGit,
  GitHub: SiGithub,
  NPM: SiNpm,
  "GitHub Actions": SiGithubactions,
  Docker: SiDocker,
  Vercel: SiVercel,
  Railway: SiRailway,
  Render: SiRender,
};

export default function TechStackSection() {
  const techStack = {
    Frontend: [
      "HTML",
      "CSS",
      "SCSS",
      "Node.js",
      "JavaScript",
      "React",
      "Vite",
      "Tailwind CSS",
      "Bootstrap",
      "React Native",
      "Gluestack",
      "Next.js",
      "Figma",
      "Wireframe",
      "Sass",
      "TypeScript",
    ],
    Backend: [
      "Node.js",
      "Express.js",
      "Rest API",
      "MongoDB",
      "PostgreSQL",
      "MySQL",
      "Supabase",
      "EJS",
      "Next.js",
      "TypeScript",
      "Java",
      "ElasticSearch",
    ],
    Testing: ["Cypress", "Jest", "JUnit"],
    DevOps: ["Git", "GitHub", "NPM", "GitHub Actions", "Docker"],
    Deployment: ["Vercel", "Railway", "Render"],
  };

  return (
    <section
      id="techstack"
      className="py-16 px-4 xl:px-16 border-t border-[#33353F] bg-transparent text-gray-900 dark:text-white"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Tech Stack I&apos;ve Experimented With
      </h2>

      <div className="space-y-12 flex flex-col items-center">
        {Object.entries(techStack).map(([category, tools]) => (
          <div key={category} className="text-center">
            <h3 className="text-xl font-semibold mb-4 border-b border-[#33353F] inline-block pb-2">
              {category}
            </h3>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {tools.map((tool) => {
                const Icon = techIcons[tool] || FaCode;

                return (
                  <div key={tool} className="relative">
                    <div
                      className="absolute inset-0 -z-10
                    bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))]
                    from-blue-400/30 via-blue-500/20 to-transparent
                    blur-xl rounded-full"
                    ></div>

                    <div
                      className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600
                    rounded-full px-1 py-1 transition-all hover:brightness-110"
                    >
                      <span className="block bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-2 text-sm font-semibold rounded-full shadow-md transition-colors duration-200">
                        <span className="flex items-center gap-2">
                          <Icon className="text-base" aria-hidden="true" />
                          <span>{tool}</span>
                        </span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
