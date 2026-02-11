'use client';
import React, { useState, useEffect } from 'react'
import SupplierSelect from './supplier-select';
import SupplierItem from './supplier-item';
import SupplierDetail from './supplier-detail';
import axios from 'axios';

export default function SupplierBox() {
    const [step, setStep] = useState('select');
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
        category: [], // YANGI - array formatda
    });

    // YANGI - Sub-category filter uchun
    const [subCategoryFilters, setSubCategoryFilters] = useState({
        rough_materials: [],
        finishing_materials: [],
        upholstered_furniture: [],
        cabinet_furniture: [],
        technique: [],
        decor: [],
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
                'https://api.reiting-profi.ru/api/v1/accounts/supplier-questionnaires/filter-choices/',
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

    // YANGI - Sub-category filter change handler
    const handleSubCategoryFilterChange = (categoryKey, values) => {
        setSubCategoryFilters(prev => ({
            ...prev,
            [categoryKey]: values
        }));
    };

    const handleSearch = async (optionalSubFilters = null) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            // Agar optionalSubFilters berilgan bo'lsa, ularni ishlatish
            const activeSubFilters = optionalSubFilters || subCategoryFilters;

            const params = {
                ...selectedFilters,
                ...activeSubFilters, // yangilangan filterlar
                limit: limit,
                offset: (currentPage - 1) * limit
            };

            // Bo'sh filterlarni olib tashlash
            Object.keys(params).forEach(key => {
                if (!params[key] || (Array.isArray(params[key]) && params[key].length === 0)) {
                    delete params[key];
                } else if (Array.isArray(params[key])) {
                    params[key] = params[key].join(',');
                }
            });

            const response = await axios.get(
                'https://api.reiting-profi.ru/api/v1/accounts/supplier-questionnaires/',
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
            console.error('Supplier questionnaire yuklashda xatolik:', error);
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
                ...subCategoryFilters, // YANGI
                limit: limit,
                offset: nextPage * limit
            };

            Object.keys(params).forEach(key => {
                if (!params[key] || (Array.isArray(params[key]) && params[key].length === 0)) {
                    delete params[key];
                } else if (Array.isArray(params[key])) {
                    params[key] = params[key].join(',');
                }
            });

            const response = await axios.get(
                'https://api.reiting-profi.ru/api/v1/accounts/supplier-questionnaires/',
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
            category: [], // YANGI
        });
        // YANGI - Sub-category filterlarni ham reset qilish
        setSubCategoryFilters({
            rough_materials: [],
            finishing_materials: [],
            upholstered_furniture: [],
            cabinet_furniture: [],
            technique: [],
            decor: [],
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
                `https://api.reiting-profi.ru/api/v1/accounts/supplier-questionnaires/${id}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSelectedQuestionnaire(response.data);
            setStep('detail');
        } catch (error) {
            console.error('Supplier questionnaire detail yuklashda xatolik:', error);
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
                <SupplierSelect
                    filterChoices={filterChoices}
                    selectedFilters={selectedFilters}
                    onFilterChange={handleFilterChange}
                    onSearch={handleSearch}
                    loading={loading}
                />
            )}
            {step === 'list' && (
                <SupplierItem
                    questionnaires={questionnaires}
                    onSelectQuestionnaire={handleSelectQuestionnaire}
                    onLoadMore={handleLoadMore}
                    onResetFilter={handleResetFilter}
                    loading={loading}
                    hasMore={questionnaires.length < totalCount}
                    selectedCategories={selectedFilters.category} // YANGI
                    subCategoryFilters={subCategoryFilters} // YANGI
                    onSubCategoryFilterChange={handleSubCategoryFilterChange} // YANGI
                    onApplySubFilters={handleSearch} // YANGI
                />
            )}
            {step === 'detail' && (
                <SupplierDetail
                    questionnaire={selectedQuestionnaire}
                    onBack={handleBackToList}
                />
            )}
        </div>
    )
}