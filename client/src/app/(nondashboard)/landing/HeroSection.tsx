import React from 'react'
import Image from 'next/image'
const HeroSection = () => {
  return (
    <div className="pt-[72px]">
    <Image
        src="/landing-splash.jpg"   
        alt="Rentiful Rental Platform Hero Section"
        fill 
        className='object-cover object-center'
        priority
    />

    </div>
  )
}

export default HeroSection