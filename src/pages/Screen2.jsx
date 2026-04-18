import React, { useEffect, useState } from 'react';
import { Button, Card, Divider, Result, Spin, Tag, Typography } from 'antd';
import { DollarCircleOutlined, EnvironmentOutlined, ThunderboltOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MobileLayout from '../components/MobileLayout';
import { SWAP_CABINETS, getMockUserEntitlement, setMockUserEntitlement } from '../data/mockSwapData';

const { Title, Text } = Typography;

const SlotStat = ({ label, value, color }) => (
    <div style={{ background: '#F9FAFB', borderRadius: '14px', padding: '10px 8px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
        <Text type="secondary" style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>{label}</Text>
        <Text strong style={{ fontSize: '18px', color }}>{value}</Text>
    </div>
);

const Screen2 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const [isLoading, setIsLoading] = useState(true);
    const [entitlement, setEntitlement] = useState(() => getMockUserEntitlement());

    const cabinetId = searchParams.get('cabinetId') || searchParams.get('chargerId');
    const stationInfo = cabinetId ? SWAP_CABINETS[cabinetId] || null : null;
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

    useEffect(() => {
        const timer = setTimeout(() => setIsLoading(false), 700);
        if (cabinetId) localStorage.setItem('currentCabinetId', cabinetId);
        document.title = `${stationInfo?.name || t('screen1.station_info')} | AMR Battery Swap`;
        return () => clearTimeout(timer);
    }, [cabinetId, stationInfo, t]);

    const goToAuth = () => {
        const authPath = cabinetId ? `/screen1?cabinetId=${cabinetId}` : '/screen1';
        navigate(authPath, { state: { from: location } });
    };

    const changeMockProfile = (profile) => {
        setEntitlement(setMockUserEntitlement(profile));
    };

    const startWithCurrentPlan = () => {
        localStorage.setItem('activeSwapSession', 'true');
        localStorage.setItem('activeBillingOptionId', entitlement.billingOptionId);
        localStorage.setItem('activeBillingMode', entitlement.profile);
        navigate('/screen6');
    };

    if (isLoading) {
        return (
            <MobileLayout>
                <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Spin size="large" />
                </div>
            </MobileLayout>
        );
    }

    if (!cabinetId || !stationInfo) {
        return (
            <MobileLayout>
                <div style={{ minHeight: '100vh', padding: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Result
                        status="warning"
                        title={!cabinetId ? t('screen1.missing_charger_title') : t('screen1.invalid_charger_title')}
                        subTitle={!cabinetId ? t('screen1.missing_charger_desc') : t('screen1.invalid_charger_desc')}
                        extra={<Button type="primary" onClick={goToAuth}>{t('screen1.login_button')}</Button>}
                    />
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            <div style={{ minHeight: '100vh', padding: '24px', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '18px' }}>
                    <Button
                        type="text"
                        onClick={() => i18n.changeLanguage(i18n.language === 'th' ? 'en' : 'th')}
                        style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '12px', height: 'auto', padding: '4px 12px', fontWeight: 700 }}
                    >
                        {i18n.language === 'th' ? 'TH' : 'EN'}
                    </Button>
                </div>

                <Card style={{ borderRadius: '24px', border: '1px solid #D1FAE5', boxShadow: '0 12px 30px rgba(16,185,129,0.10)' }} styles={{ body: { padding: '22px' } }}>
                    <Text type="secondary" style={{ fontSize: '12px', fontWeight: 800, letterSpacing: '1px', textTransform: 'uppercase' }}>
                        {t('screen1.station_label')}
                    </Text>
                    <Title level={3} style={{ margin: '8px 0 10px 0', color: '#0f172a' }}>{stationInfo.name}</Title>

                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start', marginBottom: '18px' }}>
                        <EnvironmentOutlined style={{ color: '#10b981', marginTop: '3px' }} />
                        <Text type="secondary" style={{ fontSize: '13px', lineHeight: 1.5 }}>{stationInfo.address}</Text>
                    </div>

                    <Divider style={{ margin: '14px 0' }} />

                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '16px', alignItems: 'center', background: '#F8FAFC', padding: '14px', borderRadius: '16px', marginBottom: '12px' }}>
                        <div>
                            <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '4px' }}>{t('screen1.charger_type_label')}</Text>
                            <Text strong>{stationInfo.batteryModel}</Text>
                        </div>
                        <ThunderboltOutlined style={{ color: '#10b981', fontSize: '22px' }} />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', marginBottom: '12px' }}>
                        <SlotStat label={t('screen1.slot_full')} value={stationInfo.fullBatteries} color="#10b981" />
                        <SlotStat label={t('screen1.slot_empty')} value={stationInfo.emptySlots} color="#64748b" />
                        <SlotStat label={t('screen1.slot_fault')} value={stationInfo.faultSlots} color="#f59e0b" />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#F8FAFC', padding: '14px', borderRadius: '16px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                            <DollarCircleOutlined style={{ color: '#10b981' }} />
                            <Text strong>{t('screen1.price_label')}</Text>
                        </div>
                        <Text strong style={{ fontSize: '18px', color: '#10b981' }}>{stationInfo.price} {t('charging.unit_baht')}/{t('charging.unit_swap')}</Text>
                    </div>
                </Card>

                <Card style={{ borderRadius: '22px', border: '1px solid #E2E8F0', marginTop: '16px' }} styles={{ body: { padding: '18px' } }}>
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

                    <Text type="secondary" style={{ display: 'block', fontSize: '12px', fontWeight: 700, marginBottom: '8px' }}>
                        {t('billing.mock_profile')}
                    </Text>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                        {[
                            ['none', t('billing.profile_none')],
                            ['quota', t('billing.profile_quota')],
                            ['daily', t('billing.profile_daily')],
                            ['monthly', t('billing.profile_monthly')]
                        ].map(([profile, label]) => (
                            <button
                                key={profile}
                                type="button"
                                onClick={() => changeMockProfile(profile)}
                                style={{
                                    border: `1px solid ${entitlement.profile === profile ? '#10b981' : '#E2E8F0'}`,
                                    background: entitlement.profile === profile ? '#ECFDF5' : '#FFFFFF',
                                    color: entitlement.profile === profile ? '#047857' : '#475569',
                                    borderRadius: '12px',
                                    padding: '10px 6px',
                                    fontWeight: 800
                                }}
                            >
                                {label}
                            </button>
                        ))}
                    </div>
                </Card>

                <div style={{ marginTop: 'auto', paddingTop: '24px' }}>
                    <Button
                        type="primary"
                        size="large"
                        block
                        disabled={stationInfo.status !== 'READY'}
                        onClick={() => {
                            if (isLoggedIn && entitlement.hasActivePlan) {
                                startWithCurrentPlan();
                            } else if (isLoggedIn) {
                                navigate(cabinetId ? `/screen4?cabinetId=${cabinetId}` : '/screen4');
                            } else {
                                goToAuth();
                            }
                        }}
                        style={{ height: '60px', borderRadius: '20px', background: '#10b981', border: 'none', fontSize: '18px', fontWeight: 800 }}
                    >
                        {isLoggedIn
                            ? entitlement.hasActivePlan ? t('billing.use_current_plan') : t('billing.choose_plan')
                            : `${t('screen1.login_button')} / ${t('screen1.otp_mode')}`}
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
};

export default Screen2;
