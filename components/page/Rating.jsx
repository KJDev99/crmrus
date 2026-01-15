'use client'
import { useState, useEffect, useCallback, useRef } from "react"
import axios from "axios"
import { BiSortAlt2 } from "react-icons/bi"
import { FaSearch } from "react-icons/fa"
import { BsChevronLeft } from "react-icons/bs"
import toast, { Toaster } from "react-hot-toast"
import debounce from "lodash/debounce"

export default function Rating() {
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
    limit: 10,
    offset: 0,
  })
  const [sortBy, setSortBy] = useState('total_rating_count')
  const [sortOrder, setSortOrder] = useState('desc')

  // Abort controller uchun ref
  const abortControllerRef = useRef(null)

  // Debounce qidiruv funksiyasi
  const debouncedFetch = useCallback(
    debounce((searchFilters) => {
      fetchRatings(searchFilters)
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
      fetchRatings(filters, signal)
    }, 100)

    // Cleanup funksiyasi
    return () => {
      clearTimeout(timer)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [filters.search, filters.limit, filters.offset, sortBy, sortOrder])

  const fetchRatings = async (currentFilters, signal) => {
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
        ordering: sortOrder === 'desc' ? `-${sortBy}` : sortBy
      }

      if (currentFilters.search) {
        params.search = currentFilters.search
      }

      const response = await axios.get(
        "https://api.reiting-profi.ru/api/v1/events/ratings/",
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

      console.error("Ошибка при загрузке рейтингов:", err)
      setError(err.response?.data?.message || err.message || "Ошибка при загрузке данных")
      setData([])
      setPagination({ count: 0, next: null, previous: null })
    } finally {
      if (!signal || !signal.aborted) {
        setLoading(false)
      }
    }
  }

  // Filter o'zgartirish
  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      offset: key === 'search' ? 0 : prev.offset // Search o'zgarganda offsetni 0 qilish
    }))
  }

  // Search input handler
  const handleSearchChange = (e) => {
    handleFilterChange('search', e.target.value)
  }

  // Sort funksiyasi
  const handleSort = (column) => {
    if (sortBy === column) {
      // Agar bir xil column bosilsa, orderni o'zgartirish
      setSortOrder(sortOrder === 'desc' ? 'asc' : 'desc')
    } else {
      // Yangi column bosilsa, yangi column va default desc order
      setSortBy(column)
      setSortOrder('desc')
    }
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

  // Sort icon olish - faqat aktiv sort bo'lgan column uchun sariq rang
  const getSortIcon = (column) => {
    if (sortBy === column) {
      return (
        <BiSortAlt2
          size={24}
          className={sortOrder === 'desc' ? 'text-yellow-500 rotate-180' : 'text-yellow-500'}
        />
      )
    }
    return <BiSortAlt2 size={24} className="text-white" />
  }

  // Sort iconni faqat raqamli ustunlar uchun ko'rsatish
  const shouldShowSortIcon = (column) => {
    const sortableColumns = ['total_rating_count', 'positive_rating_count', 'constructive_rating_count']
    return sortableColumns.includes(column)
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

      <div className="px-4 py-3 flex items-center gap-7 mt-14 ml-20">
        <div className='relative grow flex h-9.25 bg-[#B7B2B299] rounded-2xl px-5 flex items-center'>
          <input
            type="text"
            placeholder="Найти по названию организации или ФИ"
            className="w-full outline-none text-[#FFF] font-normal not-italic text-[16px] leading-[100%] tracking-normal bg-transparent"
            value={filters.search}
            onChange={handleSearchChange}
          />
          <button className="text-white">
            <FaSearch size={20} className='text-black font-thin' />
          </button>
        </div>
      </div>

      <div className="ml-20 mt-5 mb-14">
        <h1 className="font-normal not-italic text-[37px] leading-[100%] tracking-normal text-white">
          РЕЙТИНГ
        </h1>
      </div>

      {error && (
        <div className="ml-20 mb-5 p-4 bg-red-900/30 border border-red-700 rounded-xl text-xl text-red-400">
          Ошибка: {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl text-yellow-400">Загрузка рейтингов...</div>
        </div>
      ) : (
        <>
          <div className="w-full bg-navy text-white font-jeju">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-line text-left text-[18px]">
                  <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                    Название организации / ФИ
                  </th>
                  <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                    Группа
                  </th>
                  <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                    <button
                      onClick={() => handleSort('total_rating_count')}
                      className="flex items-center gap-2 hover:text-yellow-400 transition-colors justify-start w-full"
                    >
                      {/* Icon oldida */}
                      {shouldShowSortIcon('total_rating_count') && (
                        <span className="flex-shrink-0">
                          {getSortIcon('total_rating_count')}
                        </span>
                      )}
                      <span>Общий Рейтинг</span>
                    </button>
                  </th>
                  <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                    <button
                      onClick={() => handleSort('positive_rating_count')}
                      className="flex items-center gap-2 hover:text-yellow-400 transition-colors justify-start w-full"
                    >
                      {/* Icon oldida */}
                      {shouldShowSortIcon('positive_rating_count') && (
                        <span className="flex-shrink-0">
                          {getSortIcon('positive_rating_count')}
                        </span>
                      )}
                      <span>Положительный Рейтинг</span>
                    </button>
                  </th>
                  <th className="py-4 font-normal text-[20px] leading-[1] tracking-normal px-6">
                    <button
                      onClick={() => handleSort('constructive_rating_count')}
                      className="flex items-center gap-2 hover:text-yellow-400 transition-colors justify-start w-full"
                    >
                      {/* Icon oldida */}
                      {shouldShowSortIcon('constructive_rating_count') && (
                        <span className="flex-shrink-0">
                          {getSortIcon('constructive_rating_count')}
                        </span>
                      )}
                      <span>Конструктивный Рейтинг</span>
                    </button>
                  </th>
                </tr>
              </thead>

              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="py-8 text-center text-xl text-gray-400">
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
                        {item.group || "Не указано"}
                      </td>

                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2 justify-center">
                          <svg
                            width="37"
                            height="35"
                            viewBox="0 0 37 35"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18.0703 0L22.3361 13.1287H36.1404L24.9725 21.2426L29.2382 34.3713L18.0703 26.2574L6.90239 34.3713L11.1682 21.2426L0.000238419 13.1287H13.8045L18.0703 0Z"
                              fill="#D7B706"
                            />
                          </svg>
                          <span className="font-bold">{item.total_rating_count || 0}</span>
                        </div>
                      </td>

                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2 justify-center">
                          <svg
                            width="37"
                            height="35"
                            viewBox="0 0 37 35"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M18.0703 0L22.3361 13.1287H36.1404L24.9725 21.2426L29.2382 34.3713L18.0703 26.2574L6.90239 34.3713L11.1682 21.2426L0.000238419 13.1287H13.8045L18.0703 0Z"
                              fill="#D7B706"
                            />
                          </svg>
                          <span className="font-bold">{item.positive_rating_count || 0}</span>
                        </div>
                      </td>

                      <td className="py-6 px-6">
                        <div className="flex items-center gap-2 justify-center">
                          <svg
                            width="35"
                            height="33"
                            viewBox="0 0 35 33"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M34.5209 12.1599L24.0009 20.0399L28.3609 32.7999L17.2809 24.9599L6.16086 32.7999L10.5209 20.0399L0.00085941 12.1599H13.1609L17.2809 -0.00013876L21.3609 12.1599H34.5209ZM29.6409 13.9599H20.2009L17.2809 5.63986L14.3209 13.9599H4.88086L12.4809 19.3999L9.40086 27.9199L17.2809 22.5599L25.1209 27.9199L22.0409 19.3999L29.6409 13.9599Z"
                              fill="white"
                            />
                          </svg>
                          <span className="font-bold">{item.constructive_rating_count || 0}</span>
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