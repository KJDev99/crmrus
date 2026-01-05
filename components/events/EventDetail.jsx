import React from 'react'
import GlassButton1 from '../ui/GlassButton1'
import { IoIosArrowBack } from 'react-icons/io'
import { MdEvent, MdLocationOn, MdAccessTime, MdPeople, MdCategory, MdDescription } from 'react-icons/md'

export default function EventDetail({ setStep }) {
    return (
        <div>
            <div className=" text-white flex justify-between items-center mt-[0px]">
                <div onClick={() => setStep(2)} className=" cursor-pointer"><IoIosArrowBack size={40} /></div>
                <img src="/icons/logo.svg" alt="a" />
                <div></div>
            </div>
            <div className='text-center mt-[0]'>
                <p className="font-normal text-white text-[20px] leading-[100%] tracking-[0%] text-center uppercase underline hover:cursor-pointer">
                    Ближайшие мероприятия
                </p>
                <div className="mt-12 max-w-4xl mx-auto bg-white/10 backdrop-blur-lg rounded-2xl p-8 text-white">
                    <div className="flex items-center justify-center gap-3 text-2xl mb-8">
                        <MdEvent size={30} className="text-blue-300" />
                        <h1 className="font-bold">Детали мероприятия</h1>
                    </div>

                    <div className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <MdEvent size={24} className="text-blue-300" />
                                <div>
                                    <p className="text-sm opacity-80">Название</p>
                                    <p className="text-lg font-semibold">Концерт классической музыки</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MdLocationOn size={24} className="text-green-300" />
                                <div>
                                    <p className="text-sm opacity-80">Место</p>
                                    <p className="text-lg font-semibold">Театр оперы, ул. Центральная, 1</p>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="flex items-center gap-3">
                                <MdAccessTime size={24} className="text-yellow-300" />
                                <div>
                                    <p className="text-sm opacity-80">Дата и время</p>
                                    <p className="text-lg font-semibold">15 мая 2025, 19:00</p>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <MdPeople size={24} className="text-purple-300" />
                                <div>
                                    <p className="text-sm opacity-80">Вместимость</p>
                                    <p className="text-lg font-semibold">500 человек</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex items-center gap-3">
                            <MdCategory size={24} className="text-red-300" />
                            <div>
                                <p className="text-sm opacity-80">Категория</p>
                                <p className="text-lg font-semibold">Музыка, Искусство, Концерт</p>
                            </div>
                        </div>

                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <MdDescription size={24} className="text-cyan-300" />
                                <p className="font-semibold">Описание</p>
                            </div>
                            <p className="text-left opacity-90 leading-relaxed">
                                Приглашаем вас на незабываемый вечер классической музыки с участием симфонического оркестра.
                                В программе произведения великих композиторов: Бетховена, Моцарта и Чайковского.
                            </p>
                        </div>

                        <div className="flex justify-center gap-4 pt-6">
                            <button className="px-8 py-3 bg-blue-500 hover:bg-blue-600 rounded-lg transition-colors font-semibold">
                                Купить билет
                            </button>
                            <button className="px-8 py-3 bg-white/20 hover:bg-white/30 rounded-lg transition-colors font-semibold">
                                Добавить в календарь
                            </button>
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