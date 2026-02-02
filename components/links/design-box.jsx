'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function DesignBox() {
    const [formData, setFormData] = useState({
        group: 'design',
        full_name: '',
        full_name_en: '',
        phone: '',
        birth_date: '',
        email: '',
        city: '',
        services: [],
        work_type: '',
        work_type_details: '',
        welcome_message: '',
        work_cities: [''],
        segments: [],
        unique_trade_proposal: '',
        vk: '',
        telegram_channel: '',
        pinterest: '',
        instagram: '',
        website: '',
        other_contacts: [{ type: '', value: '' }],
        service_packages_description: '',
        vat_payment: '',
        supplier_contractor_recommendation_terms: '',
        additional_info: '',
        data_processing_consent: false,
        photo: null,
        categories: [],
        purpose_of_property: [],
        area_of_object: '',
        cost_per_m2: '',
        experience: ''
    });

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    const groupOptions = [
        { value: 'design', label: 'Дизайнер' },
        { value: 'architect', label: 'Архитектор' },
        { value: 'decorator', label: 'Декоратор' },
        { value: 'landscape_designer', label: 'Ландшафтный дизайнер' },
        { value: 'light_designer', label: 'Светодизайнер' },
        { value: 'interior_designer', label: 'Дизайнер интерьера' },
        { value: 'repair_team', label: 'Ремонтная бригада' },
        { value: 'contractor', label: 'Подрядчик' },
        { value: 'supplier', label: 'Поставщик' },
        { value: 'exhibition_hall', label: 'Выставочный зал' },
        { value: 'factory', label: 'Фабрика' }
    ];

    const serviceOptions = [
        { value: 'author_supervision', label: 'Авторский надзор' },
        { value: 'architecture', label: 'Архитектура' },
        { value: 'decorator', label: 'Декоратор' },
        { value: 'designer_horika', label: 'Направление HoReCa' },
        { value: 'residential_designer', label: 'Дизайнер жилой недвижимости' },
        { value: 'commercial_designer', label: 'Дизайнер коммерческой недвижимости' },
        { value: 'completing', label: 'Комплектация' },
        { value: 'landscape_design', label: 'Ландшашфтный дизайн' },
        { value: 'design', label: 'Проектирование' },
        { value: 'light_designer', label: 'Светодизайнер' },
        { value: 'home_stager', label: 'Хоумстейджер' }
    ];

    const segmentOptions = [
        { value: 'horeca', label: 'HoReCa' },
        { value: 'business', label: 'Бизнес' },
        { value: 'comfort', label: 'Комфорт' },
        { value: 'premium', label: 'Премиум' },
        { value: 'medium', label: 'Средний' },
        { value: 'economy', label: 'Эконом' }
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
        { value: 'До 1500 р ', label: 'До 1500 р ' },
        { value: 'до 2500р', label: 'до 2500р' },
        {
            value: 'до 4000 р ', label: 'до 4000 р '
        },
        {
            value: 'свыше 4000 р ', label: 'свыше 4000 р '
        }

    ];

    const vatPaymentOptions = [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
    ];
    const socialMediaOptions = [
        { value: 'vk', label: 'VK', placeholder: 'Ссылка на VK' },
        { value: 'telegram', label: 'Telegram канал', placeholder: 'Ссылка на Telegram канал' },
        { value: 'pinterest', label: 'Pinterest', placeholder: 'Ссылка на Pinterest' },
        { value: 'instagram', label: 'Instagram', placeholder: 'Ссылка на Instagram' },
        { value: 'website', label: 'Веб-сайт', placeholder: 'https://example.com' },
        { value: 'other', label: 'Другое', placeholder: 'Другой контакт' }
    ];

    const categoryOptions = [
        { value: 'Основные категории', label: 'Основные категоии' },
        { value: 'Черновые материалы', label: 'Черновые материалы' },
        { value: 'Чистовые материалы', label: 'Чистовые материалы' },
        { value: 'Мягкая мебель', label: 'Мягкая мебель' },
        { value: 'Корпусная мебель', label: 'Корпусная мебель' },
        { value: 'Техника', label: 'Техника' },
        { value: 'Декор', label: 'Декор' }
    ];
    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleServiceToggle = (serviceValue) => {
        setFormData(prev => ({
            ...prev,
            services: prev.services.includes(serviceValue)
                ? prev.services.filter(s => s !== serviceValue)
                : [...prev.services, serviceValue]
        }));
    };

    const handleSegmentToggle = (segmentValue) => {
        setFormData(prev => ({
            ...prev,
            segments: prev.segments.includes(segmentValue)
                ? prev.segments.filter(s => s !== segmentValue)
                : [...prev.segments, segmentValue]
        }));
    };

    const handleCategoryToggle = (categoryValue) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryValue)
                ? prev.categories.filter(c => c !== categoryValue)
                : [...prev.categories, categoryValue]
        }));
    };

    const handlePurposeToggle = (purposeValue) => {
        setFormData(prev => ({
            ...prev,
            purpose_of_property: prev.purpose_of_property.includes(purposeValue)
                ? prev.purpose_of_property.filter(c => c !== purposeValue)
                : [...prev.purpose_of_property, purposeValue]
        }));
    };

    const addWorkCity = () => {
        setFormData(prev => ({
            ...prev,
            work_cities: [...prev.work_cities, '']
        }));
    };

    const removeWorkCity = (index) => {
        if (formData.work_cities.length > 1) {
            setFormData(prev => ({
                ...prev,
                work_cities: prev.work_cities.filter((_, i) => i !== index)
            }));
        }
    };

    const updateWorkCity = (index, value) => {
        setFormData(prev => ({
            ...prev,
            work_cities: prev.work_cities.map((city, i) =>
                i === index ? value : city
            )
        }));
    };

    const addOtherContact = () => {
        setFormData(prev => ({
            ...prev,
            other_contacts: [...prev.other_contacts, '']
        }));
    };

    const removeOtherContact = (index) => {
        if (formData.other_contacts.length > 1) {
            setFormData(prev => ({
                ...prev,
                other_contacts: prev.other_contacts.filter((_, i) => i !== index)
            }));
        }
    };

    // Yangi kontakt qo'shish
    const addSocialContact = () => {
        setFormData(prev => ({
            ...prev,
            other_contacts: [...prev.other_contacts, { type: '', value: '' }]
        }));
    };

    // Kontaktni o'chirish
    const removeSocialContact = (index) => {
        if (formData.other_contacts.length > 1) {
            setFormData(prev => ({
                ...prev,
                other_contacts: prev.other_contacts.filter((_, i) => i !== index)
            }));
        }
    };

    // Kontakt type ni yangilash
    const updateSocialContactType = (index, type) => {
        setFormData(prev => ({
            ...prev,
            other_contacts: prev.other_contacts.map((contact, i) =>
                i === index ? { ...contact, type } : contact
            )
        }));
    };

    // Kontakt value ni yangilash
    const updateSocialContactValue = (index, value) => {
        setFormData(prev => ({
            ...prev,
            other_contacts: prev.other_contacts.map((contact, i) =>
                i === index ? { ...contact, value } : contact
            )
        }));
    };
    const handlePhotoChange = (e) => {
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const totalSize = files.reduce((sum, file) => sum + file.size, 0);

            if (totalSize > 20 * 1024 * 1024) {
                toast.error('Общий размер файлов не должен превышать 20MB');
                return;
            }

            // For now, take only first file for photo
            const file = files[0];
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Размер файла не должен превышать 5MB');
                return;
            }

            setFormData(prev => ({ ...prev, photo: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setPhotoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!formData.group) {
            toast.error('Пожалуйста, выберите группу');
            return;
        }
        if (!formData.full_name) {
            toast.error('Пожалуйста, введите ФИО');
            return;
        }
        if (!formData.full_name_en) {
            toast.error('Пожалуйста, введите ФИ на английском');
            return;
        }
        if (!formData.phone) {
            toast.error('Пожалуйста, введите номер телефона');
            return;
        }
        if (!formData.birth_date) {
            toast.error('Пожалуйста, введите дату рождения');
            return;
        }
        if (!formData.email) {
            toast.error('Пожалуйста, введите email');
            return;
        }
        if (!formData.city) {
            toast.error('Пожалуйста, введите город проживания');
            return;
        }
        if (formData.services.length === 0) {
            toast.error('Пожалуйста, выберите хотя бы одну услугу');
            return;
        }
        if (!formData.work_type) {
            toast.error('Пожалуйста, укажите тип работы');
            return;
        }
        if (!formData.welcome_message) {
            toast.error('Пожалуйста, введите приветственное сообщение');
            return;
        }
        if (!formData.work_cities[0] || formData.work_cities.every(city => !city.trim())) {
            toast.error('Пожалуйста, укажите города работы');
            return;
        }
        if (formData.segments.length === 0) {
            toast.error('Пожалуйста, выберите сегменты работы');
            return;
        }
        if (!formData.unique_trade_proposal) {
            toast.error('Пожалуйста, укажите уникальное торговое предложение');
            return;
        }
        if (!formData.service_packages_description) {
            toast.error('Пожалуйста, опишите пакеты услуг');
            return;
        }
        if (!formData.vat_payment) {
            toast.error('Пожалуйста, укажите возможность оплаты с НДС');
            return;
        }
        if (!formData.supplier_contractor_recommendation_terms) {
            toast.error('Пожалуйста, укажите условия сотрудничества по рекомендациям');
            return;
        }
        if (!formData.data_processing_consent) {
            toast.error('Необходимо согласие на обработку данных');
            return;
        }

        setIsSubmitting(true);

        try {
            const submitFormData = new FormData();

            // Add all fields to FormData
            Object.keys(formData).forEach(key => {
                const value = formData[key];

                if (key === 'company_logo' || key === 'legal_entity_card') {
                    if (value) submitFormData.append(key, value);
                } else if (key === 'representative_cities') {
                    const filteredValues = value.filter(v => v.trim() !== '');
                    if (filteredValues.length > 0) submitFormData.append(key, JSON.stringify(filteredValues));
                } else if (key === 'other_contacts') {
                    // ✅ Yangi format: { type: 'vk', value: 'https://...' }
                    const filteredContacts = value.filter(c => c.type && c.value.trim() !== '');
                    if (filteredContacts.length > 0) {
                        submitFormData.append(key, JSON.stringify(filteredContacts));
                    }
                } else if (key === 'segments' || key === 'magazine_cards') {
                    if (value.length > 0) submitFormData.append(key, JSON.stringify(value));
                } else if (key === 'data_processing_consent') {
                    submitFormData.append(key, value.toString());
                } else if (key === 'categories') {
                    submitFormData.append(key, JSON.stringify(value));
                } else if (key === 'purpose_of_property') {
                    submitFormData.append(key, JSON.stringify(value));
                } else if (value !== '' && value !== null) {
                    submitFormData.append(key, value);
                }
            });
            await axios.post('https://api.reiting-profi.ru/api/v1/accounts/questionnaires/', submitFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setShowModal(true);
            toast.success('Анкета успешно отправлена!');

            // Reset form
            setFormData({
                group: 'designer',
                full_name: '',
                full_name_en: '',
                phone: '',
                birth_date: '',
                email: '',
                city: '',
                services: [],
                work_type: '',
                work_type_details: '',
                welcome_message: '',
                work_cities: [''],
                segments: [],
                unique_trade_proposal: '',
                vk: '',
                telegram_channel: '',
                pinterest: '',
                instagram: '',
                website: '',
                other_contacts: [{ type: '', value: '' }],
                service_packages_description: '',
                vat_payment: '',
                supplier_contractor_recommendation_terms: '',
                additional_info: '',
                data_processing_consent: false,
                photo: null,
                categories: [],
                purpose_of_property: [],
                area_of_object: '',
                cost_per_m2: '',
                experience: ''
            });
            setPhotoPreview(null);
        } catch (error) {
            console.error('Error submitting form:', error);
            toast.error('Ошибка при отправке анкеты. Пожалуйста, попробуйте позже.');
        } finally {
            setIsSubmitting(false);
        }
    };

    const closeModal = () => {
        setShowModal(false);
    };

    return (
        <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8" style={{ background: '#fff' }}>
            <style>{`
                .bg-glass2 {
                    background: linear-gradient(91.53deg, rgba(255, 255, 255, 0.044) -6.96%, rgba(255, 255, 255, 0.029) 106.1%);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(70px);
                    box-shadow: 0px 0px 30px -9px #FFFFFF66 inset;
                    color: white;
                }

                .bg-glass1 {
                         background: #232D69;
                    border: 1px solid rgba(255, 255, 255, 0.3);
                    backdrop-filter: blur(70px);
                    box-shadow: 0px 0px 30px -9px #FFFFFF66 inset;
                    color: white;
                }

                .input-glass {
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(10px);
                    color: white;
                    width: 100%;
                }

                .input-glass::placeholder {
                    color: rgba(255, 255, 255, 0.5);
                }

                .input-glass:focus {
                    outline: none;
                    border-color: rgba(255, 255, 255, 0.4);
                    background: rgba(255, 255, 255, 0.08);
                }

                .checkbox-glass {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                    background: rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                    position: relative;
                    flex-shrink: 0;
                }

                .checkbox-glass:checked {
                    background: rgba(255, 255, 255, 0.2);
                    border-color: rgba(255, 255, 255, 0.6);
                }

                .checkbox-glass:checked::after {
                    content: '✓';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    color: white;
                    font-size: 14px;
                    font-weight: bold;
                }

                .radio-glass {
                    appearance: none;
                    width: 20px;
                    height: 20px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.05);
                    cursor: pointer;
                    position: relative;
                    flex-shrink: 0;
                }

                .radio-glass:checked {
                    border-color: rgba(255, 255, 255, 0.6);
                }

                .radio-glass:checked::after {
                    content: '';
                    position: absolute;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    width: 10px;
                    height: 10px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.8);
                }

                .file-upload-area {
                    border: 2px dashed rgba(255, 255, 255, 0.3);
                    transition: all 0.3s ease;
                }

                .file-upload-area:hover {
                    border-color: rgba(255, 255, 255, 0.5);
                    background: rgba(255, 255, 255, 0.08);
                }

                @keyframes fade-in {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }

                .animate-fade-in {
                    animation: fade-in 0.3s ease-out;
                }

                /* Mobile optimizations */
                @media (max-width: 640px) {
                    .mobile-stack {
                        flex-direction: column;
                        gap: 0.5rem;
                    }
                    
                    .mobile-full {
                        width: 100%;
                    }
                    
                    .mobile-padding {
                        padding: 1rem;
                    }
                    
                    .mobile-text-sm {
                        font-size: 0.875rem;
                    }
                }
            `}</style>

            <div className="max-w-4xl mx-auto">
                <div className="bg-glass1 rounded-2xl p-4 sm:p-6 md:p-8 lg:p-10 shadow-2xl mobile-padding">
                    <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-center mb-2 text-white">
                        Анкета участника: роль — Дизайн.
                    </h1>


                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Group Selection */}
                        {/* <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Группа <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="group"
                                value={formData.group}
                                onChange={handleInputChange}
                                className="input-glass px-4 py-3 rounded-lg transition-all text-sm sm:text-base"
                                required
                            >
                                {groupOptions.map(option => (
                                    <option key={option.value} value={option.value} className="bg-[#122161]">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div> */}

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                ФИО <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                className="input-glass px-4 py-3 rounded-lg transition-all text-sm sm:text-base"
                                placeholder="Введите ваше ФИО"
                                required
                            />
                        </div>

                        {/* Full Name EN */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                ФИ на английском <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Для внутреннего пользования, не отображается в системе
                            </p>
                            <input
                                type="text"
                                name="full_name_en"
                                value={formData.full_name_en}
                                onChange={handleInputChange}
                                className="input-glass px-4 py-3 rounded-lg transition-all text-sm sm:text-base"
                                placeholder="Full Name in English"
                                required
                            />
                        </div>

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Номер телефона <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="input-glass px-4 py-3 rounded-lg transition-all text-sm sm:text-base"
                                placeholder="+7 (999) 999-99-99"
                                required
                            />
                        </div>

                        {/* Birth Date */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Дата рождения <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                ДД.ММ.ГГГГ
                            </p>
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleInputChange}
                                className="input-glass px-4 py-3 rounded-lg transition-all text-sm sm:text-base"
                                required
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Ваш e-mail <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="input-glass px-4 py-3 rounded-lg transition-all text-sm sm:text-base"
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                В каком городе проживаете? <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="input-glass px-4 py-3 rounded-lg transition-all text-sm sm:text-base"
                                placeholder="Введите город"
                                required
                            />
                        </div>

                        {/* Services */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Выберите одну или несколько услуг, которые вы предоставляете. <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {serviceOptions.map(option => (
                                    <label
                                        key={option.value}
                                        className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.services.includes(option.value)}
                                            onChange={() => handleServiceToggle(option.value)}
                                            className="checkbox-glass"
                                            required={formData.services.length === 0}
                                        />
                                        <span className="text-sm text-white">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Work Type */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Вы работаете под собственным именем или в студии? <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Если вы работаете в студии — укажите её название и адрес.<br />
                                Если вы работаете на себя — укажите форму налогообложения (самозанятый, ИП, ООО).
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                Работаю в студии "ED", Краснодар, ул. Путевая, дом 6, оф. 35.   <br />
                                Самозанятый  <br />
                                Под собственным именем  <br />
                                В студии <br />

                            </p>

                            {/* Radio buttons for backend */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-3">
                                <label className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2 mobile-full">
                                    <input
                                        type="radio"
                                        name="work_type"
                                        value="own_name"
                                        checked={formData.work_type === 'own_name'}
                                        onChange={handleInputChange}
                                        className="radio-glass"
                                        required
                                    />
                                    <span className="text-white text-sm sm:text-base">Под собственным именем</span>
                                </label>
                                <label className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2 mobile-full">
                                    <input
                                        type="radio"
                                        name="work_type"
                                        value="studio"
                                        checked={formData.work_type === 'studio'}
                                        onChange={handleInputChange}
                                        className="radio-glass"
                                        required
                                    />
                                    <span className="text-white text-sm sm:text-base">В студии</span>
                                </label>
                            </div>

                            {/* Details text area */}
                            <div>
                                <textarea
                                    name="work_type_details"
                                    value={formData.work_type_details || ''}
                                    onChange={handleInputChange}
                                    className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                    rows="3"
                                    placeholder="Укажите название студии и адрес или форму налогообложения"
                                    required
                                />
                            </div>
                        </div>

                        {/* Welcome Message */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Приветственное сообщение о вас и вашем опыте. <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Расскажите:<br />
                                – в каком году вы закончили обучение (в каждой из сфер, указанных выше),<br />
                                – географию вашей работы (в каких городах реализованы проекты),<br />
                                – общий опыт (например, сколько квадратных метров спроектировано).<br />
                                Эта информация будет использована в вашем приветственном блоке в личном кабинете, поэтому включите все профессиональные регалии и достижения.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Я закончила Архитектурный факультет «Название учреждения» в г. Москве в 2017 году. <br />
                                В 2018 году завершила курсы по дизайну интерьера в школе "Название" в г. Уфа. <br />
                                Мой опыт охватывает работу по всему Югу России (от Краснодара до Сочи), а также проекты в Абхазии и Крыму. Проекты реализованы в таких городах как ( перечислите города) <br />

                                За время своей профессиональной деятельности я спроектировала более 700 000 кв. м в области дизайна интерьера и более 60 000 кв. м как архитектор. <br />
                                (За время моей работы я спроектировала более 20 объектов жилой недвижимости, 5 ресторанов и более 10 проектов в различных бизнесах и развлекательной индустрии.)

                            </p>
                            <textarea
                                name="welcome_message"
                                value={formData.welcome_message}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="6"
                                placeholder="Расскажите о себе и своем опыте"
                                required
                            />
                        </div>

                        {/* Work Cities */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                В каких городах вы готовы работать? <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Укажите, возможна ли онлайн-работа, выезды в другие регионы, а также ограничения («работаю только в Краснодарском крае» или «не выезжаю дальше 200 км от основного города»).
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                Работаю по всему Югу России с выездом. Онлайн-работа — для всех регионов.
                                Города, в которых готова работать лично: Краснодар, Сочи, Ростов-на-Дону, Воронеж, Анапа.
                                Другие регионы — по согласованию.

                            </p>
                            {formData.work_cities.map((city, index) => (
                                <div key={index} className="flex gap-2 mb-3 mobile-stack">
                                    <textarea
                                        value={city}
                                        onChange={(e) => updateWorkCity(index, e.target.value)}
                                        className="input-glass flex-1 px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                        rows="2"
                                        placeholder="Укажите города и условия работы"
                                        required={index === 0}
                                    />
                                    {formData.work_cities.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeWorkCity(index)}
                                            className="bg-glass2 px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all text-red-400 text-sm sm:text-base flex-shrink-0 h-fit"
                                        >
                                            Удалить
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addWorkCity}
                                className="bg-glass2 w-full px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all text-sm sm:text-base"
                            >
                                + Добавить еще город
                            </button>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Выберите один или несколько сегментов, в которых вы работаете. <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {segmentOptions.map(option => (
                                    <label
                                        key={option.value}
                                        className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.segments.includes(option.value)}
                                            onChange={() => handleSegmentToggle(option.value)}
                                            className="checkbox-glass"
                                            required={formData.segments.length === 0}
                                        />
                                        <span className="text-sm text-white">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Цель собственности <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {propertyPurposeOptions.map(option => (
                                    <label
                                        key={option.value}
                                        className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.purpose_of_property.includes(option.value)}
                                            onChange={() => handlePurposeToggle(option.value)}
                                            className="checkbox-glass"
                                            required={formData.purpose_of_property.length === 0}
                                        />
                                        <span className="text-sm text-white">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Площадь объекта (м²) <span className="text-red-400">*</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {areaOptions.map(option => (
                                    <label key={option.value} className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2 mobile-full">
                                        <input
                                            type="radio"
                                            name="area_of_object"
                                            value={option.value}
                                            checked={formData.area_of_object === option.value}
                                            onChange={handleInputChange}
                                            className="radio-glass"
                                            required
                                        />
                                        <span className="text-white text-sm sm:text-base">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Стоимость за м² (₽)
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {costOptions.map(option => (
                                    <label key={option.value} className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2 mobile-full">
                                        <input
                                            type="radio"
                                            name="cost_per_m2"
                                            value={option.value}
                                            checked={formData.cost_per_m2 === option.value}
                                            onChange={handleInputChange}
                                            className="radio-glass"
                                            required
                                        />
                                        <span className="text-white text-sm sm:text-base">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Ваш опыт в годах <span className="text-red-400">*</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {experienceOptions.map(option => (
                                    <label key={option.value} className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2 mobile-full">
                                        <input
                                            type="radio"
                                            name="experience"
                                            value={option.value}
                                            checked={formData.experience === option.value}
                                            onChange={handleInputChange}
                                            className="radio-glass"
                                            required
                                        />
                                        <span className="text-white text-sm sm:text-base">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Выберите категорий <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                                {categoryOptions.map(option => (
                                    <label
                                        key={option.value}
                                        className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2"
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.categories.includes(option.value)}
                                            onChange={() => handleCategoryToggle(option.value)}
                                            className="checkbox-glass"
                                            required={formData.categories.length === 0}
                                        />
                                        <span className="text-sm text-white">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Unique Trade Proposal */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Ваше уникальное торговое предложение (УТП) <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/50 text-xs mb-3 italic">
                                За 3 года я помог(ла) более 50 брендам улучшить визуальную идентичность, что привело к увеличению их продаж на 25-40%. Я создаю уникальные решения в стиле минимализма и современного креативного подхода. Сроки выполнения проектов — от 5 до 14 рабочих дней, в зависимости от сложности задачи."
                            </p>
                            <textarea
                                name="unique_trade_proposal"
                                value={formData.unique_trade_proposal}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="3"
                                placeholder="Ваше уникальное торговое предложение"
                                required
                            />
                        </div>

                        {/* Social Media Links */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">
                                Ссылки на социальные сети и другие каналы связи.
                            </h3>

                            {formData.other_contacts.map((contact, index) => (
                                <div key={index} className="bg-glass2 p-4 rounded-lg space-y-3 ">
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                        {/* Type selector */}
                                        <div>
                                            <label className="block text-sm font-medium mb-2 text-white">
                                                Тип контакта
                                            </label>
                                            <select
                                                value={contact.type}
                                                onChange={(e) => updateSocialContactType(index, e.target.value)}
                                                className="input-glass w-full px-4 py-3 rounded-lg transition-all text-sm sm:text-base"
                                            >
                                                <option value="" className="bg-[#122161]">Выберите тип</option>
                                                {socialMediaOptions.map(option => (
                                                    <option key={option.value} value={option.value} className="bg-[#122161]">
                                                        {option.label}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        {/* Value input */}
                                        <div className='flex gap-x-2 flex-col'>
                                            <label className="block text-sm font-medium mb-2 text-white">
                                                Ссылка или контакт
                                            </label>
                                            <div className='flex gap-x-2'>
                                                <input
                                                    type="text"
                                                    value={contact.value}
                                                    onChange={(e) => updateSocialContactValue(index, e.target.value)}
                                                    className="input-glass w-full px-4 py-2 rounded-lg transition-all text-sm sm:text-base"
                                                    placeholder={
                                                        contact.type
                                                            ? socialMediaOptions.find(opt => opt.value === contact.type)?.placeholder
                                                            : 'Введите ссылку или контакт'
                                                    }
                                                />
                                                {formData.other_contacts.length > 1 && (
                                                    <button
                                                        type="button"
                                                        onClick={() => removeSocialContact(index)}
                                                        className="bg-glass2 px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all text-red-400 text-sm sm:text-base w-full sm:w-auto"
                                                    >
                                                        <RiDeleteBin6Line />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                    </div>

                                    {/* Delete button */}

                                </div>
                            ))}

                            {/* Add new contact button */}
                            <button
                                type="button"
                                onClick={addSocialContact}
                                className="bg-glass2 w-full px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all text-sm sm:text-base flex items-center justify-center gap-2"
                            >
                                <span className="text-xl">+</span>
                                <span>Добавить контакт</span>
                            </button>
                        </div>


                        {/* Service Packages Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Подробное описание пакетов услуг с указанием стоимости. <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Пропишите подробно все доступные пакеты и их стоимость (например: базовый, стандарт, премиум), а также: <br />
                                – минимальный срок выполнения проекта для помещения площадью 40 м²; <br />
                                – дополнительные опции, если они есть.

                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                1. Базовый <br />
                                Стоимость: 2 000₽/м² <br />
                                Включает: чертежи (планировки, схемы), без визуализаций. <br />
                                Срок: 2-3 недели для 40 м². <br /> <br />

                                2. Стандартный <br />
                                Стоимость: 4 000₽/м² <br />
                                Включает: чертежи, 3D-визуализации, смета материалов. <br />
                                Срок: 4-6 недель для 40 м². <br /> <br />

                                3. Премиум <br />
                                Стоимость: 10 000₽/м² <br />
                                Включает: чертежи, визуализации, авторский надзор 2 месяца, подбор материалов. <br />
                                Срок: 6-8 недель для 40 м². <br /> <br />

                                Доп. опции: <br />
                                - Авторский надзор — 3 000₽/выезд 2 часа <br />
                                - Выезд за пределы г. Краснодара — по запросу <br />
                                - Подбор мебели и декора — от 5 000₽.

                            </p>
                            <textarea
                                name="service_packages_description"
                                value={formData.service_packages_description}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="6"
                                placeholder="Подробное описание пакетов услуг и их стоимости"
                                required
                            />
                        </div>

                        {/* VAT Payment */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Возможна ли оплата с учётом НДС? <span className="text-red-400">*</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {vatPaymentOptions.map(option => (
                                    <label key={option.value} className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2 mobile-full">
                                        <input
                                            type="radio"
                                            name="vat_payment"
                                            value={option.value}
                                            checked={formData.vat_payment === option.value}
                                            onChange={handleInputChange}
                                            className="radio-glass"
                                            required
                                        />
                                        <span className="text-white text-sm sm:text-base">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>


                        {/* Supplier Contractor Recommendation Terms */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Условия сотрудничества по рекомендациям от поставщиков или подрядчиков. <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Укажите:<br />
                                – общий процент вознаграждения; <br />
                                – все возможные варианты при разных условиях или ролях; <br />
                                – сроки выплат при заключении договора по рекомендации Вас; <br />
                                – если вы не выплачиваете благодарность за рекомендации, укажите это. <br />

                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например: Благодарность за рекомендацию — 10%. Выплата через месяц после оплаты (прописывайте любые ваши условия).
                            </p>
                            <textarea
                                name="supplier_contractor_recommendation_terms"
                                value={formData.supplier_contractor_recommendation_terms}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="4"
                                placeholder="Условия сотрудничества по рекомендациям"
                                required
                            />
                        </div>

                        {/* Additional Info */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Здесь можно оставить дополнительную информацию, которую вы хотели бы нам рассказать
                            </label>
                            <textarea
                                name="additional_info"
                                value={formData.additional_info}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="3"
                                placeholder="Любая дополнительная информация"
                            />
                        </div>

                        {/* Data Processing Consent */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Согласие на обработку и публикацию персональных данных <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-3">
                                Заполняя настоящую форму, я даю согласие на обработку, хранение, использование и передачу моих персональных данных в рамках проекта «Рейтинг Профи», в том числе на их отображение в личныом кабинете участника и использование другими участниками для профессионального взаимодействия внутри сообщества. <br /> <br />
                                Я подтверждаю, что осознаю и принимаю факт доступности моих персональных данных другим участникам проекта и возможность получения от них сообщений и предложений.
                                Подробные условия обработки персональных данных размещены по ссылке:
                                <a
                                    href="https://reiting-profi-info.taplink.ws/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-blue-300 hover:text-blue-200 underline"
                                >
                                    https://reiting-profi-info.taplink.ws/
                                </a>
                            </p>
                            <label className="bg-glass2 px-4 py-3 sm:py-4 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    name="data_processing_consent"
                                    checked={formData.data_processing_consent}
                                    onChange={handleInputChange}
                                    className="checkbox-glass mt-1"
                                    required
                                />
                                <span className="text-xs sm:text-sm text-white">
                                    Я согласен(на) на обработку и публикацию моих персональных данных
                                </span>
                            </label>
                        </div>

                        {/* Photo Upload */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Прикрепите ваше фото для личного кабинета. <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-3">
                                До 5 файлов, допустимый общий размер файлов — 5 МБ.
                            </p>
                            <div className="file-upload-area bg-glass2 rounded-lg p-4 sm:p-6 text-center">
                                {photoPreview ? (
                                    <div className="space-y-4">
                                        <img
                                            src={photoPreview}
                                            alt="Photo Preview"
                                            className="mx-auto max-w-full sm:max-w-xs max-h-48 object-cover rounded-lg border-2 border-white/30"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, photo: null }));
                                                setPhotoPreview(null);
                                            }}
                                            className="text-red-400 hover:text-red-300 transition-colors text-sm"
                                        >
                                            Удалить фото
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handlePhotoChange}
                                            className="hidden"
                                            multiple
                                        />
                                        <p className="text-white/70 text-sm sm:text-base">Нажмите для загрузки фото</p>
                                        <p className="text-white/50 text-xs sm:text-sm mt-1">Максимальный размер файла: 5MB</p>
                                    </label>
                                )}
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-glass1 w-full px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-semibold text-base sm:text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-8"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                                    <span className="text-sm sm:text-base">Отправка...</span>
                                </>
                            ) : (
                                <>
                                    <span className="text-sm sm:text-base">Отправить заявку на вступление</span>
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4 py-4">
                    <div className="bg-glass1 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl animate-fade-in">
                        <div className="text-center">
                            <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                <div className="text-green-400 text-xl sm:text-3xl">✓</div>
                            </div>
                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                Ваша заявка принята!
                            </h2>
                            <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">
                                Анкета отправлена и находится на рассмотрении.
                                Мы свяжемся с вами в течении 3х рабочих дней.
                            </p>
                            {/* <button
                                onClick={closeModal}
                                className="bg-glass2 w-full px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-opacity-80 transition-all font-medium text-sm sm:text-base"
                            >
                                Закрыть
                            </button> */}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}