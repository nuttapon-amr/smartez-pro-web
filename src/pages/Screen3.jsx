import React, { useState, useEffect } from 'react';
import { Button, Typography, Space, Divider, Modal, Input } from 'antd';
import { EditOutlined, SafetyCertificateOutlined } from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import useAuth from '../hooks/useAuth';
import OTPInput from '../components/OTPInput';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getPostAuthSwapTarget } from '../utils/swapAccess';

const { Title, Text } = Typography;

const Screen2 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const mode = searchParams.get('mode'); // 'register' or 'reset'
    const { phone, otp, setOtp, verifyOtp, isLoading, login, editPhone, resendOtp, error } = useAuth();
    const [countdown, setCountdown] = useState(60);
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const getPostAuthTarget = () => {
        return getPostAuthSwapTarget(searchParams.get('cabinetId'));
    };

    useEffect(() => {
        const modeLabel = mode === 'reset' ? t('screen1.otp_mode_reset') : t('screen1.otp_mode_register');
        document.title = `${t('screen2.title')} (${modeLabel}) | AMR Battery Swap`;

        // If phone is missing, it's an invalid access to this screen
        if (!phone) {
            const savedCabinetId = localStorage.getItem('currentCabinetId') || localStorage.getItem('currentChargerId');
            if (savedCabinetId) {
                navigate(`/screen1?cabinetId=${savedCabinetId}`, { replace: true });
            } else {
                navigate('/screen1', { replace: true });
            }
            return;
        }

        // Automatically send OTP when screen 2 loads if phone exists
        login();
    }, [login, mode, navigate, phone, t]);

    useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setInterval(() => {
                setCountdown(prev => prev - 1);
            }, 1000);
        }
        return () => clearInterval(timer);
    }, [countdown]);

    const handleResend = () => {
        if (countdown === 0) {
            Modal.confirm({
                title: t('screen2.resend_button'),
                content: `${t('screen2.desc')} ${formatPhone(phone)}`,
                okText: t('common.confirm'),
                cancelText: t('common.cancel'),
                centered: true,
                onOk: () => {
                    resendOtp();
                    setCountdown(60);
                }
            });
        }
    };

    const handleVerify = async () => {
        const result = await verifyOtp();
        if (result?.success) {
            setIsPasswordModalOpen(true);
        }
    };

    const handleSavePassword = () => {
        if (!newPassword) {
            setPasswordError(t('screen2.password_required'));
            return;
        }
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*]).{8,}$/;
        if (!passwordRegex.test(newPassword)) {
            setPasswordError(t('screen2.password_complexity'));
            return;
        }

        if (newPassword !== confirmPassword) {
            setPasswordError(t('screen2.password_mismatch'));
            return;
        }

        // Success: save password (mock) and proceed
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('lastLoginPhone', phone);

        const target = getPostAuthTarget();
        navigate(target.path, { replace: true, state: target.state });
    };

    const formatPhone = (p) => {
        if (!p) return '';
        return p.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    };

    return (
        <MobileLayout>
            <div style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                background: 'linear-gradient(180deg, #FFF5F5 0%, #FFFFFF 100%)',
                fontFamily: "'Prompt', sans-serif"
            }}>

                {/* Language Toggle for Screen2 (No Header) */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '10px' }}>
                    <Button
                        type="text"
                        onClick={() => i18n.changeLanguage(i18n.language === 'th' ? 'en' : 'th')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: 'rgba(255, 255, 255, 0.8)',
                            borderRadius: '12px',
                            padding: '4px 12px',
                            height: 'auto',
                            boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                        }}
                    >
                        <span style={{ fontSize: '18px' }}>
                            {i18n.language === 'th' ? '🇹🇭' : '🇬🇧'}
                        </span>
                        <Text strong style={{ fontSize: '13px', color: '#1f2937' }}>
                            {i18n.language === 'th' ? 'TH' : 'EN'}
                        </Text>
                    </Button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', marginTop: '40px' }}>

                    {/* Security Icon Badge */}
                    <div style={{
                        width: '120px',
                        height: '120px',
                        backgroundColor: '#FFFFFF',
                        borderRadius: '40px',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '32px',
                        boxShadow: '0 12px 24px rgba(239, 68, 68, 0.12)',
                        border: '2px solid #FEE2E2',
                        transform: 'rotate(-5deg)'
                    }}>
                        <div style={{ transform: 'rotate(5deg)' }}>
                            <SafetyCertificateOutlined style={{ fontSize: '48px', color: '#EF4444' }} />
                        </div>
                    </div>

                    <div style={{ textAlign: 'center' }}>
                        <Title level={3} style={{ color: '#111827', margin: '0 0 8px 0', fontWeight: 700 }}>
                            {t('screen2.title')}
                            <div style={{ fontSize: '14px', color: '#6B7280', fontWeight: 500, marginTop: '4px' }}>
                                ({mode === 'reset' ? t('screen1.otp_mode_reset') : t('screen1.otp_mode_register')})
                            </div>
                        </Title>
                    </div>

                    <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                        <Text type="secondary" style={{ display: 'block' }}>{t('screen2.desc')}</Text>
                        <Space align="center" style={{ marginTop: '4px' }}>
                            <Text strong style={{ fontSize: '18px', color: '#EF4444' }}>{formatPhone(phone)}</Text>
                            <Button
                                type="text"
                                icon={<EditOutlined />}
                                size="small"
                                onClick={editPhone}
                                style={{ color: '#6B7280', display: 'flex', alignItems: 'center' }}
                            >
                                {t('common.edit')}
                            </Button>
                        </Space>
                    </div>

                    <div style={{ marginBottom: '40px', width: '100%', display: 'flex', justifyContent: 'center' }}>
                        <OTPInput
                            length={6}
                            value={otp}
                            onChange={(val) => {
                                setOtp(val);
                                if (val.length === 6) {
                                    handleVerify();
                                }
                            }}
                        />
                    </div>

                    {error && (
                        <div style={{
                            textAlign: 'center',
                            color: '#EF4444',
                            fontSize: '14px',
                            marginTop: '-24px',
                            marginBottom: '24px',
                            fontWeight: '500'
                        }}>
                            {error}
                        </div>
                    )}

                    <div style={{ textAlign: 'center', width: '100%' }}>
                        <Divider style={{ margin: '0 0 24px 0' }} />
                        <Text type="secondary" style={{ fontSize: '14px' }}>{t('screen2.resend_desc')}</Text>
                        <div style={{ marginTop: '8px' }}>
                            {countdown > 0 ? (
                                <Text style={{ color: '#9CA3AF' }}>{t('screen2.countdown', { seconds: countdown })}</Text>
                            ) : (
                                <Button
                                    type="link"
                                    onClick={handleResend}
                                    style={{
                                        color: '#EF4444',
                                        fontWeight: 600,
                                        padding: 0,
                                        height: 'auto'
                                    }}
                                >
                                    {t('screen2.resend_button')}
                                </Button>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer Action Button */}
                <div style={{ marginTop: 'auto', paddingBottom: '24px' }}>
                    <Button
                        type="primary"
                        size="large"
                        block
                        loading={isLoading}
                        disabled={otp.length !== 6}
                        onClick={handleVerify}
                        style={{
                            height: '60px',
                            borderRadius: '20px',
                            backgroundColor: otp.length !== 6 ? '#E5E7EB' : '#EF4444',
                            borderColor: otp.length !== 6 ? '#E5E7EB' : '#EF4444',
                            color: otp.length !== 6 ? '#9CA3AF' : '#FFFFFF',
                            fontSize: '18px',
                            fontWeight: 700,
                            boxShadow: otp.length !== 6 ? 'none' : '0 12px 20px rgba(239, 68, 68, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                        }}
                    >
                        {t('screen2.verify_button')}
                    </Button>
                </div>

                {/* Password Setting Modal */}
                <Modal
                    title={<Title level={4} style={{ margin: 0 }}>{t('screen2.set_password_title')}</Title>}
                    open={isPasswordModalOpen}
                    onOk={handleSavePassword}
                    okText={t('common.save')}
                    cancelText={t('common.cancel')}
                    closeIcon={false}
                    maskClosable={false}
                    centered
                    okButtonProps={{
                        style: {
                            height: '45px',
                            borderRadius: '12px',
                            background: '#EF4444',
                            borderColor: '#EF4444',
                            fontWeight: 600
                        }
                    }}
                    cancelButtonProps={{ style: { display: 'none' } }}
                >
                    <div style={{ padding: '10px 0' }}>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '8px' }}>
                            {t('screen2.set_password_desc')}
                        </Text>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '20px', fontSize: '13px', color: '#6B7280' }}>
                            <span style={{ color: '#EF4444', marginRight: '4px' }}>*</span>
                            {t('screen2.password_complexity')}
                        </Text>

                        <Space direction="vertical" style={{ width: '100%' }} size={16}>
                            <div>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>{t('screen2.new_password')}</Text>
                                <Input.Password
                                    size="large"
                                    placeholder={t('screen2.new_password')}
                                    value={newPassword}
                                    onChange={(e) => {
                                        setNewPassword(e.target.value);
                                        setPasswordError('');
                                    }}
                                    style={{ borderRadius: '12px' }}
                                />
                            </div>

                            <div>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>{t('screen2.confirm_password')}</Text>
                                <Input.Password
                                    size="large"
                                    placeholder={t('screen2.confirm_password')}
                                    value={confirmPassword}
                                    onChange={(e) => {
                                        setConfirmPassword(e.target.value);
                                        setPasswordError('');
                                    }}
                                    style={{ borderRadius: '12px' }}
                                />
                            </div>

                            {passwordError && (
                                <Text type="danger" style={{ fontSize: '13px', fontWeight: 500 }}>
                                    {passwordError}
                                </Text>
                            )}
                        </Space>
                    </div>
                </Modal>

            </div>
        </MobileLayout>
    );
};

export default Screen2;
