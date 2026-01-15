'use client'
import React, { useState, useEffect, useCallback } from 'react'
import axios from 'axios'
import { FaSearch, FaCalendarAlt, FaMapMarkerAlt, FaPhone, FaEdit, FaTrash, FaPlus, FaEye, FaTimes, FaUpload, FaImage } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import debounce from 'lodash/debounce'

export default function AllEvents() {
    const [events, setEvents] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [showForm, setShowForm] = useState(false)
    const [editingEvent, setEditingEvent] = useState(null)
    const [selectedEvent, setSelectedEvent] = useState(null)
    const [uploading, setUploading] = useState(false)
    const [posterFile, setPosterFile] = useState(null)
    const [posterPreview, setPosterPreview] = useState('')

    const [filters, setFilters] = useState({
        search: '',
        city: '',
        event_date: '',
        event_type: '',
        status: '',
        ordering: '',
        limit: 10,
        offset: 0,
    })

    const [pagination, setPagination] = useState({
        count: 0,
        next: null,
        previous: null,
    })

    const [newEvent, setNewEvent] = useState({
        organization_name: '',
        event_type: 'training',
        announcement: '',
        event_date: '',
        event_location: '',
        city: '',
        registration_phone: '',
        about_event: '',
        status: 'draft'
    })

    const eventTypes = [
        { value: 'training', label: 'Обучение', color: 'bg-blue-600' },
        { value: 'presentation', label: 'Презентация', color: 'bg-green-600' },
        { value: 'opening', label: 'Открытие', color: 'bg-purple-600' },
        { value: 'leisure', label: 'Досуг', color: 'bg-yellow-600' }
    ]

    const statusOptions = [
        { value: 'draft', label: 'Черновик', color: 'bg-gray-600' },
        { value: 'published', label: 'Опубликовано', color: 'bg-green-600' },
        { value: 'cancelled', label: 'Отменено', color: 'bg-red-600' }
    ]

    // Debounce поиск функции
    const debouncedFetch = useCallback(
        debounce((filters) => {
            fetchEvents(filters)
        }, 500),
        []
    )

    // Получить мероприятия
    const fetchEvents = async (currentFilters) => {
        try {
            setLoading(true)
            setError(null)

            const token = localStorage.getItem("accessToken")
            if (!token) {
                throw new Error("Токен не найден. Пожалуйста, войдите в систему.")
            }

            const params = {
                limit: currentFilters.limit,
                offset: currentFilters.offset,
                ordering: currentFilters.ordering
            }

            if (currentFilters.search) params.search = currentFilters.search
            if (currentFilters.city) params.city = currentFilters.city
            if (currentFilters.event_date) params.event_date = currentFilters.event_date
            if (currentFilters.event_type) params.event_type = currentFilters.event_type
            if (currentFilters.status) params.status = currentFilters.status

            const response = await axios.get(
                "https://api.reiting-profi.ru/api/v1/events/upcoming-events/",
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    params: params
                }
            )

            console.log("API ответ мероприятий:", response.data)

            if (Array.isArray(response.data.results)) {
                setEvents(response.data.results)
                setPagination({
                    count: response.data.count || 0,
                    next: response.data.next,
                    previous: response.data.previous,
                })
            } else {
                setEvents([])
                setPagination({ count: 0, next: null, previous: null })
            }
        } catch (err) {
            console.error("Ошибка при загрузке мероприятий:", err)
            setError(err.response?.data?.message || err.message || "Ошибка при загрузке данных")
            setEvents([])
            setPagination({ count: 0, next: null, previous: null })
            toast.error(err.response?.data?.message || "Ошибка при загрузке мероприятий")
        } finally {
            setLoading(false)
        }
    }

    // Создать новое мероприятие с файлом
    const handleCreateEvent = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("accessToken")
            if (!token) {
                throw new Error("Токен не найден. Пожалуйста, войдите в систему.")
            }

            setUploading(true)

            // Создаем FormData для отправки файла
            const formData = new FormData()

            // Добавляем текстовые поля
            formData.append('organization_name', newEvent.organization_name)
            formData.append('event_type', newEvent.event_type)
            formData.append('announcement', newEvent.announcement)
            formData.append('event_date', new Date(newEvent.event_date).toISOString())
            formData.append('event_location', newEvent.event_location)
            formData.append('city', newEvent.city)
            formData.append('registration_phone', newEvent.registration_phone.replace(/\D/g, ''))
            formData.append('about_event', newEvent.about_event)
            formData.append('status', newEvent.status)

            // Добавляем файл постара если есть
            if (posterFile) {
                formData.append('poster', posterFile)
            }

            const response = await axios.post(
                "https://api.reiting-profi.ru/api/v1/events/upcoming-events/",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            )

            toast.success("Мероприятие успешно создано!")
            setShowForm(false)
            resetForm()
            fetchEvents(filters)
        } catch (err) {
            console.error("Ошибка при создании мероприятия:", err)
            toast.error(err.response?.data?.message || "Ошибка при создании мероприятия")
        } finally {
            setUploading(false)
        }
    }

    // Обновить мероприятие с файлом
    const handleUpdateEvent = async (e) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("accessToken")
            if (!token) {
                throw new Error("Токен не найден. Пожалуйста, войдите в систему.")
            }

            setUploading(true)

            // Создаем FormData для отправки файла
            const formData = new FormData()

            // Добавляем текстовые поля
            formData.append('organization_name', newEvent.organization_name)
            formData.append('event_type', newEvent.event_type)
            formData.append('announcement', newEvent.announcement)
            formData.append('event_date', new Date(newEvent.event_date).toISOString())
            formData.append('event_location', newEvent.event_location)
            formData.append('city', newEvent.city)
            formData.append('registration_phone', newEvent.registration_phone.replace(/\D/g, ''))
            formData.append('about_event', newEvent.about_event)
            formData.append('status', newEvent.status)

            // Добавляем файл постара если есть (только если новый файл выбран)
            if (posterFile) {
                formData.append('poster', posterFile)
            }

            // Используем PATCH для обновления
            const response = await axios.patch(
                `https://api.reiting-profi.ru/api/v1/events/upcoming-events/${editingEvent}/`,
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data',
                    }
                }
            )

            toast.success("Мероприятие успешно обновлено!")
            setShowForm(false)
            setEditingEvent(null)
            resetForm()
            fetchEvents(filters)
        } catch (err) {
            console.error("Ошибка при обновлении мероприятия:", err)
            toast.error(err.response?.data?.message || "Ошибка при обновлении мероприятия")
        } finally {
            setUploading(false)
        }
    }

    // Удалить мероприятие
    const handleDeleteEvent = async (id) => {
        if (!confirm("Вы уверены, что хотите удалить это мероприятие?")) return

        try {
            const token = localStorage.getItem("accessToken")
            if (!token) {
                throw new Error("Токен не найден. Пожалуйста, войдите в систему.")
            }

            await axios.delete(
                `https://api.reiting-profi.ru/api/v1/events/upcoming-events/${id}/`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    }
                }
            )

            toast.success("Мероприятие успешно удалено!")
            fetchEvents(filters)
        } catch (err) {
            console.error("Ошибка при удалении мероприятия:", err)
            toast.error(err.response?.data?.message || "Ошибка при удалении мероприятия")
        }
    }

    // Сбросить форму
    const resetForm = () => {
        setNewEvent({
            organization_name: '',
            event_type: 'training',
            announcement: '',
            event_date: '',
            event_location: '',
            city: '',
            registration_phone: '',
            about_event: '',
            status: 'draft'
        })
        setPosterFile(null)
        setPosterPreview('')
    }

    // Редактировать мероприятие
    const handleEditEvent = (event) => {
        setEditingEvent(event.id)
        setNewEvent({
            organization_name: event.organization_name,
            event_type: event.event_type,
            announcement: event.announcement,
            event_date: event.event_date ? event.event_date.split('T')[0] + 'T' + event.event_date.split('T')[1].substring(0, 5) : '',
            event_location: event.event_location,
            city: event.city,
            registration_phone: event.registration_phone,
            about_event: event.about_event,
            status: event.status
        })

        // Если есть постер, устанавливаем превью
        if (event.poster) {
            setPosterPreview(event.poster)
        }

        setPosterFile(null)
        setShowForm(true)
    }

    // Обработчик изменения фильтров
    const handleFilterChange = (key, value) => {
        const newFilters = { ...filters, [key]: value, offset: 0 }
        setFilters(newFilters)
        debouncedFetch(newFilters)
    }

    // Обработчик выбора файла
    const handleFileChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            // Проверка типа файла
            if (!file.type.startsWith('image/')) {
                toast.error('Пожалуйста, выберите изображение (JPG, PNG, GIF)')
                return
            }

            // Проверка размера файла (максимум 10MB)
            if (file.size > 10 * 1024 * 1024) {
                toast.error('Размер файла не должен превышать 10MB')
                return
            }

            // Сохраняем файл
            setPosterFile(file)

            // Создаем превью
            const reader = new FileReader()
            reader.onloadend = () => {
                setPosterPreview(reader.result)
            }
            reader.readAsDataURL(file)
        }
    }

    // Удалить постер
    const handleRemovePoster = () => {
        setPosterFile(null)
        setPosterPreview('')
    }

    // Пагинация handlers
    const handleNextPage = () => {
        if (pagination.next) {
            const newOffset = filters.offset + filters.limit
            const newFilters = { ...filters, offset: newOffset }
            setFilters(newFilters)
            fetchEvents(newFilters)
        }
    }

    const handlePrevPage = () => {
        if (pagination.previous) {
            const newOffset = Math.max(0, filters.offset - filters.limit)
            const newFilters = { ...filters, offset: newOffset }
            setFilters(newFilters)
            fetchEvents(newFilters)
        }
    }

    // Форматировать телефон
    const formatPhone = (phone) => {
        if (!phone) return "Не указано"
        return phone.replace(/(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})/, '+$1 ($2) $3-$4-$5')
    }

    // Форматировать дату
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

    const formatPhoneInput = (value) => {
        // Faqat raqamlarni qoldirish
        const numbers = value.replace(/\D/g, '');

        // Agar input bo'sh bo'lsa, faqat '+' qaytarish
        if (!numbers) return '+';

        // Agar + bo'lmasa, + qo'shish
        if (!value.startsWith('+')) {
            return '+' + numbers;
        }

        // Aks holda + bilan raqamlarni qaytarish
        return '+' + numbers;
    }
    const handlePhoneChange = (e) => {
        const formattedPhone = formatPhoneInput(e.target.value);
        setNewEvent({ ...newEvent, registration_phone: formattedPhone });
    }

    // Получить цвет статуса
    const getStatusColor = (status) => {
        switch (status) {
            case 'published': return 'bg-green-600 text-white'
            case 'draft': return 'bg-gray-600 text-white'
            case 'cancelled': return 'bg-red-600 text-white'
            default: return 'bg-gray-600 text-white'
        }
    }

    // Получить цвет типа мероприятия
    const getEventTypeColor = (type) => {
        switch (type) {
            case 'training': return 'bg-blue-600 text-white'
            case 'presentation': return 'bg-green-600 text-white'
            case 'opening': return 'bg-purple-600 text-white'
            case 'leisure': return 'bg-yellow-600 text-white'
            default: return 'bg-gray-600 text-white'
        }
    }

    // Показать детали мероприятия
    const showEventDetails = (event) => {
        setSelectedEvent(event)
    }

    // Первоначальная загрузка
    useEffect(() => {
        fetchEvents(filters)
    }, [])

    // Пагинация расчеты
    const totalPages = Math.ceil(pagination.count / filters.limit)
    const currentPage = Math.floor(filters.offset / filters.limit) + 1

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

    const handlePageClick = (pageNumber) => {
        const newOffset = (pageNumber - 1) * filters.limit
        const newFilters = { ...filters, offset: newOffset }
        setFilters(newFilters)
        fetchEvents(newFilters)
    }

    return (
        <div className="p-6">
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

            {/* Заголовок и контролы */}
            <div className="mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-3xl font-bold text-white">ПРЕДСТОЯЩИЕ МЕРОПРИЯТИЯ</h1>
                    <button
                        onClick={() => {
                            resetForm()
                            setEditingEvent(null)
                            setShowForm(true)
                        }}
                        className="flex items-center gap-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors"
                    >
                        <FaPlus /> Новое мероприятие
                    </button>
                </div>

                {/* Фильтры */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <FaSearch className="text-gray-400" />
                        </div>
                        <input
                            type="text"
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                            placeholder="Поиск..."
                            className="w-full pl-10 pr-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                        />
                    </div>

                    <input
                        type="text"
                        value={filters.city}
                        onChange={(e) => handleFilterChange('city', e.target.value)}
                        placeholder="Город"
                        className="px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    />

                    <select
                        value={filters.event_type}
                        onChange={(e) => handleFilterChange('event_type', e.target.value)}
                        className="px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="" className="text-gray-400">Все типы</option>
                        {eventTypes.map((type) => (
                            <option key={type.value} value={type.value} className="text-white">{type.label}</option>
                        ))}
                    </select>

                    <select
                        value={filters.ordering}
                        onChange={(e) => handleFilterChange('ordering', e.target.value)}
                        className="px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    >
                        <option value="-event_date" className="text-white">Сначала новые</option>
                        <option value="event_date" className="text-white">Сначала старые</option>
                        <option value="-created_at" className="text-white">Сначала добавленные</option>
                        <option value="created_at" className="text-white">Сначала старые записи</option>
                    </select>
                </div>
            </div>

            {/* Модальное окно формы мероприятия */}
            {showForm && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">
                                    {editingEvent ? "Редактирование мероприятия" : "Создание мероприятия"}
                                </h2>
                                <button
                                    onClick={() => {
                                        setShowForm(false)
                                        setEditingEvent(null)
                                        resetForm()
                                    }}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <form onSubmit={editingEvent ? handleUpdateEvent : handleCreateEvent}>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                                    <div className="md:col-span-2">
                                        <label className="block text-white mb-2">Название организации *</label>
                                        <input
                                            type="text"
                                            value={newEvent.organization_name}
                                            onChange={(e) => setNewEvent({ ...newEvent, organization_name: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-2">Тип мероприятия *</label>
                                        <select
                                            value={newEvent.event_type}
                                            onChange={(e) => setNewEvent({ ...newEvent, event_type: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        >
                                            {eventTypes.map((type) => (
                                                <option key={type.value} value={type.value} className="text-white">{type.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div>
                                        <label className="block text-white mb-2">Город *</label>
                                        <input
                                            type="text"
                                            value={newEvent.city}
                                            onChange={(e) => setNewEvent({ ...newEvent, city: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-2">Дата и время *</label>
                                        <input
                                            type="datetime-local"
                                            value={newEvent.event_date}
                                            onChange={(e) => setNewEvent({ ...newEvent, event_date: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-white mb-2">Место проведения *</label>
                                        <input
                                            type="text"
                                            value={newEvent.event_location}
                                            onChange={(e) => setNewEvent({ ...newEvent, event_location: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-white mb-2">Телефон для регистрации *</label>
                                        <input
                                            type="tel"
                                            placeholder='+7 999 999 99 99'
                                            value={newEvent.registration_phone}
                                            onChange={handlePhoneChange}
                                            onKeyDown={(e) => {
                                                // Faqat raqamlar, Backspace, Delete, Tab, Arrow keys
                                                const allowedKeys = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End'];
                                                const isNumber = /[0-9]/.test(e.key);
                                                const isControl = allowedKeys.includes(e.key);

                                                if (!isNumber && !isControl) {
                                                    e.preventDefault();
                                                }
                                            }}
                                            className="w-full px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-white mb-2">Анонс *</label>
                                        <textarea
                                            value={newEvent.announcement}
                                            onChange={(e) => setNewEvent({ ...newEvent, announcement: e.target.value })}
                                            rows="3"
                                            className="w-full px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                            required
                                        />
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-white mb-2">О мероприятии</label>
                                        <textarea
                                            value={newEvent.about_event}
                                            onChange={(e) => setNewEvent({ ...newEvent, about_event: e.target.value })}
                                            rows="4"
                                            className="w-full px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-white mb-2">Статус</label>
                                        <select
                                            value={newEvent.status}
                                            onChange={(e) => setNewEvent({ ...newEvent, status: e.target.value })}
                                            className="w-full px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500"
                                        >
                                            {statusOptions.map((status) => (
                                                <option key={status.value} value={status.value} className="text-white">{status.label}</option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="md:col-span-2">
                                        <label className="block text-white mb-2">Постер мероприятия</label>
                                        <div className="space-y-4">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleFileChange}
                                                className="w-full px-4 py-2 bg-[#2D2D2D] border border-gray-700 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-yellow-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-yellow-600 file:text-white hover:file:bg-yellow-700"
                                            />

                                            <div className="flex flex-col md:flex-row gap-4">
                                                {posterPreview && (
                                                    <div className="relative">
                                                        <img
                                                            src={posterPreview}
                                                            alt="Предпросмотр постера"
                                                            className="w-48 h-48 object-cover rounded-lg border border-gray-700"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={handleRemovePoster}
                                                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700"
                                                        >
                                                            <FaTimes size={16} />
                                                        </button>
                                                    </div>
                                                )}

                                                <div className={`border-2 border-dashed border-gray-700 rounded-lg p-8 text-center ${posterPreview ? 'hidden md:flex flex-col items-center justify-center w-48' : 'w-full'}`}>
                                                    <FaImage className="mx-auto text-gray-500 mb-2" size={32} />
                                                    <p className="text-gray-400 text-sm">
                                                        {posterPreview ? 'Другой постер' : 'Загрузите постер мероприятия'}
                                                    </p>
                                                    <p className="text-gray-500 text-xs mt-1">JPG, PNG, GIF до 10MB</p>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end gap-4">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false)
                                            setEditingEvent(null)
                                            resetForm()
                                        }}
                                        className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                                    >
                                        Отмена
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={uploading}
                                        className="px-6 py-2 bg-yellow-600 hover:bg-yellow-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? 'Загрузка...' : (editingEvent ? 'Сохранить' : 'Создать')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}

            {/* Модальное окно деталей мероприятия */}
            {selectedEvent && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-gray-800 rounded-xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-bold text-white">Детали мероприятия</h2>
                                <button
                                    onClick={() => setSelectedEvent(null)}
                                    className="text-gray-400 hover:text-white"
                                >
                                    <FaTimes size={24} />
                                </button>
                            </div>

                            <div className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full ${getEventTypeColor(selectedEvent.event_type)} text-sm font-medium`}>
                                        {selectedEvent.event_type_display}
                                    </span>
                                    <span className={`px-3 py-1 rounded-full ${getStatusColor(selectedEvent.status)} text-sm font-medium`}>
                                        {selectedEvent.status_display}
                                    </span>
                                </div>

                                {selectedEvent.poster && (
                                    <div className="flex justify-center">
                                        <img
                                            src={selectedEvent.poster}
                                            alt="Постер мероприятия"
                                            className="max-w-full max-h-64 object-contain rounded-lg"
                                        />
                                    </div>
                                )}

                                <div>
                                    <h3 className="text-white font-bold text-xl mb-2">{selectedEvent.organization_name}</h3>
                                    <p className="text-gray-300">{selectedEvent.announcement}</p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="flex items-start gap-3">
                                        <FaCalendarAlt className="text-yellow-500 mt-1" />
                                        <div>
                                            <p className="text-gray-400 text-sm">Дата и время</p>
                                            <p className="text-white">{formatDate(selectedEvent.event_date)}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-yellow-500 mt-1" />
                                        <div>
                                            <p className="text-gray-400 text-sm">Место проведения</p>
                                            <p className="text-white">{selectedEvent.event_location}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaMapMarkerAlt className="text-yellow-500 mt-1" />
                                        <div>
                                            <p className="text-gray-400 text-sm">Город</p>
                                            <p className="text-white">{selectedEvent.city}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-3">
                                        <FaPhone className="text-yellow-500 mt-1" />
                                        <div>
                                            <p className="text-gray-400 text-sm">Телефон для регистрации</p>
                                            <p className="text-white">{formatPhone(selectedEvent.registration_phone)}</p>
                                        </div>
                                    </div>
                                </div>

                                {selectedEvent.about_event && (
                                    <div>
                                        <h4 className="text-white font-bold mb-2">О мероприятии:</h4>
                                        <p className="text-gray-300 whitespace-pre-line">{selectedEvent.about_event}</p>
                                    </div>
                                )}

                                <div className="pt-4 border-t border-gray-700">
                                    <div className="text-gray-400 text-sm space-y-1">
                                        <p>Создано: {formatDate(selectedEvent.created_at)}</p>
                                        {selectedEvent.created_by_name && (
                                            <p>Создатель: {selectedEvent.created_by_name}</p>
                                        )}
                                        <p>Обновлено: {formatDate(selectedEvent.updated_at)}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Таблица */}
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-2xl text-yellow-400">Загрузка мероприятий...</div>
                </div>
            ) : error ? (
                <div className="flex justify-center items-center h-64">
                    <div className="text-2xl text-red-400">{error}</div>
                </div>
            ) : (
                <>
                    <div className="overflow-x-auto rounded-lg border border-gray-700">
                        <table className="w-full">
                            <thead className="bg-gray-800">
                                <tr>
                                    <th className="py-4 px-6 text-left text-white font-semibold">Название организации</th>
                                    <th className="py-4 px-6 text-left text-white font-semibold">Тип</th>
                                    <th className="py-4 px-6 text-left text-white font-semibold">Город</th>
                                    <th className="py-4 px-6 text-left text-white font-semibold">Дата и время</th>
                                    <th className="py-4 px-6 text-left text-white font-semibold">Статус</th>
                                    <th className="py-4 px-6 text-left text-white font-semibold">Действия</th>
                                </tr>
                            </thead>
                            <tbody>
                                {events.length === 0 ? (
                                    <tr>
                                        <td colSpan="6" className="py-8 text-center text-xl text-gray-400">
                                            Нет мероприятий для отображения
                                        </td>
                                    </tr>
                                ) : (
                                    events.map((event) => (
                                        <tr key={event.id} className="border-b border-gray-700 hover:bg-gray-800/50">
                                            <td className="py-4 px-6">
                                                <div className="text-white font-medium">{event.organization_name}</div>
                                                {/* <div className="text-gray-400 text-sm mt-1 line-clamp-1">
                                                    {event.announcement}
                                                </div> */}
                                            </td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full ${getEventTypeColor(event.event_type)} text-sm font-medium`}>
                                                    {event.event_type_display}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6 text-white">{event.city}</td>
                                            <td className="py-4 px-6 text-white">{formatDate(event.event_date)}</td>
                                            <td className="py-4 px-6">
                                                <span className={`px-3 py-1 rounded-full ${getStatusColor(event.status)} text-sm font-medium`}>
                                                    {event.status_display}
                                                </span>
                                            </td>
                                            <td className="py-4 px-6">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => showEventDetails(event)}
                                                        className="p-2 text-blue-400 hover:text-blue-300 transition-colors"
                                                        title="Просмотреть"
                                                    >
                                                        <FaEye />
                                                    </button>
                                                    <button
                                                        onClick={() => handleEditEvent(event)}
                                                        className="p-2 text-yellow-400 hover:text-yellow-300 transition-colors"
                                                        title="Редактировать"
                                                    >
                                                        <FaEdit />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteEvent(event.id)}
                                                        className="p-2 text-red-400 hover:text-red-300 transition-colors"
                                                        title="Удалить"
                                                    >
                                                        <FaTrash />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    {/* Пагинация */}
                    {pagination.count > 0 && (
                        <div className="flex flex-col md:flex-row justify-between items-center mt-6 gap-4">
                            <div className="text-gray-400">
                                Показано: {Math.min(filters.offset + 1, pagination.count)}-
                                {Math.min(filters.offset + filters.limit, pagination.count)} из {pagination.count}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    onClick={handlePrevPage}
                                    disabled={!pagination.previous}
                                    className={`px-4 py-2 rounded-lg ${pagination.previous ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 cursor-not-allowed'} text-white transition-colors`}
                                >
                                    Назад
                                </button>

                                {getPageNumbers().map(page => (
                                    <button
                                        key={page}
                                        onClick={() => handlePageClick(page)}
                                        className={`px-4 py-2 rounded-lg ${currentPage === page ? 'bg-yellow-600' : 'bg-gray-700 hover:bg-gray-600'} text-white transition-colors`}
                                    >
                                        {page}
                                    </button>
                                ))}

                                <button
                                    onClick={handleNextPage}
                                    disabled={!pagination.next}
                                    className={`px-4 py-2 rounded-lg ${pagination.next ? 'bg-gray-700 hover:bg-gray-600' : 'bg-gray-800 cursor-not-allowed'} text-white transition-colors`}
                                >
                                    Вперед
                                </button>
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}