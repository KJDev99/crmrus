import React from 'react'
import PhoneInput from '../ui/input'


export default function Parol({ setStep }) {
  return (
    <div>
      <div className='max-w-7xl m-auto  '>
        <div className="relative flex flex-col  items-center    text-white px-8">
          <p className="ont-[JejuMyeongjo] mb-20 text-[24px] leading-[24px] tracking-normal text-center">
            Введите ключ доступа
          </p>
          <PhoneInput text={'Пароль'} />
        </div>
      </div>
    </div>
  )
}
