import React from 'react'
import PhoneInput from '../ui/input'
import { IoIosArrowBack } from "react-icons/io";
import GlassButton from '../ui/GlassButton';
export default function HomeRestriction() {
    return (
        <div className='max-w-7xl m-auto  '>
<div className=" text-white flex justify-between items-center mt-[17px]">
      <div className=" cursor-pointer  "><IoIosArrowBack size={40} /></div>

       
      <img src="/icons/logo.svg" alt="a"/>

       <img src="/icons/support.svg" alt="s"/>
    </div>
    <div className='text-center mt-[13px]'>

       
   <div className='mt-12'>
   <GlassButton text={'Поставщики'}/>
   </div>
   <div className='mt-[32px]'>
   <GlassButton text={'Ремонт'}/>
   </div>
   <div className='mt-[32px]'>
   <GlassButton text={'Дизайн'}/>
   </div>
    </div>
      <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] mb-[64px] flex justify-center">
        
        {/* Markazdagi matn */}
        <div className="text-center text-white space-y-4">
          <p className="font-normal text-[20px] leading-[100%] tracking-[0%] text-center uppercase hover:underline hover:cursor-pointer">
            Ближайшие мероприятия
          </p>

          <p className="font-normal text-[20px] leading-[100%] tracking-[0%] text-center hover:underline hover:cursor-pointer">
            Интерьерные журналы
          </p>

          <p className="font-[JejuMyeongjo] font-normal text-[16px] leading-[100%] tracking-[0%] text-center mt-[52px]">
            ИП Кудряшова М.А<br />
            и оферта с<br />
            конфиденциальностью
          </p>
        </div>
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-[50px]">
          ★
        </div>

      </div>
        </div>
    )
}
