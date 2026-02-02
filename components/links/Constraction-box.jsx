'use client'
import React, { useState } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { RiDeleteBin6Line } from 'react-icons/ri';

export default function ConstructionBox() {
    const [formData, setFormData] = useState({
        group: 'repair',
        brand_name: '',
        phone: '',
        email: '',
        responsible_person: '',
        representative_cities: [''],
        business_form: '',
        business_form_details: '',
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
        other_contacts: [{ type: '', value: '' }],
        work_format: '',
        vat_payment: '',
        guarantees: '',
        designer_supplier_terms: '',
        magazine_cards: [],
        additional_info: '',
        data_processing_consent: false,
        company_logo: null,
        legal_entity_card: null,
        categories: [],
        speed_of_execution: '',
    });

    const [showModal, setShowModal] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [logoPreview, setLogoPreview] = useState(null);
    const [cardFileName, setCardFileName] = useState('');

    const groupOptions = [
        { value: 'repair', label: 'Ремонт' },

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

    const socialMediaOptions = [
        { value: 'vk', label: 'VK', placeholder: 'Ссылка на VK' },
        { value: 'telegram', label: 'Telegram канал', placeholder: 'Ссылка на Telegram канал' },
        { value: 'pinterest', label: 'Pinterest', placeholder: 'Ссылка на Pinterest' },
        { value: 'instagram', label: 'Instagram', placeholder: 'Ссылка на Instagram' },
        { value: 'website', label: 'Веб-сайт', placeholder: 'https://example.com' },
        { value: 'other', label: 'Другое', placeholder: 'Другой контакт' }
    ];

    const categoryOptions = [
        { value: 'ПОД КЛЮЧ', label: 'ПОД КЛЮЧ' },
        { value: 'черновые работы', label: 'черновые работы' },
        { value: 'чистовые работы', label: 'чистовые работы' },
        { value: 'Сантехника и плитка', label: 'Сантехника и плитка' },
        { value: 'Пол', label: 'Пол' },
        { value: 'Стены', label: 'Стены' },
        { value: 'Комнаты под ключ', label: 'Комнаты под ключ' },
        { value: 'Электрика', label: 'Электрика' },
    ]

    const speedOptions = [
        { value: 'Предварительная запись', label: 'Предварительная запись' },
        { value: 'быстрый старт', label: 'быстрый старт' },
    ]

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

    const handleCategoryToggle = (categoryValue) => {
        setFormData(prev => ({
            ...prev,
            categories: prev.categories.includes(categoryValue)
                ? prev.categories.filter(c => c !== categoryValue)
                : [...prev.categories, categoryValue]
        }));
    };

    const handleMagazineCardsToggle = (cardValue) => {
        setFormData(prev => ({
            ...prev,
            magazine_cards: prev.magazine_cards.includes(cardValue)
                ? prev.magazine_cards.filter(c => c !== cardValue)
                : [...prev.magazine_cards, cardValue]
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
            toast.error('Пожалуйста, укажите города представительств');
            return;
        }
        if (!formData.business_form) {
            toast.error('Пожалуйста, укажите форму бизнеса');
            return;
        }
        if (!formData.work_list) {
            toast.error('Пожалуйста, опишите перечень работ');
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
        if (!formData.project_timelines) {
            toast.error('Пожалуйста, укажите сроки выполнения проектов');
            return;
        }
        if (formData.segments.length === 0) {
            toast.error('Пожалуйста, выберите сегменты работы');
            return;
        }
        if (!formData.work_format) {
            toast.error('Пожалуйста, опишите формат работы');
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
        if (!formData.designer_supplier_terms) {
            toast.error('Пожалуйста, укажите условия работы с дизайнерами/поставщиками');
            return;
        }
        if (formData.magazine_cards.length === 0) {  // ✅ YANGI
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

            // Add all fields to FormData
            Object.keys(formData).forEach(key => {
                const value = formData[key];

                // 1. Fayllar
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
                }
                // 3. ASOSIY QISM: Backend array (massiv) sifatida kutadigan maydonlar
                else if (['segments', 'magazine_cards', 'categories'].includes(key)) {
                    if (value.length > 0) submitFormData.append(key, JSON.stringify(value));
                }
                // else if (['categories'].includes(key)) {
                //     if (Array.isArray(value)) {
                //         value.forEach(item => {
                //             submitFormData.append(key, item);
                //         });
                //     }
                // }
                // 4. Oddiy maydonlar
                else if (key === 'data_processing_consent') {
                    submitFormData.append(key, value.toString());
                }
                else if (value !== '' && value !== null) {
                    submitFormData.append(key, value);
                }
            });


            await axios.post('https://api.reiting-profi.ru/api/v1/accounts/repair-questionnaires/', submitFormData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            setShowModal(true);
            toast.success('Анкета успешно отправлена!');

            setFormData({
                group: 'repair_team',
                brand_name: '',
                phone: '',
                email: '',
                responsible_person: '',
                representative_cities: [''],
                business_form: '',
                business_form_details: '',
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
                other_contacts: [{ type: '', value: '' }],
                work_format: '',
                vat_payment: '',
                guarantees: '',
                designer_supplier_terms: '',
                magazine_cards: [],
                additional_info: '',
                data_processing_consent: false,
                company_logo: null,
                legal_entity_card: null,
                categories: [],
                speed_of_execution: '',
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
                        Анкета участника: роль — Ремонт.
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

                        {/* Brand Name */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Название бренда <span className="text-red-400">*</span>
                            </label>

                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                СК Орленок (ООО Правда)<br />
                                Триумф (ИП Кварцов Л.М.)
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

                        {/* Phone */}
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

                        {/* Responsible Person */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Имя, должность и контактный номер ответственного лица <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Указываем контакт человека который будет иметь доступ к платформе.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например: Директор по развитию, Попов Виктор Сергеевич, 8 900 000 00 00
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
                                Опишите подробно, где вы работаете, и укажите адрес каждого салона, контактные данные и район города, в котором он расположен.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Москва, ул. Новый Арбат, д. 203, офис 16, телефон: 8 910 000 00 00  <br />
                                Краснодар, ул. Тургенева, д. 111, телефон: 8 900 000 00 00  <br />
                                Туапсе, ул. Кореновская, д. 4, офис 2, телефон: 8 800 500 00 00 <br />

                            </p>
                            {formData.representative_cities.map((city, index) => (
                                <div key={index} className="flex gap-2 mb-3 mobile-stack">
                                    <textarea
                                        value={city}
                                        onChange={(e) => updateRepresentativeCity(index, e.target.value)}
                                        className="input-glass flex-1 px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                        rows="2"
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
                                + Добавить еще город
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
                                Франшиза (ИП Кротов МА)<br />
                                Собственный бизнес (ООО АПА)
                            </p>

                            {/* Radio buttons for backend */}
                            <div className="flex flex-col sm:flex-row gap-3 mb-3">
                                <label className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2 mobile-full">
                                    <input
                                        type="radio"
                                        name="business_form"
                                        value="own_business"
                                        checked={formData.business_form === 'own_business'}
                                        onChange={handleInputChange}
                                        className="radio-glass"
                                        required
                                    />
                                    <span className="text-white text-sm sm:text-base">Собственный бизнес</span>
                                </label>
                                <label className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2 mobile-full">
                                    <input
                                        type="radio"
                                        name="business_form"
                                        value="franchise"
                                        checked={formData.business_form === 'franchise'}
                                        onChange={handleInputChange}
                                        className="radio-glass"
                                        required
                                    />
                                    <span className="text-white text-sm sm:text-base">Франшиза</span>
                                </label>
                            </div>

                            {/* Details text area */}
                            <div>
                                <textarea
                                    name="business_form_details"
                                    value={formData.business_form_details || ''}
                                    onChange={handleInputChange}
                                    className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                    rows="2"
                                    placeholder="Укажите форму налогообложения (самозанятый, ИП, ООО)"
                                    required
                                />
                            </div>
                        </div>

                        {/* Work List */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Опишите подробно перечень работ, которые вы можете предоставить.<span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Дополнительно укажите, работаете ли вы в стандартном формате или готовы к сложным дизайнерским задумкам и элементам.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например: «Выполняем ремонты любой сложности, включая самые нестандартные дизайнерские элементы» / или: «Выполняем стандартные ремонты среднего сегмента».
                            </p>
                            <textarea
                                name="work_list"
                                value={formData.work_list}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="4"
                                placeholder="Перечень работ которые можете предоставить"
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
                                Эта информация будет добавлена в приветственный блок вашей карточки, постарайтесь учесть все ваши регалии.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например: Развиваемся в строительном бизнесе уже более 20 лет. За нашими плечами более 7000 квартир и собственная бригада мастеров.
                            </p>
                            <textarea
                                name="welcome_message"
                                value={formData.welcome_message}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="5"
                                placeholder="Приветственное сообщение о вашей компании"
                                required
                            />
                        </div>

                        {/* Cooperation Terms */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Условия сотрудничества с клиентами из других городов и регионов: <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Продукцию можно приобрести из любой точки юга в онлайн-формате через наш сайт или посредством общения с менеджером компании. Мы принимаем все виды платежей (укажите способы: банковские карты, переводы и т.д.). Доставка товара оплачивается отдельно.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например: Работаем по всему Югу России, выезд и проживание специалиста оплачивается отдельно
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
                            <label className="block text-sm font-medium mb-2 text-white">
                                Выберите категории <span className="text-red-400">*</span>
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
                                        />
                                        <span className="text-sm text-white">{option.label}</span>
                                    </label>
                                ))}
                            </div>
                        </div>


                        {/* Project Timelines */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Подробно опишите в какие сроки ваша команда выполняет проекты в 1К, в 2К и в 3К квартирах средней площади <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                Средний срок работ<br />
                                1К 30м² - 2 месяца<br />
                                2К 50м² - 3,5 месяца<br />
                                3К 70м² - 4.5 месяца<br /><br />
                                Сроки указаны без учета привязки работ по мебели
                            </p>
                            <textarea
                                name="project_timelines"
                                value={formData.project_timelines}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="5"
                                placeholder="Сроки выполнения проектов"
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


                        {/* Work Format */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Формат работы: <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Опишите, этапы работ и этапы оплаты. Все что важно знать потенциальному заказчику.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                Работа и оплата производится в 2/3 этапа<br /><br />
                                Перед началом работы, мы заключаем договор и заказчик вносит 30% мы приступаем к демонтажу и черновым работам.<br />
                                После завершения 1 этапа, перед началом чистового этапа работ, заказчик вносит 40%.<br />
                                30% заказчик оплачивает при приеме работ.
                            </p>
                            <textarea
                                name="work_format"
                                value={formData.work_format}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="6"
                                placeholder="Формат работы и этапы оплаты"
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
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Скорость выполнения работ <span className="text-red-400">*</span>
                            </label>
                            <div className="flex flex-col sm:flex-row gap-3">
                                {speedOptions.map(option => (
                                    <label key={option.value} className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2 mobile-full">
                                        <input
                                            type="radio"
                                            name="speed_of_execution"
                                            value={option.value}
                                            checked={formData.speed_of_execution === option.value}
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
                                Гарантии и их сроки:   <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Мы предоставляем гарантии на все этапы работ, чтобы обеспечить надежность и спокоиствие наших клиентов.
                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например: <br />
                                - Работы по электрике — 1 год. <br />
                                - Работы по сантехнике — 6 лет. <br />
                                - Чистовые работы — 10 лет. <br />
                                - Гарантия на все виды работ — 1 год.

                            </p>
                            <textarea
                                name="guarantees"
                                value={formData.guarantees}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="3"
                                placeholder="Гарантии и их сроки"
                                required
                            />
                        </div>

                        {/* Designer Supplier Terms */}
                        <div>
                            <label className="block text-sm font-medium mb-2 text-white">
                                Условия работы с дизайнерами и/или подрядчиками.  <span className="text-red-400">*</span>
                            </label>
                            <p className="text-white/60 text-sm mb-2">
                                Укажите:<br />
                                – процент вознаграждения, <br />
                                – условия фиксации клиента,  <br />
                                – все возможные варианты сотрудничества при разных условиях включая роли <br />
                                – сроки выплат при заключении договора. <br />

                            </p>
                            <p className="text-white/50 text-xs mb-3 italic">
                                Например:<br />
                                - Процент вознаграждения: <br />
                                – Ремонт под ключ - 5% <br />
                                –  Отдельные виды работ - 3% <br /> <br />

                                - Условия фиксации клиента:  <br />
                                Для фиксации клиента необходимо предоставить защиту проекта в мессенджер, указав ФИ заказчика и визуализацию проекта и адрес объекта.  <br /> <br />

                                - Сроки выплат при заключении договора:  <br />
                                Выплаты производятся в течение 7 рабочих дней. <br />

                            </p>
                            <textarea
                                name="designer_supplier_terms"
                                value={formData.designer_supplier_terms}
                                onChange={handleInputChange}
                                className="input-glass w-full px-4 py-3 rounded-lg transition-all resize-none text-sm sm:text-base"
                                rows="5"
                                placeholder="Условия работы с дизайнерами и/или поставщиками"
                                required
                            />
                        </div>

                        {/* Magazine Cards */}
                        <div>
                            <label className="block text-sm font-medium mb-3 text-white">
                                Выдаёте ли вы карточки журналов при рекомендации при заключении договора? <span className="text-red-400">*</span>
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                                {magazineCardsOptions.map(option => (
                                    <label key={option.value} className="bg-glass2 px-4 py-3 rounded-lg cursor-pointer hover:bg-opacity-80 transition-all flex items-center gap-2">
                                        <input
                                            type="checkbox"  // ✅ RADIO dan CHECKBOX ga
                                            checked={formData.magazine_cards.includes(option.value)}  // ✅ includes bilan tekshirish
                                            onChange={() => handleMagazineCardsToggle(option.value)}  // ✅ toggle funksiyasi
                                            className="checkbox-glass"  // ✅ radio-glass dan checkbox-glass ga
                                            required={formData.magazine_cards.length === 0}  // ✅ kamida bitta tanlangan bo'lishi kerak
                                        />
                                        <span className="text-white text-sm sm:text-base">{option.label}</span>
                                    </label>
                                ))}
                            </div>
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

                            {/* Legal Entity Card Upload */}
                            {/* <div>
                                <label className="block text-sm font-medium mb-2 text-white">
                                    Карточка юридического лица
                                </label>
                                <div className="file-upload-area bg-glass2 rounded-lg p-4 sm:p-6 text-center">
                                    {cardFileName ? (
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-center gap-2 text-white/80">
                                                <div className="text-xl sm:text-2xl">📄</div>
                                                <span className="text-sm sm:text-base truncate">{cardFileName}</span>
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
                                                multiple
                                            />
                                            <div className="text-white/50 text-2xl sm:text-4xl mb-2">📄</div>
                                            <p className="text-white/70 text-sm sm:text-base">Нажмите для загрузки документа</p>
                                            <p className="text-white/50 text-xs sm:text-sm mt-1">Макс. 20MB</p>
                                        </label>
                                    )}
                                </div>
                            </div> */}
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