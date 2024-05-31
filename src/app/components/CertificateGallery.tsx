import { useState } from "react";
import Image, { StaticImageData } from "next/image";

import outsoarCert from "@/app/images/Outsoar-Certificate.png";
import webdevCert from "@/app/images/WebDev-Cert.png";
import cplusCert from "@/app/images/CPlus-Intermediate-Cert.png";
import hackCert from "@/app/images/Hackathon-Certificate.png";
import oracleCert from "@/app/images/Oracle-Certificate.png";
import sapCert from "@/app/images/SAP-Certificate.png";

const certificates: StaticImageData[] = [
  webdevCert,
  outsoarCert,
  cplusCert,
  oracleCert,
  hackCert,
  sapCert,
  // Add paths to all your certificate images
];

const CertificateGallery = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedImage, setSelectedImage] = useState<StaticImageData | null>(
    null
  );

  const openModal = (image: StaticImageData) => {
    setSelectedImage(image);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setSelectedImage(null);
  };

  return (
    <div className="container mx-auto px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {certificates.map((image, index) => (
          <div key={index} className="relative">
            <Image
              src={image}
              alt={`Certificate ${index + 1}`}
              width={450}
              height={300}
              className="cursor-pointer rounded-lg"
              onClick={() => openModal(image)}
            />
          </div>
        ))}
      </div>

      {isOpen && selectedImage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50">
          <div className="relative">
            <button
              className="absolute top-[-50px] right-[-50px] m-4 text-white text-4xl"
              onClick={closeModal}
            >
              &times;
            </button>
            <Image
              src={selectedImage}
              alt="Enlarged Certificate"
              width={800}
              height={600}
            />
          </div>
          <div className="fixed inset-0" onClick={closeModal}></div>
        </div>
      )}
    </div>
  );
};

export default CertificateGallery;
