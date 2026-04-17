import React, { useState, useEffect } from 'react';
import { Button, Typography, Rate, Input, Spin, Divider, Card } from 'antd';
import {
    ClockCircleOutlined,
    ThunderboltFilled,
    InfoCircleFilled,
    CheckCircleFilled,
    EnvironmentFilled,
    CalendarFilled,
    TagFilled,
    FileTextOutlined
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SWAP_SUMMARY } from '../data/mockSwapData';

const { Title, Text } = Typography;

const Screen6 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [rating, setRating] = useState(0);
    const [feedback, setFeedback] = useState('');

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleString(i18n.language === 'th' ? 'th-TH' : 'en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: false
        });
    };

    // Mock data based on the requested UI
    const summaryData = {
        stationName: t(SWAP_SUMMARY.stationNameKey),
        stationAddress: t(SWAP_SUMMARY.stationAddressKey),
        cabinetCode: SWAP_SUMMARY.cabinetCode,
        batteryModel: SWAP_SUMMARY.batteryModel,
        pickupSlot: SWAP_SUMMARY.pickupSlot,
        powerDelivered: SWAP_SUMMARY.pickupBatterySoc,
        totalCost: SWAP_SUMMARY.totalCost,
        unitPrice: SWAP_SUMMARY.unitPrice,
        totalChargingTime: SWAP_SUMMARY.serviceTime,
        purchasedDuration: t('screen6.mock_purchased_duration'),
        chargingStartDate: SWAP_SUMMARY.startedAt,
        chargingEndDate: SWAP_SUMMARY.completedAt,
    };

    useEffect(() => {
        document.title = `${t('screen6.title')} | AMR Battery Swap`;
        // Mock loading data
        const timer = setTimeout(() => {
            setIsLoading(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, [t]);

    if (isLoading) {
        return (
            <MobileLayout>
                <Header title={t('screen6.title')} showBack={false} />
                <div style={{
                    flex: 1,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    padding: '40px',
                    textAlign: 'center'
                }}>
                    <Spin size="large" style={{ marginBottom: '24px' }} />
                    <Title level={4}>{t('screen6.stop_charging_title')}</Title>
                    <Text type="secondary">
                        {t('common.loading')}
                    </Text>
                </div>
            </MobileLayout>
        );
    }

    const formatNumber = (val) => {
        return Number(val).toLocaleString('en-US', {
            minimumFractionDigits: 2,
            maximumFractionDigits: 2
        });
    };

    return (
        <MobileLayout>
            <Header title={t('screen6.title')} showBack={false} />

            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', flex: 1, backgroundColor: '#f9fafb' }}>

                {/* Success Banner */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '24px',
                    padding: '24px',
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                }}>
                    <CheckCircleFilled style={{ fontSize: '64px', color: '#10b981', marginBottom: '16px' }} />
                    <Title level={3} style={{ margin: 0, color: '#111827' }}>{t('screen6.success_title')}</Title>
                    <Text type="secondary">{t('screen6.success_subtitle')}</Text>
                </div>

                {/* Station Card */}
                <Card style={{
                    borderRadius: '20px',
                    marginBottom: '20px',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                        <div style={{
                            width: '48px',
                            height: '48px',
                            backgroundColor: '#fee2e2',
                            borderRadius: '16px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            flexShrink: 0
                        }}>
                            <EnvironmentFilled style={{ color: '#EF4444', fontSize: '20px' }} />
                        </div>
                        <div>
                            <Title level={4} style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{summaryData.stationName}</Title>
                            <Text type="secondary" style={{ fontSize: '13px', display: 'block', lineHeight: '1.4' }}>{summaryData.stationAddress}</Text>
                        </div>
                    </div>
                </Card>

                {/* Primary Metrics Receipt */}
                <div style={{
                    backgroundColor: '#ffffff',
                    borderRadius: '24px',
                    padding: '24px',
                    marginBottom: '20px',
                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative Gradient Bar */}
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '6px',
                        background: 'linear-gradient(90deg, #EF4444, #f87171)'
                    }} />

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                        <div>
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                {t('screen6.energy_delivered')}
                            </Text>
                            <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
                                {formatNumber(summaryData.powerDelivered)} <span style={{ fontSize: '12px', fontWeight: 'normal' }}>%</span>
                            </Title>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                {t('screen6.duration')}
                            </Text>
                            <Title level={4} style={{ margin: 0, fontSize: '18px' }}>
                                {summaryData.totalChargingTime}
                            </Title>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginTop: '20px' }}>
                        <div>
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                {t('screen6.charger_id')}
                            </Text>
                            <Text strong style={{ fontSize: '15px' }}>{summaryData.cabinetCode}</Text>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                                {t('screen6.connector_no')}
                            </Text>
                            <Text strong style={{ fontSize: '15px' }}>#{summaryData.pickupSlot}</Text>
                        </div>
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>
                            {t('screen6.connector_type')}
                        </Text>
                        <Text strong style={{ fontSize: '15px' }}>{summaryData.batteryModel}</Text>
                    </div>
                </div>

                {/* Timing Details Card */}
                <Card style={{
                    borderRadius: '20px',
                    marginBottom: '20px',
                    border: 'none',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CalendarFilled style={{ color: '#10b981', fontSize: '16px' }} />
                                <Text style={{ fontSize: '14px' }}>{t('screen5.start_time')}</Text>
                            </div>
                            <Text strong style={{ fontSize: '14px' }}>{formatDate(summaryData.chargingStartDate)}</Text>
                        </div>
                        <Divider style={{ margin: 0 }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <CalendarFilled style={{ color: '#EF4444', fontSize: '16px' }} />
                                <Text style={{ fontSize: '14px' }}>{t('screen5.end_time')}</Text>
                            </div>
                            <Text strong style={{ fontSize: '14px' }}>{formatDate(summaryData.chargingEndDate)}</Text>
                        </div>
                        <Divider style={{ margin: 0 }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <InfoCircleFilled style={{ color: '#3b82f6', fontSize: '16px' }} />
                                <Text style={{ fontSize: '14px' }}>{t('screen5.quota', { duration: '' }).replace(': ', '')}</Text>
                            </div>
                            <Text strong style={{ fontSize: '14px', color: '#3b82f6' }}>{summaryData.purchasedDuration}</Text>
                        </div>
                    </div>
                </Card>

                {/* Feedback Card */}
                <Card style={{
                    borderRadius: '24px',
                    marginBottom: '32px',
                    border: 'none',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    backgroundColor: '#ffffff',
                }} styles={{ body: { padding: '24px' } }}>
                    <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <Title level={5} style={{ margin: '0 0 8px 0', color: '#111827', fontWeight: 700 }}>{t('screen6.feedback_title')}</Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>{t('screen6.feedback_desc')}</Text>
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '24px' }}>
                        <Rate
                            style={{ fontSize: '32px', color: '#facc15' }}
                            value={rating}
                            onChange={(val) => setRating(val)}
                        />
                    </div>

                    <div style={{ marginBottom: '8px' }}>
                        <Text strong style={{ fontSize: '14px', color: '#374151' }}>{t('screen6.feedback_title')}</Text>
                    </div>
                    <Input.TextArea
                        rows={3}
                        placeholder={t('screen6.feedback_placeholder')}
                        value={feedback}
                        onChange={(e) => setFeedback(e.target.value)}
                        style={{
                            borderRadius: '16px',
                            padding: '12px',
                            border: '1px solid #e5e7eb',
                            fontSize: '14px',
                            backgroundColor: '#f9fafb',
                            resize: 'none'
                        }}
                    />
                </Card>

                <div style={{ marginTop: 'auto', paddingBottom: '10px' }}>
                    <Button
                        size="large"
                        block
                        icon={<FileTextOutlined />}
                        style={{
                            height: '56px',
                            borderRadius: '16px',
                            marginBottom: '12px',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            borderColor: '#d1d5db',
                            color: '#374151'
                        }}
                        onClick={() => navigate('/screen10')}
                    >
                        {t('screen6.view_receipt')}
                    </Button>
                    <Button
                        type="primary"
                        size="large"
                        block
                        style={{
                            height: '56px',
                            borderRadius: '16px',
                            backgroundColor: '#EF4444',
                            fontWeight: 'bold',
                            fontSize: '18px',
                            boxShadow: '0 4px 14px 0 rgba(239, 68, 68, 0.39)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '8px'
                        }}
                        onClick={() => navigate('/screen8')}
                    >
                        {t('common.ok')}
                    </Button>
                </div>

            </div>
        </MobileLayout>
    );
};

export default Screen6;
