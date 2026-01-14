'use client';
import React, { useState, useEffect } from 'react'
import RepairSelect from './repair-select';
import RepairItem from './repair-item';
import RepairDetail from './repair-detail';
import axios from 'axios';

export default function RepairBox() {
    const [step, setStep] = useState('select'); // select, list, detail
    const [filterChoices, setFilterChoices] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        group: '',
        city: '',
        segment: '',
        vat_payment: '',
        magazine_cards: '',
        execution_speed: '',
        cooperation_terms: '',
        business_form: '',
    });
    const [questionnaires, setQuestionnaires] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 7;

    useEffect(() => {
        fetchFilterChoices();
    }, []);

    const fetchFilterChoices = async () => {
        try {
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await axios.get(
                'https://api.reiting-profi.ru/api/v1/accounts/repair-questionnaires/filter-choices/',
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );
            setFilterChoices(response.data);
        } catch (error) {
            console.error('Filter choices yuklashda xatolik:', error);
        }
    };

    const handleFilterChange = (filterName, value) => {
        setSelectedFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const handleSearch = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const params = {
                ...selectedFilters,
                limit: limit,
                offset: (currentPage - 1) * limit
            };

            // Bo'sh filterlarni olib tashlash va comma bilan ajratilgan qiymatlarni qayta ishlash
            Object.keys(params).forEach(key => {
                if (!params[key]) {
                    delete params[key];
                } else if (Array.isArray(params[key])) {
                    params[key] = params[key].join(',');
                }
            });

            const response = await axios.get(
                'https://api.reiting-profi.ru/api/v1/accounts/repair-questionnaires/',
                {
                    params: params,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setQuestionnaires(response.data.results);
            setTotalCount(response.data.count);
            setStep('list');
        } catch (error) {
            console.error('Repair questionnaire yuklashda xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleLoadMore = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const nextPage = currentPage + 1;
            const params = {
                ...selectedFilters,
                limit: limit,
                offset: nextPage * limit
            };

            Object.keys(params).forEach(key => {
                if (!params[key]) {
                    delete params[key];
                } else if (Array.isArray(params[key])) {
                    params[key] = params[key].join(',');
                }
            });

            const response = await axios.get(
                'https://api.reiting-profi.ru/api/v1/accounts/repair-questionnaires/',
                {
                    params: params,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setQuestionnaires(prev => [...prev, ...response.data.results]);
            setCurrentPage(nextPage);
        } catch (error) {
            console.error('Ko\'proq yuklashda xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleResetFilter = () => {
        setSelectedFilters({
            group: '',
            city: '',
            segment: '',
            vat_payment: '',
            magazine_cards: '',
            execution_speed: '',
            cooperation_terms: '',
            business_form: '',
        });
        setQuestionnaires([]);
        setCurrentPage(1);
        setStep('select');
    };

    const handleSelectQuestionnaire = async (id) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await axios.get(
                `https://api.reiting-profi.ru/api/v1/accounts/repair-questionnaires/${id}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSelectedQuestionnaire(response.data);
            setStep('detail');
        } catch (error) {
            console.error('Repair questionnaire detail yuklashda xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setStep('list');
        setSelectedQuestionnaire(null);
    };

    const handleBackToSelect = () => {
        setStep('select');
    };

    return (
        <div className='max-md:px-4 max-w-7xl mx-auto'>
            {step === 'select' && (
                <RepairSelect
                    filterChoices={filterChoices}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    loading={loading}
                />
            )}
            {step === 'list' && (
                <RepairItem
                    questionnaires={questionnaires}
                    onSelectQuestionnaire={handleSelectQuestionnaire}
                    onLoadMore={handleLoadMore}
                    onResetFilter={handleResetFilter}
                    loading={loading}
                    hasMore={questionnaires.length < totalCount}
                />
            )}
            {step === 'detail' && (
                <RepairDetail
                    questionnaire={selectedQuestionnaire}
                    onBack={handleBackToList}
                />
            )}
        </div>
    )
}