"use client";
import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

export default function CvMenu() {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  function toggle() {
    setOpen((prev) => !prev);
  }

  useEffect(() => {
    function handleClickOutside(e) {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    function handleEsc(e) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc);
  }, []);

  const menuItems = [
    {
      label: "Preview (Swedish)",
      url: "/ChristianFrykstenCV-SWE.pdf",
      preview: true,
    },
    {
      label: "Preview (English)",
      url: "/ChristianFrykstenCV-ENG.pdf",
      preview: true,
    },
    {
      label: "Download (Swedish)",
      url: "/ChristianFrykstenCV-SWE.pdf",
      download: true,
    },
    {
      label: "Download (English)",
      url: "/ChristianFrykstenCV-ENG.pdf",
      download: true,
    },
  ];

  function handleClick(item) {
    if (item.download) {
      const link = document.createElement("a");
      link.href = item.url;
      link.download = item.url.split("/").pop();
      link.click();
    } else {
      window.open(item.url, "_blank");
    }
    setOpen(false);
  }

  return (
    <div className="relative inline-block" ref={ref}>
      <button
        onClick={toggle}
        className="px-1 inline-flex items-center gap-2 py-1 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 text-white hover:brightness-110 transition-all select-none [tap-highlight-color:transparent]
"
      >
        <span className="block bg-[#0f172a] hover:bg-[#1e293b] rounded-full px-5 py-2 font-semibold transition-colors duration-200">
          View CV
        </span>

        <motion.span
          animate={{ rotate: open ? 180 : 0 }}
          transition={{ duration: 0.15 }}
          className="mr-3 text-lg"
        >
          ▴
        </motion.span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -2 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -2 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="absolute mt-2  w-56 rounded-xl bg-[#0f172a] border border-slate-700 shadow-xl p-2 z-50 backdrop-blur-xl"
          >
            {menuItems.map((item) => (
              <button
                key={item.label}
                onClick={() => handleClick(item)}
                className="w-full text-left px-3 py-2 text-sm text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                {item.label}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
