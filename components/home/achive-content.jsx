'use client'
import { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { FaSearch } from "react-icons/fa";
import { BiSortAlt2 } from "react-icons/bi";
import { BsChevronLeft } from "react-icons/bs";
import { FiRefreshCw } from "react-icons/fi";
import debounce from "lodash/debounce";

const API_BASE_URL = "https://api.reiting-profi.ru/api/v1/accounts";

// URL generator funksiyasi
const getRestoreUrl = (requestName, id) => {
    const baseURL = API_BASE_URL;

    switch (requestName) {
        case 'DesignerQuestionnaire':
            return `${baseURL}/questionnaires/${id}/restore/`;
        case 'RepairQuestionnaire':
            return `${baseURL}/repair-questionnaires/${id}/restore/`;
        case 'SupplierQuestionnaire':
            return `${baseURL}/supplier-questionnaires/${id}/restore/`;
        case 'MediaQuestionnaire':
            return `${baseURL}/media-questionnaires/${id}/restore/`;
        default:
            return null;
    }
};

export default function AchiveContent() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
    });
    const [filters, setFilters] = useState({
        full_name: "",
        id: "",
        organization_name: "",
        phone: "",
        limit: 10,
        offset: 0,
    });
    const [sortReverse, setSortReverse] = useState(false);
    const [restoringId, setRestoringId] = useState(null);

    // Debounce qidiruv funksiyasi
    const debouncedFetch = useCallback(
        debounce((filters) => {
            fetchQuestionnaires(filters);
        }, 500),
        []
    );

    // Ma'lumotlarni yuklash
    useEffect(() => {
        fetchQuestionnaires(filters);
    }, []);

    // Filter o'zgarganida qidiruv
    useEffect(() => {
        debouncedFetch({ ...filters, offset: 0 });
    }, [filters.full_name, filters.id, filters.organization_name, filters.phone, filters.limit]);


    const fetchQuestionnaires = async (currentFilters) => {
        try {
            setLoading(true);
            setError(null);

            // LocalStorage'dan token olish
            const token = localStorage.getItem("accessToken");

            if (!token) {
                throw new Error("Токен не найден. Пожалуйста, войдите в систему.");
            }

            // Filter parametrlarni tozalash
            const params = {};
            if (currentFilters.full_name) params.full_name = currentFilters.full_name;
            if (currentFilters.id) params.id = currentFilters.id;
            if (currentFilters.organization_name) params.organization_name = currentFilters.organization_name;
            if (currentFilters.phone) params.phone = currentFilters.phone;
            params.limit = currentFilters.limit || 10;
            params.offset = currentFilters.offset || 0;

            const response = await axios.get(
                "https://api.reiting-profi.ru/api/v1/accounts/questionnaires/all/archive/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: params
                }
            );

            console.log("API ответ:", response.data);

            if (response.data.results && Array.isArray(response.data.results)) {
                setData(sortReverse ? [...response.data.results].reverse() : response.data.results);
                setPagination({
                    count: response.data.count || 0,
                    next: response.data.next,
                    previous: response.data.previous,
                });
            } else {
                setData([]);
                setPagination({ count: 0, next: null, previous: null });
            }
        } catch (err) {
            console.error("Ошибка при загрузке данных:", err);
            setError(err.response?.data?.message || err.message || "Ошибка при загрузке данных");
            setData([]);
            setPagination({ count: 0, next: null, previous: null });
        } finally {
            setLoading(false);
        }
    };

    // Archivdan chiqarish funksiyasi
    const handleRestoreFromArchive = async (id, requestName, fullName) => {
        try {
            // URL ni olish
            const restoreUrl = getRestoreUrl(requestName, id);

            if (!restoreUrl) {
                throw new Error(`Неизвестный тип анкеты: ${requestName}`);
            }



            setRestoringId(id);

            const token = localStorage.getItem("accessToken");

            if (!token) {
                throw new Error("Токен не найден. Пожалуйста, войдите в систему.");
            }

            // PATCH so'rovini yuborish
            const response = await axios.patch(
                restoreUrl,
                {},
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            );

            console.log("Восстановление успешно:", response.data);

            // Ma'lumotlarni yangilash
            fetchQuestionnaires(filters);

        } catch (err) {
            console.error("Ошибка при восстановлении из архива:", err);

            let errorMessage = "Ошибка при восстановлении из архива";

            if (err.response) {
                // Serverdan kelgan xatolik
                if (err.response.status === 401) {
                    errorMessage = "Ошибка авторизации. Пожалуйста, войдите снова.";
                } else if (err.response.status === 403) {
                    errorMessage = "У вас нет прав для восстановления анкет из архива.";
                } else if (err.response.status === 404) {
                    errorMessage = "Анкета не найдена или уже восстановлена.";
                } else if (err.response.data?.message) {
                    errorMessage = err.response.data.message;
                } else if (err.response.data?.detail) {
                    errorMessage = err.response.data.detail;
                }
            } else if (err.message) {
                errorMessage = err.message;
            }

        } finally {
            setRestoringId(null);
        }
    };

    // Filter o'zgartirish
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }));
    };

    // Search input uchun umumiy handler
    const handleSearchChange = (e) => {
        const value = e.target.value;
        if (/^\d+$/.test(value)) {
            if (value.length <= 6) {
                handleFilterChange("id", value);
                handleFilterChange("phone", "");
                handleFilterChange("full_name", "");
                handleFilterChange("organization_name", "");
            } else {
                handleFilterChange("phone", value);
                handleFilterChange("id", "");
                handleFilterChange("full_name", "");
                handleFilterChange("organization_name", "");
            }
        } else {
            handleFilterChange("full_name", value);
            handleFilterChange("organization_name", value);
            handleFilterChange("id", "");
            handleFilterChange("phone", "");
        }
    };

    // Sort funksiyasi
    const handleSort = () => {
        setSortReverse(!sortReverse);
        setData(prev => [...prev].reverse());
    };

    // Pagination handlerlari
    const handleNextPage = () => {
        if (pagination.next) {
            const newOffset = filters.offset + filters.limit;
            const newFilters = { ...filters, offset: newOffset };
            setFilters(newFilters);
            fetchQuestionnaires(newFilters);
        }
    };

    const handlePrevPage = () => {
        if (pagination.previous) {
            const newOffset = Math.max(0, filters.offset - filters.limit);
            const newFilters = { ...filters, offset: newOffset };
            setFilters(newFilters);
            fetchQuestionnaires(newFilters);
        }
    };

    const handlePageClick = (pageNumber) => {
        const newOffset = (pageNumber - 1) * filters.limit;
        const newFilters = { ...filters, offset: newOffset };
        setFilters(newFilters);
        fetchQuestionnaires(newFilters);
    };

    // Date formatlash
    const formatDate = (dateString) => {
        if (!dateString) return "";
        const date = new Date(dateString);
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Telefon raqamni formatlash
    const formatPhone = (phone) => {
        if (!phone) return "";
        const cleaned = phone.replace(/\D/g, '');
        if (cleaned.length === 11 && cleaned.startsWith('7')) {
            return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`;
        }
        return phone;
    };

    // Request name ni chiroyli formatlash
    const formatRequestName = (requestName) => {
        const map = {
            'DesignerQuestionnaire': 'Дизайнер',
            'RepairQuestionnaire': 'Ремонт',
            'SupplierQuestionnaire': 'Поставщик',
            'MediaQuestionnaire': 'Медиа'
        };
        return map[requestName] || requestName;
    };

    // Pagination sahifalarini hisoblash
    const totalPages = Math.ceil(pagination.count / filters.limit);
    const currentPage = Math.floor(filters.offset / filters.limit) + 1;

    // Pagination sahifa raqamlarini generatsiya qilish
    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 3;

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i);
            }
        } else {
            let start = Math.max(1, currentPage - 1);
            let end = Math.min(totalPages, start + maxVisiblePages - 1);

            if (end - start + 1 < maxVisiblePages) {
                start = end - maxVisiblePages + 1;
            }

            for (let i = start; i <= end; i++) {
                pages.push(i);
            }
        }

        return pages;
    };



    return (
        <div className="text-white">
            <div className="px-4 py-3 flex items-center gap-7 mt-14 ml-20">
                <div className='relative grow flex h-9.25 bg-[#B7B2B299] rounded-2xl px-5 flex items-center'>
                    <input
                        type="text"
                        placeholder="Найти анкету по ID, телефон, название организации, ФИ человека"
                        className="w-full outline-none text-[#FFF] font-normal not-italic text-[16px] leading-[100%] tracking-normal bg-transparent"
                        value={filters.full_name || filters.id || filters.phone || filters.organization_name || ""}
                        onChange={handleSearchChange}
                    />
                    <button className="text-white">
                        <FaSearch size={20} className='text-black font-thin' />
                    </button>
                </div>
                <button
                    className="text-gray-400 hover:text-white"
                    onClick={handleSort}
                >
                    <BiSortAlt2 size={32} className={`text-white ${sortReverse ? 'rotate-180' : ''}`} />
                </button>
            </div>

            <div className="w-full m-auto">
                <div className="ml-20 mt-5 mb-14">
                    <h1 className="font-normal not-italic text-[37px] leading-[100%] tracking-normal text-white">
                        АНКЕТЫ АРХИВ
                    </h1>
                </div>

                {error && (
                    <div className="ml-20 mb-5 p-4 bg-red-900/30 border border-red-700 rounded-xl text-xl text-red-400">
                        Ошибка: {error}
                    </div>
                )}


                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <div className="text-2xl text-yellow-400">Загрузка данных...</div>
                    </div>
                ) : (
                    <>
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="text-left text-white text-sm grid grid-cols-15">
                                        <th className="col-span-1 pb-4 px-4 text-[18px] font-normal leading-[100%] border-b border-white tracking-normal">
                                            ID
                                        </th>
                                        <th className="col-span-3 pb-4 px-4 text-[18px] font-normal leading-[100%] border-b border-white tracking-normal">
                                            ФИО / Название
                                        </th>
                                        <th className="col-span-2 pb-4 px-4 text-[18px] font-normal leading-[100%] border-b border-white tracking-normal">
                                            Тип
                                        </th>
                                        <th className="col-span-1 pb-4 px-4 text-[18px] font-normal leading-[100%] border-b border-white tracking-normal">
                                            Группа
                                        </th>
                                        <th className="col-span-2 pb-4 px-4 text-[18px] font-normal leading-[100%] border-b border-white tracking-normal">
                                            Телефон
                                        </th>
                                        <th className="col-span-2 pb-4 px-4 text-[18px] font-normal leading-[100%] border-b border-white tracking-normal">
                                            Бренд
                                        </th>
                                        <th className="col-span-2 pb-4 px-4 text-[18px] font-normal leading-[100%] border-b border-white tracking-normal">
                                            Дата создания
                                        </th>
                                        <th className="col-span-2 pb-4 px-4 text-[18px] font-normal leading-[100%] border-b border-white tracking-normal">
                                            Действия
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {data.length === 0 ? (
                                        <tr>
                                            <td colSpan="15" className="text-center py-8 text-xl text-gray-400">
                                                Нет данных для отображения
                                            </td>
                                        </tr>
                                    ) : (
                                        data.map((row, index) => (
                                            <tr
                                                key={`${row.id}-${row.request_name}-${index}`}
                                                className="text-white hover:bg-gray-750 grid grid-cols-15 items-center"
                                            >
                                                <td className="col-span-1 h-20 flex items-center px-4 font-normal text-[16px] leading-[100%] tracking-normal border-b border-white/30">
                                                    {index + 1}
                                                </td>
                                                <td className="col-span-3 h-20 flex items-center px-4 font-normal text-[16px] leading-[100%] tracking-normal border-b border-white/30">
                                                    {row.full_name || "Не указано"}
                                                </td>
                                                <td className="col-span-2 h-20 flex items-center px-4 font-normal text-[16px] leading-[100%] tracking-normal not-italic border-b border-white/30">
                                                    {formatRequestName(row.request_name)}
                                                </td>
                                                <td className="col-span-1 h-20 flex items-center px-4 font-normal text-[16px] leading-[100%] tracking-normal not-italic border-b border-white/30">
                                                    {row.group_display || "Не указано"}
                                                </td>
                                                <td className="col-span-2 h-20 flex items-center px-4 font-normal text-[16px] leading-[100%] tracking-normal not-italic border-b border-white/30">
                                                    {formatPhone(row.phone)}
                                                </td>
                                                <td className="col-span-2 h-20 flex items-center px-4 font-normal text-[16px] leading-[100%] tracking-normal not-italic border-b border-white/30">
                                                    {row.brand_name || "Не указано"}
                                                </td>
                                                <td className="col-span-2 h-20 flex items-center px-4 font-normal not-italic text-[16px] leading-[100%] tracking-normal border-b border-white/30">
                                                    {formatDate(row.created_at)}
                                                </td>
                                                <td className="col-span-2 h-20 flex items-center px-4 border-b border-white/30">
                                                    <button
                                                        onClick={() => handleRestoreFromArchive(
                                                            row.id,
                                                            row.request_name,
                                                            row.full_name || "Неизвестный"
                                                        )}
                                                        disabled={restoringId === row.id}
                                                        className={`font-normal not-italic text-sm leading-[100%] tracking-normal w-48 h-11 rounded-[25px] flex items-center justify-center transition-colors gap-2 ${restoringId === row.id
                                                            ? 'bg-[#4a5568] cursor-not-allowed'
                                                            : 'bg-[#2d3748] hover:bg-[#4a5568] hover:shadow-lg'
                                                            }`}
                                                        title={`Восстановить ${formatRequestName(row.request_name)} анкету`}
                                                    >
                                                        {restoringId === row.id ? (
                                                            <>
                                                                <FiRefreshCw className="animate-spin" size={18} />
                                                                Восстановление...
                                                            </>
                                                        ) : (
                                                            <>Pазархив</>
                                                        )}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex justify-end gap-px mt-6 mr-20">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={!pagination.previous}
                                    className={`flex h-10 w-10 rounded-full ${pagination.previous ? 'bg-[#56505080] hover:bg-[#746E6E80]' : 'bg-[#56505040] cursor-not-allowed'} text-[26px] items-center justify-center text-[#D7B706]`}
                                >
                                    <BsChevronLeft />
                                </button>

                                {getPageNumbers().map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageClick(page)}
                                        className={`flex h-10 w-10 rounded-full ${currentPage === page ? 'bg-[#746E6E80]' : 'bg-[#56505080] hover:bg-[#746E6E80]'} text-[26px] items-center justify-center text-[#D7B706]`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={handleNextPage}
                                    disabled={!pagination.next}
                                    className={`flex h-10 w-10 rounded-full rotate-180 ${pagination.next ? 'bg-[#56505080] hover:bg-[#746E6E80]' : 'bg-[#56505040] cursor-not-allowed'} text-[26px] items-center justify-center text-[#D7B706]`}
                                >
                                    <BsChevronLeft />
                                </button>
                            </div>
                        )}

                        {/* Pagination info */}
                        {pagination.count > 0 && (
                            <div className="ml-20 mt-4 text-gray-400 text-sm">
                                Показано {Math.min(filters.offset + 1, pagination.count)}-
                                {Math.min(filters.offset + filters.limit, pagination.count)} из {pagination.count}
                                <span className="ml-4">Текущая страница: {currentPage} из {totalPages}</span>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}