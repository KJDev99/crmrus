import React from 'react'
import PhoneInput from '../ui/input'
import { IoIosArrowBack } from "react-icons/io";
import GlassButton from '../ui/GlassButton';
export default function Enter() {
    return (
        <div className='max-w-7xl m-auto  '>
<div className="relative flex flex-col  items-center    text-white px-8">
      <div className="absolute top-26  left-8 text-3xl cursor-pointer  "><IoIosArrowBack size={40} /></div>

       
      <img src="/icons/logo.svg" alt="a"/>
      
      <p className="ont-[JejuMyeongjo] mb-20 text-[24px] leading-[24px] tracking-normal text-center">
        Вход в личный кабинет<br />
        <span className="font-semibold">только</span><br />
        для членов клуба
      </p>
   <PhoneInput text={'Телефон'} isPhone={true} />
   <div className='mt-12'>
   <GlassButton text={'ДАЛЛЕ'}/>
   </div>

      <p className="font-jeju font-normal text-[24px] leading-[100%] tracking-[0%] text-center mt-[136px] ">
        Если вы хотите стать<br />
        членом Клуба —<br />
        <span className="underline">свяжитесь с нами</span>
      </p>
    </div>
        </div>
    )
}
