import React from 'react'
import PhoneInput from '../ui/input'
export default function Enter({ step, setStep }) {
  return (
    <div className=' '>
      <div className="relative flex flex-col  items-center    text-white px-8">

        <p className="ont-[JejuMyeongjo] mb-20 text-[24px] leading-[24px] tracking-normal text-center">
          Вход в личный кабинет<br />
          <span className="font-semibold">только</span><br />
          для членов клуба
        </p>
        <PhoneInput text={'Телефон'} isPhone={true} />


        <a target='_blank' href='https://r-profi.taplink.ws' className="font-jeju font-normal text-[24px] leading-[100%] tracking-[0%] text-center mt-[136px] ">
          Если вы хотите стать<br />
          членом Клуба —<br />
          <span className="underline">свяжитесь с нами</span>
        </a>
      </div>
    </div>
  )
}
