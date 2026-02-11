'use client';
import { useState, useEffect } from "react";
import axios from "axios";
import { IoIosArrowBack } from 'react-icons/io';
import { BiLoaderAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";
import toast from 'react-hot-toast';

export default function UserInfoBox() {
    const [questionnaire, setQuestionnaire] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('company');
    const [expandedSections, setExpandedSections] = useState({});

    const router = useRouter();

    useEffect(() => {
        fetchMyQuestionnaire();
    }, []);

    const fetchMyQuestionnaire = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");
            if (!token) {
                router.push('/login');
                return;
            }

            const response = await axios.get(
                "https://api.reiting-profi.ru/api/v1/accounts/questionnaires/my-questionnaires/",
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.results && response.data.results.length > 0) {
                setQuestionnaire(response.data.results[0]);
            }
        } catch (err) {
            toast.error("Ошибка при загрузке данных");
        } finally {
            setLoading(false);
        }
    };

    // --- UNIVERSAL MAPPING FUNKSIYALARI ---

    // 1. Bir nechta kalitlardan birinchi qiymatga ega bo'lganini qaytaradi
    const getFirstAvailable = (keys) => {
        if (!questionnaire) return null;
        for (let key of keys) {
            if (questionnaire[key] && (Array.isArray(questionnaire[key]) ? questionnaire[key].length > 0 : true)) {
                return questionnaire[key];
            }
        }
        return null;
    };

    // 2. Rasm uchun (photo yoki company_logo)
    const getAvatar = () => getFirstAvailable(['photo', 'company_logo']);

    // 3. Ism/Brend uchun
    const getName = () => getFirstAvailable(['brand_name', 'full_name']) || 'Без названия';

    // 4. UTP yoki Tavsif uchun
    const getDescription = () => getFirstAvailable([
        'unique_trade_proposal',
        'activity_description',
        'product_assortment',
        'work_list',
        'welcome_message'
    ]);

    // 5. Xizmatlar/Paketlar uchun
    const getServicePackages = () => getFirstAvailable(['service_packages_description', 'project_timelines', 'delivery_terms']);

    // 6. Hamkorlik shartlari uchun
    const getCooperationTerms = () => getFirstAvailable([
        'cooperation_terms',
        'supplier_contractor_recommendation_terms',
        'designer_supplier_terms',
        'designer_contractor_terms'
    ]);

    // --- UI YORDAMCHI FUNKSIYALAR ---

    const toggleSection = (sectionKey) => {
        setExpandedSections(prev => ({ ...prev, [sectionKey]: !prev[sectionKey] }));
    };

    const renderExpandableContent = (content, sectionKey, maxLength = 200) => {
        if (!content) return null;
        const contentStr = String(content);
        const isExpanded = expandedSections[sectionKey];

        if (contentStr.length <= maxLength) return <span>{contentStr}</span>;

        return (
            <>
                {isExpanded ? contentStr : `${contentStr.substring(0, maxLength)}...`}
                <button
                    onClick={() => toggleSection(sectionKey)}
                    className="ml-2 text-blue-400 hover:text-blue-300 underline text-xs"
                >
                    {isExpanded ? 'Скрыть' : 'Показать полностью'}
                </button>
            </>
        );
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#122161]">
                <BiLoaderAlt className="animate-spin text-[#FFFFFF]" size={64} />
            </div>
        );
    }

    if (!questionnaire) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#122161] text-white">
                <p>Анкета не найдена</p>
            </div>
        );
    }

    return (
        <div className='min-h-screen bg-[#122161] text-white max-md:px-4 pb-10 max-w-7xl mx-auto'>
            {/* Header */}
            <div className="text-white flex justify-between items-center py-4 mx-auto">
                <button onClick={() => router.back()} className="cursor-pointer md:w-30">
                    <IoIosArrowBack size={40} className='max-md:w-6 max-md:h-6' />
                </button>
                <img src="/icons/logo.svg" alt="logo" className='max-md:w-20 w-50' />
                <div className="md:w-30"></div>
            </div>

            <div className="max-w-xl mx-auto space-y-2">
                {/* Top Info Section */}
                <div className="flex mb-0">
                    <div className='w-[125px] h-[100px] flex-shrink-0 bg-white/10 rounded-[20px] overflow-hidden border border-white/20'>
                        {getAvatar() ? (
                            <img src={getAvatar()} alt="avatar" className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl font-bold bg-[#FFFFFF]/20">
                                {getName().charAt(0)}
                            </div>
                        )}
                    </div>
                    <div className="flex flex-col border-b border-b-[#FFFFFF91] pl-12 ml-[-16px] flex-grow relative">
                        <h2 className='mb-0.5 text-[#FFFFFF] text-[25px] line-clamp-1'>
                            {getName()}
                        </h2>
                        <div className='w-[calc(100% + 32px)] h-0.25 bg-[#FFFFFF4F]  ml-[-32px]'></div>
                        <p className='text-[#FFFFFF] text-sm mt-1'>
                            Сегменты: {questionnaire.segments?.join(', ') || 'Не указаны'}
                        </p>
                        <div className="absolute bottom-1 right-1">
                            <span className='text-yellow-400'>★</span> {questionnaire.rating_count?.total || 0}
                        </div>
                    </div>
                </div>

                {/* Tabs */}
                <div >
                    <div className='flex border-b border-[#FFFFFF91]'>
                        <button
                            onClick={() => setActiveTab('company')}
                            className={`px-4 py-2 text-center text-[19px] text-[#FFFFFF] transition-all border-r ${activeTab === 'company'
                                ? ''
                                : 'opacity-60'
                                }`}
                        >
                            О компании
                        </button>
                        <button
                            onClick={() => setActiveTab('cooperation')}
                            className={`flex-1 py-2 text-center text-[19px] text-[#FFFFFF] transition-all  ${activeTab === 'cooperation'
                                ? ''
                                : 'opacity-60'
                                }`}
                        >
                            Условия сотрудничества
                        </button>
                    </div>

                    {/* Tab Content */}
                    <div className='mt-4 space-y-2'>
                        {activeTab === 'company' ? (
                            <div className='space-y-4'>
                                {getDescription() && (
                                    <div className='border-b border-white/20 pb-4'>
                                        <p className="text-[19px] uppercase">Описание / УТП:</p>
                                        <div className="text-sm leading-relaxed">
                                            {renderExpandableContent(getDescription(), 'desc')}
                                        </div>
                                    </div>
                                )}

                                {questionnaire.services && questionnaire.services.length > 0 && (
                                    <div className='border-b border-white/20 pb-4'>
                                        <p className="text-[19px] uppercase">Услуги:</p>
                                        <div className="flex flex-wrap gap-2 mt-2">
                                            {questionnaire.services.map((s, i) => (
                                                <span key={i} className=" text-sm ">{s},</span>
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {getServicePackages() && (
                                    <div className='border-b border-white/20 pb-4'>
                                        <p className="text-[19px] uppercase">Пакеты / Сроки / Ассортимент:</p>
                                        <div className="text-sm whitespace-pre-line">
                                            {renderExpandableContent(getServicePackages(), 'packages')}
                                        </div>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className='space-y-4'>
                                <div className='border-b border-white/20 pb-4'>
                                    <p className="text-[19px] uppercase">НДС:</p>
                                    <p className="text-sm">{questionnaire.vat_payment_display || (questionnaire.vat_payment === 'yes' ? 'Да' : 'Нет')}</p>
                                </div>

                                {getCooperationTerms() && (
                                    <div className='border-b border-white/20 pb-4'>
                                        <p className="text-[19px] uppercase">Условия сотрудничества:</p>
                                        <div className="text-sm leading-relaxed">
                                            {renderExpandableContent(getCooperationTerms(), 'coop')}
                                        </div>
                                    </div>
                                )}

                                {questionnaire.guarantees && (
                                    <div className='border-b border-white/20 pb-4'>
                                        <p className="text-[19px] uppercase">Гарантии:</p>
                                        <p className="text-sm">{questionnaire.guarantees}</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Rating Stats */}
                <div className=''>
                    <div className='flex items-center gap-x-4 mb-4'>
                        <h3 className='text-lg font-semibold'>РЕЙТИНГ:</h3>
                        <div className='flex gap-x-6'>
                            <p className="text-sm"><span className='text-yellow-400'>★</span> {questionnaire.rating_count?.positive || 0}</p>
                            <p className="text-sm"><span className='text-gray-400'>☆</span> {questionnaire.rating_count?.constructive || 0}</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}