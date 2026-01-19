// forms/RepairEditForm.jsx
import React, { useState, useRef } from 'react'
import { FiSave, FiX, FiUpload } from 'react-icons/fi'

const businessFormOptions = [
    { value: 'own_business', label: 'Собственный бизнес' },
    { value: 'franchise', label: 'Франшиза' }
]

const segmentOptions = [
    { value: 'horeca', label: 'HoReCa' },
    { value: 'business', label: 'Бизнес' },
    { value: 'comfort', label: 'Комфорт' },
    { value: 'premium', label: 'Премиум' },
    { value: 'medium', label: 'Средний' },
    { value: 'economy', label: 'Эконом' }
]

const vatOptions = [
    { value: 'yes', label: 'Да' },
    { value: 'no', label: 'Нет' }
]

const magazineCardsOptions = [
    { value: 'hi_home', label: 'Hi Home' },
    { value: 'in_home', label: 'IN HOME' },
    { value: 'no', label: 'Нет' },
    { value: 'other', label: 'Другое' }
]

export default function RepairEditForm({ data, onChange, onSave, onCancel, saving }) {
    const [localData, setLocalData] = useState(data || {})
    const [imagePreview, setImagePreview] = useState(data?.company_logo || null)
    const fileInputRef = useRef(null)
    const [newImageFile, setNewImageFile] = useState(null)

    const handleChange = (field, value) => {
        const newData = { ...localData, [field]: value }
        setLocalData(newData)
        onChange(newData)
    }

    const handleArrayChange = (field, value, checked) => {
        const currentArray = localData[field] || []
        let newArray
        if (checked) {
            newArray = [...currentArray, value]
        } else {
            newArray = currentArray.filter(item => item !== value)
        }
        handleChange(field, newArray)
    }

    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Размер файла не должен превышать 5MB')
                return
            }

            // File ob'ektini alohida saqlash
            setNewImageFile(file)

            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // handleSubmit funksiyasini to'liq almashtiring:
    const handleSubmit = (e) => {
        e.preventDefault()

        // FormData yaratish
        const formData = new FormData()

        // Barcha oddiy fieldlarni qo'shish
        Object.keys(localData).forEach(key => {
            const value = localData[key]

            // File maydonlarini o'tkazib yuborish
            if (key === 'company_logo') {
                return
            }

            // Array fieldlar
            if (key === 'segments' || key === 'representative_cities' || key === 'other_contacts') {
                if (Array.isArray(value) && value.length > 0) {
                    formData.append(key, JSON.stringify(value))
                }
            }
            // Oddiy fieldlar
            else if (value !== '' && value !== null && value !== undefined) {
                formData.append(key, value)
            }
        })

        // Yangi rasm qo'shish
        if (newImageFile) {
            formData.append('company_logo', newImageFile)
        }

        // FormData yuborish
        onSave(formData)
    }
    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rasm yuklash qismi */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-2">Логотип компании</h3>
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="Company Logo"
                                className="w-32 h-32 object-cover rounded-lg border-2 border-white/30"
                            />
                        ) : (
                            <div className="w-32 h-32 bg-white/10 rounded-lg border-2 border-dashed border-white/30 flex items-center justify-center">
                                <span className="text-white/50 text-sm">Нет фото</span>
                            </div>
                        )}
                    </div>
                    <div className="flex-1">
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleImageChange}
                            accept="image/*"
                            className="hidden"
                        />
                        <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded text-white text-sm font-medium"
                        >
                            <FiUpload /> Загрузить новое фото
                        </button>
                        <p className="text-white/50 text-xs mt-2">Максимальный размер: 5MB</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Asosiy ma'lumotlar */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-2">Основная информация</h3>

                    <div className=''>
                        <label className="block text-sm text-white/80 mb-1">ФИО *</label>
                        <input
                            type="text"
                            value={localData.full_name || ''}
                            onChange={(e) => handleChange('full_name', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Телефон *</label>
                        <input
                            type="tel"
                            value={localData.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Бренд *</label>
                        <input
                            type="text"
                            value={localData.brand_name || ''}
                            onChange={(e) => handleChange('brand_name', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Email *</label>
                        <input
                            type="email"
                            value={localData.email || ''}
                            onChange={(e) => handleChange('email', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                            required
                        />
                    </div>
                </div>

                {/* Бизнес информация */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-2">Бизнес информация</h3>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Ответственное лицо</label>
                        <input
                            type="text"
                            value={localData.responsible_person || ''}
                            onChange={(e) => handleChange('responsible_person', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                            placeholder="Имя, должность, телефон"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Форма бизнеса</label>
                        <select
                            value={localData.business_form || ''}
                            onChange={(e) => handleChange('business_form', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        >
                            <option value="">Выберите форму</option>
                            {businessFormOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Формат работы</label>
                        <input
                            type="text"
                            value={localData.work_format || ''}
                            onChange={(e) => handleChange('work_format', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">НДС</label>
                        <select
                            value={localData.vat_payment || ''}
                            onChange={(e) => handleChange('vat_payment', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        >
                            <option value="">Выберите вариант</option>
                            {vatOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Magazine Cards - CHECKBOX (multiple selection) */}
                    <div>
                        <label className="block text-sm text-white/80 mb-2">Карточки журнала</label>
                        <div className="grid grid-cols-2 gap-2 p-2 bg-white/5 rounded">
                            {magazineCardsOptions.map(option => (
                                <label key={option.value} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={(localData.magazine_cards || []).includes(option.value)}
                                        onChange={(e) => handleArrayChange('magazine_cards', option.value, e.target.checked)}
                                        className="rounded border-white/30 bg-white/10"
                                    />
                                    <span className="text-sm text-white/90">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Текстовые поля */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-2">Текстовая информация</h3>

                <div>
                    <label className="block text-sm text-white/80 mb-1">Перечень работ</label>
                    <textarea
                        value={localData.work_list || ''}
                        onChange={(e) => handleChange('work_list', e.target.value)}
                        rows="3"
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white/80 mb-1">Приветственное сообщение</label>
                    <textarea
                        value={localData.welcome_message || ''}
                        onChange={(e) => handleChange('welcome_message', e.target.value)}
                        rows="2"
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white/80 mb-1">Условия сотрудничества</label>
                    <textarea
                        value={localData.cooperation_terms || ''}
                        onChange={(e) => handleChange('cooperation_terms', e.target.value)}
                        rows="3"
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white/80 mb-1">Сроки выполнения проектов</label>
                    <textarea
                        value={localData.project_timelines || ''}
                        onChange={(e) => handleChange('project_timelines', e.target.value)}
                        rows="2"
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        placeholder="Сроки для 1К, 2К и 3К квартир"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white/80 mb-1">Гарантии</label>
                    <textarea
                        value={localData.guarantees || ''}
                        onChange={(e) => handleChange('guarantees', e.target.value)}
                        rows="2"
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white/80 mb-1">Условия с дизайнерами/поставщиками</label>
                    <textarea
                        value={localData.designer_supplier_terms || ''}
                        onChange={(e) => handleChange('designer_supplier_terms', e.target.value)}
                        rows="2"
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white/80 mb-1">Дополнительная информация</label>
                    <textarea
                        value={localData.additional_info || ''}
                        onChange={(e) => handleChange('additional_info', e.target.value)}
                        rows="2"
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                    />
                </div>
            </div>

            {/* Сегменты и контакты */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-2">Сегменты работы</h3>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-white/5 rounded">
                        {segmentOptions.map(option => (
                            <label key={option.value} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={(localData.segments || []).includes(option.value)}
                                    onChange={(e) => handleArrayChange('segments', option.value, e.target.checked)}
                                    className="rounded border-white/30 bg-white/10"
                                />
                                <span className="text-sm text-white/90">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>


            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-2">Социальные сети</h3>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">VK</label>
                        <input
                            type="url"
                            value={localData.vk || ''}
                            onChange={(e) => handleChange('vk', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Instagram</label>
                        <input
                            type="url"
                            value={localData.instagram || ''}
                            onChange={(e) => handleChange('instagram', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Telegram канал</label>
                        <input
                            type="url"
                            value={localData.telegram_channel || ''}
                            onChange={(e) => handleChange('telegram_channel', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        />
                    </div>
                </div>

                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-2">Другие контакты</h3>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Pinterest</label>
                        <input
                            type="url"
                            value={localData.pinterest || ''}
                            onChange={(e) => handleChange('pinterest', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Website</label>
                        <input
                            type="url"
                            value={localData.website || ''}
                            onChange={(e) => handleChange('website', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Другие контакты</label>
                        <textarea
                            value={Array.isArray(localData.other_contacts)
                                ? localData.other_contacts.join(', ')
                                : localData.other_contacts || ''}
                            onChange={(e) => handleChange('other_contacts', e.target.value.split(',').map(s => s.trim()))}
                            rows="2"
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                            placeholder="Введите через запятую"
                        />
                    </div>
                </div>
            </div>

            {/* Кнопки */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-white/20">
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 rounded text-white text-sm font-medium"
                >
                    <FiX className="mr-2" /> Отмена
                </button>
                <button
                    type="submit"
                    disabled={saving}
                    className="flex items-center px-4 py-2 bg-green-600 hover:bg-green-700 rounded text-white text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    <FiSave className="mr-2" />
                    {saving ? 'Сохранение...' : 'Сохранить изменения'}
                </button>
            </div>
        </form>
    )
}