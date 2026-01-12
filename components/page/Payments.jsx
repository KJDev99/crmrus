'use client'
import { useState, useEffect, useCallback } from "react"
import axios from "axios"
import { BiSortAlt2 } from "react-icons/bi"
import { FaSearch, FaCalendarAlt } from "react-icons/fa"
import { BsChevronLeft } from "react-icons/bs"
import toast, { Toaster } from "react-hot-toast"
import debounce from "lodash/debounce"
import { IoIosArrowUp } from "react-icons/io"

export default function Payments() {
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
    start_date: '',
    end_date: '',
    limit: 10,
    offset: 0,
  })

  const [sortBy, setSortBy] = useState('start_date')
  const [sortOrder, setSortOrder] = useState('desc')
  const [dateFilterOpen, setDateFilterOpen] = useState(false)

  // Debounce qidiruv funksiyasi
  const debouncedFetch = useCallback(
    debounce((filters) => {
      fetchReports(filters)
    }, 500),
    []
  )

  // Ma'lumotlarni yuklash
  useEffect(() => {
    fetchReports(filters)
  }, [])

  // Filter o'zgarganida qidiruv
  useEffect(() => {
    debouncedFetch({ ...filters, offset: 0 })
  }, [filters.search, filters.start_date, filters.end_date, filters.limit])

  // Sort o'zgarganida
  useEffect(() => {
    fetchReports(filters)
  }, [sortBy, sortOrder])

  const fetchReports = async (currentFilters) => {
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
        ordering: sortOrder === 'desc' ? `-${sortBy}` : sortBy
      }

      // Qo'shimcha filtrlarni qo'shamiz
      if (currentFilters.search) {
        params.search = currentFilters.search
      }

      if (currentFilters.start_date) {
        params.start_date = currentFilters.start_date
      }

      if (currentFilters.end_date) {
        params.end_date = currentFilters.end_date
      }

      const response = await axios.get(
        "https://api.reiting-profi.ru/api/v1/events/reports/all/",
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
      console.error("Ошибка при загрузке отчетов:", err)
      setError(err.response?.data?.message || err.message || "Ошибка при загрузке данных")
      setData([])
      setPagination({ count: 0, next: null, previous: null })
      toast.error(err.response?.data?.message || "Ошибка при загрузке отчетов")
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

  // Date filter handlers
  const handleStartDateChange = (e) => {
    handleFilterChange('start_date', e.target.value)
  }

  const handleEndDateChange = (e) => {
    handleFilterChange('end_date', e.target.value)
  }

  // Clear date filters
  const clearDateFilters = () => {
    setFilters(prev => ({
      ...prev,
      start_date: '',
      end_date: ''
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
      fetchReports(newFilters)
    }
  }

  const handlePrevPage = () => {
    if (pagination.previous) {
      const newOffset = Math.max(0, filters.offset - filters.limit)
      const newFilters = { ...filters, offset: newOffset }
      setFilters(newFilters)
      fetchReports(newFilters)
    }
  }

  const handlePageClick = (pageNumber) => {
    const newOffset = (pageNumber - 1) * filters.limit
    const newFilters = { ...filters, offset: newOffset }
    setFilters(newFilters)
    fetchReports(newFilters)
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
      year: 'numeric'
    })
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
          ОПЛАТЫ
        </h1>
      </div>

      {/* Search va filtrlari */}
      <div className="px-4 py-3 flex items-center gap-7 ml-20">
        <div className='relative grow flex h-9.25 bg-[#B7B2B299] rounded-2xl px-5 flex items-center'>
          <input
            type="text"
            placeholder="Поиск по телефону или имени пользователя"
            className="w-full outline-none text-[#FFF] font-normal not-italic text-[16px] leading-[100%] tracking-normal bg-transparent"
            value={filters.search}
            onChange={handleSearchChange}
          />
          <FaSearch size={20} className='text-black font-thin' />
        </div>

        {/* Date filter tugmasi */}
        <div className="relative">
          <button
            onClick={() => setDateFilterOpen(!dateFilterOpen)}
            className="flex items-center gap-2 px-4 py-2 bg-[#B7B2B299] rounded-2xl text-white hover:bg-[#A09A9A99] transition-colors"
          >
            <FaCalendarAlt />
            <span>Период</span>
            {(filters.start_date || filters.end_date) && (
              <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
            )}
          </button>

          {/* Date filter dropdown */}
          {dateFilterOpen && (
            <div className="absolute top-full right-0 mt-2 p-4 bg-[#2D2D2D] rounded-xl shadow-lg z-10 min-w-[300px]">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Дата начала
                  </label>
                  <input
                    type="date"
                    value={filters.start_date}
                    onChange={handleStartDateChange}
                    className="w-full px-3 py-2 bg-[#B7B2B299] rounded-lg text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm text-gray-300 mb-1">
                    Дата окончания
                  </label>
                  <input
                    type="date"
                    value={filters.end_date}
                    onChange={handleEndDateChange}
                    className="w-full px-3 py-2 bg-[#B7B2B299] rounded-lg text-white"
                  />
                </div>

                <div className="flex justify-between pt-2">
                  <button
                    onClick={clearDateFilters}
                    className="px-3 py-1 text-sm text-gray-400 hover:text-white transition-colors"
                  >
                    Очистить
                  </button>
                  <button
                    onClick={() => setDateFilterOpen(false)}
                    className="px-4 py-1 bg-yellow-500 text-black rounded-lg hover:bg-yellow-600 transition-colors"
                  >
                    Применить
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Sort tugmasi */}
        <button
          className="text-gray-400 hover:text-white"
          onClick={() => handleSort('start_date')}
          title="Сортировать по дате начала"
        >
          <BiSortAlt2 size={32} className={`text-white ${sortBy === 'start_date' && sortOrder === 'desc' ? 'rotate-180' : ''}`} />
        </button>
      </div>

      {/* Date filter ko'rsatish */}
      {(filters.start_date || filters.end_date) && (
        <div className="ml-20 mt-4 flex items-center gap-4 text-sm text-gray-300">
          <span>Фильтр по периоду:</span>
          {filters.start_date && (
            <span className="px-3 py-1 bg-[#B7B2B299] rounded-lg">
              Начало: {formatDate(filters.start_date)}
            </span>
          )}
          {filters.end_date && (
            <span className="px-3 py-1 bg-[#B7B2B299] rounded-lg">
              Окончание: {formatDate(filters.end_date)}
            </span>
          )}
          <button
            onClick={clearDateFilters}
            className="text-yellow-400 hover:text-yellow-300"
          >
            × Очистить
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
          <div className="text-2xl text-yellow-400">Загрузка отчетов...</div>
        </div>
      ) : (
        <>
          <div className="w-full bg-navy text-white font-jeju">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-line text-left text-[18px]">
                  <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                    <button
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                    >
                      Организация / ФИ
                      {getSortIcon('name')}
                    </button>
                  </th>
                  <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                    <button
                      onClick={() => handleSort('group')}
                      className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                    >
                      Группа
                      {getSortIcon('group')}
                    </button>
                  </th>
                  <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                    <button
                      onClick={() => handleSort('start_date')}
                      className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                    >
                      Дата начала периода
                      {getSortIcon('start_date')}
                    </button>
                  </th>
                  <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                    <button
                      onClick={() => handleSort('next_payment_date')}
                      className="flex items-center gap-1 hover:text-yellow-400 transition-colors"
                    >
                      Дата окончания / Следующая оплата
                      {getSortIcon('next_payment_date')}
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="py-8 text-center text-xl text-gray-400">
                      Нет данных для отображения
                    </td>
                  </tr>
                ) : (
                  data.map((item, i) => (
                    <tr key={`${item.id}-${i}`} className="border-b border-line text-[22px] hover:bg-white/5">
                      <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                        {item.name || "Не указано"}
                      </td>

                      <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                        <span className={`px-3 py-1 rounded-full text-sm ${item.group === 'Дизайнер' ? 'bg-blue-900/30 text-blue-300' :
                          item.group === 'Ремонт' ? 'bg-green-900/30 text-green-300' :
                            item.group === 'Поставщик' ? 'bg-purple-900/30 text-purple-300' :
                              item.group === 'Медиа' ? 'bg-yellow-900/30 text-yellow-300' :
                                'bg-gray-900/30 text-gray-300'
                          }`}>
                          {item.group || "Не указано"}
                        </span>
                      </td>

                      <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                        <div className="flex items-center gap-2">
                          <span>{formatDate(item.start_date)}</span>
                        </div>
                      </td>

                      <td className="py-6 px-6 font-normal text-[20px] leading-[1] tracking-normal">
                        <div className="flex items-center gap-2">
                          <span className={new Date(item.next_payment_date) < new Date() ? 'text-red-400' : 'text-green-400'}>
                            {formatDate(item.next_payment_date)}
                          </span>
                          {new Date(item.next_payment_date) < new Date() && (
                            <span className="text-xs text-red-400">(Просрочено)</span>
                          )}
                        </div>
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