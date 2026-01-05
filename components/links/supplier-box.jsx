'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaBuilding, FaCity, FaHandshake, FaVk, FaTelegram, FaPinterest, FaInstagram, FaGlobe, FaPlus, FaTrash, FaCheck, FaCamera, FaFileAlt, FaTruck, FaShieldAlt, FaBox } from 'react-icons/fa';

export default function SupplierBox() {
    const [formData, setFormData] = useState({
        group: 'supplier',
        full_name: '',
        brand_name: '',
        email: '',
        responsible_person: '',
        representative_cities: [],
        business_form: '',
        product_assortment: '',
        welcome_message: '',
        cooperation_terms: '',
        segments: [],
        vk: '',
        telegram_channel: '',
        pinterest: '',
        instagram: '',
        website: '',
        other_contacts: [],
        delivery_terms: '',
        vat_payment: '',
        guarantees: '',
        designer_contractor_terms: '',
        magazine_cards: '',
        data_processing_consent: false,
        company_logo: null,
        legal_entity_card: null
    });

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const [cardFileName, setCardFileName] = useState('');

    const groupOptions = [
        { value: 'media', label: 'Медиа' },
        { value: 'supplier', label: 'Поставщик' },
        { value: 'repair', label: 'Ремонт' },
        { value: 'design', label: 'Дизайн' }
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

    const handleSegmentToggle = (segmentValue) => {
        setFormData(prev => ({
            ...prev,
            segments: prev.segments.includes(segmentValue)
                ? prev.segments.filter(s => s !== segmentValue)
                : [...prev.segments, segmentValue]
        }));
    };

    const addRepresentativeCity = () => {
        setFormData(prev => ({
            ...prev,
            representative_cities: [...prev.representative_cities, '']
        }));
    };

    const removeRepresentativeCity = (index) => {
        setFormData(prev => ({
            ...prev,
            representative_cities: prev.representative_cities.filter((_, i) => i !== index)
        }));
    };

    const updateRepresentativeCity = (index, value) => {
        setFormData(prev => ({
            ...prev,
            representative_cities: prev.representative_cities.map((city, i) =>
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

    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                toast.error('Размер файла не должен превышать 5MB');
                return;
            }
            setFormData(prev => ({ ...prev, company_logo: file }));

            const reader = new FileReader();
            reader.onloadend = () => {
                setLogoPreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleCardChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Размер файла не должен превышать 10MB');
                return;
            }
            setFormData(prev => ({ ...prev, legal_entity_card: file }));
            setCardFileName(file.name);
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
        if (!formData.brand_name) {
            toast.error('Пожалуйста, введите название бренда');
            return;
        }
        if (!formData.email) {
            toast.error('Пожалуйста, введите email');
            return;
        }
        if (!formData.responsible_person) {
            toast.error('Пожалуйста, введите данные ответственного лица');
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
            submitFormData.append('brand_name', formData.brand_name);
            submitFormData.append('email', formData.email);
            submitFormData.append('responsible_person', formData.responsible_person);
            if (formData.representative_cities.length > 0) submitFormData.append('representative_cities', JSON.stringify(formData.representative_cities));
            if (formData.business_form) submitFormData.append('business_form', formData.business_form);
            if (formData.product_assortment) submitFormData.append('product_assortment', formData.product_assortment);
            if (formData.welcome_message) submitFormData.append('welcome_message', formData.welcome_message);
            if (formData.cooperation_terms) submitFormData.append('cooperation_terms', formData.cooperation_terms);
            if (formData.segments.length > 0) submitFormData.append('segments', JSON.stringify(formData.segments));
            if (formData.vk) submitFormData.append('vk', formData.vk);
            if (formData.telegram_channel) submitFormData.append('telegram_channel', formData.telegram_channel);
            if (formData.pinterest) submitFormData.append('pinterest', formData.pinterest);
            if (formData.instagram) submitFormData.append('instagram', formData.instagram);
            if (formData.website) submitFormData.append('website', formData.website);
            if (formData.other_contacts.length > 0) submitFormData.append('other_contacts', JSON.stringify(formData.other_contacts));
            if (formData.delivery_terms) submitFormData.append('delivery_terms', formData.delivery_terms);
            if (formData.vat_payment) submitFormData.append('vat_payment', formData.vat_payment);
            if (formData.guarantees) submitFormData.append('guarantees', formData.guarantees);
            if (formData.designer_contractor_terms) submitFormData.append('designer_contractor_terms', formData.designer_contractor_terms);
            if (formData.magazine_cards) submitFormData.append('magazine_cards', formData.magazine_cards);
            submitFormData.append('data_processing_consent', formData.data_processing_consent);
            if (formData.company_logo) submitFormData.append('company_logo', formData.company_logo);
            if (formData.legal_entity_card) submitFormData.append('legal_entity_card', formData.legal_entity_card);

            await axios.post('https://api.reiting-profi.ru/api/v1/accounts/supplier-questionnaires/', submitFormData, {
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
                brand_name: '',
                email: '',
                responsible_person: '',
                representative_cities: [],
                business_form: '',
                product_assortment: '',
                welcome_message: '',
                cooperation_terms: '',
                segments: [],
                vk: '',
                telegram_channel: '',
                pinterest: '',
                instagram: '',
                website: '',
                other_contacts: [],
                delivery_terms: '',
                vat_payment: '',
                guarantees: '',
                designer_contractor_terms: '',
                magazine_cards: '',
                data_processing_consent: false,
                company_logo: null,
                legal_entity_card: null
            });
            setLogoPreview(null);
            setCardFileName('');
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

                .file-upload-area {
                    border: 2px dashed rgba(255, 255, 255, 0.3);
                    transition: all 0.3s ease;
                }

                .file-upload-area:hover {
                    border-color: rgba(255, 255, 255, 0.5);
                    background: rgba(255, 255, 255, 0.08);
                }
            `}</style>

            <div className="max-w-4xl mx-auto">
                <div className="bg-glass1 rounded-2xl p-8 sm:p-10 shadow-2xl">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-white">
                        Анкета поставщика
                    </h1>
                    <p className="text-center text-white/70 mb-8">
                        Заполните форму для регистрации в сообществе
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Group Selection */}
                        {/* <div>
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
                        </div> */}

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

                        {/* Brand Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaBuilding /> Название бренда <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="brand_name"
                                value={formData.brand_name}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                placeholder="Название бренда (дополнительно в скобках укажите полное юридическое наименование компании)"
                                required
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

                        {/* Responsible Person */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaUser /> Ответственное лицо <span className="text-red-400">*</span>
                            </label>
                            <input
                                type="text"
                                name="responsible_person"
                                value={formData.responsible_person}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all"
                                placeholder="Имя, должность и контактный номер ответственного лица"
                                required
                            />
                        </div>

                        {/* Representative Cities */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaCity /> Города представительств или салонов
                            </label>
                            {formData.representative_cities.map((city, index) => (
                                <div key={index} className="flex gap-2 mb-2">
                                    <input
                                        type="text"
                                        value={city}
                                        onChange={(e) => updateRepresentativeCity(index, e.target.value)}
                                        className="input-glass flex-1 px-4 py-2 rounded-lg transition-all"
                                        placeholder="Город"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeRepresentativeCity(index)}
                                        className="bg-glass2 px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all text-red-400"
                                    >
                                        <FaTrash />
                                    </button>
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addRepresentativeCity}
                                className="bg-glass2 w-full px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all flex items-center justify-center gap-2"
                            >
                                <FaPlus /> Добавить город
                            </button>
                        </div>

                        {/* Business Form */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Форма бизнеса
                            </label>
                            <div className="flex flex-wrap gap-4">
                                <label className="bg-glass2 px-6 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="business_form"
                                        value="own_business"
                                        checked={formData.business_form === 'own_business'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-white">Собственный бизнес</span>
                                </label>
                                <label className="bg-glass2 px-6 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="business_form"
                                        value="franchise"
                                        checked={formData.business_form === 'franchise'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-white">Франшиза</span>
                                </label>
                            </div>
                        </div>

                        {/* Product Assortment */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaBox /> Ассортимент продукции
                            </label>
                            <textarea
                                name="product_assortment"
                                value={formData.product_assortment}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="4"
                                placeholder="Опишите ассортимент вашей продукции"
                            />
                        </div>

                        {/* Welcome Message */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Приветственное сообщение о вашей компании
                            </label>
                            <textarea
                                name="welcome_message"
                                value={formData.welcome_message}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="4"
                                placeholder="Приветственное сообщение о вашей компании"
                            />
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
                                placeholder="Условия сотрудничества при работе с клиентами из других городов или регионов"
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
                                    <FaGlobe /> Veb-sayt
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
                                Boshqa - дополнительные контакты
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

                        {/* Delivery Terms */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaTruck /> Сроки поставки и формат работы
                            </label>
                            <textarea
                                name="delivery_terms"
                                value={formData.delivery_terms}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="3"
                                placeholder="Укажите сроки поставки и формат работы"
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

                        {/* Guarantees */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaShieldAlt /> Гарантии и их сроки
                            </label>
                            <textarea
                                name="guarantees"
                                value={formData.guarantees}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="3"
                                placeholder="Укажите гарантии и их сроки"
                            />
                        </div>

                        {/* Designer Contractor Terms */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Условия работы с дизайнерами и/или подрядчиками
                            </label>
                            <textarea
                                name="designer_contractor_terms"
                                value={formData.designer_contractor_terms}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="3"
                                placeholder="Условия работы с дизайнерами и/или подрядчиками"
                            />
                        </div>

                        {/* Magazine Cards */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Выдаёте ли вы карточки журналов при покупке продукции?
                            </label>
                            <div className="grid grid-cols-2 gap-3">
                                <label className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="magazine_cards"
                                        value="hi_home"
                                        checked={formData.magazine_cards === 'hi_home'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-white text-sm">Hi Home</span>
                                </label>
                                <label className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="magazine_cards"
                                        value="in_home"
                                        checked={formData.magazine_cards === 'in_home'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-white text-sm">IN HOME</span>
                                </label>
                                <label className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="magazine_cards"
                                        value="no"
                                        checked={formData.magazine_cards === 'no'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-white text-sm">Нет</span>
                                </label>
                                <label className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="magazine_cards"
                                        value="other"
                                        checked={formData.magazine_cards === 'other'}
                                        onChange={handleInputChange}
                                        className="w-4 h-4"
                                    />
                                    <span className="text-white text-sm">Другое</span>
                                </label>
                            </div>
                        </div>

                        {/* Company Logo Upload */}
                        {/* <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaCamera /> Логотип компании (shaxsiy kabinet uchun)
                            </label>
                            <div className="file-upload-area bg-glass2 rounded-lg p-6 text-center">
                                {logoPreview ? (
                                    <div className="space-y-4">
                                        <img
                                            src={logoPreview}
                                            alt="Logo Preview"
                                            className="mx-auto max-w-xs max-h-40 object-contain rounded-lg border-2 border-white/30"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, company_logo: null }));
                                                setLogoPreview(null);
                                            }}
                                            className="text-red-400 hover:text-red-300 transition-colors text-sm"
                                        >
                                            Удалить логотип
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleLogoChange}
                                            className="hidden"
                                        />
                                        <FaCamera className="mx-auto text-4xl text-white/50 mb-2" />
                                        <p className="text-white/70">Нажмите для загрузки логотипа</p>
                                        <p className="text-white/50 text-sm mt-1">Максимальный размер: 5MB</p>
                                    </label>
                                )}
                            </div>
                        </div> */}

                        {/* Legal Entity Card Upload */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaFileAlt /> Yuridik shaxs kartasi (shartnoma uchun)
                            </label>
                            <div className="file-upload-area bg-glass2 rounded-lg p-6 text-center">
                                {cardFileName ? (
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-center gap-2 text-white/80">
                                            <FaFileAlt className="text-2xl" />
                                            <span className="text-sm">{cardFileName}</span>
                                        </div>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setFormData(prev => ({ ...prev, legal_entity_card: null }));
                                                setCardFileName('');
                                            }}
                                            className="text-red-400 hover:text-red-300 transition-colors text-sm"
                                        >
                                            Удалить файл
                                        </button>
                                    </div>
                                ) : (
                                    <label className="cursor-pointer">
                                        <input
                                            type="file"
                                            accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
                                            onChange={handleCardChange}
                                            className="hidden"
                                        />
                                        <FaFileAlt className="mx-auto text-4xl text-white/50 mb-2" />
                                        <p className="text-white/70">Нажмите для загрузки документа</p>
                                        <p className="text-white/50 text-sm mt-1">PDF, DOC, DOCX, JPG, PNG • Макс. 10MB</p>
                                    </label>
                                )}
                            </div>
                        </div>

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