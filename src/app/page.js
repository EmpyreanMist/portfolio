"use client";
import { useEffect, useState } from "react";
import HeroSection from "./components/HeroSection";
import Navbar from "./components/Navbar";
import AboutSection from "./components/AboutSection";
import ProjectsSection from "./components/ProjectsSection";
import EmailSection from "./components/EmailSection";
import Footer from "./components/Footer";

export default function Home() {
  const [laserLines, setLaserLines] = useState([]);
  const [showLasers, setShowLasers] = useState(true);

  useEffect(() => {
    const height = document.body.scrollHeight;
    const numberOfLines = 30;

    const possibleLines = [];
    for (let y = 0; y < height; y += 50) {
      possibleLines.push(y);
    }

    // shuffle-funktion
    const shuffle = (array) => {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    };

    // shuffla och ta ut de första N utan dubbletter
    const uniqueLines = shuffle([...possibleLines]).slice(0, numberOfLines);

    const lines = uniqueLines.map((top) => ({
      top,
      delay: Math.random() * 1.2,
      duration: 0.8 + Math.random() * 0.6,
    }));

    setLaserLines(lines);

    const timer = setTimeout(() => {
      setShowLasers(false);
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden bg-black text-white">
      {/* Lasrar */}
      {showLasers && (
        <div className="absolute top-0 left-0 w-full h-full z-10 pointer-events-none">
          {laserLines.map((line, index) => (
            <div
              key={index}
              className="absolute h-[2px] w-[200px] bg-white opacity-0 rounded"
              style={{
                top: `${line.top}px`,
                animation: `laser-line ${line.duration}s linear ${line.delay}s 1`,
                boxShadow: "0 0 8px 2px white",
              }}
            />
          ))}
        </div>
      )}

      <Navbar />
      <div className="container relative z-20 mt-24 mx-auto px-12 py-4">
        <HeroSection />
        <AboutSection />
        <ProjectsSection />
        <EmailSection />
      </div>
      <Footer />
    </main>
  );
}
