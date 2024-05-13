import Footer from '@/app/components/Footer';
import Navbar from '@/app/components/Navbar';
import ProjectSection from '@/app/components/ProjectSection';
import React from 'react'
import firstKulam from '@/app/images/ku-menu.png'
import secondKulam from '@/app/images/ku-batt.png'
import thirdKulam from '@/app/images/ku-sett.png'
import fourthKulam from '@/app/images/ku-as.png'

const Projects = () => {

  const images = [
    {src: firstKulam, alt: 'Main Menu of the Game'},
    {src: secondKulam, alt: 'In Game Screenshot'},
    {src: thirdKulam, alt: 'Settings Menu of the Game'},
    {src: fourthKulam, alt: 'In Game Screenshot'},
  ];

  return (
    <>
      <div className='fixed top-0 z-10 w-full'>
        <Navbar />
      </div>
      <div>
        <ProjectSection 
        title='Kulam: A 3D Filipino Horror Game' 
        desc='Made via Unreal Engine 5, this project has won me the Best Thesis Award.'
        images={images}/>
      </div>
      <Footer />
    </>
  )
}
export default Projects;