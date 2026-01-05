import React from 'react'
import GlassButton from '../ui/GlassButton1'
import Link from 'next/link'
import { IoIosArrowBack } from 'react-icons/io'

export default function DesignBox() {
    return (
        <div className='max-w-7xl m-auto  '>
            <div className=" text-white flex justify-between items-center mt-[0px]">
                <Link href={'/role'} className=" cursor-pointer  ">
                    <IoIosArrowBack size={40} className='' />
                </Link>
                <img src="/icons/logo.svg" alt="a" />
                <div></div>
            </div>
            <div className='text-center mt-[13px] flex flex-col items-center'>
                <h2 className='text-xl text-white mb-4'>ДИЗАЙН</h2>

                <div className='mt-3'>
                    <GlassButton w="w-[350px] rounded-full text-left px-5"
                        h="h-[58px]" textsize="text-[17px]" text={'Выберете основную котегорию'} />
                </div>
                <div className='mt-3'>
                    <GlassButton w="w-[350px] rounded-full text-left px-5"
                        h="h-[58px]" textsize="text-[17px]" text={'Выберете город'} />
                </div>
                <div className='mt-3'>
                    <GlassButton w="w-[350px] rounded-full text-left px-5"
                        h="h-[58px]" textsize="text-[17px]" text={'Выберете сегмент'} />
                </div>

            </div>
            <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] mb-[64px] flex justify-center">

                <GlassButton w="w-[180px] rounded-full"
                    h="h-[40px]" textsize="text-sm" text={'ИСКАТЬ'} />
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-[50px]">
                    ★
                </div>

            </div>
        </div>
    )
}
