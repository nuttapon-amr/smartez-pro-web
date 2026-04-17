import React, { useEffect, useState } from 'react';
import { Card, Input, Button, Typography, Space, Tag, Divider, Spin, Result, Modal } from 'antd';
import {
    PhoneOutlined,
    EnvironmentOutlined,
    DollarCircleOutlined,
    ThunderboltOutlined,
    CheckCircleFilled,
    CloseCircleFilled,
    ExclamationCircleFilled,
    StopOutlined,
    LockOutlined
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import useAuth from '../hooks/useAuth';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { SWAP_CABINETS } from '../data/mockSwapData';

const { Title, Text } = Typography;

const SlotStat = ({ label, value, color }) => (
    <div style={{ background: '#F9FAFB', borderRadius: '14px', padding: '10px 8px', textAlign: 'center', border: '1px solid #F1F5F9' }}>
        <Text type="secondary" style={{ display: 'block', fontSize: '11px', marginBottom: '2px' }}>{label}</Text>
        <Text strong style={{ fontSize: '18px', color }}>{value}</Text>
    </div>
);

const Screen1 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { phone, setPhone, isLoading } = useAuth();
    const [searchParams] = useSearchParams();
    const [isScreenLoading, setIsScreenLoading] = useState(true);
    const [error, setError] = useState(null); // 'missing' or 'invalid'
    const [loginMode, setLoginMode] = useState('otp'); // 'otp' or 'password'
    const [password, setPassword] = useState('');

    const cabinetId = searchParams.get('cabinetId') || searchParams.get('chargerId');
    const stationInfo = SWAP_CABINETS[cabinetId] || null;

    useEffect(() => {
        const timer = setTimeout(() => {
            if (!cabinetId) {
                setError('missing');
            } else if (!stationInfo) {
                setError('invalid');
            }
            setIsScreenLoading(false);
        }, 1500);

        if (stationInfo) {
            document.title = `${stationInfo.name} | AMR Battery Swap`;
            // Save current cabinet id to remember it if user edits phone later.
            localStorage.setItem('currentCabinetId', cabinetId);
        } else {
            document.title = `${t('screen1.login_button')} | AMR Battery Swap`;
        }

        return () => clearTimeout(timer);
    }, [cabinetId, stationInfo, t]);

    const getStatusConfig = (status) => {
        switch (status) {
            case "READY":
                return {
                    color: "#10B981", // More vibrant green
                    icon: <CheckCircleFilled />,
                    shadow: '0 4px 12px rgba(16, 185, 129, 0.25)',
                    bg: 'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 100%)',
                    isAvailable: true,
                    label: t('screen1.status_available')
                };
            case "CLOSED":
                return {
                    color: "#F59E0B", // Amber/Orange for warning
                    icon: <ExclamationCircleFilled />,
                    shadow: '0 4px 12px rgba(245, 158, 11, 0.25)',
                    bg: 'linear-gradient(180deg, #FFFBEB 0%, #FFFFFF 100%)',
                    isAvailable: false,
                    label: t('screen1.status_unavailable')
                };
            case "OFFLINE":
                return {
                    color: "#6B7280", // Stronger gray
                    icon: <StopOutlined />,
                    shadow: '0 4px 12px rgba(107, 114, 128, 0.2)',
                    bg: 'linear-gradient(180deg, #F3F4F6 0%, #FFFFFF 100%)',
                    isAvailable: false,
                    label: t('screen1.status_offline')
                };
            default:
                return {
                    color: "#9CA3AF",
                    icon: <ExclamationCircleFilled />,
                    shadow: '0 4px 12px rgba(156, 163, 175, 0.15)',
                    bg: 'linear-gradient(180deg, #F9FAFB 0%, #FFFFFF 100%)',
                    isAvailable: false,
                    label: status
                };
        }
    };

    const statusConfig = stationInfo ? getStatusConfig(stationInfo.status) : getStatusConfig("OFFLINE");

    const handlePhoneChange = (e) => {
        setPhone(e.target.value);
    };

    const handleNext = () => {
        if (!statusConfig.isAvailable) return;

        if (loginMode === 'otp') {
            const existingUsers = ['0812345678', '0987654321', '0888888888']; // Mock existing users
            if (existingUsers.includes(phone)) {
                setLoginMode('password');
            } else {
                localStorage.setItem('userPhone', phone);
                navigate(`/screen2?cabinetId=${cabinetId}&mode=register`);
            }
        } else {
            // Mock password login logic
            // For demo: only '123456' is the correct password
            if (password === '123456') {
                localStorage.setItem('isLoggedIn', 'true');
                localStorage.setItem('userPhone', phone);
                const hasActiveSwap = localStorage.getItem('activeSwapSession') === 'true'
                    || localStorage.getItem('isCharging') === 'true';
                navigate(hasActiveSwap ? '/screen5' : '/screen3');
            } else {
                Modal.error({
                    title: t('screen1.password_invalid_title'),
                    content: t('screen1.password_invalid_desc'),
                    centered: true,
                    okText: t('common.retry'),
                    borderRadius: 16
                });
            }
        }
    };

    if (isScreenLoading) {
        return (
            <div style={{
                height: '100vh',
                display: 'flex',
                flexDirection: 'column',
                padding: '24px',
                width: '100%',
            }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                    <Button
                        type="text"
                        onClick={() => i18n.changeLanguage(i18n.language === 'th' ? 'en' : 'th')}
                        style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#f3f4f6',
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
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' }}>
                    <Spin size="large" />
                    <Text style={{ marginTop: '16px', color: '#6B7280' }}>{t('screen1.station_loading')}</Text>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <MobileLayout>
                <div style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    background: '#FFFFFF'
                }}>
                    {/* Language Toggle for Error Screen */}
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <Button
                            type="text"
                            onClick={() => i18n.changeLanguage(i18n.language === 'th' ? 'en' : 'th')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: '#f3f4f6',
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

                    <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <Result
                            status="warning"
                            title={error === 'missing' ? t('screen1.missing_charger_title') : t('screen1.invalid_charger_title')}
                            subTitle={error === 'missing' ? t('screen1.missing_charger_desc') : t('screen1.invalid_charger_desc')}
                            extra={
                                <div style={{ color: '#9CA3AF', fontSize: '12px' }}>
                                    {t('screen1.ref_code')}: {cabinetId || 'Unknown'}
                                </div>
                            }
                        />
                    </div>
                </div>
            </MobileLayout>
        );
    }

    return (
        <MobileLayout>
            <div style={{
                padding: '24px',
                display: 'flex',
                flexDirection: 'column',
                minHeight: '100vh',
                background: statusConfig.bg,
                fontFamily: "'Prompt', sans-serif"
            }}>

                {/* Language Toggle for Screen1 (No Header) */}
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

                {/* Status Badge */}
                <div style={{ display: 'flex', justifyContent: 'center', marginTop: '10px', marginBottom: '25px' }}>
                    <div style={{
                        backgroundColor: statusConfig.color,
                        borderRadius: '30px',
                        padding: '8px 24px',
                        fontSize: '16px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '10px',
                        boxShadow: statusConfig.shadow,
                        fontWeight: 700,
                        color: '#fff',
                        border: '2px solid rgba(255, 255, 255, 0.2)',
                        transition: 'all 0.3s ease',
                        animation: statusConfig.isAvailable ? 'pulse-green 2s infinite' : 'none'
                    }}>
                        <span style={{ fontSize: '18px', display: 'flex' }}>{statusConfig.icon}</span>
                        <span style={{ letterSpacing: '0.5px' }}>{statusConfig.label.toUpperCase()}</span>
                    </div>
                </div>

                <style>{`
                    @keyframes pulse-green {
                        0% { transform: scale(1); boxShadow: 0 4px 12px rgba(16, 185, 129, 0.25); }
                        50% { transform: scale(1.05); boxShadow: 0 8px 20px rgba(16, 185, 129, 0.4); }
                        100% { transform: scale(1); boxShadow: 0 4px 12px rgba(16, 185, 129, 0.25); }
                    }
                `}</style>

                {/* Station Info Card */}
                <Card style={{
                    borderRadius: '24px',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)',
                    border: `1px solid ${statusConfig.isAvailable ? '#FEE2E2' : '#E5E7EB'}`,
                    marginBottom: '18px',
                    overflow: 'hidden',
                    opacity: statusConfig.isAvailable ? 1 : 0.8
                }} styles={{ body: { padding: '20px' } }}>
                    <Space orientation="vertical" size={16} style={{ width: '100%' }}>
                        <div>
                            <Text type="secondary" style={{ fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>
                                {t('screen1.station_label')}
                            </Text>
                            <Title level={4} style={{ margin: '4px 0 0 0', color: '#111827', fontWeight: 700 }}>
                                {stationInfo.name}
                            </Title>
                        </div>

                        <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                            <div style={{
                                backgroundColor: '#FEF2F2',
                                padding: '8px',
                                borderRadius: '10px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <EnvironmentOutlined style={{ color: '#EF4444' }} />
                            </div>
                            <Text style={{ color: '#6B7280', fontSize: '13px', lineHeight: '1.5' }}>
                                {stationInfo.address}
                            </Text>
                        </div>

                        <Divider style={{ margin: '8px 0' }} />

                        <div style={{
                            backgroundColor: '#F9FAFB',
                            padding: '12px 16px',
                            borderRadius: '16px',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                        }}>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                                <Space size={8}>
                                    <ThunderboltOutlined style={{ color: statusConfig.isAvailable ? '#EF4444' : '#9CA3AF', fontSize: '18px' }} />
                                    <Text strong style={{ color: '#374151' }}>{t('screen1.charger_type_label')}</Text>
                                </Space>
                                <div style={{ paddingLeft: '26px' }}>
                                    <Text strong style={{ fontSize: '15px', color: '#111827' }}>
                                        {stationInfo.batteryModel}
                                    </Text>
                                </div>
                            </div>

                            <div style={{
                                borderLeft: '1px solid #E5E7EB',
                                paddingLeft: '16px',
                                marginLeft: '8px',
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'center',
                                minWidth: '60px'
                            }}>
                                <Text style={{ fontSize: '12px', color: '#6B7280' }}>{t('screen1.connector_label')}</Text>
                                <Text strong style={{ fontSize: '24px', lineHeight: '1.2', color: statusConfig.isAvailable ? '#EF4444' : '#9CA3AF' }}>
                                    {stationInfo.fullBatteries}
                                </Text>
                            </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                            <SlotStat label={t('screen1.slot_full')} value={stationInfo.fullBatteries} color="#10b981" />
                            <SlotStat label={t('screen1.slot_empty')} value={stationInfo.emptySlots} color="#64748b" />
                            <SlotStat label={t('screen1.slot_fault')} value={stationInfo.faultSlots} color="#f59e0b" />
                        </div>

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            backgroundColor: '#F9FAFB',
                            padding: '12px 16px',
                            borderRadius: '16px'
                        }}>
                            <Space size={8}>
                                <DollarCircleOutlined style={{ color: statusConfig.isAvailable ? '#10B981' : '#9CA3AF', fontSize: '18px' }} />
                                <Text strong style={{ color: '#374151' }}>{t('screen1.price_label')}</Text>
                            </Space>
                            <Text strong style={{ fontSize: '18px', color: statusConfig.isAvailable ? '#EF4444' : '#9CA3AF' }}>
                                {stationInfo.price} <span style={{ fontSize: '12px', color: '#9CA3AF', fontWeight: 400 }}>{t('charging.unit_baht')}/{t('charging.unit_swap')}</span>
                            </Text>
                        </div>
                    </Space>
                </Card>



                {/* Login Mode Toggle */}
                <div style={{
                    display: 'flex',
                    background: '#F3F4F6',
                    padding: '4px',
                    borderRadius: '16px',
                    marginBottom: '24px'
                }}>
                    <div
                        onClick={() => setLoginMode('otp')}
                        style={{
                            flex: 1,
                            padding: '10px 0',
                            textAlign: 'center',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            background: loginMode === 'otp' ? '#FFFFFF' : 'transparent',
                            color: loginMode === 'otp' ? '#EF4444' : '#6B7280',
                            boxShadow: loginMode === 'otp' ? '0 4px 6px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        {t('screen1.otp_mode')}
                    </div>
                    <div
                        onClick={() => setLoginMode('password')}
                        style={{
                            flex: 1,
                            padding: '10px 0',
                            textAlign: 'center',
                            borderRadius: '12px',
                            cursor: 'pointer',
                            fontSize: '14px',
                            fontWeight: 600,
                            transition: 'all 0.3s ease',
                            background: loginMode === 'password' ? '#FFFFFF' : 'transparent',
                            color: loginMode === 'password' ? '#EF4444' : '#6B7280',
                            boxShadow: loginMode === 'password' ? '0 4px 6px rgba(0,0,0,0.05)' : 'none'
                        }}
                    >
                        {t('screen1.password_mode')}
                    </div>
                </div>

                {/* Input Section */}
                <div style={{ flex: 1 }}>
                    <div style={{ marginBottom: '10px', paddingLeft: '4px' }}>
                        <Text strong style={{ color: statusConfig.isAvailable ? '#374151' : '#9CA3AF', fontSize: '15px' }}>{t('common.phone')}</Text>
                    </div>
                    <Input
                        size="large"
                        placeholder="08X-XXX-XXXX"
                        prefix={<PhoneOutlined style={{ color: statusConfig.isAvailable ? '#EF4444' : '#9CA3AF', marginRight: '8px' }} />}
                        value={statusConfig.isAvailable ? phone : ''}
                        onChange={handlePhoneChange}
                        maxLength={10}
                        inputMode="numeric"
                        disabled={!statusConfig.isAvailable}
                        style={{
                            borderRadius: '18px',
                            height: '60px',
                            border: '2px solid #F3F4F6',
                            fontSize: '20px',
                            letterSpacing: '1px',
                            backgroundColor: statusConfig.isAvailable ? '#FFFFFF' : '#F9FAFB',
                            boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                            marginBottom: loginMode === 'password' ? '20px' : '0'
                        }}
                        className="custom-phone-input"
                    />

                    {loginMode === 'password' && (
                        <>
                            <div style={{ marginBottom: '10px', paddingLeft: '4px' }}>
                                <Text strong style={{ color: statusConfig.isAvailable ? '#374151' : '#9CA3AF', fontSize: '15px' }}>{t('common.password')}</Text>
                            </div>
                            <Input.Password
                                size="large"
                                placeholder={t('screen1.password_placeholder')}
                                prefix={<LockOutlined style={{ color: statusConfig.isAvailable ? '#EF4444' : '#9CA3AF', marginRight: '8px' }} />}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={!statusConfig.isAvailable}
                                style={{
                                    borderRadius: '18px',
                                    height: '60px',
                                    border: '2px solid #F3F4F6',
                                    fontSize: '16px',
                                    backgroundColor: statusConfig.isAvailable ? '#FFFFFF' : '#F9FAFB',
                                    boxShadow: '0 4px 6px rgba(0,0,0,0.02)',
                                }}
                            />
                            <div style={{ textAlign: 'right', marginTop: '8px' }}>
                                <Button
                                    type="link"
                                    disabled={!statusConfig.isAvailable}
                                    style={{ padding: 0, height: 'auto', color: '#EF4444' }}
                                    onClick={() => {
                                        if (phone.length === 10) {
                                            localStorage.setItem('userPhone', phone);
                                            navigate(`/screen2?cabinetId=${cabinetId}&mode=reset`);
                                        } else {
                                            Modal.error({ title: t('common.error'), content: t('auth.error_phone_invalid'), centered: true });
                                        }
                                    }}
                                >
                                    {t('screen1.forgot_password')}
                                </Button>
                            </div>
                        </>
                    )}

                    <div style={{ marginTop: '16px', padding: '0 8px' }}>
                        <Text type="secondary" style={{ fontSize: '13px', textAlign: 'center', display: 'block', lineHeight: '1.6' }}>
                            {loginMode === 'otp'
                                ? t('screen1.login_otp_desc')
                                : t('screen1.login_password_desc')}
                        </Text>
                    </div>
                </div>

                {/* Action Button */}
                <div style={{ marginTop: '24px', paddingBottom: '24px' }}>
                    <Button
                        type="primary"
                        size="large"
                        block
                        loading={isLoading}
                        disabled={!statusConfig.isAvailable || phone.length !== 10 || (loginMode === 'password' && !password)}
                        onClick={handleNext}
                        style={{
                            height: '60px',
                            borderRadius: '20px',
                            backgroundColor: (!statusConfig.isAvailable || phone.length !== 10 || (loginMode === 'password' && !password)) ? '#E5E7EB' : '#EF4444',
                            borderColor: (!statusConfig.isAvailable || phone.length !== 10 || (loginMode === 'password' && !password)) ? '#E5E7EB' : '#EF4444',
                            color: (!statusConfig.isAvailable || phone.length !== 10 || (loginMode === 'password' && !password)) ? '#9CA3AF' : '#FFFFFF',
                            fontSize: '18px',
                            fontWeight: 700,
                            boxShadow: (!statusConfig.isAvailable || phone.length !== 10 || (loginMode === 'password' && !password)) ? 'none' : '0 12px 20px rgba(239, 68, 68, 0.25)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px'
                        }}
                    >
                        {loginMode === 'otp' ? t('common.next') : t('screen1.login_button')}
                    </Button>
                </div>

                <style>{`
                    .custom-phone-input:focus, .custom-phone-input-focused {
                        border-color: #EF4444 !important;
                        box-shadow: 0 0 0 2px rgba(239, 68, 68, 0.1) !important;
                    }
                    .custom-phone-input::placeholder {
                        letter-spacing: normal;
                        color: #D1D5DB;
                    }
                `}</style>

            </div>
        </MobileLayout>
    );
};

export default Screen1;
