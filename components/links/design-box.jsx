'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUser, FaPhone, FaEnvelope, FaCity, FaBuilding, FaBriefcase, FaHandshake, FaVk, FaTelegram, FaPinterest, FaInstagram, FaGlobe, FaPlus, FaTrash, FaCheck, FaCamera, FaCalendar } from 'react-icons/fa';

export default function DesignBox() {
    const [formData, setFormData] = useState({
        group: '',
        full_name: '',
        full_name_en: '',
        phone: '',
        birth_date: '',
        email: '',
        city: '',
        services: [],
        work_type: '',
        welcome_message: '',
        work_cities: [],
        cooperation_terms: '',
        segments: [],
        unique_trade_proposal: '',
        vk: '',
        telegram_channel: '',
        pinterest: '',
        instagram: '',
        website: '',
        other_contacts: [],
        service_packages_description: '',
        vat_payment: '',
        supplier_contractor_recommendation_terms: '',
        additional_info: '',
        data_processing_consent: false,
        photo: null
    });

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [photoPreview, setPhotoPreview] = useState(null);

    const groupOptions = [
        { value: 'designer', label: 'Дизайнер' },
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
        { value: 'designer_horika', label: 'Дизайнер Хорика' },
        { value: 'residential_designer', label: 'Дизайнер жилой недвижимости' },
        { value: 'commercial_designer', label: 'Дизайнер коммерческой недвижимости' },
        { value: 'completing', label: 'Комплектация' },
        { value: 'landscape_design', label: 'Ландшафтный дизайн' },
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

    const addWorkCity = () => {
        setFormData(prev => ({
            ...prev,
            work_cities: [...prev.work_cities, '']
        }));
    };

    const removeWorkCity = (index) => {
        setFormData(prev => ({
            ...prev,
            work_cities: prev.work_cities.filter((_, i) => i !== index)
        }));
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
        setFormData(prev => ({
            ...prev,
            other_contacts: prev.other_contacts.filter((_, i) => i !== index)
        }));
    };

    const updateOtherContact = (index, value) => {
        setFormData(prev => ({
            ...prev,
            other_contacts: prev.other_contacts.map((contact, i) =>
                i === index ? value : contact
            )
        }));
    };

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
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
        if (!formData.phone) {
            toast.error('Пожалуйста, введите номер телефона');
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
        if (!formData.data_processing_consent) {
            toast.error('Необходимо согласие на обработку данных');
            return;
        }

        setIsSubmitting(true);

        try {
            const submitFormData = new FormData();

            // Add all fields to FormData
            submitFormData.append('group', formData.group);
            submitFormData.append('full_name', formData.full_name);
            if (formData.full_name_en) submitFormData.append('full_name_en', formData.full_name_en);
            submitFormData.append('phone', formData.phone);
            if (formData.birth_date) submitFormData.append('birth_date', formData.birth_date);
            submitFormData.append('email', formData.email);
            submitFormData.append('city', formData.city);
            submitFormData.append('services', JSON.stringify(formData.services));
            if (formData.work_type) submitFormData.append('work_type', formData.work_type);
            if (formData.welcome_message) submitFormData.append('welcome_message', formData.welcome_message);
            if (formData.work_cities.length > 0) submitFormData.append('work_cities', JSON.stringify(formData.work_cities));
            if (formData.cooperation_terms) submitFormData.append('cooperation_terms', formData.cooperation_terms);
            if (formData.segments.length > 0) submitFormData.append('segments', JSON.stringify(formData.segments));
            if (formData.unique_trade_proposal) submitFormData.append('unique_trade_proposal', formData.unique_trade_proposal);
            if (formData.vk) submitFormData.append('vk', formData.vk);
            if (formData.telegram_channel) submitFormData.append('telegram_channel', formData.telegram_channel);
            if (formData.pinterest) submitFormData.append('pinterest', formData.pinterest);
            if (formData.instagram) submitFormData.append('instagram', formData.instagram);
            if (formData.website) submitFormData.append('website', formData.website);
            if (formData.other_contacts.length > 0) submitFormData.append('other_contacts', JSON.stringify(formData.other_contacts));
            if (formData.service_packages_description) submitFormData.append('service_packages_description', formData.service_packages_description);
            if (formData.vat_payment) submitFormData.append('vat_payment', formData.vat_payment);
            if (formData.supplier_contractor_recommendation_terms) submitFormData.append('supplier_contractor_recommendation_terms', formData.supplier_contractor_recommendation_terms);
            if (formData.additional_info) submitFormData.append('additional_info', formData.additional_info);
            submitFormData.append('data_processing_consent', formData.data_processing_consent);
            if (formData.photo) submitFormData.append('photo', formData.photo);

            await axios.post('https://api.reiting-profi.ru/api/v1/accounts/questionnaires/', submitFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setShowModal(true);
            toast.success('Анкета успешно отправлена!');

            // Reset form
            setFormData({
                group: '',
                full_name: '',
                full_name_en: '',
                phone: '',
                birth_date: '',
                email: '',
                city: '',
                services: [],
                work_type: '',
                welcome_message: '',
                work_cities: [],
                cooperation_terms: '',
                segments: [],
                unique_trade_proposal: '',
                vk: '',
                telegram_channel: '',
                pinterest: '',
                instagram: '',
                website: '',
                other_contacts: [],
                service_packages_description: '',
                vat_payment: '',
                supplier_contractor_recommendation_terms: '',
                additional_info: '',
                data_processing_consent: false,
                photo: null
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
        <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8" style={{ background: '#122161' }}>
            <style>{`
                .bg-glass2 {
                    background: linear-gradient(91.53deg, rgba(255, 255, 255, 0.044) -6.96%, rgba(255, 255, 255, 0.029) 106.1%);
                    border: 1px solid rgba(255, 255, 255, 0.2);
                    backdrop-filter: blur(70px);
                    box-shadow: 0px 0px 30px -9px #FFFFFF66 inset;
                    color: white;
                }

                .bg-glass1 {
                    background: linear-gradient(91.53deg, rgba(255, 255, 255, 0.2024) -6.96%, rgba(255, 255, 255, 0.1334) 106.1%);
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

                .photo-upload-area {
                    border: 2px dashed rgba(255, 255, 255, 0.3);
                    transition: all 0.3s ease;
                }

                .photo-upload-area:hover {
                    border-color: rgba(255, 255, 255, 0.5);
                    background: rgba(255, 255, 255, 0.08);
                }
            `}</style>

            <div className="max-w-4xl mx-auto">
                <div className="bg-glass1 rounded-2xl p-8 sm:p-10 shadow-2xl">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-white">
                        Анкета дизайнера
                    </h1>
                    <p className="text-center text-white/70 mb-8">
                        Заполните форму для регистрации в сообществе
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Group Selection */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaBuilding /> Группа <span className="text-red-400">*</span>
                            </label>
                            <select
                                name="group"
                                value={formData.group}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                required
                            >
                                <option value="" className="bg-[#122161]">Выберите группу</option>
                                {groupOptions.map(option => (
                                    <option key={option.value} value={option.value} className="bg-[#122161]">
                                        {option.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaUser /> ФИО <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="full_name"
                                value={formData.full_name}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                placeholder="Введите ваше ФИО"
                                required
                            />
                        </div>

                        {/* Full Name EN */}
                        {/* <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaUser /> ФИО на английском
                            </label>
                            <input
                                type="text"
                                name="full_name_en"
                                value={formData.full_name_en}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                placeholder="Full Name in English"
                            />
                        </div> */}

                        {/* Phone */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaPhone /> Номер телефона <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="tel"
                                name="phone"
                                value={formData.phone}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                placeholder="+7 (999) 999-99-99"
                                required
                            />
                        </div>

                        {/* Birth Date */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaCalendar /> Дата рождения
                            </label>
                            <input
                                type="date"
                                name="birth_date"
                                value={formData.birth_date}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                            />
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaEnvelope /> E-mail <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                placeholder="example@email.com"
                                required
                            />
                        </div>

                        {/* City */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaCity /> Город проживания <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="city"
                                value={formData.city}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                placeholder="Введите город"
                                required
                            />
                        </div>

                        {/* Services */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Услуги <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
                                        />
                                        <span className="text-sm text-white">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Work Type */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Тип работы
                            </label>
                            <div className="flex flex-wrap gap-4">
                                <label className="bg-glass2 px-6 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="work_type"
                                        value="own_name"
                                        checked={formData.work_type === 'own_name'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-white">Под собственным именем</span>
                                </label>
                                <label className="bg-glass2 px-6 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="work_type"
                                        value="studio"
                                        checked={formData.work_type === 'studio'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-white">В студии</span>
                                </label>
                            </div>
                        </div>

                        {/* Welcome Message */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Приветственное сообщение о вас и вашем опыте
                            </label>
                            <textarea
                                name="welcome_message"
                                value={formData.welcome_message}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="4"
                                placeholder="Расскажите о себе и своем опыте"
                            />
                        </div>

                        {/* Work Cities */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaCity /> Города работы
                            </label>
                            {formData.work_cities.map((city, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => updateWorkCity(index, e.target.value)}
                                        className="input-glass flex-1 px-4 py-2 rounded-lg transition-all"
                                        placeholder="Город"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeWorkCity(index)}
                                        className="bg-glass2 px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all text-red-400"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addWorkCity}
                                className="bg-glass2 w-full px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all flex items-center justify-center gap-2"
                            >
                                <FaPlus /> Добавить город
                            </button>
                        </div>

                        {/* Cooperation Terms */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaHandshake /> Условия сотрудничества
                            </label>
                            <textarea
                                name="cooperation_terms"
                                value={formData.cooperation_terms}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="3"
                                placeholder="Условия работы с объектами в других городах или регионах"
                            />
                        </div>

                        {/* Segments */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Сегменты работы
                            </label>
                            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
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
                                        />
                                        <span className="text-sm text-white">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Unique Trade Proposal */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaBriefcase /> Уникальное торговое предложение (УТП)
                            </label>
                            <textarea
                                name="unique_trade_proposal"
                                value={formData.unique_trade_proposal}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="3"
                                placeholder="Ваше уникальное торговое предложение"
                            />
                        </div>

                        {/* Social Media Links */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">Социальные сети и контакты</h3>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                    <FaVk /> VK
                                </label>
                                <input
                                    type="text"
                                    name="vk"
                                    value={formData.vk}
                                    onChange={handleInputChange}
                                    className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                    placeholder="Ссылка на VK"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                    <FaTelegram /> Telegram
                                </label>
                                <input
                                    type="text"
                                    name="telegram_channel"
                                    value={formData.telegram_channel}
                                    onChange={handleInputChange}
                                    className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                    placeholder="Ссылка на Telegram канал"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                    <FaPinterest /> Pinterest
                                </label>
                                <input
                                    type="text"
                                    name="pinterest"
                                    value={formData.pinterest}
                                    onChange={handleInputChange}
                                    className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                    placeholder="Ссылка на Pinterest"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                    <FaInstagram /> Instagram
                                </label>
                                <input
                                    type="text"
                                    name="instagram"
                                    value={formData.instagram}
                                    onChange={handleInputChange}
                                    className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                    placeholder="Ссылка на Instagram"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                    <FaGlobe /> Веб-сайт
                                </label>
                                <input
                                    type="url"
                                    name="website"
                                    value={formData.website}
                                    onChange={handleInputChange}
                                    className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                    placeholder="https://example.com"
                                />
                            </div>
                        </div>

                        {/* Other Contacts */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Дополнительные контакты
                            </label>
                            {formData.other_contacts.map((contact, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={contact}
                                        onChange={(e) => updateOtherContact(index, e.target.value)}
                                        className="input-glass flex-1 px-4 py-2 rounded-lg transition-all"
                                        placeholder="Дополнительный контакт"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeOtherContact(index)}
                                        className="bg-glass2 px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all text-red-400"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addOtherContact}
                                className="bg-glass2 w-full px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all flex items-center justify-center gap-2"
                            >
                                <FaPlus /> Добавить контакт
                            </button>
                        </div>

                        {/* Service Packages Description */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Описание пакетов услуг с указанием стоимости
                            </label>
                            <textarea
                                name="service_packages_description"
                                value={formData.service_packages_description}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="4"
                                placeholder="Подробное описание пакетов услуг и их стоимости"
                            />
                        </div>

                        {/* VAT Payment */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Возможна ли оплата с учётом НДС?
                            </label>
                            <div className="flex gap-4">
                                <label className="bg-glass2 px-6 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="vat_payment"
                                        value="yes"
                                        checked={formData.vat_payment === 'yes'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-white">Да</span>
                                </label>
                                <label className="bg-glass2 px-6 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="vat_payment"
                                        value="no"
                                        checked={formData.vat_payment === 'no'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-white">Нет</span>
                                </label>
                            </div>
                        </div>

                        {/* Supplier Contractor Recommendation Terms */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Условия сотрудничества по рекомендациям
                            </label>
                            <textarea
                                name="supplier_contractor_recommendation_terms"
                                value={formData.supplier_contractor_recommendation_terms}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="3"
                                placeholder="Условия сотрудничества по рекомендациям от поставщиков или подрядчиков"
                            />
                        </div>

                        {/* Additional Info */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Дополнительная информация
                            </label>
                            <textarea
                                name="additional_info"
                                value={formData.additional_info}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="3"
                                placeholder="Любая дополнительная информация"
                            />
                        </div>

                        {/* Photo Upload */}
                        {/* <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaCamera /> Фото для личного кабинета
                            </label>
                            <div className="photo-upload-area bg-glass2 rounded-lg p-6 text-center">
                                {photoPreview ? (
                                    <div className="space-y-4">
                                        <img
                                            src={photoPreview}
                                            alt="Preview"
                                            className="mx-auto w-32 h-32 object-cover rounded-full border-2 border-white/30"
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
                                        />
                                        <FaCamera className="mx-auto text-4xl text-white/50 mb-2" />
                                        <p className="text-white/70">Нажмите для загрузки фото</p>
                                        <p className="text-white/50 text-sm mt-1">Максимальный размер: 5MB</p>
                                    </label>
                                )}
                            </div>
                        </div> */}

                        {/* Data Processing Consent */}
                        <div>
                            <label className="bg-glass2 px-4 py-4 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-start gap-3">
                                <input
                                    type="checkbox"
                                    name="data_processing_consent"
                                    checked={formData.data_processing_consent}
                                    onChange={handleInputChange}
                                    className="checkbox-glass mt-1"
                                    required
                                />
                                <span className="text-sm text-white">
                                    Я согласен(на) на обработку моих персональных данных <span className="text-red-400">*</span>
                                </span>
                            </label>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-glass1 w-full px-8 py-4 rounded-lg font-semibold text-lg hover:bg-opacity-90 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                                    Отправка...
                                </>
                            ) : (
                                <>
                                    <FaCheck /> Отправить анкету
                                </>
                            )}
                        </button>
                    </form>
                </div>
            </div>

            {/* Success Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
                    <div className="bg-glass1 rounded-2xl p-8 max-w-md w-full shadow-2xl animate-fade-in">
                        <div className="text-center">
                            <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mb-4">
                                <FaCheck className="text-green-400 text-3xl" />
                            </div>
                            <h2 className="text-2xl font-bold text-white mb-2">
                                Успешно отправлено!
                            </h2>
                            <p className="text-white/70 mb-6">
                                Ваша анкета успешно отправлена. Мы свяжемся с вами в ближайшее время.
                            </p>
                            <button
                                onClick={closeModal}
                                className="bg-glass2 w-full px-6 py-3 rounded-lg hover:bg-opacity-80 transition-all font-medium"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}