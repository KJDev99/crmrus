'use client';
import React from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import Link from 'next/link'

export default function MediaItem({
    questionnaires,
    onSelectQuestionnaire,
    onLoadMore,
    loading,
    hasMore
}) {
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
        if (!businessForm) return '';

        const businessFormMap = {
            'own_business': 'Собственный бизнес',
            'franchise': 'Франшиза',
        };

        // Agar qo'shimcha ma'lumot bo'lsa (masalan, "(ЗАО)")
        if (businessForm.includes('(')) {
            const parts = businessForm.split(' (');
            const baseForm = parts[0];
            const additional = parts[1]?.replace(')', '');
            const displayBase = businessFormMap[baseForm] || baseForm;
            return `${displayBase} (${additional})`;
        }

        return businessFormMap[businessForm] || businessForm;
    };

    const getRepresentativeCities = (representativeCities) => {
        if (!representativeCities) return '';

        try {
            // Agar string bo'lsa, JSON parse qilish
            const cities = typeof representativeCities === 'string'
                ? JSON.parse(representativeCities)
                : representativeCities;

            if (Array.isArray(cities) && cities.length > 0) {
                return cities.map(city => city.city || '').filter(city => city).join(', ');
            }
            return '';
        } catch (error) {
            return '';
        }
    };

    return (
        <div className='max-md:px-4 max-w-7xl mx-auto'>
            <div className="text-white flex justify-between items-center mt-[0px] max-md:px-0">
                <Link href={'/role'} className="cursor-pointer max-md:w-8 max-md:h-8">
                    <IoIosArrowBack size={40} className='max-md:w-6 max-md:h-6' />
                </Link>
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
                                    className="flex mb-4 max-md:mb-3 cursor-pointer hover:opacity-80 transition-opacity max-md:flex-col"
                                    onClick={() => onSelectQuestionnaire(questionnaire.id)}
                                >
                                    <div className='w-[120px] h-[100px] card_img flex-shrink-0 max-md:w-full max-md:h-20'>
                                        <div className="w-full h-full rounded-lg flex items-center justify-center">
                                            <span className="text-white text-2xl uppercase font-bold max-md:text-lg">
                                                {questionnaire.brand_name ? questionnaire.brand_name.charAt(0) : 'M'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col border-b border-b-[#FFFFFF91] pl-6 ml-4 flex-grow max-md:pl-3 max-md:ml-0 max-md:border-b-0 max-md:border-t max-md:pt-3 max-md:mt-2">
                                        <h2 className='mb-0.5 text-[#FFFFFF] text-[22px] max-md:text-base'>
                                            {questionnaire.brand_name || questionnaire.full_name || 'Медиа пространство'}
                                        </h2>
                                        <p className='text-sm text-[#FFFFFF] mt-1 max-md:text-xs'>
                                            {getRepresentativeCities(questionnaire.representative_cities) || 'Город не указан'}
                                        </p>


                                        <p className='text-[#FFFFFF] text-sm mt-1 max-md:text-xs'>
                                            {getBusinessFormDisplay(questionnaire.business_form)}
                                        </p>

                                    </div>
                                </div>
                            ))}
                        </>
                    )}

                    <div className="flex justify-center max-md:py-2">
                        {hasMore && (
                            <button
                                onClick={onLoadMore}
                                disabled={loading}
                                className={`
                                    w-[180px] h-[40px] max-md:w-24 max-md:h-8 rounded-full
                                    bg-glass2 text-white hover:bg-white/40
                                    text-sm max-md:text-xs font-medium transition-all duration-200
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
            <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] max-md:mt-8 mb-[64px] max-md:mb-8 flex justify-center max-md:px-4">
                <Link href={'/userinfo'}>
                    <div className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-[50px] hidden sm:block">
                        ★
                    </div>
                </Link>
            </div>
        </div>
    )
}