import React, { useState, useEffect, useRef } from 'react';
import { Button, Typography, Modal, Spin, Row, Col, Space, Tag, Divider, Card, Tabs } from 'antd';
import {
    ClockCircleOutlined,
    ThunderboltFilled,
    InfoCircleFilled,
    CalendarOutlined,
    EnvironmentFilled,
    PhoneOutlined,
    PlayCircleFilled,
    CustomerServiceFilled,
    MessageOutlined,
    WarningFilled
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import useCharging from '../hooks/useCharging';
import { useTranslation, Trans } from 'react-i18next';

const { Title, Text } = Typography;

const MOCK_DATA = [
    {
        "chargeId": 2,
        "chargerName": "THAMRS000102",
        "chargerCode": "THAMRS000102",
        "chargerPointId": "89a34b85-278d-4851-be26-b2f088ad0a90",
        "chargerPointType": "AC Type 2",
        "chargerPowerLevel": 7,
        "chargerStatus": "suspended", // Mock suspended state
        "chargerCurrentEnergy": 1.67,
        "chargerCurrentTime": "02:00:00",
        "chargerCurrentCost": 10.86,
        "isStation": true,
        "isPlugAndCharge": false,
        "transactionID": 1,
        "maxPower": 120,
        "amount": null,
        "isPaid": false,
        "batteryPercent": 49,
        "cnNo": 2,
        "unitPrice": 6.5,
        "stationId": 1,
        "stCode": "THAMRS0001",
        "stationNameTh": "AMR EV Charging Station",
        "stationNameEn": "AMR EV Charging Station",
        "stationAddressTh": "เลขที่ 469 ซอยประวิทย์และเพื่อน ถนนประชาชื่น แขวงลาดยาว เขตจตุจักร กรุงเทพมหานคร 10900",
        "stationAddressEn": "No. 469, Prawit and Friends Alley, Prachachuen Road, Lat Yao Subdistrict, Chatuchak District, Bangkok 10900",
        "stationLatitude": "13.84618812843747",
        "stationLongitude": "100.54681163454356",
        "stationStatus": true
    },
];

const Screen5 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const { isCharging, isLoading, stopCharging } = useCharging();

    const [sessions, setSessions] = useState(MOCK_DATA);
    const [activeTab, setActiveTab] = useState(0);
    const [isStopModalOpen, setIsStopModalOpen] = useState(false);
    const [isContactModalOpen, setIsContactModalOpen] = useState(false);
    const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
    const [isStationInfoVisible, setIsStationInfoVisible] = useState(false);

    const currentSession = sessions[activeTab];

    useEffect(() => {
        document.title = `${t('screen5.title')} | EVC Prepaid`;
    }, []);

    const handleStopChargingConfirm = () => {
        setIsStopModalOpen(false);
        stopCharging();
    };

    const handleContinueCharging = () => {
        setIsResumeModalOpen(true);
    };

    const handleResumeConfirm = () => {
        // Mock continue logic
        const newSessions = [...sessions];
        newSessions[activeTab].chargerStatus = 'charging'; // Resume
        setSessions(newSessions);
        setIsResumeModalOpen(false);
    };

    const getBatteryColor = (percent) => {
        if (typeof percent !== 'number') return '#3b82f6'; // Blue for unknown
        if (percent <= 20) return '#ef4444'; // Red
        if (percent <= 50) return '#f59e0b'; // Orange/Yellow
        return '#10b981'; // Green
    };

    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    if (!isCharging) {
        return (
            <MobileLayout>
                <div style={{
                    padding: '24px',
                    display: 'flex',
                    flexDirection: 'column',
                    minHeight: '100vh',
                    background: '#f8fafc'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '20px' }}>
                        <Button
                            type="text"
                            onClick={() => i18n.changeLanguage(i18n.language === 'th' ? 'en' : 'th')}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '6px',
                                background: 'white',
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

                    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center' }}>
                        <div style={{
                            width: '80px',
                            height: '80px',
                            backgroundColor: '#fee2e2',
                            borderRadius: '26px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            marginBottom: '24px'
                        }}>
                            <ThunderboltFilled style={{ color: '#EF4444', fontSize: '36px' }} />
                        </div>
                        <Title level={4} style={{ margin: '0 0 12px 0', color: '#1e293b' }}>{t('screen5.no_charging_title')}</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '32px' }}>
                            {t('screen5.no_charging_desc')}
                        </Text>
                        <Button
                            type="primary"
                            size="large"
                            icon={<ClockCircleOutlined />}
                            onClick={() => navigate('/screen7')}
                            style={{
                                height: '56px',
                                borderRadius: '16px',
                                backgroundColor: '#EF4444',
                                fontWeight: '700',
                                padding: '0 32px',
                                boxShadow: '0 8px 16px rgba(239, 68, 68, 0.2)'
                            }}
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
            <div style={{
                background: '#f8fafc',
                minHeight: '100%',
                display: 'flex',
                flexDirection: 'column'
            }}>
                <Header title={t('screen5.title')} />

                <div style={{ padding: '10px 20px 24px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                    {sessions.length > 1 && (
                        <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
                            <Tabs
                                activeKey={String(activeTab)}
                                onChange={(key) => setActiveTab(Number(key))}
                                centered
                                items={sessions.map((session, index) => ({
                                    key: String(index),
                                    label: `${t('screen5.charge_no', 'Charge')} ${index + 1}`
                                }))}
                                size="large"
                                tabBarStyle={{ marginBottom: 0 }}
                            />
                        </div>
                    )}



                    {/* Top Info: Status, Connector, and Info Button */}
                    <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '8px', marginBottom: '24px' }}>
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: currentSession.chargerStatus === 'suspended' ? '#fff7ed' : `#10b98115`,
                            padding: '6px 12px',
                            borderRadius: '20px',
                            color: currentSession.chargerStatus === 'suspended' ? '#ea580c' : '#10b981',
                            fontSize: '11px',
                            fontWeight: '700',
                            border: currentSession.chargerStatus === 'suspended' ? '1px solid #ffedd5' : 'none'
                        }}>
                            <span style={{
                                width: '6px',
                                height: '6px',
                                background: currentSession.chargerStatus === 'suspended' ? '#ea580c' : '#10b981',
                                borderRadius: '50%',
                                animation: currentSession.chargerStatus === 'suspended' ? 'none' : 'pulse-ring 2s infinite ease-in-out'
                            }}></span>
                            {currentSession.chargerStatus === 'suspended' ? t('screen5.status_suspended') : t('screen5.status_charging')}
                        </div>

                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            background: '#1e293b',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            color: 'white',
                            fontSize: '11px',
                            fontWeight: '700'
                        }}>
                            {currentSession.chargerPointType}
                        </div>

                        <Button
                            type="text"
                            icon={<InfoCircleFilled style={{ color: '#3b82f6', fontSize: '18px' }} />}
                            onClick={() => setIsStationInfoVisible(true)}
                            style={{
                                padding: '4px',
                                height: 'auto',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: 'white',
                                borderRadius: '50%',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                                border: '1px solid #f1f5f9'
                            }}
                        />
                    </div>

                    {/* Main SoC Visualizer */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: '32px',
                        position: 'relative',
                        width: 'calc(100% + 40px)',
                        margin: '0 -20px 32px -20px',
                    }}>
                        {(currentSession.batteryPercent !== null && currentSession.batteryPercent !== undefined) ||
                            (currentSession.chargerCurrentEnergy !== null && currentSession.chargerCurrentEnergy !== undefined) ? (
                            <>
                                <div style={{
                                    position: 'absolute',
                                    width: '220px',
                                    height: '220px',
                                    borderRadius: '50%',
                                    border: '1px solid #e2e8f0',
                                }}></div>

                                <svg width="220" height="220" style={{
                                    transform: 'rotate(-90deg)',
                                    '--glow-color': getBatteryColor(currentSession.batteryPercent || 100),
                                    borderRadius: '50%'
                                }}>
                                    <defs>
                                        <clipPath id="circleClip">
                                            <circle cx="110" cy="110" r="100" />
                                        </clipPath>
                                    </defs>
                                    <circle cx="110" cy="110" r="100" fill="#f1f5f9" />

                                    {(currentSession.batteryPercent !== null && currentSession.batteryPercent !== undefined) && (
                                        <g clipPath="url(#circleClip)">
                                            <g style={{
                                                transform: `rotate(90deg) translate(0, ${100 - currentSession.batteryPercent}%)`,
                                                transformOrigin: 'center',
                                                transition: 'transform 1.5s ease-in-out'
                                            }}>
                                                <path d="M0 0 Q25 -5 50 0 T100 0 V100 H0 Z" fill={getBatteryColor(currentSession.batteryPercent)} style={{ opacity: 0.3, animation: 'wave-move 3s linear infinite', width: '200%', transform: 'translateX(-50%)' }} transform="scale(2.2, 2.2) translate(0, 0)" />
                                                <path d="M0 0 Q25 5 50 0 T100 0 V100 H0 Z" fill={getBatteryColor(currentSession.batteryPercent)} style={{ opacity: 0.5, animation: 'wave-move 2s linear infinite', width: '200%', transform: 'translateX(-25%)' }} transform="scale(2.2, 2.2) translate(0, 2)" />
                                                <rect x="-110" y="5" width="440" height="220" fill={getBatteryColor(currentSession.batteryPercent)} />
                                            </g>
                                        </g>
                                    )}

                                    <circle cx="110" cy="110" r="100" fill="none" stroke="#e2e8f0" strokeWidth="14" />
                                    <circle
                                        cx="110" cy="110" r="100"
                                        fill="none"
                                        stroke={getBatteryColor(currentSession.batteryPercent || 100)}
                                        strokeWidth="14"
                                        strokeDasharray="628"
                                        strokeDashoffset={currentSession.batteryPercent !== null && currentSession.batteryPercent !== undefined ? 628 * (1 - currentSession.batteryPercent / 100) : 0}
                                        strokeLinecap="round"
                                        style={{ transition: 'stroke-dashoffset 1s ease-out, stroke 1s ease-in-out', animation: 'glow-pulse 2s infinite ease-in-out' }}
                                    />
                                    <circle cx="110" cy="110" r="100" fill="none" stroke="white" strokeWidth="4" strokeDasharray="5 15" strokeLinecap="round" style={{ animation: 'dash-move 1s linear infinite', opacity: 0.6 }} />
                                </svg>

                                <div style={{ position: 'absolute', textAlign: 'center' }}>
                                    <div style={{ fontSize: currentSession.batteryPercent !== null && currentSession.batteryPercent !== undefined ? '56px' : '44px', fontWeight: '800', color: '#1e293b', lineHeight: '1' }}>
                                        {currentSession.batteryPercent !== null && currentSession.batteryPercent !== undefined ? (
                                            <>
                                                {Math.floor(currentSession.batteryPercent)}<span style={{ fontSize: '24px', fontWeight: '600' }}>%</span>
                                            </>
                                        ) : (
                                            <>
                                                {currentSession.chargerCurrentEnergy?.toFixed(2)}<span style={{ fontSize: '18px', fontWeight: '600', marginLeft: '4px' }}>kWh</span>
                                            </>
                                        )}
                                    </div>
                                    <div style={{ fontSize: '12px', fontWeight: '600', color: '#94a3b8', marginTop: '4px' }}>
                                        {currentSession.batteryPercent !== null && currentSession.batteryPercent !== undefined ? 'SoC' : t('screen5.energy_delivered')}
                                    </div>
                                </div>
                            </>
                        ) : (
                            <div style={{
                                width: '180px',
                                height: '180px',
                                borderRadius: '50%',
                                background: 'white',
                                boxShadow: '0 8px 30px rgba(0,0,0,0.04)',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                alignItems: 'center',
                                border: '1px solid #f1f5f9'
                            }}>
                                <ThunderboltFilled style={{ fontSize: '48px', color: '#10b981', marginBottom: '12px' }} />
                                <Text strong style={{ fontSize: '18px', color: '#1e293b' }}>{t('screen5.status_charging')}</Text>
                            </div>
                        )}

                        <div style={{
                            position: 'absolute',
                            bottom: '15px',
                            right: '15%',
                            background: 'white',
                            width: '40px',
                            height: '40px',
                            borderRadius: '12px',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                            animation: currentSession.chargerStatus === 'suspended' ? 'none' : 'float 3s infinite ease-in-out',
                            zIndex: 5
                        }}>
                            {currentSession.chargerStatus === 'suspended' ? (
                                <WarningFilled style={{ color: '#ea580c', fontSize: '18px' }} />
                            ) : (
                                <ThunderboltFilled style={{ color: '#10b981', fontSize: '18px' }} />
                            )}
                        </div>
                    </div>

                    {currentSession.chargerStatus === 'suspended' && (
                        <div style={{
                            textAlign: 'center',
                            marginBottom: '20px',
                            padding: '12px',
                            background: '#fff7ed',
                            borderRadius: '16px',
                            border: '1px solid #ffedd5'
                        }}>
                            <WarningFilled style={{ color: '#f97316', fontSize: '24px', marginBottom: '8px' }} />
                            <Text strong style={{ display: 'block', color: '#9a3412', marginBottom: '4px' }}>
                                {t('screen5.charger_stopped_check')}
                            </Text>
                        </div>
                    )}


                    {/* Information Hierarchy Groups */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>

                        {/* Technical Metrics Group */}
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <StatCard
                                label={t('screen5.energy_delivered')}
                                value={currentSession.chargerCurrentEnergy}
                                unit="kWh"
                                icon={<div style={{ width: 6, height: 6, borderRadius: '50%', background: '#f59e0b' }} />}
                            />
                            <StatCard
                                label={t('screen5.current_power')}
                                value={currentSession.chargerPowerLevel}
                                unit="kW"
                                icon={<div style={{ width: 6, height: 6, borderRadius: '50%', background: '#3b82f6' }} />}
                            />
                        </div>

                        {/* Booking Detail with Overnight Logic */}
                        <div style={{
                            background: 'white',
                            border: '1px solid #f1f5f9',
                            borderRadius: '24px',
                            padding: '24px 20px',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.02)'
                        }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
                                <div>
                                    <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '6px' }}>{t('screen5.start_time')}</Text>
                                    <Text strong style={{ fontSize: '15px', display: 'block' }}>{t('mock_session.start_date')}</Text>
                                    <Text style={{ fontSize: '13px', color: '#64748b' }}>{t('common.time_at', { time: t('mock_session.start_time') })}</Text>
                                </div>
                                <div style={{ textAlign: 'right' }}>
                                    <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '6px' }}>{t('screen5.end_time')}</Text>
                                    <Text strong style={{ fontSize: '15px', display: 'block', color: '#f59e0b' }}>{t('mock_session.end_date')}</Text>
                                    <Text style={{ fontSize: '13px', color: '#f59e0b', fontWeight: 700 }}>{t('common.time_at', { time: t('mock_session.end_time') })}</Text>
                                </div>
                            </div>

                            <div style={{ height: '1.5px', background: '#f8fafc', marginBottom: '24px' }}></div>

                            <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px', border: '1px solid #f1f5f9' }}>
                                <Text type="secondary" style={{ fontSize: '11px', display: 'block', marginBottom: '8px' }}>{t('screen5.elapsed_time')}</Text>
                                <Title level={2} style={{ margin: 0, color: '#1e293b' }}>{currentSession.chargerCurrentTime}</Title>
                            </div>

                            <div style={{ marginTop: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', padding: '8px', background: '#f8fafc', borderRadius: '12px' }}>
                                <InfoCircleFilled style={{ color: '#94a3b8', fontSize: '13px' }} />
                                <Text style={{ fontSize: '12px', color: '#64748b' }}>{t('screen5.quota', { duration: `3 ${t('charging.unit_hour')}` })}</Text>
                            </div>
                        </div>
                    </div>

                    {/* Action Footer */}
                    <div style={{ marginTop: 'auto', paddingTop: '32px' }}>
                        {currentSession.chargerStatus === 'suspended' ? (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                <Button
                                    type="primary"
                                    size="large"
                                    block
                                    icon={<PlayCircleFilled />}
                                    style={{
                                        height: '64px',
                                        borderRadius: '20px',
                                        fontWeight: '800',
                                        fontSize: '16px',
                                        backgroundColor: '#10b981',
                                        boxShadow: '0 8px 24px rgba(16, 185, 129, 0.25)'
                                    }}
                                    onClick={handleContinueCharging}
                                >
                                    {t('screen5.continue_charging')}
                                </Button>
                                <Button
                                    size="large"
                                    block
                                    icon={<CustomerServiceFilled />}
                                    style={{
                                        height: '64px',
                                        borderRadius: '20px',
                                        fontWeight: '700',
                                        fontSize: '16px',
                                        color: '#475569',
                                        borderColor: '#cbd5e1'
                                    }}
                                    onClick={() => setIsContactModalOpen(true)}
                                >
                                    {t('screen5.contact_support')}
                                </Button>
                            </div>
                        ) : (
                            <Button
                                type="primary"
                                size="large"
                                block
                                danger
                                style={{
                                    height: '64px',
                                    borderRadius: '20px',
                                    fontWeight: '800',
                                    fontSize: '18px',
                                    boxShadow: '0 8px 24px rgba(239, 68, 68, 0.25)',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '12px',
                                    border: 'none'
                                }}
                                onClick={() => setIsStopModalOpen(true)}
                            >
                                <div style={{ width: '14px', height: '14px', background: 'white', borderRadius: '3px' }} />
                                {t('screen5.stop_button')}
                            </Button>
                        )}
                    </div>
                </div>

                {/* Confirm Modal */}
                <Modal
                    title={null}
                    open={isStopModalOpen}
                    onCancel={() => setIsStopModalOpen(false)}
                    footer={null}
                    centered
                    width={340}
                    styles={{ body: { padding: '32px 24px' } }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#fef2f2', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px auto' }}>
                            <InfoCircleFilled style={{ fontSize: '32px', color: '#ef4444' }} />
                        </div>
                        <Title level={4} style={{ margin: '0 0 12px 0' }}>{t('screen5.stop_confirm_title')}</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '32px', fontSize: '14px' }}>{t('screen5.stop_confirm_desc')}</Text>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Button danger type="primary" size="large" block style={{ height: '52px', borderRadius: '14px', fontWeight: '700' }} onClick={handleStopChargingConfirm}>
                                {t('common.confirm')}
                            </Button>
                            <Button type="text" block style={{ height: '44px', color: '#64748b' }} onClick={() => setIsStopModalOpen(false)}>
                                {t('common.cancel')}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Resume Confirm Modal */}
                <Modal
                    title={null}
                    open={isResumeModalOpen}
                    onCancel={() => setIsResumeModalOpen(false)}
                    footer={null}
                    centered
                    width={340}
                    styles={{ body: { padding: '32px 24px' } }}
                >
                    <div style={{ textAlign: 'center' }}>
                        <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: '#ecfdf5', display: 'flex', justifyContent: 'center', alignItems: 'center', margin: '0 auto 24px auto' }}>
                            <PlayCircleFilled style={{ fontSize: '32px', color: '#10b981' }} />
                        </div>
                        <Title level={4} style={{ margin: '0 0 12px 0' }}>{t('screen5.resume_confirm_title')}</Title>
                        <Text type="secondary" style={{ display: 'block', marginBottom: '24px', fontSize: '14px' }}>
                            <Trans i18nKey="screen5.resume_confirm_desc" components={{ bold: <Text strong /> }} />
                        </Text>

                        <div style={{
                            background: '#f8fafc',
                            padding: '16px',
                            borderRadius: '16px',
                            marginBottom: '32px',
                            border: '1px solid #f1f5f9'
                        }}>
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '8px' }}>{t('screen5.remaining_time')}</Text>
                            <Title level={2} style={{ margin: 0, color: '#10b981' }}>01:00:00</Title>
                        </div>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                            <Button type="primary" size="large" block style={{ height: '52px', borderRadius: '14px', fontWeight: '700', backgroundColor: '#10b981' }} onClick={handleResumeConfirm}>
                                {t('common.confirm')}
                            </Button>
                            <Button type="text" block style={{ height: '44px', color: '#64748b' }} onClick={() => setIsResumeModalOpen(false)}>
                                {t('common.cancel')}
                            </Button>
                        </div>
                    </div>
                </Modal>

                {/* Contact Support Modal */}
                <Modal
                    title={<Title level={4} style={{ margin: 0, textAlign: 'center' }}>{t('screen5.contact_support')}</Title>}
                    open={isContactModalOpen}
                    onCancel={() => setIsContactModalOpen(false)}
                    footer={null}
                    centered
                    width={320}
                    borderRadius={24}
                    styles={{ body: { padding: '24px' } }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginTop: '10px' }}>
                        <a href="tel:021234567" style={{ textDecoration: 'none' }}>
                            <Button
                                block
                                size="large"
                                style={{
                                    height: '60px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                    fontSize: '16px',
                                    fontWeight: '600'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <PhoneOutlined style={{ fontSize: '20px', color: '#EF4444' }} />
                                    <span>02-123-4567</span>
                                </div>
                                <div style={{ background: '#f3f4f6', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', color: '#6b7280' }}>Call</div>
                            </Button>
                        </a>
                        <a href="https://line.me/ti/p/@amr_ev" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none' }}>
                            <Button
                                block
                                size="large"
                                style={{
                                    height: '60px',
                                    borderRadius: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'space-between',
                                    paddingLeft: '20px',
                                    paddingRight: '20px',
                                    fontSize: '16px',
                                    fontWeight: '600',
                                    borderColor: '#06c755',
                                    color: '#06c755'
                                }}
                            >
                                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                    <MessageOutlined style={{ fontSize: '20px' }} />
                                    <span>@amr_ev</span>
                                </div>
                                <div style={{ background: '#dcfce7', padding: '4px 8px', borderRadius: '8px', fontSize: '12px', color: '#15803d' }}>Line</div>
                            </Button>
                        </a>
                        <Button type="text" onClick={() => setIsContactModalOpen(false)} style={{ marginTop: '8px' }}>
                            {t('common.close')}
                        </Button>
                    </div>
                </Modal>

                {/* Station Information Modal */}
                <Modal
                    title={<Title level={4} style={{ margin: 0 }}>{t('screen1.station_label')}</Title>}
                    open={isStationInfoVisible}
                    onCancel={() => setIsStationInfoVisible(false)}
                    footer={[
                        <Button key="close" type="primary" onClick={() => setIsStationInfoVisible(false)} style={{ borderRadius: '12px', background: '#EF4444', borderColor: '#EF4444' }}>
                            {t('common.close')}

                        </Button>
                    ]}
                    centered
                    styles={{ body: { padding: '24px' } }}
                    borderRadius={20}
                >
                    <Space direction="vertical" size={20} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '14px' }}>
                            <div style={{
                                padding: '10px',
                                backgroundColor: '#fef2f2',
                                borderRadius: '12px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                            }}>
                                <EnvironmentFilled style={{ color: '#EF4444', fontSize: '20px' }} />
                            </div>
                            <div style={{ flex: 1 }}>
                                <Title level={5} style={{ margin: '0 0 4px 0', fontSize: '18px', fontWeight: 700 }}>{currentSession.stationNameTh}</Title>
                                <Text type="secondary" style={{ fontSize: '14px', lineHeight: '1.5', display: 'block' }}>
                                    {currentSession.stationAddressTh}
                                </Text>
                            </div>
                        </div>

                        <Divider style={{ margin: '0' }} />

                        <div style={{ background: '#f8fafc', padding: '16px', borderRadius: '16px' }}>
                            <Row gutter={[16, 16]}>
                                <Col span={24}>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>{t('screen6.charger_id')}</Text>
                                    <Text strong style={{ fontSize: '15px' }}>{t('mock_station.charger_id')}</Text>
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>{t('screen6.connector_no')}</Text>
                                    <Text strong style={{ fontSize: '15px' }}>1</Text>
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '4px' }}>{t('screen6.connector_type')}</Text>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <ThunderboltFilled style={{ color: '#10b981', fontSize: '14px' }} />
                                        <Text strong style={{ fontSize: '15px' }}>{currentSession.chargerPointType}</Text>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Space>
                </Modal>
            </div>
        </MobileLayout>
    );
};

const StatCard = ({ label, value, unit, icon, color }) => (
    <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: '20px',
        border: '1px solid #f1f5f9',
        display: 'flex',
        flexDirection: 'column',
        gap: '6px'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {icon}
            <Text type="secondary" style={{ fontSize: '11px', fontWeight: '600' }}>{label}</Text>
        </div>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px' }}>
            <span style={{ fontSize: '20px', fontWeight: '800', color: color || '#1e293b' }}>
                {typeof value === 'number' ? value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : value}
            </span>
            <span style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '700' }}>{unit}</span>
        </div>
    </div>
);

export default Screen5;
