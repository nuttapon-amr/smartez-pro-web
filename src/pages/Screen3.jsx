import React, { useState } from 'react';
import { Button, Typography, Row, Col, Card, Space, Divider, Badge } from 'antd';
import {
    ThunderboltFilled,
    EnvironmentFilled,
    CheckCircleFilled,
    ClockCircleFilled,
    CreditCardFilled,
    WalletOutlined
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const { Title, Text } = Typography;

const Screen3 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedHour, setSelectedHour] = useState(null);
    const pricePerUnit = 10.00;
    const estimatedKWhPerHour = 7;

    React.useEffect(() => {
        document.title = `${t('screen3.title')} | EVC Prepaid`;
        const chargingStatus = localStorage.getItem('isCharging') === 'true';
        if (chargingStatus) {
            navigate('/screen5');
        }
    }, [navigate]);

    const handlePayment = () => {
        if (!selectedHour || !selectedOption) return;
        navigate('/screen4', {
            state: {
                price: selectedOption.price,
                hours: selectedOption.value
            }
        });
    };

    const hourOptions = [
        { label: `1 ${t('charging.unit_hour')}`, value: 1, price: 40 },
        { label: `2 ${t('charging.unit_hour')}`, value: 2, price: 80 },
        { label: `4 ${t('charging.unit_hour')}`, value: 4, price: 160 },
        { label: `6 ${t('charging.unit_hour')}`, value: 6, price: 240 },
    ];

    const selectedOption = hourOptions.find(opt => opt.value === selectedHour);

    return (
        <MobileLayout>
            <Header title={t('screen3.title')} />

            <div style={{ padding: '0 20px 24px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                {/* Detailed Station Info Card */}
                <Card
                    style={{
                        borderRadius: '20px',
                        border: '1px solid #f1f5f9',
                        marginBottom: '24px',
                        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)'
                    }}
                    styles={{ body: { padding: '20px' } }}
                >
                    <Space direction="vertical" size={16} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '12px' }}>
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
                                <Title level={5} style={{ margin: '0 0 4px 0', fontSize: '18px' }}>{t('mock_station.name')}</Title>
                                <Text type="secondary" style={{ fontSize: '13px', lineHeight: '1.4', display: 'block' }}>
                                    {t('mock_station.address')}
                                </Text>
                            </div>
                        </div>

                        <Divider style={{ margin: '0' }} />

                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            <div>
                                <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginBottom: '2px' }}>{t('screen6.charger_id')}</Text>
                                <Text strong style={{ fontSize: '14px', wordBreak: 'break-word', display: 'block', lineHeight: '1.4' }}>
                                    {t('mock_station.charger_id')}
                                </Text>
                            </div>

                            <Row gutter={16}>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>{t('screen6.connector_no')}</Text>
                                    <Text strong style={{ fontSize: '14px' }}>1</Text>
                                </Col>
                                <Col span={12}>
                                    <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>{t('screen6.connector_type')}</Text>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                                        <ThunderboltFilled style={{ color: '#10b981', fontSize: '14px' }} />
                                        <Text strong style={{ fontSize: '14px' }}>AC Type 2</Text>
                                    </div>
                                </Col>
                            </Row>
                        </div>
                    </Space>
                </Card>

                {/* Selection Section */}
                <div style={{ marginBottom: '16px' }}>
                    <Text strong style={{ fontSize: '16px', color: '#1f2937' }}>{t('screen3.title')}</Text>
                </div>

                <Row gutter={[12, 12]} style={{ marginBottom: '24px' }}>
                    {hourOptions.map(option => (
                        <Col span={12} key={option.value}>
                            <div
                                onClick={() => setSelectedHour(option.value)}
                                style={{
                                    cursor: 'pointer',
                                    padding: '16px',
                                    borderRadius: '16px',
                                    border: `2px solid ${selectedHour === option.value ? '#EF4444' : '#f3f4f6'}`,
                                    backgroundColor: selectedHour === option.value ? '#fff' : '#fff',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    alignItems: 'center',
                                    gap: '4px',
                                    transition: 'all 0.3s ease',
                                    position: 'relative',
                                    boxShadow: selectedHour === option.value ? '0 8px 20px rgba(239, 68, 68, 0.15)' : 'none',
                                    transform: selectedHour === option.value ? 'translateY(-2px)' : 'none'
                                }}
                            >
                                {selectedHour === option.value && (
                                    <div style={{
                                        position: 'absolute',
                                        top: '-10px',
                                        right: '-10px',
                                        backgroundColor: '#EF4444',
                                        borderRadius: '50%',
                                        width: '24px',
                                        height: '24px',
                                        display: 'flex',
                                        justifyContent: 'center',
                                        alignItems: 'center',
                                        border: '3px solid #fff',
                                        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                                    }}>
                                        <CheckCircleFilled style={{ color: '#fff', fontSize: '14px' }} />
                                    </div>
                                )}
                                <ClockCircleFilled style={{
                                    fontSize: '28px',
                                    color: selectedHour === option.value ? '#EF4444' : '#d1d5db',
                                    marginBottom: '4px'
                                }} />
                                <Text strong style={{
                                    fontSize: '18px',
                                    color: selectedHour === option.value ? '#EF4444' : '#1f2937'
                                }}>
                                    {option.label}
                                </Text>
                                <Text style={{
                                    fontSize: '13px',
                                    color: selectedHour === option.value ? '#EF4444' : '#6b7280'
                                }}>
                                    ฿{option.price}
                                </Text>
                            </div>
                        </Col>
                    ))}
                </Row>



                {/* Footer Action */}
                <div>
                    <Button
                        type="primary"
                        size="large"
                        block
                        disabled={!selectedHour}
                        style={{
                            height: '60px',
                            borderRadius: '30px',
                            backgroundColor: selectedHour ? '#EF4444' : '#d1d5db',
                            border: 'none',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '12px',
                            boxShadow: selectedHour ? '0 10px 15px -3px rgba(239, 68, 68, 0.4)' : 'none'
                        }}
                        onClick={handlePayment}
                    >
                        {selectedHour && <ThunderboltFilled />}
                        {t('screen3.start_charging')}
                    </Button>
                </div>

            </div>
        </MobileLayout>
    );
};

export default Screen3;
