import Footer from "@/app/components/Footer";
import Navbar from "@/app/components/Navbar";
import ProjectSection from "@/app/components/ProjectSection";
import React from "react";
import Link from "next/link";
import firstKulam from "@/app/images/ku-menu.png";
import secondKulam from "@/app/images/ku-batt.png";
import thirdKulam from "@/app/images/ku-sett.png";
import fourthKulam from "@/app/images/ku-as.png";

const Projects = () => {
  const images = [
    { src: firstKulam, alt: "Main Menu of the Game" },
    { src: secondKulam, alt: "In Game Screenshot" },
    { src: thirdKulam, alt: "Settings Menu of the Game" },
    { src: fourthKulam, alt: "In Game Screenshot" },
  ];

  return (
    <>
      <div className="fixed top-0 z-10 w-full">
        <Navbar />
      </div>
      <div className="w-full h-54 items-center flex flex-col justify-center">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold p-4 mt-16">Projects</h1>
        <h3 className="mb-4">Check out my Github and maybe give me a follow!</h3>
        <a href="https://github.com/Keanu-Tibule" target="_blank" rel="noopener noreferrer">
              <svg
                className="w-[48px] h-[48px] text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  fill-rule="evenodd"
                  d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z"
                  clip-rule="evenodd"
                />
              </svg>
          </a>
      </div>
      <div>
        <ProjectSection
          title="Kulam: A 3D Filipino Horror Game"
          desc="Solo developed via Unreal Engine 5.2, this project has won me the Best Thesis Award."
          images={images}
        />
      </div>
      <div className="w-full bg-zinc-300 text-black h-96 items-center flex flex-col justify-center">
        <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold p-4">
          More Projects Coming Soon
        </h1>
        <h3 className="p-4">
          Got an idea in mind? Let&apos;s make it come true through code!
        </h3>
        <Link href="/pages/contact">
          <button
            type="button"
            className="text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2"
          >
            Let&apos;s Talk!
          </button>
        </Link>
      </div>
      <Footer />
    </>
  );
};
export default Projects;
