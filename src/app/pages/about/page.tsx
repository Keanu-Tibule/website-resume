"use client";

import AboutAcc from '@/app/components/AboutAcc';
import AboutAch from '@/app/components/AboutAcc';
import AboutCard from '@/app/components/AboutCard';
import AboutCert from '@/app/components/AboutCert';
import AboutEduc from '@/app/components/AboutEduc';
import AboutExp from '@/app/components/AboutExp';
import AboutSidebar from '@/app/components/AboutSidebar'
import AboutStack from '@/app/components/AboutStack';
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import React, { useState } from 'react';

const About = () => {
  const [activeSection, setActiveSection] = useState('card');

  const renderContent = () => {
    switch(activeSection){
      case 'card':
        return <AboutCard />;
      case 'stack':
        return <AboutStack />;
      case 'exp':
        return <AboutExp />;
      case 'cert':
        return <AboutCert />;
      case 'educ':
        return <AboutEduc />;
      case 'acc':
        return <AboutAcc />;
      default:
        return <AboutCard />;
    }
  };
  return (
    <>
      <div>
        <Navbar />
      </div>
      <AboutSidebar activeSection={activeSection} setActiveSection={setActiveSection}/>
      <div>
        {renderContent()}
      </div>
      <Footer />
    </>
  )
}
export default About;