'use client';
import React, { useState, useEffect } from 'react'
import MediaItem from './media-item';
import MediaDetail from './media-detail';
import axios from 'axios';

export default function MediaBox() {
    const [step, setStep] = useState('list'); // list, detail
    const [questionnaires, setQuestionnaires] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalCount, setTotalCount] = useState(0);
    const limit = 7;

    useEffect(() => {
        fetchQuestionnaires();
    }, []);

    const fetchQuestionnaires = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const params = {
                limit: limit,
                offset: (currentPage - 1) * limit
            };

            const response = await axios.get(
                'https://api.reiting-profi.ru/api/v1/accounts/media-questionnaires/',
                {
                    params: params,
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setQuestionnaires(response.data.results);
            setTotalCount(response.data.count);
        } catch (error) {
            console.error('Media questionnaire yuklashda xatolik:', error);
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
                limit: limit,
                offset: nextPage * limit
            };

            const response = await axios.get(
                'https://api.reiting-profi.ru/api/v1/accounts/media-questionnaires/',
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

    const handleSelectQuestionnaire = async (id) => {
        try {
            setLoading(true);
            const token = localStorage.getItem('access_token');
            if (!token) {
                window.location.href = '/login';
                return;
            }

            const response = await axios.get(
                `https://api.reiting-profi.ru/api/v1/accounts/media-questionnaires/${id}/`,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`
                    }
                }
            );

            setSelectedQuestionnaire(response.data);
            setStep('detail');
        } catch (error) {
            console.error('Media questionnaire detail yuklashda xatolik:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleBackToList = () => {
        setStep('list');
        setSelectedQuestionnaire(null);
    };

    return (
        <div className='max-md:px-4'>
            {step === 'list' && (
                <MediaItem
                    questionnaires={questionnaires}
                    onSelectQuestionnaire={handleSelectQuestionnaire}
                    onLoadMore={handleLoadMore}
                    loading={loading}
                    hasMore={questionnaires.length < totalCount}
                />
            )}
            {step === 'detail' && (
                <MediaDetail
                    questionnaire={selectedQuestionnaire}
                    onBack={handleBackToList}
                />
            )}
        </div>
    )
}