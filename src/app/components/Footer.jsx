import React from "react";
import Link from "next/link";
import Image from "next/image";

const Footer = () => {
  return (
    <footer className="footer border z-10 border-t-[#33353F] border-l-transparent border-r-transparent text-white">
      <div className="container p-12 flex justify-between">
        <Link href={"/"}>
          <Image
            src="/images/main-logo.png"
            alt="Christian Logo"
            width={50}
            height={50}
            className="object-contain rounded-lg"
          />
        </Link>
      </div>
    </footer>
  );
};

export default Footer;
