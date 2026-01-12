import React from 'react'
import PhoneInput from '../ui/input'

export default function Enter({ phone, setPhone, error }) {
  return (
    <div className='px-4 sm:px-0 w-full'>
      <div className="relative flex flex-col items-center text-white px-4 sm:px-8">
        <p className="font-[JejuMyeongjo] mb-12 sm:mb-20 text-lg sm:text-2xl md:text-[24px] leading-tight sm:leading-[24px] tracking-normal text-center">
          Вход в личный кабинет<br />
          <span className="font-semibold">только</span><br />
          для членов Сообществa
        </p>

        <PhoneInput
          text={'Телефон'}
          isPhone={true}
          value={phone}
          onChange={setPhone}
        />

        {error && (
          <p className="text-red-400 text-center mt-3 sm:mt-4 text-base sm:text-[18px]">
            {error}
          </p>
        )}

        <a
          target='_blank'
          href='https://r-profi.taplink.ws'
          className="font-jeju font-normal text-lg sm:text-2xl md:text-[24px] mb-30 leading-[100%] tracking-[0%] text-center mt-24 sm:mt-[136px]"
        >
          Если вы хотите стать<br />
          членом Сообществa —<br />
          <span className="underline">свяжитесь с нами</span>
        </a>
      </div>
    </div>
  )
}