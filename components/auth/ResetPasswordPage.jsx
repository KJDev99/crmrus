'use client'
import React, { useState, useEffect } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Eye, EyeOff, CheckCircle, XCircle, Loader2 } from 'lucide-react'
import Image from 'next/image'

export default function ResetPasswordPage() {
    const searchParams = useSearchParams()
    const router = useRouter()
    const token = searchParams.get('token')

    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)

    useEffect(() => {
        if (!token) setError('Недействительная или истёкшая ссылка.')
    }, [token])

    const handleSubmit = async () => {
        setError('')
        if (!newPassword || newPassword.length < 8) {
            setError('Пароль должен содержать не менее 8 символов.')
            return
        }
        if (newPassword !== confirmPassword) {
            setError('Пароли не совпадают.')
            return
        }
        setLoading(true)
        try {
            const response = await fetch('https://api.reiting-profi.ru/api/v1/accounts/reset-password/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token, new_password: newPassword }),
            })
            const data = await response.json()
            if (!response.ok) {
                setError(data?.detail || data?.new_password?.[0] || data?.token?.[0] || 'Произошла ошибка. Попробуйте снова.')
            } else {
                setSuccess(true)
                setTimeout(() => router.push('/login'), 3000)
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

    if (!token) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <XCircle className="w-12 h-12 sm:w-16 sm:h-16 text-red-400" />
                    <p className="font-[JejuMyeongjo] text-white text-xl sm:text-2xl">Недействительная ссылка</p>
                    <p className="text-white/60 text-base sm:text-lg">Ссылка для сброса пароля недействительна или истекла.</p>
                    <a href="/" className="mt-4 underline text-yellow-400 font-[JejuMyeongjo] text-base sm:text-lg hover:text-yellow-300 transition-colors">
                        Вернуться на главную
                    </a>
                </div>
            </div>
        )
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center px-4">
                <div className="flex flex-col items-center gap-4 text-center">
                    <CheckCircle className="w-12 h-12 sm:w-16 sm:h-16 text-green-400" />
                    <p className="font-[JejuMyeongjo] text-white text-xl sm:text-2xl">Пароль успешно изменён!</p>
                    <p className="text-white/60 text-base sm:text-lg">Перенаправление на главную страницу...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="flex items-center justify-center px-4">
            <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
                <div className="relative flex flex-col items-center text-white px-4 sm:px-8">

                    {/* Logo */}
                    <Image width={200} height={200} className='sm:w-[308px] sm:h-[308px] w-48 h-48' src="/icons/logo.svg" alt="logo" quality={100} />

                    <p className="font-[JejuMyeongjo] mb-8 sm:mb-12 md:mb-20 text-base sm:text-xl md:text-[24px] leading-snug md:leading-[24px] tracking-normal text-center">
                        Придумайте новый пароль
                    </p>

                    {/* Yangi parol */}
                    <div className="relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px]">
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Новый пароль"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="px-5 pr-12 w-full h-[56px] sm:h-[70px] md:h-[90px] text-base sm:text-2xl md:text-[28px] text-yellow-400 rounded-3xl outline-none bg-white/10 placeholder:text-yellow-400/70 border border-white/30 focus:border-yellow-400 transition-colors"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2">
                            {showPassword
                                ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                                : <Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                            }
                        </button>
                    </div>

                    {/* Tasdiqlash */}
                    <div className="mt-4 sm:mt-6 relative w-full max-w-[320px] sm:max-w-[400px] md:max-w-[480px]">
                        <input
                            type={showConfirmPassword ? 'text' : 'password'}
                            placeholder="Повторите пароль"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            onKeyDown={handleKeyDown}
                            className="px-5 pr-12 w-full h-[56px] sm:h-[70px] md:h-[90px] text-base sm:text-2xl md:text-[28px] text-yellow-400 rounded-3xl outline-none bg-white/10 placeholder:text-yellow-400/70 border border-white/30 focus:border-yellow-400 transition-colors"
                        />
                        <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-5 top-1/2 -translate-y-1/2">
                            {showConfirmPassword
                                ? <EyeOff className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                                : <Eye className="w-5 h-5 sm:w-6 sm:h-6 md:w-8 md:h-8 text-yellow-400/70 hover:text-yellow-400 transition-colors" />
                            }
                        </button>
                    </div>

                    {error && (
                        <p className="text-red-400 text-center mt-3 sm:mt-4 text-sm sm:text-[18px]">
                            {error}
                        </p>
                    )}

                    <div className="mt-6 sm:mt-10">
                        <button
                            onClick={handleSubmit}
                            disabled={loading || !newPassword || !confirmPassword}
                            className="flex items-center justify-center gap-3 px-8 sm:px-12 h-[56px] sm:h-[70px] min-w-[180px] sm:min-w-[220px] text-white text-base sm:text-[20px] font-semibold tracking-widest rounded-3xl bg-white/10 border border-white/30 hover:bg-white/20 hover:border-yellow-400 disabled:opacity-40 disabled:cursor-not-allowed backdrop-blur-sm transition-all duration-300"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin" />
                                    ЗАГРУЗКА...
                                </>
                            ) : 'СОХРАНИТЬ'}
                        </button>
                    </div>

                    <p className="font-[JejuMyeongjo] text-sm sm:text-[18px] leading-6 text-center mt-6 sm:mt-8 opacity-80">
                        <a href="https://r-profi.taplink.ws" target="_blank" rel="noopener noreferrer" className="underline">
                            Свяжитесь с нами
                        </a>
                    </p>
                </div>
            </div>
        </div>
    )
}