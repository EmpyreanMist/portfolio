"use client";
import React, { useTransition, useState } from "react";
import Image from "next/image";
import TabButton from "./TabButton";
import Link from "next/link";

const TAB_DATA = [
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-4 space-y-2">
        <li>
          <Link
            href="https://www.lernia.se/utbildning/yrkeshogskoleutbildning/systemutvecklare-i-java-och-javascript/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[17px] font-medium text-gray-900 dark:text-gray-100 underline underline-offset-2 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            Systemdeveloper in Java and JavaScript | Lernia
          </Link>
        </li>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-4 space-y-2">
        <li>
          <Link
            href="https://www.udemy.com/certificate/UC-ef294d0f-6d72-4947-9164-545980a0512d/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[17px] font-medium text-gray-900 dark:text-gray-100 underline underline-offset-2 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            The Complete Full-Stack Web Development Bootcamp | Udemy
          </Link>
        </li>
        <li>
          <Link
            href="https://www.freecodecamp.org/certification/ChristianFryksten/responsive-web-design"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[17px] font-medium text-gray-900 dark:text-gray-100 underline underline-offset-2 hover:text-blue-600 dark:hover:text-blue-400 transition-all"
          >
            Responsive Web Design | freeCodeCamp
          </Link>
        </li>
      </ul>
    ),
  },
];

const AboutSection = () => {
  const [tab, setTab] = useState("education");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  return (
    <section
      className="relative bg-[#F8FAFC] dark:bg-black text-black dark:text-white py-12 px-4 overflow-hidden"
      id="about"
    >
      <div
        className="absolute inset-0 
                   bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] 
                   from-blue-400/30 via-blue-500/20 to-transparent 
                   blur-3xl z-0 pointer-events-none"
      ></div>

      <div className="relative z-10 max-w-6xl mx-auto md:grid md:grid-cols-2 gap-8 items-center">
        <div className="flex justify-center md:justify-start items-center mt-10 md:mt-0">
          <div className="rounded-full bg-[#181818] w-[250px] h-[250px] md:w-[350px] md:h-[350px] lg:w-[400px] lg:h-[400px] relative overflow-hidden">
            <Image
              src="/images/fullstack.png"
              alt="Christian Flyboarding"
              className="w-full h-full object-cover"
              width={350}
              height={350}
              priority
            />
          </div>
        </div>

        <div
          className="mt-4 md:mt-0 text-left flex flex-col h-full
                     bg-white/60 dark:bg-black
                     backdrop-blur-xl border border-gray-200 dark:border-white/10
                     shadow-md rounded-xl p-6"
        >
          <h2 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">
            About Me
          </h2>
          <p className="text-gray-700 dark:text-gray-300 text-base lg:text-lg">
            I’m Christian, a curious developer who likes building things that
            actually work. I’ve tinkered with everything from Wordle clones to
            fullstack apps, and I enjoy when tech feels real — when the code I
            write turns into something you can click, test, and maybe even smile
            at. I like digging into problems, learning new tricks along the way,
            and I’m not afraid to get lost in the code until I find the
            solution.
          </p>

          {/* Tab Buttons */}
          <div className="flex flex-row justify-start mt-8 gap-4">
            <TabButton
              selectTab={() => handleTabChange("education")}
              active={tab === "education"}
            >
              Education
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("certifications")}
              active={tab === "certifications"}
            >
              Certifications
            </TabButton>
          </div>

          <div className="mt-8">
            {TAB_DATA.find((t) => t.id === tab)?.content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
