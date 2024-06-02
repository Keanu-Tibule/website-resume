import React from "react";
import { BsPersonCircle } from "react-icons/bs";
import { FaCode } from "react-icons/fa6";
import { MdWorkHistory } from "react-icons/md";
import { PiCertificateFill } from "react-icons/pi";
import { IoSchool } from "react-icons/io5";
import { FaTrophy } from "react-icons/fa";

interface AboutSidebarProps {
  activeSection: string;
  setActiveSection: (section: string) => void;
}

const AboutSidebar: React.FC<AboutSidebarProps> = ({
  activeSection,
  setActiveSection,
}) => {

  return (
    <>
      <div className="p-4 flex flex-row md:flex-col md:fixed md:left-0 z-10">
        {/* About */}
        <button
          className={`${activeSection === "card" ? "w-11 md:w-28 rounded-lg ring-4 ring-zinc-500" : ""} m-2 group flex items-center justify-start w-11 h-11 bg-white rounded-full cursor-pointer 
          relative overflow-hidden transition-all duration-200 shadow-lg 
          hover:w-11 md:hover:w-28 hover:rounded-lg active:translate-x-1 active:translate-y-1`}
          onClick={() => setActiveSection("card")}
        >
          <div
            className={`${activeSection === "card" ? "px-3 justify-start" : ""}flex items-center justify-center w-full
            transition-all duration-300 group-hover:justify-start
            group-hover:px-3`}
          >
            <BsPersonCircle color="black"/>
          </div>

          <div
            className={`${activeSection === "card" ? "md:translate-x-0 md:opacity-100 md:visible invisible" : ""} absolute right-5 transform
            translate-x-full opacity-0 text-black text-lg
            font-semibold transition-all duration-300
            group-hover:translate-x-0 md:group-hover:opacity-100`}
          >
            About
          </div>
        </button>
        {/* Stack */}
        <button
          className={`${activeSection === "stack" ? "w-11 md:w-28 rounded-lg ring-4 ring-zinc-500" : ""} m-2 group flex items-center justify-start w-11 h-11 bg-white rounded-full cursor-pointer 
          relative overflow-hidden transition-all duration-200 shadow-lg 
          hover:w-11 md:hover:w-28 hover:rounded-lg active:translate-x-1 active:translate-y-1`}
          onClick={() => setActiveSection("stack")}
        >
          <div
            className={`${activeSection === "stack" ? "px-3 justify-start" : ""}flex items-center justify-center w-full
            transition-all duration-300 group-hover:justify-start
            group-hover:px-3`}
          >
            <FaCode color="black"/>
          </div>

          <div
            className={`${activeSection === "stack" ? "md:translate-x-0 md:opacity-100 md:visible invisible" : ""} absolute right-5 transform
            translate-x-full opacity-0 text-black text-lg
            font-semibold transition-all duration-300
            group-hover:translate-x-0 md:group-hover:opacity-100`}
          >
            Stack
          </div>
        </button>
        {/* Experience */}
        <button
          className={`${activeSection === "exp" ? "w-11 md:w-40 rounded-lg ring-4 ring-zinc-500" : ""} m-2 group flex items-center justify-start w-11 h-11 bg-white rounded-full cursor-pointer 
          relative overflow-hidden transition-all duration-200 shadow-lg 
          hover:w-11 md:hover:w-40 hover:rounded-lg active:translate-x-1 active:translate-y-1`}
          onClick={() => setActiveSection("exp")}
        >
          <div
            className={`${activeSection === "exp" ? "px-3 justify-start" : ""}flex items-center justify-center w-full
            transition-all duration-300 group-hover:justify-start
            group-hover:px-3`}
          >
            <MdWorkHistory color="black"/>
          </div>

          <div
            className={`${activeSection === "exp" ? "md:translate-x-0 md:opacity-100 md:visible invisible" : ""} absolute right-5 transform
            translate-x-full opacity-0 text-black text-lg
            font-semibold transition-all duration-300
            group-hover:translate-x-0 md:group-hover:opacity-100`}
          >
            Experience
          </div>
        </button>
        {/* Certifications */}
        <button
          className={`${activeSection === "cert" ? "w-11 md:w-44 rounded-lg ring-4 ring-zinc-500" : ""} m-2 group flex items-center justify-start w-11 h-11 bg-white rounded-full cursor-pointer 
          relative overflow-hidden transition-all duration-200 shadow-lg 
          hover:w-11 md:hover:w-44 hover:rounded-lg active:translate-x-1 active:translate-y-1`}
          onClick={() => setActiveSection("cert")}
        >
          <div
            className={`${activeSection === "cert" ? "px-3 justify-start" : ""}flex items-center justify-center w-full
            transition-all duration-300 group-hover:justify-start
            group-hover:px-3`}
          >
            <PiCertificateFill color="black"/>
          </div>

          <div
            className={`${activeSection === "cert" ? "md:translate-x-0 md:opacity-100 md:visible invisible" : ""} absolute right-5 transform
            translate-x-full opacity-0 text-black text-lg
            font-semibold transition-all duration-300
            group-hover:translate-x-0 md:group-hover:opacity-100`}
          >
            Certifications
          </div>
        </button>
        {/* Education */}
        <button
          className={`${activeSection === "educ" ? "w-11 md:w-36 rounded-lg ring-4 ring-zinc-500" : ""} m-2 group flex items-center justify-start w-11 h-11 bg-white rounded-full cursor-pointer 
          relative overflow-hidden transition-all duration-200 shadow-lg 
          hover:w-11 md:hover:w-36 hover:rounded-lg active:translate-x-1 active:translate-y-1`}
          onClick={() => setActiveSection("educ")}
        >
          <div
            className={`${activeSection === "educ" ? "px-3 justify-start" : ""}flex items-center justify-center w-full
            transition-all duration-300 group-hover:justify-start
            group-hover:px-3`}
          >
            <IoSchool color="black"/>
          </div>

          <div
            className={`${activeSection === "educ" ? "md:translate-x-0 md:opacity-100 md:visible invisible" : ""} absolute right-5 transform
            translate-x-full opacity-0 text-black text-lg
            font-semibold transition-all duration-300
            group-hover:translate-x-0 md:group-hover:opacity-100`}
          >
            Education
          </div>
        </button>
        {/* Achievements */}
        <button
          className={`${activeSection === "acc" ? "w-11 md:w-56 rounded-lg ring-4 ring-zinc-500" : ""} m-2 group flex items-center justify-start w-11 h-11 bg-white rounded-full cursor-pointer 
          relative overflow-hidden transition-all duration-200 shadow-lg 
          hover:w-11 md:hover:w-56 hover:rounded-lg active:translate-x-1 active:translate-y-1`}
          onClick={() => setActiveSection("acc")}
        >
          <div
            className={`${activeSection === "acc" ? "px-3 justify-start" : ""}flex items-center justify-center w-full
            transition-all duration-300 group-hover:justify-start
            group-hover:px-3`}
          >
            <FaTrophy color="black"/>
          </div>

          <div
            className={`${activeSection === "acc" ? "md:translate-x-0 md:opacity-100 md:visible invisible" : ""} absolute right-5 transform
            translate-x-full opacity-0 text-black text-lg
            font-semibold transition-all duration-300
            group-hover:translate-x-0 md:group-hover:opacity-100`}
          >
            Accomplishments
          </div>
        </button>
      </div>
    </>
  );
};
export default AboutSidebar;
