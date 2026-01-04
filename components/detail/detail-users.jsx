'use client'
import React, { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { BiSortAlt2 } from 'react-icons/bi'
import { FaSearch } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import Modal from '../ui/Modal'

export default function DetailUsers() {
    const params = useParams()
    const router = useRouter()
    const { id } = params
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const [modalType, setModalType] = useState('')
    const [editMode, setEditMode] = useState(false)
    const [editData, setEditData] = useState({})
    const [searchText, setSearchText] = useState('')
    const [requestName, setRequestName] = useState('')

    // URL endpointlarini aniqlash
    const getEndpoints = (type) => {
        const baseURL = 'https://api.reiting-profi.ru/api/v1/accounts'

        switch (type) {
            case 'DesignerQuestionnaire':
                return {
                    get: `${baseURL}/questionnaires/${id}/`,
                    update: `${baseURL}/questionnaires/${id}/`,
                    moderation: `${baseURL}/questionnaires/${id}/moderation/`,
                    status: `${baseURL}/questionnaires/${id}/update-status/`,
                    delete: `${baseURL}/questionnaires/${id}/`
                }
            case 'RepairQuestionnaire':
                return {
                    get: `${baseURL}/repair-questionnaires/${id}/`,
                    update: `${baseURL}/repair-questionnaires/${id}/`,
                    moderation: `${baseURL}/repair-questionnaires/${id}/moderation/`,
                    status: `${baseURL}/repair-questionnaires/${id}/update-status/`,
                    delete: `${baseURL}/repair-questionnaires/${id}/`
                }
            case 'SupplierQuestionnaire':
                return {
                    get: `${baseURL}/supplier-questionnaires/${id}/`,
                    update: `${baseURL}/supplier-questionnaires/${id}/`,
                    moderation: `${baseURL}/supplier-questionnaires/${id}/moderation/`,
                    status: `${baseURL}/supplier-questionnaires/${id}/update-status/`,
                    delete: `${baseURL}/supplier-questionnaires/${id}/`
                }
            case 'MediaQuestionnaire':
                return {
                    get: `${baseURL}/media-questionnaires/${id}/`,
                    update: `${baseURL}/media-questionnaires/${id}/`,
                    moderation: `${baseURL}/media-questionnaires/${id}/moderation/`,
                    status: `${baseURL}/media-questionnaires/${id}/update-status/`,
                    delete: `${baseURL}/media-questionnaires/${id}/`
                }
            default:
                return null // Type aniqlanmagan bo'lsa null qaytar
        }
    }

    // Token olish
    const getToken = () => {
        return localStorage.getItem('accessToken')
    }

    // Type'ni URL dan olish
    useEffect(() => {
        if (typeof window !== 'undefined') {
            const searchParams = new URLSearchParams(window.location.search)
            const type = searchParams.get('type')
            setRequestName(type)
        }
    }, [])

    // Ma'lumotlarni yuklash - type aniqlangandan keyin
    useEffect(() => {
        if (requestName && id) {
            fetchData()
        }
    }, [id, requestName])

    const fetchData = async () => {
        try {
            setLoading(true)
            const token = getToken()

            if (!token) {
                toast.error('Токен не найден. Пожалуйста, войдите в систему.')
                router.push('/login')
                return
            }

            const endpoints = getEndpoints(requestName)

            // Endpoints aniqlanmagan bo'lsa, chiqish
            if (!endpoints) {
                toast.error('Неверный тип анкеты')
                router.push('/')
                return
            }

            const response = await axios.get(endpoints.get, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            setData(response.data)
            setEditData(response.data)
        } catch (error) {
            console.error('Ошибка при загрузке данных:', error)
            if (error.response?.status === 404) {
                toast.error('Анкета не найдена')
                router.push('/')
            } else {
                toast.error(error.response?.data?.message || 'Ошибка при загрузке данных')
            }
        } finally {
            setLoading(false)
        }
    }

    // Date formatlash
    const formatDate = (dateString) => {
        if (!dateString) return ''
        const date = new Date(dateString)
        return date.toLocaleDateString('ru-RU', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        })
    }

    // Telefon formatlash
    const formatPhone = (phone) => {
        if (!phone) return ''
        const cleaned = phone.replace(/\D/g, '')
        if (cleaned.length === 11 && cleaned.startsWith('7')) {
            return `+7 (${cleaned.slice(1, 4)}) ${cleaned.slice(4, 7)}-${cleaned.slice(7, 9)}-${cleaned.slice(9)}`
        }
        return phone
    }

    // Edit mode uchun input handler
    const handleEditChange = (field, value) => {
        setEditData(prev => ({
            ...prev,
            [field]: value
        }))
    }

    // Saqlash funksiyasi
    const handleSave = async () => {
        try {
            const token = getToken()
            const endpoints = getEndpoints(requestName)

            if (!endpoints) {
                toast.error('Неверный тип анкеты')
                return
            }

            const payload = {
                group: editData.group,
                full_name: editData.full_name,
                phone: editData.phone,
                brand_name: editData.brand_name,
                email: editData.email,
                responsible_person: editData.responsible_person,
                representative_cities: editData.representative_cities,
                business_form: editData.business_form,
                activity_description: editData.activity_description,
                welcome_message: editData.welcome_message,
                cooperation_terms: editData.cooperation_terms,
                segments: editData.segments,
                vk: editData.vk,
                telegram_channel: editData.telegram_channel,
                pinterest: editData.pinterest,
                instagram: editData.instagram,
                website: editData.website,
                other_contacts: editData.other_contacts,
                vat_payment: editData.vat_payment,
                additional_info: editData.additional_info
            }

            await axios.put(endpoints.update, payload, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            toast.success('Данные успешно обновлены')
            setEditMode(false)
            fetchData() // Yangi ma'lumotlarni yuklash
        } catch (error) {
            console.error('Ошибка при обновлении:', error)
            toast.error(error.response?.data?.message || 'Ошибка при обновлении данных')
        }
    }

    // Moderation funksiyasi
    const handleModeration = async () => {
        try {
            const token = getToken()
            const endpoints = getEndpoints(requestName)

            if (!endpoints) {
                toast.error('Неверный тип анкеты')
                return
            }

            await axios.patch(endpoints.moderation, {}, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            toast.success('Модерация пройдена успешно')
            fetchData()
            setShowModal(false)
        } catch (error) {
            console.error('Ошибка при модерации:', error)
            toast.error(error.response?.data?.message || 'Ошибка при модерации')
        }
    }

    // Status o'zgartirish
    const handleStatusChange = async (status) => {
        try {
            const token = getToken()
            const endpoints = getEndpoints(requestName)

            if (!endpoints) {
                toast.error('Неверный тип анкеты')
                return
            }

            await axios.post(endpoints.status, { status }, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            toast.success(`Статус изменен на: ${status}`)
            fetchData()
            setShowModal(false)
        } catch (error) {
            console.error('Ошибка при изменении статуса:', error)
            toast.error(error.response?.data?.message || 'Ошибка при изменении статуса')
        }
    }

    // Delete/Arxiv funksiyasi
    const handleDelete = async () => {
        try {
            const token = getToken()
            const endpoints = getEndpoints(requestName)

            if (!endpoints) {
                toast.error('Неверный тип анкеты')
                return
            }

            await axios.delete(endpoints.delete, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            toast.success('Анкета успешно удалена')
            router.push('/')
        } catch (error) {
            console.error('Ошибка при удалении:', error)
            toast.error(error.response?.data?.message || 'Ошибка при удалении')
            setShowModal(false)
        }
    }

    // Modal ochish funksiyalari
    const openModal = (type) => {
        setModalType(type)
        setShowModal(true)
    }

    // Info text generatsiya - TOG'RILANGAN VERSIYA
    const generateInfoText = () => {
        if (!data) return ''

        let info = ''

        // Asosiy ma'lumotlar
        info += `ФИО: ${data.full_name || 'Не указано'}\n`
        info += `Телефон: ${formatPhone(data.phone) || 'Не указано'}\n`
        info += `Email: ${data.email || 'Не указано'}\n`
        info += `Бренд: ${data.brand_name || 'Не указано'}\n`
        info += `Ответственное лицо: ${data.responsible_person || 'Не указано'}\n\n`

        // Qo'shimcha ma'lumotlar
        info += `Форма бизнеса: ${data.business_form || 'Не указано'}\n`
        info += `НДС: ${data.vat_payment_display || 'Не указано'}\n`
        info += `Статус: ${data.status_display || 'Не указано'}\n`
        info += `Дата создания: ${formatDate(data.created_at) || 'Не указано'}\n\n`

        // Faoliyat tavsifi
        if (data.activity_description) {
            info += `Описание деятельности:\n${data.activity_description}\n\n`
        }

        // Hamkorlik shartlari
        if (data.cooperation_terms) {
            info += `Условия сотрудничества:\n${data.cooperation_terms}\n\n`
        }

        // Segmentlar
        if (data.segments && Array.isArray(data.segments) && data.segments.length > 0) {
            info += `Сегменты: ${data.segments.join(', ')}\n\n`
        }

        // Kontaktlar
        info += `Контакты:\n`
        if (data.vk) info += `VK: ${data.vk}\n`
        if (data.instagram) info += `Instagram: ${data.instagram}\n`
        if (data.telegram_channel) info += `Telegram: ${data.telegram_channel}\n`
        if (data.website) info += `Website: ${data.website}\n`

        // Shaharlar - TOG'RILANGAN QISM
        if (data.representative_cities && Array.isArray(data.representative_cities) && data.representative_cities.length > 0) {
            info += `\nГорода представительства:\n`
            data.representative_cities.forEach(city => {
                const cityName = city.city || 'Не указано'
                const address = city.address || 'Не указано'
                const phone = city.phone ? formatPhone(city.phone) : 'Не указано'
                info += `${cityName}: ${address}, тел: ${phone}\n`
            })
        } else if (data.representative_cities && typeof data.representative_cities === 'string') {
            info += `\nГорода представительства: ${data.representative_cities}\n`
        }

        // Reitinglar
        if (data.rating_list && Array.isArray(data.rating_list) && data.rating_list.length > 0) {
            info += `\nОтзывы (${data.rating_count?.total || 0}):\n`
            data.rating_list.forEach(review => {
                const type = review.is_positive ? 'Положительный' : review.is_constructive ? 'Конструктивный' : 'Негативный'
                info += `${type}: ${review.text}\n`
            })
        }

        return info
    }

    if (!requestName) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-2xl text-yellow-400">Загрузка типа анкеты...</div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-2xl text-yellow-400">Загрузка данных...</div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-2xl text-red-400">Данные не найдены</div>
            </div>
        )
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

            {/* Modal */}
            {showModal && (
                <Modal
                    isOpen={showModal}
                    onClose={() => setShowModal(false)}
                    onConfirm={() => {
                        if (modalType === 'moderation') handleModeration()
                        else if (modalType === 'delete') handleDelete()
                        else if (modalType === 'publish') handleStatusChange('published')
                        else if (modalType === 'reject') handleStatusChange('rejected')
                        else if (modalType === 'archive') handleStatusChange('archived')
                    }}
                    title={
                        modalType === 'delete' ? 'Архивирование' :
                            modalType === 'moderation' ? 'Модерация' :
                                modalType === 'publish' ? 'Публикация' :
                                    modalType === 'reject' ? 'Отклонение' :
                                        'Архивирование'
                    }
                    message={
                        modalType === 'delete' ? 'Вы уверены, что хотите переместить эту анкету в архив?' :
                            modalType === 'moderation' ? 'Вы уверены, что хотите пройти модерацию этой анкеты?' :
                                modalType === 'publish' ? 'Вы уверены, что хотите опубликовать эту анкету?' :
                                    modalType === 'reject' ? 'Вы уверены, что хотите отклонить эту анкету?' :
                                        'Вы уверены, что хотите переместить эту анкету в архив?'
                    }
                />
            )}

            <div className="px-4 py-3 flex items-center gap-7 mt-14 ml-20">
                <div className='relative grow h-9.25 bg-[#B7B2B299] rounded-2xl px-5 flex items-center'>
                    <input
                        type="text"
                        placeholder="Найти анкету по ID, телефон, название организации, ФИ человека"
                        className="w-full outline-none text-[#FFF] font-normal not-italic text-[16px] leading-[100%] tracking-normal bg-transparent"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="text-white">
                        <FaSearch size={20} className='text-black font-thin' />
                    </button>
                </div>
                <button className="text-gray-400 hover:text-white">
                    <BiSortAlt2 size={32} className='text-white' />
                </button>
            </div>

            <div className="ml-20 mt-5 mb-14">
                <h1 className="font-normal not-italic text-[37px] leading-[100%] tracking-normal text-white">
                    АНКЕТЫ
                </h1>
            </div>

            <div className="text-white">
                <div className='w-full m-auto'>
                    <div className="overflow-x-auto">
                        {/* Header */}
                        <div className="text-left text-[white] text-sm grid grid-cols-12">
                            <div className="col-span-1 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">ID</div>
                            <div className="col-span-3 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Название организации / ФИ</div>
                            <div className="col-span-2 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Группа</div>
                            <div className="col-span-2 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Телефон</div>
                            <div className="col-span-2 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal">Дата заявки</div>
                            <div className="col-span-2 pb-4 px-4 text-[20px] font-normal leading-[100%] border-b border-white tracking-normal"></div>
                        </div>

                        {/* Content */}
                        <div className="text-white hover:bg-gray-750 grid grid-cols-12 items-start">
                            <div className="col-span-10 grid grid-cols-10">
                                {/* Row data */}
                                <div className="col-span-1 h-20 flex items-center px-4 font-normal text-[20px] leading-[100%] tracking-normal">
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={editData.id || ''}
                                            disabled
                                            className="bg-transparent border border-gray-600 rounded px-2 py-1 w-full"
                                        />
                                    ) : data.id}
                                </div>

                                <div className="col-span-3 h-20 flex items-center px-4 font-normal text-[20px] leading-[100%] tracking-normal">
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={editData.full_name || ''}
                                            onChange={(e) => handleEditChange('full_name', e.target.value)}
                                            className="bg-transparent border border-gray-600 rounded px-2 py-1 w-full"
                                        />
                                    ) : data.full_name || 'Не указано'}
                                </div>

                                <div className="col-span-2 h-20 flex items-center px-4 font-normal text-[20px] leading-[100%] tracking-normal not-italic">
                                    {editMode ? (
                                        <select
                                            value={editData.group || ''}
                                            onChange={(e) => handleEditChange('group', e.target.value)}
                                            className="bg-transparent border border-gray-600 rounded px-2 py-1 w-full"
                                        >
                                            <option value="design">Дизайн</option>
                                            <option value="repair">Ремонт</option>
                                            <option value="supplier">Поставщик</option>
                                            <option value="media">Медиа</option>
                                        </select>
                                    ) : data.group_display || data.group || 'Не указано'}
                                </div>

                                <div className="col-span-2 h-20 flex items-center px-4 font-normal text-[20px] leading-[100%] tracking-normal not-italic">
                                    {editMode ? (
                                        <input
                                            type="text"
                                            value={editData.phone || ''}
                                            onChange={(e) => handleEditChange('phone', e.target.value)}
                                            className="bg-transparent border border-gray-600 rounded px-2 py-1 w-full"
                                        />
                                    ) : formatPhone(data.phone)}
                                </div>

                                <div className="col-span-2 h-20 flex items-center px-4 font-normal not-italic text-[20px] leading-[100%] tracking-normal">
                                    {formatDate(data.created_at)}
                                </div>

                                {/* Info textarea */}
                                <textarea
                                    className='col-span-10 bg-[#71707080] outline-none h-[438px] p-4.5 text-[#FFFFFF] mt-4 resize-none'
                                    value={editMode ? JSON.stringify(editData, null, 2) : generateInfoText()}
                                    onChange={(e) => {
                                        if (editMode) {
                                            try {
                                                const parsed = JSON.parse(e.target.value)
                                                setEditData(parsed)
                                            } catch (err) {
                                                // JSON parse error bo'lsa, faqat text sifatida saqlash
                                                handleEditChange('additional_info', e.target.value)
                                            }
                                        }
                                    }}
                                    readOnly={!editMode}
                                    placeholder='ИНФОРМАЦИЯ СОГЛАСНО ПРОФЕЛЮ УЧАСТНИКОВ'
                                />
                            </div>

                            {/* Action buttons */}
                            <div className='col-span-2'>
                                <div className="col-span-2 flex flex-col items-start px-4 text-right gap-y-3 mt-4">
                                    {editMode ? (
                                        <>
                                            <button
                                                onClick={handleSave}
                                                className="font-normal not-italic text-base leading-[100%] tracking-normal bg-green-600 hover:bg-green-700 w-40 h-11 rounded-[25px] transition-colors"
                                            >
                                                СОХРАНИТЬ
                                            </button>
                                            <button
                                                onClick={() => {
                                                    setEditMode(false)
                                                    setEditData(data)
                                                }}
                                                className="font-normal not-italic text-base leading-[100%] tracking-normal bg-red-600 hover:bg-red-700 w-40 h-11 rounded-[25px] transition-colors"
                                            >
                                                ОТМЕНИТЬ
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={() => setEditMode(true)}
                                                className="font-normal not-italic text-base leading-[100%] tracking-normal bg-[#71707099] hover:bg-[#717070cc] w-40 h-11 rounded-[25px] transition-colors"
                                            >
                                                редактировать
                                            </button>

                                            {data.status !== 'published' && (
                                                <button
                                                    onClick={() => openModal('publish')}
                                                    className="font-normal not-italic text-base leading-[100%] tracking-normal bg-[#71707099] hover:bg-[#717070cc] w-40 h-11 rounded-[25px] transition-colors"
                                                >
                                                    опубликовать
                                                </button>
                                            )}

                                            {data.status !== 'rejected' && (
                                                <button
                                                    onClick={() => openModal('reject')}
                                                    className="font-normal not-italic text-base leading-[100%] tracking-normal bg-[#71707099] hover:bg-[#717070cc] w-40 h-11 rounded-[25px] transition-colors"
                                                >
                                                    отклонить
                                                </button>
                                            )}

                                            {/* <button
                                                onClick={() => openModal('moderation')}
                                                className="font-normal not-italic text-base leading-[100%] tracking-normal bg-blue-600 hover:bg-blue-700 w-40 h-11 rounded-[25px] transition-colors"
                                            >
                                                модерация
                                            </button> */}

                                            <button
                                                onClick={() => openModal('delete')}
                                                className="font-normal not-italic text-base leading-[100%] tracking-normal bg-[#D7B7068A] hover:bg-[#D7B706] w-40 h-11 rounded-[25px] transition-colors"
                                            >
                                                в архив
                                            </button>

                                            {/* <button
                                                onClick={() => openModal('delete')}
                                                className="font-normal not-italic text-base leading-[100%] tracking-normal bg-red-700 hover:bg-red-800 w-40 h-11 rounded-[25px] transition-colors mt-4"
                                            >
                                                УДАЛИТЬ
                                            </button> */}
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}