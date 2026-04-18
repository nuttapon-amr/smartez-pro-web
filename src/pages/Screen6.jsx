import React, { useEffect, useMemo, useState } from 'react';
import { Button, Card, Modal, Space, Spin, Steps, Tag, Typography } from 'antd';
import {
    CheckCircleFilled,
    ClockCircleOutlined,
    CustomerServiceFilled,
    LoadingOutlined,
    MessageOutlined,
    PhoneOutlined,
    ThunderboltFilled
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import useSwapSession from '../hooks/useSwapSession';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const MOCK_SWAP = {
    swapId: 'SWP-2026-000142',
    cabinetCode: 'SWAP-BN-004',
    batteryModel: 'AMR-M2 72V',
    returnSlot: '02',
    pickupSlot: '04',
    pickupBatteryId: 'BAT-FULL-2048',
    pickupBatterySoc: 96,
    fullBatteries: 8
};

const FLOW_STEPS = ['connecting', 'return_open', 'verifying_return', 'pickup_ready'];

const Screen6 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { hasActiveSwap, isLoading, completeSwap } = useSwapSession();
    const [swapStep, setSwapStep] = useState('connecting');
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

    useEffect(() => {
        document.title = `${t('screen5.title')} | AMR Battery Swap`;
    }, [t]);

    useEffect(() => {
        if (swapStep !== 'connecting') return undefined;
        const timer = setTimeout(() => setSwapStep('return_open'), 1400);
        return () => clearTimeout(timer);
    }, [swapStep]);

    useEffect(() => {
        if (swapStep !== 'verifying_return') return undefined;
        const timer = setTimeout(() => setSwapStep('pickup_ready'), 1600);
        return () => clearTimeout(timer);
    }, [swapStep]);

    const currentStepIndex = Math.max(0, FLOW_STEPS.indexOf(swapStep));

    const steps = useMemo(() => ([
        { title: t('screen5.step_connecting') },
        { title: t('screen5.step_return_instruction') },
        { title: t('screen5.step_verify_return') },
        { title: t('screen5.step_pickup_instruction') }
    ]), [t]);

    const screenCopy = {
        connecting: {
            status: t('screen5.status_connecting'),
            title: t('screen5.connecting_title'),
            desc: t('screen5.connecting_desc'),
            icon: <div style={{ textAlign: 'center' }}><LoadingOutlined spin style={{ color: '#10b981', fontSize: '42px' }} /><Text type="secondary" style={{ display: 'block', marginTop: '10px', fontSize: '12px', fontWeight: 700 }}>{t('screen5.connecting_spinner')}</Text></div>,
            accent: '#10b981'
        },
        return_open: {
            status: t('screen5.status_return_open'),
            title: t('screen5.return_instruction_title', { slot: MOCK_SWAP.returnSlot }),
            desc: t('screen5.return_instruction_desc', { slot: MOCK_SWAP.returnSlot }),
            icon: <ThunderboltFilled style={{ color: '#f59e0b', fontSize: '42px' }} />,
            accent: '#f59e0b'
        },
        verifying_return: {
            status: t('screen5.status_verifying'),
            title: t('screen5.verifying_return_title'),
            desc: t('screen5.verifying_return_desc'),
            icon: <div style={{ textAlign: 'center' }}><LoadingOutlined spin style={{ color: '#3b82f6', fontSize: '42px' }} /><Text type="secondary" style={{ display: 'block', marginTop: '10px', fontSize: '12px', fontWeight: 700 }}>{t('screen5.verifying_spinner')}</Text></div>,
            accent: '#3b82f6'
        },
        pickup_ready: {
            status: t('screen5.status_pickup_ready'),
            title: t('screen5.pickup_instruction_title', { slot: MOCK_SWAP.pickupSlot }),
            desc: t('screen5.pickup_instruction_desc', { slot: MOCK_SWAP.pickupSlot, batteryId: MOCK_SWAP.pickupBatteryId }),
            icon: <CheckCircleFilled style={{ color: '#10b981', fontSize: '42px' }} />,
            accent: '#10b981'
        }
    }[swapStep];

    const handleReturnConfirmed = () => {
        setSwapStep('verifying_return');
    };

    const handlePickupConfirm = () => {
        setIsConfirmModalOpen(false);
        completeSwap();
    };

    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', gap: '16px', textAlign: 'center', padding: '24px' }}>
                <Spin size="large" />
                <div>
                    <Text strong style={{ display: 'block', fontSize: '16px', color: '#0f172a' }}>{t('screen5.loading_swap_title')}</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>{t('screen5.loading_swap_desc')}</Text>
                </div>
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
                            onClick={() => navigate('/screen9')}
                            style={{ height: '56px', borderRadius: '16px', backgroundColor: '#10b981', fontWeight: '700', padding: '0 32px', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.2)' }}
                        >
                            {t('screen5.go_to_history')}
                        </Button>
                    </div>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            <div style={{ background: '#f8fafc', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                <Header title={t('screen5.title')} />

                <div style={{ padding: '16px 20px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '16px' }}>
                        <Tag color="blue" style={{ margin: 0, borderRadius: '999px', padding: '4px 10px', fontWeight: 700 }}>
                            {MOCK_SWAP.cabinetCode}
                        </Tag>
                    </div>

                    <Card style={{ borderRadius: '24px', border: '1px solid #E2E8F0', marginBottom: '16px' }} styles={{ body: { padding: '18px' } }}>
                        <Steps
                            direction="vertical"
                            size="small"
                            current={currentStepIndex}
                            items={steps}
                        />
                    </Card>

                    <Card style={{ borderRadius: '28px', border: '1px solid #D1FAE5', boxShadow: '0 18px 44px rgba(16, 185, 129, 0.12)', marginBottom: '16px' }} styles={{ body: { padding: '24px 20px' } }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ width: '132px', height: '132px', borderRadius: '36px', background: '#ECFDF5', border: `1px solid ${screenCopy.accent}`, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 18px' }}>
                                {screenCopy.icon}
                            </div>
                            <Tag color={swapStep === 'return_open' ? 'warning' : swapStep === 'pickup_ready' ? 'success' : 'processing'} style={{ borderRadius: '999px', marginBottom: '12px', fontWeight: 700 }}>
                                {screenCopy.status}
                            </Tag>
                            <Title level={4} style={{ margin: '0 0 8px', color: '#0f172a' }}>
                                {screenCopy.title}
                            </Title>
                            <Text type="secondary" style={{ display: 'block', fontSize: '14px', lineHeight: 1.55 }}>
                                {screenCopy.desc}
                            </Text>
                        </div>
                    </Card>

                    <Card style={{ borderRadius: '20px', border: '1px solid #E2E8F0', marginBottom: '16px' }} styles={{ body: { padding: '16px' } }}>
                        <Space direction="vertical" size={12} style={{ width: '100%' }}>
                            <InfoRow label={t('screen5.return_slot')} value={MOCK_SWAP.returnSlot} highlight={swapStep === 'return_open'} />
                            <InfoRow label={t('screen5.pickup_slot')} value={MOCK_SWAP.pickupSlot} highlight={swapStep === 'pickup_ready'} />
                            <InfoRow label={t('screen6.connector_type')} value={MOCK_SWAP.batteryModel} />
                        </Space>
                    </Card>

                    <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                        {swapStep === 'return_open' && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Button type="primary" size="large" block icon={<CheckCircleFilled />} style={{ height: '60px', borderRadius: '18px', fontWeight: 800, fontSize: '16px', backgroundColor: '#10b981', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)' }} onClick={handleReturnConfirmed}>
                                    {t('screen5.confirm_return_button')}
                                </Button>
                                <Button size="large" block icon={<CustomerServiceFilled />} style={{ height: '56px', borderRadius: '18px', fontWeight: 700, fontSize: '16px', color: '#475569', borderColor: '#cbd5e1' }} onClick={() => setIsContactModalOpen(true)}>
                                    {t('screen5.contact_support')}
                                </Button>
                            </div>
                        )}

                        {swapStep === 'pickup_ready' && (
                            <Button type="primary" size="large" block style={{ height: '64px', borderRadius: '20px', fontWeight: 800, fontSize: '18px', backgroundColor: '#10b981', border: 'none', boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)' }} onClick={() => setIsConfirmModalOpen(true)}>
                                {t('screen5.confirm_pickup_button')}
                            </Button>
                        )}

                        {(swapStep === 'connecting' || swapStep === 'verifying_return') && (
                            <Button size="large" block disabled style={{ height: '60px', borderRadius: '18px', fontWeight: 800, fontSize: '16px' }}>
                                {swapStep === 'connecting' ? t('screen5.connecting_button') : t('screen5.verifying_button')}
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
                        <Button type="primary" size="large" block style={{ height: '52px', borderRadius: '14px', fontWeight: 700, backgroundColor: '#10b981' }} onClick={handlePickupConfirm}>
                            {t('common.confirm')}
                        </Button>
                    </div>
                </Modal>

                <Modal title={<Title level={4} style={{ margin: 0, textAlign: 'center' }}>{t('screen5.contact_support')}</Title>} open={isContactModalOpen} onCancel={() => setIsContactModalOpen(false)} footer={null} centered width={320} styles={{ body: { padding: '24px' } }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
                        <a href="tel:021234567" style={{ textDecoration: 'none' }}>
                            <Button block size="large" style={{ height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '20px', paddingRight: '20px', fontSize: '16px', fontWeight: 600 }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><PhoneOutlined style={{ fontSize: '20px', color: '#10b981' }} /><span>02-123-4567</span></div>
                                <div style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', color: '#6b7280' }}>Call</div>
                            </Button>
                        </a>
                        <a href="https://line.me/ti/p/@amr_ev" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Button block size="large" style={{ height: '60px', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingLeft: '20px', paddingRight: '20px', fontSize: '16px', fontWeight: 600, borderColor: '#06c755', color: '#06c755' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><MessageOutlined style={{ fontSize: '20px' }} /><span>@amr_swap</span></div>
                                <div style={{ background: '#dcfce7', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', color: '#15803d' }}>Line</div>
                            </Button>
                        </a>
                    </div>
                </Modal>
            </div>
        </MobileLayout>
    );
};

const InfoRow = ({ label, value, highlight }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'center', background: highlight ? '#ECFDF5' : '#F8FAFC', border: highlight ? '1px solid #BBF7D0' : '1px solid #F1F5F9', borderRadius: '14px', padding: '12px' }}>
        <Text type="secondary" style={{ fontSize: '12px', fontWeight: 700 }}>{label}</Text>
        <Text strong style={{ fontSize: '16px', color: highlight ? '#047857' : '#0f172a', textAlign: 'right' }}>{value}</Text>
    </div>
);

export default Screen6;
