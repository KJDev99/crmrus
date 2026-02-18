// forms/SupplierEditForm.jsx
import React, { useState, useRef, useEffect } from 'react'
import { FiSave, FiX, FiUpload, FiPlus, FiTrash2 } from 'react-icons/fi'

const businessFormOptions = [
    { value: 'Собственный бизнес', label: 'Собственный бизнес' },
    { value: 'Франшиза', label: 'Франшиза' }
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

const magazineCardsOptions = [
    { value: 'Hi Home', label: 'Hi Home' },
    { value: 'IN HOME', label: 'IN HOME' },
    { value: 'Нет', label: 'Нет' },
    { value: 'Другое', label: 'Другое' }
]
const speedOptions = [
    { value: 'В наличии', label: 'В наличии' },
    { value: 'до 2х недель', label: 'до 2х недель' },
    { value: 'до 1 месяца', label: 'до 1 месяца' },
    { value: 'до 3x месяцев', label: 'до 3x месяцев' },
]

// ✅ YANGI: Category mapping for subcategories
const categoryMapping = {
    'Черновые материалы': 'rough_materials',
    'Чистовые материалы': 'finishing_materials',
    'Мягкая мебель': 'upholstered_furniture',
    'Корпусная мебель': 'cabinet_furniture',
    'Техника': 'technique',
    'Декор': 'decor'
}
const categoryOptions = [
    { value: 'Основные категории', label: 'Основные категории' },
    {
        value: 'Черновые материалы', label: 'Черновые материалы'
    },
    { value: 'Чистовые материалы', label: 'Чистовые материалы' },
    { value: 'Мягкая мебель', label: 'Мягкая мебель' },
    { value: 'Корпусная мебель', label: 'Корпусная мебель' },
    { value: 'Техника', label: 'Техника' },
    { value: 'Декор', label: 'Декор' },
]

// ✅ YANGI: Contact type options
const contactTypeOptions = [
    { value: 'vk', label: 'VK', placeholder: 'https://vk.com/...' },
    { value: 'telegram', label: 'Telegram', placeholder: 'https://t.me/...' },
    { value: 'instagram', label: 'Instagram', placeholder: 'https://instagram.com/...' },
    { value: 'pinterest', label: 'Pinterest', placeholder: 'https://pinterest.com/...' },
    { value: 'website', label: 'Website', placeholder: 'https://example.com' },
    { value: 'other', label: 'Другое', placeholder: 'Введите контакт' }
]


export default function SupplierEditForm({ data, onChange, onSave, onCancel, saving }) {
    // ✅ YANGI: other_contacts ni to'g'ri parse qilish
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
    const [subCategoryData, setSubCategoryData] = useState(null)
    const [loadingSubCategories, setLoadingSubCategories] = useState(false)

    const parseRepresentativeCities = (cities) => {
        if (!cities) return ['']
        if (Array.isArray(cities)) {
            if (cities.length === 0) return ['']
            return cities.map(city => typeof city === 'string' ? city : String(city))
        }
        if (typeof cities === 'string') return [cities]
        return ['']
    }
    const [localData, setLocalData] = useState({
        ...data,
        other_contacts: parseOtherContacts(data?.other_contacts),
        representative_cities: parseRepresentativeCities(data?.representative_cities),
        speed_of_execution: Array.isArray(data?.speed_of_execution)
            ? data.speed_of_execution
            : (data?.speed_of_execution ? [data.speed_of_execution] : []),
        rough_materials: data?.rough_materials || [],
        finishing_materials: data?.finishing_materials || [],
        upholstered_furniture: data?.upholstered_furniture || [],
        cabinet_furniture: data?.cabinet_furniture || [],
        technique: data?.technique || [],

        decor: data?.decor || []
    })

    const [imagePreview, setImagePreview] = useState(data?.company_logo || null)
    const fileInputRef = useRef(null)
    const [newImageFile, setNewImageFile] = useState(null)

    const handleChange = (field, value) => {
        const newData = { ...localData, [field]: value }
        setLocalData(newData)
        onChange(newData)
    }

    useEffect(() => {
        const fetchSubCategories = async () => {
            setLoadingSubCategories(true)
            try {
                const response = await fetch('https://api.reiting-profi.ru/api/v1/accounts/supplier-questionnaires/secondory-filter-data/')
                const result = await response.json()
                setSubCategoryData(result)
            } catch (error) {
                console.error('Error fetching subcategories:', error)
            } finally {
                setLoadingSubCategories(false)
            }
        }

        fetchSubCategories()
    }, [])

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

    // ✅ YANGI: Subcategory toggle
    const handleSubCategoryToggle = (categoryKey, subCategoryValue) => {
        const currentArray = localData[categoryKey] || []
        let newArray
        if (currentArray.includes(subCategoryValue)) {
            newArray = currentArray.filter(item => item !== subCategoryValue)
        } else {
            newArray = [...currentArray, subCategoryValue]
        }
        handleChange(categoryKey, newArray)
    }

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
            if (key === 'segments' || key === 'magazine_cards' || key === 'representative_cities') {
                if (Array.isArray(value) && value.length > 0) {
                    formData.append(key, JSON.stringify(value))
                }
            }
            else if (key === 'categories') {
                if (Array.isArray(value) && value.length > 0) {
                    formData.append(key, JSON.stringify(value))
                }
            }
            // ✅ YANGI: speed_of_execution array sifatida
            else if (key === 'speed_of_execution') {
                if (Array.isArray(value) && value.length > 0) {
                    formData.append(key, JSON.stringify(value))
                }
            }
            // ✅ YANGI: Subcategory fields
            else if (['rough_materials', 'finishing_materials', 'upholstered_furniture',
                'cabinet_furniture', 'technique', 'decor'].includes(key)) {
                if (Array.isArray(value) && value.length > 0) {
                    formData.append(key, JSON.stringify(value))
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

                    <div className='hidden'>
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
                            placeholder="Название (полное юридическое наименование)"
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
                            <option className='text-black' value="">Выберите форму</option>
                            {businessFormOptions.map(option => (
                                <option className='text-black' key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
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

                    <div>
                        <label className="block text-sm text-white/80 mb-2">Сроки поставки</label>
                        <div className="grid grid-cols-2 gap-2 p-2 bg-white/5 rounded">
                            {speedOptions.map(option => (
                                <label key={option.value} className="flex items-center space-x-2">
                                    <input
                                        type="checkbox"
                                        checked={(localData.speed_of_execution || []).includes(option.value)}
                                        onChange={(e) => handleArrayChange('speed_of_execution', option.value, e.target.checked)}
                                        className="rounded border-white/30 bg-white/10"
                                    />
                                    <span className="text-sm text-white/90">{option.label}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* ✅ Representative Cities */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-2">Города представительства</h3>

                {(localData.representative_cities || ['']).map((city, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <input
                            type="text"
                            value={city}
                            onChange={(e) => {
                                const newCities = [...(localData.representative_cities || [''])]
                                newCities[index] = e.target.value
                                handleChange('representative_cities', newCities)
                            }}
                            className="flex-1 bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                            placeholder="Туапсе, ул. Кореновская, д. 4, офис 2, телефон: 8 800 500 00 00"
                        />
                        {(localData.representative_cities || []).length > 1 && (
                            <button
                                type="button"
                                onClick={() => {
                                    const newCities = (localData.representative_cities || []).filter((_, i) => i !== index)
                                    handleChange('representative_cities', newCities)
                                }}
                                className="text-red-400 hover:text-red-300"
                            >
                                <FiTrash2 />
                            </button>
                        )}
                    </div>
                ))}

                <button
                    type="button"
                    onClick={() => handleChange('representative_cities', [...(localData.representative_cities || ['']), ''])}
                    className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 border border-white/30 rounded text-white text-sm font-medium"
                >
                    <FiPlus /> Добавить город
                </button>
            </div>

            {/* Текстовые поля */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-2">Текстовая информация</h3>

                <div>
                    <label className="block text-sm text-white/80 mb-1">Ассортимент продукции</label>
                    <textarea
                        value={localData.product_assortment || ''}
                        onChange={(e) => handleChange('product_assortment', e.target.value)}
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
                    <label className="block text-sm text-white/80 mb-1">Сроки поставки</label>
                    <textarea
                        value={localData.delivery_terms || ''}
                        onChange={(e) => handleChange('delivery_terms', e.target.value)}
                        rows="2"
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
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
                    <label className="block text-sm text-white/80 mb-1">Условия с дизайнерами/подрядчиками</label>
                    <textarea
                        value={localData.designer_contractor_terms || ''}
                        onChange={(e) => handleChange('designer_contractor_terms', e.target.value)}
                        rows="2"
                        className="w-full bg-white/10 border border-white/30 rounded px-3 py-2 text-white text-sm"
                    />
                </div>
            </div>

            {/* Сегменты */}
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-2">Сегменты работы</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-2 bg-white/5 rounded">
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
            <div className="space-y-3">
                <h3 className="text-lg font-semibold text-white mb-2">Категории</h3>
                <div className="grid grid-cols-2 gap-2 p-2 bg-white/5 rounded">
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

            {/* ✅ YANGI: Subcategories Section */}
            {loadingSubCategories ? (
                <div className="text-center text-white/70 py-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-2"></div>
                    <p className="text-sm">Загрузка подкатегорий...</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {Object.entries(categoryMapping).map(([categoryLabel, categoryKey]) => {
                        // Agar category tanlanmagan bo'lsa, sub-category ko'rsatmaydi
                        if (!(localData.categories || []).includes(categoryLabel)) return null

                        // API dan kerakli sub-category larni olish
                        const subCategories = subCategoryData?.[categoryKey] || []

                        // Agar sub-category lar bo'lmasa, ko'rsatmaydi
                        if (subCategories.length === 0) return null

                        return (
                            <div key={categoryKey} className="space-y-3">
                                <h3 className="text-lg font-semibold text-white">
                                    Подкатегории для "{categoryLabel}"
                                </h3>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 p-3 bg-white/5 rounded">
                                    {subCategories.map((subCat, index) => (
                                        <label key={index} className="flex items-center space-x-2">
                                            <input
                                                type="checkbox"
                                                checked={(localData[categoryKey] || []).includes(subCat.name)}
                                                onChange={() => handleSubCategoryToggle(categoryKey, subCat.name)}
                                                className="rounded border-white/30 bg-white/10"
                                            />
                                            <span className="text-xs text-white/90">{subCat.name}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            )}

            {/* ✅ YANGI: Dynamic Contact Management */}
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