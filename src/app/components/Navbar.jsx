"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import Image from "next/image";
import useTheme from "../hooks/useTheme";

const navLinks = [
  { title: "About", path: "#about" },
  { title: "TechStack", path: "#techstack" },
  { title: "Projects", path: "#projects" },
  { title: "Contact", path: "#contact" },
];

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="z-50 flex items-center gap-2">
          <Image
            src="/main-logo.png"
            alt="Christian Logo"
            width={40}
            height={40}
            className="object-contain rounded-lg"
          />
          <span className="font-semibold text-lg text-gray-900 dark:text-white">
            Christian
          </span>
        </Link>

        <div className="flex items-center space-x-2 ml-4">
          <span className="text-gray-800 dark:text-white text-sm">
            Darkmode
          </span>
          <button
            onClick={toggleTheme}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors duration-300 ${
              theme === "dark" ? "bg-blue-600" : "bg-gray-300"
            }`}
            aria-label="Toggle dark mode"
          >
            <div
              className={`w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                theme === "dark" ? "translate-x-6" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        <div className="md:hidden">
          <button
            onClick={() => setNavbarOpen(!navbarOpen)}
            className="flex items-center px-3 py-2 border rounded border-gray-400 dark:border-slate-600 text-gray-800 dark:text-white hover:text-blue-600"
          >
            {navbarOpen ? (
              <XMarkIcon className="h-6 w-6" />
            ) : (
              <Bars3Icon className="h-6 w-6" />
            )}
          </button>
        </div>

        <ul className="hidden md:flex space-x-8 items-center text-gray-700 dark:text-gray-300 font-medium">
          {navLinks.map((link, index) => (
            <li key={index}>
              <NavLink href={link.path} title={link.title} />
            </li>
          ))}
        </ul>
      </div>

      {navbarOpen && <MenuOverlay links={navLinks} />}
    </nav>
  );
};

export default Navbar;
