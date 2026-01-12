'use client';
import React, { useEffect, useState } from 'react'
import { IoIosArrowBack } from "react-icons/io";
import { CiLock } from "react-icons/ci";
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import axios from 'axios';
import { FaRegUserCircle } from 'react-icons/fa';


export default function HomeRestriction() {
  const router = useRouter();
  const [roles, setRoles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // LocalStoragedan token ni tekshirish
    const token = localStorage.getItem('access_token');

    if (!token) {
      // Token bo'lmasa, login sahifasiga yo'naltirish
      router.push('/login');
      return;
    }

    // Role'lar yuklash
    fetchRoles(token);
  }, [router]);

  const fetchRoles = async (token) => {
    try {
      const response = await axios.get('https://api.reiting-profi.ru/api/v1/accounts/roles/', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      // Faqat "Media" (id:4) dan tashqari role'lar va is_locked maydoni bor elementlar
      const filteredRoles = response.data.filter((role) =>
        role.id !== 4 && role.hasOwnProperty('is_locked')
      );

      setRoles(filteredRoles);
    } catch (error) {
      console.error('Role yuklashda xatolik:', error);
      // Xatolik yuz bersa, token noto'g'ri bo'lishi mumkin, login sahifasiga qaytish
      localStorage.removeItem('access_token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  };

  // Role nomi uchun route'ni aniqlash
  const getRoleRoute = (roleName) => {
    switch (roleName.toLowerCase()) {
      case 'поставщик':
        return '/role/supplier';
      case 'ремонт':
        return '/role/repair';
      case 'дизайн':
        return '/role/design';
      default:
        return '/';
    }
  };

  // Role nomini chiroyli ko'rinishga o'tkazish
  const getDisplayName = (roleName) => {
    switch (roleName.toLowerCase()) {
      case 'поставщик':
        return 'Поставщики';
      case 'ремонт':
        return 'Ремонт';
      case 'дизайн':
        return 'Дизайн';
      default:
        return roleName;
    }
  };

  if (loading) {
    return (
      <div className='max-w-7xl m-auto px-4 sm:px-6 md:px-8 max-md:w-full'>
        <div className="text-white flex justify-between items-center mt-[0px] px-4 sm:px-0">
          <div className="cursor-pointer">
            <IoIosArrowBack size={32} className='sm:size-[40px] opacity-0' />
          </div>
          <img src="/icons/logo.svg" alt="logo" />
          <a target='_blank' href='https://r-profi.taplink.ws'>
            <img src="/icons/support.svg" alt="support" className='w-10 h-10 sm:w-14 sm:h-14' />
          </a>
        </div>
        <div className='text-center mt-12 sm:mt-20'>
          <p className='text-white text-base sm:text-xl'>Загрузка...</p>
        </div>
      </div>
    );
  }

  return (
    <div className='max-w-7xl m-auto px-4 sm:px-6 md:px-8 max-md:w-full'>
      <div className="text-white flex justify-between items-center mt-[0px] px-4 sm:px-0">
        <div className="cursor-pointer">
          <IoIosArrowBack size={32} className='sm:w-10 sm:h-10 opacity-0' />
        </div>
        <img src="/icons/logo.svg" alt="logo" className='w-24 sm:w-auto' />
        <div className="flex items-center gap-x-2 sm:gap-x-3">

          <a target='_blank' href='https://r-profi.taplink.ws'>
            <img src="/icons/support.svg" alt="support" className='w-10 h-10 sm:w-14 sm:h-14' />
          </a>

          <Link href={'/role/settings'}>
            <FaRegUserCircle size={28} className='sm:w-9 sm:h-9' />
          </Link>

        </div>
      </div>

      <div className='text-center mt-4 sm:mt-[13px] flex flex-col items-center max-md:w-full'>
        {roles.map((role) => (
          <div key={role.id} className='mt-2 sm:mt-3 first:mt-0 max-md:w-full'>
            {role.is_locked ? (
              // Qulflangan bo'lsa - faqat button, Link emas
              <button
                className={`
                  w-full sm:w-120 h-16 sm:h-20 text-lg sm:text-[26px] px-4
                  rounded-2xl transition-all duration-200
                  bg-glass2 text-white hover:bg-white/40 relative
                  cursor-not-allowed opacity-80
                `}
                disabled
              >
                {getDisplayName(role.name)}
                <CiLock className='absolute right-4 sm:right-15 top-1/2 -translate-y-1/2 sm:w-8 sm:h-8' size={24} />
              </button>
            ) : (
              // Qulflanmagan bo'lsa - Link bilan
              <Link href={getRoleRoute(role.name)}>
                <button
                  className={`
                    w-full sm:w-120 h-16 sm:h-20 text-lg sm:text-[26px] px-4
                    rounded-2xl transition-all duration-200
                    bg-glass2 text-white hover:bg-white/40
                  `}
                >
                  {getDisplayName(role.name)}
                </button>
              </Link>
            )}
          </div>
        ))}
      </div>

      <div className="relative w-full max-w-[1200px] mx-auto mt-10 sm:mt-[79px] mb-12 sm:mb-[64px] flex justify-center px-4 sm:px-0">
        <div className="text-center text-white space-y-3 sm:space-y-4">
          <Link href={'/events'} className="font-normal text-sm sm:text-[20px] leading-[100%] tracking-[0%] text-center uppercase hover:underline hover:cursor-pointer block">
            Ближайшие мероприятия
          </Link>

          <div>
            <Link href={'/role/media'} className="font-normal text-sm sm:text-[20px] leading-[100%] tracking-[0%] text-center hover:underline hover:cursor-pointer block">
              Интерьерные журналы
            </Link>
          </div>

          <p className="font-[JejuMyeongjo] font-normal text-xs sm:text-[16px] leading-[120%] sm:leading-[100%] tracking-[0%] text-center mt-8 sm:mt-[52px]">
            ИП Кудряшова М.А<br />
            и оферта с<br />
            конфиденциальностью
          </p>
        </div>
        <div className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-[50px] hidden sm:block">
          ★
        </div>
      </div>
    </div>
  )
}