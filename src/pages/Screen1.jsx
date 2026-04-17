import React, { useState } from 'react';
import { Button, Input, Modal, Typography } from 'antd';
import { LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MobileLayout from '../components/MobileLayout';
import useAuth from '../hooks/useAuth';

const { Title, Text } = Typography;

const Screen1 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { phone, setPhone, isLoading } = useAuth();
    const [mode, setMode] = useState('password');
    const [password, setPassword] = useState('');

    const cabinetId = searchParams.get('cabinetId') || localStorage.getItem('currentCabinetId') || localStorage.getItem('currentChargerId');

    const getPostAuthTarget = () => {
        const from = location.state?.from;
        if (from?.pathname && from.pathname !== '/screen1' && from.pathname !== '/screen3') {
            return {
                path: `${from.pathname}${from.search || ''}`,
                state: from.state,
            };
        }

        const hasActiveSwap = localStorage.getItem('activeSwapSession') === 'true'
            || localStorage.getItem('isCharging') === 'true';

        if (hasActiveSwap) return { path: '/screen6' };
        if (cabinetId) return { path: `/screen2?cabinetId=${cabinetId}` };
        return { path: '/screen2' };
    };

    const handleRegister = () => {
        if (phone.length !== 10) {
            Modal.error({ title: t('common.error'), content: t('auth.error_phone_invalid'), centered: true });
            return;
        }

        localStorage.setItem('userPhone', phone);
        if (cabinetId) localStorage.setItem('currentCabinetId', cabinetId);

        const otpPath = cabinetId
            ? `/screen3?cabinetId=${cabinetId}&mode=register`
            : '/screen3?mode=register';
        navigate(otpPath, { state: { from: location.state?.from } });
    };

    const handlePasswordLogin = () => {
        if (phone.length !== 10) {
            Modal.error({ title: t('common.error'), content: t('auth.error_phone_invalid'), centered: true });
            return;
        }

        if (password !== '123456') {
            Modal.error({
                title: t('screen1.password_invalid_title'),
                content: t('screen1.password_invalid_desc'),
                centered: true,
                okText: t('common.retry'),
            });
            return;
        }

        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userPhone', phone);
        if (cabinetId) localStorage.setItem('currentCabinetId', cabinetId);

        const target = getPostAuthTarget();
        navigate(target.path, { replace: true, state: target.state });
    };

    return (
        <MobileLayout>
            <div style={{ minHeight: '100vh', padding: '24px', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 100%)' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
                    <Button
                        type="text"
                        onClick={() => i18n.changeLanguage(i18n.language === 'th' ? 'en' : 'th')}
                        style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '12px', height: 'auto', padding: '4px 12px', fontWeight: 700 }}
                    >
                        {i18n.language === 'th' ? 'TH' : 'EN'}
                    </Button>
                </div>

                <div style={{ marginBottom: '32px' }}>
                    <Text type="secondary" style={{ fontSize: '13px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                        AMR Battery Swap
                    </Text>
                    <Title level={2} style={{ margin: '8px 0 8px 0', color: '#0f172a', lineHeight: 1.15 }}>
                        {mode === 'register' ? t('screen1.otp_mode') : t('screen1.login_button')}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                        {mode === 'register' ? t('screen1.login_otp_desc') : t('screen1.login_password_desc')}
                    </Text>
                </div>

                <div style={{ display: 'flex', background: '#F3F4F6', padding: '4px', borderRadius: '16px', marginBottom: '24px' }}>
                    <button
                        type="button"
                        onClick={() => setMode('register')}
                        style={{ flex: 1, border: 0, padding: '12px 0', borderRadius: '12px', background: mode === 'register' ? '#fff' : 'transparent', color: mode === 'register' ? '#10b981' : '#64748b', fontWeight: 800 }}
                    >
                        {t('screen1.otp_mode')}
                    </button>
                    <button
                        type="button"
                        onClick={() => setMode('password')}
                        style={{ flex: 1, border: 0, padding: '12px 0', borderRadius: '12px', background: mode === 'password' ? '#fff' : 'transparent', color: mode === 'password' ? '#10b981' : '#64748b', fontWeight: 800 }}
                    >
                        {t('screen1.password_mode')}
                    </button>
                </div>

                <div style={{ flex: 1 }}>
                    <Text strong style={{ display: 'block', marginBottom: '10px', color: '#334155' }}>{t('common.phone')}</Text>
                    <Input
                        size="large"
                        placeholder="08X-XXX-XXXX"
                        prefix={<PhoneOutlined style={{ color: '#10b981', marginRight: '8px' }} />}
                        value={phone}
                        onChange={(event) => setPhone(event.target.value)}
                        maxLength={10}
                        inputMode="numeric"
                        style={{ height: '60px', borderRadius: '18px', fontSize: '20px', marginBottom: mode === 'password' ? '18px' : 0 }}
                    />

                    {mode === 'password' && (
                        <>
                            <Text strong style={{ display: 'block', marginBottom: '10px', color: '#334155' }}>{t('common.password')}</Text>
                            <Input.Password
                                size="large"
                                placeholder={t('screen1.password_placeholder')}
                                prefix={<LockOutlined style={{ color: '#10b981', marginRight: '8px' }} />}
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                                style={{ height: '60px', borderRadius: '18px', fontSize: '16px' }}
                            />
                            <div style={{ textAlign: 'right', marginTop: '10px' }}>
                                <Button
                                    type="link"
                                    style={{ padding: 0, color: '#10b981', fontWeight: 700 }}
                                    onClick={() => {
                                        if (phone.length !== 10) {
                                            Modal.error({ title: t('common.error'), content: t('auth.error_phone_invalid'), centered: true });
                                            return;
                                        }
                                        localStorage.setItem('userPhone', phone);
                                        const resetPath = cabinetId
                                            ? `/screen3?cabinetId=${cabinetId}&mode=reset`
                                            : '/screen3?mode=reset';
                                        navigate(resetPath, { state: { from: location.state?.from } });
                                    }}
                                >
                                    {t('screen1.forgot_password')}
                                </Button>
                            </div>
                        </>
                    )}
                </div>

                <Button
                    type="primary"
                    size="large"
                    block
                    loading={isLoading}
                    disabled={phone.length !== 10 || (mode === 'password' && !password)}
                    onClick={mode === 'register' ? handleRegister : handlePasswordLogin}
                    style={{ height: '60px', borderRadius: '20px', background: '#10b981', border: 'none', fontSize: '18px', fontWeight: 800 }}
                >
                    {mode === 'register' ? t('common.next') : t('screen1.login_button')}
                </Button>
            </div>
        </MobileLayout>
    );
};

export default Screen1;
