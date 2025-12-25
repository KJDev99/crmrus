import React from 'react'
import Anketa from '../page/Anketa'
import Reviews from '../page/Reviews'
import Rating from '../page/Rating'
import Reports from '../page/Reports'
import Payments from '../page/Payments'
import { FaSearch } from "react-icons/fa";

export default function RightPanel({ step = 0 }) {
    const renderContent = () => {
        switch (step) {
            case 0:
                return <Anketa />
            case 1:
                return <Reviews />
            case 2:
                return <Rating />
            case 3:
                return <Reports />
            case 4:
                return <Payments />
            default:
                return <Anketa />
        }
    }

    return (
        <div>
                  <div className="px-4 py-3 flex items-center gap-3 ml-[78px]">
                    <div className='relative'>

        <input
          type="text"
          placeholder="Найти анкету по ID, телефон, название организации, ФИ человека"
          className="   w-[880px] outline-none h-[37px] bg-[#B7B2B299] rounded-[16px] px-[19px] text-[#FFF] font-normal not-italic text-[16px] leading-[100%] tracking-normal"
        />
        <button className="text-white right-[14px] absolute top-1">
          <FaSearch size={24} />
        </button>
          </div>
        <button className="text-gray-400 hover:text-white">
         
        </button>
        
      </div>
     
            {renderContent()}
        </div>
    )
}
