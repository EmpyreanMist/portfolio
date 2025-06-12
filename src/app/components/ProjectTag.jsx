import React from "react";

const ProjectTag = ({ name, onClick, isSelected }) => {
  return (
    <button
      onClick={() => onClick(name)}
      className={`px-1 py-1 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 transition-all hover:brightness-110 ${
        isSelected ? "" : "opacity-80"
      }`}
    >
      <span className="block bg-[#0f172a] hover:bg-[#1e293b] text-white px-7 py-3 text-lg font-semibold rounded-full shadow-md transition-colors duration-200">
        {name}
      </span>
    </button>
  );
};

export default ProjectTag;
