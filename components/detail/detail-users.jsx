import React from 'react'
import { BiSortAlt2 } from 'react-icons/bi'
import { FaSearch } from 'react-icons/fa'

export default function DetailUsers() {
    return (
        <div>
            <div className="px-4 py-3 flex items-center gap-7 mt-14 ml-20">
                <div className='relative grow flex h-9.25 bg-[#B7B2B299] rounded-2xl px-5 flex items-center'>

                    <input
                        type="text"
                        placeholder="Найти анкету по ID, телефон, название организации, ФИ человека"
                        className="   w-full outline-none text-[#FFF] font-normal not-italic text-[16px] leading-[100%] tracking-normal"
                    />
                    <button className="text-white ">
                        <FaSearch size={20} className='text-black font-thin' />
                    </button>
                </div>
                <button className="text-gray-400 hover:text-white">
                    <BiSortAlt2 size={32} className='text-white' />
                </button>

            </div>
            <div className="ml-20 mt-5 mb-14">
                <h1 className="font-normal not-italic text-[37px] leading-[100%] tracking-normal text-white">
                    ОТЗЫВЫ
                </h1>
            </div>
            <div className=" text-white">
                <div className='w-full m-auto '>
                    <div className=" overflow-x-auto">
                        <div className="text-left text-[white] text-sm grid grid-cols-12">
                            <div className="col-span-1 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">ID</div>
                            <div className="col-span-3 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Название организации / ФИ</div>
                            <div className="col-span-2 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Группа</div>
                            <div className="col-span-2 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Телефон</div>
                            <div className="col-span-2 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Дата заявки</div>
                            <div className="col-span-2 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal"></div>
                        </div>
                        <div className="text-white hover:bg-gray-750 grid grid-cols-12 items-start">
                            <div className="col-span-10 grid grid-cols-10">
                                <div className="col-span-1 h-20 flex items-center px-4 font-normal text-[20px] leading-[100%] tracking-normal ">1</div>
                                <div className="col-span-3 h-20 flex items-center px-4 font-normal text-[20px] leading-[100%] tracking-normal ">Екатерина</div>
                                <div className="col-span-2 h-20 flex items-center px-4 font-normal text-[20px] leading-[100%] tracking-normal not-italic ">Поставщик</div>
                                <div className="col-span-2 h-20 flex items-center px-4 font-normal text-[20px] leading-[100%] tracking-normal not-italic ">61489415471</div>
                                <div className="col-span-2 h-20 flex items-center px-4 font-normal not-italic text-[20px] leading-[100%] tracking-normal ">22.05.2025</div>
                                <textarea className='col-span-10 bg-[#71707080] outline-none h-[438px] p-4.5 text-[#FFFFFF] ' name="" id="" placeholder='ИНФОРМАЦИЯ СОГЛАСНО ПРОФЕЛЮУЧАСТНИКОВ'></textarea>
                            </div>
                            <div className='col-span-2'>

                                <div className="col-span-2 flex flex-col items-start px-4 text-right gap-y-3 mt-4 ">
                                    <button className="font-normal not-italic text-base leading-[100%] tracking-normal bg-[#71707099] w-40 h-11 rounded-[25px]">
                                        редактировать
                                    </button>
                                    <button className="font-normal not-italic text-base leading-[100%] tracking-normal bg-[#71707099] w-40 h-11 rounded-[25px]">
                                        публиковать
                                    </button>
                                    <button className="font-normal not-italic text-base leading-[100%] tracking-normal bg-[#71707099] w-40 h-11 rounded-[25px]">
                                        отклонить
                                    </button>
                                    <button className="font-normal not-italic text-base leading-[100%] tracking-normal bg-[#D7B7068A] w-40 h-11 rounded-[25px]">
                                        в архив
                                    </button>

                                </div>
                            </div>
                        </div>

                    </div>

                </div>
            </div>
        </div>
    )
}
