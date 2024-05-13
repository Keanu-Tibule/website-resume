import React from "react";
import Image, { StaticImageData } from "next/image";

interface ProjectCardProps {
  title: string;
  desc: string;
  images: { src: StaticImageData; alt: string }[];
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  title,
  desc,
  images,
}) => {
  return (
    <div className="py-14">
      <div className="flex flex-col items-center">
        <div className="w-full bg-white text-black p-8">
          <h2 className="text-2xl md:text-4xl font-bold mb-4">{title}</h2>
          <p className="text-lg md:text-xl">{desc}</p>
        </div>
        <div className="flow-root p-6">
          {images.map((image, index) => (
            <div
              key={index}
              className={`my-4 ${
                index % 2 === 0 ? "float-left" : "float-right"
              } rounded-full border border-zinc-500`}
            >
              <Image src={image.src} width={740} height={400} alt={image.alt} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;
