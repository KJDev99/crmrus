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

    const getSelectedLabel = (filterName, value) => {
        if (!value || !filterChoices) return `Выберете ${getPlaceholder(filterName)}`;

        const choices = filterChoices[filterName + (filterName === 'segment' ? 's' : '_options')] ||
            filterChoices[filterName + (filterName === 'property_purpose' ? 's' : '')] ||
            filterChoices[filterName === 'group' ? 'categories' : filterName + 's'] ||
            [];

        const choice = choices.find(item => item.value === value);
        return choice ? choice.label : `Выберете ${getPlaceholder(filterName)}`;
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

    const handleSelect = (filterName, value) => {
        onFilterChange(filterName, value);
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
                            `}
                        >
                            <span className='truncate'>{getSelectedLabel(item.key, selectedFilters[item.key])}</span>
                            <IoIosArrowDown />
                        </button>

                        {dropdowns[item.key] && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-glass2 rounded-2xl z-10 max-h-60 overflow-y-auto">
                                {getChoices(item.key).map((choice) => (
                                    <button
                                        key={choice.value}
                                        onClick={() => handleSelect(item.key, choice.label)}
                                        className={`
                                            w-full text-left px-5 py-3 text-white
                                            hover:bg-white/20 transition-all
                                            ${selectedFilters[item.key] === choice.label ? 'bg-white/30' : ''}
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
                <div className="absolute right-0 top-1/2 -translate-y-1/2 text-white text-[50px]">
                    ★
                </div>
            </div>
        </div>
    )
}