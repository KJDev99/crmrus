import LeftPanel from '@/components/home/left-panel'
import Reviews from '@/components/page/Reviews'
import React from 'react'

export default function page() {
    return (
        <div className='grid grid-cols-4 gap-4 w-full'>
            <div className="col-span-1 w-full">
                <LeftPanel />
            </div>
            <div className="col-span-3 overflow-auto">
                <Reviews />
            </div>
        </div>
    )
}
