'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FaUser, FaEnvelope, FaBuilding, FaCity, FaHandshake, FaVk, FaTelegram, FaPinterest, FaInstagram, FaGlobe, FaPlus, FaTrash, FaCheck, FaTools, FaClock, FaShieldAlt, FaClipboardList } from 'react-icons/fa';

export default function ConstractionBox() {
    const [formData, setFormData] = useState({
        group: '',
        full_name: '',
        brand_name: '',
        email: '',
        responsible_person: '',
        representative_cities: [],
        business_form: '',
        work_list: '',
        welcome_message: '',
        cooperation_terms: '',
        project_timelines: '',
        segments: [],
        vk: '',
        telegram_channel: '',
        pinterest: '',
        instagram: '',
        website: '',
        other_contacts: [],
        work_format: '',
        vat_payment: '',
        guarantees: '',
        designer_supplier_terms: '',
        magazine_cards: '',
        additional_info: '',
        data_processing_consent: false
    });

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            const submitData = {
                ...formData,
                representative_cities: formData.representative_cities.length > 0 ? formData.representative_cities : undefined,
                segments: formData.segments.length > 0 ? formData.segments : undefined,
                other_contacts: formData.other_contacts.length > 0 ? formData.other_contacts : undefined
            };

            // Remove empty optional fields
            Object.keys(submitData).forEach(key => {
                if (submitData[key] === '' || submitData[key] === undefined) {
                    delete submitData[key];
                }
            });

            await axios.post('https://api.reiting-profi.ru/api/v1/accounts/repair-questionnaires/', submitData);

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
                work_list: '',
                welcome_message: '',
                cooperation_terms: '',
                project_timelines: '',
                segments: [],
                vk: '',
                telegram_channel: '',
                pinterest: '',
                instagram: '',
                website: '',
                other_contacts: [],
                work_format: '',
                vat_payment: '',
                guarantees: '',
                designer_supplier_terms: '',
                magazine_cards: '',
                additional_info: '',
                data_processing_consent: false
            });
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
            `}</style>

            <div className="max-w-4xl mx-auto">
                <div className="bg-glass1 rounded-2xl p-8 sm:p-10 shadow-2xl">
                    <h1 className="text-3xl sm:text-4xl font-bold text-center mb-2 text-white">
                        Анкета ремонтной
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
                                <FaCity /> Города представительств
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

                        {/* Work List */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaTools /> Перечень работ
                            </label>
                            <textarea
                                name="work_list"
                                value={formData.work_list}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="4"
                                placeholder="Перечень работ которые можете предоставить"
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

                        {/* Project Timelines */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaClock /> Сроки выполнения проектов
                            </label>
                            <textarea
                                name="project_timelines"
                                value={formData.project_timelines}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="3"
                                placeholder="Сроки выполнения проектов в 1К, 2К и 3К квартирах средней площади"
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
                                    <FaGlobe /> Ваш сайт
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
                                Другое - дополнительные контакты
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

                        {/* Work Format */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white flex items-center gap-2">
                                <FaClipboardList /> Формат работы
                            </label>
                            <textarea
                                name="work_format"
                                value={formData.work_format}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="3"
                                placeholder="Опишите формат работы"
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

                        {/* Designer Supplier Terms */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Условия работы с дизайнерами и/или поставщиками
                            </label>
                            <textarea
                                name="designer_supplier_terms"
                                value={formData.designer_supplier_terms}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none"
                                rows="3"
                                placeholder="Условия работы с дизайнерами и/или поставщиками"
                            />
                        </div>

                        {/* Magazine Cards */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Выдаёте ли вы карточки журналов при рекомендации при заключении договора?
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