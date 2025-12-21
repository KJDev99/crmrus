'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import PhoneInput from '../ui/input'
import GlassButton from '../ui/GlassButton'
import Enter from './Phone'
import Parol from './Parol'
import UpcomingEventsSection1 from './UpcomingEventsSection1'

export default function LoginBox() {
    const [step, setStep] = useState(0)

    let content;
    switch (step) {
        case 0: content = <Enter setStep={setStep} step={step} />; break;
        case 1: content = <Parol setStep={setStep} step={step} />; break;
        case 2: content = <UpcomingEventsSection1 setStep={setStep} step={step} />; break;
        default: content = <p>NOT FOUND {step}</p>;
    }

    return (
        <div className='relative flex flex-col items-center text-white'>
            <div className="absolute top-26  left-[120px] text-3xl cursor-pointer  ">
                <IoIosArrowBack size={40} onClick={() => {
                    step != 0 && setStep(prev => prev - 1)
                }} />
            </div>

            <Image width={308} height={308} src="/icons/logo.svg" alt="a" />

            {content}

            {
                step != 0 && step != 1 && <div className="fixed right-[112px] bottom-[112px]  text-white ">
                    <Image src={'/icons/star.svg'} alt='star' width={50} height={50} />
                </div>
            }
            <div className="fixed left-[112px] bottom-[112px]  text-white ">
                <GlassButton text={'ДАЛЛЕ'} click={() => { setStep(prev => prev + 1) }} />
            </div>
        </div>
    )
}
