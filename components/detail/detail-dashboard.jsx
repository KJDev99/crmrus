'use client'
import React, { useState } from 'react'
import LeftPanel from '../home/left-panel'
import DetailUsers from './detail-users'

export default function DetailDashboard() {

    return (
        <div className='grid grid-cols-4 gap-4 w-full'>
            <div className="col-span-1 w-full">
                <LeftPanel />
            </div>
            <div className="col-span-3 overflow-auto">
                <DetailUsers />
            </div>
        </div>
    )
}
