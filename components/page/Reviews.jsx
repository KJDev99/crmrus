'use client'
import React, { useState, useEffect, useCallback, useRef } from 'react'
import axios from 'axios'
import { FaSearch, FaStar, FaStarHalf } from 'react-icons/fa'
import { BiSortAlt2 } from 'react-icons/bi'
import { BsChevronLeft } from 'react-icons/bs'
import toast, { Toaster } from 'react-hot-toast'
import debounce from 'lodash/debounce'
import { Star } from 'lucide-react'

// ReviewItem komponenti
function ReviewItem({ review, onApprove, onReject, onStatusUpdate }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedText, setEditedText] = useState(review.text)
  const [status, setStatus] = useState(review.status)

  // Telefon formatlash
  const formatPhone = (phone) => {
    if (!phone) return ''
    const cleaned = phone.replace(/\D/g, '')
    if (cleaned.length === 11 && cleaned.startsWith('7')) {
      return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
    }
    return phone
  }

  // Sana formatlash
  const formatDate = (dateString) => {
    if (!dateString) return ''
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  // Status rangini olish
  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return 'bg-[#2e9c63]'
      case 'pending': return 'bg-[#f59e0b]'
      case 'rejected': return 'bg-[#9b4b6a]'
      default: return 'bg-gray-600'
    }
  }

  // Status textini olish
  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Подтвержден'
      case 'pending': return 'На модерации'
      case 'rejected': return 'Отклонен'
      default: return status
    }
  }

  // Review type olish
  const getReviewType = () => {
    if (review.is_positive) return 'positive'
    if (review.is_constructive) return 'constructive'
    return 'negative'
  }

  // Save text funksiyasi
  const handleSaveText = async () => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.patch(
        `https://api.reiting-profi.ru/api/v1/events/reviews/${review.id}/`,
        { text: editedText },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      toast.success('Текст отзыва обновлен')
      setIsEditing(false)
      onStatusUpdate()
    } catch (error) {
      toast.error('Ошибка при обновлении текста')
    }
  }

  return (
    <div className="w-full border-t border-white/60 px-6 py-5">
      <div className="grid grid-cols-12 items-start justify-between gap-6">
        <div className="flex col-span-3">
          <div className="min-w-[160px] text-white">
            <p className="font-normal text-[20px] leading-[1] tracking-normal">
              {review.reviewer_name || review?.questionnaire?.full_name || review?.questionnaire?.brand_name || 'Аноним'}
            </p>
            <p className="font-normal text-[20px] leading-[1] tracking-normal text-white/35 mt-3">
              {review.role}
            </p>
            <p className="font-normal text-[16px] leading-[1] tracking-normal text-white/50 mt-2">
              {formatPhone(review.reviewer_phone)}
            </p>
            <p className="font-normal text-[14px] leading-[1] tracking-normal text-white/35 mt-2">
              {review.created_at ? formatDate(review.created_at) : ''}
            </p>
            <div className="mt-2 flex items-center gap-2 font-normal text-[12px] leading-[1] tracking-normal">
              {getReviewType() !== 'positive' ? (
                <Star className="text-yellow-400" size={16} />
              ) : (
                <FaStar className="text-yellow-400" size={16} />
              )}
              <span>
                {getReviewType() === 'positive'
                  ? 'положительный'
                  : getReviewType() === 'constructive'
                    ? 'конструктивный'
                    : 'отрицательный'}
              </span>
            </div>

          </div>
        </div>

        <div className="flex-1 col-span-7">
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editedText}
                onChange={(e) => setEditedText(e.target.value)}
                className="resize-none w-full h-[130px] outline-none bg-[#3f4763] p-4 font-normal text-[18px] leading-[1] tracking-normal text-white"
                placeholder="Текст отзыва"
              />
              <div className="flex gap-2">
                <button
                  onClick={handleSaveText}
                  className="px-4 py-2 bg-green-600 rounded text-white"
                >
                  Сохранить
                </button>
                <button
                  onClick={() => {
                    setIsEditing(false)
                    setEditedText(review.text)
                  }}
                  className="px-4 py-2 bg-gray-600 rounded text-white"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div>
              <p className="font-normal text-[20px] leading-[1] tracking-normal mb-2 text-white">
                {review?.questionnaire?.brand_name || ''}
              </p>
              <textarea
                value={review.text}
                readOnly
                className="resize-none w-full h-[110px] outline-none bg-[#3f4763] p-4 font-normal text-[18px] leading-[1] tracking-normal text-white cursor-default"
              />
            </div>
          )}
          {/* {!isEditing && review.status === 'pending' && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-2 text-blue-400 hover:text-blue-300 text-sm"
            >
              Редактировать текст
            </button>
          )} */}
        </div>

        <div className="flex flex-col gap-3 min-w-[130px] col-span-2">
          {review.status === 'pending' ? (
            <>
              <button
                onClick={() => onApprove(review.id)}
                className="rounded-full bg-[#2e9c63] hover:bg-[#218751] w-[166px] h-[44px] text-white font-normal text-[22px] leading-[1] tracking-normal transition-colors"
              >
                одобрить
              </button>
              <button
                onClick={() => onReject(review.id)}
                className="rounded-full bg-[#9b4b6a] hover:bg-[#7a3a54] w-[166px] h-[44px] text-white font-normal text-[22px] leading-[1] tracking-normal transition-colors"
              >
                отклонить
              </button>
            </>
          ) : review.status === 'approved' ? (
            <button
              onClick={() => onReject(review.id)}
              className="rounded-full bg-[#9b4b6a] hover:bg-[#7a3a54] w-[166px] h-[44px] text-white font-normal text-[22px] leading-[1] tracking-normal transition-colors"
            >
              отклонить
            </button>
          ) : (
            <button
              onClick={() => onApprove(review.id)}
              className="rounded-full bg-[#2e9c63] hover:bg-[#218751] w-[166px] h-[44px] text-white font-normal text-[22px] leading-[1] tracking-normal transition-colors"
            >
              одобрить
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

// Asosiy sahifa
export default function Reviews() {
  const [reviews, setReviews] = useState([])
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
    status: '',
    review_type: ''
  })
  const [sortReverse, setSortReverse] = useState(false)
  const initialFetchDone = useRef(false)
  const abortControllerRef = useRef(null)
  // Debounce qidiruv funksiyasi
  const debouncedFetch = useCallback(
    debounce((searchFilters) => {
      fetchReviews(searchFilters)
    }, 500),
    []
  )


  useEffect(() => {
    // Avvalgi so'rovni abort qilish
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    // Yangi abort controller yaratish
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal

    const timer = setTimeout(() => {
      fetchReviews(filters, signal)
    }, 100)

    return () => {
      clearTimeout(timer)
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [
    filters.search,
    filters.status,
    filters.review_type,
    filters.limit,
    filters.offset,
    sortReverse // sortReverse dependency ga qo'shildi
  ])

  const fetchReviews = async (currentFilters, signal) => {
    // Agar so'rov abort qilingan bo'lsa
    if (signal && signal.aborted) {
      console.log('Request aborted')
      return
    }

    setLoading(true)
    try {
      setError(null)

      const token = localStorage.getItem('accessToken')
      if (!token) {
        throw new Error('Токен не найден')
      }

      const params = {
        limit: currentFilters.limit || 10,
        offset: currentFilters.offset || 0
      }

      if (currentFilters.search) {
        params.search = currentFilters.search
      }
      if (currentFilters.status) {
        params.status = currentFilters.status
      }
      if (currentFilters.review_type) {
        if (currentFilters.review_type === 'positive') {
          params.is_positive = 'true'
        } else if (currentFilters.review_type === 'constructive') {
          params.is_constructive = 'true'
        }
      }

      const response = await axios.get(
        'https://api.reiting-profi.ru/api/v1/events/reviews/',
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          params: params,
          signal: signal // abort signal ni berish
        }
      )

      // Agar so'rov abort qilinmagan bo'lsa
      if (!signal || !signal.aborted) {
        if (response.data.results && Array.isArray(response.data.results)) {
          // sortReverse ga qarab tartiblash
          const sortedReviews = sortReverse
            ? [...response.data.results].reverse()
            : response.data.results

          setReviews(sortedReviews)
          setPagination({
            count: response.data.count || 0,
            next: response.data.next,
            previous: response.data.previous,
          })
        } else {
          setReviews([])
          setPagination({ count: 0, next: null, previous: null })
        }
      }
    } catch (err) {
      // Agar abort qilingan bo'lsa, xatoni ignore qilish
      if (axios.isCancel(err) || err.name === 'AbortError') {
        console.log('Request was cancelled')
        return
      }

      console.error('Ошибка при загрузке отзывов:', err)
      setError(err.response?.data?.message || err.message || 'Ошибка при загрузке данных')
      setReviews([])
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
      offset: 0
    }))
  }

  // Search input handler
  const handleSearchChange = (e) => {
    handleFilterChange('search', e.target.value)
  }

  // Status filter handler
  const handleStatusChange = (e) => {
    handleFilterChange('status', e.target.value)
  }

  // Review type filter handler
  const handleReviewTypeChange = (e) => {
    handleFilterChange('review_type', e.target.value)
  }

  // Sort funksiyasi
  const handleSort = () => {
    setSortReverse(!sortReverse)
    setReviews(prev => [...prev].reverse())
  }

  // Pagination handlerlari
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

  // Review status o'zgartirish
  const handleApprove = async (reviewId) => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.patch(
        `https://api.reiting-profi.ru/api/v1/ratings/questionnaire-ratings/${reviewId}/update-status/`,
        { status: 'approved' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      toast.success('Отзыв одобрен')
      fetchReviews(filters) // Yangilash
    } catch (error) {
      toast.error('Ошибка при одобрении отзыва')
    }
  }

  const handleReject = async (reviewId) => {
    try {
      const token = localStorage.getItem('accessToken')
      await axios.patch(
        `https://api.reiting-profi.ru/api/v1/ratings/questionnaire-ratings/${reviewId}/update-status/`,
        { status: 'rejected' },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      )
      toast.success('Отзыв отклонен')
      fetchReviews(filters) // Yangilash
    } catch (error) {
      toast.error('Ошибка при отклонении отзыва')
    }
  }

  // Status yangilanishi uchun callback
  const handleStatusUpdate = () => {
    fetchReviews(filters)
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

  // Statistik ma'lumotlar
  const stats = {
    total: pagination.count,
    approved: reviews.filter(r => r.status === 'approved').length,
    pending: reviews.filter(r => r.status === 'pending').length,
    rejected: reviews.filter(r => r.status === 'rejected').length,
    positive: reviews.filter(r => r.is_positive).length,
    constructive: reviews.filter(r => r.is_constructive).length
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
            placeholder="Найти отзыв по телефону, тексту, имени"
            className="w-full outline-none text-[#FFF] font-normal not-italic text-[16px] leading-[100%] tracking-normal bg-transparent"
            value={filters.search}
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

      <div className="ml-20 mt-5 mb-14">
        <h1 className="font-normal not-italic text-[37px] leading-[100%] tracking-normal text-white">
          ОТЗЫВЫ
        </h1>


      </div>

      {error && (
        <div className="ml-20 mb-5 p-4 bg-red-900/30 border border-red-700 rounded-xl text-xl text-red-400">
          Ошибка: {error}
        </div>
      )}

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <div className="text-2xl text-yellow-400">Загрузка отзывов...</div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-8 text-xl text-gray-400">
          Нет отзывов для отображения
        </div>
      ) : (
        <>
          {reviews.map((review) => (
            <ReviewItem
              key={review.id}
              review={review}
              onApprove={handleApprove}
              onReject={handleReject}
              onStatusUpdate={handleStatusUpdate}
            />
          ))}

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