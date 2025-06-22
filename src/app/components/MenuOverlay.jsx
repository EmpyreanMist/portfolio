import React from "react";
import NavLink from "./NavLink";

const MenuOverlay = ({ links }) => {
  return (
    <div className="fixed inset-x-0 top-16 z-40">
      <div
        className="absolute inset-0 
                      bg-white/60 backdrop-blur-xl
                      dark:bg-black dark:backdrop-blur-none"
      ></div>

      <ul className="relative z-10 flex flex-col py-8 items-center gap-6">
        {links.map((link, index) => (
          <li key={index}>
            <NavLink href={link.path} title={link.title} />
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MenuOverlay;
