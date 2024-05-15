import React from "react";

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
      <div className="p-4 flex flex-row md:flex-col md:fixed md:left-0">
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
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="black">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
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
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="black">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
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
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="black">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
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
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="black">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
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
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="black">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
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
            <svg className="w-4 h-4" viewBox="0 0 512 512" fill="black">
              <path d="M377.9 105.9L500.7 228.7c7.2 7.2 11.3 17.1 11.3 27.3s-4.1 20.1-11.3 27.3L377.9 406.1c-6.4 6.4-15 9.9-24 9.9c-18.7 0-33.9-15.2-33.9-33.9l0-62.1-128 0c-17.7 0-32-14.3-32-32l0-64c0-17.7 14.3-32 32-32l128 0 0-62.1c0-18.7 15.2-33.9 33.9-33.9c9 0 17.6 3.6 24 9.9zM160 96L96 96c-17.7 0-32 14.3-32 32l0 256c0 17.7 14.3 32 32 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32l-64 0c-53 0-96-43-96-96L0 128C0 75 43 32 96 32l64 0c17.7 0 32 14.3 32 32s-14.3 32-32 32z"></path>
            </svg>
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
