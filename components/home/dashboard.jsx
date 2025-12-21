'use client'
import React, { useState } from 'react'
import LeftPanel from './left-panel'
import RightPanel from './right-panel'

export default function Dashboard() {
    const [step, setStep] = useState(0)



    return (
        <div className='grid grid-cols-4 gap-x-[30px]'>
            <div className="">
                <LeftPanel step={step} setStep={setStep} />
            </div>
            <div className="col-span-3">
                <RightPanel setStep={setStep} step={step} />
            </div>
        </div>
    )
}
