'use client'
import { useState, useEffect } from "react";
import axios from "axios";
import { FaUser, FaBuilding, FaPalette, FaNewspaper, FaTimes } from "react-icons/fa";
import { BiLoaderAlt } from "react-icons/bi";
import { useRouter } from "next/navigation";

export default function UserInfoBox() {
    const [questionnaires, setQuestionnaires] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedQuestionnaire, setSelectedQuestionnaire] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
    });
    const [filters, setFilters] = useState({
        limit: 20,
        offset: 0,
    });

    const router = useRouter();

    useEffect(() => {
        fetchMyQuestionnaires();
    }, []);

    const fetchMyQuestionnaires = async () => {
        try {
            setLoading(true);
            setError(null);

            const token = localStorage.getItem("access_token");

            if (!token) {
                router.push('/login');
                return;
            }

            const params = {
                limit: filters.limit,
                offset: filters.offset,
            };

            const response = await axios.get(
                "https://api.reiting-profi.ru/api/v1/accounts/questionnaires/my-questionnaires/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: params
                }
            );

            if (response.data.results && Array.isArray(response.data.results)) {
                setQuestionnaires(response.data.results);
                setPagination({
                    count: response.data.count || 0,
                    next: response.data.next,
                    previous: response.data.previous,
                });
            } else {
                setQuestionnaires([]);
                setPagination({ count: 0, next: null, previous: null });
            }
        } catch (err) {
            console.error("Ошибка при загрузке анкет:", err);
            setError(err.response?.data?.message || err.message || "Ошибка при загрузке данных");
            setQuestionnaires([]);
            setPagination({ count: 0, next: null, previous: null });
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const formatPhone = (phone) => {
        if (!phone) return "";
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11 && cleaned.startsWith('7')) {
            return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
        }
        if (cleaned.length === 12 && cleaned.startsWith('998')) {
            return `+998 (${cleaned.slice(3, 5)}) ${cleaned.slice(5, 8)}-${cleaned.slice(8, 10)}-${cleaned.slice(10)}`;
        }
        return phone;
    };

    const translateService = (service) => {
        const translations = {
            'architecture': 'Архитектура',
            'designer_horika': 'Дизайнер Horeca',
            'commercial_designer': 'Коммерческий дизайнер',
            'decorator': 'Декоратор',
            'residential_designer': 'Жилой дизайнер',
            'author_supervision': 'Авторский надзор',
            'completing': 'Комплектация',
            'premium': 'Премиум',
            'business': 'Бизнес',
            'medium': 'Средний',
            'horeca': 'Horeca'
        };
        return translations[service] || service;
    };

    const openModal = (questionnaire) => {
        setSelectedQuestionnaire(questionnaire);
        setIsModalOpen(true);
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        setSelectedQuestionnaire(null);
        setIsModalOpen(false);
        document.body.style.overflow = 'unset';
    };

    const getGroupIcon = (group) => {
        switch (group) {
            case 'design':
                return <FaPalette className="text-[#D7B706]" size={24} />;
            case 'supplier':
                return <FaBuilding className="text-[#D7B706]" size={24} />;
            case 'media':
                return <FaNewspaper className="text-[#D7B706]" size={24} />;
            default:
                return <FaUser className="text-[#D7B706]" size={24} />;
        }
    };

    const getStatusBadge = (status, statusDisplay) => {
        const statusColors = {
            'published': 'bg-green-600/30 text-green-400 border-green-600/50',
            'pending': 'bg-yellow-600/30 text-yellow-400 border-yellow-600/50',
            'rejected': 'bg-red-600/30 text-red-400 border-red-600/50',
            'archived': 'bg-gray-600/30 text-gray-400 border-gray-600/50',
        };

        return (
            <span className={`px-3 py-1 rounded-full text-sm border ${statusColors[status] || 'bg-gray-600/30 text-gray-400 border-gray-600/50'}`}>
                {statusDisplay || status}
            </span>
        );
    };

    const handleNextPage = () => {
        if (pagination.next) {
            const newFilters = { ...filters, offset: filters.offset + filters.limit };
            setFilters(newFilters);
            fetchMyQuestionnaires();
        }
    };

    const handlePrevPage = () => {
        if (pagination.previous) {
            const newFilters = { ...filters, offset: Math.max(0, filters.offset - filters.limit) };
            setFilters(newFilters);
            fetchMyQuestionnaires();
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#122161]">
                <div className="text-center">
                    <BiLoaderAlt className="animate-spin text-[#D7B706] mx-auto mb-4" size={64} />
                    <p className="text-2xl text-white font-light">Загрузка анкет...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#122161] px-4">
                <div className="bg-red-900/20 border-2 border-red-600/50 rounded-2xl p-8 max-w-2xl w-full backdrop-blur-sm">
                    <h2 className="text-3xl text-red-400 font-light mb-4">Ошибка загрузки</h2>
                    <p className="text-xl text-white/80">{error}</p>
                    <button
                        onClick={fetchMyQuestionnaires}
                        className="mt-6 px-6 py-3 bg-[#D7B706] hover:bg-[#B89A05] text-black rounded-full font-medium transition-all duration-300"
                    >
                        Попробовать снова
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#122161] text-white">
            {/* Header Section */}
            <div className="px-4 py-12 ml-20">
                <h1 className="text-5xl font-light mb-3 text-white tracking-tight">
                    МОИ АНКЕТЫ
                </h1>

            </div>

            {/* Content Section */}
            <div className="px-4 ml-20 mr-20">
                {questionnaires.length === 0 ? (
                    <div className="bg-[#1a2574]/50 backdrop-blur-sm border border-white/10 rounded-3xl p-16 text-center">
                        <div className="max-w-md mx-auto">
                            <FaUser className="text-white/20 mx-auto mb-6" size={80} />
                            <h3 className="text-3xl font-light text-white mb-4">Анкеты не найдены</h3>
                            <p className="text-xl text-white/60 font-light">
                                У вас пока нет созданных анкет
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {questionnaires.map((questionnaire, index) => (
                            <div
                                key={`${questionnaire.id}-${index}`}
                                className="group relative bg-gradient-to-r from-[#1a2574]/80 to-[#0f1845]/80 backdrop-blur-sm border border-white/10 rounded-2xl p-8 hover:border-[#D7B706]/50 transition-all duration-500 hover:shadow-2xl hover:shadow-[#D7B706]/10"
                            >
                                {/* Decorative Corner Accent */}
                                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D7B706]/10 to-transparent rounded-br-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                <div className="relative z-10">
                                    {/* Header Row */}
                                    <div className="flex items-start justify-between mb-6">
                                        <div className="flex items-center gap-4">

                                            <div>
                                                <h3 className="text-2xl font-normal text-white mb-1 group-hover:text-[#D7B706] transition-colors duration-300">
                                                    {questionnaire.full_name || questionnaire.brand_name || "Без названия"}
                                                </h3>
                                                <p className="text-lg text-white/60 font-light">
                                                    {questionnaire.group_display || questionnaire.group}
                                                </p>
                                            </div>
                                        </div>

                                    </div>

                                    {/* Info Grid */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                                        {/* Phone */}
                                        {questionnaire.phone && (
                                            <div className="space-y-1">
                                                <p className="text-sm text-white/40 font-light uppercase tracking-wider">Телефон</p>
                                                <p className="text-lg text-white font-normal">{formatPhone(questionnaire.phone)}</p>
                                            </div>
                                        )}

                                        {/* Email */}
                                        {questionnaire.email && (
                                            <div className="space-y-1">
                                                <p className="text-sm text-white/40 font-light uppercase tracking-wider">Email</p>
                                                <p className="text-lg text-white font-normal break-all">{questionnaire.email}</p>
                                            </div>
                                        )}

                                        {/* City or Brand */}
                                        {(questionnaire.city || questionnaire.brand_name) && (
                                            <div className="space-y-1">
                                                <p className="text-sm text-white/40 font-light uppercase tracking-wider">
                                                    {questionnaire.city ? 'Город' : 'Бренд'}
                                                </p>
                                                <p className="text-lg text-white font-normal">
                                                    {questionnaire.city || questionnaire.brand_name}
                                                </p>
                                            </div>
                                        )}
                                    </div>

                                    {/* Footer Row */}
                                    <div className="flex items-center justify-between pt-6 border-t border-white/10">
                                        <div className="flex items-center gap-6">

                                        </div>

                                        <button
                                            onClick={() => openModal(questionnaire)}
                                            className="px-8 py-3 bg-[#D7B706]/80 hover:bg-[#D7B706] text-black rounded-full font-medium transition-all duration-300 hover:shadow-lg hover:shadow-[#D7B706]/30 hover:scale-105"
                                        >
                                            ПОСМОТРЕТЬ
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Pagination */}
                {pagination.count > filters.limit && (
                    <div className="flex items-center justify-between mt-12 pb-12">
                        <button
                            onClick={handlePrevPage}
                            disabled={!pagination.previous}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${pagination.previous
                                ? 'bg-[#D7B706]/20 hover:bg-[#D7B706]/40 text-[#D7B706] border border-[#D7B706]/50'
                                : 'bg-gray-700/20 text-gray-500 cursor-not-allowed border border-gray-700/50'
                                }`}
                        >
                            Предыдущая
                        </button>

                        <div className="text-white/60 font-light">
                            Показано {Math.min(filters.offset + 1, pagination.count)}-
                            {Math.min(filters.offset + filters.limit, pagination.count)} из {pagination.count}
                        </div>

                        <button
                            onClick={handleNextPage}
                            disabled={!pagination.next}
                            className={`px-6 py-3 rounded-full font-medium transition-all duration-300 ${pagination.next
                                ? 'bg-[#D7B706]/20 hover:bg-[#D7B706]/40 text-[#D7B706] border border-[#D7B706]/50'
                                : 'bg-gray-700/20 text-gray-500 cursor-not-allowed border border-gray-700/50'
                                }`}
                        >
                            Следующая
                        </button>
                    </div>
                )}
            </div>

            {/* Modal */}
            {isModalOpen && selectedQuestionnaire && (
                <div
                    className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto"
                    onClick={closeModal}
                >
                    <div
                        className="bg-gradient-to-br from-[#1a2574] to-[#0f1845] border border-[#D7B706]/30 rounded-3xl max-w-4xl w-full my-8 shadow-2xl shadow-[#D7B706]/20"
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div className="relative border-b border-white/10 p-8">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-4">
                                    <div className="bg-[#0a1038] p-0 rounded-xl border border-[#D7B706]/50">
                                        {
                                            selectedQuestionnaire.photo ?
                                                <img
                                                    src={selectedQuestionnaire.photo}
                                                    alt="Фото анкеты"
                                                    className="rounded-xl border border-white/10 max-w-md w-16 h-16"
                                                /> : <div className="w-16 h-16 flex items-center justify-center"><FaUser /></div>
                                        }
                                    </div>
                                    <div>
                                        <h2 className="text-3xl font-normal text-white mb-2">
                                            {selectedQuestionnaire.full_name || selectedQuestionnaire.brand_name || "Без названия"}
                                        </h2>
                                        <div className="flex items-center gap-3">
                                            <p className="text-lg text-white/60">
                                                {selectedQuestionnaire.group_display || selectedQuestionnaire.group}
                                            </p>
                                            <span className="text-white/40">•</span>
                                            <span className="text-sm text-white/40">
                                                ID: {selectedQuestionnaire.id}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                {/* <button
                                    onClick={closeModal}
                                    className="bg-red-500/20 hover:bg-red-500/30 p-3 rounded-full transition-colors duration-300 border border-red-500/30"
                                >
                                    <FaTimes className="text-red-400" size={24} />
                                </button> */}
                            </div>

                            <div className="mt-4">
                                {getStatusBadge(selectedQuestionnaire.status, selectedQuestionnaire.status_display)}
                            </div>
                        </div>

                        {/* Modal Body */}
                        <div className="p-8 max-h-[70vh] overflow-y-auto">
                            {/* Basic Information */}
                            <div className="mb-8">
                                <h3 className="text-xl text-[#D7B706] font-medium mb-4 uppercase tracking-wider">
                                    Основная информация
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {selectedQuestionnaire.full_name && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-white/40 font-light uppercase tracking-wider">ФИО</p>
                                            <p className="text-lg text-white">{selectedQuestionnaire.full_name}</p>
                                        </div>
                                    )}
                                    {/* 
                                    {selectedQuestionnaire.full_name_en && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-white/40 font-light uppercase tracking-wider">ФИО (English)</p>
                                            <p className="text-lg text-white">{selectedQuestionnaire.full_name_en}</p>
                                        </div>
                                    )} */}

                                    {selectedQuestionnaire.brand_name && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-white/40 font-light uppercase tracking-wider">Название бренда</p>
                                            <p className="text-lg text-white">{selectedQuestionnaire.brand_name}</p>
                                        </div>
                                    )}

                                    {selectedQuestionnaire.phone && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-white/40 font-light uppercase tracking-wider">Телефон</p>
                                            <p className="text-lg text-white">{formatPhone(selectedQuestionnaire.phone)}</p>
                                        </div>
                                    )}

                                    {selectedQuestionnaire.email && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-white/40 font-light uppercase tracking-wider">Email</p>
                                            <p className="text-lg text-white break-all">{selectedQuestionnaire.email}</p>
                                        </div>
                                    )}

                                    {selectedQuestionnaire.birth_date && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-white/40 font-light uppercase tracking-wider">Дата рождения</p>
                                            <p className="text-lg text-white">{formatDate(selectedQuestionnaire.birth_date)}</p>
                                        </div>
                                    )}

                                    {selectedQuestionnaire.city && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-white/40 font-light uppercase tracking-wider">Город</p>
                                            <p className="text-lg text-white">{selectedQuestionnaire.city}</p>
                                        </div>
                                    )}
                                    {/* 
                                    {selectedQuestionnaire.responsible_person && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-white/40 font-light uppercase tracking-wider">Ответственное лицо</p>
                                            <p className="text-lg text-white">{selectedQuestionnaire.responsible_person}</p>
                                        </div>
                                    )} */}

                                    {selectedQuestionnaire.work_type_display && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-white/40 font-light uppercase tracking-wider">Тип работы</p>
                                            <p className="text-lg text-white">{selectedQuestionnaire.work_type_display}</p>
                                        </div>
                                    )}

                                    {selectedQuestionnaire.vat_payment_display && (
                                        <div className="space-y-1">
                                            <p className="text-sm text-white/40 font-light uppercase tracking-wider">НДС</p>
                                            <p className="text-lg text-white">{selectedQuestionnaire.vat_payment_display}</p>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Services */}
                            {selectedQuestionnaire.services && selectedQuestionnaire.services.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xl text-[#D7B706] font-medium mb-4 uppercase tracking-wider">
                                        Услуги
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedQuestionnaire.services.map((service, idx) => (
                                            <span
                                                key={idx}
                                                className="px-5 py-2.5 bg-[#D7B706]/20 border border-[#D7B706]/40 text-[#D7B706] rounded-full text-base font-light"
                                            >
                                                {translateService(service)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Segments */}
                            {selectedQuestionnaire.segments && selectedQuestionnaire.segments.length > 0 && (
                                <div className="mb-8">
                                    <h3 className="text-xl text-[#D7B706] font-medium mb-4 uppercase tracking-wider">
                                        Сегменты
                                    </h3>
                                    <div className="flex flex-wrap gap-3">
                                        {selectedQuestionnaire.segments.map((segment, idx) => (
                                            <span
                                                key={idx}
                                                className="px-5 py-2.5 bg-[#D7B706]/20 border border-[#D7B706]/40 text-[#D7B706] rounded-full text-base font-light"
                                            >
                                                {translateService(segment)}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Social Networks */}
                            {(selectedQuestionnaire.vk || selectedQuestionnaire.telegram_channel || selectedQuestionnaire.instagram || selectedQuestionnaire.pinterest || selectedQuestionnaire.website) && (
                                <div className="mb-8">
                                    <h3 className="text-xl text-[#D7B706] font-medium mb-4 uppercase tracking-wider">
                                        Социальные сети
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {selectedQuestionnaire.vk && (
                                            <a href={selectedQuestionnaire.vk} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D7B706] transition-colors">
                                                VK: {selectedQuestionnaire.vk}
                                            </a>
                                        )}
                                        {selectedQuestionnaire.telegram_channel && (
                                            <a href={selectedQuestionnaire.telegram_channel} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D7B706] transition-colors">
                                                Telegram: {selectedQuestionnaire.telegram_channel}
                                            </a>
                                        )}
                                        {selectedQuestionnaire.instagram && (
                                            <a href={selectedQuestionnaire.instagram} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D7B706] transition-colors">
                                                Instagram: {selectedQuestionnaire.instagram}
                                            </a>
                                        )}
                                        {selectedQuestionnaire.pinterest && (
                                            <a href={selectedQuestionnaire.pinterest} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D7B706] transition-colors">
                                                Pinterest: {selectedQuestionnaire.pinterest}
                                            </a>
                                        )}
                                        {selectedQuestionnaire.website && (
                                            <a href={selectedQuestionnaire.website} target="_blank" rel="noopener noreferrer" className="text-white hover:text-[#D7B706] transition-colors">
                                                Сайт: {selectedQuestionnaire.website}
                                            </a>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Descriptions */}
                            {selectedQuestionnaire.unique_trade_proposal && (
                                <div className="mb-8">
                                    <h3 className="text-xl text-[#D7B706] font-medium mb-3 uppercase tracking-wider">
                                        Уникальное торговое предложение
                                    </h3>
                                    <p className="text-white/80 leading-relaxed">{selectedQuestionnaire.unique_trade_proposal}</p>
                                </div>
                            )}

                            {selectedQuestionnaire.activity_description && (
                                <div className="mb-8">
                                    <h3 className="text-xl text-[#D7B706] font-medium mb-3 uppercase tracking-wider">
                                        Описание деятельности
                                    </h3>
                                    <p className="text-white/80 leading-relaxed">{selectedQuestionnaire.activity_description}</p>
                                </div>
                            )}

                            {selectedQuestionnaire.welcome_message && (
                                <div className="mb-8">
                                    <h3 className="text-xl text-[#D7B706] font-medium mb-3 uppercase tracking-wider">
                                        Приветственное сообщение
                                    </h3>
                                    <p className="text-white/80 leading-relaxed">{selectedQuestionnaire.welcome_message}</p>
                                </div>
                            )}

                            {selectedQuestionnaire.cooperation_terms && (
                                <div className="mb-8">
                                    <h3 className="text-xl text-[#D7B706] font-medium mb-3 uppercase tracking-wider">
                                        Условия сотрудничества
                                    </h3>
                                    <p className="text-white/80 leading-relaxed">{selectedQuestionnaire.cooperation_terms}</p>
                                </div>
                            )}

                            {selectedQuestionnaire.additional_info && (
                                <div className="mb-8">
                                    <h3 className="text-xl text-[#D7B706] font-medium mb-3 uppercase tracking-wider">
                                        Дополнительная информация
                                    </h3>
                                    <p className="text-white/80 leading-relaxed">{selectedQuestionnaire.additional_info}</p>
                                </div>
                            )}

                            {/* Photo */}
                            {selectedQuestionnaire.photo && (
                                <div className="mb-8">
                                    <h3 className="text-xl text-[#D7B706] font-medium mb-4 uppercase tracking-wider">
                                        Фотография
                                    </h3>
                                    <img
                                        src={selectedQuestionnaire.photo}
                                        alt="Фото анкеты"
                                        className="rounded-xl border border-white/10 max-w-md w-full"
                                    />
                                </div>
                            )}

                            {
                                selectedQuestionnaire.reviews_list.length > 0 && (
                                    <div className="mb-8">
                                        <h3 className="text-xl text-[#D7B706] font-medium mb-4 uppercase tracking-wider">
                                            Отзывы
                                        </h3>
                                        <div className="space-y-6">
                                            {selectedQuestionnaire.reviews_list.map((review, idx) => (
                                                <div key={idx} className="bg-[#0a1038] p-4 rounded-xl border border-white/10">
                                                    <p className="text-white/80 italic mb-2">"{review.text}"</p>
                                                    {/* <p className="text-white/60 text-sm">- {review.author}</p> */}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                )
                            }

                            {/* Dates */}
                            <div className="pt-6 border-t border-white/10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-1">
                                        <p className="text-sm text-white/40 font-light uppercase tracking-wider">Дата создания</p>
                                        <p className="text-lg text-white">{formatDate(selectedQuestionnaire.created_at)}</p>
                                    </div>
                                    <div className="space-y-1">
                                        <p className="text-sm text-white/40 font-light uppercase tracking-wider">Дата обновления</p>
                                        <p className="text-lg text-white">{formatDate(selectedQuestionnaire.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Modal Footer */}
                        <div className="border-t border-white/10 p-6">
                            <button
                                onClick={closeModal}
                                className="w-full py-4 bg-[#D7B706] hover:bg-[#B89A05] text-black rounded-full font-medium text-lg transition-all duration-300 hover:shadow-lg hover:shadow-[#D7B706]/30"
                            >
                                Закрыть
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}