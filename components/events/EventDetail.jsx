import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'

export default function EventDetail({ setStep }) {
    return (
        <div>
            <div className=" text-white flex justify-between items-center mt-[0px]">
                <div onClick={() => setStep(2)} className=" cursor-pointer"><IoIosArrowBack size={40} /></div>
                <img src="/icons/logo.svg" alt="a" />
                <div>
                    <img src="/icons/share.svg" alt="a" />
                </div>
            </div>
            <div className="max-w-xl mx-auto space-y-6">
                <div className="">
                    <div className=" flex mb-6">
                        <div className='w-[125px] h-[100px] card_img '></div>
                        <div className="flex flex-col border-b border-b-[#FFFFFF91] pl-12 ml-[-16px]">
                            <h2 className='mb-0.5 text-[#FFFFFF] text-[22px]'>Название организации</h2>
                            <div className='w-full h-0.25 bg-[#FFFFFF4F]'></div>
                            <p className='text-[#B79F15] uppercase text-sm leading-[100%] mt-3'>ОБУЧЕНИЕ / ПРЕЗЕНТАЦИЯ / ОТКРЫТИЕДОСУГОВО-РАЗВЛЕКАТЕЛЬНАЯ</p>
                        </div>
                    </div>
                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>Анонс мероприятия</h2>
                    <div className='text-lg border-y border-[#FFFFFF91] px-2 py-4 text-[#FFFFFF]'>
                        Дата, время и место проведения мероприятияТелефон для записи
                    </div>
                    <p className='text-lg  px-2 py-4 text-[#FFFFFF]'>О мероприятии:</p>
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