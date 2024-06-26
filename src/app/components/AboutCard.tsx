import Image, { StaticImageData } from "next/image";
import React from "react";
import Link from "next/link";
import { Button } from "flowbite-react";
import { MdDownloading } from "react-icons/md";
import testPic from "@/app/images/testpic.png";
import profPic from "@/app/images/2x2.png";
import profile from "@/app/images/profile.jpg";

const AboutCard = () => {
  const imageStyle = {
    borderRadius: "100%",
    border: "1px solid #fff",
  };
  return (
    <>
      <div className="flex flex-col md:flex-row items-center justify-center">
        <div>
          <Image
            src={profile}
            width={300}
            height={300}
            style={imageStyle}
            alt="Profile Picture"
          />
        </div>
        <div className="flex flex-col py-8 px-4 md:p-8 md:m-8">
          <h2 className="text-xl md:text-3xl lg:text-5xl font-bold">
            Keanu Dane Tibule
          </h2>
          <h3 className="text-sm md:text-xl lg:text-2xl">Programmer</h3>
          <h4 className="text-zinc-300 text-xs md:text-lg lg:text-xl mt-4">
            Phone:
          </h4>
          <a href="tel:+639691573459">
            <h4 className="text-xs md:text-lg lg:text-xl">+63 969 157 3459</h4>
          </a>
          <h4 className="text-zinc-300 text-xs md:text-lg lg:text-xl mt-4">
            Email:
          </h4>
          <a href="mailto:keanudanetibule@gmail.com">
            <h4 className="text-xs md:text-lg lg:text-xl">
              keanudanetibule@gmail.com
            </h4>
          </a>
          <h4 className="text-zinc-300 text-xs md:text-lg lg:text-xl mt-4">
            Address:
          </h4>
          <h4 className="text-xs md:text-lg lg:text-xl">
            Baloling, Mapandan, Pangasinan, Philippines
          </h4>
          <h4 className="text-zinc-300 text-xs md:text-lg lg:text-xl mt-4">
            Date of Birth:
          </h4>
          <div className="flow-root flex-col md:flex-row ">
            <h4 className="text-xs md:text-lg lg:text-xl float-none md:float-left">
              October 4 ,1999
            </h4>
            <Link href="/Keanu-Dane-Resume.pdf" target="_blank">
              <Button className="float-none md:float-right hover:bg-zinc-900 my-4 md:-mt-2">
                Download Resume
                <MdDownloading className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};
export default AboutCard;
