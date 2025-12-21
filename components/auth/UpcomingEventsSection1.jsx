import React from 'react'
import GlassButton from '../ui/GlassButton'
import { IoIosArrowBack } from 'react-icons/io'

export default function UpcomingEventsSection1() {
  return (
    <div className='max-w-7xl m-auto  '>

      <div className='text-center mt-[13px]'>

        <div>
          <h2 className='font-[JejuMyeongjo] font-normal text-[24px] leading-[100%] tracking-[0%] text-center text-white underline hover:cursor-pointer' >БЛИЖАЙШИЕ МЕРОПРИЯТИЯ </h2>
        </div>
        <div className='mt-12'>
          <GlassButton text={'Выберете город'} />
        </div>

      </div>

    </div>
  )
}
