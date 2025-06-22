"use client";
import { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";
import TechStackSection from "./components/TechStackSection";

export default function Home() {
  const [laserLines, setLaserLines] = useState([]);
  const [showLasers, setShowLasers] = useState(false);

  const triggerLasers = () => {
    const height = document.body.scrollHeight;
    const numberOfLines = 65;

    const possibleLines = [];
    for (let y = 0; y < height; y += 50) {
      possibleLines.push(y);
    }

    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    const uniqueLines = shuffle([...possibleLines]).slice(0, numberOfLines);

    const lines = uniqueLines.map((top) => ({
      top,
      delay: Math.random() * 1.2,
      duration: 0.8 + Math.random() * 0.6,
    }));

    setLaserLines(lines);
    setShowLasers(true);

    setTimeout(() => {
      setShowLasers(false);
    }, 2500);
  };

  useEffect(() => {
    triggerLasers();
  }, []);

  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.attributeName === "class") {
          triggerLasers();
        }
      });
    });

    if (typeof window !== "undefined") {
      const html = document.documentElement;
      observer.observe(html, { attributes: true });
    }

    return () => observer.disconnect();
  }, []);

  return (
    <main
      className="relative flex min-h-screen flex-col overflow-hidden 
             bg-[#EDF3F8] dark:bg-black 
             text-gray-900 dark:text-white 
             transition-colors duration-300"
    >
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] 
                 from-blue-100 via-blue-200/50 to-transparent 
                 blur-2xl opacity-60 dark:opacity-0"
        />
      </div>

      {showLasers && (
        <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
          {laserLines.map((line, index) => {
            const isDark =
              typeof window !== "undefined" &&
              document.documentElement.classList.contains("dark");

            return (
              <div
                key={index}
                className={`absolute h-[2px] w-[200px] opacity-0 rounded ${
                  isDark ? "bg-white" : "bg-black"
                }`}
                style={{
                  top: `${line.top}px`,
                  animation: `laser-line ${line.duration}s linear ${line.delay}s 1`,
                  boxShadow: `0 0 8px 2px ${isDark ? "white" : "black"}`,
                }}
              />
            );
          })}
        </div>
      )}

      {/* Innehåll */}
      <Navbar />
      <div className="container relative z-20 mt-24 mx-auto px-12 py-4">
        <HeroSection onDownloadCV={triggerLasers} />
        <AboutSection />
        <TechStackSection />
        <ProjectsSection />
        <EmailSection onSendEmail={triggerLasers} />
      </div>
      <Footer />
    </main>
  );
}
