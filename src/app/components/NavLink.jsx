import Link from "next/link";

const NavLink = ({ href, title }) => {
  return (
    <Link
      href={href}
      className="text-lg md:text-xl font-semibold 
                 text-gray-800 dark:text-white 
                 hover:text-blue-600 dark:hover:text-blue-400 
                 transition-colors 
                 shadow-sm"
      style={{
        textShadow: "0 1px 2px rgba(0,0,0,0.15)",
      }}
    >
      {title}
    </Link>
  );
};

export default NavLink;
