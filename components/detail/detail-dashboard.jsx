'use client'
import React, { useState } from 'react'
import LeftPanel from '../home/left-panel'
import DetailUsers from './detail-users'

export default function DetailDashboard() {

    return (
        <div className='grid grid-cols-4 gap-4 w-full max-md:grid-cols-1'>
            <div className="col-span-1 w-full bg-[#0D1949]">
                <LeftPanel />
            </div>
            <div className="col-span-3 overflow-auto max-md:col-span-1">
                <DetailUsers />
            </div>
        </div>
    )
}
