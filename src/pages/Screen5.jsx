import React, { useState } from 'react';
import { Button, Typography, Card, Space, Modal, Spin, message, Input } from 'antd';
import {
    ArrowRightOutlined,
    CheckCircleFilled,
    DownloadOutlined,
    LoadingOutlined,
    QrcodeOutlined,
    SwapOutlined,
    WalletOutlined
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBillingOption, setMockUserEntitlement } from '../data/mockSwapData';

import qrImage from '../assets/thai_promptpay_qr_mockup.png';

const { Title, Text } = Typography;

const Screen4 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('qr_code');
    const [paymentStatus, setPaymentStatus] = useState('idle');
    const [paymentStep, setPaymentStep] = useState('method');
    const [trueMoneyStatus, setTrueMoneyStatus] = useState('idle');
    const [trueMoneyStep, setTrueMoneyStep] = useState('mobile');
    const [trueMoneyPhone, setTrueMoneyPhone] = useState('');
    const [trueMoneyOtp, setTrueMoneyOtp] = useState('');
    const [trueMoneyError, setTrueMoneyError] = useState('');

    const billingOptionId = location.state?.billingOptionId || 'swap_5_30d';
    const selectedBilling = getBillingOption(billingOptionId);
    const amountToPay = location.state?.price ?? selectedBilling.price;
    const packageLabel = location.state?.packageLabel || t(selectedBilling.titleKey);
    const quotaLabel = location.state?.quotaLabel || t(selectedBilling.quotaLabelKey);
    const returnPath = location.state?.returnPath || '/screen4';
    const isPackagePurchase = location.state?.paymentPurpose === 'package_purchase';

    const handleDownloadQR = () => {
        const link = document.createElement('a');
        link.href = qrImage;
        link.download = `AMR_Swap_Payment_QR_${amountToPay.toFixed(2)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success(t('payment.save_image_success'));
    };

    React.useEffect(() => {
        const hasActiveSwap = localStorage.getItem('activeSwapSession') === 'true'
            || localStorage.getItem('isCharging') === 'true';
        if (hasActiveSwap) {
            navigate('/screen6');
        }
    }, [navigate]);

    const completePayment = () => {
        setPaymentStatus('confirmed');
        message.success(isPackagePurchase ? t('payment.package_success') : t('payment.payment_success'));

        if (selectedBilling.group === 'per_swap') {
            setMockUserEntitlement('quota');
        } else if (selectedBilling.id === 'pass_1d') {
            setMockUserEntitlement('daily');
        } else if (selectedBilling.group === 'pass') {
            setMockUserEntitlement('monthly');
        }

        localStorage.setItem('activeBillingOptionId', billingOptionId);
        localStorage.setItem('activeBillingMode', selectedBilling.type);
        localStorage.setItem('activePaymentMethod', selectedPaymentMethod);

        if (isPackagePurchase) {
            localStorage.removeItem('activeSwapSession');
            localStorage.removeItem('isCharging');
            navigate(returnPath, { replace: true });
        } else {
            localStorage.setItem('activeSwapSession', 'true');
            navigate('/screen6');
        }
    };

    const startBackendCallbackWait = () => {
        setPaymentStatus('pending');
        setTimeout(completePayment, 3500);
    };

    const handlePaymentStart = () => {
        startBackendCallbackWait();
    };

    const handleTrueMoneyPhoneSubmit = () => {
        if (!/^0\d{9}$/.test(trueMoneyPhone)) {
            setTrueMoneyError(t('payment.true_money_phone_error'));
            return;
        }

        setTrueMoneyError('');
        setTrueMoneyStep('otp');
    };

    const handleTrueMoneyOtpSubmit = () => {
        if (trueMoneyOtp.length !== 6) {
            setTrueMoneyError(t('payment.true_money_otp_error'));
            return;
        }

        setTrueMoneyError('');
        setTrueMoneyStatus('authorizing');
        setTimeout(() => {
            setTrueMoneyStatus('approved');
            setTrueMoneyStep('result');
            message.success(t('payment.true_money_approved'));
            setTimeout(() => {
                startBackendCallbackWait();
            }, 900);
        }, 1400);
    };

    const resetTrueMoneyFlow = () => {
        if (trueMoneyStatus === 'authorizing') return;
        setTrueMoneyStatus('idle');
        setTrueMoneyStep('mobile');
        setTrueMoneyPhone('');
        setTrueMoneyOtp('');
        setTrueMoneyError('');
    };

    const handleChangePaymentMethod = () => {
        Modal.confirm({
            title: t('payment.change_payment_confirm_title'),
            content: t('payment.change_payment_confirm_desc'),
            okText: t('payment.change_payment_method'),
            cancelText: t('common.cancel'),
            centered: true,
            onOk: () => {
                resetTrueMoneyFlow();
                setPaymentStep('method');
            },
            okButtonProps: {
                style: { borderRadius: '8px' }
            },
            cancelButtonProps: {
                style: { borderRadius: '8px' }
            }
        });
    };

    return (
        <MobileLayout>
            {paymentStatus === 'pending' && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#EF4444' }} spin />} />
                    <div style={{ textAlign: 'center' }}>
                        <Text strong style={{ fontSize: '18px', display: 'block', color: '#1f2937' }}>
                            {t('payment.waiting_callback')}
                        </Text>
                        <Text type="secondary">{t('payment.callback_desc')}</Text>
                    </div>
                </div>
            )}

            <Header title={t('payment.title')} showBack={true} />

            <div style={{ padding: '0 20px 24px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', margin: '14px 0 18px' }}>
                    {[
                        ['method', t('payment.step_method')],
                        ['confirm', t('payment.step_confirm')]
                    ].map(([step, label], index) => {
                        const active = step === 'confirm'
                            ? paymentStep === 'confirm' || paymentStep === 'truemoney'
                            : paymentStep === step;
                        const completed = step === 'method' && (paymentStep === 'confirm' || paymentStep === 'truemoney');
                        return (
                            <div
                                key={step}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '8px',
                                    padding: '10px',
                                    borderRadius: '14px',
                                    background: active || completed ? '#ECFDF5' : '#F8FAFC',
                                    border: `1px solid ${active || completed ? '#BBF7D0' : '#E2E8F0'}`
                                }}
                            >
                                <div style={{
                                    width: '24px',
                                    height: '24px',
                                    borderRadius: '999px',
                                    background: active || completed ? '#10b981' : '#CBD5E1',
                                    color: '#FFFFFF',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontWeight: 800,
                                    fontSize: '12px',
                                    flexShrink: 0
                                }}>
                                    {completed ? <CheckCircleFilled style={{ fontSize: '13px' }} /> : index + 1}
                                </div>
                                <Text strong style={{ fontSize: '12px', color: active || completed ? '#047857' : '#64748B' }}>
                                    {label}
                                </Text>
                            </div>
                        );
                    })}
                </div>

                {/* Payment Amount Card */}
                <div style={{ textAlign: 'center', margin: '10px 0 24px 0' }}>
                    <Text type="secondary" style={{ fontSize: '14px' }}>{t('payment.amount_to_pay')}</Text>
                    <Title level={1} style={{ margin: '4px 0', color: '#1f2937', fontSize: '36px' }}>
                        <span style={{ fontSize: '24px', marginRight: '4px', fontWeight: 400 }}>฿</span>
                        {amountToPay.toFixed(2)}
                    </Title>
                    <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '20px'
                    }}>
                        <Text style={{ fontSize: '12px', color: '#64748b' }}>{packageLabel}</Text>
                    </div>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginTop: '8px' }}>
                        {quotaLabel}
                    </Text>
                </div>

                {paymentStep === 'method' && (
                    <div style={{ marginBottom: '18px' }}>
                        <Text strong style={{ display: 'block', marginBottom: '10px', color: '#334155' }}>
                            {t('payment.select_payment_method')}
                        </Text>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            {[
                                {
                                    id: 'qr_code',
                                    icon: <QrcodeOutlined />,
                                    title: t('payment.method_qr_code'),
                                    desc: t('payment.method_qr_code_desc')
                                },
                                {
                                    id: 'true_money',
                                    icon: <WalletOutlined />,
                                    title: t('payment.method_true_money'),
                                    desc: t('payment.method_true_money_desc')
                                }
                            ].map((method) => {
                                const selected = selectedPaymentMethod === method.id;
                                return (
                                    <button
                                        key={method.id}
                                        type="button"
                                        onClick={() => {
                                            setSelectedPaymentMethod(method.id);
                                            if (method.id === 'true_money') {
                                                resetTrueMoneyFlow();
                                                setPaymentStep('truemoney');
                                            }
                                        }}
                                        style={{
                                            border: `2px solid ${selected ? '#10b981' : '#E2E8F0'}`,
                                            background: selected ? '#ECFDF5' : '#FFFFFF',
                                            borderRadius: '18px',
                                            padding: '14px',
                                            textAlign: 'left',
                                            minHeight: '118px',
                                            position: 'relative'
                                        }}
                                    >
                                        {selected && (
                                            <CheckCircleFilled style={{ position: 'absolute', top: '12px', right: '12px', color: '#10b981' }} />
                                        )}
                                        <div style={{ color: selected ? '#10b981' : '#94A3B8', fontSize: '28px', marginBottom: '10px' }}>
                                            {method.icon}
                                        </div>
                                        <Text strong style={{ display: 'block', color: selected ? '#047857' : '#0f172a', marginBottom: '4px' }}>
                                            {method.title}
                                        </Text>
                                        <Text type="secondary" style={{ fontSize: '12px', lineHeight: 1.4 }}>
                                            {method.desc}
                                        </Text>
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                )}

                {paymentStep === 'confirm' && (
                    <Card
                        style={{
                            borderRadius: '24px',
                            border: '1px solid #e2e8f0',
                            boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                            marginBottom: '24px',
                            overflow: 'hidden'
                        }}
                        styles={{ body: { padding: '32px 24px' } }}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                            {selectedPaymentMethod === 'qr_code' ? (
                                <>
                                    <div style={{
                                        padding: '12px',
                                        backgroundColor: '#fff',
                                        borderRadius: '16px',
                                        border: '1px solid #f8fafc'
                                    }}>
                                        <img
                                            src={qrImage}
                                            alt="Payment QR Code"
                                            style={{ width: '220px', height: '220px', display: 'block' }}
                                        />
                                    </div>

                                    <Space direction="vertical" align="center" size={4}>
                                        <Text strong style={{ fontSize: '16px' }}>{t('payment.scan_banking_title') || 'Scan with Banking App'}</Text>
                                        <Text type="secondary" style={{ fontSize: '13px' }}>{t('payment.scan_banking')}</Text>
                                    </Space>

                                    <Button
                                        icon={<DownloadOutlined />}
                                        onClick={handleDownloadQR}
                                        style={{
                                            borderRadius: '20px',
                                            color: '#10b981',
                                            borderColor: '#10b981'
                                        }}
                                    >
                                        {t('payment.save_image')}
                                    </Button>
                                </>
                            ) : (
                                <>
                                    <div style={{
                                        width: '128px',
                                        height: '128px',
                                        borderRadius: '32px',
                                        background: '#FFF7ED',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        border: '1px solid #FED7AA'
                                    }}>
                                        <WalletOutlined style={{ fontSize: '58px', color: '#F97316' }} />
                                    </div>
                                    <Space direction="vertical" align="center" size={4}>
                                        <Text strong style={{ fontSize: '16px' }}>{t('payment.true_money_title')}</Text>
                                        <Text type="secondary" style={{ fontSize: '13px', textAlign: 'center' }}>{t('payment.true_money_desc')}</Text>
                                    </Space>
                                </>
                            )}
                        </div>
                    </Card>
                )}

                {paymentStep === 'truemoney' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' }}>
                        <div style={{
                            padding: '14px 16px',
                            borderRadius: '18px',
                            background: '#FFF7ED',
                            border: '1px solid #FED7AA',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px'
                        }}>
                            <div style={{
                                width: '44px',
                                height: '44px',
                                borderRadius: '14px',
                                background: '#FFFFFF',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                flexShrink: 0
                            }}>
                                <WalletOutlined style={{ fontSize: '24px', color: '#F97316' }} />
                            </div>
                            <div>
                                <Text strong style={{ display: 'block', color: '#9A3412' }}>TrueMoney</Text>
                                <Text type="secondary" style={{ fontSize: '12px' }}>{t('payment.true_money_page_desc')}</Text>
                            </div>
                        </div>

                        <Card
                            style={{
                                borderRadius: '24px',
                                border: '1px solid #e2e8f0',
                                boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                                overflow: 'hidden'
                            }}
                            styles={{ body: { padding: '24px' } }}
                        >
                            <div style={{ textAlign: 'center' }}>
                                <div style={{
                                    width: '86px',
                                    height: '86px',
                                    borderRadius: '24px',
                                    background: '#FFF7ED',
                                    border: '1px solid #FED7AA',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    margin: '0 auto 16px'
                                }}>
                                    {trueMoneyStatus === 'authorizing' ? (
                                        <Spin indicator={<LoadingOutlined style={{ fontSize: 36, color: '#F97316' }} spin />} />
                                    ) : trueMoneyStatus === 'approved' ? (
                                        <CheckCircleFilled style={{ fontSize: '42px', color: '#10b981' }} />
                                    ) : trueMoneyStep === 'otp' ? (
                                        <QrcodeOutlined style={{ fontSize: '42px', color: '#F97316' }} />
                                    ) : (
                                        <WalletOutlined style={{ fontSize: '42px', color: '#F97316' }} />
                                    )}
                                </div>
                                <Text strong style={{ display: 'block', fontSize: '16px', color: '#111827', marginBottom: '8px' }}>
                                    {trueMoneyStep === 'mobile'
                                        ? t('payment.true_money_phone_title')
                                        : trueMoneyStep === 'otp'
                                            ? t('payment.true_money_otp_title')
                                            : t('payment.true_money_approved_title')}
                                </Text>
                                <Text type="secondary" style={{ display: 'block', fontSize: '13px', lineHeight: 1.5, marginBottom: '16px' }}>
                                    {trueMoneyStatus === 'authorizing'
                                        ? t('payment.true_money_authorizing_desc')
                                        : trueMoneyStatus === 'approved'
                                            ? t('payment.true_money_approved_desc')
                                            : trueMoneyStep === 'otp'
                                                ? t('payment.true_money_otp_desc')
                                                : t('payment.true_money_phone_desc')}
                                </Text>
                            </div>

                            <div style={{ background: '#F8FAFC', borderRadius: '16px', padding: '14px', border: '1px solid #E2E8F0' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                                    <Text type="secondary">{t('payment.true_money_merchant')}</Text>
                                    <Text strong>AMR Battery Swap</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '8px' }}>
                                    <Text type="secondary">{t('payment.true_money_package')}</Text>
                                    <Text strong style={{ textAlign: 'right' }}>{packageLabel}</Text>
                                </div>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px' }}>
                                    <Text type="secondary">{t('payment.amount_to_pay')}</Text>
                                    <Text strong style={{ color: '#F97316' }}>฿{amountToPay.toFixed(2)}</Text>
                                </div>
                            </div>

                            {trueMoneyStep === 'mobile' && (
                                <div style={{ marginTop: '16px' }}>
                                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                        {t('payment.true_money_phone_label')}
                                    </Text>
                                    <Input
                                        size="large"
                                        inputMode="numeric"
                                        maxLength={10}
                                        placeholder={t('payment.true_money_phone_placeholder')}
                                        value={trueMoneyPhone}
                                        onChange={(event) => {
                                            setTrueMoneyPhone(event.target.value.replace(/\D/g, '').slice(0, 10));
                                            setTrueMoneyError('');
                                        }}
                                        style={{ borderRadius: '14px' }}
                                    />
                                </div>
                            )}

                            {trueMoneyStep === 'otp' && trueMoneyStatus !== 'approved' && (
                                <div style={{ marginTop: '16px' }}>
                                    <Text strong style={{ display: 'block', marginBottom: '8px' }}>
                                        {t('payment.true_money_otp_label')}
                                    </Text>
                                    <Input
                                        size="large"
                                        inputMode="numeric"
                                        maxLength={6}
                                        placeholder={t('payment.true_money_otp_placeholder')}
                                        value={trueMoneyOtp}
                                        onChange={(event) => {
                                            setTrueMoneyOtp(event.target.value.replace(/\D/g, '').slice(0, 6));
                                            setTrueMoneyError('');
                                        }}
                                        style={{ borderRadius: '14px', letterSpacing: '8px', textAlign: 'center', fontWeight: 800 }}
                                    />
                                    <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginTop: '8px' }}>
                                        {t('payment.true_money_otp_hint')}
                                    </Text>
                                </div>
                            )}

                            {trueMoneyError && (
                                <Text type="danger" style={{ display: 'block', marginTop: '10px', fontSize: '13px', fontWeight: 600 }}>
                                    {trueMoneyError}
                                </Text>
                            )}
                        </Card>
                    </div>
                )}

                {/* Footer Actions */}
                <div style={{ marginTop: 'auto' }}>
                    {(paymentStep === 'confirm' || paymentStep === 'truemoney') && (
                        <Button
                            size="large"
                            block
                            icon={<SwapOutlined />}
                            style={{
                                height: '50px',
                                borderRadius: '18px',
                                marginBottom: '10px',
                                color: '#475569',
                                borderColor: '#CBD5E1',
                                fontWeight: 700
                            }}
                            onClick={handleChangePaymentMethod}
                        >
                            {t('payment.change_payment_method')}
                        </Button>
                    )}
                    <Button
                        type="primary"
                        size="large"
                        block
                        loading={paymentStatus === 'pending' || trueMoneyStatus === 'authorizing'}
                        disabled={paymentStep === 'truemoney' && trueMoneyStatus === 'approved'}
                        icon={paymentStep === 'method' ? <ArrowRightOutlined /> : null}
                        style={{
                            height: '56px',
                            borderRadius: '28px',
                            backgroundColor: '#10b981',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginBottom: '12px'
                        }}
                        onClick={() => {
                            if (paymentStep === 'method') {
                                setPaymentStep(selectedPaymentMethod === 'true_money' ? 'truemoney' : 'confirm');
                                return;
                            }
                            if (paymentStep === 'truemoney') {
                                if (trueMoneyStep === 'mobile') {
                                    handleTrueMoneyPhoneSubmit();
                                    return;
                                }
                                handleTrueMoneyOtpSubmit();
                                return;
                            }
                            handlePaymentStart();
                        }}
                    >
                        {paymentStep === 'method'
                            ? t('common.next')
                            : paymentStep === 'truemoney'
                                ? trueMoneyStep === 'mobile'
                                    ? t('payment.true_money_phone_button')
                                    : trueMoneyStatus === 'approved'
                                        ? t('payment.true_money_approved_short')
                                        : t('payment.true_money_otp_button')
                                : t('payment.start_payment')}
                    </Button>
                    <Button
                        type="text"
                        block
                        style={{ color: '#6b7280' }}
                        onClick={() => {
                            Modal.confirm({
                                title: t('payment.cancel_confirm_title'),
                                content: t('payment.cancel_confirm_desc'),
                                okText: t('common.ok'),
                                cancelText: t('common.cancel'),
                                centered: true,
                                onOk: () => navigate(returnPath.includes('screen4') ? returnPath.replace('/screen4', '/screen11') : '/screen11'),
                                okButtonProps: {
                                    danger: true,
                                    style: { borderRadius: '8px' }
                                },
                                cancelButtonProps: {
                                    style: { borderRadius: '8px' }
                                }
                            });
                        }}
                    >
                        {t('payment.cancel_payment')}
                    </Button>
                </div>

            </div>
        </MobileLayout>
    );
};

export default Screen4;
