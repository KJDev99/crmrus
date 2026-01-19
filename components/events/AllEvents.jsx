'use client'
import React, { useState, useEffect } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import axios from 'axios'

export default function AllEvents({ setStep, selectedCity, selectedDate, onEventSelect }) {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (selectedCity && selectedDate) {
            fetchEventsForDate()
        }
    }, [selectedCity, selectedDate])

    const fetchEventsForDate = async () => {
        try {
            setLoading(true)
            const token = localStorage.getItem('access_token')
            if (!token) {
                window.location.href = '/login'
                return
            }

            const response = await axios.get(
                'https://api.reiting-profi.ru/api/v1/events/upcoming-events/',
                {
                    params: {
                        city: selectedCity,
                        event_date: selectedDate,
                        ordering: 'event_date'
                    },
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )

            setEvents(response.data.results)
        } catch (error) {
            console.error('Eventlarni yuklashda xatolik:', error)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString)
            return format(date, 'dd MMMM yyyy', { locale: ru })
        } catch (error) {
            return dateString
        }
    }

    const formatTime = (dateString) => {
        try {
            const date = parseISO(dateString)
            return format(date, 'HH:mm')
        } catch (error) {
            return ''
        }
    }

    return (
        <div>
            <div className="text-white flex justify-between items-center mt-[0px]">
                <button onClick={() => setStep(1)} className="cursor-pointer">
                    <IoIosArrowBack size={40} />
                </button>
                <img src="/icons/logo.svg" alt="logo" />
                <div></div>
            </div>

            <div className='mt-[0]'>
                <p className="font-normal text-[#B79F15] text-[24px] mb-14 leading-[100%] tracking-[0%] text-center uppercase underline hover:cursor-pointer">
                    {formatDate(selectedDate)}
                </p>

                {loading ? (
                    <div className="text-center text-white py-10">
                        <p>Загрузка...</p>
                    </div>
                ) : events.length === 0 ? (
                    <div className="text-center text-white py-10">
                        <p>мероприятий нет</p>
                    </div>
                ) : (
                    <div className="max-w-xl mx-auto space-y-6">
                        {events.map((event) => (
                            <div
                                key={event.id}
                                onClick={() => onEventSelect(event)}
                                className="flex mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                            >
                                <div className='w-[120px] h-[100px] card_img flex-shrink-0'>
                                    {event.poster ? (
                                        <img
                                            src={event.poster}
                                            alt={event.organization_name}
                                            className="w-full h-full object-cover rounded-lg"
                                        />
                                    ) : (
                                        <div className="w-full h-full rounded-lg flex items-center justify-center">
                                            <span className="text-white text-2xl uppercase font-bold">
                                                {event.organization_name ? event.organization_name.charAt(0) : 'E'}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col border-b border-b-[#FFFFFF91] pl-6 ml-4 flex-grow">
                                    <h2 className='mb-0.5 text-[#FFFFFF] text-[22px]'>
                                        {event.organization_name || 'Название организации'}
                                    </h2>
                                    <p className='text-sm text-[#FFFFFF] mt-1'>
                                        {event.city || ''} {event.event_location ? `, ${event.event_location}` : ''}
                                    </p>


                                    {event.announcement && (
                                        <p className='text-[#B79F15] text-sm mt-2 line-clamp-2'>
                                            {event.announcement}
                                        </p>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] mb-[64px] flex justify-center">
                <Link href={'/userinfo'}>
                    <div className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-[50px] hidden sm:block">
                        ★
                    </div>
                </Link>
            </div>
        </div>
    )
}