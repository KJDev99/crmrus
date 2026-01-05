import React from 'react'
import GlassButton1 from '../ui/GlassButton1'
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io'
import { MdEvent, MdLocationOn, MdAccessTime } from 'react-icons/md'
import { FaList } from 'react-icons/fa'

export default function AllEvents({ setStep }) {
    return (
        <div>
            <div className=" text-white flex justify-between items-center mt-[0px]">
                <div onClick={() => setStep(1)} className=" cursor-pointer"><IoIosArrowBack size={40} /></div>
                <img src="/icons/logo.svg" alt="a" />
                <div></div>
            </div>
            <div className='text-center mt-[0]'>
                <p className="font-normal text-white text-[20px] leading-[100%] tracking-[0%] text-center uppercase underline hover:cursor-pointer">
                    Ближайшие мероприятия
                </p>
                <div className="mt-12 flex items-center justify-center gap-2 text-white text-2xl mb-8">
                    <FaList size={28} />
                    <h2>Все мероприятия</h2>
                </div>
                <div className="max-w-4xl mx-auto space-y-6">
                    {[1, 2, 3].map((item) => (
                        <div key={item} onClick={() => setStep(3)} className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 text-white">
                            <div className="flex items-center gap-4">
                                <MdEvent size={30} className="text-blue-300" />
                                <div className="flex-1">
                                    <h3 className="text-xl font-semibold">Концерт классической музыки</h3>
                                    <div className="flex items-center gap-6 mt-2">
                                        <div className="flex items-center gap-2">
                                            <MdLocationOn size={20} className="text-green-300" />
                                            <span>Театр оперы</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MdAccessTime size={20} className="text-yellow-300" />
                                            <span>15 мая, 19:00</span>
                                        </div>
                                    </div>
                                </div>
                                <button className="px-6 py-2 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors">
                                    Подробнее
                                </button>
                            </div>
                        </div>
                    ))}
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