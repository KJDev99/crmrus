'use client'
import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { BiSortAlt2 } from "react-icons/bi"
import { FaSearch } from "react-icons/fa"
import { BsChevronLeft } from "react-icons/bs"
import toast, { Toaster } from "react-hot-toast"
import debounce from "lodash/debounce"
import { IoIosArrowUp } from "react-icons/io"

export default function Users() {
    const [data, setData] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
    })

    const [filters, setFilters] = useState({
        search: '',
        role: '',
        city: '',
        is_active_profile: 'true',
        limit: 10,
        offset: 0,
    })

    const [sortBy, setSortBy] = useState('created_at')
    const [sortOrder, setSortOrder] = useState('desc')
    const [roleFilterOpen, setRoleFilterOpen] = useState(false)

    // Debounce qidiruv funksiyasi
    const debouncedFetch = useCallback(
        debounce((filters) => {
            fetchUsers(filters)
        }, 500),
        []
    )

    // Ma'lumotlarni yuklash
    useEffect(() => {
        fetchUsers(filters)
    }, [])

    // Filter o'zgarganida qidiruv
    useEffect(() => {
        debouncedFetch({ ...filters, offset: 0 })
    }, [filters.search, filters.role, filters.city, filters.is_active_profile, filters.limit])

    // Sort o'zgarganida
    useEffect(() => {
        fetchUsers(filters)
    }, [sortBy, sortOrder])

    const fetchUsers = async (currentFilters) => {
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
                ordering: sortOrder === 'desc' ? `-${sortBy}` : sortBy,
                is_active_profile: currentFilters.is_active_profile || 'true'
            }

            // Qo'shimcha filtrlarni qo'shamiz
            if (currentFilters.search) {
                params.search = currentFilters.search
            }

            if (currentFilters.role) {
                params.role = currentFilters.role
            }

            if (currentFilters.city) {
                params.city = currentFilters.city
            }

            const response = await axios.get(
                "https://api.reiting-profi.ru/api/v1/accounts/users/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: params
                }
            )

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
        } catch (err) {
            console.error("Ошибка при загрузке пользователей:", err)
            setError(err.response?.data?.message || err.message || "Ошибка при загрузке данных")
            setData([])
            setPagination({ count: 0, next: null, previous: null })
            toast.error(err.response?.data?.message || "Ошибка при загрузке пользователей")
        } finally {
            setLoading(false)
        }
    }

    // Filter o'zgartirish
    const handleFilterChange = (key, value) => {
        setFilters(prev => ({ ...prev, [key]: value }))
    }

    // Search input handler
    const handleSearchChange = (e) => {
        handleFilterChange('search', e.target.value)
    }

    // Role filter handler
    const handleRoleChange = (role) => {
        handleFilterChange('role', role)
        setRoleFilterOpen(false)
    }

    // City filter handler
    const handleCityChange = (e) => {
        handleFilterChange('city', e.target.value)
    }

    // Active profile filter handler
    const handleActiveProfileChange = (e) => {
        handleFilterChange('is_active_profile', e.target.value)
    }

    // Clear role filter
    const clearRoleFilter = () => {
        setFilters(prev => ({
            ...prev,
            role: ''
        }))
    }

    // Sort funksiyasi
    const handleSort = (column) => {
        if (sortBy === column) {
            setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
        } else {
            setSortBy(column)
            setSortOrder('desc')
        }
    }

    // Pagination handlerlari
    const handleNextPage = () => {
        if (pagination.next) {
            const newOffset = filters.offset + filters.limit
            const newFilters = { ...filters, offset: newOffset }
            setFilters(newFilters)
            fetchUsers(newFilters)
        }
    }

    const handlePrevPage = () => {
        if (pagination.previous) {
            const newOffset = Math.max(0, filters.offset - filters.limit)
            const newFilters = { ...filters, offset: newOffset }
            setFilters(newFilters)
            fetchUsers(newFilters)
        }
    }

    const handlePageClick = (pageNumber) => {
        const newOffset = (pageNumber - 1) * filters.limit
        const newFilters = { ...filters, offset: newOffset }
        setFilters(newFilters)
        fetchUsers(newFilters)
    }

    // Sort icon olish
    const getSortIcon = (column) => {
        if (sortBy !== column) return null
        return sortOrder === 'desc' ? <IoIosArrowUp className="rotate-180" /> : <IoIosArrowUp />
    }

    // Format date function
    const formatDate = (dateString) => {
        if (!dateString) return "Не указано"
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    // Role label olish
    const getRoleLabel = (role) => {
        switch (role) {
            case 'designer': return 'Дизайнер'
            case 'repair': return 'Ремонт'
            case 'supplier': return 'Поставщик'
            case 'media': return 'Медиа'
            default: return role || "Не указано"
        }
    }

    // Role color olish
    const getRoleColor = (role) => {
        switch (role) {
            case 'designer': return 'bg-blue-900/30 text-blue-300'
            case 'repair': return 'bg-green-900/30 text-green-300'
            case 'supplier': return 'bg-purple-900/30 text-purple-300'
            case 'media': return 'bg-yellow-900/30 text-yellow-300'
            default: return 'bg-gray-900/30 text-gray-300'
        }
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
            <div className="ml-20 mt-14 mb-8">
                <h1 className="font-normal not-italic text-[37px] leading-[100%] tracking-normal text-white">
                    ПОЛЬЗОВАТЕЛИ
                </h1>
            </div>

            {/* Search va filtrlari */}
            {/* <div className="px-4 py-3 flex items-center gap-7 ml-20">
                <div className='relative grow flex h-9.25 bg-[#B7B2B299] rounded-2xl px-5 flex items-center'>
                    <input
                        type="text"
                        placeholder="Поиск по имени, описанию, названию компании"
                        className="w-full outline-none text-[#FFF] font-normal not-italic text-[16px] leading-[100%] tracking-normal bg-transparent"
                        value={filters.search}
                        onChange={handleSearchChange}
                    />
                    <FaSearch size={20} className='text-black font-thin' />
                </div>

                <div className="relative">
                    <button
                        onClick={() => setRoleFilterOpen(!roleFilterOpen)}
                        className="flex items-center gap-2 px-4 py-2 bg-[#B7B2B299] rounded-2xl text-white hover:bg-[#A09A9A99] transition-colors"
                    >
                        <span>Роль</span>
                        {filters.role && (
                            <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                        )}
                    </button>

                    {roleFilterOpen && (
                        <div className="absolute top-full right-0 mt-2 p-4 bg-[#2D2D2D] rounded-xl shadow-lg z-10 min-w-[200px]">
                            <div className="space-y-2">
                                <button
                                    onClick={() => handleRoleChange('designer')}
                                    className="block w-full text-left px-3 py-2 hover:bg-[#B7B2B299] rounded-lg transition-colors"
                                >
                                    Дизайнер
                                </button>
                                <button
                                    onClick={() => handleRoleChange('repair')}
                                    className="block w-full text-left px-3 py-2 hover:bg-[#B7B2B299] rounded-lg transition-colors"
                                >
                                    Ремонт
                                </button>
                                <button
                                    onClick={() => handleRoleChange('supplier')}
                                    className="block w-full text-left px-3 py-2 hover:bg-[#B7B2B299] rounded-lg transition-colors"
                                >
                                    Поставщик
                                </button>
                                <button
                                    onClick={() => handleRoleChange('media')}
                                    className="block w-full text-left px-3 py-2 hover:bg-[#B7B2B299] rounded-lg transition-colors"
                                >
                                    Медиа
                                </button>
                                <div className="pt-2 border-t border-gray-600">
                                    <button
                                        onClick={clearRoleFilter}
                                        className="block w-full text-left px-3 py-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                                    >
                                        Все роли
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                <input
                    type="text"
                    placeholder="Город"
                    className="px-4 py-2 bg-[#B7B2B299] rounded-2xl text-white placeholder-gray-300 outline-none"
                    value={filters.city}
                    onChange={handleCityChange}
                />

                <select
                    value={filters.is_active_profile}
                    onChange={handleActiveProfileChange}
                    className="px-4 py-2 bg-[#B7B2B299] rounded-2xl text-white outline-none"
                >
                    <option value="true">Активные</option>
                    <option value="false">Неактивные</option>
                    <option value="">Все</option>
                </select>

                <button
                    className="text-gray-400 hover:text-white"
                    onClick={() => handleSort('created_at')}
                    title="Сортировать по дате создания"
                >
                    <BiSortAlt2 size={32} className={`text-white ${sortBy === 'created_at' && sortOrder === 'desc' ? 'rotate-180' : ''}`} />
                </button>
            </div> */}

            {/* Filter ko'rsatish */}
            {(filters.role || filters.city || filters.is_active_profile !== 'true') && (
                <div className="ml-20 mt-4 flex items-center gap-4 text-sm text-gray-300">
                    <span>Фильтры:</span>
                    {filters.role && (
                        <span className="px-3 py-1 bg-[#B7B2B299] rounded-lg">
                            Роль: {getRoleLabel(filters.role)}
                        </span>
                    )}
                    {filters.city && (
                        <span className="px-3 py-1 bg-[#B7B2B299] rounded-lg">
                            Город: {filters.city}
                        </span>
                    )}
                    {filters.is_active_profile === 'false' && (
                        <span className="px-3 py-1 bg-[#B7B2B299] rounded-lg">
                            Неактивные
                        </span>
                    )}
                    {filters.is_active_profile === '' && (
                        <span className="px-3 py-1 bg-[#B7B2B299] rounded-lg">
                            Все профили
                        </span>
                    )}
                    <button
                        onClick={() => {
                            setFilters(prev => ({
                                ...prev,
                                role: '',
                                city: '',
                                is_active_profile: 'true'
                            }))
                        }}
                        className="text-yellow-400 hover:text-yellow-300"
                    >
                        × Очистить все
                    </button>
                </div>
            )}

            {error && (
                <div className="ml-20 mb-5 p-4 bg-red-900/30 border border-red-700 rounded-xl text-xl text-red-400">
                    Ошибка: {error}
                </div>
            )}

            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-2xl text-yellow-400">Загрузка пользователей...</div>
                </div>
            ) : (
                <>
                    <div className="w-full bg-navy text-white font-jeju">
                        <table className="w-full border-collapse">
                            <thead>
                                <tr className="border-b border-line text-left text-[18px]">
                                    <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                                        <button
                                            onClick={() => handleSort('full_name')}
                                            className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                                        >
                                            ФИО / Название компании
                                            {getSortIcon('full_name')}
                                        </button>
                                    </th>
                                    <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                                        <button
                                            onClick={() => handleSort('role')}
                                            className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                                        >
                                            Роль
                                            {getSortIcon('role')}
                                        </button>
                                    </th>
                                    <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                                        <button
                                            onClick={() => handleSort('email')}
                                            className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                                        >
                                            Email
                                            {getSortIcon('email')}
                                        </button>
                                    </th>
                                    <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                                        <button
                                            onClick={() => handleSort('created_at')}
                                            className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                                        >
                                            Дата создания
                                            {getSortIcon('created_at')}
                                        </button>
                                    </th>
                                    <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                                        <button
                                            onClick={() => handleSort('is_active_profile')}
                                            className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                                        >
                                            Статус
                                            {getSortIcon('is_active_profile')}
                                        </button>
                                    </th>
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
                                    data.map((user, i) => (
                                        <tr key={`${user.id}-${i}`} className="border-b border-line text-[22px] hover:bg-white/5">
                                            <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                                                <div>
                                                    <div className="font-medium">{user.full_name || "Не указано"}</div>
                                                    {user.company_name && (
                                                        <div className="text-sm text-gray-400 mt-1">{user.company_name}</div>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                                                <span className={`px-3 py-1 rounded-full text-sm ${getRoleColor(user.role)}`}>
                                                    {getRoleLabel(user.role)}
                                                </span>
                                            </td>

                                            <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                                                {user.email || "Не указано"}
                                            </td>

                                            <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                                                {formatDate(user.created_at)}
                                            </td>

                                            <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                                                <span className={`px-3 py-1 rounded-full text-sm ${user.is_active_profile ? 'bg-green-900/30 text-green-300' : 'bg-red-900/30 text-red-300'}`}>
                                                    {user.is_active_profile ? 'Активен' : 'Неактивен'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-end gap-px mt-6 mr-20 mb-10">
                            {/* Oldingi sahifaga */}
                            <button
                                onClick={handlePrevPage}
                                disabled={!pagination.previous}
                                className={`flex h-10 w-10 rounded-full ${pagination.previous ? 'bg-[#56505080] hover:bg-[#746E6E80]' : 'bg-[#56505040] cursor-not-allowed'} text-[26px] items-center justify-center text-[#D7B706]`}
                            >
                                <BsChevronLeft />
                            </button>

                            {/* Sahifa raqamlari */}
                            {getPageNumbers().map(page => (
                                <button
                                    key={page}
                                    onClick={() => handlePageClick(page)}
                                    className={`flex h-10 w-10 rounded-full ${currentPage === page ? 'bg-[#746E6E80]' : 'bg-[#56505080] hover:bg-[#746E6E80]'} text-[26px] items-center justify-center text-[#D7B706]`}
                                >
                                    {page}
                                </button>
                            ))}

                            {/* Keyingi sahifaga */}
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
                        <div className="ml-20 mt-4 text-gray-400 mb-10">
                            Показано {Math.min(filters.offset + 1, pagination.count)}-
                            {Math.min(filters.offset + filters.limit, pagination.count)} из {pagination.count}
                        </div>
                    )}
                </>
            )}
        </div>
    )
}