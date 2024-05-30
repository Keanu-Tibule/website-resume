import React from "react";

const AboutAcc = () => {
  return (
    <div className="p-4">
      <div className="grid mb-8 md:mb-12 md:grid-cols-2 gap-6">
        <figure className="flex flex-col items-center justify-center p-8 text-center bg-black border border-white rounded-lg w-full hover:bg-zinc-950">
          <blockquote className="max-w-xl mx-auto text-zinc-500 hover:text-zinc-300 dark:text-gray-400">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Best in Thesis
            </h3>
            <p className="my-4 text-lg md:text-xl lg:text-2xl font-medium">
              Received in 2024 at STI College for an outstanding capstone thesis project. Solo developed a 3D Filipino horror game via Unreal Engine 5.
            </p>
          </blockquote>
        </figure>
        <figure className="flex flex-col items-center justify-center p-8 text-center bg-black border border-white rounded-lg w-full hover:bg-zinc-950">
          <blockquote className="max-w-xl mx-auto text-zinc-500 hover:text-zinc-300 dark:text-gray-400">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              CodeFest Placer
            </h3>
            <p className="my-4 text-lg md:text-xl lg:text-2xl font-medium">
              Received in March 2022 for placing 2nd in a 1-week coding competition at STI College.
            </p>
          </blockquote>
        </figure>
        <figure className="flex flex-col items-center justify-center p-8 text-center bg-black border border-white rounded-lg w-full hover:bg-zinc-950">
          <blockquote className="max-w-xl mx-auto text-zinc-500 hover:text-zinc-300 dark:text-gray-400">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Student Council President
            </h3>
            <p className="my-4 text-lg md:text-xl lg:text-2xl font-medium">
              Stood as president of the student council at Informatics Institute from 2018 to 2019.
            </p>
          </blockquote>
        </figure>
        <figure className="flex flex-col items-center justify-center p-8 text-center bg-black border border-white rounded-lg w-full hover:bg-zinc-950">
          <blockquote className="max-w-xl mx-auto text-zinc-500 hover:text-zinc-300 dark:text-gray-400">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold text-white">
              Dean&apos;s Lister
            </h3>
            <p className="my-4 text-lg md:text-xl lg:text-2xl font-medium">
              Dean&apos;s Lister from 2016 to 2024, from University of Baguio to STI College.
            </p>
          </blockquote>
        </figure>
      </div>
    </div>
  );
};
export default AboutAcc;
