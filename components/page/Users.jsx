'use client'
import React, { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"
import { FaSearch, FaPhone, FaEnvelope } from "react-icons/fa"
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io"
import { RiGroupFill } from "react-icons/ri"
import toast, { Toaster } from "react-hot-toast"
import debounce from "lodash/debounce"

export default function Users() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [expandedRows, setExpandedRows] = useState([])
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
    })

    const [filters, setFilters] = useState({
        search: '',
        group: '', // Guruh filteri qo'shildi
        limit: 10,
        offset: 0,
    })

    // Guruhlar ro'yxati (ruscha nomlar)
    const groups = [
        { value: '', label: 'Все группы' },
        { value: 'Дизайн', label: 'Дизайн' },
        { value: 'Ремонт', label: 'Ремонт' },
        { value: 'Поставщик', label: 'Поставщик' },
        { value: 'Медиа', label: 'Медиа' }
    ]

    // Abort controller uchun ref
    const abortControllerRef = useRef(null)

    // Debounce qidiruv funksiyasi
    const debouncedFetch = useCallback(
        debounce((searchFilters) => {
            fetchUsers(searchFilters)
        }, 500),
        []
    )

    // Barcha dependency'larni bitta useEffectda boshqarish
    useEffect(() => {
        // Avvalgi so'rovni abort qilish
        if (abortControllerRef.current) {
            abortControllerRef.current.abort()
        }

        // Yangi abort controller yaratish
        abortControllerRef.current = new AbortController()
        const signal = abortControllerRef.current.signal

        // Kichik timeout orqali bir necha marta chaqirilishdan himoya qilish
        const timer = setTimeout(() => {
            fetchUsers(filters, signal)
        }, 100)

        // Cleanup funksiyasi
        return () => {
            clearTimeout(timer)
            if (abortControllerRef.current) {
                abortControllerRef.current.abort()
            }
        }
    }, [filters.search, filters.group, filters.limit, filters.offset])

    const fetchUsers = async (currentFilters, signal) => {
        // Agar so'rov abort qilingan bo'lsa
        if (signal && signal.aborted) {
            console.log('Request aborted')
            return
        }

        try {
            setLoading(true)
            setError(null)

            const token = localStorage.getItem("accessToken")
            if (!token) {
                throw new Error("Токен не найден. Пожалуйста, войдите в систему.")
            }

            const params = {
                limit: currentFilters.limit || 10,
                offset: currentFilters.offset || 0,
            }

            // Qidiruv qo'shamiz
            if (currentFilters.search) {
                params.search = currentFilters.search
            }

            // Guruh filterini qo'shamiz
            if (currentFilters.group) {
                params.group = currentFilters.group
            }

            const response = await axios.get(
                "https://api.reiting-profi.ru/api/v1/accounts/users/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: params,
                    signal: signal // abort signal ni berish
                }
            )

            // Agar so'rov abort qilinmagan bo'lsa
            if (!signal || !signal.aborted) {
                console.log("API ответ:", response.data)

                if (Array.isArray(response.data.results)) {
                    setData(response.data.results)
                    setPagination({
                        count: response.data.count || 0,
                        next: response.data.next,
                        previous: response.data.previous,
                    })
                } else {
                    setData([])
                    setPagination({ count: 0, next: null, previous: null })
                }
            }
        } catch (err) {
            // Agar abort qilingan bo'lsa, xatoni ignore qilish
            if (axios.isCancel(err) || err.name === 'AbortError') {
                console.log('Request was cancelled')
                return
            }

            console.error("Ошибка при загрузке пользователей:", err)
            setError(err.response?.data?.message || err.message || "Ошибка при загрузке данных")
            setData([])
            setPagination({ count: 0, next: null, previous: null })
            toast.error(err.response?.data?.message || "Ошибка при загрузке пользователей")
        } finally {
            if (!signal || !signal.aborted) {
                setLoading(false)
            }
        }
    }

    // Row ni kengaytirish/yiqish
    const toggleRow = (id) => {
        setExpandedRows(prev =>
            prev.includes(id)
                ? prev.filter(rowId => rowId !== id)
                : [...prev, id]
        )
    }

    // Filter o'zgartirish
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({
            ...prev,
            [key]: value,
            offset: key === 'search' || key === 'group' ? 0 : prev.offset // Search yoki group o'zgarganda offsetni 0 qilish
        }))
    }

    // Search input handler
    const handleSearchChange = (e) => {
        handleFilterChange('search', e.target.value)
    }

    // Group select handler
    const handleGroupChange = (e) => {
        handleFilterChange('group', e.target.value)
    }

    // Pagination handlerlari - faqat state o'zgartirish
    const handleNextPage = () => {
        if (pagination.next) {
            setFilters(prev => ({
                ...prev,
                offset: prev.offset + prev.limit
            }))
        }
    }

    const handlePrevPage = () => {
        if (pagination.previous) {
            setFilters(prev => ({
                ...prev,
                offset: Math.max(0, prev.offset - prev.limit)
            }))
        }
    }

    const handlePageClick = (pageNumber) => {
        const newOffset = (pageNumber - 1) * filters.limit
        setFilters(prev => ({ ...prev, offset: newOffset }))
    }

    // Format phone number
    const formatPhone = (phone) => {
        if (!phone) return "Не указано"
        // Format: +998 (XX) XXX-XX-XX
        return phone.replace(/(\d{3})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5')
    }

    // Groups ni format qilish
    const formatGroups = (groups) => {
        if (!groups || groups.length === 0) return "Не указано"
        return groups.join(", ")
    }

    // Pagination sahifalarini hisoblash
    const totalPages = Math.ceil(pagination.count / filters.limit)
    const currentPage = Math.floor(filters.offset / filters.limit) + 1

    // Pagination sahifa raqamlarini generatsiya qilish
    const getPageNumbers = () => {
        const pages = []
        const maxVisiblePages = 3

        if (totalPages <= maxVisiblePages) {
            for (let i = 1; i <= totalPages; i++) {
                pages.push(i)
            }
        } else {
            let start = Math.max(1, currentPage - 1)
            let end = Math.min(totalPages, start + maxVisiblePages - 1)

            if (end - start + 1 < maxVisiblePages) {
                start = end - maxVisiblePages + 1
            }

            for (let i = start; i <= end; i++) {
                pages.push(i)
            }
        }

        return pages
    }

    return (
        <div>
            <Toaster
                position="top-right"
                toastOptions={{
                    duration: 3000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                }}
            />

            {/* Sarlavha */}
            <div className="ml-20 mt-14 mb-8 flex justify-between items-center">
                <h1 className="font-normal not-italic text-[37px] leading-[100%] tracking-normal text-white">
                    ПОЛЬЗОВАТЕЛИ
                </h1>

                {/* Filterlar */}
                <div className="flex items-center gap-4 mr-20">
                    {/* Guruh filteri */}
                    <div className="relative">
                        <select
                            value={filters.group}
                            onChange={handleGroupChange}
                            className="bg-[#56505080] text-white px-4 py-2 rounded-lg w-48 focus:outline-none focus:ring-2 focus:ring-yellow-400 appearance-none cursor-pointer hover:bg-[#565050CC] transition-colors"
                            style={{
                                backgroundImage: `url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e")`,
                                backgroundPosition: 'right 0.75rem center',
                                backgroundRepeat: 'no-repeat',
                                backgroundSize: '1.5em 1.5em',
                                paddingRight: '2.5rem'
                            }}
                        >
                            {groups.map(group => (
                                <option key={group.value} value={group.value}>
                                    {group.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Search Input */}
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={handleSearchChange}
                            placeholder="Поиск пользователей..."
                            className="bg-[#56505080] text-white pl-10 pr-4 py-2 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-yellow-400 hover:bg-[#565050CC] transition-colors"
                        />
                    </div>
                </div>
            </div>

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-2xl text-yellow-400">Загрузка пользователей...</div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-2xl text-red-400">{error}</div>
                </div>
            ) : (
                <>
                    <div className="w-full bg-navy text-white font-jeju">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-line text-left text-[18px]">
                                    <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6 w-2/5">
                                        ФИО
                                    </th>
                                    <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6 w-1/5">
                                        Группы
                                    </th>
                                    <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6 w-1/5">
                                        Телефон
                                    </th>
                                    <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6 w-1/5">
                                        Email
                                    </th>
                                    {/* <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6 w-20">
                                        Детали
                                    </th> */}
                                </tr>
                            </thead>

                            <tbody>
                                {data.length === 0 ? (
                                    <tr>
                                        <td colSpan="5" className="py-8 text-center text-xl text-gray-400">
                                            Нет пользователей для отображения
                                        </td>
                                    </tr>
                                ) : (
                                    data.map((user, index) => (
                                        <React.Fragment key={user.id}>
                                            <tr
                                                className="border-b border-line text-[22px] hover:bg-white/5 cursor-pointer"
                                            // onClick={() => toggleRow(user.id)}
                                            >
                                                <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                                                    <div className="flex items-center">
                                                        <div>
                                                            <div className="font-medium">{user.full_name || user.company_name || "Не указано"}</div>
                                                            {/* {user.company_name && (
                                                                <div className="text-sm text-gray-400 mt-1">{user.company_name}</div>
                                                            )} */}
                                                        </div>
                                                    </div>
                                                </td>

                                                <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                                                    <div className="flex items-center">
                                                        {formatGroups(user.groups)}
                                                    </div>
                                                </td>

                                                <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                                                    <div className="flex items-center">
                                                        {formatPhone(user.phone)}
                                                    </div>
                                                </td>

                                                <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                                                    <div className="flex items-center">
                                                        <FaEnvelope className="mr-2 text-gray-400" />
                                                        {user.email || "Не указано"}
                                                    </div>
                                                </td>

                                                {/* <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal text-center">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation()
                                                            toggleRow(user.id)
                                                        }}
                                                        className="text-yellow-400 hover:text-yellow-300 transition-colors"
                                                    >
                                                        {expandedRows.includes(user.id) ? "Скрыть" : "Показать"}
                                                    </button>
                                                </td> */}
                                            </tr>

                                            {/* Expanded details row */}
                                            {expandedRows.includes(user.id) && (
                                                <tr className="border-b border-line bg-white/5">
                                                    <td colSpan="5" className="p-6">
                                                        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                                                            {/* Role information */}
                                                            <div>
                                                                <h4 className="text-yellow-400 mb-2 font-semibold">Роль</h4>
                                                                <p className="text-gray-300">
                                                                    {user.role_display || user.role || "Не указано"}
                                                                </p>
                                                            </div>

                                                            {/* City */}
                                                            <div>
                                                                <h4 className="text-yellow-400 mb-2 font-semibold">Город</h4>
                                                                <p className="text-gray-300">
                                                                    {user.city || "Не указано"}
                                                                </p>
                                                            </div>

                                                            {/* Description */}
                                                            <div className="col-span-2 md:col-span-3">
                                                                <h4 className="text-yellow-400 mb-2 font-semibold">Описание</h4>
                                                                <p className="text-gray-300">
                                                                    {user.description || "Не указано"}
                                                                </p>
                                                            </div>

                                                            {/* Social links */}
                                                            {(user.website || user.telegram || user.instagram || user.vk) && (
                                                                <div className="col-span-2 md:col-span-3">
                                                                    <h4 className="text-yellow-400 mb-2 font-semibold">Социальные сети</h4>
                                                                    <div className="flex flex-wrap gap-4">
                                                                        {user.website && (
                                                                            <a
                                                                                href={user.website}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                                                            >
                                                                                Вебсайт
                                                                            </a>
                                                                        )}
                                                                        {user.telegram && (
                                                                            <a
                                                                                href={user.telegram}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-400 hover:text-blue-300 transition-colors"
                                                                            >
                                                                                Telegram
                                                                            </a>
                                                                        )}
                                                                        {user.instagram && (
                                                                            <a
                                                                                href={user.instagram}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-pink-400 hover:text-pink-300 transition-colors"
                                                                            >
                                                                                Instagram
                                                                            </a>
                                                                        )}
                                                                        {user.vk && (
                                                                            <a
                                                                                href={user.vk}
                                                                                target="_blank"
                                                                                rel="noopener noreferrer"
                                                                                className="text-blue-600 hover:text-blue-500 transition-colors"
                                                                            >
                                                                                VK
                                                                            </a>
                                                                        )}
                                                                    </div>
                                                                </div>
                                                            )}

                                                            {/* Team and share URL */}
                                                            <div className="col-span-2 md:col-span-3 flex justify-between items-center pt-4 border-t border-gray-700">
                                                                <div>
                                                                    <h4 className="text-yellow-400 mb-2 font-semibold">Команда</h4>
                                                                    <p className="text-gray-300">
                                                                        {user.team_name || "Не указано"}
                                                                    </p>
                                                                </div>

                                                                {user.share_url && (
                                                                    <a
                                                                        href={user.share_url}
                                                                        target="_blank"
                                                                        rel="noopener noreferrer"
                                                                        className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                                                                    >
                                                                        Поделиться профилем
                                                                    </a>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </td>
                                                </tr>
                                            )}
                                        </React.Fragment>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination Controls */}
                    <div className="flex justify-between items-center mt-6 mb-10 mx-20">
                        {/* Pagination info */}
                        {pagination.count > 0 && (
                            <div className="text-gray-400">
                                Показано {Math.min(filters.offset + 1, pagination.count)}-
                                {Math.min(filters.offset + filters.limit, pagination.count)} из {pagination.count}
                            </div>
                        )}

                        {/* Pagination buttons */}
                        {totalPages > 1 && (
                            <div className="flex gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={!pagination.previous}
                                    className={`px-4 py-2 rounded-lg  ${pagination.previous ? 'bg-[#56505080] hover:bg-[#746E6E80]' : 'bg-[#56505040] cursor-not-allowed'} text-yellow-400 transition-colors`}
                                >
                                    Назад
                                </button>

                                {getPageNumbers().map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageClick(page)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-yellow-600 text-white' : 'bg-[#56505080] hover:bg-[#746E6E80] text-yellow-400'} transition-colors`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={handleNextPage}
                                    disabled={!pagination.next}
                                    className={`px-4 py-2 rounded-lg ${pagination.next ? 'bg-[#56505080] hover:bg-[#746E6E80]' : 'bg-[#56505040] cursor-not-allowed'} text-yellow-400 transition-colors`}
                                >
                                    Вперед
                                </button>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    )
}