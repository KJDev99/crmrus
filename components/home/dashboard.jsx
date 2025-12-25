'use client'
import React, { useState } from 'react'
import LeftPanel from './left-panel'
import RightPanel from './right-panel'

export default function Dashboard() {
    const [step, setStep] = useState(0)

    return (
        <div className='flex gap-[30px] w-full'>
            <div className="flex-shrink-0">
                <LeftPanel step={step} setStep={setStep} />
            </div>
            <div className="flex-1 overflow-auto">
                <RightPanel setStep={setStep} step={step} />
            </div>
        </div>
    )
}
