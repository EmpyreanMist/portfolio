"use client";
import React from "react";

export default function TechStackSection() {
  const techStack = {
    Frontend: [
      "JavaScript",
      "React",
      "Vite",
      "Bootstrap",
      "Tailwind CSS",
      "Next.js",
      "Figma",
      "Sass",
      "TypeScript",
    ],
    Backend: [
      "Node.js",
      "Express.js",
      "MongoDB",
      "Supabase",
      "PostgreSQL",
      "EJS",
      "Next.js",
      "TypeScript",
    ],
    Testing: ["Cypress", "Jest"],
    DevOps: ["Git", "GitHub", "NPM", "GitHub Actions", "Docker"],
    Deployment: ["Vercel", "Railway", "Render"],
  };

  return (
    <section
      id="techstack"
      className="py-16 px-4 xl:px-16 text-white border-t border-[#33353F]"
    >
      <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
        Tech Stack I've Experimented With
      </h2>

      <div className="space-y-12 flex flex-col items-center">
        {Object.entries(techStack).map(([category, tools]) => (
          <div key={category} className="text-center">
            <h3 className="text-xl font-semibold mb-4 border-b border-[#33353F] inline-block pb-2">
              {category}
            </h3>
            <div className="flex flex-wrap justify-center gap-3 mt-4">
              {tools.map((tool) => (
                <div
                  key={tool}
                  className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 rounded-full px-1 py-1 transition-all hover:brightness-110"
                >
                  <span className="block bg-[#0f172a] hover:bg-[#1e293b] text-white px-5 py-2 text-sm font-semibold rounded-full shadow-md transition-colors duration-200">
                    {tool}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
