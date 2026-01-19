'use client';
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import GlassButton from '../ui/GlassButton1'

export default function SupplierItem({
    questionnaires,
    onSelectQuestionnaire,
    onLoadMore,
    onResetFilter,
    loading,
    hasMore
}) {
    const getCategoryDisplay = (group) => {
        const categoryMap = {
            'rough_materials': 'Черновые материалы',
            'finishing_materials': 'Чистовые материалы',
            'soft_furniture': 'Мягкая мебель',
            'cabinet_furniture': 'Корпусная мебель',
            'appliances': 'Техника',
            'decor': 'Декор',
            'all': 'Все категории',
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

    return (
        <div className='max-md:px-4'>
            <div className="text-white flex justify-between items-center mt-[0px] max-md:px-0">
                <button onClick={onResetFilter} className="cursor-pointer max-md:w-8 max-md:h-8">
                    <IoIosArrowBack size={40} className='max-md:w-6 max-md:h-6' />
                </button>
                <img src="/icons/logo.svg" alt="a" className='max-md:w-20 max-md:h-20' />
                <div></div>
            </div>
            <div className='mt-[0] max-md:mt-2'>
                <div className="max-w-xl mx-auto space-y-4 max-md:space-y-3">
                    {questionnaires.length === 0 && !loading ? (
                        <div className="text-center text-white py-10">
                            <p>Результаты не найдены</p>
                        </div>
                    ) : (
                        <>
                            {questionnaires.map((questionnaire) => (
                                <div
                                    key={questionnaire.id}
                                    className="flex mb-6 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => onSelectQuestionnaire(questionnaire.id)}
                                >
                                    <div className='w-[120px] h-[100px] card_img flex-shrink-0'>
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
                                        <h2 className='mb-0.5 text-[#FFFFFF] text-[22px] line-clamp-1'>
                                            {questionnaire.brand_name || questionnaire.full_name || 'Название организации'}
                                        </h2>

                                        <p className='text-[#FFFFFF] text-sm max-md:text-xs line-clamp-1'>
                                            {questionnaire?.about_company[2]?.value.join(', ') || ""}
                                        </p>
                                        <p className='text-[#FFFFFF] text-sm max-md:text-xs mt-1 line-clamp-2'>
                                            {questionnaire?.about_company[0]?.value || ""}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    <div className="flex justify-between">
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
            <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] mb-[64px] flex justify-center">
                <Link href={'/userinfo'}>
                    <div className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-[50px] hidden sm:block">
                        ★
                    </div>
                </Link>
            </div>
        </div>
    )
}