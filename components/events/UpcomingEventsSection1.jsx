'use client'
import React, { useState } from 'react'
import Event from './Event'
import Calendar from './Calendar'
import AllEvents from './AllEvents'
import EventDetail from './EventDetail'

export default function UpcomingEventsSection1() {
  const [step, setStep] = useState(0)
  return (
    <div className='max-w-7xl m-auto  '>

      {
        step === 0 ? (
          <Event setStep={setStep} />
        ) : step === 1 ? (
          <Calendar setStep={setStep} />
        ) : step === 2 ? (
          <AllEvents setStep={setStep} />
        ) :
          <EventDetail setStep={setStep} />
      }
    </div>
  )
}
