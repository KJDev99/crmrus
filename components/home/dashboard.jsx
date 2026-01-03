import React from 'react'
import LeftPanel from './left-panel'
import RightPanel from './right-panel'

export default function Dashboard() {
    return (
        <div className='grid grid-cols-4 gap-4 w-full'>
            <div className="col-span-1 w-full bg-[#0D1949]">
                <LeftPanel />
            </div>
            <div className="col-span-3 overflow-auto">
                <RightPanel />
            </div>
        </div>
    )
}
