'use client'
import React, { useState } from 'react'
import PhoneInput from '../ui/input'
import GlassButton from '../ui/GlassButton'
import { Eye, EyeOff } from 'lucide-react'

export default function PasswordCreate({ onSubmit, error, loading, isNewUser }) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [localError, setLocalError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

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
        <div className='max-w-7xl m-auto px-4 sm:px-6 md:px-8 max-md:w-full'>
            <div className="relative flex flex-col items-center text-white px-4 sm:px-8">
                <p className="font-[JejuMyeongjo] mb-12 sm:mb-20 text-lg sm:text-2xl md:text-[24px] leading-tight sm:leading-[24px] tracking-normal text-center">
                    {isNewUser ? 'Создайте пароль' : 'Введите пароль'}
                </p>

                {/* Parol input - asl funksiyalar o'zgarmadi */}
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder={isNewUser ? "Придумайте пароль" : "Пароль"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-5 pr-14 w-[480px] h-[90px] text-[28px] text-yellow-400 rounded-3xl outline-none bg-white/10 placeholder:text-yellow-400/70 border border-white/30 focus:border-yellow-400 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-8 top-1/2 transform -translate-y-1/2"
                    >
                        {showPassword ? (
                            <EyeOff className="w-8 h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                        ) : (
                            <Eye className="w-8 h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                        )}
                    </button>
                </div>

                {isNewUser && (
                    <div className="mt-4 sm:mt-6">
                        {/* Tasdiqlash parol input */}
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Повторите пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="px-5 pr-14 w-[480px] h-[90px] text-[28px] text-yellow-400 rounded-3xl outline-none bg-white/10 placeholder:text-yellow-400/70 border border-white/30 focus:border-yellow-400 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-8 top-1/2 transform -translate-y-1/2"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="w-8 h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                                ) : (
                                    <Eye className="w-8 h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                                )}
                            </button>
                        </div>
                    </div>
                )}

                {(error || localError) && (
                    <p className="text-red-400 text-center mt-3 sm:mt-4 text-base sm:text-[18px]">
                        {error || localError}
                    </p>
                )}

                <div className="mt-6 sm:mt-10">
                    <GlassButton
                        text={loading ? 'ЗАГРУЗКА...' : (isNewUser ? 'СОЗДАТЬ' : 'ВОЙТИ')}
                        click={handleSubmit}
                        disabled={loading || !password || (isNewUser && !confirmPassword)}
                    />
                </div>

                {!isNewUser && (
                    <p className="font-[JejuMyeongjo] text-base sm:text-[18px] leading-6 sm:leading-[22px] text-center mt-6 sm:mt-8 opacity-80">
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
    )
}