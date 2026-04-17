import React, { useState } from 'react';
import { Typography, Popover, Button, Divider, Modal } from 'antd';
import {
    LeftOutlined,
    MoreOutlined,
    HistoryOutlined,
    ThunderboltOutlined,
    LogoutOutlined,
    ExclamationCircleOutlined
} from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import useAuth from '../hooks/useAuth';

const { Title, Text } = Typography;

const Header = ({ title, showMenu = true }) => {
    const navigate = useNavigate();
    const location = useLocation();
    const { t, i18n } = useTranslation();
    const { logout } = useAuth();
    const [open, setOpen] = useState(false);

    const toggleLanguage = () => {
        const newLang = i18n.language === 'th' ? 'en' : 'th';
        i18n.changeLanguage(newLang);
    };

    const handleOpenChange = (newOpen) => {
        setOpen(newOpen);
    };

    const handleNavigate = (path) => {
        navigate(path);
        setOpen(false);
    };

    const handleLogout = () => {
        setOpen(false);
        Modal.confirm({
            title: t('logout_confirm.title'),
            icon: <ExclamationCircleOutlined />,
            content: t('logout_confirm.desc'),
            okText: t('common.confirm'),
            cancelText: t('common.cancel'),
            okButtonProps: { danger: true },
            centered: true,
            onOk() {
                logout();
            },
        });
    };

    const content = (
        <div style={{ display: 'flex', flexDirection: 'column', width: '220px' }}>
            <Button
                type="text"
                onClick={toggleLanguage}
                style={{
                    height: 'auto',
                    padding: '12px',
                    textAlign: 'left',
                    backgroundColor: '#f9fafb',
                    borderRadius: '8px',
                    margin: '4px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                }}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontSize: '18px' }}>
                        {i18n.language === 'th' ? '🇹🇭' : '🇬🇧'}
                    </span>
                    <Text strong style={{ fontSize: '14px' }}>
                        {i18n.language === 'th' ? 'ภาษาไทย (TH)' : 'English (EN)'}
                    </Text>
                </div>
            </Button>

            <Divider style={{ margin: '8px 4px' }} />

            <Button
                type="text"
                icon={<HistoryOutlined />}
                style={{
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    paddingLeft: '12px',
                    height: '40px',
                    backgroundColor: location.pathname === '/screen7' || location.pathname === '/screen8' ? '#fee2e2' : 'transparent',
                    color: location.pathname === '/screen7' || location.pathname === '/screen8' ? '#EF4444' : 'rgba(0, 0, 0, 0.85)',
                    fontWeight: location.pathname === '/screen7' || location.pathname === '/screen8' ? '600' : 'normal'
                }}
                onClick={() => handleNavigate('/screen7')}
            >
                {t('common.history')}
            </Button>
            <Button
                type="text"
                icon={<ThunderboltOutlined />}
                style={{
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    paddingLeft: '12px',
                    height: '40px',
                    backgroundColor: location.pathname === '/screen5' ? '#fee2e2' : 'transparent',
                    color: location.pathname === '/screen5' ? '#EF4444' : 'rgba(0, 0, 0, 0.85)',
                    fontWeight: location.pathname === '/screen5' ? '600' : 'normal'
                }}
                onClick={() => handleNavigate('/screen5')}
            >
                {t('common.charging')}
            </Button>
            <Divider style={{ margin: '8px 4px' }} />
            <Button
                type="text"
                danger
                icon={<LogoutOutlined />}
                style={{
                    textAlign: 'left',
                    justifyContent: 'flex-start',
                    paddingLeft: '12px',
                    height: '40px'
                }}
                onClick={handleLogout}
            >
                {t('common.logout')}
            </Button>
        </div>
    );

    return (
        <div style={{
            padding: '14px 16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#fff',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            position: 'relative',
            zIndex: 100,
            minHeight: '64px'
        }}>
            {/* Left Section: User Phone */}
            <div style={{ display: 'flex', alignItems: 'center', width: '25%' }}>

            </div>

            {/* Center Section: Title */}
            <div style={{ flex: 1, textAlign: 'center' }}>
                <Title level={5} style={{ margin: 0, color: '#1e293b', fontSize: '16px', fontWeight: '700' }}>
                    {title}
                </Title>
            </div>

            {/* Right Section: Menu/Popover */}
            <div style={{ width: '25%', textAlign: 'right', display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                {showMenu && (
                    <Popover
                        content={content}
                        trigger="click"
                        placement="bottomRight"
                        open={open}
                        onOpenChange={handleOpenChange}
                        overlayStyle={{ paddingTop: '8px' }}
                    >
                        <Button
                            type="text"
                            icon={<MoreOutlined style={{ fontSize: '24px', color: '#1e293b' }} />}
                            style={{ padding: '0 8px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        />
                    </Popover>
                )}
            </div>
        </div>
    );
};

export default Header;
