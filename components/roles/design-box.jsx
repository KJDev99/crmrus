'use client';
import React, { useState, useEffect } from 'react'
import DesignSelect from './design-select';
import DesignItem from './design-item';
import DesignDetail from './design-detail';
import axios from 'axios';

export default function DesignBox() {
    const [step, setStep] = useState('select'); // select, list, detail
    const [filterChoices, setFilterChoices] = useState(null);
    const [selectedFilters, setSelectedFilters] = useState({
        group: '',
        city: '',
        segment: '',
        property_purpose: '',
        object_area: '',
        cost_per_sqm: '',
        experience: '',
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
                'https://api.reiting-profi.ru/api/v1/accounts/questionnaires/filter-choices/',
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

            // Bo'sh filterlarni olib tashlash
            Object.keys(params).forEach(key => {
                if (!params[key]) {
                    delete params[key];
                }
            });

            const response = await axios.get(
                'https://api.reiting-profi.ru/api/v1/accounts/questionnaires/',
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
            console.error('Questionnaire yuklashda xatolik:', error);
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
                }
            });

            const response = await axios.get(
                'https://api.reiting-profi.ru/api/v1/accounts/questionnaires/',
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
            property_purpose: '',
            object_area: '',
            cost_per_sqm: '',
            experience: '',
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
                `https://api.reiting-profi.ru/api/v1/accounts/questionnaires/${id}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSelectedQuestionnaire(response.data);
            setStep('detail');
        } catch (error) {
            console.error('Questionnaire detail yuklashda xatolik:', error);
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
                <DesignSelect
                    filterChoices={filterChoices}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    loading={loading}
                />
            )}
            {step === 'list' && (
                <DesignItem
                    questionnaires={questionnaires}
                    onSelectQuestionnaire={handleSelectQuestionnaire}
                    onLoadMore={handleLoadMore}
                    onResetFilter={handleResetFilter}
                    loading={loading}
                    hasMore={questionnaires.length < totalCount}
                />
            )}
            {step === 'detail' && (
                <DesignDetail
                    questionnaire={selectedQuestionnaire}
                    onBack={handleBackToList}
                />
            )}
        </div>
    )
}