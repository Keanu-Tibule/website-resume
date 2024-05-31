import Navbar from "@/app/components/Navbar";
import Footer from "@/app/components/Footer";
import React from "react";
import ContactCard from "@/app/components/ContactCard";
import SocIcons from "@/app/components/SocIcons";

const Contact = () => {
  return (
    <>
      <div className="flex flex-col justify-center items-center min-h-screen">
        <div className="fixed top-0 right-0 w-full">
          <Navbar />
        </div>
        <div className="w-full items-center flex flex-col justify-center">
          <h1 className="text-3xl md:text-5xl lg:text-7xl font-bold p-4 mt-16">
            Contact Me
          </h1>
          <h3 className="mb-4">Got an idea? Lets hear it!</h3>
        </div>
        <div className="container flex flex-col sm:flex-row items-center justify-center px-4 mx-auto mt-12 sm:mt-14">
          <ContactCard
            href="https://www.linkedin.com/in/keanu-dane-tibule-4b4009281/"
            icon="M12.51 8.796v1.697a3.738 3.738 0 0 1 3.288-1.684c3.455 0 4.202 2.16 4.202 4.97V19.5h-3.2v-5.072c0-1.21-.244-2.766-2.128-2.766-1.827 0-2.139 1.317-2.139 2.676V19.5h-3.19V8.796h3.168ZM7.2 6.106a1.61 1.61 0 0 1-.988 1.483 1.595 1.595 0 0 1-1.743-.348A1.607 1.607 0 0 1 5.6 4.5a1.601 1.601 0 0 1 1.6 1.606Z"
            icon2="M7.2 8.809H4V19.5h3.2V8.809Z"
            info="Keanu Dane Tibule"
            desc="LinkedIn"
          />
          <ContactCard
            href="mailto:keanudanetibule@gmail.com"
            icon="M2.038 5.61A2.01 2.01 0 0 0 2 6v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V6c0-.12-.01-.238-.03-.352l-.866.65-7.89 6.032a2 2 0 0 1-2.429 0L2.884 6.288l-.846-.677Z"
            icon2="M20.677 4.117A1.996 1.996 0 0 0 20 4H4c-.225 0-.44.037-.642.105l.758.607L12 10.742 19.9 4.7l.777-.583Z"
            info="keanudanetibule@gmail.com"
            desc="Email"
          />
          <ContactCard
            href="tel:+639691573459"
            icon="M7.978 4a2.553 2.553 0 0 0-1.926.877C4.233 6.7 3.699 8.751 4.153 10.814c.44 1.995 1.778 3.893 3.456 5.572 1.68 1.679 3.577 3.018 5.57 3.459 2.062.456 4.115-.073 5.94-1.885a2.556 2.556 0 0 0 .001-3.861l-1.21-1.21a2.689 2.689 0 0 0-3.802 0l-.617.618a.806.806 0 0 1-1.14 0l-1.854-1.855a.807.807 0 0 1 0-1.14l.618-.62a2.692 2.692 0 0 0 0-3.803l-1.21-1.211A2.555 2.555 0 0 0 7.978 4Z"
            icon2=""
            info="+63 969 157 3459"
            desc="Phone"
          />
        </div>
        <div className="mb-12">
          <SocIcons />
        </div>
        <Footer />
      </div>
    </>
  );
};
export default Contact;
