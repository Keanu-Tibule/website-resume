"use client";
import React from "react";
import { Card } from "flowbite-react";

interface ContactCardProps {
  href: string;
  icon: string;
  icon2: string;
  info: string;
  desc: string;
}

const ContactCard: React.FC<ContactCardProps> = ({
  href,
  icon,
  icon2,
  info,
  desc,
}) => {
  return (
    <>
      <a href={href} target="_blank" rel="noopener noreferrer">
          <Card className="p-6 rounded-lg shadow-lg border border-white mx-8">
            <div className="flex flex-col items-center justify-center text-center">
              <svg
                className="w-12 h-12 my-12"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path fill-rule="evenodd" d={icon} clip-rule="evenodd" />
                <path d={icon2} />
              </svg>
              <div>
                <h5 className="text-lg md:text-xl lg:text-1xl font-normal my-4">{info}</h5>
                <p className="text-md md:text-lg lg:text-xl text-zinc-500 my-4">{desc}</p>
              </div>
            </div>
          </Card>
      </a>
    </>
  );
};
export default ContactCard;
