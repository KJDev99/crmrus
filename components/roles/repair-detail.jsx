'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast';
import { IoIosArrowBack } from 'react-icons/io'

export default function RepairDetail({ questionnaire, onBack }) {
    const [activeTab, setActiveTab] = useState('company'); // 'company' or 'cooperation'
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewType, setReviewType] = useState('positive'); // 'positive' or 'constructive'
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
    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText('https://reiting-profi.ru/');
            toast.success('Ссылка скопирована!');
        } catch (err) {
            toast.error('Ошибка при копировании');
        }
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
                alert('Токен не найден. Пожалуйста, войдите в систему.');
                return;
            }

            const response = await fetch(`https://api.reiting-profi.ru/api/v1/ratings/questionnaire-ratings/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
                body: JSON.stringify({
                    role: "Ремонт",
                    id_questionnaire: questionnaire.id,
                    is_positive: reviewType === 'positive',
                    is_constructive: reviewType === 'constructive',
                    text: reviewText,
                    rating: rating
                })
            });

            console.log('Response status:', response.status);

            if (response.ok) {
                const result = await response.json();
                console.log('Success response:', result);
                toast('Отзыв отправлен на модерацию');
                setReviewText('');
                setRating(5);
                setShowReviewForm(false);
            } else {
                const errorData = await response.json();
                console.error('Error response:', errorData);

                if (response.status === 401) {
                    alert('Ошибка авторизации. Пожалуйста, войдите в систему заново.');
                    localStorage.removeItem('access_token');
                    localStorage.removeItem('accessToken');
                    localStorage.removeItem('refreshToken');
                    window.location.href = '/login';
                } else {
                    alert(`Ошибка при отправке отзыва: ${errorData.message || 'Неизвестная ошибка'}`);
                }
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Ошибка при отправке отзыва. Проверьте соединение с интернетом.');
        }
    };

    if (!questionnaire) {
        return (
            <div className='max-md:px-4'>
                <div className="text-white flex justify-between items-center mt-[0px] max-md:px-0">
                    <button onClick={onBack} className="cursor-pointer max-md:w-8 max-md:h-8">
                        <IoIosArrowBack size={40} className='max-md:w-6 max-md:h-6' />
                    </button>
                    <img src="/icons/logo22.svg" alt="a" className='max-md:w-20 w-40 mb-5' />
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

    const getAboutValue = (type) => {
        const item = questionnaire.about_company?.find(item => item.type === type);
        if (!item) return null;

        if (type === 'social_networks') {
            const socialData = item.value;

            const socialMediaOptions = [
                { value: 'vk', label: 'ВК' },
                { value: 'telegram', label: 'Телеграм' },
                { value: 'pinterest', label: 'Пинтерест' },
                { value: 'instagram', label: 'Инстаграм' },
                { value: 'website', label: 'Веб-сайт' },
                { value: 'other', label: 'Другое' }
            ];

            if (socialData && Array.isArray(socialData.other_contacts)) {
                return (
                    <div className="space-y-0">
                        {socialData.other_contacts.map((contactStr, index) => {
                            try {
                                const fixedJson = contactStr.replace(/'/g, '"');
                                const contact = JSON.parse(fixedJson);

                                // value bo'yicha label topamiz, topilmasa type o'zi
                                const label = socialMediaOptions.find(opt => opt.value === contact.type)?.label || contact.type;

                                return (
                                    <div key={index} className="flex max-md:mb-2 md:gap-2 md:items-center max-md:flex max-md:flex-col">
                                        <span className="font-bold uppercase text-xs px-px rounded">
                                            {label}:
                                        </span>
                                        <a className='underline max-md:line-clamp-1' href={contact.value} target='_blank'>{contact.value}</a>
                                    </div>
                                );
                            } catch (e) {
                                console.error("Parsing error:", e);
                                return <div key={index}>{contactStr}</div>;
                            }
                        })}
                    </div>
                );
            }
        }
        if (type === 'office_addresses') {
            return Array.isArray(item.value) ? item.value.join(', ') : item.value;
        }

        return item.value;
    };
    const getTermValue = (type) => {
        const item = questionnaire.terms_of_cooperation?.find(item => item.type === type);
        return item?.value || null;
    };

    const getCategoryDisplay = () => {
        const categoryMap = {
            'turnkey': 'Под ключ',
            'rough_works': 'Черновые работы',
            'finishing_works': 'Чистовые работы',
            'plumbing_tiles': 'Сантехника и плитка',
            'floor': 'Полы',
            'walls': 'Стены',
            'rooms_turnkey': 'Комнаты под ключ',
            'electrical': 'Электрика',
            'all': 'Все виды работ',
        };
        return categoryMap[questionnaire.group] || questionnaire.group;
    };

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

    const displayedReviews = showAllReviews
        ? questionnaire.reviews_list
        : questionnaire.reviews_list.slice(0, 3);

    return (
        <div className='max-md:px-4 relative'>
            <div className="text-white flex justify-between items-center mt-[0px] max-md:px-0 mb-5">
                <button onClick={onBack} className="cursor-pointer max-md:w-8 max-md:h-8 md:w-30">
                    <IoIosArrowBack size={40} className='max-md:w-6 max-md:h-6' />
                </button>
                <img src="/icons/logo22.svg" alt="a" className='max-md:w-20 w-40 ' />
                <Toaster position="top-center" />
                <div
                    className='max-md:w-8 max-md:h-8 md:w-30 flex justify-end cursor-pointer'
                    onClick={handleShare}
                >
                    <img src="/icons/share.svg" alt="share" className='max-md:w-6 max-md:h-6' />
                </div>
            </div>

            <div className="max-w-xl mx-auto space-y-6">
                <div className="">
                    <div className="flex mb-0">
                        <div className='w-[125px] h-[100px] card_img flex-shrink-0 overflow-hidden'>
                            {questionnaire.company_logo ? (
                                <img
                                    src={questionnaire.company_logo}
                                    alt={questionnaire.brand_name}
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="w-full h-full card_img rounded-lg flex items-center justify-center">
                                    <span className="text-white text-2xl uppercase">
                                        {questionnaire.brand_name ? questionnaire.brand_name.charAt(0) : '?'}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col border-b border-b-[#FFFFFF91] pl-12 ml-[-16px] flex-grow relative">
                            <h2 className='mb-0.5 text-[#FFFFFF] text-[25px] max-md:text-[20px]'>
                                {questionnaire.brand_name || questionnaire.full_name || 'Название организации'}
                            </h2>
                            <div className='w-[calc(100% + 32px)] h-0.25 bg-[#FFFFFF4F] ml-[-32px]'></div>
                            <p className='text-[#FFFFFF] text-sm mt-1 pr-10 leading-[100%]'>
                                Сегменты: {getSegmentDisplay(questionnaire.segments)}
                            </p>
                            <div className="absolute bottom-1 right-1 text-white">
                                <span className='text-yellow-400'>★</span> {questionnaire?.rating_count?.total || 0}
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className='mt-0'>
                        <div className='flex border-b border-[#FFFFFF91]'>
                            <button
                                onClick={() => setActiveTab('company')}
                                className={`px-4 py-2 text-center text-[19px] text-[#FFFFFF] transition-all border-r ${activeTab === 'company' ? '' : 'opacity-60'}`}
                            >
                                О компании
                            </button>
                            <button
                                onClick={() => setActiveTab('cooperation')}
                                className={`flex-1 py-2 text-center text-[19px] text-[#FFFFFF] transition-all ${activeTab === 'cooperation' ? '' : 'opacity-60'}`}
                            >
                                Условия сотрудничества
                            </button>
                        </div>

                        {/* Tab Content — o'zgarishsiz qoladi */}
                        <div className='mt-2'>
                            {activeTab === 'company' && (
                                <div className='space-y-2'>
                                    {getAboutValue('company_description') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <p className='text-[19px] uppercase'>Описание компании: &nbsp;  </p>
                                            <p className='leading-[100%]'>
                                                {renderExpandableContent(getAboutValue('company_description'), 'company_description')}
                                            </p>
                                        </div>
                                    )}
                                    {questionnaire.phone && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <span className='text-[19px] uppercase'>Телефон: &nbsp;</span>
                                            <span className='leading-[100%]'>{questionnaire.phone}</span>
                                        </div>
                                    )}
                                    {questionnaire.email && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <span className='text-[19px] uppercase'>Email: &nbsp;</span>
                                            <span className='leading-[100%]'>{questionnaire.email}</span>
                                        </div>
                                    )}
                                    {getAboutValue('service_packages') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <p className='text-[19px] uppercase'>Пакеты услуг и их стоимость: &nbsp;</p>
                                            <p className='leading-[100%]'>
                                                {renderExpandableContent(getAboutValue('service_packages'), 'service_packages')}
                                            </p>
                                        </div>
                                    )}
                                    {getAboutValue('services_list') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <p className='text-[19px] uppercase'>Перечень услуг: &nbsp;</p>
                                            <span className='leading-[100%]'>
                                                {renderExpandableContent(getAboutValue('services_list'), 'services_list')}
                                            </span>
                                        </div>
                                    )}
                                    {getAboutValue('promotions_utp') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <span className='text-[19px] uppercase'>Акции и УТП: &nbsp;</span>
                                            <span className='leading-[100%]' style={{ whiteSpace: 'pre-line' }}>
                                                {renderExpandableContent(getAboutValue('promotions_utp'), 'promotions_utp')}
                                            </span>
                                        </div>
                                    )}
                                    {getAboutValue('contract_guarantees') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <p className='text-[19px] uppercase'>Условия договора и гарантии: &nbsp;</p>
                                            <span className='leading-[100%]' style={{ whiteSpace: 'pre-line' }}>
                                                {renderExpandableContent(getAboutValue('contract_guarantees'), 'contract_guarantees')}
                                            </span>
                                        </div>
                                    )}
                                    {questionnaire.representative_cities && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <p className='text-[19px] uppercase'>Адреса офисов: &nbsp;</p>
                                            <span className='leading-[100%]' style={{ whiteSpace: 'pre-line' }}>
                                                {questionnaire.representative_cities.map((item, index) => (
                                                    <span key={index} className='block'>{item}</span>
                                                ))}
                                            </span>
                                        </div>
                                    )}
                                    {questionnaire.work_format && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <p className='text-[19px] uppercase'>Формат работы: &nbsp;</p>
                                            <span className='leading-[100%]'>
                                                {renderExpandableContent(questionnaire.work_format)}
                                            </span>
                                        </div>
                                    )}
                                    {questionnaire.speed_of_execution?.length > 0 && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <span className='text-[19px] uppercase'>Сроки поставки: &nbsp;</span>
                                            <span className='leading-[100%]'>
                                                {questionnaire.speed_of_execution.map((item, index) => (
                                                    <span key={index} className='block'>{item}</span>
                                                ))}
                                            </span>
                                        </div>
                                    )}
                                    {getAboutValue('welcome_message') && (
                                        <div className='text-[#FFFFFF] px-2 py-2'>
                                            <p className='text-[19px] uppercase'>Приветственное сообщение:</p>
                                            {renderExpandableContent(getAboutValue('welcome_message'), 'welcome_message')}
                                        </div>
                                    )}
                                    {getAboutValue('years_in_profession') && (
                                        <div className='text-[#FFFFFF] px-2 py-2'>
                                            <p className='text-[19px] uppercase'>Сколько лет в профессии:</p>
                                            {getAboutValue('years_in_profession')}
                                        </div>
                                    )}
                                    {getAboutValue('geography') && (
                                        <div className='text-[#FFFFFF] px-2 py-2'>
                                            <p className='text-[19px] uppercase'>География:</p>
                                            {renderExpandableContent(getAboutValue('geography'), 'geography')}
                                        </div>
                                    )}
                                    {getAboutValue('social_networks') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <p className='text-[19px] uppercase'>Социальные сети:</p>
                                            <span className='leading-[100%]'>
                                                {getAboutValue('social_networks')}
                                            </span>
                                        </div>
                                    )}
                                    {getAboutValue('video_content') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <p className='text-[19px] uppercase'>Видео:</p>
                                            {renderExpandableContent(getAboutValue('video_content'), 'video_content')}
                                        </div>
                                    )}
                                </div>
                            )}

                            {activeTab === 'cooperation' && (
                                <div className='space-y-4'>
                                    {getTermValue('project_periods') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <p className='text-[19px] uppercase'>В какие периоды осуществляется выполнение проекта: &nbsp;</p>
                                            {renderExpandableContent(getTermValue('project_periods'), 'project_periods')}
                                        </div>
                                    )}
                                    {getTermValue('repair_periods') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <span className='text-[19px] uppercase'>Сроки ремонта: &nbsp;</span><br />
                                            <span className='leading-[100%]' style={{ whiteSpace: 'pre-line' }}>
                                                {renderExpandableContent(getTermValue('repair_periods'), 'repair_periods')}
                                            </span>
                                        </div>
                                    )}
                                    {getTermValue('vat_payment') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <span className='text-[19px] uppercase'>НДС: &nbsp;</span>
                                            <span className='leading-[100%]' style={{ whiteSpace: 'pre-line' }}>
                                                {getTermValue('vat_payment')}
                                            </span>
                                        </div>
                                    )}
                                    {getTermValue('guarantees') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <p className='text-[19px] uppercase'>Гарантии: &nbsp;</p>
                                            <span style={{ whiteSpace: 'pre-line' }}>
                                                {renderExpandableContent(getTermValue('guarantees'), 'guarantees')}
                                            </span>
                                        </div>
                                    )}
                                    {getTermValue('other_cities_terms') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <span className='text-[19px] uppercase'>Условия работы с другими городами: &nbsp;</span>
                                            <span className='leading-[100%]'>
                                                {renderExpandableContent(getTermValue('other_cities_terms'), 'other_cities_terms')}
                                            </span>
                                        </div>
                                    )}
                                    {getTermValue('magazine_cards') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <span className='text-[19px] uppercase'>Карточки журнала: &nbsp;</span>
                                            <span className='leading-[100%]'>{getTermValue('magazine_cards')}</span>
                                        </div>
                                    )}
                                    {getTermValue('designer_supplier_terms') && (
                                        <div className='text-[#FFFFFF] px-2 py-2 border-b border-[#FFFFFF91]'>
                                            <span className='text-[19px] uppercase'>Условия работы с учетом рекомендации: &nbsp;</span><br />
                                            <span className='leading-[100%]' style={{ whiteSpace: 'pre-line' }}>
                                                {renderExpandableContent(getTermValue('designer_supplier_terms'), 'designer_supplier_terms')}
                                            </span>
                                        </div>
                                    )}

                                    {/* Reviews Section */}
                                    <div className='mt-0 text-[#FFFFFF] px-2 py-4 border-b border-[#FFFFFF91]'>
                                        <div
                                            className="flex gap-x-4 cursor-pointer hover:opacity-80 max-md:flex-col"
                                            onClick={() => setShowReviewForm(!showReviewForm)}
                                        >
                                            <h3 className='text-[19px] uppercase'>ОТЗЫВЫ:</h3>
                                            <div className='flex items-center gap-x-5 lowercase'>
                                                <p className='text-nowrap'>
                                                    <span className='text-yellow-400'>★</span> Положительных: {questionnaire.rating_count?.positive || 0}
                                                </p>
                                                <p className='text-nowrap'>
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
                                                            <span className='text-sm text-[#FFFFFFCC]'>
                                                                {review.reviewer_name || review.reviewer_company_name || ''}
                                                            </span>
                                                            <span className='text-xs text-[#FFFFFF80] ml-2'>
                                                                ({review.status_display})
                                                            </span>
                                                        </div>
                                                        <p className='text-[#FFFFFFCC] text-sm pl-6'>{review.text}</p>
                                                    </div>
                                                ))}
                                                {questionnaire.reviews_list.length > 3 && (
                                                    <button
                                                        onClick={() => setShowAllReviews(!showAllReviews)}
                                                        className="mt-4 text-blue-400 hover:text-blue-300 underline"
                                                    >
                                                        {showAllReviews ? 'Скрыть' : `Показать все отзывы (${questionnaire.reviews_list.length})`}
                                                    </button>
                                                )}
                                            </>
                                        )}

                                        {showReviewForm && (
                                            <div className='mt-6 space-y-2 border-t border-[#FFFFFF40] pt-4'>
                                                <h4 className='text-md'>Оставить отзыв:</h4>
                                                <div className='flex gap-x-6'>
                                                    <label className='flex items-center gap-x-2 cursor-pointer'>
                                                        <input type='radio' name='reviewType' value='positive'
                                                            checked={reviewType === 'positive'}
                                                            onChange={(e) => setReviewType(e.target.value)}
                                                            className='w-4 h-4' />
                                                        <span className='text-yellow-400'>★</span>
                                                        <span className='lowercase'>Положительный</span>
                                                    </label>
                                                    <label className='flex items-center gap-x-2 cursor-pointer'>
                                                        <input type='radio' name='reviewType' value='constructive'
                                                            checked={reviewType === 'constructive'}
                                                            onChange={(e) => setReviewType(e.target.value)}
                                                            className='w-4 h-4' />
                                                        <span className='text-gray-400'>☆</span>
                                                        <span className='lowercase'>Конструктивный</span>
                                                    </label>
                                                </div>
                                                <textarea
                                                    value={reviewText}
                                                    onChange={(e) => setReviewText(e.target.value)}
                                                    placeholder='Напишите ваш отзыв...'
                                                    className='w-full h-32 px-4 py-2 bg-[#FFFFFF20] text-white rounded-lg border border-[#FFFFFF40] focus:outline-none focus:border-[#FFFFFF80] resize-none'
                                                />
                                                <div className='flex gap-x-4'>
                                                    <button
                                                        onClick={handleSubmitReview}
                                                        disabled={!reviewText.trim()}
                                                        className='px-6 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors'
                                                    >
                                                        Отправить
                                                    </button>
                                                    <button
                                                        onClick={() => { setShowReviewForm(false); setReviewText(''); setRating(5); }}
                                                        className='px-6 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors'
                                                    >
                                                        Отмена
                                                    </button>
                                                </div>
                                                <p className='text-xs text-[#FFFFFF80] mt-4'></p>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-20 right-0">
                <Link href={'/userinfo'}>
                    <div className="absolute right-2 sm:right-0 top-1/2 -translate-y-1/2 text-white text-3xl sm:text-[50px] hidden sm:block">
                        ★
                    </div>
                </Link>
            </div>
        </div>
    )
}