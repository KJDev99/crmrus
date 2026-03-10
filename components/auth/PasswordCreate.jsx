'use client'
import React, { useState } from 'react'
import PhoneInput from '../ui/input'
import GlassButton from '../ui/GlassButton'
import { Eye, EyeOff } from 'lucide-react'
import Link from 'next/link'

export default function PasswordCreate({ onSubmit, error, loading, isNewUser }) {
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [localError, setLocalError] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)

    const handleSubmit = () => {
        setLocalError('')
        if (isNewUser) {
            if (!password || password.length < 3) {
                setLocalError('Пароль должен быть не менее 3 символов.')
                return
            }
            if (password !== confirmPassword) {
                setLocalError('Пароли не совпадают.')
                return
            }
        } else {
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
                <p className="font-[JejuMyeongjo] mb-8 sm:mb-12 md:mb-16 text-base sm:text-xl md:text-[24px] leading-snug md:leading-[24px] tracking-normal text-center">
                    {isNewUser ? 'Создайте пароль' : 'Введите пароль'}
                </p>

                {/* Password input — kichraytirildi */}
                <div className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px]">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder={isNewUser ? "Придумайте пароль" : "Пароль"}
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="px-5 pr-12 w-full h-[56px] sm:h-[70px] md:h-[90px] text-lg sm:text-2xl md:text-[28px] text-yellow-400 rounded-3xl outline-none bg-white/10 placeholder:text-yellow-400/70 border border-white/30 focus:border-yellow-400 transition-colors"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-5 top-1/2 -translate-y-1/2"
                    >
                        {showPassword
                            ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                            : <Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                        }
                    </button>
                </div>

                {isNewUser && (
                    <div className="mt-4 sm:mt-6 w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px]">
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Повторите пароль"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="px-5 pr-12 w-full h-[56px] sm:h-[70px] md:h-[90px] text-lg sm:text-2xl md:text-[28px] text-yellow-400 rounded-3xl outline-none bg-white/10 placeholder:text-yellow-400/70 border border-white/30 focus:border-yellow-400 transition-colors"
                            />
                            <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-5 top-1/2 -translate-y-1/2"
                            >
                                {showConfirmPassword
                                    ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                                    : <Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                                }
                            </button>
                        </div>
                    </div>
                )}

                {(error || localError) && (
                    <p className="text-red-400 text-center mt-3 sm:mt-4 text-base sm:text-[18px]">
                        {error || localError}
                    </p>
                )}

                {/* Button — pastroqqa tushirildi */}
                <div className="mt-8 sm:mt-12 md:mt-16">
                    <GlassButton
                        text={loading ? 'ЗАГРУЗКА...' : (isNewUser ? 'СОЗДАТЬ' : 'ВОЙТИ')}
                        click={handleSubmit}
                        disabled={loading || !password || (isNewUser && !confirmPassword)}
                    />
                </div>

                {/* Past guruh — yanada pastroqda */}
                {!isNewUser && (
                    <div className="flex flex-col items-center gap-3 mt-10 sm:mt-16 md:mt-20">
                        <Link href={'/reset-email'}>Забыли пароль?</Link>
                        <p className="font-[JejuMyeongjo] text-base sm:text-[18px] leading-6 text-center opacity-80">
                            <a
                                href="https://r-profi.taplink.ws"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="underline"
                            >
                                Свяжитесь с нами
                            </a>
                        </p>
                    </div>
                )}
            </div>
        </div>
    )
}