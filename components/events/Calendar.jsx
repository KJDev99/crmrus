"use client";
import { useState } from "react";
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
} from "date-fns";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { ru } from "date-fns/locale";
import { MdCalendarToday } from 'react-icons/md';

const holidays = [
  "2025-05-03", // 3-may
  "2025-05-08", // 8-may
  "2025-05-18", // 18-may
  "2025-05-31", // 31-may
];

export default function Calendar({ setStep }) {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4, 1)); // 2025-yil May oyi

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderDays = () => {
    const days = ["ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"];
    return (
      <div className="grid grid-cols-7 text-white/60 text-lg text-center mb-6 max-w-md mx-auto w-full">
        {days.map((day) => (
          <div key={day} className="py-1 flex justify-center items-center">
            {day}
          </div>
        ))}
      </div>
    );
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 }); // Dushanbadan boshlash
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= endDate) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "yyyy-MM-dd");
        const isHoliday = holidays.includes(formattedDate);
        const dayNumber = format(day, "d");
        const isCurrentMonth = isSameMonth(day, monthStart);

        days.push(
          <div
            key={day.toString()}
            className="flex items-center justify-center h-[65px]"
          >
            <div
              className={`
                relative
                flex items-center justify-center
                ${isCurrentMonth ? "w-[75px] h-[65px]" : "w-0 h-0"}
                rounded-[18px]
                backdrop-blur-[70px]
                bg-white/10
                ${isCurrentMonth ? "opacity-100" : "opacity-0"}
                transition-all duration-200
                before:absolute
                before:inset-0
                before:rounded-[18px]
                before:border
                before:border-transparent
                before:bg-[radial-gradient(120.73%_120.73%_at_-10.62%_0%,rgba(255,250,250,0.4)_0%,rgba(255,255,255,0.1)_100%),radial-gradient(116.46%_116.46%_at_0%_9.52%,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0)_50%,rgba(255,255,255,0.6)_100%)]
                before:[-webkit-mask:linear-gradient(#fff_0_0)_content-box,linear-gradient(#fff_0_0)]
                before:[-webkit-mask-composite:xor]
                before:[mask-composite:exclude]
                shadow-[inset_0px_0px_30px_-9px_rgba(255,255,255,0.4)]
              `}
              onClick={() => {
                if (isCurrentMonth) {
                  setStep(2);
                }
              }}
            >
              {isHoliday && (
                <div className="absolute inset-0 rounded-[18px] bg-yellow-400/80 shadow-[0_8px_25px_rgba(250,204,21,0.5)]" />
              )}
              {isCurrentMonth && (
                <span className="relative z-10 text-xl font-medium text-white">
                  {dayNumber}
                </span>
              )}
            </div>
          </div>
        );
        day = addDays(day, 1);
      }
      rows.push(
        <div
          className="grid grid-cols-7 max-w-md mx-auto w-full"
          key={rows.length}
        >
          {days}
        </div>
      );
      days = [];
    }
    return <div className="space-y-2">{rows}</div>;
  };

  const renderMonthNavigation = () => {
    const monthName = format(currentMonth, "LLLL", { locale: ru });
    const year = format(currentMonth, "yyyy");

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
    );
  };

  return (
    <div className="min-h-screen flex flex-col items-center">
      <div className=" text-white flex justify-between items-center mt-[0px] w-full">
        <div onClick={() => setStep(0)} className=" cursor-pointer"><IoIosArrowBack size={40} /></div>
        <img src="/icons/logo.svg" alt="a" />
        <div></div>
      </div>
      <div className="w-full max-w-md px-4">
        {renderDays()}
        {renderCells()}
      </div>
      {renderMonthNavigation()}
      <div className="relative w-full max-w-[1200px] mx-auto mb-[64px] flex justify-center">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-[50px]">
          ★
        </div>
      </div>
    </div>
  );
}