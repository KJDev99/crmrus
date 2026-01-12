'use client';
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'

export default function SupplierDetail({ questionnaire, onBack }) {
    if (!questionnaire) {
        return (
            <div>
                <div className="text-white flex justify-between items-center mt-[0px]">
                    <button onClick={onBack} className="cursor-pointer">
                        <IoIosArrowBack size={40} />
                    </button>
                    <img src="/icons/logo.svg" alt="a" />
                    <div>
                        <img src="/icons/share.svg" alt="a" />
                    </div>
                </div>
                <div className="text-center text-white py-10">
                    <p>Загрузка...</p>
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
            'rough_materials': 'Черновые материалы',
            'finishing_materials': 'Чистовые материалы',
            'soft_furniture': 'Мягкая мебель',
            'cabinet_furniture': 'Корпусная мебель',
            'appliances': 'Техника',
            'decor': 'Декор',
            'all': 'Все категории',
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
        <div>
            <div className="text-white flex justify-between items-center mt-[0px]">
                <button onClick={onBack} className="cursor-pointer">
                    <IoIosArrowBack size={40} />
                </button>
                <img src="/icons/logo.svg" alt="a" />
                <div>
                    <img src="/icons/share.svg" alt="a" />
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
                            <p className='text-[#FFFFFF] uppercase text-sm leading-[100%] mt-3'>
                                {getCategoryDisplay()}
                            </p>
                            <p className='text-[#FFFFFF] text-sm mt-1'>
                                Сегменты: {getSegmentDisplay(questionnaire.segments)}
                            </p>
                        </div>
                    </div>

                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>Контактная информация</h2>
                    <div className='text-lg border-y border-[#FFFFFF91] px-2 py-4 text-[#FFFFFF] space-y-2'>
                        <p><strong>Бренд:</strong> {questionnaire.brand_name || 'Не указан'}</p>
                        <p><strong>Ответственное лицо:</strong> {questionnaire.responsible_person || 'Не указано'}</p>
                        <p><strong>Телефон:</strong> {questionnaire.phone || 'Не указан'}</p>
                        <p><strong>Email:</strong> {questionnaire.email || 'Не указан'}</p>
                        <p><strong>Форма бизнеса:</strong> {questionnaire.business_form_display || 'Не указана'}</p>
                        <p><strong>НДС:</strong> {questionnaire.vat_payment_display || 'Не указано'}</p>
                        <p><strong>Карточки журнала:</strong> {questionnaire.magazine_cards_display || 'Не указаны'}</p>
                    </div>

                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>О компании</h2>
                    <div className='space-y-4'>
                        {getAboutValue('company_description') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Описание компании:</strong><br />
                                {getAboutValue('company_description')}
                            </div>
                        )}

                        {getAboutValue('product_assortment') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Ассортимент продукции:</strong><br />
                                {getAboutValue('product_assortment')}
                            </div>
                        )}

                        {getAboutValue('office_addresses') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Адреса офисов:</strong><br />
                                {getAboutValue('office_addresses')}
                            </div>
                        )}

                        {getAboutValue('social_networks') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Социальные сети:</strong><br />
                                {getAboutValue('social_networks')}
                            </div>
                        )}
                    </div>

                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>Условия сотрудничества</h2>
                    <div className='space-y-4'>
                        {getTermValue('delivery_periods') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Сроки поставки:</strong><br />
                                {getTermValue('delivery_periods')}
                            </div>
                        )}

                        {getTermValue('vat_payment') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>НДС:</strong> {getTermValue('vat_payment')}
                            </div>
                        )}

                        {getTermValue('guarantees') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Гарантии:</strong><br />
                                {getTermValue('guarantees')}
                            </div>
                        )}

                        {getTermValue('magazine_cards') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Карточки журнала:</strong> {getTermValue('magazine_cards')}
                            </div>
                        )}

                        {getTermValue('designer_contractor_terms') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Условия для дизайнеров и прорабов:</strong><br />
                                {getTermValue('designer_contractor_terms')}
                            </div>
                        )}
                    </div>

                    <div className='mt-6 text-[#FFFFFF] px-2 py-2'>
                        <strong>Отзывы:</strong> {questionnaire.rating_count?.total || 0}
                        {questionnaire.rating_count?.positive > 0 && ` (${questionnaire.rating_count.positive} положительных)`}
                        {questionnaire.rating_count?.constructive > 0 && ` (${questionnaire.rating_count.constructive} конструктивных)`}
                    </div>
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