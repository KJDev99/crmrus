'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import toast from 'react-hot-toast';
import { IoIosArrowBack } from 'react-icons/io'

export default function MediaDetail({ questionnaire, onBack }) {
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewType, setReviewType] = useState('positive');
    const [reviewText, setReviewText] = useState('');
    const [rating, setRating] = useState(5);
    const [expandedSections, setExpandedSections] = useState({});
    const [showAllReviews, setShowAllReviews] = useState(false);
    const router = useRouter();
    const toggleSection = (sectionKey) => {
        setExpandedSections(prev => ({
            ...prev,
            [sectionKey]: !prev[sectionKey]
        }));
    };

    const renderExpandableContent = (content, sectionKey, maxLength = 200) => {
        if (!content) return null;

        const contentStr = typeof content === 'object' ? JSON.stringify(content) : String(content);
        const isExpanded = expandedSections[sectionKey];

        if (contentStr.length <= maxLength) {
            return <span>{content}</span>;
        }

        return (
            <>
                {isExpanded ? content : `${contentStr.substring(0, maxLength)}...`}
                <button
                    onClick={() => toggleSection(sectionKey)}
                    className="ml-2 text-blue-400 hover:text-blue-300 underline"
                >
                    {isExpanded ? 'Скрыть' : 'Показать полностью'}
                </button>
            </>
        );
    };

    const handleSubmitReview = async () => {
        try {
            const token = localStorage.getItem('access_token');

            if (!token) {
                toast.error('Токен не найден. Пожалуйста, войдите в систему.');
                return;
            }

            const response = await fetch(`https://api.reiting-profi.ru/api/v1/ratings/questionnaire-ratings/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    role: "Медиа",
                    id_questionnaire: questionnaire.id,
                    is_positive: reviewType === 'positive',
                    is_constructive: reviewType === 'constructive',
                    text: reviewText,
                })
            });

            if (response.ok) {
                toast.success('Отзыв отправлен на модерацию');
                setReviewText('');
                setRating(5);
                setShowReviewForm(false);
            } else {
                const errorData = await response.json();

                if (response.status === 401) {
                    toast.error('Ошибка авторизации. Пожалуйста, войдите в систему заново.');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                } else {
                    toast.error(`Ошибка при отправке отзыва: ${errorData.message || 'Неизвестная ошибка'}`);
                }
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            toast.error('Ошибка при отправке отзыва. Проверьте соединение с интернетом.');
        }
    };
    const handleLogout = () => {

        try {
            // Barcha token va ma'lumotlarni o'chirish
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')

            // Session storage ni tozalash
            sessionStorage.clear()

            // Xabar berish
            toast.success('Вы успешно вышли из системы', {
                duration: 2000,
                position: 'top-center'
            })

            // Login sahifasiga yo'naltirish
            setTimeout(() => {
                router.push('/login')
            }, 1000)

        } catch (error) {
            console.error('Ошибка при выходе из системы:', error)
            toast.error('Ошибка при выходе из системы')

            // Xato bo'lsa ham login sahifasiga yo'naltirish
            setTimeout(() => {
                router.push('/login')
            }, 1000)
        }
    }
    if (!questionnaire) {
        return (
            <div className='max-md:px-4'>
                <div className="text-white flex justify-between items-center mt-[0px] max-md:px-0">
                    <button onClick={onBack} className="cursor-pointer max-md:w-8 max-md:h-8">
                        <IoIosArrowBack size={40} className='max-md:w-6 max-md:h-6' />
                    </button>
                    <img src="/icons/logo.svg" alt="a" className='max-md:w-20 w-50' />
                    <div className='max-md:w-8 max-md:h-8'>
                        <img src="/icons/share.svg" alt="a" className='max-md:w-6 max-md:h-6' />
                    </div>
                </div>
                <div className="text-center text-white py-10 max-md:py-6">
                    <p className='max-md:text-sm'>Загрузка...</p>
                </div>
            </div>
        );
    }

    const getSegmentDisplay = (segments) => {
        if (!segments || !Array.isArray(segments)) return '';

        const segmentMap = {
            'economy': 'Эконом',
            'comfort': 'Комфорт',
            'business': 'Бизнес',
            'premium': 'Премиум',
            'horeca': 'Хорека',
            'exclusive': 'Эксклюзив',
            'medium': 'Средний',
        };

        return segments.map(segment => segmentMap[segment] || segment).join(', ');
    };

    const getRepresentativeCities = () => {
        if (!questionnaire.representative_cities) return null;

        try {
            const cities = typeof questionnaire.representative_cities === 'string'
                ? JSON.parse(questionnaire.representative_cities)
                : questionnaire.representative_cities;

            if (Array.isArray(cities) && cities.length > 0) {
                return (
                    <div className="space-y-2">
                        {cities.map((city, index) => (
                            <div key={index} className="border-l-2 border-purple-500 pl-3">
                                <p><strong>Город:</strong> {city.city || 'Не указан'}</p>
                                {city.address && <p><strong>Адрес:</strong> {city.address}</p>}
                                {city.phone && <p><strong>Телефон:</strong> {city.phone}</p>}
                                {city.district && <p><strong>Район:</strong> {city.district}</p>}
                            </div>
                        ))}
                    </div>
                );
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const getBusinessFormDisplay = (businessForm) => {
        if (!businessForm) return 'Не указана';

        const businessFormMap = {
            'own_business': 'Собственный бизнес',
            'franchise': 'Франшиза',
        };

        if (businessForm.includes('(')) {
            const parts = businessForm.split(' (');
            const baseForm = parts[0];
            const additional = parts[1]?.replace(')', '');
            const displayBase = businessFormMap[baseForm] || baseForm;
            return `${displayBase} (${additional})`;
        }

        return businessFormMap[businessForm] || businessForm;
    };

    const getOtherContacts = () => {
        if (!questionnaire.other_contacts) return null;

        try {
            const contacts = typeof questionnaire.other_contacts === 'string'
                ? JSON.parse(questionnaire.other_contacts)
                : questionnaire.other_contacts;

            if (Array.isArray(contacts) && contacts.length > 0) {
                return (
                    <div className="space-y-1">
                        {contacts.map((contact, index) => (
                            <p key={index}>{contact}</p>
                        ))}
                    </div>
                );
            }
            return null;
        } catch (error) {
            return null;
        }
    };

    const displayedReviews = showAllReviews
        ? questionnaire.reviews_list
        : questionnaire.reviews_list?.slice(0, 3) || [];

    return (
        <div className='max-md:px-4 max-w-7xl mx-auto'>
            <div className="text-white flex justify-between items-center mt-[0px] max-md:px-0">
                <button onClick={onBack} className="cursor-pointer max-md:w-8 max-md:h-8 md:w-30">
                    <IoIosArrowBack size={40} className='max-md:w-6 max-md:h-6' />
                </button>
                <img src="/icons/logo.svg" alt="a" className='max-md:w-20 w-50' />
                <div className='max-md:w-8 max-md:h-8 md:w-30' onClick={handleLogout}>
                    <img src="/icons/share.svg" alt="a" className='max-md:w-6 max-md:h-6' />
                </div>
            </div>
            <div className="max-w-xl mx-auto space-y-4 max-md:space-y-3 max-md:mt-2">
                <div className="">
                    <div className="flex mb-6 max-md:mb-3 max-md:flex-col">
                        <div className='w-[120px] h-[100px] card_img flex-shrink-0 overflow-hidden max-md:w-full max-md:h-20'>
                            <div className="w-full h-full rounded-lg flex items-center justify-center">
                                {questionnaire.company_logo ? (
                                    <img
                                        src={questionnaire.company_logo}
                                        alt={questionnaire.brand_name}
                                        className="w-full h-full object-cover rounded-lg"
                                    />
                                ) : (
                                    <div className="w-full h-full card_img rounded-lg flex items-center justify-center">
                                        <span className="text-white text-2xl max-md:text-lg uppercase">
                                            {questionnaire.brand_name ? questionnaire.brand_name.charAt(0) : '?'}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex flex-col border-b border-b-[#FFFFFF91]  pl-12 ml-[-16px] flex-grow max-md:pl-3 max-md:ml-0 max-md:border-b-0 max-md:border-t max-md:pt-3 max-md:mt-2 relative">
                            <h2 className='mb-0.5 text-[#FFFFFF] text-[22px] max-md:text-base'>
                                {questionnaire.brand_name || questionnaire.full_name || 'Медиа пространство'}
                            </h2>
                            <div className='w-[calc(100% + 32px)] h-0.25 bg-[#FFFFFF4F]  ml-[-32px]'></div>
                            <p className='text-[#FFFFFF] uppercase text-sm leading-[100%] mt-3 max-md:text-xs line-clamp-2'>
                                {questionnaire.welcome_message || 'Медиа'}
                            </p>
                            <div className="absolute bottom-1 right-1 text-white">
                                <span className='text-yellow-400'>★</span> {questionnaire?.rating_count?.total || 0}
                            </div>
                        </div>
                    </div>

                    {/* <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF] max-md:text-base max-md:mb-2 max-md:mt-3'>Контактная информация</h2>
                    <div className='text-lg border-y border-[#FFFFFF91] px-2 py-4 text-[#FFFFFF] space-y-2 max-md:text-base max-md:px-1 max-md:py-2 max-md:space-y-1'>
                        <p className='max-md:text-sm'><strong>Бренд:</strong> {questionnaire.brand_name || 'Не указан'}</p>
                        <p className='max-md:text-sm'><strong>ФИО:</strong> {questionnaire.full_name || 'Не указано'}</p>
                        <p className='max-md:text-sm'><strong>Ответственное лицо:</strong> {questionnaire.responsible_person || 'Не указано'}</p>
                        <p className='max-md:text-sm'><strong>Телефон:</strong> {questionnaire.phone || 'Не указан'}</p>
                        <p className='max-md:text-sm'><strong>Email:</strong> {questionnaire.email || 'Не указан'}</p>
                        <p className='max-md:text-sm'><strong>Форма бизнеса:</strong> {getBusinessFormDisplay(questionnaire.business_form)}</p>
                        <p className='max-md:text-sm'><strong>НДС:</strong> {questionnaire.vat_payment_display || 'Не указано'}</p>
                    </div> */}

                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF] max-md:text-base max-md:mb-2 max-md:mt-3'>О медиа пространстве</h2>
                    <div className='space-y-4 max-md:space-y-2'>
                        {questionnaire.activity_description && (
                            <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91] max-md:px-1 max-md:text-sm'>
                                <strong>Деятельность:</strong><br />
                                {renderExpandableContent(questionnaire.activity_description, 'activity_description')}
                            </div>
                        )}

                        {questionnaire.welcome_message && (
                            <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91] max-md:px-1 max-md:text-sm'>
                                <strong>Приветственное сообщение:</strong><br />
                                {renderExpandableContent(questionnaire.welcome_message, 'welcome_message')}
                            </div>
                        )}

                        {questionnaire.cooperation_terms && (
                            <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91] max-md:px-1 max-md:text-sm'>
                                <strong>Условия сотрудничества:</strong><br />
                                {renderExpandableContent(questionnaire.cooperation_terms, 'cooperation_terms')}
                            </div>
                        )}

                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91] max-md:px-1 max-md:text-sm'>
                            <strong>Сегменты для публикации:</strong><br />
                            {getSegmentDisplay(questionnaire.segments)}
                        </div>
                    </div>


                    <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF] max-md:text-base max-md:mb-2 max-md:mt-3'>Социальные сети</h2>
                    <div className='space-y-4 max-md:space-y-2'>
                        {questionnaire.other_contacts && questionnaire.other_contacts.length > 0 ? (
                            <div className='text-[#FFFFFF] px-2 py-2 space-y-2 border-b border-[#FFFFFF91] max-md:text-sm max-md:px-1 max-md:space-y-1'>
                                {questionnaire.other_contacts.map((contact, index) => {
                                    try {
                                        // JSON stringini parse qilish
                                        let contactObj;
                                        if (typeof contact === 'string') {
                                            // String ichidagi qo'shtirnoqlarni to'g'rilash
                                            const fixedString = contact.replace(/'/g, '"');
                                            contactObj = JSON.parse(fixedString);
                                        } else {
                                            contactObj = contact;
                                        }

                                        const { type, value } = contactObj;

                                        // Type bo'yicha label aniqlash
                                        const getLabel = (type) => {
                                            const labels = {
                                                vk: 'VK',
                                                instagram: 'Instagram',
                                                telegram: 'Telegram',
                                                telegram_channel: 'Telegram канал',
                                                pinterest: 'Pinterest',
                                                website: 'Website',
                                                facebook: 'Facebook',
                                                youtube: 'YouTube',
                                                tiktok: 'TikTok'
                                            };
                                            return labels[type] || type;
                                        };

                                        return (
                                            <p key={index} className='max-md:text-sm'>
                                                <strong>{getLabel(type)}:</strong> {value}
                                            </p>
                                        );
                                    } catch (error) {
                                        // Agar parse qilishda xatolik bo'lsa, oddiy ko'rsatish
                                        return (
                                            <p key={index} className='max-md:text-sm'>
                                                <strong>Контакт:</strong> {typeof contact === 'string' ? contact : JSON.stringify(contact)}
                                            </p>
                                        );
                                    }
                                })}
                            </div>
                        ) : (
                            <div className='text-[#FFFFFF] px-2 py-2 space-y-2 border-b border-[#FFFFFF91] max-md:text-sm max-md:px-1 max-md:space-y-1'>
                                <p className='max-md:text-sm'>Контакты не указаны</p>
                            </div>
                        )}
                    </div>

                    {questionnaire.additional_info && (
                        <>
                            <h2 className='mt-4 mb-4 text-center text-lg text-[#FFFFFF] max-md:text-base max-md:mb-2 max-md:mt-3'>Дополнительная информация</h2>
                            <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91] max-md:text-sm max-md:px-1'>
                                {renderExpandableContent(questionnaire.additional_info, 'additional_info')}
                            </div>
                        </>
                    )}

                    {/* Reviews Section */}
                    <div className='mt-8 text-[#FFFFFF] px-2 py-4 border-b border-[#FFFFFF91] max-md:mt-4'>
                        <div
                            className="flex gap-x-4 cursor-pointer hover:opacity-80"
                            onClick={() => setShowReviewForm(!showReviewForm)}
                        >
                            <h3 className='text-lg font-semibold max-md:text-base'>ОТЗЫВЫ:</h3>
                            <div className='flex items-center gap-x-5 max-md:gap-x-3'>
                                <p className='max-md:text-sm'>
                                    <span className='text-yellow-400'>★</span> Положительных: {questionnaire.rating_count?.positive || 0}
                                </p>
                                <p className='max-md:text-sm'>
                                    <span className='text-gray-400'>☆</span> Конструктивных: {questionnaire.rating_count?.constructive || 0}
                                </p>
                            </div>
                        </div>

                        {!showReviewForm && displayedReviews.length > 0 && (
                            <>
                                {displayedReviews.map((review, index) => (
                                    <div key={index} className='mt-4 border-b border-[#FFFFFF40] pb-3'>
                                        <div className='flex items-center mb-2'>
                                            <span className='text-yellow-400 mr-2'>
                                                {review.is_positive ? '★' : '☆'}
                                            </span>
                                            <span className='text-sm text-[#FFFFFFCC] max-md:text-xs'>
                                                {review.reviewer_phone || 'Аноним'}
                                            </span>
                                            <span className='text-xs text-[#FFFFFF80] ml-2'>
                                                ({review.status_display})
                                            </span>
                                        </div>
                                        <p className='text-[#FFFFFFCC] text-sm pl-6 max-md:text-xs max-md:pl-4'>
                                            {review.text}
                                        </p>
                                    </div>
                                ))}

                                {questionnaire.reviews_list && questionnaire.reviews_list.length > 3 && (
                                    <button
                                        onClick={() => setShowAllReviews(!showAllReviews)}
                                        className="mt-4 text-blue-400 hover:text-blue-300 underline max-md:text-sm"
                                    >
                                        {showAllReviews ? 'Скрыть' : `Показать все отзывы (${questionnaire.reviews_list.length})`}
                                    </button>
                                )}
                            </>
                        )}

                        {/* Review Form */}
                        {showReviewForm && (
                            <div className='mt-6 space-y-4 border-t border-[#FFFFFF40] pt-4 max-md:mt-4 max-md:space-y-3'>
                                <h4 className='text-md font-semibold max-md:text-sm'>Оставить отзыв:</h4>

                                {/* Review Type Selection */}
                                <div className='flex gap-x-6 max-md:gap-x-4'>
                                    <label className='flex items-center gap-x-2 cursor-pointer max-md:text-sm'>
                                        <input
                                            type='radio'
                                            name='reviewType'
                                            value='positive'
                                            checked={reviewType === 'positive'}
                                            onChange={(e) => setReviewType(e.target.value)}
                                            className='w-4 h-4'
                                        />
                                        <span className='text-yellow-400'>★</span>
                                        <span>Положительный</span>
                                    </label>
                                    <label className='flex items-center gap-x-2 cursor-pointer max-md:text-sm'>
                                        <input
                                            type='radio'
                                            name='reviewType'
                                            value='constructive'
                                            checked={reviewType === 'constructive'}
                                            onChange={(e) => setReviewType(e.target.value)}
                                            className='w-4 h-4'
                                        />
                                        <span className='text-gray-400'>☆</span>
                                        <span>Конструктивный</span>
                                    </label>
                                </div>

                                {/* Text Area */}
                                <textarea
                                    value={reviewText}
                                    onChange={(e) => setReviewText(e.target.value)}
                                    placeholder='Напишите ваш отзыв...'
                                    className='w-full h-32 px-4 py-2 bg-[#FFFFFF20] text-white rounded-lg border border-[#FFFFFF40] focus:outline-none focus:border-[#FFFFFF80] resize-none max-md:text-sm max-md:h-24'
                                />

                                {/* Submit Button */}
                                <div className='flex gap-x-4'>
                                    <button
                                        onClick={handleSubmitReview}
                                        disabled={!reviewText.trim()}
                                        className='px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors max-md:px-4 max-md:py-1.5 max-md:text-sm'
                                    >
                                        Отправить
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowReviewForm(false);
                                            setReviewText('');
                                            setRating(5);
                                        }}
                                        className='px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors max-md:px-4 max-md:py-1.5 max-md:text-sm'
                                    >
                                        Отмена
                                    </button>
                                </div>

                                {/* Info Text */}
                                <p className='text-xs text-[#FFFFFF80] mt-4'>
                                    Кто оставил: 1 пользователь может оставить только 1 комментарий, при необходимости он может его удалить и оставить новый. Отзывы могут оставлять все рубрики.
                                </p>
                            </div>
                        )}
                    </div>


                </div>
            </div>
            <div className="relative w-full max-w-[1200px] mx-auto mt-[79px] max-md:mt-8 mb-[64px] max-md:mb-8 flex justify-center max-md:px-4">
                <Link href={'/userinfo'}>
                    <div className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-[50px] hidden sm:block">
                        ★
                    </div>
                </Link>
            </div>
        </div>
    )
}