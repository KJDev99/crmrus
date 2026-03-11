'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Mail, CheckCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [countdown, setCountdown] = useState(5)

    const handleSubmit = async () => {
        setError('')
        if (!email || !email.includes('@')) {
            setError('Пожалуйста, введите корректный email.')
            return
        }
        setLoading(true)
        try {
            const response = await fetch('https://api.reiting-profi.ru/api/v1/accounts/forgot-password/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email }),
            })
            if (!response.ok) {
                const data = await response.json()
                setError(data?.detail || data?.email?.[0] || 'Произошла ошибка. Попробуйте снова.')
            } else {
                setSuccess(true)
                let count = 5
                const interval = setInterval(() => {
                    count -= 1
                    setCountdown(count)
                    if (count <= 0) {
                        clearInterval(interval)
                        router.push('/login')
                    }
                }, 1000)
            }
        } catch {
            setError('Ошибка соединения с сервером.')
        } finally {
            setLoading(false)
        }
    }

    const handleKeyDown = (e) => {
        if (e.key === 'Enter') handleSubmit()
    }

    return (
        <div className=" flex items-center justify-center px-4">

            {/* Success Modal */}
            {success && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
                    <div className="flex flex-col items-center gap-6 text-center bg-white/10 border border-white/20 rounded-3xl px-8 sm:px-10 py-10 sm:py-12 max-w-md w-full shadow-2xl">
                        <div className="relative">
                            <div className="absolute inset-0 rounded-full bg-green-400/20 animate-ping" />
                            <CheckCircle className="relative w-16 h-16 sm:w-20 sm:h-20 text-green-400" />
                        </div>
                        <p className="font-[JejuMyeongjo] text-white text-xl sm:text-2xl leading-snug">
                            Письмо отправлено!
                        </p>
                        <p className="text-white/70 text-base sm:text-lg leading-relaxed">
                            Мы отправили ссылку для сброса пароля на
                            <br />
                            <span className="text-yellow-400 font-semibold">{email}</span>
                        </p>
                        <p className="text-white/40 text-sm sm:text-base">
                            Перенаправление через{' '}
                            <span className="text-yellow-400 font-bold">{countdown}</span> сек...
                        </p>
                        <button
                            onClick={() => router.push('/login')}
                            className="mt-2 px-10 h-[48px] sm:h-[56px] text-white text-sm sm:text-[16px] font-semibold tracking-widest rounded-2xl bg-white/10 border border-white/30 hover:bg-white/20 hover:border-yellow-400 transition-all duration-300"
                        >
                            ВОЙТИ
                        </button>
                    </div>
                </div>
            )}

            {/* Main Form */}
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="relative flex flex-col items-center text-white px-4 sm:px-8">

                    {/* Logo */}
                    <Image width={200} height={200} className='sm:w-[308px] sm:h-[308px] w-48 h-48 mt-16 mb-16 max-md:mt-5 max-md:mb-5' src="/icons/logo22.svg" alt="logo" quality={100} />

                    <p className="font-[JejuMyeongjo] mb-8 sm:mb-12 md:mb-20 text-base sm:text-xl md:text-[24px] leading-snug md:leading-[24px] tracking-normal text-center">
                        Сброс пароля
                    </p>

                    {/* Email input */}
                    <div className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px]">
                        <span className="absolute left-5 top-1/2 -translate-y-1/2 pointer-events-none">
                            <Mail className="w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7 text-yellow-400/70" />
                        </span>
                        <input
                            type="email"
                            placeholder="Введите ваш email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="pl-12 sm:pl-14 pr-5 w-full h-[56px] sm:h-[70px] md:h-[90px] text-base sm:text-xl md:text-[24px] text-yellow-400 rounded-3xl outline-none bg-white/10 placeholder:text-yellow-400/70 border border-white/30 focus:border-yellow-400 transition-colors"
                        />
                    </div>

                    {error && (
                        <p className="text-red-400 text-center mt-3 sm:mt-4 text-sm sm:text-[18px]">
                            {error}
                        </p>
                    )}

                    <div className="mt-6 sm:mt-10">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !email}
                            className="flex items-center justify-center gap-3 px-8 sm:px-12 h-[56px] sm:h-[70px] min-w-[200px] sm:min-w-[280px] text-white text-base sm:text-[20px] font-semibold tracking-widest rounded-3xl bg-white/10 border border-white/30 hover:bg-white/20 hover:border-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm transition-all duration-300"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                    ОТПРАВКА...
                                </>
                            ) : 'ОТПРАВИТЬ'}
                        </button>
                    </div>

                    <p className="font-[JejuMyeongjo] text-sm sm:text-[18px] leading-6 text-center mt-6 sm:mt-8 opacity-80">
                        <a href="/login" className="underline hover:text-yellow-400 transition-colors">
                            Вернуться к входу
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}