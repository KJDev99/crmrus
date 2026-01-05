import React from 'react'
import { IoIosArrowBack, } from 'react-icons/io'

export default function AllEvents({ setStep }) {
    return (
        <div>
            <div className=" text-white flex justify-between items-center mt-[0px]">
                <div onClick={() => setStep(1)} className=" cursor-pointer"><IoIosArrowBack size={40} /></div>
                <img src="/icons/logo.svg" alt="a" />
                <div></div>
            </div>
            <div className='mt-[0]'>
                <p className="font-normal text-[#B79F15] text-[24px] mb-14 leading-[100%] tracking-[0%] text-center uppercase underline hover:cursor-pointer">
                    18  МАЯ
                </p>

                <div className="max-w-xl mx-auto space-y-6">
                    <div onClick={() => setStep(3)} className=" flex mb-6">
                        <div className='w-[120px] h-[100px] card_img '></div>
                        <div className="flex flex-col border-b border-b-[#FFFFFF91] pl-12 ml-[-16px]">
                            <h2 className='mb-0.5 text-[#FFFFFF] text-[22px]'>Название организации</h2>
                            <p className='text-sm text-[#FFFFFF] mt-[-10px] grow'>город, район, адрес проведения мероприятия</p>
                            <p className='text-[#B79F15] uppercase text-sm leading-[100%]'>ОБУЧЕНИЕ / ПРЕЗЕНТАЦИЯ / ОТКРЫТИЕДОСУГОВО-РАЗВЛЕКАТЕЛЬНАЯ</p>
                        </div>
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