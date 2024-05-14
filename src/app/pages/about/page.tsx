import AboutCard from '@/app/components/AboutCard';
import AboutSidebar from '@/app/components/AboutSidebar'
import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import React from 'react'

const About = () => {
  return (
    <>
      {/* <AboutSidebar /> */}
      <div>
        <Navbar />
      </div>
      <div>
        <AboutCard />
      </div>
      <Footer />
    </>
  )
}
export default About;