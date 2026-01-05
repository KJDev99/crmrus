import React from 'react'
import { IoIosArrowBack } from "react-icons/io";
import GlassButton1 from '../ui/GlassButton1';
import Link from 'next/link';
export default function HomeRestriction() {
  return (
    <div className='max-w-7xl m-auto  '>
      <div className=" text-white flex justify-between items-center mt-[0px]">
        <div className=" cursor-pointer  "><IoIosArrowBack size={40} /></div>
        <img src="/icons/logo.svg" alt="a" />
        <a target='_blank'
          href='https://r-profi.taplink.ws'>
          <img src="/icons/support.svg" alt="s" className='w-14 h-14' />
        </a>
      </div>
      <div className='text-center mt-[13px]'>


        <div className='mt-3'>
          <GlassButton1 w="w-120"
            h="h-[80px]" textsize="text-[26px]" text={'Поставщики'} />
        </div>
        <div className='mt-[32px]'>
          <GlassButton1 w="w-120"
            h="h-[80px]" textsize="text-[26px]" text={'Ремонт'} />
        </div>
        <div className='mt-[32px]'>
          <GlassButton1 w="w-120"
            h="h-[80px]" textsize="text-[26px]" text={'Дизайн'} />
        </div>
      </div>
      <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] mb-[64px] flex justify-center">

        <div className="text-center text-white space-y-4">
          <Link href={'/events'} className="font-normal text-[20px] leading-[100%] tracking-[0%] text-center uppercase hover:underline hover:cursor-pointer">
            Ближайшие мероприятия
          </Link>

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
