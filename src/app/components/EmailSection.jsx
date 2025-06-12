"use client";
import React from "react";
import GithubIcon from "../../../public/github-icon.svg";
import LinkedinIcon from "../../../public/linkedin-icon.svg";
import Link from "next/link";
import Image from "next/image";

const EmailSection = ({ onSendEmail }) => {
  const handleClick = () => {
    onSendEmail?.(); // 🔫 Trigga lasrar

    // Öppna mailto efter kort delay så laser syns först
    setTimeout(() => {
      window.location.href =
        "mailto:christian@example.com?subject=Message from portfolio&body=Hello Christian,%0D%0A%0D%0A[Write your message here]";
    }, 500);
  };

  return (
    <section
      id="contact"
      className="grid md:grid-cols-2 my-12 md:my-12 py-24 gap-4 relative"
    >
      <div className="z-10">
        <h5 className="text-xl font-bold text-white my-2">
          Let&apos;s Connect
        </h5>
        <p className="text-[#ADB7BE] mb-4 max-w-md">
          I’m always open to interesting conversations or new opportunities.
          Just click the button below and send me a message — I’ll get back to
          you as soon as I can.
        </p>
        <div className="socials flex flex-row gap-2 mb-4">
          <Link href="https://github.com/EmpyreanMist" target="_blank">
            <Image src={GithubIcon} alt="Github Icon" />
          </Link>
          <Link
            href="https://linkedin.com/in/christian-fryksten"
            target="_blank"
          >
            <Image src={LinkedinIcon} alt="Linkedin Icon" />
          </Link>
        </div>
        <button
          onClick={handleClick}
          className="bg-gradient-to-r from-blue-600 via-sky-500 to-indigo-600 hover:brightness-110 text-white font-semibold py-2.5 px-5 rounded-lg inline-block transition-all duration-200 shadow-md"
        >
          Send Email
        </button>
      </div>
    </section>
  );
};

export default EmailSection;
