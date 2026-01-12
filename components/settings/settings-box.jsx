'use client'
import React, { useState, useEffect } from 'react'
import { authService } from '@/services/auth.service'
import { useAuth } from '@/hooks/useAuth'
import toast, { Toaster } from 'react-hot-toast'
import { FiUser, FiMail, FiPhone, FiLock, FiCamera, FiLogOut, FiSave, FiX } from 'react-icons/fi'
import { IoIosArrowBack } from 'react-icons/io'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function SettingsBox() {
    const router = useRouter()
    const { logout } = useAuth()

    // Profile data
    const [profile, setProfile] = useState({
        first_name: '',
        last_name: '',
        phone: '',
        email: '',
        photo: null
    })

    // Loading states
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)

    // Modal states
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [showPhoneModal, setShowPhoneModal] = useState(false)

    // Password change
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    })

    // Phone change
    const [phoneData, setPhoneData] = useState({
        new_phone: '',
        code: '',
        step: 1 // 1: enter phone, 2: verify code
    })

    // Photo upload
    const [photoFile, setPhotoFile] = useState(null)
    const [photoPreview, setPhotoPreview] = useState(null)

    // Load profile data
    useEffect(() => {
        loadProfile()
    }, [])

    const loadProfile = async () => {
        try {
            setLoading(true)
            const data = await authService.getProfile()
            setProfile(data)
            if (data.photo) {
                setPhotoPreview(data.photo)
            }
        } catch (error) {
            toast.error(error.message)
        } finally {
            setLoading(false)
        }
    }

    // Handle profile update
    const handleSaveProfile = async () => {
        try {
            setSaving(true)

            // Upload photo if changed
            if (photoFile) {
                await authService.uploadProfilePhoto(photoFile)
                toast.success('Фото успешно обновлено')
            }

            // Update other fields
            const { photo, phone, ...updateData } = profile
            await authService.updateProfile(updateData)

            toast.success('Профиль успешно обновлен')
            await loadProfile()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSaving(false)
        }
    }

    // Handle photo change
    const handlePhotoChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setPhotoFile(file)
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Handle password change
    const handlePasswordChange = async () => {
        if (!passwordData.old_password || !passwordData.new_password) {
            toast.error('Заполните все поля')
            return
        }

        if (passwordData.new_password.length < 3) {
            toast.error('Новый пароль должен быть не менее 3 символов')
            return
        }

        if (passwordData.new_password !== passwordData.confirm_password) {
            toast.error('Пароли не совпадают')
            return
        }

        try {
            setSaving(true)
            await authService.changePassword(passwordData.old_password, passwordData.new_password)
            toast.success('Пароль успешно изменен')
            setShowPasswordModal(false)
            setPasswordData({ old_password: '', new_password: '', confirm_password: '' })
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSaving(false)
        }
    }

    // Handle phone change request
    const handleRequestPhoneChange = async () => {
        if (!phoneData.new_phone || phoneData.new_phone.length < 10) {
            toast.error('Введите корректный номер телефона')
            return
        }

        try {
            setSaving(true)
            const cleanPhone = phoneData.new_phone.replace(/\D/g, '')
            await authService.requestPhoneChange(cleanPhone)
            toast.success('SMS код отправлен на новый номер')
            setPhoneData(prev => ({ ...prev, step: 2 }))
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSaving(false)
        }
    }

    // Handle phone change verification
    const handleVerifyPhoneChange = async () => {
        if (!phoneData.code || phoneData.code.length < 4) {
            toast.error('Введите код подтверждения')
            return
        }

        try {
            setSaving(true)
            const cleanPhone = phoneData.new_phone.replace(/\D/g, '')
            await authService.verifyPhoneChange(cleanPhone, phoneData.code)
            toast.success('Номер телефона успешно изменен')
            setShowPhoneModal(false)
            setPhoneData({ new_phone: '', code: '', step: 1 })
            await loadProfile()
        } catch (error) {
            toast.error(error.message)
        } finally {
            setSaving(false)
        }
    }

    // Handle logout
    const handleLogout = () => {
        logout()
        toast.success('Вы вышли из системы')
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-[#122161]-900 to-slate-900">
                <div className="text-white text-2xl font-light animate-pulse">Загрузка...</div>
            </div>
        )
    }

    return (
        <>
            <Toaster
                position="top-center"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#1e1b4b',
                        color: '#fff',
                        border: '1px solid rgba(255,255,255,0.1)',
                    },
                }}
            />

            <div className="min-h-screen bg-gradient-to-br from-slate-900 via-[#122161]-900 to-slate-900 py-12 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header */}
                    <div className="flex items-center justify-between mb-12">
                        <button
                            onClick={() => router.back()}
                            className="text-white/80 hover:text-white transition-colors flex items-center gap-2 group"
                        >
                            <IoIosArrowBack size={28} className="group-hover:-translate-x-1 transition-transform" />
                            <span className="text-lg font-light">Назад</span>
                        </button>

                        <h1 className="text-4xl font-light text-white tracking-wide">
                            Настройки
                        </h1>

                        <button
                            onClick={handleLogout}
                            className="text-red-400/80 hover:text-red-400 transition-colors flex items-center gap-2 group"
                        >
                            <FiLogOut size={24} className="group-hover:translate-x-1 transition-transform" />
                            <span className="text-lg font-light">Выход</span>
                        </button>
                    </div>

                    {/* Profile Card */}
                    <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8 mb-6">
                        {/* Photo Section */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative group">
                                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-[#122161]-500/30 shadow-lg">
                                    {photoPreview ? (
                                        <img
                                            src={photoPreview}
                                            alt="Profile"
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-[#122161]-600 to-pink-600 flex items-center justify-center">
                                            <FiUser size={48} className="text-white" />
                                        </div>
                                    )}
                                </div>

                                <label className="absolute bottom-0 right-0 w-10 h-10 bg-[#122161] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#122161]-700 transition-all shadow-lg hover:scale-110">
                                    <FiCamera size={20} className="text-white" />
                                    <input
                                        type="file"
                                        accept="image/*"
                                        onChange={handlePhotoChange}
                                        className="hidden"
                                    />
                                </label>
                            </div>

                            <p className="text-white/60 text-sm mt-4 font-light">
                                Нажмите на камеру чтобы изменить фото
                            </p>
                        </div>

                        {/* Profile Form */}
                        <div className="space-y-6">
                            {/* First Name */}
                            <div className="group">
                                <label className="block text-white/60 text-sm mb-2 font-light flex items-center gap-2">
                                    <FiUser size={16} />
                                    Имя
                                </label>
                                <input
                                    type="text"
                                    value={profile.first_name}
                                    onChange={(e) => setProfile({ ...profile, first_name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#122161]-500/50 focus:bg-white/10 transition-all font-light"
                                    placeholder="Введите имя"
                                />
                            </div>

                            {/* Last Name */}
                            <div className="group">
                                <label className="block text-white/60 text-sm mb-2 font-light flex items-center gap-2">
                                    <FiUser size={16} />
                                    Фамилия
                                </label>
                                <input
                                    type="text"
                                    value={profile.last_name}
                                    onChange={(e) => setProfile({ ...profile, last_name: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#122161]-500/50 focus:bg-white/10 transition-all font-light"
                                    placeholder="Введите фамилию"
                                />
                            </div>

                            {/* Email */}
                            <div className="group">
                                <label className="block text-white/60 text-sm mb-2 font-light flex items-center gap-2">
                                    <FiMail size={16} />
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={profile.email}
                                    onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#122161]-500/50 focus:bg-white/10 transition-all font-light"
                                    placeholder="email@example.com"
                                />
                            </div>

                            {/* Phone (Read-only) */}
                            <div className="group">
                                <label className="block text-white/60 text-sm mb-2 font-light flex items-center gap-2">
                                    <FiPhone size={16} />
                                    Телефон
                                </label>
                                <div className="flex gap-3">
                                    <input
                                        type="text"
                                        value={profile.phone}
                                        disabled
                                        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white/60 font-light cursor-not-allowed"
                                    />
                                    <button
                                        onClick={() => setShowPhoneModal(true)}
                                        className="px-6 py-3 bg-[#122161]-600/20 border border-[#122161]-500/30 rounded-xl text-[#122161]-300 hover:bg-[#122161]-600/30 transition-all font-light whitespace-nowrap"
                                    >
                                        Изменить
                                    </button>
                                </div>
                            </div>

                            {/* Save Button */}
                            <button
                                onClick={handleSaveProfile}
                                disabled={saving}
                                className="w-full bg-gradient-to-r from-[#122161] text-white rounded-xl px-6 py-4 font-light text-lg  transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-xl"
                            >
                                <FiSave size={20} />
                                {saving ? 'Сохранение...' : 'Сохранить изменения'}
                            </button>
                        </div>
                    </div>

                    {/* Security Section */}
                    <div className="backdrop-blur-xl bg-white/5 rounded-3xl border border-white/10 shadow-2xl p-8">
                        <h2 className="text-2xl font-light text-white mb-6 flex items-center gap-3">
                            <FiLock size={24} />
                            Безопасность
                        </h2>

                        <button
                            onClick={() => setShowPasswordModal(true)}
                            className="w-full bg-white/5 border border-white/10 rounded-xl px-6 py-4 text-white hover:bg-white/10 transition-all font-light text-left flex items-center justify-between group"
                        >
                            <span>Изменить пароль</span>
                            <IoIosArrowBack size={20} className="rotate-180 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </div>
                </div>
            </div>

            {/* Password Change Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gradient-to-br from-slate-900 to-[#122161]-900 rounded-3xl border border-white/10 p-8 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-light text-white">Изменить пароль</h3>
                            <button
                                onClick={() => setShowPasswordModal(false)}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            <input
                                type="password"
                                placeholder="Старый пароль"
                                value={passwordData.old_password}
                                onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#122161]-500/50 transition-all font-light"
                            />

                            <input
                                type="password"
                                placeholder="Новый пароль"
                                value={passwordData.new_password}
                                onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#122161]-500/50 transition-all font-light"
                            />

                            <input
                                type="password"
                                placeholder="Подтвердите новый пароль"
                                value={passwordData.confirm_password}
                                onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#122161]-500/50 transition-all font-light"
                            />

                            <button
                                onClick={handlePasswordChange}
                                disabled={saving}
                                className="w-full bg-gradient-to-r from-[#122161]-600 to-pink-600 text-white rounded-xl px-6 py-3 font-light hover:from-[#122161]-700 hover:to-pink-700 transition-all disabled:opacity-50"
                            >
                                {saving ? 'Изменение...' : 'Изменить пароль'}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Phone Change Modal */}
            {showPhoneModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
                    <div className="bg-gradient-to-br from-slate-900 to-[#122161]-900 rounded-3xl border border-white/10 p-8 max-w-md w-full shadow-2xl">
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-2xl font-light text-white">
                                {phoneData.step === 1 ? 'Изменить номер' : 'Подтвердите номер'}
                            </h3>
                            <button
                                onClick={() => {
                                    setShowPhoneModal(false)
                                    setPhoneData({ new_phone: '', code: '', step: 1 })
                                }}
                                className="text-white/60 hover:text-white transition-colors"
                            >
                                <FiX size={24} />
                            </button>
                        </div>

                        <div className="space-y-4">
                            {phoneData.step === 1 ? (
                                <>
                                    <input
                                        type="tel"
                                        placeholder="Новый номер телефона"
                                        value={phoneData.new_phone}
                                        onChange={(e) => setPhoneData({ ...phoneData, new_phone: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#122161]-500/50 transition-all font-light"
                                    />

                                    <button
                                        onClick={handleRequestPhoneChange}
                                        disabled={saving}
                                        className="w-full bg-gradient-to-r from-[#122161]-600 to-pink-600 text-white rounded-xl px-6 py-3 font-light hover:from-[#122161]-700 hover:to-pink-700 transition-all disabled:opacity-50"
                                    >
                                        {saving ? 'Отправка...' : 'Отправить код'}
                                    </button>
                                </>
                            ) : (
                                <>
                                    <p className="text-white/60 text-sm font-light mb-4">
                                        Введите код из SMS, отправленный на {phoneData.new_phone}
                                    </p>

                                    <input
                                        type="text"
                                        placeholder="Код подтверждения"
                                        value={phoneData.code}
                                        onChange={(e) => setPhoneData({ ...phoneData, code: e.target.value })}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-white/30 focus:outline-none focus:border-[#122161]-500/50 transition-all font-light"
                                    />

                                    <button
                                        onClick={handleVerifyPhoneChange}
                                        disabled={saving}
                                        className="w-full bg-gradient-to-r from-[#122161]-600 to-pink-600 text-white rounded-xl px-6 py-3 font-light hover:from-[#122161]-700 hover:to-pink-700 transition-all disabled:opacity-50"
                                    >
                                        {saving ? 'Проверка...' : 'Подтвердить'}
                                    </button>

                                    <button
                                        onClick={() => setPhoneData({ ...phoneData, step: 1, code: '' })}
                                        className="w-full text-white/60 hover:text-white transition-colors text-sm font-light"
                                    >
                                        Изменить номер
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}