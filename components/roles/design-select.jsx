'use client';
import React, { useState } from 'react'
import Link from 'next/link'
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io'

export default function DesignSelect({ filterChoices, selectedFilters, onFilterChange, onSearch, loading }) {
    const [dropdowns, setDropdowns] = useState({
        category: false,
        city: false,
        segment: false,
        property_purpose: false,
        object_area: false,
        cost_per_sqm: false,
        experience: false,
    });

    const toggleDropdown = (dropdownName) => {
        setDropdowns(prev => ({
            ...prev,
            [dropdownName]: !prev[dropdownName]
        }));
    };

    const getSelectedLabel = (filterName) => {
        const value = selectedFilters[filterName];
        if (!value || !filterChoices) return `Выберете ${getPlaceholder(filterName)}`;

        const choices = getChoices(filterName);

        // Filter by value (backend qiymati)
        const choice = choices.find(item => item.value === value);

        // Agar value topilmasa, label orqali qidirish (eski versiya uchun)
        if (!choice) {
            const choiceByLabel = choices.find(item => item.label === value);
            return choiceByLabel ? choiceByLabel.label : `Выберете ${getPlaceholder(filterName)}`;
        }

        return choice.label;
    };

    const getPlaceholder = (filterName) => {
        const placeholders = {
            group: 'основную категорию',
            city: 'город',
            segment: 'сегмент',
            property_purpose: 'назначение недвижимости',
            object_area: 'площадь объекта',
            cost_per_sqm: 'стоимость за м2',
            experience: 'опыт работы',
        };
        return placeholders[filterName] || '';
    };

    const handleSelect = (filterName, choice) => {
        // Bu yerda choice objectni (value va label) yuboramiz
        onFilterChange(filterName, choice.value); // Faqat value ni saqlaymiz
        toggleDropdown(filterName);
    };

    const getChoices = (filterName) => {
        if (!filterChoices) return [];

        switch (filterName) {
            case 'group':
                return filterChoices.categories || [];
            case 'city':
                return filterChoices.cities || [];
            case 'segment':
                return filterChoices.segments || [];
            case 'property_purpose':
                return filterChoices.property_purposes || [];
            case 'object_area':
                return filterChoices.object_areas || [];
            case 'cost_per_sqm':
                return filterChoices.cost_per_sqm_options || [];
            case 'experience':
                return filterChoices.experience_options || [];
            default:
                return [];
        }
    };

    if (!filterChoices) {
        return (
            <div className='max-w-7xl m-auto max-md:px-4'>
                <div className="text-white flex justify-between items-center mt-[0px] max-md:px-0">
                    <Link href={'/role'} className="cursor-pointer">
                        <IoIosArrowBack size={40} className='' />
                    </Link>
                    <img src="/icons/logo.svg" alt="a" />
                    <div></div>
                </div>
                <div className='text-center mt-[13px] flex flex-col items-center'>
                    <p className='text-white'>Загрузка...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='max-w-7xl m-auto'>
            <div className="text-white flex justify-between items-center mt-[0px]">
                <Link href={'/role'} className="cursor-pointer">
                    <IoIosArrowBack size={40} className='' />
                </Link>
                <img src="/icons/logo.svg" alt="a" />
                <div></div>
            </div>
            <div className='text-center mt-[13px] flex flex-col items-center'>
                <h2 className='text-xl text-white mb-4'>ДИЗАЙН</h2>

                {[
                    { key: 'group', label: 'Выберете основную категорию' },
                    { key: 'city', label: 'Выберете город' },
                    { key: 'segment', label: 'Выберете сегмент' },
                    { key: 'property_purpose', label: 'Назначение недвижимости' },
                    { key: 'object_area', label: 'Площадь объекта' },
                    { key: 'cost_per_sqm', label: 'Стоимость за м2' },
                    { key: 'experience', label: 'Опыт работы' },
                ].map((item) => (
                    <div key={item.key} className='mt-3 relative'>
                        <button
                            onClick={() => toggleDropdown(item.key)}
                            className={`
                                w-120 h-20 text-[17px]
                                rounded-2xl transition-all duration-200
                                bg-glass2 text-white hover:bg-white/40 text-left px-5
                                flex items-center justify-between
                                ${selectedFilters[item.key] ? 'border border-yellow-400' : ''}
                            `}
                        >
                            <span className='truncate'>{getSelectedLabel(item.key)}</span>
                            <IoIosArrowDown className={selectedFilters[item.key] ? 'text-yellow-400' : ''} />
                        </button>

                        {dropdowns[item.key] && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-glass2 rounded-2xl z-10 max-h-60 overflow-y-auto">
                                {getChoices(item.key).map((choice) => (
                                    <button
                                        key={choice.value}
                                        onClick={() => handleSelect(item.key, choice)}
                                        className={`
                                            w-full text-left px-5 py-3 text-white
                                            hover:bg-white/20 transition-all
                                            ${selectedFilters[item.key] === choice.value ?
                                                'bg-white/30 border-l-4 border-yellow-400' :
                                                ''
                                            }
                                        `}
                                    >
                                        {choice.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                ))}
            </div>

            <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] mb-[64px] flex justify-center">
                <button
                    onClick={onSearch}
                    disabled={loading}
                    className={`
                        w-[180px] h-[40px] rounded-full
                        bg-glass2 text-white hover:bg-white/40
                        text-sm font-medium transition-all duration-200
                        flex items-center justify-center
                        ${loading ? 'opacity-50 cursor-not-allowed' : ''}
                    `}
                >
                    {loading ? 'Загрузка...' : 'ИСКАТЬ'}
                </button>
                <Link href={'/userinfo'}>
                    <div className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-[50px] hidden sm:block">
                        ★
                    </div>
                </Link>
            </div>
        </div>
    )
}