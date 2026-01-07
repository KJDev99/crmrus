'use client';
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'

export default function MediaDetail({ questionnaire, onBack }) {
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
                    <p>Ma'lumotlar Загрузка...</p>
                </div>
            </div>
        );
    }

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

    const getRepresentativeCities = () => {
        if (!questionnaire.representative_cities) return null;

        try {
            const cities = typeof questionnaire.representative_cities === 'string'
                ? JSON.parse(questionnaire.representative_cities)
                : questionnaire.representative_cities;

            if (Array.isArray(cities) && cities.length > 0) {
                return (
                    <div className="space-y-2">
                        {cities.map((city, index) => (
                            <div key={index} className="border-l-2 border-purple-500 pl-3">
                                <p><strong>Город:</strong> {city.city || 'Не указан'}</p>
                                {city.address && <p><strong>Адрес:</strong> {city.address}</p>}
                                {city.phone && <p><strong>Телефон:</strong> {city.phone}</p>}
                                {city.district && <p><strong>Район:</strong> {city.district}</p>}
                            </div>
                        ))}
                    </div>
                );
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const getBusinessFormDisplay = (businessForm) => {
        if (!businessForm) return 'Не указана';

        const businessFormMap = {
            'own_business': 'Собственный бизнес',
            'franchise': 'Франшиза',
        };

        if (businessForm.includes('(')) {
            const parts = businessForm.split(' (');
            const baseForm = parts[0];
            const additional = parts[1]?.replace(')', '');
            const displayBase = businessFormMap[baseForm] || baseForm;
            return `${displayBase} (${additional})`;
        }

        return businessFormMap[businessForm] || businessForm;
    };

    const getOtherContacts = () => {
        if (!questionnaire.other_contacts) return null;

        try {
            const contacts = typeof questionnaire.other_contacts === 'string'
                ? JSON.parse(questionnaire.other_contacts)
                : questionnaire.other_contacts;

            if (Array.isArray(contacts) && contacts.length > 0) {
                return (
                    <div className="space-y-1">
                        {contacts.map((contact, index) => (
                            <p key={index}>{contact}</p>
                        ))}
                    </div>
                );
            }
            return null;
        } catch (error) {
            return null;
        }
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
                            <div className="w-full h-full  rounded-lg flex items-center justify-center">
                                <span className="text-white text-2xl font-bold uppercase">
                                    {questionnaire.brand_name ? questionnaire.brand_name.charAt(0) : 'M'}
                                </span>
                            </div>
                        </div>
                        <div className="flex flex-col border-b border-b-[#FFFFFF91] pl-6 ml-4 flex-grow">
                            <h2 className='mb-0.5 text-[#FFFFFF] text-[22px]'>
                                {questionnaire.brand_name || questionnaire.full_name || 'Медиа пространство'}
                            </h2>
                            <div className='w-full h-0.25 bg-[#FFFFFF4F]'></div>
                            <p className='text-[#FFFFFF] uppercase text-sm leading-[100%] mt-3'>
                                {questionnaire.group_display || 'Медиа'}
                            </p>

                        </div>
                    </div>

                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>Контактная информация</h2>
                    <div className='text-lg border-y border-[#FFFFFF91] px-2 py-4 text-[#FFFFFF] space-y-2'>
                        <p><strong>Бренд:</strong> {questionnaire.brand_name || 'Не указан'}</p>
                        <p><strong>ФИО:</strong> {questionnaire.full_name || 'Не указано'}</p>
                        <p><strong>Ответственное лицо:</strong> {questionnaire.responsible_person || 'Не указано'}</p>
                        <p><strong>Телефон:</strong> {questionnaire.phone || 'Не указан'}</p>
                        <p><strong>Email:</strong> {questionnaire.email || 'Не указан'}</p>
                        <p><strong>Форма бизнеса:</strong> {getBusinessFormDisplay(questionnaire.business_form)}</p>
                        <p><strong>НДС:</strong> {questionnaire.vat_payment_display || 'Не указано'}</p>
                    </div>

                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>О медиа пространстве</h2>
                    <div className='space-y-4'>
                        {questionnaire.activity_description && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Деятельность:</strong><br />
                                {questionnaire.activity_description}
                            </div>
                        )}

                        {questionnaire.welcome_message && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Приветственное сообщение:</strong><br />
                                {questionnaire.welcome_message}
                            </div>
                        )}

                        {questionnaire.cooperation_terms && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Условия сотрудничества:</strong><br />
                                {questionnaire.cooperation_terms}
                            </div>
                        )}

                        <div className='text-[#FFFFFF] px-2 py-2'>
                            <strong>Сегменты для публикации:</strong><br />
                            {getSegmentDisplay(questionnaire.segments)}
                        </div>
                    </div>

                    {getRepresentativeCities() && (
                        <>
                            <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>Города представительств</h2>
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                {getRepresentativeCities()}
                            </div>
                        </>
                    )}

                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>Социальные сети и контакты</h2>
                    <div className='space-y-4'>
                        <div className='text-[#FFFFFF] px-2 py-2 space-y-2'>
                            {questionnaire.vk && <p><strong>VK:</strong> {questionnaire.vk}</p>}
                            {questionnaire.instagram && <p><strong>Instagram:</strong> {questionnaire.instagram}</p>}
                            {questionnaire.telegram_channel && <p><strong>Telegram канал:</strong> {questionnaire.telegram_channel}</p>}
                            {questionnaire.pinterest && <p><strong>Pinterest:</strong> {questionnaire.pinterest}</p>}
                            {questionnaire.website && <p><strong>Website:</strong> {questionnaire.website}</p>}
                        </div>

                        {getOtherContacts() && (
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                <strong>Другие контакты:</strong><br />
                                {getOtherContacts()}
                            </div>
                        )}
                    </div>

                    {questionnaire.additional_info && (
                        <>
                            <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF]'>Дополнительная информация</h2>
                            <div className='text-[#FFFFFF] px-2 py-2'>
                                {questionnaire.additional_info}
                            </div>
                        </>
                    )}

                    <div className='mt-6 text-[#FFFFFF] px-2 py-2'>
                        <strong>Отзывы:</strong> {questionnaire.rating_count?.total || 0}
                        {questionnaire.rating_count?.positive > 0 && ` (${questionnaire.rating_count.positive} положительных)`}
                        {questionnaire.rating_count?.constructive > 0 && ` (${questionnaire.rating_count.constructive} конструктивных)`}
                    </div>

                    <div className='mt-4 text-[#FFFFFF] px-2 py-2 text-sm opacity-80'>
                        <p>Создано: {new Date(questionnaire.created_at).toLocaleDateString('ru-RU')}</p>
                        {questionnaire.updated_at !== questionnaire.created_at && (
                            <p>Обновлено: {new Date(questionnaire.updated_at).toLocaleDateString('ru-RU')}</p>
                        )}
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