import React from "react";
import { motion } from "framer-motion";

const variants = {
  default: { width: 0 },
  active: { width: "calc(100% - 0.75rem)" },
};

const TabButton = ({ active, selectTab, children }) => {
  const buttonClasses = active
    ? "text-gray-900 dark:text-white"
    : "text-[#6b7280] hover:text-blue-600 dark:text-[#ADB7BE] dark:hover:text-white";

  return (
    <button onClick={selectTab} className="transition-colors duration-300">
      <p className={`mr-3 font-semibold ${buttonClasses}`}>{children}</p>
      <motion.div
        animate={active ? "active" : "default"}
        variants={variants}
        className="h-1 bg-blue-500 mt-2 mr-3"
      />
    </button>
  );
};

export default TabButton;
