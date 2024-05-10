import React from "react";
import Link from "next/link";
import Navbar from "@/app/components/Navbar";
import SocIcons from "./components/SocIcons";
import Footer from "./components/Footer";

export default function Home() {
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <Navbar />
        <div className="text-center my-8">
          <h1 className="text-9xl font-bold">Hi, I'm Keanu.</h1>
        </div>
        <div className="text-center my-4">
          <h2 className="text-zinc-500">
            A passionate programmer dedicated to crafting innovative solutions
            through code. Let's turn ideas into reality!
          </h2>
        </div>
        <SocIcons />
      </div>
      <Footer />
    </>
  );
}
