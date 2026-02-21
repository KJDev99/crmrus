// forms/DesignerEditForm.jsx
import React, { useState, useRef } from 'react'
import { FiSave, FiX, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi'


const serviceOptions = [
    { value: 'Авторский надзор', label: 'Авторский надзор' },
    { value: 'Архитектура', label: 'Архитектура' },
    { value: 'Декоратор', label: 'Декоратор' },
    { value: 'Направление HoReCa', label: 'Направление HoReCa' },
    { value: 'Дизайнер жилой недвижимости', label: 'Дизайнер жилой недвижимости' },
    { value: 'Дизайнер коммерческой недвижимости', label: 'Дизайнер коммерческой недвижимости' },
    { value: 'Комплектация', label: 'Комплектация' },
    { value: 'Ландшафтный дизайн', label: 'Ландшафтный дизайн' },
    { value: 'Проектирование', label: 'Проектирование' },
    { value: 'Светодизайнер', label: 'Светодизайнер' },
    { value: 'Хоумстейджер', label: 'Хоумстейджер' }
]

const workTypeOptions = [
    { value: 'Под собственным именем', label: 'Под собственным именем' },
    { value: 'В студии', label: 'В студии' }
]

const segmentOptions = [
    { value: 'HoReCa', label: 'HoReCa' },
    { value: 'Бизнес', label: 'Бизнес' },
    { value: 'Комфорт', label: 'Комфорт' },
    { value: 'Премиум', label: 'Премиум' },
    { value: 'Средний', label: 'Средний' },
    { value: 'Эконом', label: 'Эконом' }
]

const vatOptions = [
    { value: 'Да', label: 'Да' },
    { value: 'Нет', label: 'Нет' }
]

const contactTypeOptions = [
    { value: 'vk', label: 'VK', placeholder: 'https://vk.com/...' },
    { value: 'telegram', label: 'Telegram', placeholder: 'https://t.me/...' },
    { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
    { value: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/...' },
    { value: 'website', label: 'Website', placeholder: 'https://example.com' },
    { value: 'other', label: 'Другое', placeholder: 'Введите контакт' }
]
const categoryOptions = [
    {
        value: "Дизайнер жилых помещений",
        label: "Дизайнер жилых помещений"
    },
    {
        value: "Дизайнер коммерческой недвижимости",
        label: "Дизайнер коммерческой недвижимости"
    },
    {
        value: "Декоратор",
        label: "Декоратор"
    },
    {
        value: "Хоустейджер",
        label: "Хоустейджер"
    },
    {
        value: "Архитектор",
        label: "Архитектор"
    },
    {
        value: "Ландшафтный дизайнер",
        label: "Ландшафтный дизайнер"
    },
    {
        value: "Светодизайнер",
        label: "Светодизайнер"
    }
];
const propertyPurposeOptions = [
    { value: 'Постоянное проживание', label: 'Постоянное проживание' },
    { value: 'Коммерческая недвижимость', label: 'Коммерческая недвижимость' },
    { value: 'Под сдачу', label: 'Под сдачу' }
];
const experienceOptions = [
    { value: 'Новичок', label: 'Новичок' },
    { value: 'До 2 лет', label: 'До 2 лет' },
    { value: '2-5 лет', label: '2-5 лет' },
    { value: '5-10 лет', label: '5-10 лет' },
    { value: 'Свыше 10 лет', label: 'Свыше 10 лет' }
];

const areaOptions = [
    { value: 'до 10 м2', label: 'до 10 м2' },
    { value: 'до 40 м2', label: 'до 40 м2' },
    { value: 'до 80 м2', label: 'до 80 м2' },
    { value: 'дома', label: 'дома' },
]

const costOptions = [
    { value: 'До 1500 р', label: 'До 1500 р' },
    { value: 'до 2500р', label: 'до 2500р' },
    { value: 'до 4000 р', label: 'до 4000 р' },
    { value: 'свыше 4000 р', label: 'свыше 4000 р' }

];
export default function DesignerEditForm({ data, onChange, onSave, onCancel, saving }) {
    const parseOtherContacts = (contacts) => {
        if (!contacts) return [{ type: '', value: '' }]

        if (Array.isArray(contacts)) {
            if (contacts.length === 0) return [{ type: '', value: '' }]

            // Har bir elementni tekshirish
            const parsed = contacts.map(item => {
                // Agar allaqachon object bo'lsa
                if (typeof item === 'object' && item !== null && item.type && item.value) {
                    return item
                }

                // Agar string bo'lsa (masalan: "{'type': 'telegram', 'value': 'asdasd'}")
                if (typeof item === 'string') {
                    try {
                        // Python dict formatidan JSON formatga o'tkazish
                        const jsonString = item
                            .replace(/'/g, '"')  // ' -> "
                            .replace(/None/g, 'null')  // Python None -> JSON null
                            .replace(/True/g, 'true')  // Python True -> JSON true
                            .replace(/False/g, 'false')  // Python False -> JSON false

                        const parsed = JSON.parse(jsonString)

                        if (parsed.type && parsed.value) {
                            return parsed
                        }
                    } catch (e) {
                        console.warn('Failed to parse contact:', item, e)
                        // Agar parse bo'lmasa, "other" type bilan qaytarish
                        return { type: 'other', value: item }
                    }
                }

                // Agar hech narsa mos kelmasa
                return { type: 'other', value: String(item) }
            })

            return parsed.filter(item => item.type && item.value) // Bo'sh elementlarni o'chirish
        }

        return [{ type: '', value: '' }]
    }

    const [localData, setLocalData] = useState({
        ...data,
        other_contacts: parseOtherContacts(data?.other_contacts),
        area_of_object: Array.isArray(data?.area_of_object)
            ? data.area_of_object
            : (data?.area_of_object ? [data.area_of_object] : [])
    })
    const [imagePreview, setImagePreview] = useState(data?.photo || null)
    const [imageFile, setImageFile] = useState(null) // File ob'ektini alohida saqlash
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
    // ✅ Contact management functions
    const addContact = () => {
        const newContacts = [...(localData.other_contacts || []), { type: '', value: '' }]
        handleChange('other_contacts', newContacts)
    }

    const removeContact = (index) => {
        if (localData.other_contacts.length > 1) {
            const newContacts = localData.other_contacts.filter((_, i) => i !== index)
            handleChange('other_contacts', newContacts)
        }
    }

    const updateContactType = (index, type) => {
        const newContacts = localData.other_contacts.map((contact, i) =>
            i === index ? { ...contact, type } : contact
        )
        handleChange('other_contacts', newContacts)
    }

    const updateContactValue = (index, value) => {
        const newContacts = localData.other_contacts.map((contact, i) =>
            i === index ? { ...contact, value } : contact
        )
        handleChange('other_contacts', newContacts)
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Размер файла не должен превышать 5MB')
                return
            }
            setNewImageFile(file)
            // File ob'ektini saqlash (binary data)

            // Faqat preview uchun base64 yaratish
            const reader = new FileReader()
            reader.onloadend = () => {
                setImagePreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()

        const formData = new FormData()

        // ✅ other_contacts'ni JSON formatda qo'shish
        const filteredContacts = (localData.other_contacts || [])
            .filter(c => c.type && c.value && c.value.trim() !== '')

        Object.keys(localData).forEach(key => {
            const value = localData[key]

            // File va other_contacts'ni o'tkazib yuborish
            if (key === 'company_logo' || key === 'other_contacts') {
                return
            }

            // Array fieldlar
            if (key === 'segments' || key === 'magazine_cards' || key === 'representative_cities' || key === 'services' || key === 'categories' || key === 'purpose_of_property') {
                if (Array.isArray(value) && value.length > 0) {
                    formData.append(key, JSON.stringify(value))
                }
            } else if (key === 'work_cities') {
                const filtered = (value || []).filter(v => v && v.trim() !== '')
                if (filtered.length > 0) {
                    formData.append(key, JSON.stringify(filtered))
                }
            }
            // Oddiy fieldlar
            else if (value !== '' && value !== null && value !== undefined) {
                formData.append(key, value)
            }
        })

        // ✅ other_contacts'ni JSON formatda qo'shish
        if (filteredContacts.length > 0) {
            formData.append('other_contacts', JSON.stringify(filteredContacts))
        }

        // Yangi rasm qo'shish
        if (newImageFile) {
            formData.append('company_logo', newImageFile)
        }

        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {/* Rasm yuklash qismi */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-2">Фото</h3>
                <div className="flex items-center gap-4">
                    <div className="flex-shrink-0">
                        {imagePreview ? (
                            <img
                                src={imagePreview}
                                alt="User Photo"
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
                        <label className="block text-sm text-white/80 mb-1">Категории</label>
                        <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 rounded">
                            {categoryOptions.map(option => (
                                <label key={option.value} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={(localData.categories || []).includes(option.value)}
                                        onChange={(e) => handleArrayChange('categories', option.value, e.target.checked)}
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
                            <option className='text-black' value="">Выберите тип работы</option>
                            {workTypeOptions.map(option => (
                                <option className='text-black' key={option.value} value={option.value}>
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
                            <option className='text-black' value="">Выберите вариант</option>
                            {vatOptions.map(option => (
                                <option className='text-black' key={option.value} value={option.value}>
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
                    <label className="block text-sm text-white/80 mb-1">Города работы</label>
                    <div className="space-y-2">
                        {(localData.work_cities || ['']).map((city, index) => (
                            <div key={index} className="flex gap-2">
                                <textarea
                                    value={city}
                                    onChange={(e) => {
                                        const newCities = [...(localData.work_cities || [''])]
                                        newCities[index] = e.target.value
                                        handleChange('work_cities', newCities)
                                    }}
                                    rows="2"
                                    className="flex-1 bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm resize-none"
                                    placeholder="Город или условия работы"
                                />
                                {(localData.work_cities || []).length > 1 && (
                                    <button
                                        type="button"
                                        onClick={() => handleChange('work_cities', localData.work_cities.filter((_, i) => i !== index))}
                                        className="flex items-center text-red-400 hover:text-red-300 px-2"
                                    >
                                        <FiTrash2 />
                                    </button>
                                )}
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => handleChange('work_cities', [...(localData.work_cities || ['']), ''])}
                            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded text-white text-sm"
                        >
                            <FiPlus /> Добавить город
                        </button>
                    </div>
                </div>

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
                    <label className="block text-sm text-white/80 mb-1">Опыт работы</label>
                    <select
                        value={localData.experience || ''}
                        onChange={(e) => handleChange('experience', e.target.value)}
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                    >
                        <option className='text-black' value="">Выберите вариант</option>
                        {experienceOptions.map(option => (
                            <option className='text-black' key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>
                <div>
                    <label className="block text-sm text-white/80 mb-1">Область объекта</label>
                    <div className="grid grid-cols-2 gap-2 p-2 bg-white/5 rounded">
                        {areaOptions.map(option => (
                            <label key={option.value} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={(localData.area_of_object || []).includes(option.value)}
                                    onChange={(e) => handleArrayChange('area_of_object', option.value, e.target.checked)}
                                    className="rounded border-white/30 bg-white/10"
                                />
                                <span className="text-sm text-white/90">{option.label}</span>
                            </label>
                        ))}
                    </div>
                </div>
                <div>
                    <label className="block text-sm text-white/80 mb-1">Стоимость за м2</label>

                    <select
                        value={localData.cost_per_m2 || ''}
                        onChange={(e) => handleChange('cost_per_m2', e.target.value)}
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                    >
                        <option className='text-black' value="">Выберите вариант</option>
                        {costOptions.map(option => (
                            <option className='text-black' key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>
                </div>

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
                    <label className="block text-sm text-white/80 mb-1">Назначение объекта</label>
                    <div className="grid grid-cols-2 gap-2 max-h-40 overflow-y-auto p-2 bg-white/5 rounded">
                        {propertyPurposeOptions.map(option => (
                            <label key={option.value} className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    checked={(localData.purpose_of_property || []).includes(option.value)}
                                    onChange={(e) => handleArrayChange('purpose_of_property', option.value, e.target.checked)}
                                    className="rounded border-white/30 bg-white/10"
                                />
                                <span className="text-sm text-white/90">{option.label}</span>
                            </label>
                        ))}
                    </div>
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
                        value={localData.supplier_contractor_recommendation_terms || ''}
                        onChange={(e) => handleChange('supplier_contractor_recommendation_terms', e.target.value)}
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
                    <label className="block text-sm text-white/80 mb-1">Дополнительная информация (Здесь можно оставить дополнительную информацию, которую вы хотели бы нам рассказать)</label>
                    <textarea
                        value={localData.additional_info || ''}
                        onChange={(e) => handleChange('additional_info', e.target.value)}
                        rows="2"
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                    />
                </div>
            </div>

            {/* Контакты */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-2">Контакты и социальные сети</h3>

                {(localData.other_contacts || []).map((contact, index) => (
                    <div key={index} className="bg-white/5 p-3 rounded-lg space-y-2">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {/* Type selector */}
                            <div>
                                <label className="block text-sm text-white/80 mb-1">Тип контакта</label>
                                <select
                                    value={contact.type || ''}
                                    onChange={(e) => updateContactType(index, e.target.value)}
                                    className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                                >
                                    <option className='text-black' value="">Выберите тип</option>
                                    {contactTypeOptions.map(option => (
                                        <option key={option.value} value={option.value} className='text-black'>
                                            {option.label}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Value input */}
                            <div>
                                <label className="block text-sm text-white/80 mb-1">Ссылка или контакт</label>
                                <input
                                    type="text"
                                    value={contact.value || ''}
                                    onChange={(e) => updateContactValue(index, e.target.value)}
                                    className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                                    placeholder={
                                        contact.type
                                            ? contactTypeOptions.find(opt => opt.value === contact.type)?.placeholder
                                            : 'Введите ссылку или контакт'
                                    }
                                />
                            </div>
                        </div>

                        {/* Delete button */}
                        {localData.other_contacts.length > 1 && (
                            <button
                                type="button"
                                onClick={() => removeContact(index)}
                                className="flex items-center gap-1 text-red-400 hover:text-red-300 text-sm"
                            >
                                <FiTrash2 /> Удалить контакт
                            </button>
                        )}
                    </div>
                ))}

                {/* Add new contact button */}
                <button
                    type="button"
                    onClick={addContact}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded text-white text-sm font-medium"
                >
                    <FiPlus /> Добавить контакт
                </button>
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