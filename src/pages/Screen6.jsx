import React, { useEffect, useState } from 'react';
import { Button, Typography, Modal, Spin, Space, Divider, Card, Tag } from 'antd';
import {
    CheckCircleFilled,
    ClockCircleOutlined,
    CustomerServiceFilled,
    EnvironmentFilled,
    InfoCircleFilled,
    MessageOutlined,
    PhoneOutlined,
    ThunderboltFilled
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import useSwapSession from '../hooks/useSwapSession';
import { useTranslation } from 'react-i18next';
import { getBillingOption } from '../data/mockSwapData';

const { Title, Text } = Typography;

const MOCK_SWAP = {
    swapId: 'SWP-2026-000142',
    stationNameTh: 'AMR Swap Station Bang Na',
    stationNameEn: 'AMR Swap Station Bang Na',
    stationAddressTh: '123/45 ถนนบางนา-ตราด แขวงบางนา เขตบางนา กรุงเทพมหานคร 10260',
    stationAddressEn: '123/45 Bang Na-Trat Road, Bang Na, Bangkok 10260',
    cabinetCode: 'SWAP-BN-004',
    batteryModel: 'AMR-M2 72V',
    returnSlot: '02',
    pickupSlot: '04',
    returnedBatteryId: 'BAT-OLD-9182',
    pickupBatteryId: 'BAT-FULL-2048',
    pickupBatterySoc: 96,
    fullBatteries: 8,
    serviceTime: '00:02:40',
    status: 'waiting_return'
};

const Screen5 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { hasActiveSwap, isLoading, completeSwap } = useSwapSession();
    const [swapStatus, setSwapStatus] = useState(MOCK_SWAP.status);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isStationInfoVisible, setIsStationInfoVisible] = useState(false);

    useEffect(() => {
        document.title = `${t('screen5.title')} | AMR Battery Swap`;
    }, [t]);

    const isWaitingReturn = swapStatus === 'waiting_return';
    const handleReturnConfirmed = () => {
        setSwapStatus('pickup_ready');
    };

    const handlePickupConfirm = () => {
        setIsConfirmModalOpen(false);
        completeSwap();
    };

    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!hasActiveSwap) {
        return (
            <MobileLayout>
                <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', minHeight: '100vh', background: '#f8fafc' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <Button
                            type="text"
                            onClick={() => i18n.changeLanguage(i18n.language === 'th' ? 'en' : 'th')}
                            style={{ display: 'flex', alignItems: 'center', gap: '6px', background: 'white', borderRadius: '12px', padding: '4px 12px', height: 'auto', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}
                        >
                            <span style={{ fontSize: '18px' }}>{i18n.language === 'th' ? '🇹🇭' : '🇬🇧'}</span>
                            <Text strong style={{ fontSize: '13px', color: '#1f2937' }}>{i18n.language === 'th' ? 'TH' : 'EN'}</Text>
                        </Button>
                    </div>

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{ width: '80px', height: '80px', backgroundColor: '#ecfdf5', borderRadius: '26px', display: 'flex', justifyContent: 'center', alignItems: 'center', marginBottom: '24px' }}>
                            <ThunderboltFilled style={{ color: '#10b981', fontSize: '36px' }} />
                        </div>
                        <Title level={4} style={{ margin: '0 0 12px 0', color: '#1e293b' }}>{t('screen5.no_charging_title')}</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '32px' }}>{t('screen5.no_charging_desc')}</Text>
                        <Button
                            type="primary"
                            size="large"
                            icon={<ClockCircleOutlined />}
                            onClick={() => navigate('/screen8')}
                            style={{ height: '56px', borderRadius: '16px', backgroundColor: '#10b981', fontWeight: '700', padding: '0 32px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}
                        >
                            {t('screen5.go_to_history')}
                        </Button>
                    </div>
                </div>
            </MobileLayout>
        );
    }

    const stationName = i18n.language === 'th' ? MOCK_SWAP.stationNameTh : MOCK_SWAP.stationNameEn;
    const stationAddress = i18n.language === 'th' ? MOCK_SWAP.stationAddressTh : MOCK_SWAP.stationAddressEn;
    const activeBillingOptionId = localStorage.getItem('activeBillingOptionId') || 'pay_per_swap';
    const activeBilling = getBillingOption(activeBillingOptionId);
    const activeBillingLabel = t(activeBilling.titleKey);
    const activeBillingQuota = t(activeBilling.quotaLabelKey);
    const steps = [
        { label: t('screen5.step_payment_done'), done: true },
        { label: t('screen5.step_return_opened'), done: true },
        { label: isWaitingReturn ? t('screen5.step_wait_return') : t('screen5.step_return_checked'), done: !isWaitingReturn, active: isWaitingReturn },
        { label: t('screen5.step_pickup_opened'), done: !isWaitingReturn, active: !isWaitingReturn },
        { label: t('screen5.step_pickup_confirm'), done: false }
    ];

    return (
        <MobileLayout>
            <div style={{ background: '#f8fafc', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                <Header title={t('screen5.title')} />

                <div style={{ padding: '14px 20px 24px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: isWaitingReturn ? '#fff7ed' : '#ecfdf5',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            color: isWaitingReturn ? '#ea580c' : '#10b981',
                            fontSize: '11px',
                            fontWeight: '700',
                            border: isWaitingReturn ? '1px solid #ffedd5' : '1px solid #bbf7d0'
                        }}>
                            <span style={{ width: '6px', height: '6px', background: isWaitingReturn ? '#ea580c' : '#10b981', borderRadius: '50%' }} />
                            {isWaitingReturn ? t('screen5.status_suspended') : t('screen5.status_charging')}
                        </div>

                        <div style={{ display: 'inline-flex', alignItems: 'center', background: '#1e293b', padding: '6px 12px', borderRadius: '20px', color: 'white', fontSize: '11px', fontWeight: '700' }}>
                            {MOCK_SWAP.batteryModel}
                        </div>

                        <Tag color="green" style={{ margin: 0, borderRadius: '20px', padding: '4px 10px', fontSize: '11px', fontWeight: 700 }}>
                            {activeBillingLabel}
                        </Tag>

                        <Button
                            type="text"
                            icon={<InfoCircleFilled style={{ color: '#3b82f6', fontSize: '18px' }} />}
                            onClick={() => setIsStationInfoVisible(true)}
                            style={{ padding: '4px', height: 'auto', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'white', borderRadius: '50%', boxShadow: '0 2px 4px rgba(0,0,0,0.05)', border: '1px solid #f1f5f9' }}
                        />
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                        <div style={{ width: '180px', height: '180px', margin: '0 auto 18px auto', borderRadius: '40px', background: 'linear-gradient(180deg, #ecfdf5 0%, #ffffff 100%)', border: '1px solid #d1fae5', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', boxShadow: '0 18px 40px rgba(16, 185, 129, 0.12)' }}>
                            <ThunderboltFilled style={{ color: '#10b981', fontSize: '42px', marginBottom: '12px' }} />
                            <Title level={1} style={{ margin: 0, color: '#0f172a', lineHeight: 1 }}>{MOCK_SWAP.pickupBatterySoc}<span style={{ fontSize: '22px' }}>%</span></Title>
                            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 700 }}>{t('screen5.energy_delivered')}</Text>
                        </div>
                        <Title level={4} style={{ margin: '0 0 6px 0', color: '#0f172a' }}>
                            {isWaitingReturn
                                ? t('screen5.return_slot_title', { slot: MOCK_SWAP.returnSlot })
                                : t('screen5.pickup_slot_title', { slot: MOCK_SWAP.pickupSlot })}
                        </Title>
                        <Text type="secondary" style={{ fontSize: '13px' }}>
                            {isWaitingReturn
                                ? t('screen5.charger_stopped_check')
                                : t('screen5.pickup_slot_desc', { slot: MOCK_SWAP.pickupSlot, batteryId: MOCK_SWAP.pickupBatteryId })}
                        </Text>
                    </div>

                    <Card style={{ borderRadius: '22px', border: '1px solid #e2e8f0', marginBottom: '18px' }} styles={{ body: { padding: '18px' } }}>
                        <Space direction="vertical" size={14} style={{ width: '100%' }}>
                            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '16px', padding: '12px', display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center' }}>
                                <div>
                                    <Text type="secondary" style={{ display: 'block', fontSize: '11px', fontWeight: 700 }}>{t('billing.your_plan')}</Text>
                                    <Text strong style={{ fontSize: '14px', color: '#047857' }}>{activeBillingLabel}</Text>
                                </div>
                                <Text type="secondary" style={{ fontSize: '12px', textAlign: 'right' }}>{activeBillingQuota}</Text>
                            </div>
                            {steps.map((step, index) => (
                                <div key={step.label} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                                    <div style={{ width: '26px', height: '26px', borderRadius: '50%', background: step.done ? '#10b981' : step.active ? '#f59e0b' : '#e2e8f0', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '12px', fontWeight: 800 }}>
                                        {step.done ? <CheckCircleFilled /> : index + 1}
                                    </div>
                                    <Text strong={step.active} style={{ fontSize: '14px', color: step.active ? '#0f172a' : '#64748b' }}>{step.label}</Text>
                                </div>
                            ))}
                        </Space>
                    </Card>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '18px' }}>
                        <Stat label={t('screen5.current_power')} value={MOCK_SWAP.fullBatteries} unit={t('charging.unit_swap')} />
                        <Stat label={t('screen5.elapsed_time')} value={MOCK_SWAP.serviceTime} />
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '18px' }}>
                        {isWaitingReturn ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Button type="primary" size="large" block icon={<CheckCircleFilled />} style={{ height: '60px', borderRadius: '18px', fontWeight: '800', fontSize: '16px', backgroundColor: '#10b981', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)' }} onClick={handleReturnConfirmed}>
                                    {t('screen5.resume_confirm_title')}
                                </Button>
                                <Button size="large" block icon={<CustomerServiceFilled />} style={{ height: '56px', borderRadius: '18px', fontWeight: '700', fontSize: '16px', color: '#475569', borderColor: '#cbd5e1' }} onClick={() => setIsContactModalOpen(true)}>
                                    {t('screen5.contact_support')}
                                </Button>
                            </div>
                        ) : (
                            <Button type="primary" size="large" block style={{ height: '64px', borderRadius: '20px', fontWeight: '800', fontSize: '18px', backgroundColor: '#10b981', border: 'none', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)' }} onClick={() => setIsConfirmModalOpen(true)}>
                                {t('screen5.stop_button')}
                            </Button>
                        )}
                    </div>
                </div>

                <Modal title={null} open={isConfirmModalOpen} onCancel={() => setIsConfirmModalOpen(false)} footer={null} centered width={340} styles={{ body: { padding: '32px 24px' } }}>
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px auto' }}>
                            <CheckCircleFilled style={{ fontSize: '32px', color: '#10b981' }} />
                        </div>
                        <Title level={4} style={{ margin: '0 0 12px 0' }}>{t('screen5.stop_confirm_title')}</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '32px', fontSize: '14px' }}>{t('screen5.stop_confirm_desc')}</Text>
                        <Button type="primary" size="large" block style={{ height: '52px', borderRadius: '14px', fontWeight: '700', backgroundColor: '#10b981' }} onClick={handlePickupConfirm}>
                            {t('common.confirm')}
                        </Button>
                    </div>
                </Modal>

                <Modal title={<Title level={4} style={{ margin: 0, textAlign: 'center' }}>{t('screen5.contact_support')}</Title>} open={isContactModalOpen} onCancel={() => setIsContactModalOpen(false)} footer={null} centered width={320} styles={{ body: { padding: '24px' } }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
                        <a href="tel:021234567" style={{ textDecoration: 'none' }}>
                            <Button block size="large" style={{ height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '20px', paddingRight: '20px', fontSize: '16px', fontWeight: '600' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><PhoneOutlined style={{ fontSize: '20px', color: '#10b981' }} /><span>02-123-4567</span></div>
                                <div style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', color: '#6b7280' }}>Call</div>
                            </Button>
                        </a>
                        <a href="https://line.me/ti/p/@amr_ev" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Button block size="large" style={{ height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '20px', paddingRight: '20px', fontSize: '16px', fontWeight: '600', borderColor: '#06c755', color: '#06c755' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><MessageOutlined style={{ fontSize: '20px' }} /><span>@amr_swap</span></div>
                                <div style={{ background: '#dcfce7', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', color: '#15803d' }}>Line</div>
                            </Button>
                        </a>
                    </div>
                </Modal>

                <Modal title={<Title level={4} style={{ margin: 0 }}>{t('screen1.station_label')}</Title>} open={isStationInfoVisible} onCancel={() => setIsStationInfoVisible(false)} footer={<Button type="primary" onClick={() => setIsStationInfoVisible(false)} style={{ borderRadius: '12px', background: '#10b981', borderColor: '#10b981' }}>{t('common.close')}</Button>} centered styles={{ body: { padding: '24px' } }}>
                    <Space direction="vertical" size={18} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                            <div style={{ padding: '10px', backgroundColor: '#ecfdf5', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <EnvironmentFilled style={{ color: '#10b981', fontSize: '20px' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Title level={5} style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700 }}>{stationName}</Title>
                                <Text type="secondary" style={{ fontSize: '14px', lineHeight: '1.5', display: 'block' }}>{stationAddress}</Text>
                            </div>
                        </div>
                        <Divider style={{ margin: 0 }} />
                        <InfoRow label={t('screen6.charger_id')} value={MOCK_SWAP.cabinetCode} />
                        <InfoRow label={t('screen6.connector_type')} value={MOCK_SWAP.batteryModel} />
                        <InfoRow label={t('screen5.return_pickup_label')} value={`${MOCK_SWAP.returnSlot} / ${MOCK_SWAP.pickupSlot}`} />
                    </Space>
                </Modal>
            </div>
        </MobileLayout>
    );
};

const Stat = ({ label, value, unit }) => (
    <div style={{ background: 'white', padding: '16px', borderRadius: '18px', border: '1px solid #f1f5f9' }}>
        <Text type="secondary" style={{ fontSize: '11px', fontWeight: 700, display: 'block', marginBottom: '6px' }}>{label}</Text>
        <Text strong style={{ fontSize: '20px', color: '#0f172a' }}>{value} {unit && <span style={{ fontSize: '12px', color: '#94a3b8' }}>{unit}</span>}</Text>
    </div>
);

const InfoRow = ({ label, value }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
        <Text type="secondary" style={{ fontSize: '13px' }}>{label}</Text>
        <Text strong style={{ fontSize: '14px', textAlign: 'right' }}>{value}</Text>
    </div>
);

export default Screen5;
