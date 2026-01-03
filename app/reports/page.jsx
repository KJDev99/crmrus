import LeftPanel from '@/components/home/left-panel'
import Reports from '@/components/page/Reports'
import React from 'react'

export default function page() {
    return (
        <div className='grid grid-cols-4 gap-4 w-full'>
            <div className="col-span-1 w-full bg-[#0D1949]">
                <LeftPanel />
            </div>
            <div className="col-span-3 overflow-auto">
                <Reports />
            </div>
        </div>
    )
}
