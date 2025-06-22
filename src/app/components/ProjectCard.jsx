import React from "react";
import { CodeBracketIcon, EyeIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import Image from "next/image";

const ProjectCard = ({ imgUrl, title, description, gitUrl, previewUrl }) => {
  return (
    <div className="relative rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 shadow-md">
      <div className="relative group w-full h-52 md:h-72 bg-gray-100 dark:bg-black">
        <Image
          src={imgUrl}
          alt={title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
        />
        <div className="absolute inset-0 hidden group-hover:flex items-center justify-center bg-black/80 transition-all duration-500">
          <Link
            href={gitUrl}
            target="_blank"
            className="h-14 w-14 mr-2 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
          >
            <CodeBracketIcon className="h-10 w-10 text-[#ADB7BE] group-hover/link:text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
          </Link>
          <Link
            href={previewUrl}
            target="_blank"
            className="h-14 w-14 border-2 relative rounded-full border-[#ADB7BE] hover:border-white group/link"
          >
            <EyeIcon className="h-10 w-10 text-[#ADB7BE] group-hover/link:text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" />
          </Link>
        </div>
      </div>

      <div className="absolute top-[200px] left-0 right-0 h-40 blur-2xl opacity-30 z-0 bg-gradient-to-b from-blue-400 via-purple-400 to-transparent dark:opacity-10 pointer-events-none" />
      <div className="relative z-10 p-4">
        <h5 className="text-xl font-semibold mb-2 text-gray-900 dark:text-white">
          {title}
        </h5>
        <p className="text-gray-700 dark:text-[#ADB7BE]">{description}</p>
      </div>
    </div>
  );
};

export default ProjectCard;
