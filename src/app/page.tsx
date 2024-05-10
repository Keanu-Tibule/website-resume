import React from "react";
import Navbar from "@/app/components/Navbar";
import SocIcons from "@/app/components/SocIcons";
import Footer from "@/app/components/Footer";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Navbar />
        <div className="text-center m-8">
          <h1 className="text-5xl md:text-7xl lg:text-9xl font-bold">Hi, I&apos;m Keanu.</h1>
        </div>
        <div className="text-center m-4">
          <h2 className="text-md md:text-lg lg:text-xl text-zinc-500">
            A passionate programmer dedicated to crafting innovative solutions
            through code. Let&apos;s turn ideas into reality!
          </h2>
        </div>
        <SocIcons />
      </div>
      <Footer />
    </>
  );
}
