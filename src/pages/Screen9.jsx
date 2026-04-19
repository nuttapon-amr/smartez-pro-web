import React, { useState, useEffect, useRef, useCallback } from 'react';
import { Typography, Card, Spin, Row, Col, Divider, Tag, Empty, Button, Modal, Rate, Input, message, DatePicker } from 'antd';
import {
    ThunderboltFilled,
    ClockCircleOutlined,
    EnvironmentFilled,
    CalendarOutlined,
    RightOutlined,
    HistoryOutlined,
    StarOutlined,
    StarFilled,
    CheckCircleFilled
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { useTranslation } from 'react-i18next';
import dayjs from 'dayjs';
import 'dayjs/locale/th';
import locale from 'antd/es/date-picker/locale/th_TH';
import en_locale from 'antd/es/date-picker/locale/en_US';
import {
    SWAP_HISTORY_PREVIOUS,
    SWAP_HISTORY_TODAY,
    getBillingOption,
    getMockUserEntitlement,
    getMoreSwapHistory
} from '../data/mockSwapData';

const { Title, Text } = Typography;

const HistoryItem = ({
    stationName,
    cabinetName,
    pickupSlot,
    startTime,
    endTime,
    energy,
    duration,
    purchasedDuration,
    isFeedbackDone,
    onGiveFeedback,
}) => {
    const { t } = useTranslation();
    return (
        <Card
            style={{
                borderRadius: '24px',
                marginBottom: '16px',
                border: '1px solid #f1f5f9',
                boxShadow: '0 4px 12px rgba(0,0,0,0.02)',
                cursor: 'pointer'
            }}
            styles={{ body: { padding: '20px' } }}
            onClick={() => { }} // Could navigate to a detailed receipt if exists
        >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                    <div style={{
                        width: '44px',
                        height: '44px',
                        borderRadius: '14px',
                        backgroundColor: '#fee2e2',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexShrink: 0
                    }}>
                        <ThunderboltFilled style={{ color: '#EF4444', fontSize: '20px' }} />
                    </div>
                    <div>
                        <Title level={5} style={{ margin: 0, fontSize: '15px', color: '#1e293b' }}>{stationName}</Title>
                        <Text type="secondary" style={{ fontSize: '12px' }}>{cabinetName} • {t('screen6.connector_no')} #{pickupSlot}</Text>
                    </div>
                </div>
                <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '4px', alignItems: 'flex-end' }}>
                    <Tag color="success" style={{ margin: 0, borderRadius: '6px', fontSize: '10px', border: 'none', fontWeight: 700 }}>{t('history.success')}</Tag>
                    {isFeedbackDone && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                            <StarFilled style={{ color: '#facc15', fontSize: '12px' }} />
                            <Text style={{ fontSize: '10px', fontWeight: 600, color: '#94a3b8' }}>{t('screen8.feedback_status_done')}</Text>
                        </div>
                    )}
                </div>
            </div>

            <Divider style={{ margin: '0 0 16px 0', borderStyle: 'dashed', opacity: 0.6 }} />

            <Row gutter={[16, 16]}>
                <Col span={12}>
                    <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '2px' }}>{t('screen6.energy_delivered')}</Text>
                    <Text strong style={{ fontSize: '14px', color: '#1e293b' }}>{energy}<span style={{ fontSize: '11px', fontWeight: 'normal' }}>%</span></Text>
                </Col>
                <Col span={12} style={{ textAlign: 'right' }}>
                    <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '2px' }}>{t('screen6.duration')}</Text>
                    <Text strong style={{ fontSize: '14px', color: '#1e293b' }}>{duration}</Text>
                </Col>

                <Col span={24}>
                    <div style={{ background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Text type="secondary" style={{ fontSize: '11px' }}>{t('history.purchased_duration')}</Text>
                            <Text strong style={{ fontSize: '12px', color: '#EF4444' }}>{purchasedDuration}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <Text type="secondary" style={{ fontSize: '11px' }}>{t('history.start_time')}</Text>
                            <Text strong style={{ fontSize: '12px', color: '#475569' }}>{startTime}</Text>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <Text type="secondary" style={{ fontSize: '11px' }}>{t('history.end_time')}</Text>
                            <Text strong style={{ fontSize: '12px', color: '#475569' }}>{endTime}</Text>
                        </div>
                    </div>
                </Col>
            </Row>

            <div style={{ marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {isFeedbackDone ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                        <CheckCircleFilled style={{ color: '#10b981', fontSize: '14px' }} />
                        <Text style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>
                            {t('screen8.feedback_status_done')}
                        </Text>
                    </div>
                ) : (
                    <Button
                        type="link"
                        size="small"
                        icon={<StarOutlined />}
                        onClick={(e) => {
                            e.stopPropagation();
                            onGiveFeedback();
                        }}
                        style={{ padding: 0, height: 'auto', fontSize: '12px', color: '#facc15', fontWeight: 700 }}
                    >
                        {t('screen8.give_feedback')}
                    </Button>
                )}

                <div
                    style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                        cursor: 'pointer'
                    }}
                    onClick={(e) => {
                        e.stopPropagation();
                        window.location.hash = '#/screen10';
                    }}
                >
                    <Text style={{ fontSize: '12px', color: '#EF4444', fontWeight: '700' }}>{t('screen8.view_receipt')}</Text>
                    <RightOutlined style={{ fontSize: '11px', color: '#EF4444' }} />
                </div>
            </div>
        </Card>
    );
};

const GroupTitle = ({ children }) => (
    <div style={{ padding: '8px 4px', marginBottom: '12px' }}>
        <Text strong style={{ color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '1px' }}>{children}</Text>
    </div>
);

const Screen8 = () => {
    const { t, i18n } = useTranslation();
    const [isMoreLoading, setIsMoreLoading] = useState(false);
    const [hasMore, setHasMore] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [loadCount, setLoadCount] = useState(0);
    const loadMoreRef = useRef(null);


    const isFetching = useRef(false);

    const [isFeedbackModalOpen, setIsFeedbackModalOpen] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [dateRange, setDateRange] = useState([
        dayjs().subtract(7, 'day'),
        dayjs().subtract(1, 'day')
    ]);

    const getSelectedSwapPackageLabel = () => {
        const activeBillingOptionId = localStorage.getItem('activeBillingOptionId');
        const entitlement = getMockUserEntitlement();
        const billingOptionId = activeBillingOptionId || entitlement.billingOptionId;

        if (!billingOptionId) return t('billing.no_active_plan');

        const billingOption = getBillingOption(billingOptionId);
        return t(billingOption.titleKey);
    };

    const selectedSwapPackageLabel = getSelectedSwapPackageLabel();

    const [history, setHistory] = useState(() => SWAP_HISTORY_PREVIOUS);

    const [todaySessions, setTodaySessions] = useState(() => SWAP_HISTORY_TODAY);

    useEffect(() => {
        document.title = `${t('screen8.title')} | AMR Battery Swap`;
        dayjs.locale(i18n.language);
        const timer = setTimeout(() => setIsLoading(false), 1000);
        return () => clearTimeout(timer);
    }, [i18n.language, t]);

    const handleGiveFeedback = (item) => {
        setSelectedItem(item);
        setRating(0);
        setComment('');
        setIsFeedbackModalOpen(true);
    };

    const handleSubmitFeedback = () => {
        if (rating === 0) {
            message.warning(t('screen6.feedback_title'));
            return;
        }

        // Update the item in state
        const updateItem = (list) => list.map(item =>
            item.id === selectedItem.id ? { ...item, isFeedbackDone: true } : item
        );

        setTodaySessions(updateItem(todaySessions));
        setHistory(updateItem(history));

        message.success(t('screen6.feedback_submitted'));
        setIsFeedbackModalOpen(false);
    };

    const handleLoadMore = useCallback(() => {
        if (isFetching.current || !hasMore) return;

        setIsMoreLoading(true);
        isFetching.current = true;

        setTimeout(() => {
            const nextBatch = getMoreSwapHistory(loadCount);

            setHistory(prev => [...prev, ...nextBatch]);
            setLoadCount(prev => prev + 1);
            setIsMoreLoading(false);
            isFetching.current = false;

            if (loadCount >= 2) {
                setHasMore(false);
            }
        }, 800);
    }, [loadCount, hasMore]);
    useEffect(() => {
        const observerTarget = loadMoreRef.current;
        const observer = new IntersectionObserver(
            (entries) => {
                if (entries[0].isIntersecting && hasMore && !isFetching.current) {
                    handleLoadMore();
                }
            },
            {
                threshold: 0.1,
                rootMargin: '50px'
            }
        );

        if (observerTarget) {
            observer.observe(observerTarget);
        }

        return () => {
            if (observerTarget) {
                observer.unobserve(observerTarget);
            }
            observer.disconnect();
        };
    }, [hasMore, handleLoadMore]);


    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <MobileLayout>
            <div style={{ background: '#f8fafc', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                <Header title={t('screen8.title')} />

                <div style={{ padding: '0 20px 24px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                    {todaySessions.length > 0 && (
                        <div style={{ marginBottom: '24px' }}>
                            <GroupTitle>{t('screen8.today')}</GroupTitle>
                            {todaySessions.map((item) => (
                                <HistoryItem
                                    key={item.id}
                                    {...item}
                                    purchasedDuration={selectedSwapPackageLabel}
                                    onGiveFeedback={() => handleGiveFeedback(item)}
                                />
                            ))}
                        </div>
                    )}

                    <div style={{ marginBottom: '12px' }}>
                        <GroupTitle>{t('screen8.history')}</GroupTitle>
                        <DatePicker.RangePicker
                            style={{
                                width: '100%',
                                borderRadius: '12px',
                                padding: '10px',
                                background: 'white',
                                border: '1px solid #e2e8f0'
                            }}
                            format="DD MMM YYYY"
                            allowClear={false}
                            locale={i18n.language === 'th' ? locale : en_locale}
                            value={dateRange}
                            onChange={(dates) => setDateRange(dates)}
                            placeholder={[t('common.start_date') || 'Start Date', t('common.end_date') || 'End Date']}
                        />
                    </div>

                    {history.length > 0 ? (
                        <div>
                            {history.map((item) => (
                                <HistoryItem
                                    key={item.id}
                                    {...item}
                                    purchasedDuration={selectedSwapPackageLabel}
                                    onGiveFeedback={() => handleGiveFeedback(item)}
                                />
                            ))}

                            {hasMore ? (
                                <div ref={loadMoreRef} style={{ textAlign: 'center', marginTop: '16px', paddingBottom: '20px' }}>
                                    {isMoreLoading ? (
                                        <>
                                            <Spin />
                                            <div style={{ marginTop: '8px' }}>
                                                <Text type="secondary" style={{ fontSize: '13px' }}>{t('common.loading')}</Text>
                                            </div>
                                        </>
                                    ) : (
                                        <Button
                                            onClick={handleLoadMore}
                                            style={{
                                                borderRadius: '20px',
                                                padding: '0 24px',
                                                height: '40px',
                                                fontWeight: 600,
                                                color: '#64748b',
                                                borderColor: '#cbd5e1'
                                            }}
                                        >
                                            {t('screen8.load_more')}
                                        </Button>
                                    )}
                                </div>
                            ) : (
                                <div style={{
                                    textAlign: 'center',
                                    marginTop: '32px',
                                    paddingBottom: '40px',
                                    borderTop: '1px solid #f1f5f9',
                                    paddingTop: '24px'
                                }}>
                                    <Text type="secondary" style={{ fontSize: '13px', color: '#94a3b8', fontWeight: '500' }}>
                                        {t('screen8.no_more')}
                                    </Text>
                                    <div style={{
                                        width: '40px',
                                        height: '3px',
                                        backgroundColor: '#e2e8f0',
                                        margin: '12px auto 0 auto',
                                        borderRadius: '2px',
                                        opacity: 0.5
                                    }} />
                                </div>
                            )}
                        </div>
                    ) : (
                        todaySessions.length === 0 && (
                            <div style={{ marginTop: '60px' }}>
                                <Empty description={t('screen8.empty')} />
                            </div>
                        )
                    )}

                </div>
            </div>

            {/* Feedback Modal */}
            <Modal
                title={null}
                open={isFeedbackModalOpen}
                onCancel={() => setIsFeedbackModalOpen(false)}
                footer={null}
                centered
                styles={{ body: { padding: '24px' } }}
                borderRadius={24}
                closeIcon={null}
            >
                <div style={{ textAlign: 'center' }}>
                    <div style={{
                        width: '64px',
                        height: '64px',
                        backgroundColor: '#fef9c3',
                        borderRadius: '20px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        margin: '0 auto 16px auto'
                    }}>
                        <StarFilled style={{ color: '#facc15', fontSize: '32px' }} />
                    </div>
                    <Title level={4} style={{ margin: '0 0 8px 0', fontWeight: 800 }}>{t('screen6.feedback_title')}</Title>
                    <Text type="secondary" style={{ display: 'block', marginBottom: '24px', fontSize: '14px' }}>
                        {t('screen6.feedback_desc')}
                    </Text>

                    <Rate
                        style={{ fontSize: '36px', color: '#facc15', marginBottom: '24px' }}
                        value={rating}
                        onChange={setRating}
                    />

                    <div style={{ textAlign: 'left', marginBottom: '8px' }}>
                        <Text strong style={{ fontSize: '14px' }}>{t('screen6.feedback_placeholder').split('(')[0]}</Text>
                    </div>
                    <Input.TextArea
                        rows={3}
                        placeholder={t('screen6.feedback_placeholder')}
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        style={{
                            borderRadius: '16px',
                            padding: '12px',
                            border: '1px solid #e2e8f0',
                            marginBottom: '24px',
                            resize: 'none',
                            fontSize: '14px'
                        }}
                    />

                    <div style={{ display: 'flex', gap: '12px' }}>
                        <Button
                            size="large"
                            block
                            onClick={() => setIsFeedbackModalOpen(false)}
                            style={{ borderRadius: '14px', height: '48px', fontWeight: 600 }}
                        >
                            {t('common.cancel')}
                        </Button>
                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={handleSubmitFeedback}
                            disabled={rating === 0}
                            style={{
                                borderRadius: '14px',
                                height: '48px',
                                background: rating === 0 ? '#E5E7EB' : '#EF4444',
                                borderColor: rating === 0 ? '#E5E7EB' : '#EF4444',
                                color: rating === 0 ? '#9CA3AF' : '#FFFFFF',
                                fontWeight: 700
                            }}
                        >
                            {t('common.save')}
                        </Button>
                    </div>
                </div>
            </Modal>
        </MobileLayout>
    );
};

export default Screen8;
