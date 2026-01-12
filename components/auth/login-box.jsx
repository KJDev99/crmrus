'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import GlassButton from '../ui/GlassButton'
import Enter from './Phone'
import SmsVerification from './SmsVerification'
import PasswordCreate from './PasswordCreate'
import { useRouter } from 'next/navigation'
import { authService } from '@/services/auth.service'

export default function LoginBox() {
    const [step, setStep] = useState(0) // 0: telefon, 1: SMS kod (yangi user), 2: parol yaratish, 3: parol kiriting
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [isPhoneVerified, setIsPhoneVerified] = useState(false)
    const [isNewUser, setIsNewUser] = useState(false)
    const router = useRouter()

    // 1-qadam: Telefon raqamni tekshirish
    const handlePhoneSubmit = async () => {
        if (!phone || phone.length < 12) {
            setError('Пожалуйста, введите свой полный номер телефона.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const cleanPhone = phone.replace(/\D/g, '')

            // Telefon verificatsiyadan o'tganmi tekshirish
            const checkResult = await authService.checkPhone(cleanPhone)

            setIsPhoneVerified(checkResult.is_phone_verified)

            if (!checkResult.is_phone_verified) {
                // Yangi user - SMS kod yuboriladi
                setIsNewUser(true)
                setStep(1) // SMS kod kiritish sahifasiga
            } else {
                // Eski user - parol kiritish sahifasiga
                setIsNewUser(false)
                setStep(3) // Parol kiritish sahifasiga
            }
        } catch (err) {
            setError(err.message || 'Произошла ошибка. Попробуйте снова.')
        } finally {
            setLoading(false)
        }
    }

    // 2-qadam: SMS kodni tekshirish (faqat yangi userlar uchun)
    const handleSmsCodeSubmit = async (code) => {
        if (!code || code.length < 4) {
            setError('Пожалуйста, введите полный код.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const cleanPhone = phone.replace(/\D/g, '')

            // SMS kodni tekshirish
            const verifyResult = await authService.verifyCode(cleanPhone, code)

            if (verifyResult.is_phone_verified) {
                // SMS tasdiqlandi - parol yaratish sahifasiga
                setIsPhoneVerified(true)
                setStep(2) // Parol yaratish sahifasiga
            } else {
                setError('Не удалось подтвердить код.')
            }
        } catch (err) {
            setError(err.message || 'Код неверен.')
        } finally {
            setLoading(false)
        }
    }

    // 3-qadam: Parol bilan login qilish
    const handlePasswordSubmit = async (password) => {
        if (!password && !isNewUser) {
            setError('Пожалуйста, введите пароль.')
            return
        }

        setLoading(true)
        setError('')

        try {
            const cleanPhone = phone.replace(/\D/g, '')

            // Login qilish
            const loginResult = await authService.login(cleanPhone, password)

            if (loginResult.access_token && loginResult.refresh_token) {
                // Tokenlarni saqlash
                authService.saveTokens(loginResult.access_token, loginResult.refresh_token)

                // Role sahifasiga yo'naltirish
                router.push('/role')
            } else {
                setError('Ошибка входа. Попробуйте снова.')
            }
        } catch (err) {
            setError(err.message || 'Неверный пароль.')
        } finally {
            setLoading(false)
        }
    }

    const handleBack = () => {
        if (step > 0) {
            setStep(prev => prev - 1)
            setError('')
        }
    }

    let content;
    switch (step) {
        case 0:
            // Telefon raqam kiritish
            content = <Enter
                phone={phone}
                setPhone={setPhone}
                error={error}
            />
            break
        case 1:
            // SMS kod kiritish (yangi userlar)
            content = <SmsVerification
                onSubmit={handleSmsCodeSubmit}
                error={error}
                loading={loading}
                phone={phone}
            />
            break
        case 2:
            // Parol yaratish (yangi userlar)
            content = <PasswordCreate
                onSubmit={handlePasswordSubmit}
                error={error}
                loading={loading}
                isNewUser={true}
            />
            break
        case 3:
            // Parol kiritish (eski userlar)
            content = <PasswordCreate
                onSubmit={handlePasswordSubmit}
                error={error}
                loading={loading}
                isNewUser={false}
            />
            break
    }

    return (
        <div className='relative flex flex-col items-center text-white'>
            {
                step !== 0 &&
                <div className="absolute top-26 left-[120px] text-3xl cursor-pointer">
                    <IoIosArrowBack
                        size={40}
                        onClick={handleBack}
                    />
                </div>
            }

            <Image width={308} height={308} src="/icons/logo.svg" alt="logo" />

            {content}

            {
                step === 0 &&
                <div className="fixed right-[112px] bottom-[80px] text-white">
                    <GlassButton
                        text={loading ? 'ЗАГРУЗКА...' : 'ДАЛЕЕ'}
                        click={handlePhoneSubmit}
                        disabled={loading}
                    />
                </div>
            }
        </div>
    )
}