import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import PhoneInput from '../ui/input'
import GlassButton from '../ui/GlassButton'

export default function Parol() {
  return (
    <div> 
            <div className='max-w-7xl m-auto  '>
    <div className="relative flex flex-col  items-center    text-white px-8">
          <div className="absolute top-26  left-8 text-3xl cursor-pointer  "><IoIosArrowBack size={40} /></div>
    
           
          <img src="/icons/logo.svg" alt="a"/>
          
          <p className="ont-[JejuMyeongjo] mb-20 text-[24px] leading-[24px] tracking-normal text-center">
          Введите ключ доступа
          </p>
       <PhoneInput text={'Пароль'} />
       <div className='mt-12'>
       <GlassButton text={'ДАЛЛЕ'}/>
       </div>
    
        
        </div>
            </div>
    </div>
  )
}
