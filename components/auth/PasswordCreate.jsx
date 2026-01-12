'use client'
import React, { useState } from 'react'
import PhoneInput from '../ui/input'
import GlassButton from '../ui/GlassButton'

export default function PasswordCreate({ onSubmit, error, loading, isNewUser }) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [localError, setLocalError] = useState('')

    const handleSubmit = () => {
        setLocalError('')

        if (isNewUser) {
            // Yangi user uchun parol yaratish
            if (!password || password.length < 3) {
                setLocalError('Пароль должен быть не менее 3 символов.')
                return
            }

            if (password !== confirmPassword) {
                setLocalError('Пароли не совпадают.')
                return
            }
        } else {
            // Eski user uchun parol kiritish
            if (!password) {
                setLocalError('Пожалуйста, введите пароль.')
                return
            }
        }

        onSubmit(password)
    }

    return (
        <div>
            <div className='max-w-7xl m-auto'>
                <div className="relative flex flex-col items-center text-white px-8">
                    <p className="font-[JejuMyeongjo] mb-20 text-[24px] leading-[24px] tracking-normal text-center">
                        {isNewUser ? 'Создайте пароль' : 'Введите пароль'}
                    </p>

                    <PhoneInput
                        text={isNewUser ? 'Придумайте пароль' : 'Пароль'}
                        value={password}
                        onChange={setPassword}
                    />

                    {isNewUser && (
                        <div className="mt-6">
                            <PhoneInput
                                text={'Повторите пароль'}
                                value={confirmPassword}
                                onChange={setConfirmPassword}
                            />
                        </div>
                    )}

                    {(error || localError) && (
                        <p className="text-red-400 text-center mt-4 text-[18px]">
                            {error || localError}
                        </p>
                    )}

                    <div className="mt-10">
                        <GlassButton
                            text={loading ? 'ЗАГРУЗКА...' : (isNewUser ? 'СОЗДАТЬ' : 'ВОЙТИ')}
                            click={handleSubmit}
                            disabled={loading || !password || (isNewUser && !confirmPassword)}
                        />
                    </div>

                    {!isNewUser && (
                        <p className="font-[JejuMyeongjo] text-[18px] leading-[22px] text-center mt-8 opacity-80">
                            Забыли пароль?<br />
                            <a
                                href="https://r-profi.taplink.ws"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                Свяжитесь с нами
                            </a>
                        </p>
                    )}
                </div>
            </div>
        </div>
    )
}