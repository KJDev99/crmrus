"use client";

import { useState } from "react";
import { addMonths,subMonths,
  format,
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  addDays,
  isSameMonth,
} from "date-fns";
import { IoIosArrowBack } from "react-icons/io";
import { ru } from "date-fns/locale";

const holidays = [
  "2025-05-03",
  "2025-05-08",
  "2025-05-18",
  "2025-05-31",
];

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date(2025, 4, 1)); // 2025-yil May oyi

  const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1));
  const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1));

  const renderHeader = () => (
    <div className="text-white flex justify-between items-center mt-[17px] px-6 max-w-7xl mx-auto w-full">
      <div className="cursor-pointer">
        <IoIosArrowBack size={40} />
      </div>

      <img src="/icons/logo.svg" alt="logo"  />

      <img src="/icons/support.svg" alt="support"  />
    </div>
  );


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
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
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
            className="flex items-center justify-center h-14"
          >
            <div
              className={`
                flex items-center justify-center
                ${isCurrentMonth ? "w-14 h-14" : "w-0 h-0"}
                rounded-full
                ${isHoliday 
                  ? "bg-yellow-400 text-gray-900 shadow-[0_8px_25px_rgba(250,204,21,0.5)]" 
                  : "bg-white/10 backdrop-blur-sm"
                }
                ${isCurrentMonth ? "opacity-100" : "opacity-0"}
                transition-all duration-200
                hover:scale-110
              `}
            >
              {isCurrentMonth && (
                <span className="text-xl font-medium">
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
          {'<'}
        </button>
        <div className="text-white text-2xl font-medium uppercase tracking-wider min-w-[180px] text-center">
          {`${monthName.toUpperCase()} ${year}`}
        </div>
        <button
          onClick={nextMonth}
          className="text-white text-4xl mx-8 opacity-70 hover:opacity-100 transition hover:scale-125"
        >
          {'>'}
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen   flex flex-col items-center">
      {renderHeader()}
      <div className="w-full max-w-md px-4">
        {renderDays()}
        {renderCells()}
      </div>
      {renderMonthNavigation()}
      <div className="fixed bottom-10 right-10 text-white/40 text-6xl pointer-events-none">
        ★
      </div>
    </div>
  );
}