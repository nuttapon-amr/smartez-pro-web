import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Result, Spin, Tag, Typography } from 'antd';
import {
    EnvironmentOutlined,
    ThunderboltFilled,
    ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { SWAP_CABINETS } from '../data/mockSwapData';
import { hasActiveSwapSession } from '../utils/swapAccess';

const { Title, Text } = Typography;

const SlotStat = ({ label, value, color }) => (
    <div style={{ background: '#F9FAFB', borderRadius: '14px', padding: '10px 8px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
        <Text type="secondary" style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>{label}</Text>
        <Text strong style={{ fontSize: '18px', color }}>{value}</Text>
    </div>
);

const Screen4 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);

    const cabinetId = searchParams.get('cabinetId')
        || localStorage.getItem('currentCabinetId')
        || localStorage.getItem('currentChargerId')
        || 'AMR001';
    const cabinet = SWAP_CABINETS[cabinetId] || SWAP_CABINETS.AMR001;
    const canStartSwap = cabinet.status === 'READY';

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        if (cabinetId) localStorage.setItem('currentCabinetId', cabinetId);
        document.title = `${cabinet.name} | AMR Battery Swap`;
        if (hasActiveSwapSession()) navigate('/screen6', { replace: true });
        return () => clearTimeout(timer);
    }, [cabinet.name, cabinetId, navigate]);

    const startSwap = () => {
        if (!canStartSwap) return;
        localStorage.setItem('activeSwapSession', 'true');
        localStorage.setItem('swapFlowStage', 'return');
        localStorage.removeItem('oldBatteryReturned');
        localStorage.removeItem('swapPaymentConfirmed');
        navigate('/screen6');
    };

    if (isLoading) {
        return (
            <MobileLayout>
                <Header title={t('screen1.station_info')} showBack={false} />
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin size="large" />
                </div>
            </MobileLayout>
        );
    }

    if (!cabinet) {
        return (
            <MobileLayout>
                <div style={{ minHeight: '100vh', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Result
                        status="warning"
                        title={t('screen1.invalid_charger_title')}
                        subTitle={t('screen1.invalid_charger_desc')}
                        extra={<Button type="primary" onClick={() => navigate('/screen1')}>{t('screen1.login_button')}</Button>}
                    />
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            <Header title={t('screen1.station_info')} showBack={false} />
            <div style={{ height: 'calc(100dvh - 64px)', minHeight: 'calc(100vh - 64px)', boxSizing: 'border-box', padding: '18px 20px 24px', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 100%)', overflowY: 'auto' }}>
                <div style={{ flex: 1, minHeight: 0 }}>
                    <Card style={{ borderRadius: '24px', border: '1px solid #D1FAE5', boxShadow: '0 12px 30px rgba(16,185,129,0.10)' }} styles={{ body: { padding: '22px' } }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start' }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                                    {t('screen1.station_label')}
                                </Text>
                                <Title level={3} style={{ margin: '8px 0 10px 0', color: '#0f172a' }}>{cabinet.name}</Title>
                            </div>
                            <Tag color={cabinet.status === 'READY' ? 'success' : 'warning'} style={{ margin: 0, borderRadius: '999px', fontWeight: 800 }}>
                                {cabinet.status === 'READY' ? t('screen1.status_available') : t('screen1.status_unavailable')}
                            </Tag>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '18px' }}>
                            <EnvironmentOutlined style={{ color: '#10b981', marginTop: '3px' }} />
                            <Text type="secondary" style={{ fontSize: '13px', lineHeight: 1.5 }}>{cabinet.address}</Text>
                        </div>

                        <Divider style={{ margin: '14px 0' }} />

                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', background: '#F8FAFC', padding: '14px', borderRadius: '16px', marginBottom: '12px' }}>
                            <div>
                                <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>{t('screen1.charger_type_label')}</Text>
                                <Text strong>{cabinet.batteryModel}</Text>
                            </div>
                            <ThunderboltOutlined style={{ color: '#10b981', fontSize: '22px' }} />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                            <SlotStat label={t('screen1.slot_full')} value={cabinet.fullBatteries} color="#10b981" />
                            <SlotStat label={t('screen1.slot_empty')} value={cabinet.emptySlots} color="#64748b" />
                            <SlotStat label={t('screen1.slot_fault')} value={cabinet.faultSlots} color="#f59e0b" />
                        </div>
                    </Card>
                </div>

                <Button
                    type="primary"
                    size="large"
                    block
                    disabled={!canStartSwap}
                    icon={<ThunderboltFilled />}
                    onClick={startSwap}
                    style={{ height: '60px', flexShrink: 0, marginTop: '24px', borderRadius: '20px', background: '#10b981', border: 'none', fontSize: '18px', fontWeight: 800 }}
                >
                    {t('billing.start_swap')}
                </Button>
            </div>
        </MobileLayout>
    );
};

export default Screen4;
