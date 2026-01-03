import React from 'react'
import ReviewItem from '../ui/ReviewItem'
import { FaSearch } from 'react-icons/fa'
import { BiSortAlt2 } from 'react-icons/bi'

export default function Reviews() {
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
      <ReviewItem status="positive" />
      <ReviewItem status="constructive" />
      <ReviewItem status="positive" />
    </div>
  )
}
