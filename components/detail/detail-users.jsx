'use client'
import React, { useState, useEffect, useRef } from 'react'
import { useParams, useRouter } from 'next/navigation'
import axios from 'axios'
import { BiSortAlt2 } from 'react-icons/bi'
import { FaSearch } from 'react-icons/fa'
import toast, { Toaster } from 'react-hot-toast'
import Modal from '../ui/Modal'
import EditModal from '../ui/EditModal'
import DesignerEditForm from '../forms/DesignerEditForm'
import RepairEditForm from '../forms/RepairEditForm'
import SupplierEditForm from '../forms/SupplierEditForm'
import MediaEditForm from '../forms/MediaEditForm'
import Image from 'next/image'

export default function DetailUsers() {
    const params = useParams()
    const router = useRouter()
    const { id } = params
    const [loading, setLoading] = useState(true)
    const [data, setData] = useState(null)
    const [showActionModal, setShowActionModal] = useState(false)
    const [showEditModal, setShowEditModal] = useState(false)
    const [modalType, setModalType] = useState('')
    const [editData, setEditData] = useState({})
    const [searchText, setSearchText] = useState('')
    const [requestName, setRequestName] = useState('')
    const [saving, setSaving] = useState(false)
    const [uploadingImage, setUploadingImage] = useState(false)
    const [selectedFile, setSelectedFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState('')
    const fileInputRef = useRef(null)

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
                return null
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

    // Ma'lumotlarni yuklash
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

    // Edit mode bosganda modal ochish
    const handleEditClick = () => {
        setEditData(data)
        setShowEditModal(true)
    }

    // Saqlash funksiyasi
    const handleSave = async (formData) => {
        try {
            setSaving(true)
            const token = getToken()
            const endpoints = getEndpoints(requestName)

            if (!endpoints) {
                toast.error('Неверный тип анкеты')
                return
            }

            await axios.put(endpoints.update, formData, {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            })

            toast.success('Данные успешно обновлены')
            setShowEditModal(false)
            fetchData()
        } catch (error) {
            console.error('Ошибка при обновлении:', error)
            if (error.response?.status === 404) {
                toast.error('Анкета не найдена. Возможно, она была удалена.')
                router.push('/')
            } else {
                toast.error(error.response?.data?.message || 'Ошибка при обновлении данных')
            }
        } finally {
            setSaving(false)
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
            setShowActionModal(false)
            fetchData()
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
            setShowActionModal(false)
            fetchData()
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
            setShowActionModal(false)
        }
    }

    // Modal ochish funksiyalari
    const openActionModal = (type) => {
        setModalType(type)
        setShowActionModal(true)
    }

    // Info text generatsiya
    const generateInfoText = () => {
        if (!data) return ''

        let info = ''

        // Asosiy ma'lumotlar
        info += `ФИО: ${data.full_name || 'Не указано'}\n`
        info += `Телефон: ${formatPhone(data.phone) || 'Не указано'}\n`
        info += `Email: ${data.email || 'Не указано'}\n`
        info += `Бренд: ${data.brand_name || 'Не указано'}\n`

        if (data.responsible_person) {
            info += `Ответственное лицо: ${data.responsible_person}\n`
        }

        if (data.business_form_display) {
            info += `Форма бизнеса: ${data.business_form_display}\n`
        }

        if (data.vat_payment_display) {
            info += `НДС: ${data.vat_payment_display}\n`
        }

        info += `\nСтатус: ${data.status_display || 'Не указано'}\n`
        info += `Дата создания: ${formatDate(data.created_at) || 'Не указано'}\n\n`

        // Turiga qarab qo'shimcha ma'lumotlar
        switch (requestName) {
            case 'DesignerQuestionnaire':
                if (data.city) info += `Город: ${data.city}\n`
                if (data.services && data.services.length > 0) {
                    info += `Услуги: ${data.services.join(', ')}\n`
                }
                if (data.work_type_display) info += `Тип работы: ${data.work_type_display}\n`
                break

            case 'SupplierQuestionnaire':
                if (data.product_assortment) {
                    info += `Ассортимент продукции: ${data.product_assortment}\n`
                }
                if (data.delivery_terms) {
                    info += `Сроки поставки: ${data.delivery_terms}\n`
                }
                if (data.guarantees) {
                    info += `Гарантии: ${data.guarantees}\n`
                }
                if (data.magazine_cards_display) {
                    info += `Карточки журнала: ${data.magazine_cards_display}\n`
                }
                break

            case 'RepairQuestionnaire':
                if (data.work_list) {
                    info += `Перечень работ: ${data.work_list}\n`
                }
                if (data.project_timelines) {
                    info += `Сроки выполнения проектов: ${data.project_timelines}\n`
                }
                if (data.work_format) {
                    info += `Формат работы: ${data.work_format}\n`
                }
                if (data.guarantees) {
                    info += `Гарантии: ${data.guarantees}\n`
                }
                if (data.magazine_cards_display) {
                    info += `Карточки журнала: ${data.magazine_cards_display}\n`
                }
                break

            case 'MediaQuestionnaire':
                if (data.activity_description) {
                    info += `Описание деятельности: ${data.activity_description}\n`
                }
                break
        }

        // Umumiy maydonlar
        if (data.welcome_message) {
            info += `\nПриветственное сообщение:\n${data.welcome_message}\n`
        }

        if (data.cooperation_terms) {
            info += `\nУсловия сотрудничества:\n${data.cooperation_terms}\n`
        }

        // Segmentlar
        if (data.segments && Array.isArray(data.segments) && data.segments.length > 0) {
            info += `\nСегменты: ${data.segments.join(', ')}\n`
        }

        // Kontaktlar
        const contacts = []
        if (data.vk) contacts.push(`VK: ${data.vk}`)
        if (data.instagram) contacts.push(`Instagram: ${data.instagram}`)
        if (data.telegram_channel) contacts.push(`Telegram: ${data.telegram_channel}`)
        if (data.pinterest) contacts.push(`Pinterest: ${data.pinterest}`)
        if (data.website) contacts.push(`Website: ${data.website}`)

        if (contacts.length > 0) {
            info += `\nКонтакты:\n${contacts.join('\n')}\n`
        }

        // Shaharlar
        if (data.representative_cities) {
            if (Array.isArray(data.representative_cities) && data.representative_cities.length > 0) {
                info += `\nГорода представительства:\n`
                data.representative_cities.forEach(city => {
                    const cityName = city.city || 'Не указано'
                    const address = city.address || 'Не указано'
                    const phone = city.phone ? formatPhone(city.phone) : 'Не указано'
                    info += `  • ${cityName}: ${address}, тел: ${phone}\n`
                })
            } else if (typeof data.representative_cities === 'string') {
                info += `\nГорода представительства: ${data.representative_cities}\n`
            }
        }

        // Дополнительная информация
        if (data.additional_info) {
            info += `\nДополнительная информация:\n${data.additional_info}\n`
        }

        return info
    }

    // Edit form componentini tanlash
    const renderEditForm = () => {
        if (!editData) return null

        const commonProps = {
            data: editData,
            onChange: setEditData,
            onSave: handleSave,
            onCancel: () => setShowEditModal(false),
            saving: saving
        }

        switch (requestName) {
            case 'DesignerQuestionnaire':
                return <DesignerEditForm {...commonProps} />
            case 'RepairQuestionnaire':
                return <RepairEditForm {...commonProps} />
            case 'SupplierQuestionnaire':
                return <SupplierEditForm {...commonProps} />
            case 'MediaQuestionnaire':
                return <MediaEditForm {...commonProps} />
            default:
                return null
        }
    }

    if (!requestName) {
        return (
            <div className="flex justify-center items-center h-screen max-md:h-48">
                <div className="text-2xl max-md:text-base text-white">Загрузка типа анкеты...</div>
            </div>
        )
    }

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen max-md:h-48">
                <div className="text-2xl max-md:text-base text-white">Загрузка данных...</div>
            </div>
        )
    }

    if (!data) {
        return (
            <div className="flex justify-center items-center h-screen max-md:h-48">
                <div className="text-2xl max-md:text-base text-white">Данные не найдены</div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-[#122161] text-white max-md:px-4">
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

            {/* Action Modal (delete/publish/reject/moderation) */}
            {showActionModal && (
                <Modal
                    isOpen={showActionModal}
                    onClose={() => setShowActionModal(false)}
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

            {/* Edit Modal */}
            {showEditModal && (
                <EditModal
                    isOpen={showEditModal}
                    onClose={() => setShowEditModal(false)}
                    title={`Редактирование анкеты (ID: ${data.id})`}
                >
                    {renderEditForm()}
                </EditModal>
            )}

            <div className="px-4 py-3 flex items-center gap-7 mt-14 max-md:mt-4 ml-20 max-md:ml-4 max-md:gap-2">
                <div className='relative grow h-9.25 max-md:h-8 bg-[#B7B2B299] rounded-2xl px-5 max-md:px-3 flex items-center'>
                    <input
                        type="text"
                        placeholder="Найти анкету по ID, телефон, название организации, ФИ человека"
                        className="w-full outline-none text-white font-normal not-italic text-[16px] max-md:text-xs leading-[100%] tracking-normal bg-transparent placeholder-white/70"
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                    />
                    <button className="text-white">
                        <FaSearch size={20} className='text-white font-thin max-md:w-4 max-md:h-4' />
                    </button>
                </div>
                <button className="text-gray-400 hover:text-white max-md:hidden">
                    <BiSortAlt2 size={32} className='text-white' />
                </button>
            </div>

            <div className="ml-20 max-md:ml-4 mt-5 max-md:mt-3 mb-14 max-md:mb-6">
                <h1 className="font-normal not-italic text-[37px] max-md:text-xl leading-[100%] tracking-normal text-white">
                    АНКЕТЫ
                </h1>
                <p className="text-white/70 mt-2">
                    Тип: {requestName} | Статус: {data.status_display}
                </p>
            </div>

            <div className="text-white">
                <div className='w-full'>
                    <div className="overflow-x-auto max-md:overflow-x-scroll">
                        {/* Header */}
                        <div className="text-left text-white text-sm grid grid-cols-12 max-md:min-w-[800px]">
                            <div className="col-span-1 pb-4 max-md:pb-2 px-4 max-md:px-2 text-[20px] max-md:text-xs font-normal leading-[100%] border-b border-white/30 tracking-normal">ID</div>
                            <div className="col-span-3 pb-4 max-md:pb-2 px-4 max-md:px-2 text-[20px] max-md:text-xs font-normal leading-[100%] border-b border-white/30 tracking-normal">Название организации / ФИ</div>
                            <div className="col-span-2 pb-4 max-md:pb-2 px-4 max-md:px-2 text-[20px] max-md:text-xs font-normal leading-[100%] border-b border-white/30 tracking-normal">Группа</div>
                            <div className="col-span-2 pb-4 max-md:pb-2 px-4 max-md:px-2 text-[20px] max-md:text-xs font-normal leading-[100%] border-b border-white/30 tracking-normal">Телефон</div>
                            <div className="col-span-2 pb-4 max-md:pb-2 px-4 max-md:px-2 text-[20px] max-md:text-xs font-normal leading-[100%] border-b border-white/30 tracking-normal">Дата заявки</div>
                            <div className="col-span-2 pb-4 max-md:pb-2 px-4 max-md:px-2 text-[20px] max-md:text-xs font-normal leading-[100%] border-b border-white/30 tracking-normal"></div>
                        </div>

                        {/* Content */}
                        <div className="text-white grid grid-cols-12 items-start max-md:min-w-[800px]">
                            <div className="col-span-10 grid grid-cols-10 max-md:col-span-12">
                                {/* Row data */}
                                <div className="col-span-1 h-20 max-md:h-16 flex items-center px-4 max-md:px-2 font-normal text-[20px] max-md:text-xs leading-[100%] tracking-normal">
                                    {data.id}
                                </div>

                                <div className="col-span-3 h-20 max-md:h-16 flex items-center px-4 max-md:px-2 font-normal text-[20px] max-md:text-xs leading-[100%] tracking-normal">
                                    {data.full_name || 'Не указано'}
                                </div>

                                <div className="col-span-2 h-20 max-md:h-16 flex items-center px-4 max-md:px-2 font-normal text-[20px] max-md:text-xs leading-[100%] tracking-normal not-italic">
                                    {data.group_display || data.group || 'Не указано'}
                                </div>

                                <div className="col-span-2 h-20 max-md:h-16 flex items-center px-4 max-md:px-2 font-normal text-[20px] max-md:text-xs leading-[100%] tracking-normal not-italic">
                                    {formatPhone(data.phone)}
                                </div>

                                <div className="col-span-2 h-20 max-md:h-16 flex items-center px-4 max-md:px-2 font-normal not-italic text-[20px] max-md:text-xs leading-[100%] tracking-normal">
                                    {formatDate(data.created_at)}
                                </div>

                                {/* Info textarea */}
                                <textarea
                                    className='col-span-10 max-md:col-span-12 bg-white/10 outline-none h-[438px] max-md:h-40 p-4.5 max-md:p-2 text-white max-md:text-xs mt-4 max-md:mt-2 resize-none border border-white/20 rounded-lg'
                                    value={generateInfoText()}
                                    readOnly
                                    placeholder='ИНФОРМАЦИЯ СОГЛАСНО ПРОФЕЛЮ УЧАСТНИКОВ'
                                />
                            </div>

                            {/* Action buttons */}
                            <div className='col-span-2 max-md:col-span-12'>
                                <div className="col-span-2 flex flex-col max-md:flex-row max-md:flex-wrap items-start max-md:justify-between px-4 max-md:px-2 text-right gap-y-3 max-md:gap-1 mt-4 max-md:mt-2">
                                    <button
                                        onClick={handleEditClick}
                                        className="font-normal not-italic text-base max-md:text-xs leading-[100%] tracking-normal bg-white/10 hover:bg-white/20 w-40 max-md:w-20 h-11 max-md:h-8 rounded-[25px] transition-colors border border-white/30"
                                    >
                                        редактировать
                                    </button>

                                    {data.status !== 'published' && (
                                        <button
                                            onClick={() => openActionModal('publish')}
                                            className="font-normal not-italic text-base max-md:text-xs leading-[100%] tracking-normal bg-blue-600 hover:bg-blue-700 w-40 max-md:w-20 h-11 max-md:h-8 rounded-[25px] transition-colors"
                                        >
                                            опубликовать
                                        </button>
                                    )}

                                    {data.status !== 'rejected' && (
                                        <button
                                            onClick={() => openActionModal('reject')}
                                            className="font-normal not-italic text-base max-md:text-xs leading-[100%] tracking-normal bg-yellow-600 hover:bg-yellow-700 w-40 max-md:w-20 h-11 max-md:h-8 rounded-[25px] transition-colors"
                                        >
                                            отклонить
                                        </button>
                                    )}

                                    <button
                                        onClick={() => openActionModal('delete')}
                                        className="font-normal not-italic text-base max-md:text-xs leading-[100%] tracking-normal bg-[#D7B706] hover:bg-[#C0A205] w-40 max-md:w-20 h-11 max-md:h-8 rounded-[25px] transition-colors"
                                    >
                                        в архив
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}