import React from 'react'
import PhoneInput from '../ui/input'
import { IoIosArrowBack } from "react-icons/io";
export default function Login() {
    return (
        <div className='max-w-7xl m-auto'>
<div className="relative flex flex-col  items-center min-h-screen  text-white px-8">
      <div className="absolute top-8 left-8 text-3xl cursor-pointer"><IoIosArrowBack /></div>

      {/* Logo va sarlavha */}
      <img src="/icons/logo.svg" alt="a"/>
      {/* Kirish matni */}
      <p className="ont-[JejuMyeongjo] mb-20 text-[24px] leading-[24px] tracking-normal text-center">
        Вход в личный кабинет<br />
        <span className="font-semibold">только</span><br />
        для членов клуба
      </p>
   <PhoneInput text={'Телефон'} />

      <p className="font-jeju font-normal text-[24px] leading-[100%] tracking-[0%] text-center mt-[180px] mb-[187px]">
        Если вы хотите стать<br />
        членом Клуба —<br />
        <span className="underline">свяжитесь с нами</span>
      </p>
    </div>
        </div>
    )
}
