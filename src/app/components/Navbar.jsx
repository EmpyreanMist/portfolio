"use client";
import Link from "next/link";
import React, { useState } from "react";
import NavLink from "./NavLink";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/solid";
import MenuOverlay from "./MenuOverlay";
import Image from "next/image";
import useTheme from "../hooks/useTheme";
import { SunIcon, MoonIcon } from "@heroicons/react/24/outline";

const navLinks = [
  { title: "About", path: "/#about" },
  { title: "TechStack", path: "/#techstack" },
  { title: "Experience", path: "/#experience" },
  { title: "Projects", path: "/#projects" },
  { title: "Contact", path: "/#contact" },
];

const Navbar = () => {
  const [navbarOpen, setNavbarOpen] = useState(false);
  const { theme, toggleTheme } = useTheme();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/70 dark:bg-black/90 backdrop-blur-md shadow-sm border-b border-gray-200 dark:border-white/10 transition-all">
      <div className="max-w-7xl mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/" className="z-50 flex items-center gap-2">
          <Image
            src="/images/main-logo.png"
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
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="
    flex items-center justify-center
    w-10 h-10 rounded-full
    bg-gray-100 hover:bg-gray-200
    dark:bg-white/10 dark:hover:bg-white/20
    transition-colors
  "
          >
            {theme === "dark" ? (
              <MoonIcon className="h-5 w-5 text-blue-400" />
            ) : (
              <SunIcon className="h-5 w-5 text-yellow-500" />
            )}
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
