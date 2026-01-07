'use client'
import React, { useState, useEffect } from 'react'
import Event from './Event'
import Calendar from './Calendar'
import AllEvents from './AllEvents'
import EventDetail from './EventDetail'
import axios from 'axios'

export default function UpcomingEventsSection1() {
  const [step, setStep] = useState(0)
  const [selectedCity, setSelectedCity] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [selectedEvent, setSelectedEvent] = useState(null)
  const [eventsData, setEventsData] = useState(null)

  useEffect(() => {
    fetchEventsData();
  }, []);

  const fetchEventsData = async () => {
    try {
      const token = localStorage.getItem('access_token');
      if (!token) {
        window.location.href = '/login';
        return;
      }

      const response = await axios.get(
        'https://api.reiting-profi.ru/api/v1/events/upcoming-events/',
        {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      setEventsData(response.data);
    } catch (error) {
      console.error('Events yuklashda xatolik:', error);
    }
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city);
    setStep(1); // Calendar bosqichiga o'tish
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
    setStep(2); // AllEvents bosqichiga o'tish
  };

  const handleEventSelect = (event) => {
    setSelectedEvent(event);
    setStep(3); // EventDetail bosqichiga o'tish
  };

  return (
    <div className='max-w-7xl m-auto'>
      {step === 0 ? (
        <Event
          setStep={setStep}
          eventsData={eventsData}
          onCitySelect={handleCitySelect}
        />
      ) : step === 1 ? (
        <Calendar
          setStep={setStep}
          selectedCity={selectedCity}
          onDateSelect={handleDateSelect}
        />
      ) : step === 2 ? (
        <AllEvents
          setStep={setStep}
          selectedCity={selectedCity}
          selectedDate={selectedDate}
          onEventSelect={handleEventSelect}
        />
      ) : (
        <EventDetail
          setStep={setStep}
          selectedEvent={selectedEvent}
        />
      )}
    </div>
  )
}