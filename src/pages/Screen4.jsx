import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Result, Spin, Tag, Typography } from 'antd';
import {
    DollarCircleOutlined,
    EnvironmentOutlined,
    ShoppingCartOutlined,
    ThunderboltFilled,
    ThunderboltOutlined
} from '@ant-design/icons';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { SWAP_CABINETS, getMockUserEntitlement } from '../data/mockSwapData';
import { activateSwapFromEntitlement, hasActiveSwapSession } from '../utils/swapAccess';

const { Title, Text } = Typography;

const SlotStat = ({ label, value, color }) => (
    <div style={{ background: '#F9FAFB', borderRadius: '14px', padding: '10px 8px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
        <Text type="secondary" style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>{label}</Text>
        <Text strong style={{ fontSize: '18px', color }}>{value}</Text>
    </div>
);

const Screen4 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [entitlement] = useState(() => getMockUserEntitlement());

    const cabinetId = searchParams.get('cabinetId')
        || localStorage.getItem('currentCabinetId')
        || localStorage.getItem('currentChargerId')
        || 'AMR001';
    const cabinet = SWAP_CABINETS[cabinetId] || SWAP_CABINETS.AMR001;
    const canStartSwap = cabinet.status === 'READY' && entitlement.hasActivePlan;

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 500);
        if (cabinetId) localStorage.setItem('currentCabinetId', cabinetId);
        document.title = `${cabinet.name} | AMR Battery Swap`;
        if (hasActiveSwapSession()) navigate('/screen6', { replace: true });
        return () => clearTimeout(timer);
    }, [cabinet.name, cabinetId, navigate]);

    const startSwap = () => {
        if (!activateSwapFromEntitlement(entitlement)) return;
        navigate('/screen6');
    };

    const goToPackages = () => {
        navigate(`/screen11?cabinetId=${cabinetId}`);
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
            <div style={{ minHeight: '100%', padding: '18px 20px 24px', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '14px' }}>
                    <Button
                        type="text"
                        onClick={() => i18n.changeLanguage(i18n.language === 'th' ? 'en' : 'th')}
                        style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '12px', height: 'auto', padding: '4px 12px', fontWeight: 700 }}
                    >
                        {i18n.language === 'th' ? 'TH' : 'EN'}
                    </Button>
                </div>

                <Card style={{ borderRadius: '22px', border: entitlement.hasActivePlan ? '1px solid #BBF7D0' : '1px solid #E2E8F0', marginBottom: '16px', background: entitlement.hasActivePlan ? '#F0FDF4' : '#FFFFFF' }} styles={{ body: { padding: '18px' } }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', marginBottom: '14px' }}>
                        <div>
                            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                                {t('billing.your_plan')}
                            </Text>
                            <Title level={5} style={{ margin: '6px 0 4px 0' }}>{t(entitlement.planNameKey)}</Title>
                            {entitlement.hasActivePlan ? (
                                <>
                                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                                        {t('billing.remaining_quota', { count: entitlement.remainingQuota })}
                                    </Text>
                                    <Text type="secondary" style={{ display: 'block', fontSize: '12px' }}>
                                        {t('billing.active_until', { date: new Date(entitlement.expiresAt).toLocaleDateString(i18n.language === 'th' ? 'th-TH' : 'en-GB') })}
                                    </Text>
                                </>
                            ) : (
                                <Text type="secondary" style={{ fontSize: '12px' }}>{t('billing.payment_required')}</Text>
                            )}
                        </div>
                        <Tag color={entitlement.hasActivePlan ? 'success' : 'default'} style={{ margin: 0, borderRadius: '999px', fontWeight: 700 }}>
                            {entitlement.hasActivePlan ? t('billing.no_payment_required') : t('billing.payment_required')}
                        </Tag>
                    </div>

                    <Button
                        block
                        icon={<ShoppingCartOutlined />}
                        onClick={goToPackages}
                        style={{
                            height: '46px',
                            borderRadius: '14px',
                            borderColor: '#10b981',
                            color: entitlement.hasActivePlan ? '#047857' : '#ffffff',
                            background: entitlement.hasActivePlan ? '#ffffff' : '#10b981',
                            fontWeight: 800
                        }}
                    >
                        {t('billing.choose_plan')}
                    </Button>
                </Card>

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

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '14px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <DollarCircleOutlined style={{ color: '#10b981' }} />
                            <Text strong>{t('screen1.price_label')}</Text>
                        </div>
                        <Text strong style={{ fontSize: '18px', color: '#10b981' }}>{cabinet.price} {t('charging.unit_baht')}/{t('charging.unit_swap')}</Text>
                    </div>
                </Card>

                <div style={{ marginTop: 'auto', paddingTop: '24px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {entitlement.hasActivePlan && (
                        <Button
                            type="primary"
                            size="large"
                            block
                            disabled={!canStartSwap}
                            icon={<ThunderboltFilled />}
                            onClick={startSwap}
                            style={{ height: '60px', borderRadius: '20px', background: '#10b981', border: 'none', fontSize: '18px', fontWeight: 800 }}
                        >
                            {t('billing.start_swap')}
                        </Button>
                    )}
                    <Button
                        size="large"
                        block
                        icon={<ShoppingCartOutlined />}
                        onClick={goToPackages}
                        style={{
                            height: '58px',
                            borderRadius: '20px',
                            borderColor: entitlement.hasActivePlan ? '#10b981' : '#10b981',
                            color: entitlement.hasActivePlan ? '#047857' : '#ffffff',
                            background: entitlement.hasActivePlan ? '#ffffff' : '#10b981',
                            fontSize: '17px',
                            fontWeight: 800
                        }}
                    >
                        {t('billing.choose_plan')}
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
};

export default Screen4;
