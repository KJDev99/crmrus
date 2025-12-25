'use client'
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import GlassButton1 from '../ui/GlassButton1'
import Image from 'next/image'

export default function LeftPanel({ step = 0, setStep }) {
  const buttons = ['АНКЕТЫ', 'ОТЗЫВЫ', 'РЕЙТИНГ', 'ОТЧЕТЫ', 'ОПЛАТЫ']

  return (
    <div className="relative h-full w-[420px] bg-gradient-to-b from-[#0B1A4A] to-[#081437] text-white">
      <div className="absolute top-[40px] left-[30px] cursor-pointer">
        <IoIosArrowBack size={36} />
      </div>

      <div className="flex flex-col items-center pt-[54px]">
        <div className="w-[65px] h-[65px] rounded-full bg-[#D9D9D9] mb-[14px]" />
        <h2 className="text-[22px] font-normal leading-none">Username</h2>
        <p className="text-[18px] opacity-80">info@mail.ru</p>
      </div>

      <div className="flex flex-col gap-[22px] mt-[86px] pl-[38px]">
        {buttons.map((btn, idx) => (
          <GlassButton1
            key={btn}
            w="w-[330px]"
            h="h-[62px]"
            text={btn}
            textsize="text-[26px]"
            active={step === idx}
            onClick={() => setStep && setStep(idx)}
          />
        ))}
      </div>

      {/* LOGO */}
      <div className="absolute top-[698px] w-full flex justify-center">
        <Image
          src="/icons/logo.svg"
          width={190}
          height={190}
          alt="logo"
        />
      </div>
    </div>
  )
}
 