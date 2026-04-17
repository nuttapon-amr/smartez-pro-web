import React, { useState, useEffect } from 'react';
import { Spin, Typography, Card, Tabs, Row, Col, Divider, Tag, Button } from 'antd';
import {
    CalendarOutlined,
    ThunderboltFilled,
    ClockCircleOutlined,
    HistoryOutlined,
    UpOutlined,
    DownOutlined,
    BarChartOutlined,
    RightOutlined
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const StatItem = ({ label, value, unit, icon, color, bgColor }) => (
    <div style={{
        background: 'white',
        padding: '16px',
        borderRadius: '20px',
        border: '1px solid #f1f5f9',
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        gap: '12px'
    }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{
                width: '32px',
                height: '32px',
                borderRadius: '10px',
                background: bgColor,
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
            }}>
                {React.cloneElement(icon, { style: { color: color, fontSize: '16px' } })}
            </div>
            <Text type="secondary" style={{ fontSize: '11px', fontWeight: '600' }}>{label}</Text>
        </div>
        <div style={{ marginTop: 'auto' }}>
            <div style={{ fontSize: '18px', fontWeight: '800', color: '#1e293b', lineHeight: '1.2' }}>{value}</div>
            {unit && <Text type="secondary" style={{ fontSize: '12px', color: '#94a3b8', fontWeight: '600', display: 'block', marginTop: '4px' }}>{unit}</Text>}
        </div>
    </div>
);



const Screen7 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('daily');

    useEffect(() => {
        document.title = `${t('screen7.title')} | AMR Battery Swap`;
        const timer = setTimeout(() => setIsLoading(false), 800);
        return () => clearTimeout(timer);
    }, [t]);

    const dailyData = {
        totalEnergy: '2',
        totalTime: '00:05:40',
        totalSessions: '2',
        totalCost: '90.00',
        sessions: [
            { id: 1, title: 'AMR Swap Station Bang Na', date: '21 Jan 2026 • 09:20', energy: '1', cost: '45.00' },
            { id: 2, title: 'AMR Swap Station Hua Mak', date: '21 Jan 2026 • 14:15', energy: '1', cost: '45.00' },
        ]
    };

    const monthlyData = {
        totalEnergy: '14',
        totalTime: '00:42:30',
        totalSessions: '14',
        totalCost: '630.00',
        sessions: [
            { id: 3, title: 'Monthly Summary (Jan)', date: 'January 2026', energy: '14', cost: '630.00' },
        ]
    };

    const yearlyData = {
        totalEnergy: '112',
        totalTime: '05:36:00',
        totalSessions: '112',
        totalCost: '5,040.00',
        sessions: [
            { id: 4, title: 'Yearly Summary (2026)', date: 'Year 2026', energy: '112', cost: '5,040.00' },
        ]
    };

    const formatTotalTime = (timeStr) => {
        const [h, m] = timeStr.split(':');
        const hr = parseInt(h, 10).toLocaleString();
        const min = parseInt(m, 10).toLocaleString();
        return `${hr} ${t('charging.unit_hour')} ${min} ${t('charging.unit_minute')}`;
    };

    const getData = () => {
        if (activeTab === 'monthly') return monthlyData;
        if (activeTab === 'yearly') return yearlyData;
        return dailyData;
    };

    const data = getData();

    if (isLoading) {
        return (
            <div style={{ height: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
                <Spin size="large" />
            </div>
        );
    }

    return (
        <MobileLayout>
            <div style={{ background: '#f8fafc', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                <Header title={t('screen7.title')} />

                <div style={{ padding: '0 20px 24px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                    {/* Simplified Tab Selector */}
                    <div style={{
                        background: '#f1f5f9',
                        padding: '4px',
                        borderRadius: '14px',
                        display: 'flex',
                        marginBottom: '24px',
                        marginTop: '10px'
                    }}>
                        {['daily', 'monthly', 'yearly'].map((tab) => (
                            <div
                                key={tab}
                                onClick={() => setActiveTab(tab)}
                                style={{
                                    flex: 1,
                                    textAlign: 'center',
                                    padding: '10px 0',
                                    borderRadius: '11px',
                                    fontSize: '13px',
                                    fontWeight: '700',
                                    cursor: 'pointer',
                                    transition: 'all 0.2s',
                                    backgroundColor: activeTab === tab ? 'white' : 'transparent',
                                    color: activeTab === tab ? '#1e293b' : '#64748b',
                                    boxShadow: activeTab === tab ? '0 2px 8px rgba(0,0,0,0.05)' : 'none'
                                }}
                            >
                                {tab === 'daily' ? t('common.daily') : tab === 'monthly' ? t('common.monthly') : t('common.yearly')}
                            </div>
                        ))}
                    </div>

                    {/* Summary Matrix Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '24px' }}>
                        <StatItem
                            label={t('summary.energy_received')}
                            value={data.totalEnergy}
                            unit={t('charging.unit_swap')}
                            icon={<ThunderboltFilled />}
                            color="#f59e0b"
                            bgColor="#fffbeb"
                        />
                        <StatItem
                            label={t('summary.total_charging_time')}
                            value={formatTotalTime(data.totalTime)}
                            unit=""
                            icon={<ClockCircleOutlined />}
                            color="#3b82f6"
                            bgColor="#eff6ff"
                        />
                        <StatItem
                            label={t('summary.total_sessions')}
                            value={data.totalSessions}
                            unit={t('common.times')}
                            icon={<HistoryOutlined />}
                            color="#10b981"
                            bgColor="#f0fdf4"
                        />
                        <StatItem
                            label={t('summary.total_cost')}
                            value={data.totalCost}
                            unit={t('charging.unit_baht')}
                            icon={<div style={{ fontWeight: '800' }}>฿</div>}
                            color="#8b5cf6"
                            bgColor="#f5f3ff"
                        />
                    </div>

                    <div style={{ marginTop: 'auto', paddingTop: '20px' }}>
                        <Button
                            type="primary"
                            size="large"
                            block
                            icon={<HistoryOutlined />}
                            style={{
                                height: '56px',
                                borderRadius: '16px',
                                backgroundColor: '#10b981',
                                fontWeight: 'bold',
                                fontSize: '16px',
                                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.2)',
                                border: 'none'
                            }}
                            onClick={() => navigate('/screen8')}
                        >
                            {t('screen8.history')}
                        </Button>
                    </div>

                </div>
            </div>
        </MobileLayout>
    );
};

export default Screen7;
