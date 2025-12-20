import React from 'react'
import GlassButton from '../ui/GlassButton'
import { IoIosArrowBack } from 'react-icons/io'

export default function UpcomingEventsSection1() {
  return (
     <div className='max-w-7xl m-auto  '>
   <div className=" text-white flex justify-between items-center mt-[17px]">
         <div className=" cursor-pointer  "><IoIosArrowBack size={40} /></div>
   
          
         <img src="/icons/logo.svg" alt="a"/>
   
          <div></div>
       </div>
       <div className='text-center mt-[13px]'>
   
          <div>
            <h2 className='font-[JejuMyeongjo] font-normal text-[24px] leading-[100%] tracking-[0%] text-center text-white underline hover:cursor-pointer' >БЛИЖАЙШИЕ МЕРОПРИЯТИЯ </h2>
          </div>
      <div className='mt-12'>
      <GlassButton text={'Выберете город'}/>
      </div>
      
       </div>
         <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] mb-[64px] flex justify-center">
        
           <div className="absolute right-0 top-[265px] -translate-y-1/2 text-white text-[50px]">
             ★
           </div>
   
         </div>
           </div>
  )
}
