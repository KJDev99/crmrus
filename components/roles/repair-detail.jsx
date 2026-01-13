'use client';
import React, { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'

export default function RepairDetail({ questionnaire, onBack }) {
    const [activeTab, setActiveTab] = useState('company'); // 'company' or 'cooperation'

    if (!questionnaire) {
        return (
            <div className='max-md:px-4'>
                <div className="text-white flex justify-between items-center mt-[0px] max-md:px-0">
                    <button onClick={onBack} className="cursor-pointer max-md:w-8 max-md:h-8">
                        <IoIosArrowBack size={40} className='max-md:w-6 max-md:h-6' />
                    </button>
                    <img src="/icons/logo.svg" alt="a" className='max-md:w-20 max-md:h-20' />
                    <div className='max-md:w-8 max-md:h-8'>
                        <img src="/icons/share.svg" alt="a" className='max-md:w-6 max-md:h-6' />
                    </div>
                </div>
                <div className="text-center text-white py-10 max-md:py-6">
                    <p className='max-md:text-sm'>Загрузка...</p>
                </div>
            </div>
        );
    }

    const getAboutValue = (type) => {
        const item = questionnaire.about_company?.find(item => item.type === type);
        if (!item) return null;

        if (typeof item.value === 'object') {
            if (type === 'office_addresses') {
                return Array.isArray(item.value) ? item.value.join(', ') : item.value;
            } else if (type === 'social_networks') {
                return (
                    <div className="space-y-1">
                        {item.value.vk && <div>VK: {item.value.vk}</div>}
                        {item.value.instagram && <div>Instagram: {item.value.instagram}</div>}
                        {item.value.website && <div>Website: {item.value.website}</div>}
                    </div>
                );
            }
        }
        return item.value;
    };

    const getTermValue = (type) => {
        const item = questionnaire.terms_of_cooperation?.find(item => item.type === type);
        return item?.value || null;
    };

    const getCategoryDisplay = () => {
        const categoryMap = {
            'turnkey': 'Под ключ',
            'rough_works': 'Черновые работы',
            'finishing_works': 'Чистовые работы',
            'plumbing_tiles': 'Сантехника и плитка',
            'floor': 'Полы',
            'walls': 'Стены',
            'rooms_turnkey': 'Комнаты под ключ',
            'electrical': 'Электрика',
            'all': 'Все виды работ',
        };
        return categoryMap[questionnaire.group] || questionnaire.group;
    };

    const getSegmentDisplay = (segments) => {
        if (!segments || !Array.isArray(segments)) return '';

        const segmentMap = {
            'economy': 'Эконом',
            'comfort': 'Комфорт',
            'business': 'Бизнес',
            'premium': 'Премиум',
            'horeca': 'Хорека',
            'exclusive': 'Эксклюзив',
            'medium': 'Средний',
        };

        return segments.map(segment => segmentMap[segment] || segment).join(', ');
    };

    return (
        <div className='max-md:px-4'>
            <div className="text-white flex justify-between items-center mt-[0px] max-md:px-0">
                <button onClick={onBack} className="cursor-pointer max-md:w-8 max-md:h-8">
                    <IoIosArrowBack size={40} className='max-md:w-6 max-md:h-6' />
                </button>
                <img src="/icons/logo.svg" alt="a" className='max-md:w-20 max-md:h-20' />
                <div className='max-md:w-8 max-md:h-8'>
                    <img src="/icons/share.svg" alt="a" className='max-md:w-6 max-md:h-6' />
                </div>
            </div>
            <div className="max-w-xl mx-auto space-y-6">
                <div className="">
                    <div className="flex mb-6">
                        <div className='w-[125px] h-[100px] card_img flex-shrink-0'>
                            {questionnaire.company_logo ? (
                                <img
                                    src={questionnaire.company_logo}
                                    alt={questionnaire.brand_name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-full card_img rounded-lg flex items-center justify-center">
                                    <span className="text-white text-2xl uppercase">
                                        {questionnaire.brand_name ? questionnaire.brand_name.charAt(0) : '?'}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col border-b border-b-[#FFFFFF91] pl-6 ml-4 flex-grow">
                            <h2 className='mb-0.5 text-[#FFFFFF] text-[22px]'>
                                {questionnaire.brand_name || questionnaire.full_name || 'Название организации'}
                            </h2>
                            <div className='w-full h-0.25 bg-[#FFFFFF4F]'></div>

                            <p className='text-[#FFFFFF] text-sm mt-1'>
                                Сегменты: {getSegmentDisplay(questionnaire.segments)}
                            </p>
                        </div>
                    </div>

                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>Контактная информация</h2>
                    <div className='text-lg border-y border-[#FFFFFF91] px-2 py-4 text-[#FFFFFF] space-y-2'>
                        <p><strong>Бренд:</strong> {questionnaire.brand_name || 'Не указан'}</p>
                        <p><strong>Ответственное лицо:</strong> {questionnaire.responsible_person || 'Не указано'}</p>
                        <p><strong>Телефон:</strong бизнесrong> {questionnaire.phone || 'Не указан'}</p>
                        <p><strong>Email:</strong> {questionnaire.email || 'Не указан'}</p>

                    </div>

                    {/* Tabs */}
                    <div className='mt-6'>
                        <div className='flex border-b border-[#FFFFFF91]'>
                            <button
                                onClick={() => setActiveTab('company')}
                                className={`flex-1 py-3 text-center text-[#FFFFFF] transition-all ${activeTab === 'company'
                                    ? 'border-b-2 border-[#FFFFFF] font-semibold'
                                    : 'opacity-60'
                                    }`}
                            >
                                О компании
                            </button>
                            <button
                                onClick={() => setActiveTab('cooperation')}
                                className={`flex-1 py-3 text-center text-[#FFFFFF] transition-all ${activeTab === 'cooperation'
                                    ? 'border-b-2 border-[#FFFFFF] font-semibold'
                                    : 'opacity-60'
                                    }`}
                            >
                                Условия сотрудничества
                            </button>
                        </div>

                        {/* Tab Content */}
                        <div className='mt-6'>
                            {activeTab === 'company' && (
                                <div className='space-y-4'>
                                    {/* Приветственное сообщение */}
                                    {getAboutValue('welcome_message') && (
                                        <div className='text-[#FFFFFF] px-2 py-2'>
                                            <strong>Приветственное сообщение:</strong><br />
                                            {getAboutValue('welcome_message')}
                                        </div>
                                    )}

                                    {/* Сколько лет в профессии */}
                                    {getAboutValue('years_in_profession') && (
                                        <div className='text-[#FFFFFF] px-2 py-2'>
                                            <strong>Сколько лет в профессии:</strong> {getAboutValue('years_in_profession')}
                                        </div>
                                    )}

                                    {/* География */}
                                    {getAboutValue('geography') && (
                                        <div className='text-[#FFFFFF] px-2 py-2'>
                                            <strong>География:</strong><br />
                                            {getAboutValue('geography')}
                                        </div>
                                    )}

                                    {/* Описание компании */}
                                    {getAboutValue('company_description') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Описание компании:</strong><br />
                                            {getAboutValue('company_description')}
                                        </div>
                                    )}

                                    {/* Пакеты услуг и стоимость */}
                                    {getAboutValue('service_packages') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Пакеты услуг и их стоимость:</strong><br />
                                            {getAboutValue('service_packages')}
                                        </div>
                                    )}

                                    {/* Перечень услуг */}
                                    {getAboutValue('services_list') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Перечень услуг:</strong><br />
                                            {getAboutValue('services_list')}
                                        </div>
                                    )}

                                    {/* Акции и УТП */}
                                    {getAboutValue('promotions_utp') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Акции и УТП:</strong><br />
                                            {getAboutValue('promotions_utp')}
                                        </div>
                                    )}

                                    {/* Условия договора и гарантии */}
                                    {getAboutValue('contract_guarantees') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Условия договора и гарантии:</strong><br />
                                            {getAboutValue('contract_guarantees')}
                                        </div>
                                    )}

                                    {/* Адреса офисов */}
                                    {getAboutValue('office_addresses') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Адреса офисов:</strong><br />
                                            {getAboutValue('office_addresses')}
                                        </div>
                                    )}

                                    {/* Социальные сети */}
                                    {getAboutValue('social_networks') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Социальные сети:</strong><br />
                                            {getAboutValue('social_networks')}
                                        </div>
                                    )}

                                    {/* Видео контент */}
                                    {getAboutValue('video_content') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Видео:</strong><br />
                                            {getAboutValue('video_content')}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'cooperation' && (
                                <div className='space-y-4'>
                                    {/* Периоды выполнения проекта */}
                                    {getTermValue('project_periods') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>В какие периоды осуществляется выполнение проекта:</strong><br />
                                            {getTermValue('project_periods')}
                                        </div>
                                    )}

                                    {/* Сроки ремонта */}
                                    {getTermValue('repair_periods') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Сроки ремонта:</strong><br />
                                            {getTermValue('repair_periods')}
                                        </div>
                                    )}

                                    {/* НДС */}
                                    {getTermValue('vat_payment') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>НДС:</strong> {getTermValue('vat_payment')}
                                        </div>
                                    )}

                                    {/* Гарантии */}
                                    {getTermValue('guarantees') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Гарантии:</strong><br />
                                            {getTermValue('guarantees')}
                                        </div>
                                    )}

                                    {/* Условия работы с другими городами */}
                                    {getTermValue('other_cities_terms') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Условия работы с другими городами:</strong><br />
                                            {getTermValue('other_cities_terms')}
                                        </div>
                                    )}

                                    {/* Карточки журнала */}
                                    {getTermValue('magazine_cards') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Карточки журнала:</strong> {getTermValue('magazine_cards')}
                                        </div>
                                    )}

                                    {/* Условия для дизайнеров и поставщиков */}
                                    {getTermValue('designer_supplier_terms') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Условия работы с учетом рекомендации:</strong><br />
                                            {getTermValue('designer_supplier_terms')}
                                        </div>
                                    )}

                                    {/* Когда выплачивается процент */}
                                    {/* {getTermValue('payment_timing') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <strong>Когда выплачивается процент:</strong><br />
                                            {getTermValue('payment_timing')}
                                        </div>
                                    )} */}
                                    <div className='mt-8 text-[#FFFFFF] px-2 py-4 border-b border-[#FFFFFF91]'>
                                        <div className="flex gap-x-4">

                                            <h3 className='text-lg font-semibold mb-3'>ОТЗЫВЫ:</h3>
                                            <div className='space-y-2 flex items-center gap-x-5'>
                                                <p>
                                                    <span className='text-yellow-400'>★</span> Положительных: {questionnaire.rating_count?.positive || 0}
                                                </p>
                                                <p>
                                                    <span className='text-gray-400'>☆</span> Конструктивных: {questionnaire.rating_count?.constructive || 0}
                                                </p>
                                            </div>

                                        </div>
                                        {
                                            questionnaire.reviews_list.slice(0, 3).map((review, index) => (
                                                <div key={index} className='mt-4 p-4 bg-[#FFFFFF1A] rounded-lg'>
                                                    <div className='flex items-center mb-2'>
                                                        <span className='text-yellow-400 mr-2'>
                                                            {'★'.repeat(review.rating)}
                                                            {'☆'.repeat(5 - review.rating)}
                                                        </span>
                                                        <span className='text-sm text-[#FFFFFFCC]'>{review.text || 'Аноним'}</span>
                                                    </div>
                                                </div>
                                            ))
                                        }
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Отзывы - moved to bottom */}

                </div>
            </div>
            <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] mb-[64px] flex justify-center">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-[50px]">
                    ★
                </div>
            </div>
        </div>
    )
}