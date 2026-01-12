'use client';
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'

export default function DesignDetail({ questionnaire, onBack }) {
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
            if (type === 'experience_geography') {
                return item.value.description || `${item.value.city || ''} ${item.value.work_cities?.join(', ') || ''}`.trim();
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

    const getServiceDisplay = (services) => {
        if (!services || !Array.isArray(services)) return '';

        const serviceMap = {
            'decorator': 'Декоратор',
            'residential_designer': 'Дизайнер жилых помещений',
            'commercial_designer': 'Дизайнер коммерческой недвижимости',
            'home_stager': 'Хоустейджер',
            'architect': 'Архитектор',
            'landscape_designer': 'Ландшафтный дизайнер',
            'light_designer': 'Светодизайнер',
            'author_supervision': 'Авторский надзор',
            'design': 'Дизайн',
            'completing': 'Комплектация',
            'architecture': 'Архитектура',
            'landscape_design': 'Ландшафтный дизайн',
            'designer_horika': 'Дизайнер Хорека',
        };

        return services.map(service => serviceMap[service] || service).join(' / ');
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
                            {questionnaire.photo ? (
                                <img
                                    src={questionnaire.photo}
                                    alt={questionnaire.full_name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-full card_img rounded-lg flex items-center justify-center">
                                    <span className="text-white text-2xl uppercase">{questionnaire.full_name ? questionnaire.full_name.charAt(0) : '?'}</span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col border-b border-b-[#FFFFFF91] pl-6 ml-4 flex-grow">
                            <h2 className='mb-0.5 text-[#FFFFFF] text-[22px]'>
                                {questionnaire.full_name || 'Название организации'}
                            </h2>
                            <div className='w-full h-0.25 bg-[#FFFFFF4F]'></div>
                            <p className='text-[#FFFFFF] uppercase text-sm leading-[100%] mt-3'>
                                {getServiceDisplay(questionnaire.services)}
                            </p>
                        </div>
                    </div>

                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>Контактная информация</h2>
                    <div className='text-lg border-y border-[#FFFFFF91] px-2 py-4 text-[#FFFFFF] space-y-2'>
                        <p><strong>Телефон:</strong> {questionnaire.phone || 'Не указан'}</p>
                        <p><strong>Email:</strong> {questionnaire.email || 'Не указан'}</p>
                        <p><strong>Город:</strong> {questionnaire.city || 'Не указан'}</p>
                    </div>

                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>О дизайнере</h2>
                    <div className='space-y-4'>
                        {getAboutValue('welcome_message') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Приветственное сообщение:</strong><br />
                                {getAboutValue('welcome_message')}
                            </div>
                        )}

                        {getAboutValue('experience_geography') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Опыт и география:</strong><br />
                                {getAboutValue('experience_geography')}
                            </div>
                        )}

                        {getAboutValue('service_packages') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Пакеты услуг и стоимость:</strong><br />
                                {getAboutValue('service_packages')}
                            </div>
                        )}

                        {getAboutValue('promotions_utp') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Акции и УТП:</strong><br />
                                {getAboutValue('promotions_utp')}
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
                        {getTermValue('project_periods') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Сроки выполнения проекта:</strong><br />
                                {getTermValue('project_periods')}
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

                        {getTermValue('other_cities_terms') && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Работа с другими городами:</strong><br />
                                {getTermValue('other_cities_terms')}
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