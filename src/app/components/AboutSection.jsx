"use client";
import React, { useTransition, useState } from "react";
import Image from "next/image";
import TabButton from "./TabButton";
import Link from "next/link";

const TAB_DATA = [
  {
    title: "Skills",
    id: "skills",
    content: (
      <ul className="list-disc pl-2">
        <li>Node.js</li>
        <li>Express</li>
        <li>PostgreSQL</li>
        <li>Git</li>
        <li>GitHub</li>
        <li>JavaScript</li>
        <li>React</li>
      </ul>
    ),
  },
  {
    title: "Education",
    id: "education",
    content: (
      <ul className="list-disc pl-2">
        <Link
          href="https://www.lernia.se/utbildning/yrkeshogskoleutbildning/systemutvecklare-i-java-och-javascript/"
          target="_blank"
          rel="noopener noreferrer"
        >
          <li className="text-blue-300 hover:underline hover:text-blue-500 cursor-pointer transition-colors duration-200">
            Systemdeveloper in Java and JavaScript | Lernia
          </li>
        </Link>
      </ul>
    ),
  },
  {
    title: "Certifications",
    id: "certifications",
    content: (
      <ul className="list-disc pl-2">
        <Link href="https://www.udemy.com/certificate/UC-ef294d0f-6d72-4947-9164-545980a0512d/">
          <li className="text-blue-300 hover:underline hover:text-blue-500 cursor-pointer transition-colors duration-200">
            The Complete Full-Stack Web Development Bootcamp | Udemy
          </li>
        </Link>
        <Link href="https://www.freecodecamp.org/certification/ChristianFryksten/responsive-web-design">
          <li className="text-blue-300 hover:underline hover:text-blue-500 cursor-pointer transition-colors duration-200">
            Responsive Web Design | freeCodeCamp{" "}
          </li>
        </Link>
      </ul>
    ),
  },
];

const AboutSection = () => {
  const [tab, setTab] = useState("skills");
  const [isPending, startTransition] = useTransition();

  const handleTabChange = (id) => {
    startTransition(() => {
      setTab(id);
    });
  };

  return (
    <section className="text-white" id="about">
      <div className="md:grid md:grid-cols-2 gap-8 items-center py-8 px-4 xl:gap-16 sm:py-16 xl:px-16">
        <Image
          src="/images/fullstack.png"
          width={500}
          height={500}
          alt="logo"
        />
        <div className="mt-4 md:mt-0 text-left flex flex-col h-full">
          <h2 className="text-4xl font-bold text-white mb-4">About Me</h2>
          <p className="text-base lg:text-lg">
            I’m Christian, a curious developer who likes building things that
            actually work. I’ve tinkered with everything from Wordle clones to
            fullstack apps, and I enjoy when tech feels real — when the code I
            write turns into something you can click, test, and maybe even smile
            at. I like digging into problems, learning new tricks along the way,
            and I’m not afraid to get lost in the code until I find the
            solution.
          </p>
          <div className="flex flex-row justify-start mt-8">
            <TabButton
              selectTab={() => handleTabChange("skills")}
              active={tab === "skills"}
            >
              {" "}
              Skills{" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("education")}
              active={tab === "education"}
            >
              {" "}
              Education{" "}
            </TabButton>
            <TabButton
              selectTab={() => handleTabChange("certifications")}
              active={tab === "certifications"}
            >
              {" "}
              Certifications{" "}
            </TabButton>
          </div>
          <div className="mt-8">
            {TAB_DATA.find((t) => t.id === tab).content}
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutSection;
