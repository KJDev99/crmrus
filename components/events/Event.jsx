'use client'
import React, { useState, useEffect } from 'react'
import GlassButton1 from '../ui/GlassButton1'
import { IoIosArrowBack } from 'react-icons/io'
import { MdLocationCity } from 'react-icons/md'
import Link from 'next/link'
import axios from 'axios'

export default function Event({ setStep, eventsData, onCitySelect }) {
    const [uniqueCities, setUniqueCities] = useState([])
    const [loading, setLoading] = useState(false)
    const [showDropdown, setShowDropdown] = useState(false)

    useEffect(() => {
        if (eventsData) {
            extractUniqueCities();
        }
    }, [eventsData])

    const extractUniqueCities = () => {
        if (!eventsData?.results) return;

        const citiesSet = new Set();
        eventsData.results.forEach(event => {
            if (event.city) {
                citiesSet.add(event.city);
            }
        });

        const citiesArray = Array.from(citiesSet).sort();
        setUniqueCities(citiesArray);
    }

    const fetchCities = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await axios.get(
                'https://api.reiting-profi.ru/api/v1/events/upcoming-events/',
                {
                    params: { available_dates: true },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            // Response format: {"city": "Москва", "dates": [...]}
            // Lekin biz shaharlarni eventlardan olamiz
            if (response.data && Array.isArray(response.data)) {
                const cities = response.data.map(item => item.city);
                setUniqueCities([...new Set(cities)].sort());
            }
        } catch (error) {
            console.error('Shaharlarni yuklashda xatolik:', error);
        } finally {
            setLoading(false);
        }
    }

    const handleCitySelect = (city) => {
        onCitySelect(city);
        setShowDropdown(false);
    }

    return (
        <div className='relative'>
            <div className="text-white flex justify-between items-center mt-[0px]">
                <Link href={'/role'} className="cursor-pointer">
                    <IoIosArrowBack size={40} />
                </Link>
                <img src="/icons/logo.svg" alt="logo" />
                <div></div>
            </div>

            <div className='text-center mt-[0]'>
                <p className="font-normal text-white text-[20px] leading-[100%] tracking-[0%] text-center uppercase underline hover:cursor-pointer">
                    Ближайшие мероприятия
                </p>

                <div className='mt-30 flex justify-center'>
                    <div className="relative">
                        <MdLocationCity className="absolute left-4 top-1/2 transform -translate-y-1/2 text-white/70" size={24} />
                        <button
                            onClick={() => setShowDropdown(!showDropdown)}
                            className={`
                w-80 md:w-120 h-[60px] md:h-[80px]
                rounded-2xl transition-all duration-200
                bg-glass2 text-white hover:bg-white/40
                text-[20px] md:text-[26px] font-medium
                flex items-center justify-center 
              `}
                        >
                            {loading ? 'Загрузка...' : 'Выберете город'}
                        </button>

                        {showDropdown && uniqueCities.length > 0 && (
                            <div className="absolute top-full left-0 right-0 mt-2 bg-glass2 rounded-2xl z-10 max-h-60 overflow-y-auto">
                                {uniqueCities.map((city) => (
                                    <button
                                        key={city}
                                        onClick={() => handleCitySelect(city)}
                                        className="w-full text-left px-5 py-4 text-white hover:bg-white/20 transition-all text-lg"
                                    >
                                        {city}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] mb-[64px] flex justify-center">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-[50px]">
                    ★
                </div>
            </div>
        </div>
    )
}