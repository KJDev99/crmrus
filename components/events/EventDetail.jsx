'use client'
import React, { useState, useEffect } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import { format, parseISO } from 'date-fns'
import { ru } from 'date-fns/locale'
import axios from 'axios'

export default function EventDetail({ setStep, selectedEvent }) {
    const [eventDetail, setEventDetail] = useState(null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (selectedEvent) {
            fetchEventDetail()
        }
    }, [selectedEvent])

    const fetchEventDetail = async () => {
        if (!selectedEvent?.id) return

        try {
            setLoading(true)
            const token = localStorage.getItem('access_token')
            if (!token) {
                window.location.href = '/login'
                return
            }

            const response = await axios.get(
                `https://api.reiting-profi.ru/api/v1/events/upcoming-events/${selectedEvent.id}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            )

            setEventDetail(response.data)
        } catch (error) {
            console.error('Event detail yuklashda xatolik:', error)
            // Agar detail olishda xatolik bo'lsa, selectedEvent ni ko'rsatamiz
            setEventDetail(selectedEvent)
        } finally {
            setLoading(false)
        }
    }

    const formatDate = (dateString) => {
        try {
            const date = parseISO(dateString)
            return format(date, 'dd MMMM yyyy, HH:mm', { locale: ru })
        } catch (error) {
            return dateString
        }
    }

    if (loading || !eventDetail) {
        return (
            <div>
                <div className="text-white flex justify-between items-center mt-[0px]">
                    <button onClick={() => setStep(2)} className="cursor-pointer">
                        <IoIosArrowBack size={40} />
                    </button>
                    <img src="/icons/logo.svg" alt="logo" />
                    <div>
                        <img src="/icons/share.svg" alt="share" />
                    </div>
                </div>
                <div className="text-center text-white py-20">
                    <p>Ma'lumotlar Загрузка...</p>
                </div>
            </div>
        )
    }

    return (
        <div>
            <div className="text-white flex justify-between items-center mt-[0px]">
                <button onClick={() => setStep(2)} className="cursor-pointer">
                    <IoIosArrowBack size={40} />
                </button>
                <img src="/icons/logo.svg" alt="logo" />
                <div>
                    <img src="/icons/share.svg" alt="share" className="cursor-pointer" />
                </div>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
                <div className="">
                    <div className="flex mb-6">
                        <div className='w-[125px] h-[100px] card_img flex-shrink-0'>
                            {eventDetail.poster ? (
                                <img
                                    src={eventDetail.poster}
                                    alt={eventDetail.organization_name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-full rounded-lg flex items-center justify-center">
                                    <span className="text-white text-2xl uppercase font-bold">
                                        {eventDetail.organization_name ? eventDetail.organization_name.charAt(0) : 'E'}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col border-b border-b-[#FFFFFF91] pl-6 ml-4 flex-grow">
                            <h2 className='mb-0.5 text-[#FFFFFF] text-[22px]'>
                                {eventDetail.organization_name || 'Название организации'}
                            </h2>
                            <div className='w-full h-0.25 bg-[#FFFFFF4F]'></div>
                            <p className='text-[#B79F15] uppercase text-sm leading-[100%] mt-3'>
                                {eventDetail.event_type_display || 'МЕРОПРИЯТИЕ'}
                            </p>
                        </div>
                    </div>

                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>Анонс мероприятия</h2>
                    <div className='text-lg border-y border-[#FFFFFF91] px-2 py-4 text-[#FFFFFF] space-y-3'>
                        <p><strong>Дата и время:</strong> {formatDate(eventDetail.event_date)}</p>
                        <p><strong>Место проведения:</strong> {eventDetail.event_location || 'Не указано'}</p>
                        <p><strong>Город:</strong> {eventDetail.city || 'Не указан'}</p>
                        {eventDetail.registration_phone && (
                            <p><strong>Телефон для записи:</strong> {eventDetail.registration_phone}</p>
                        )}
                    </div>

                    {eventDetail.announcement && (
                        <>
                            <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>Описание мероприятия</h2>
                            <div className='text-lg px-2 py-4 text-[#FFFFFF] bg-white/5 rounded-lg'>
                                {eventDetail.announcement}
                            </div>
                        </>
                    )}

                    {eventDetail.about_event && (
                        <>
                            <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>О мероприятии</h2>
                            <div className='text-lg px-2 py-4 text-[#FFFFFF] bg-white/5 rounded-lg'>
                                {eventDetail.about_event}
                            </div>
                        </>
                    )}

                    <div className='mt-6 text-[#FFFFFF] px-2 py-2 text-sm opacity-80'>
                        <p>Статус: {eventDetail.status_display || 'Не указан'}</p>
                        {eventDetail.created_at && (
                            <p>Создано: {new Date(eventDetail.created_at).toLocaleDateString('ru-RU')}</p>
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