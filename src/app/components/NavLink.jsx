import Link from "next/link";

const NavLink = ({ href, title }) => {
  return (
    <Link
      href={href}
      className="block py-2 pl-3 pr-4 sm:text-xl rounded md:p-0 text-white hover:text-blue-600 hover:underline transition-colors duration-200 cursor-pointer"
    >
      {title}
    </Link>
  );
};

export default NavLink;
