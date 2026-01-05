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
    <div>
      <div className='max-w-7xl m-auto'>
        <div className="relative flex flex-col items-center text-white px-8">
          <p className="font-[JejuMyeongjo] mb-20 text-[24px] leading-[24px] tracking-normal text-center">
            Введите ключ доступа
          </p>

          <PhoneInput
            text={'Пароль'}
            value={code}
            onChange={setCode}
          />

          {error && (
            <p className="text-red-400 text-center mt-4 text-[18px]">
              {error}
            </p>
          )}

          <div className="mt-10">
            <GlassButton
              text={loading ? 'TEKSHIRILMOQDA...' : 'КИРИШ'}
              click={handleSubmit}
              disabled={loading || !code}
            />
          </div>
        </div>
      </div>
    </div>
  )
}