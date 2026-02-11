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
        const values = selectedFilters[filterName];
        if (!values || !filterChoices || (Array.isArray(values) && values.length === 0)) {
            return `Выберите ${getPlaceholder(filterName)}`;
        }

        const choices = getChoices(filterName);
        const valuesArray = Array.isArray(values) ? values : [values];

        const selectedLabels = valuesArray
            .map(value => {
                const choice = choices.find(item => item.value === value);
                return choice ? choice.label : null;
            })
            .filter(Boolean);

        if (selectedLabels.length === 0) {
            return `Выберите ${getPlaceholder(filterName)}`;
        }

        return selectedLabels.join(', ');
    };

    const getPlaceholder = (filterName) => {
        const placeholders = {
            category: 'основную категорию',
            city: 'город',
            segment: 'сегмент',
            property_purpose: 'назначение недвижимости',
            object_area: 'площадь объекта',
            cost_per_sqm: 'стоимость за м2',
            experience: 'опыт работы',
        };
        return placeholders[filterName] || '';
    };

    const handleSelect = (filterName, choiceValue) => {
        const currentValues = selectedFilters[filterName];
        const valuesArray = Array.isArray(currentValues) ? currentValues : (currentValues ? [currentValues] : []);

        let newValues;
        if (valuesArray.includes(choiceValue)) {
            // Agar allaqachon tanlangan bo'lsa, olib tashlaymiz
            newValues = valuesArray.filter(v => v !== choiceValue);
        } else {
            // Agar tanlanmagan bo'lsa, qo'shamiz
            newValues = [...valuesArray, choiceValue];
        }

        onFilterChange(filterName, newValues);
    };

    const isSelected = (filterName, choiceValue) => {
        const currentValues = selectedFilters[filterName];
        const valuesArray = Array.isArray(currentValues) ? currentValues : (currentValues ? [currentValues] : []);
        return valuesArray.includes(choiceValue);
    };

    const getChoices = (filterName) => {
        if (!filterChoices) return [];

        switch (filterName) {
            case 'category':
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
                    <img src="/icons/logo.svg" alt="a" className='max-md:w-20 w-50' />
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
            <div className="text-white flex justify-between items-center mt-[0px] ">
                <Link href={'/role'} className="cursor-pointer md:w-30">
                    <IoIosArrowBack size={40} className='' />
                </Link>
                <img src="/icons/logo.svg" alt="a" className='max-md:w-20 w-50' />
                <div className='md:w-30'></div>
            </div>
            <div className='text-center mt-[13px] flex flex-col items-center'>
                <h2 className='text-[24px] text-white mb-4'>ДИЗАЙН</h2>

                {[
                    { key: 'category', label: 'Выберите основную категорию' },
                    { key: 'city', label: 'Выберите город' },
                    { key: 'segment', label: 'Выберите сегмент' },
                    { key: 'property_purpose', label: 'Назначение недвижимости' },
                    { key: 'object_area', label: 'Площадь объекта' },
                    { key: 'cost_per_sqm', label: 'Стоимость за м2' },
                    { key: 'experience', label: 'Опыт работы' },
                ].map((item) => (
                    <div key={item.key} className='mt-3 relative'>
                        <button
                            onClick={() => toggleDropdown(item.key)}
                            className={`
                                w-120 h-[58px] text-[17px]
                                rounded-[25px] transition-all duration-200
                                bg-glass2 text-white hover:bg-white/40 text-left px-5
                                flex items-center justify-between
                                ${selectedFilters[item.key] && (Array.isArray(selectedFilters[item.key]) ? selectedFilters[item.key].length > 0 : true) ? 'border border-yellow-400' : ''}
                            `}
                        >
                            <span className='truncate'>{getSelectedLabel(item.key)}</span>
                            {/* <IoIosArrowDown className={selectedFilters[item.key] && (Array.isArray(selectedFilters[item.key]) ? selectedFilters[item.key].length > 0 : true) ? 'text-yellow-400' : ''} /> */}
                        </button>

                        {dropdowns[item.key] && (
                            <div className="absolute top-full left-0 right-0 mt-1 bg-glass2 rounded-2xl z-10 max-h-60 overflow-y-auto">
                                {getChoices(item.key).map((choice) => (
                                    <button
                                        key={choice.value}
                                        onClick={() => handleSelect(item.key, choice.value)}
                                        className={`
                                            w-full text-left px-5 py-3 text-white
                                            hover:bg-white/20 transition-all
                                            ${isSelected(item.key, choice.value) ?
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