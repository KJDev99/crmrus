'use client';
import React, { useState } from 'react'
import GlassButton from '../ui/GlassButton1'
import Link from 'next/link'
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io'

export default function RepairSelect({ filterChoices, selectedFilters, onFilterChange, onSearch, loading }) {
    const [dropdowns, setDropdowns] = useState({
        category: false,
        city: false,
        segment: false,
        vat_payment: false,
        magazine_cards: false,
        execution_speed: false,
        cooperation_terms: false,
        business_form: false,
    });

    const toggleDropdown = (dropdownName) => {
        setDropdowns(prev => ({
            ...prev,
            [dropdownName]: !prev[dropdownName]
        }));
    };

    const getSelectedLabel = (filterName) => {
        const values = selectedFilters[filterName];
        if (!values || (Array.isArray(values) && values.length === 0)) {
            return `Выберите ${getPlaceholder(filterName)}`;
        }

        const valuesArray = Array.isArray(values) ? values : [values];

        if (valuesArray.length === 0) {
            return `Выберите ${getPlaceholder(filterName)}`;
        }

        return valuesArray.join(', ');
    };

    const getPlaceholder = (filterName) => {
        const placeholders = {
            category: 'основную категорию',
            city: 'город',
            segment: 'сегмент',
            vat_payment: 'наличие НДС',
            magazine_cards: 'карточки журналов',
            execution_speed: 'скорость исполнения',
            cooperation_terms: 'условия сотрудничества',
            business_form: 'форму бизнеса',
        };
        return placeholders[filterName] || '';
    };

    const handleSelect = (filterName, choiceLabel) => {
        const currentValues = selectedFilters[filterName];
        const valuesArray = Array.isArray(currentValues) ? currentValues : (currentValues ? [currentValues] : []);

        let newValues;
        if (valuesArray.includes(choiceLabel)) {
            // Agar allaqachon tanlangan bo'lsa, olib tashlaymiz
            newValues = valuesArray.filter(v => v !== choiceLabel);
        } else {
            // Agar tanlanmagan bo'lsa, qo'shamiz
            newValues = [...valuesArray, choiceLabel];
        }

        onFilterChange(filterName, newValues);
    };

    const isSelected = (filterName, choiceLabel) => {
        const currentValues = selectedFilters[filterName];
        const valuesArray = Array.isArray(currentValues) ? currentValues : (currentValues ? [currentValues] : []);
        return valuesArray.includes(choiceLabel);
    };

    const getChoices = (filterName) => {
        console.log(filterName, filterChoices);

        if (!filterChoices) return [];

        switch (filterName) {
            case 'category':
                return filterChoices.categories || [];
            case 'city':
                return filterChoices.cities || [];
            case 'segment':
                return filterChoices.segments || [];
            case 'vat_payment':
                return filterChoices.vat_payments || [];
            case 'magazine_cards':
                return filterChoices.magazine_cards || [];
            case 'execution_speed':
                return filterChoices.execution_speeds || [];
            case 'cooperation_terms':
                return filterChoices.cooperation_terms_options || [];
            case 'business_form':
                return filterChoices.business_forms || [];
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

    const filterConfigs = [
        { key: 'category', label: 'Выберите основную категорию' },
        { key: 'city', label: 'Выберите город' },
        { key: 'segment', label: 'Выберите сегмент' },
        { key: 'vat_payment', label: 'Наличие НДС' },
        { key: 'magazine_cards', label: 'Карточки журналов' },
        { key: 'execution_speed', label: 'Скорость исполнения' },
        { key: 'cooperation_terms', label: 'Условия сотрудничества' },
        // { key: 'business_form', label: 'Форма бизнеса' },
    ];

    return (
        <div className='max-w-7xl m-auto'>
            <div className="text-white flex justify-between items-center mt-[0px]">
                <Link href={'/role'} className="cursor-pointer md:w-30">
                    <IoIosArrowBack size={40} className='' />
                </Link>
                <img src="/icons/logo.svg" alt="a" className='max-md:w-20 w-50' />
                <div className='md:w-30'></div>
            </div>
            <div className='text-center mt-[13px] flex flex-col items-center'>
                <h2 className='text-[24px] text-white mb-4'>РЕМОНТ</h2>

                {filterConfigs.map((item) => (
                    <div key={item.key} className='mt-3 relative w-120'>
                        <button
                            onClick={() => toggleDropdown(item.key)}
                            className={`
                                w-full h-[58px] text-[17px]
                                rounded-[35px] transition-all duration-200
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
                                        onClick={() => handleSelect(item.key, choice.label)}
                                        className={`
                                            w-full text-left px-5 py-3 text-white
                                            hover:bg-white/20 transition-all
                                            ${isSelected(item.key, choice.label) ?
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