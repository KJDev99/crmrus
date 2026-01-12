'use client'
import React, { useState } from 'react'
import PhoneInput from '../ui/input'
import GlassButton from '../ui/GlassButton'

export default function Parol({ onSubmit, error, loading }) {
  const [code, setCode] = useState('')

  const handleSubmit = () => {
    const cleanCode = code.replace(/\D/g, '')
    onSubmit(cleanCode)
  }

  return (
    <div className='max-w-7xl max-md:w-full m-auto px-4 sm:px-6 md:px-8'>
      <div className="relative flex flex-col items-center text-white px-4 sm:px-8">
        <p className="font-[JejuMyeongjo] mb-12 sm:mb-20 text-lg sm:text-2xl md:text-[24px] leading-tight sm:leading-[24px] tracking-normal text-center">
          Введите ключ доступа
        </p>

        <PhoneInput
          text={'Пароль'}
          value={code}
          onChange={setCode}
        />

        {error && (
          <p className="text-red-400 text-center mt-3 sm:mt-4 text-base sm:text-[18px]">
            {error}
          </p>
        )}

        <div className="mt-6 sm:mt-10">
          <GlassButton
            text={loading ? 'ПРОВЕРКА...' : 'ВОЙТИ'}
            click={handleSubmit}
            disabled={loading || !code}
          />
        </div>
      </div>
    </div>

  )
}