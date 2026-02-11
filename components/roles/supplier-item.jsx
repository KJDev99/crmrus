'use client';
import React, { useState, useEffect } from 'react'
import { IoIosArrowBack } from 'react-icons/io'
import Link from 'next/link';
import axios from 'axios';

export default function SupplierItem({
    questionnaires,
    onSelectQuestionnaire,
    onLoadMore,
    onResetFilter,
    loading,
    hasMore,
    selectedCategories, // YANGI
    subCategoryFilters, // YANGI
    onSubCategoryFilterChange, // YANGI
    onApplySubFilters, // YANGI
}) {
    const [showModal, setShowModal] = useState(false);
    const [subCategoryData, setSubCategoryData] = useState(null); // YANGI
    const [loadingSubCategories, setLoadingSubCategories] = useState(false); // YANGI
    const [tempSubFilters, setTempSubFilters] = useState({ // YANGI - Temporary filters for modal
        rough_materials: [],
        finishing_materials: [],
        upholstered_furniture: [],
        cabinet_furniture: [],
        technique: [],
        decor: [],
    });

    // YANGI - Category key mapping
    const categoryKeyMap = {
        'Черновые материалы': 'rough_materials',
        'Чистовые материалы': 'finishing_materials',
        'Мягкая мебель': 'upholstered_furniture',
        'Корпусная мебель': 'cabinet_furniture',
        'Техника': 'technique',
        'Декор': 'decor',
    };

    // YANGI - Fetch sub-categories when modal opens
    useEffect(() => {
        if (showModal && selectedCategories && selectedCategories.length > 0) {
            fetchSubCategories();
        }
    }, [showModal, selectedCategories]);

    const fetchSubCategories = async () => {
        try {
            setLoadingSubCategories(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const categoriesParam = selectedCategories.join(', ');
            const response = await axios.get(
                `https://api.reiting-profi.ru/api/v1/accounts/supplier-questionnaires/secondory-filter-data/?categories=${encodeURIComponent(categoriesParam)}`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSubCategoryData(response.data);
            // Current filterlarni temporary ga ko'chirish
            setTempSubFilters(subCategoryFilters);
        } catch (error) {
            console.error('Sub-categories yuklashda xatolik:', error);
        } finally {
            setLoadingSubCategories(false);
        }
    };

    // YANGI - Handle sub-category toggle in modal
    const handleSubCategoryToggle = (categoryKey, subCategoryValue) => {
        setTempSubFilters(prev => ({
            ...prev,
            [categoryKey]: prev[categoryKey].includes(subCategoryValue)
                ? prev[categoryKey].filter(s => s !== subCategoryValue)
                : [...prev[categoryKey], subCategoryValue]
        }));
    };

    // YANGI - Apply filters and close modal
    const handleApplyFilters = () => {
        // Filterlarni birgalikda update qilish
        const filtersToApply = {
            rough_materials: tempSubFilters.rough_materials,
            finishing_materials: tempSubFilters.finishing_materials,
            upholstered_furniture: tempSubFilters.upholstered_furniture,
            cabinet_furniture: tempSubFilters.cabinet_furniture,
            technique: tempSubFilters.technique,
            decor: tempSubFilters.decor,
        };

        // State ni update qilish
        Object.keys(filtersToApply).forEach(key => {
            onSubCategoryFilterChange(key, filtersToApply[key]);
        });

        setShowModal(false);

        // Yangilangan filterlar bilan to'g'ridan-to'g'ri search qilish
        onApplySubFilters(filtersToApply); // ✅ Filterlarni argument sifatida yuborish
    };

    // YANGI - Reset sub-filters
    const handleResetSubFilters = () => {
        setTempSubFilters({
            rough_materials: [],
            finishing_materials: [],
            upholstered_furniture: [],
            cabinet_furniture: [],
            technique: [],
            decor: [],
        });
    };

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

    return (
        <div className='max-md:px-4'>
            <div className="text-white flex justify-between items-center mt-[0px] max-md:px-0">
                <button onClick={onResetFilter} className="cursor-pointer max-md:w-8 max-md:h-8 md:w-30">
                    <IoIosArrowBack size={40} className='max-md:w-6 max-md:h-6' />
                </button>
                <img src="/icons/logo.svg" alt="a" className='max-md:w-20 w-50' />
                <div className='md:w-30'>
                    <img
                        src="/icons/filter.svg"
                        alt="filter"
                        className='w-7 h-7 cursor-pointer hover:opacity-80 transition-opacity'
                        onClick={() => setShowModal(true)}
                    />
                </div>

                {/* YANGI MODAL */}
                {showModal && (
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4"
                        onClick={() => setShowModal(false)}
                    >
                        <div
                            className="bg-glass2 rounded-3xl p-6 max-w-2xl w-full border border-white/20 shadow-2xl max-h-[80vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-white text-xl font-bold mb-4 text-center">
                                Дополнительные фильтры
                            </h3>

                            {loadingSubCategories ? (
                                <div className="text-center text-white py-10">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
                                    <p>Загрузка подкатегорий...</p>
                                </div>
                            ) : !selectedCategories || selectedCategories.length === 0 ? (
                                <div className="text-center text-white/70 py-10">
                                    <p>Пожалуйста, сначала выберите основную категорию</p>
                                </div>
                            ) : subCategoryData ? (
                                <div className="space-y-6">
                                    {selectedCategories.map(category => {
                                        const categoryKey = categoryKeyMap[category];
                                        const subCategories = subCategoryData[categoryKey] || [];

                                        if (subCategories.length === 0) return null;

                                        return (
                                            <div key={categoryKey} className="bg-glass1 p-4 rounded-2xl">
                                                <h4 className="text-white font-semibold mb-3 text-sm">
                                                    {category}
                                                </h4>
                                                <div className="grid grid-cols-2 gap-2">
                                                    {subCategories.map((subCat, index) => (
                                                        <label
                                                            key={index}
                                                            className="bg-glass2 px-3 py-2 rounded-lg cursor-pointer hover:bg-white/30 transition-all flex items-center gap-2"
                                                        >
                                                            <input
                                                                type="checkbox"
                                                                checked={tempSubFilters[categoryKey].includes(subCat.name)}
                                                                onChange={() => handleSubCategoryToggle(categoryKey, subCat.name)}
                                                                className="checkbox-glass"
                                                            />
                                                            <span className="text-xs text-white">{subCat.name}</span>
                                                        </label>
                                                    ))}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    <div className="flex gap-3 mt-6">
                                        <button
                                            onClick={handleResetSubFilters}
                                            className="flex-1 h-12 rounded-full bg-glass2 text-white hover:bg-white/40 
                                                     border border-white/30 font-medium transition-all duration-200"
                                        >
                                            Сбросить
                                        </button>
                                        <button
                                            onClick={handleApplyFilters}
                                            className="flex-1 h-12 rounded-full bg-glass2 text-white hover:bg-white/40 
                                                     border border-yellow-400 font-medium transition-all duration-200"
                                        >
                                            Применить
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <div className="text-center text-white/70 py-10">
                                    <p>Ошибка загрузки подкатегорий</p>
                                </div>
                            )}

                            <button
                                onClick={() => setShowModal(false)}
                                className="w-full h-12 rounded-full bg-glass2 text-white hover:bg-white/40 
                                         border border-white/30 font-medium transition-all duration-200 mt-4"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* REST OF THE CODE REMAINS THE SAME */}
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
                                    className="flex mb-2 cursor-pointer hover:opacity-80 transition-opacity"
                                    onClick={() => onSelectQuestionnaire(questionnaire.id)}
                                >
                                    <div className='w-[120px] h-[100px] card_img flex-shrink-0 overflow-hidden'>
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
                                    <div className="flex flex-col border-b border-b-[#FFFFFF91] pl-12 ml-[-16px] flex-grow">
                                        <h2 className='mb-[-8px] text-[#FFFFFF] text-[22px] line-clamp-1'>
                                            {questionnaire.brand_name || questionnaire.full_name || 'Название организации'}
                                        </h2>
                                        <p className='text-[#FFFFFF] text-sm max-md:text-xs line-clamp-1 mb-2'>
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
                            className="w-[180px] h-[40px] rounded-full bg-glass2 text-white hover:bg-white/40
                                text-sm font-medium transition-all duration-200 flex items-center justify-center"
                        >
                            Сбросить фильтр
                        </button>

                        {hasMore && (
                            <button
                                onClick={onLoadMore}
                                disabled={loading}
                                className={`w-[180px] h-[40px] rounded-full bg-glass2 text-white hover:bg-white/40
                                    text-sm font-medium transition-all duration-200 flex items-center justify-center
                                    ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
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