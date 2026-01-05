import React from 'react'
import GlassButton1 from '../ui/GlassButton1'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { MdLocationCity } from 'react-icons/md'
import Link from 'next/link'

export default function Event({ setStep }) {
    return (
        <div>
            <div className=" text-white flex justify-between items-center mt-[0px]">
                <Link href={'/role'} className=" cursor-pointer"><IoIosArrowBack size={40} /></Link>
                <img src="/icons/logo.svg" alt="a" />
                <div></div>
            </div>
            <div className='text-center mt-[0]'>
                <p className="font-normal text-white text-[20px] leading-[100%] tracking-[0%] text-center uppercase underline hover:cursor-pointer">
                    Ближайшие мероприятия
                </p>
                <div className='mt-30 flex justify-center'>
                    <div className="relative" onClick={() => setStep(1)}>
                        <MdLocationCity className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={24} />
                        <GlassButton1 w="w-80 md:w-120"
                            h="h-[60px] md:h-[80px]"
                            textsize="text-[20px] md:text-[26px]"
                            text={'Выберете город'}
                            className="pl-12" />
                    </div>
                </div>
            </div>
            <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] mb-[64px] flex justify-center">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-[50px]">
                    ★
                </div>
            </div>
        </div>
    )
}