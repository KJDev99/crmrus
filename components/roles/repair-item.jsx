'use client';
import React, { useState } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import GlassButton from '../ui/GlassButton1'
import Link from 'next/link';
import { MdConstruction } from 'react-icons/md';

export default function RepairItem({
    questionnaires,
    onSelectQuestionnaire,
    onLoadMore,
    onResetFilter,
    loading,
    hasMore
}) {
    const getCategoryDisplay = (group) => {
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
        return categoryMap[group] || group;
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

        return segments.map(segment => segmentMap[segment] || segment).join(' / ');
    };

    const getBusinessFormDisplay = (businessForm) => {
        const businessFormMap = {
            'own_business': 'Собственный бизнес',
            'franchise': 'Франшиза',
        };
        return businessFormMap[businessForm] || businessForm;
    };


    const [showModal, setShowModal] = useState(false);
    return (
        <div className='max-md:px-4 relative min-h-screen '>
            <div className="text-white flex justify-between items-center mt-[0px] max-md:px-0">
                <button onClick={onResetFilter} className="cursor-pointer max-md:w-8 max-md:h-8 md:w-30">
                    <IoIosArrowBack size={40} className='max-md:w-6 max-md:h-6' />
                </button>
                <img src="/icons/logo.svg" alt="a" className='max-md:w-20 w-50' />
                <div className='md:w-30 flex justify-end'>
                    <img
                        src="/icons/filter.svg"
                        alt="filter"
                        className='w-7 h-7 cursor-pointer hover:opacity-80 transition-opacity'
                        onClick={() => setShowModal(true)}
                    />
                </div>
            </div>
            {showModal && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                    onClick={() => setShowModal(false)}
                >
                    <div
                        className="bg-glass2 rounded-3xl p-8 max-w-md w-full border border-white/20 shadow-2xl"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col items-center text-center">
                            <MdConstruction className="text-yellow-400 text-6xl mb-4" />
                            <h3 className="text-white text-xl font-bold mb-3">
                                Страница в разработке
                            </h3>
                            <p className="text-white/80 text-sm mb-6">
                                Дополнительные фильтры в данной категории пока не разработаны
                            </p>
                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full h-12 rounded-full bg-glass2 text-white hover:bg-white/40 
                                                     border border-yellow-400 font-medium transition-all duration-200"
                            >
                                Понятно
                            </button>
                        </div>
                    </div>
                </div>
            )}
            <div className='mt-[0] max-md:mt-2'>
                <div className="max-w-xl mx-auto space-y-4 max-md:space-y-3">
                    {questionnaires.length === 0 && !loading ? (
                        <div className="text-center text-white py-10">
                            <p>По вашему запросу ничего не найдено</p>
                        </div>
                    ) : (
                        <>
                            {questionnaires.map((questionnaire) => (
                                <div
                                    key={questionnaire.id}
                                    className="flex mb-2 max-md:mb-2 cursor-pointer hover:opacity-80 transition-opacity max-md:flex-col"
                                    onClick={() => onSelectQuestionnaire(questionnaire.id)}
                                >
                                    <div className='w-[120px] h-[100px] card_img flex-shrink-0 overflow-hidden max-md:w-full max-md:h-20'>
                                        {questionnaire.company_logo ? (
                                            <img
                                                src={questionnaire.company_logo}
                                                alt={questionnaire.brand_name}
                                                className="w-full h-full object-cover rounded-lg"
                                            />
                                        ) : (
                                            <div className="w-full h-full card_img rounded-lg flex items-center justify-center">
                                                <span className="text-white text-2xl max-md:text-lg uppercase">
                                                    {questionnaire.brand_name ? questionnaire.brand_name.charAt(0) : '?'}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col border-b border-b-[#FFFFFF91]  pl-12 ml-[-16px] flex-grow max-md:pl-3 max-md:ml-0 max-md:border-b-0 max-md:border-t max-md:pt-3 max-md:mt-2">
                                        <h2 className='mb-[-8px] text-[#FFFFFF] text-[22px] line-clamp-1'>
                                            {questionnaire.brand_name || questionnaire.full_name || 'Название организации'}
                                        </h2>
                                        <p className='text-[#FFFFFF] text-sm max-md:text-xs line-clamp-1 mb-2 grow'>
                                            {questionnaire?.about_company[2]?.value.join(', ') || ""}
                                        </p>
                                        <p className='text-[#FFFFFF] text-sm max-md:text-xs mt-1 line-clamp-2 leading-[100%]'>
                                            {questionnaire?.about_company[0]?.value || ""}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    <div className="flex justify-between mt-8">
                        <button
                            onClick={onResetFilter}
                            className={`
                                w-[180px] h-[40px] rounded-full
                                bg-glass2 text-white hover:bg-white/40
                                text-sm font-medium transition-all duration-200
                                flex items-center justify-center
                            `}
                        >
                            Сбросить фильтр
                        </button>

                        {hasMore && (
                            <button
                                onClick={onLoadMore}
                                disabled={loading}
                                className={`
                                    w-[180px] h-[40px] rounded-full
                                    bg-glass2 text-white hover:bg-white/40
                                    text-sm font-medium transition-all duration-200
                                    flex items-center justify-center
                                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                                `}
                            >
                                {loading ? 'Загрузка...' : 'еще'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
            <div className="absolute bottom-20 right-0">
                <Link href={'/userinfo'}>
                    <div className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-[50px] hidden sm:block">
                        ★
                    </div>
                </Link>
            </div>
        </div>
    )
}