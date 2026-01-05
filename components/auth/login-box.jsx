'use client'
import Image from 'next/image'
import React, { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import GlassButton from '../ui/GlassButton'
import Enter from './Phone'
import Parol from './Parol'
import { useRouter } from 'next/navigation'

export default function LoginBox() {
    const [step, setStep] = useState(0)
    const [phone, setPhone] = useState('')
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const router = useRouter()

    const handlePhoneSubmit = async () => {
        if (!phone || phone.length < 12) {
            setError('Iltimos, to\'liq telefon raqam kiriting')
            return
        }

        setLoading(true)
        setError('')

        try {
            const cleanPhone = phone.replace(/\D/g, '')

            const response = await fetch('https://api.reiting-profi.ru/api/v1/accounts/login/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: cleanPhone
                })
            })

            const data = await response.json()

            if (response.ok) {
                setStep(1)
            } else {
                setError(data.message || 'Xatolik yuz berdi')
            }
        } catch (err) {
            setError('Tarmoq xatosi. Iltimos, qayta urinib ko\'ring')
        } finally {
            setLoading(false)
        }
    }

    const handleCodeSubmit = async (code) => {
        if (!code || code.length < 4) {
            setError('Iltimos, to\'liq kodni kiriting')
            return
        }

        setLoading(true)
        setError('')

        try {
            const cleanPhone = phone.replace(/\D/g, '')

            const response = await fetch('https://api.reiting-profi.ru/api/v1/accounts/verify-sms/', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    phone: cleanPhone,
                    code: code
                })
            })

            const data = await response.json()

            if (response.ok && data.tokens) {
                // Tokenlarni saqlash
                localStorage.setItem('access_token', data.tokens.access)
                localStorage.setItem('refresh_token', data.tokens.refresh)

                // Role sahifasiga yo'naltirish
                router.push('/role')
            } else {
                setError(data.message || 'Kod noto\'g\'ri')
            }
        } catch (err) {
            setError('Tarmoq xatosi. Iltimos, qayta urinib ko\'ring')
        } finally {
            setLoading(false)
        }
    }

    const handleNext = () => {
        if (step === 0) {
            handlePhoneSubmit()
        }
    }

    const handleBack = () => {
        setStep(prev => prev - 1)
        setError('')
    }

    let content;
    switch (step) {
        case 0:
            content = <Enter
                phone={phone}
                setPhone={setPhone}
                error={error}
            />
            break
        case 1:
            content = <Parol
                onSubmit={handleCodeSubmit}
                error={error}
                loading={loading}
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
                step !== 0 && step !== 1 &&
                <div className="fixed right-[112px] bottom-[112px] text-white">
                    <Image src={'/icons/star.svg'} alt='star' width={50} height={50} />
                </div>
            }

            {
                step === 0 &&
                <div className="fixed right-[112px] bottom-[80px] text-white">
                    <GlassButton
                        text={loading ? 'YUKLANMOQDA...' : 'ДАЛЛЕ'}
                        click={handleNext}
                        disabled={loading}
                    />
                </div>
            }
        </div>
    )
}