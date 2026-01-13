'use client'
import React, { useEffect, useState } from 'react'
import { IoIosArrowBack, IoMdExit } from 'react-icons/io'
import GlassButton1 from '../ui/GlassButton1'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function LeftPanel({ }) {
  const pathname = usePathname()
  const router = useRouter()
  const [userData, setUserData] = useState({ name: 'Username', email: 'info@mail.ru' })

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
    },
    {
      name: 'ПОЛЬЗОВАТЕЛИ',
      path: '/users',
      icon: null
    },
    {
      name: 'События',
      path: '/all-events',
      icon: null
    }
  ]

  // Component yuklanganda foydalanuvchi ma'lumotlarini o'qish
  useEffect(() => {
    const loadUserData = () => {
      try {
        const storedUserData = localStorage.getItem('userData')
        if (storedUserData) {
          const parsedData = JSON.parse(storedUserData)
          setUserData({
            name: parsedData.full_name || parsedData.username || 'Пользователь',
            email: parsedData.email || 'info@mail.ru'
          })
        }
      } catch (error) {
        console.error('Ошибка при загрузке данных пользователя:', error)
      }
    }

    loadUserData()
  }, [])

  // Orqaga qaytish funksiyasi
  const handleBack = () => {
    router.back()
  }

  // Chiqish funksiyasi - yangilangan
  const handleLogout = () => {

    try {
      // Barcha token va ma'lumotlarni o'chirish
      localStorage.removeItem('accessToken')
      localStorage.removeItem('refreshToken')
      localStorage.removeItem('userData')

      // Session storage ni tozalash
      sessionStorage.clear()

      // Cookies larni o'chirish (agar mavjud bo'lsa)
      const cookies = document.cookie.split(";")
      for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i]
        const eqPos = cookie.indexOf("=")
        const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT;path=/"
      }

      // Xabar berish
      toast.success('Вы успешно вышли из системы', {
        duration: 2000,
        position: 'top-center'
      })

      // Login sahifasiga yo'naltirish
      setTimeout(() => {
        router.push('/login')
      }, 1000)

    } catch (error) {
      console.error('Ошибка при выходе из системы:', error)
      toast.error('Ошибка при выходе из системы')

      // Xato bo'lsa ham login sahifasiga yo'naltirish
      setTimeout(() => {
        router.push('/login')
      }, 1000)
    }
  }

  // Hozirgi sahifani aniqlash
  const isActive = (itemPath) => {
    if (itemPath === '/') {
      return pathname === '/'
    }
    return pathname.startsWith(itemPath)
  }

  return (
    <div className="relative min-h-screen max-h-full flex flex-col justify-between w-full text-white">
      {/* Orqaga tugmasi */}
      <div
        className="absolute top-10 left-[30px] cursor-pointer hover:opacity-80 transition-opacity group"
        onClick={handleBack}
        title="Назад"
      >
        <IoIosArrowBack size={36} className="group-hover:scale-110 transition-transform" />
      </div>

      {/* Chiqish tugmasi */}
      <div
        className="absolute top-10 right-[30px] cursor-pointer hover:opacity-80 transition-opacity group"
        onClick={handleLogout}
        title="Выйти из системы"
      >
        <IoMdExit size={36} className="group-hover:scale-110 transition-transform" />
      </div>

      {/* User profili */}
      <div className="flex flex-col items-center pt-[54px]">
        <div className="w-[65px] h-[65px] rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 mb-[14px] flex items-center justify-center text-white font-bold text-xl">
          {userData.name.charAt(0).toUpperCase()}
        </div>
        <h2 className="text-[22px] font-normal leading-none max-w-[200px] truncate">
          {userData.name}
        </h2>
        <p className="text-[18px] opacity-80 max-w-[200px] truncate">
          {userData.email}
        </p>
      </div>

      {/* Menu buttonlari */}
      <div className="flex flex-col gap-[22px] mt-[86px] pl-[30px] pr-[15px]">
        {menuItems.map((item) => (
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
              active={isActive(item.path)}
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
          className="hover:opacity-90 transition-opacity"
        />
      </div>
    </div>
  )
}