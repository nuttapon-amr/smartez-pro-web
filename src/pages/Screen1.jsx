import React, { useState } from 'react';
import { Button, Input, Modal, Typography } from 'antd';
import { LockOutlined, PhoneOutlined } from '@ant-design/icons';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MobileLayout from '../components/MobileLayout';
import useAuth from '../hooks/useAuth';
import { getPostAuthSwapTarget } from '../utils/swapAccess';

const { Title, Text } = Typography;

const Screen1 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const { phone, setPhone, isLoading } = useAuth();
    const [password, setPassword] = useState('');

    const cabinetId = searchParams.get('cabinetId');

    const getPostAuthTarget = () => {
        return getPostAuthSwapTarget(cabinetId);
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
        localStorage.setItem('lastLoginPhone', phone);
        if (cabinetId) localStorage.setItem('currentCabinetId', cabinetId);

        const target = getPostAuthTarget();
        navigate(target.path, { replace: true, state: target.state });
    };

    if (!cabinetId) {
        return <Navigate to="/404" replace />;
    }

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
                        {t('screen1.login_button')}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                        {t('screen1.login_password_desc')}
                    </Text>
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
                        style={{ height: '60px', borderRadius: '18px', fontSize: '20px', marginBottom: '18px' }}
                    />

                    <Text strong style={{ display: 'block', marginBottom: '10px', color: '#334155' }}>{t('common.password')}</Text>
                    <Input.Password
                        size="large"
                        placeholder={t('screen1.password_placeholder')}
                        prefix={<LockOutlined style={{ color: '#10b981', marginRight: '8px' }} />}
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        style={{ height: '60px', borderRadius: '18px', fontSize: '16px' }}
                    />
                </div>

                <Button
                    type="primary"
                    size="large"
                    block
                    loading={isLoading}
                    disabled={phone.length !== 10 || !password}
                    onClick={handlePasswordLogin}
                    style={{ height: '60px', borderRadius: '20px', background: '#10b981', border: 'none', fontSize: '18px', fontWeight: 800 }}
                >
                    {t('screen1.login_button')}
                </Button>
            </div>
        </MobileLayout>
    );
};

export default Screen1;
