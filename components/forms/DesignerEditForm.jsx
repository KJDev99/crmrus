// forms/DesignerEditForm.jsx
import React, { useState } from 'react'
import { FiSave, FiX } from 'react-icons/fi'

const serviceOptions = [
    { value: 'author_supervision', label: 'Авторский надзор' },
    { value: 'architecture', label: 'Архитектура' },
    { value: 'decorator', label: 'Декоратор' },
    { value: 'designer_horika', label: 'Дизайнер Хорика' },
    { value: 'residential_designer', label: 'Дизайнер жилой недвижимости' },
    { value: 'commercial_designer', label: 'Дизайнер коммерческой недвижимости' },
    { value: 'completing', label: 'Комплектация' },
    { value: 'landscape_design', label: 'Ландшафтный дизайн' },
    { value: 'design', label: 'Проектирование' },
    { value: 'light_designer', label: 'Светодизайнер' },
    { value: 'home_stager', label: 'Хоумстейджер' }
]

const workTypeOptions = [
    { value: 'own_name', label: 'Под собственным именем' },
    { value: 'studio', label: 'В студии' }
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

export default function DesignerEditForm({ data, onChange, onSave, onCancel, saving }) {
    const [localData, setLocalData] = useState(data || {})

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

    const handleSubmit = (e) => {
        e.preventDefault()
        onSave(localData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Asosiy ma'lumotlar */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-2">Основная информация</h3>

                    <div>
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
                        <label className="block text-sm text-white/80 mb-1">ФИ на английском</label>
                        <input
                            type="text"
                            value={localData.full_name_en || ''}
                            onChange={(e) => handleChange('full_name_en', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Телефон</label>
                        <input
                            type="tel"
                            value={localData.phone || ''}
                            onChange={(e) => handleChange('phone', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        />
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Дата рождения</label>
                        <input
                            type="date"
                            value={localData.birth_date || ''}
                            onChange={(e) => handleChange('birth_date', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
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

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Город проживания</label>
                        <input
                            type="text"
                            value={localData.city || ''}
                            onChange={(e) => handleChange('city', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        />
                    </div>
                </div>

                {/* Услуги и работа */}
                <div className="space-y-3">
                    <h3 className="text-lg font-semibold text-white mb-2">Услуги и работа</h3>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Услуги</label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 rounded">
                            {serviceOptions.map(option => (
                                <label key={option.value} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={(localData.services || []).includes(option.value)}
                                        onChange={(e) => handleArrayChange('services', option.value, e.target.checked)}
                                        className="rounded border-white/30 bg-white/10"
                                    />
                                    <span className="text-sm text-white/90">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Тип работы</label>
                        <select
                            value={localData.work_type || ''}
                            onChange={(e) => handleChange('work_type', e.target.value)}
                            className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                        >
                            <option value="">Выберите тип работы</option>
                            {workTypeOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm text-white/80 mb-1">Сегменты работы</label>
                        <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto p-2 bg-white/5 rounded">
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
                </div>
            </div>

            {/* Текстовые поля */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-2">Текстовая информация</h3>

                <div>
                    <label className="block text-sm text-white/80 mb-1">Приветственное сообщение</label>
                    <textarea
                        value={localData.welcome_message || ''}
                        onChange={(e) => handleChange('welcome_message', e.target.value)}
                        rows="3"
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                    />
                </div>

                <div>
                    <label className="block text-sm text-white/80 mb-1">Уникальное торговое предложение</label>
                    <textarea
                        value={localData.unique_trade_proposal || ''}
                        onChange={(e) => handleChange('unique_trade_proposal', e.target.value)}
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
                    <label className="block text-sm text-white/80 mb-1">Описание пакетов услуг</label>
                    <textarea
                        value={localData.service_packages_description || ''}
                        onChange={(e) => handleChange('service_packages_description', e.target.value)}
                        rows="3"
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

            {/* Контакты */}
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