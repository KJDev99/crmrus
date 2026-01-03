'use client'
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import GlassButton1 from '../ui/GlassButton1'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'

export default function LeftPanel({ }) {
  const pathname = usePathname()
  const router = useRouter()

  // Buttonlar va ularning linklari
  const menuItems = [
    {
      name: 'АНКЕТЫ',
      path: '/',
      icon: null
    },
    {
      name: 'ОТЗЫВЫ',
      path: '/reviews',
      icon: null
    },
    {
      name: 'РЕЙТИНГ',
      path: '/rating',
      icon: null
    },
    {
      name: 'ОТЧЕТЫ',
      path: '/reports',
      icon: null
    },
    {
      name: 'ОПЛАТЫ',
      path: '/payments',
      icon: null
    }
  ]

  // Orqaga qaytish funksiyasi
  const handleBack = () => {
    router.back()
  }

  // Hozirgi sahifani aniqlash
  const getCurrentStep = () => {
    const currentPath = pathname
    const index = menuItems.findIndex(item => currentPath.startsWith(item.path))
    return index !== -1 ? index : 0
  }

  const currentStep = getCurrentStep()

  return (
    <div className="relative min-h-screen max-h-full flex flex-col justify-between w-full bg-linear-to-b from-[#0B1A4A] to-[#081437] text-white">
      {/* Orqaga tugmasi */}
      <div
        className="absolute top-10 left-[30px] cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleBack}
      >
        <IoIosArrowBack size={36} />
      </div>

      {/* User profili */}
      <div className="flex flex-col items-center pt-[54px]">
        <div className="w-[65px] h-[65px] rounded-full bg-[#D9D9D9] mb-[14px]" >
          {/* Bu yerga user avatar qo'yishingiz mumkin */}
        </div>
        <h2 className="text-[22px] font-normal leading-none">Username</h2>
        <p className="text-[18px] opacity-80">info@mail.ru</p>
      </div>

      {/* Menu buttonlari */}
      <div className="flex flex-col gap-[22px] mt-[86px] pl-[30px] pr-[15px]">
        {menuItems.map((item, idx) => (
          <Link
            key={item.name}
            href={item.path}
            className="block no-underline"
          >
            <GlassButton1
              w="w-full"
              h="h-[62px]"
              text={item.name}
              textsize="text-[26px]"
              active={currentStep === idx}
            />
          </Link>
        ))}
      </div>

      {/* LOGO */}
      <div className="w-full flex justify-center mb-8">
        <Image
          src="/icons/logo.svg"
          width={190}
          height={190}
          alt="logo"
          priority
        />
      </div>


    </div>
  )
}