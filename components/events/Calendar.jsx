'use client'
import React, { useState, useEffect } from "react"
import {
  addMonths,
  subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
  parseISO,
} from "date-fns"
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io"
import { ru } from "date-fns/locale"
import { MdCalendarToday } from 'react-icons/md'
import axios from 'axios'
import Link from "next/link"

export default function Calendar({ setStep, selectedCity, onDateSelect }) {
  const [currentMonth, setCurrentMonth] = useState(new Date())
  const [eventDates, setEventDates] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (selectedCity) {
      fetchEventDatesForCity();
    }
  }, [selectedCity, currentMonth])

  const fetchEventDatesForCity = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem('access_token')
      if (!token) {
        window.location.href = '/login'
        return
      }

      // Joriy oyning boshi va oxiri
      const monthStart = startOfMonth(currentMonth)
      const monthEnd = endOfMonth(currentMonth)

      // API dan o'sha oydagi eventlarni olish
      const response = await axios.get(
        'https://api.reiting-profi.ru/api/v1/events/upcoming-events/',
        {
          params: {
            city: selectedCity,
            ordering: 'event_date',
          },
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      )

      // Event sanalarini chiqarib olish
      const dates = response.data.results.map(event => {
        const eventDate = parseISO(event.event_date)
        return format(eventDate, 'yyyy-MM-dd')
      })

      setEventDates([...new Set(dates)]) // Takrorlangan sanalarni olib tashlash
    } catch (error) {
      console.error('Event sanalarini yuklashda xatolik:', error)
    } finally {
      setLoading(false)
    }
  }

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))

  const renderDays = () => {
    const days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"]
    return (
      <div className="grid grid-cols-7 text-white/60 text-lg text-center mb-4 max-w-md mx-auto w-full">
        {days.map((day) => (
          <div key={day} className="py-1 flex justify-center items-center">
            {day}
          </div>
        ))}
      </div>
    )
  }

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const rows = []
    let days = []
    let day = startDate

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "yyyy-MM-dd")
        const hasEvent = eventDates.includes(formattedDate)
        const dayNumber = format(day, "d")
        const isCurrentMonth = isSameMonth(day, monthStart)

        days.push(
          <div
            key={day.toString()}
            className="flex items-center justify-center h-[55px]"
          >
            <button
              onClick={() => {
                if (isCurrentMonth && hasEvent) {
                  onDateSelect(formattedDate)
                  setStep(2)
                }
              }}
              className={`
                relative
                flex items-center justify-center
                ${isCurrentMonth ? "w-[75px] h-[55px]" : "w-0 h-0"}
                ${isCurrentMonth ? "opacity-100" : "opacity-0"}
                transition-all duration-200
                calc_style
                ${hasEvent ? 'cursor-pointer hover:scale-105' : 'cursor-default'}
                ${hasEvent ? 'bg-yellow-500/20' : ''}
              `}
              disabled={!hasEvent || !isCurrentMonth}
            >
              {hasEvent && (
                <div className="absolute inset-0 rounded-[18px] bg-yellow-400/80 shadow-[0_8px_25px_rgba(250,204,21,0.5)]" />
              )}
              {isCurrentMonth && (
                <span className={`relative z-10 text-xl font-medium ${hasEvent ? 'text-yellow-300' : 'text-white'
                  }`}>
                  {dayNumber}
                </span>
              )}

            </button>
          </div>
        )
        day = addDays(day, 1)
      }
      rows.push(
        <div
          className="grid grid-cols-7 max-w-md mx-auto w-full"
          key={rows.length}
        >
          {days}
        </div>
      )
      days = []
    }
    return <div className="space-y-0">{rows}</div>
  }

  const renderMonthNavigation = () => {
    const monthName = format(currentMonth, "LLLL", { locale: ru })
    const year = format(currentMonth, "yyyy")

    return (
      <div className="flex items-center justify-center mt-16 mb-20">
        <button
          onClick={prevMonth}
          className="text-white text-4xl mx-8 opacity-70 hover:opacity-100 transition hover:scale-125"
        >
          <IoIosArrowBack size={40} />
        </button>
        <div className="flex items-center gap-2 text-white text-2xl font-medium uppercase tracking-wider min-w-[180px] text-center">
          <MdCalendarToday size={24} />
          {`${monthName.toUpperCase()} ${year}`}
        </div>
        <button
          onClick={nextMonth}
          className="text-white text-4xl mx-8 opacity-70 hover:opacity-100 transition hover:scale-125"
        >
          <IoIosArrowForward size={40} />
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className="text-white flex justify-between items-center mt-[0px] w-full">
        <button onClick={() => setStep(0)} className="cursor-pointer">
          <IoIosArrowBack size={40} />
        </button>
        <img src="/icons/logo.svg" alt="logo" className='max-md:w-20 w-50' />
        <div className="text-white text-lg">{selectedCity}</div>
      </div>

      <div className="w-full max-w-md px-4">
        <p className="font-normal text-white text-[20px] leading-[100%] tracking-[0%] text-center uppercase underline hover:cursor-pointer mb-4">
          Ближайшие мероприятия
        </p>
        {loading ? (
          <div className="text-center text-white py-10">
            <p>Загрузка...</p>
          </div>
        ) : (
          <>
            {renderDays()}
            {renderCells()}
          </>
        )}
      </div>

      {renderMonthNavigation()}

      <div className="relative w-full max-w-[1200px] mx-auto mb-[64px] flex justify-center">
        <Link href={'/userinfo'}>
          <div className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-[50px] hidden sm:block">
            ★
          </div>
        </Link>
      </div>
    </div>
  )
}