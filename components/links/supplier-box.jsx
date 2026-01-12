'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function SupplierBox() {
    const [formData, setFormData] = useState({
        group: 'supplier',
        full_name: 'без имени',
        brand_name: '',
        phone: '',
        email: '',
        responsible_person: '',
        representative_cities: [''],
        business_form: '',
        business_form_details: '',
        product_assortment: '',
        welcome_message: '',
        cooperation_terms: '',
        segments: [],
        vk: '',
        telegram_channel: '',
        pinterest: '',
        instagram: '',
        website: '',
        other_contacts: [''],
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
        { value: 'designer', label: 'Дизайнер' },
        { value: 'architect', label: 'Архитектор' },
        { value: 'decorator', label: 'Декоратор' },
        { value: 'landscape_designer', label: 'Ландшафтный дизайнер' },
        { value: 'light_designer', label: 'Светодизайнер' },
        { value: 'interior_designer', label: 'Дизайнер интерьера' },
        { value: 'repair_team', label: 'Ремонтная бригада' },
        { value: 'contractor', label: 'Подрядчик' },
        { value: 'supplier', label: 'Поставщик' },
        { value: 'factory', label: 'Фабрика' },
        { value: 'salon', label: 'Салон' }
    ];

    const segmentOptions = [
        { value: 'horeca', label: 'HoReCa' },
        { value: 'business', label: 'Бизнес' },
        { value: 'comfort', label: 'Комфорт' },
        { value: 'premium', label: 'Премиум' },
        { value: 'medium', label: 'Средний' },
        { value: 'economy', label: 'Эконом' }
    ];

    const vatPaymentOptions = [
        { value: 'yes', label: 'Да' },
        { value: 'no', label: 'Нет' }
    ];

    const magazineCardsOptions = [
        { value: 'hi_home', label: 'Hi Home' },
        { value: 'in_home', label: 'IN HOME' },
        { value: 'no', label: 'Нет' },
        { value: 'other', label: 'Другое' }
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
        if (formData.representative_cities.length > 1) {
            setFormData(prev => ({
                ...prev,
                representative_cities: prev.representative_cities.filter((_, i) => i !== index)
            }));
        }
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
        if (formData.other_contacts.length > 1) {
            setFormData(prev => ({
                ...prev,
                other_contacts: prev.other_contacts.filter((_, i) => i !== index)
            }));
        }
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
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const totalSize = files.reduce((sum, file) => sum + file.size, 0);

            if (totalSize > 20 * 1024 * 1024) {
                toast.error('Общий размер файлов не должен превышать 20MB');
                return;
            }

            // For now, take only first file for logo
            const file = files[0];
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
        const files = Array.from(e.target.files);
        if (files.length > 0) {
            const totalSize = files.reduce((sum, file) => sum + file.size, 0);

            if (totalSize > 20 * 1024 * 1024) {
                toast.error('Общий размер файлов не должен превышать 20MB');
                return;
            }

            // For now, take only first file for legal entity card
            const file = files[0];
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
        if (!formData.representative_cities[0] || formData.representative_cities.every(city => !city.trim())) {
            toast.error('Пожалуйста, укажите города представительств или салонов');
            return;
        }
        if (!formData.business_form) {
            toast.error('Пожалуйста, укажите форму бизнеса');
            return;
        }
        if (!formData.product_assortment) {
            toast.error('Пожалуйста, опишите ассортимент продукции');
            return;
        }
        if (!formData.welcome_message) {
            toast.error('Пожалуйста, введите приветственное сообщение');
            return;
        }
        if (!formData.cooperation_terms) {
            toast.error('Пожалуйста, укажите условия сотрудничества');
            return;
        }
        if (!formData.delivery_terms) {
            toast.error('Пожалуйста, укажите сроки поставки и формат работы');
            return;
        }
        if (!formData.vat_payment) {
            toast.error('Пожалуйста, укажите возможность оплаты с НДС');
            return;
        }
        if (!formData.guarantees) {
            toast.error('Пожалуйста, укажите гарантии и их сроки');
            return;
        }
        if (!formData.designer_contractor_terms) {
            toast.error('Пожалуйста, укажите условия работы с дизайнерами/подрядчиками');
            return;
        }
        if (!formData.magazine_cards) {
            toast.error('Пожалуйста, укажите выдачу карточек журналов');
            return;
        }
        if (!formData.data_processing_consent) {
            toast.error('Необходимо согласие на обработку данных');
            return;
        }

        setIsSubmitting(true);

        try {
            const submitFormData = new FormData();

            // Add all fields to FormData according to new API structure
            Object.keys(formData).forEach(key => {
                const value = formData[key];

                if (key === 'company_logo' || key === 'legal_entity_card') {
                    if (value) submitFormData.append(key, value);
                } else if (key === 'representative_cities' || key === 'other_contacts') {
                    // Filter out empty strings
                    const filteredValues = value.filter(v => v.trim() !== '');
                    if (filteredValues.length > 0) submitFormData.append(key, JSON.stringify(filteredValues));
                } else if (key === 'segments') {
                    if (value.length > 0) submitFormData.append(key, JSON.stringify(value));
                } else if (key === 'data_processing_consent') {
                    submitFormData.append(key, value.toString());
                } else if (value !== '' && value !== null) {
                    submitFormData.append(key, value);
                }
            });

            await axios.post('https://api.reiting-profi.ru/api/v1/accounts/supplier-questionnaires/', submitFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setShowModal(true);
            toast.success('Анкета успешно отправлена!');

            // Reset form
            setFormData({
                group: 'supplier',
                brand_name: '',
                email: '',
                phone: '',
                responsible_person: '',
                representative_cities: [''],
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
                other_contacts: [''],
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
                        ПОСТАВЩИКИ
                    </h1>


                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Group Selection - Hidden with default value */}
                        <input type="hidden" name="group" value="supplier" />

                        {/* Brand Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Название бренда <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                (дополнительно в скобках укажите полное юридическое наименование компании)
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например: Линия Дверей, Аквамир, Dantone
                            </p>
                            <input
                                type="text"
                                name="brand_name"
                                value={formData.brand_name}
                                onChange={handleInputChange}
                                className="input-glass px-4 py-3 rounded-lg transition-all text-sm sm:text-base"
                                placeholder="Название бренда"
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
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Номер телефона
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

                        {/* Responsible Person */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Имя, должность и контактный номер ответственного лица <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Указываем контакт человека который будет иметь доступ к платформе.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например: Возова Татьяна, управляющая салоном, 8918 000 00 00
                            </p>
                            <input
                                type="text"
                                name="responsible_person"
                                value={formData.responsible_person}
                                onChange={handleInputChange}
                                className="input-glass px-4 py-3 rounded-lg transition-all text-sm sm:text-base"
                                placeholder="Имя, должность и контактный номер"
                                required
                            />
                        </div>

                        {/* Representative Cities */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                В каких городах располагаются ваши представительства или салоны? <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Опишите подробно, где вы работаете, и укажите адрес каждого салона, контакты и район города, в котором он расположен.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                Москва, ул. Новый Арбат, дом 203, офис 16, телефон 8 910 000 00 00<br />
                                Краснодар, ул. Тургенева, дом 111, телефон 8 900 000 00 00<br />
                                Туапсе, ул. Кореновская, дом 4, офис 2, телефон 8 800 500 00 00
                            </p>
                            {formData.representative_cities.map((city, index) => (
                                <div key={index} className="flex gap-2 mb-3 mobile-stack">
                                    <textarea
                                        value={city}
                                        onChange={(e) => updateRepresentativeCity(index, e.target.value)}
                                        className="input-glass flex-1 px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                        rows="3"
                                        placeholder="Город, адрес, контакты"
                                        required={index === 0}
                                    />
                                    {formData.representative_cities.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removeRepresentativeCity(index)}
                                            className="bg-glass2 px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all text-red-400 text-sm sm:text-base flex-shrink-0 h-fit"
                                        >
                                            Удалить
                                        </button>
                                    )}
                                </div>
                            ))}
                            <button
                                type="button"
                                onClick={addRepresentativeCity}
                                className="bg-glass2 w-full px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all text-sm sm:text-base"
                            >
                                + Добавить еще один город
                            </button>
                        </div>
                        {/* Business Form */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Форма бизнеса: Собственный бизнес или франшиза? <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Если работаете самостоятельно — укажите форму налогообложения (самозанятый, ИП, ООО).
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                Франшиза сети, ИП Кудряшова МА<br />
                                Собственный бизнес, ООО Красота
                            </p>

                            <div className="flex flex-col sm:flex-row gap-3 mb-3">
                                {[
                                    { value: 'own_business', label: 'Собственный бизнес' },
                                    { value: 'franchise', label: 'Франшиза' }
                                ].map(option => (
                                    <label key={option.value} className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2 mobile-full">
                                        <input
                                            type="radio"
                                            name="business_form"
                                            value={option.value}
                                            checked={formData.business_form === option.value}
                                            onChange={handleInputChange}
                                            className="radio-glass"
                                            required
                                        />
                                        <span className="text-white text-sm sm:text-base">{option.label}</span>
                                    </label>
                                ))}
                            </div>

                            <div>
                                <label className="block text-sm font-medium mb-2 text-white">
                                    Дополнительная информация о форме бизнеса
                                </label>
                                <textarea
                                    name="business_form_details"
                                    value={formData.business_form_details || ''}
                                    onChange={handleInputChange}
                                    className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                    rows="3"
                                    placeholder="Укажите форму налогообложения и дополнительные детали (например: ИП Кудряшова МА, ООО Красота и т.д.)"
                                />
                            </div>
                        </div>

                        {/* Product Assortment */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Опишите подробно ассортимент вашей продукции. <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Начните с перечня ассортимента. Какие бренды вы представляете? Являетесь ли вы производителем? Какие позиции есть в вашем ассортименте?
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                Ковры, Свет, Декор, Посуда<br />
                                Ковры: собственного бренда, и (перечень названий которые возите, можно только топовые)<br />
                                Свет: Российского производства и Европа, (если есть необходимость перечисляем бренды) ассортимент выше 2500 видов в наличии и под заказ. От технического света до роскошных 5 метровых люстр.<br />
                                Декор: Декор настенный из гипса (при необходимости перечисляем бренды и пишем уточнение в ассортименте)
                            </p>
                            <textarea
                                name="product_assortment"
                                value={formData.product_assortment}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="5"
                                placeholder="Опишите ассортимент продукции"
                                required
                            />
                        </div>

                        {/* Welcome Message */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Приветственное сообщение о вашей компании. <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Расскажите, сколько лет вы работаете на рынке, ваши достижения и уникальное торговое предложение (УТП).<br />
                                Эта информация будет добавлена в приветственный блок вашей карточки.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                Линия Дверей на рынке с 2010года, уже более 15 лет радуем качеством и стоимостью наших клиентов. Получили премию (название),<br />
                                Благодаря собственным складам и транспорту мы можем оставлять самую привлекательную стоимость на рынке, так как отсутствует аренда торговых площадей. В нашем салоне комплект двери обойдется всего от 5000р (можно описать комплект)
                            </p>
                            <textarea
                                name="welcome_message"
                                value={formData.welcome_message}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="5"
                                placeholder="Приветственное сообщение о компании"
                                required
                            />
                        </div>

                        {/* Cooperation Terms */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Условия сотрудничества при работе с клиентами из других городов или регионов? <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Опишите подробно, как осуществляется взаимодействие, доставка, оплата и коммуникация.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Продукцию можно приобрести из любой точки юга в формате онлайн, через сайт или коммуникацию с менеджером компании. Принимаем любой вид платежей (перечисляем). Доставка товара оплачивается отдельно.
                            </p>
                            <textarea
                                name="cooperation_terms"
                                value={formData.cooperation_terms}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="5"
                                placeholder="Условия сотрудничества"
                                required
                            />
                        </div>

                        {/* Segments */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Выберите один или несколько сегментов, в которых вы работаете.
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
                                        />
                                        <span className="text-white text-sm">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Social Media Links */}
                        <div className="space-y-4">
                            <h3 className="text-lg font-semibold text-white">
                                Ссылки на социальные сети и другие каналы связи.
                            </h3>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white">
                                        VK
                                    </label>
                                    <input
                                        type="text"
                                        name="vk"
                                        value={formData.vk}
                                        onChange={handleInputChange}
                                        className="input-glass w-full px-4 py-2 rounded-lg transition-all text-sm sm:text-base"
                                        placeholder="Ссылка на VK"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white">
                                        Telegram канал
                                    </label>
                                    <input
                                        type="text"
                                        name="telegram_channel"
                                        value={formData.telegram_channel}
                                        onChange={handleInputChange}
                                        className="input-glass w-full px-4 py-2 rounded-lg transition-all text-sm sm:text-base"
                                        placeholder="Ссылка на Telegram канал"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white">
                                        Pinterest
                                    </label>
                                    <input
                                        type="text"
                                        name="pinterest"
                                        value={formData.pinterest}
                                        onChange={handleInputChange}
                                        className="input-glass w-full px-4 py-2 rounded-lg transition-all text-sm sm:text-base"
                                        placeholder="Ссылка на Pinterest"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2 text-white">
                                        Instagram
                                    </label>
                                    <input
                                        type="text"
                                        name="instagram"
                                        value={formData.instagram}
                                        onChange={handleInputChange}
                                        className="input-glass w-full px-4 py-2 rounded-lg transition-all text-sm sm:text-base"
                                        placeholder="Ссылка на Instagram"
                                    />
                                </div>

                                <div className="sm:col-span-2">
                                    <label className="block text-sm font-medium mb-2 text-white">
                                        Ваш сайт
                                    </label>
                                    <input
                                        type="url"
                                        name="website"
                                        value={formData.website}
                                        onChange={handleInputChange}
                                        className="input-glass w-full px-4 py-2 rounded-lg transition-all text-sm sm:text-base"
                                        placeholder="https://example.com"
                                    />
                                </div>
                            </div>

                            {/* Other Contacts */}
                            <div>
                                <label className="block text-sm font-medium mb-2 text-white">
                                    Другое
                                </label>
                                {formData.other_contacts.map((contact, index) => (
                                    <div key={index} className="flex gap-2 mb-2 mobile-stack">
                                        <input
                                            type="text"
                                            value={contact}
                                            onChange={(e) => updateOtherContact(index, e.target.value)}
                                            className="input-glass flex-1 px-4 py-2 rounded-lg transition-all text-sm sm:text-base"
                                            placeholder="Дополнительный контакт"
                                        />
                                        {formData.other_contacts.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removeOtherContact(index)}
                                                className="bg-glass2 px-3 py-2 rounded-lg hover:bg-opacity-80 transition-all text-red-400 text-sm sm:text-base flex-shrink-0"
                                            >
                                                Удалить
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    onClick={addOtherContact}
                                    className="bg-glass2 w-full px-4 py-2 rounded-lg hover:bg-opacity-80 transition-all text-sm sm:text-base"
                                >
                                    + Добавить контакт
                                </button>
                            </div>
                        </div>

                        {/* Delivery Terms */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Сроки поставки и формат работы: <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Опишите, как и когда осуществляется доставка товара:<br />
                                (в наличии, под заказ, до 2 недель, индивидуальные заказы — до 3 месяцев и т.д.)<br />
                                При необходимости разбейте товар на сегменты и опишите каждый.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                Наша продукция вся в наличии, доставляем за 2-3 дня. За исключением Итальянских коллекции, их мы привозим для Вас в течении 2-3 месяцев.
                            </p>
                            <textarea
                                name="delivery_terms"
                                value={formData.delivery_terms}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="5"
                                placeholder="Сроки поставки и формат работы"
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

                        {/* Guarantees */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Гарантии и их сроки. <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Кратко опишите, какие гарантии вы предоставляете клиентам и каков срок их действия.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                Гарантия на все люстры 1 год<br />
                                Фурнитура 5 лет<br />
                                Металл 10 лет<br />
                                Межкомнатные двери 1 год<br />
                                Электрические приборы 2 года
                            </p>
                            <textarea
                                name="guarantees"
                                value={formData.guarantees}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="4"
                                placeholder="Гарантии и их сроки"
                                required
                            />
                        </div>

                        {/* Designer Contractor Terms */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Условия работы с дизайнерами и/или подрядчиками. <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Укажите:<br />
                                – процент вознаграждения,<br />
                                – условия фиксации клиента,<br />
                                – все возможные варианты сотрудничества при разных условиях,<br />
                                – сроки выплат при заключении договора.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                До 30 %<br />
                                Декор -30%<br />
                                Люстры -25%<br />
                                Обязательно 1 сопровождение клиента в салон./ Необходимо направить нам защиту проекта в мессенджер с указанием ФИ заказчика и визуализация проекта./ Свой вариант
                            </p>
                            <textarea
                                name="designer_contractor_terms"
                                value={formData.designer_contractor_terms}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="5"
                                placeholder="Условия работы с дизайнерами и/или подрядчиками"
                                required
                            />
                        </div>

                        {/* Magazine Cards */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Выдаёте ли вы карточки журналов при покупке продукции? <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {magazineCardsOptions.map(option => (
                                    <label key={option.value} className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="magazine_cards"
                                            value={option.value}
                                            checked={formData.magazine_cards === option.value}
                                            onChange={handleInputChange}
                                            className="radio-glass"
                                            required
                                        />
                                        <span className="text-white text-sm sm:text-base">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>

                        {/* Data Processing Consent */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Согласие на обработку данных. <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-3">
                                При заполнении данной формы вы подтверждаете согласие на хранение, использование и передачу предоставленных данных в рамках проекта.<br />
                                Ознакомиться с информацией можно по ссылке{' '}
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
                                    Я согласен(на) на обработку моих персональных данных
                                </span>
                            </label>
                        </div>

                        {/* File Uploads */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Прикрепите логотип вашей компании (для личного кабинета)<br />
                                и карточку юридического лица (для составления договора). <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-3">
                                До 5 файлов, допустимый общий размер файлов — 5 МБ.
                            </p>

                            {/* Company Logo Upload */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium mb-2 text-white">
                                    Логотип компании
                                </label>
                                <div className="file-upload-area bg-glass2 rounded-lg p-4 sm:p-6 text-center">
                                    {logoPreview ? (
                                        <div className="space-y-4">
                                            <img
                                                src={logoPreview}
                                                alt="Logo Preview"
                                                className="mx-auto max-w-full sm:max-w-xs max-h-32 sm:max-h-40 object-contain rounded-lg border-2 border-white/30"
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
                                                multiple
                                            />
                                            <p className="text-white/70 text-sm sm:text-base">Нажмите для загрузки логотипа</p>
                                            <p className="text-white/50 text-xs sm:text-sm mt-1">Максимальный размер файла: 5MB</p>
                                        </label>
                                    )}
                                </div>
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
                                    <span className="text-sm sm:text-base"> Присоединится к клубу</span>
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

                            <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">
                                Успешно отправлено!
                            </h2>
                            <p className="text-white/70 mb-4 sm:mb-6 text-sm sm:text-base">
                                Ваша анкета успешно отправлена. Мы свяжемся с вами в ближайшее время.
                            </p>
                            <button
                                onClick={closeModal}
                                className="bg-glass2 w-full px-4 py-2 sm:px-6 sm:py-3 rounded-lg hover:bg-opacity-80 transition-all font-medium text-sm sm:text-base"
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