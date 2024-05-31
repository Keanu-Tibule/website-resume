import React from "react";

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
    <a href={href} target="_blank" rel="noopener noreferrer">
      <div className="p-6 rounded-lg shadow-lg border bg-black border-zinc-500 mx-4 my-2 sm:mx-8 w-48 sm:w-96 h-48 sm:h-96 hover:bg-zinc-900">
        <div className="flex flex-col items-center justify-center text-center h-full">
          <div className="w-20 h-20 border rounded-full border-white p-2 flex items-center justify-center hover:bg-black">
            <svg
              className="w-10 h-10 sm:w-12 sm:h-12"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path fillRule="evenodd" d={icon} clipRule="evenodd" />
              <path d={icon2} />
            </svg>
          </div>
          <div>
            <h5 className="text-xs sm:text-xl lg:text-1xl font-normal mt-4 sm:mt-10 mb-4 hover:underline text-white">
              {info}
            </h5>
            <p className="hidden sm:block text-zinc-500 my-4">{desc}</p>
          </div>
        </div>
      </div>
    </a>
  );
};

export default ContactCard;
