'use client';
import React, { useState } from 'react'
import GlassButton from '../ui/GlassButton1'
import Link from 'next/link'
import { IoIosArrowBack, IoIosArrowDown } from 'react-icons/io'

export default function RepairSelect({ filterChoices, selectedFilters, onFilterChange, onSearch, loading }) {
    const [dropdowns, setDropdowns] = useState({
        group: false,
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

    const getSelectedLabel = (filterName, value) => {
        if (!value || !filterChoices) return `Выберете ${getPlaceholder(filterName)}`;

        let choices = [];

        switch (filterName) {
            case 'group':
                choices = filterChoices.categories || [];
                break;
            case 'city':
                choices = filterChoices.cities || [];
                break;
            case 'segment':
                choices = filterChoices.segments || [];
                break;
            case 'vat_payment':
                choices = filterChoices.vat_payments || [];
                break;
            case 'magazine_cards':
                choices = filterChoices.magazine_cards || [];
                break;
            case 'execution_speed':
                choices = filterChoices.execution_speeds || [];
                break;
            case 'cooperation_terms':
                choices = filterChoices.cooperation_terms_options || [];
                break;
            case 'business_form':
                choices = filterChoices.business_forms || [];
                break;
            default:
                choices = [];
        }

        const choice = choices.find(item => item.value === value);
        return choice ? choice.label : `Выберете ${getPlaceholder(filterName)}`;
    };

    const getPlaceholder = (filterName) => {
        const placeholders = {
            group: 'основную категорию',
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

    const handleSelect = (filterName, value) => {
        onFilterChange(filterName, value);
        toggleDropdown(filterName);
    };

    const getChoices = (filterName) => {
        console.log(filterName, filterChoices);

        if (!filterChoices) return [];

        switch (filterName) {
            case 'group':
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
                    <img src="/icons/logo.svg" alt="a" />
                    <div></div>
                </div>
                <div className='text-center mt-[13px] flex flex-col items-center'>
                    <p className='text-white'>Загрузка...</p>
                </div>
            </div>
        );
    }

    const filterConfigs = [
        { key: 'group', label: 'Выберете основную категорию' },
        { key: 'city', label: 'Выберете город' },
        { key: 'segment', label: 'Выберете сегмент' },
        { key: 'vat_payment', label: 'Наличие НДС' },
        { key: 'magazine_cards', label: 'Карточки журналов' },
        { key: 'execution_speed', label: 'Скорость исполнения' },
        { key: 'cooperation_terms', label: 'Условия сотрудничества' },
        { key: 'business_form', label: 'Форма бизнеса' },
    ];

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
                <h2 className='text-xl text-white mb-4'>РЕМОНТ</h2>

                {filterConfigs.map((item) => (
                    <div key={item.key} className='mt-3 relative w-120'>
                        <button
                            onClick={() => toggleDropdown(item.key)}
                            className={`
                                w-full h-20 text-[17px]
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