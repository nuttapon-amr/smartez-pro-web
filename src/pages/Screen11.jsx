import React, { useMemo, useState } from 'react';
import { Button, Card, Col, Row, Tag, Typography } from 'antd';
import {
    CalendarOutlined,
    CheckCircleFilled,
    ClockCircleFilled,
    ThunderboltFilled
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { BILLING_OPTIONS, getBillingOption, getMockUserEntitlement } from '../data/mockSwapData';

const { Title, Text } = Typography;

const PackageCard = ({ option, isSelected, onSelect, t }) => (
    <div
        onClick={() => onSelect(option.id)}
        style={{
            cursor: 'pointer',
            padding: '16px',
            borderRadius: '18px',
            border: `2px solid ${isSelected ? '#10b981' : '#e5e7eb'}`,
            backgroundColor: '#fff',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-start',
            gap: '8px',
            transition: 'all 0.25s ease',
            position: 'relative',
            minHeight: '184px',
            boxShadow: isSelected ? '0 10px 24px rgba(16, 185, 129, 0.16)' : '0 2px 8px rgba(15, 23, 42, 0.04)',
            transform: isSelected ? 'translateY(-2px)' : 'none'
        }}
    >
        {isSelected && (
            <div style={{
                position: 'absolute',
                top: '-10px',
                right: '-10px',
                backgroundColor: '#10b981',
                borderRadius: '50%',
                width: '26px',
                height: '26px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                border: '3px solid #fff',
                boxShadow: '0 2px 6px rgba(0,0,0,0.12)'
            }}>
                <CheckCircleFilled style={{ color: '#fff', fontSize: '14px' }} />
            </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', minHeight: '26px' }}>
            {option.badgeKey && (
                <Tag color="green" style={{ margin: 0, borderRadius: '999px', fontWeight: 800 }}>
                    {t(option.badgeKey)}
                </Tag>
            )}
        </div>

        {option.group === 'per_swap' ? (
            <ThunderboltFilled style={{ fontSize: '26px', color: isSelected ? '#10b981' : '#cbd5e1' }} />
        ) : (
            <CalendarOutlined style={{ fontSize: '26px', color: isSelected ? '#10b981' : '#cbd5e1' }} />
        )}

        <Text strong style={{ fontSize: '16px', color: isSelected ? '#047857' : '#0f172a' }}>
            {t(option.titleKey)}
        </Text>
        <Text style={{ fontSize: '12px', lineHeight: 1.45, color: '#64748b', minHeight: '36px' }}>
            {t(option.descriptionKey)}
        </Text>
        <Text strong style={{ marginTop: 'auto', fontSize: '20px', color: '#0f172a' }}>
            ฿{option.price}
        </Text>
        <Text type="secondary" style={{ fontSize: '12px' }}>
            {t(option.quotaLabelKey)}
        </Text>
        <Text type="secondary" style={{ fontSize: '12px' }}>
            {t('billing.validity_days', { count: option.validityDays })}
        </Text>
    </div>
);

const Screen11 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [selectedBillingId, setSelectedBillingId] = useState(null);
    const entitlement = getMockUserEntitlement();

    React.useEffect(() => {
        document.title = `${t('screen3.title')} | AMR Battery Swap`;
        const hasActiveSwap = localStorage.getItem('activeSwapSession') === 'true'
            || localStorage.getItem('isCharging') === 'true';
        if (hasActiveSwap) {
            navigate('/screen6');
        }
    }, [navigate, t]);

    const packageGroups = useMemo(() => ({
        perSwap: BILLING_OPTIONS.filter(option => option.group === 'per_swap'),
        pass: BILLING_OPTIONS.filter(option => option.group === 'pass')
    }), []);

    const selectedOption = selectedBillingId ? getBillingOption(selectedBillingId) : null;

    const handlePayment = () => {
        if (!selectedOption) return;
        navigate('/screen5', {
            state: {
                price: selectedOption.price,
                billingOptionId: selectedOption.id,
                billingType: selectedOption.type,
                packageLabel: t(selectedOption.titleKey),
                quotaLabel: t(selectedOption.quotaLabelKey)
            }
        });
    };

    const handleUseCurrentPlan = () => {
        localStorage.setItem('activeSwapSession', 'true');
        localStorage.setItem('activeBillingOptionId', entitlement.billingOptionId);
        localStorage.setItem('activeBillingMode', entitlement.profile);
        navigate('/screen6');
    };

    return (
        <MobileLayout>
            <Header title={t('screen3.title')} />

            <div style={{ padding: '0 20px 24px 20px', display: 'flex', flexDirection: 'column', flex: 1, background: '#f8fafc' }}>
                <div style={{ marginBottom: '16px' }}>
                    <Title level={4} style={{ margin: '6px 0 4px 0', color: '#0f172a' }}>{t('billing.choose_plan')}</Title>
                    <Text type="secondary" style={{ fontSize: '13px' }}>{t('billing.package_store_desc')}</Text>
                </div>

                {entitlement.hasActivePlan && (
                    <Card style={{ borderRadius: '18px', border: '1px solid #BBF7D0', background: '#F0FDF4', marginBottom: '18px' }} styles={{ body: { padding: '16px' } }}>
                        <Text type="secondary" style={{ fontSize: '12px', fontWeight: 800 }}>{t('billing.your_plan')}</Text>
                        <Title level={5} style={{ margin: '4px 0' }}>{t(entitlement.planNameKey)}</Title>
                        <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginBottom: '12px' }}>
                            {t('billing.remaining_quota', { count: entitlement.remainingQuota })}
                        </Text>
                        <Button block type="primary" onClick={handleUseCurrentPlan} style={{ height: '46px', borderRadius: '14px', background: '#10b981', border: 'none', fontWeight: 800 }}>
                            {t('billing.use_current_plan')}
                        </Button>
                    </Card>
                )}

                <PackageGroup
                    title={t('billing.per_swap_group')}
                    description={t('billing.per_swap_group_desc')}
                    options={packageGroups.perSwap}
                    selectedBillingId={selectedBillingId}
                    setSelectedBillingId={setSelectedBillingId}
                    t={t}
                />

                <PackageGroup
                    title={t('billing.pass_group')}
                    description={t('billing.pass_group_desc')}
                    options={packageGroups.pass}
                    selectedBillingId={selectedBillingId}
                    setSelectedBillingId={setSelectedBillingId}
                    t={t}
                />

                <div style={{ marginTop: 'auto', paddingTop: '12px' }}>
                    <Button
                        type="primary"
                        size="large"
                        block
                        disabled={!selectedBillingId}
                        style={{
                            height: '60px',
                            borderRadius: '20px',
                            backgroundColor: selectedBillingId ? '#10b981' : '#d1d5db',
                            border: 'none',
                            fontSize: '18px',
                            fontWeight: 800,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            boxShadow: selectedBillingId ? '0 10px 18px rgba(16, 185, 129, 0.22)' : 'none'
                        }}
                        onClick={handlePayment}
                    >
                        {selectedBillingId && <ClockCircleFilled />}
                        {t('screen3.start_charging')}
                    </Button>
                </div>
            </div>
        </MobileLayout>
    );
};

const PackageGroup = ({ title, description, options, selectedBillingId, setSelectedBillingId, t }) => (
    <section style={{ marginBottom: '22px' }}>
        <div style={{ marginBottom: '10px' }}>
            <Text strong style={{ display: 'block', fontSize: '16px', color: '#0f172a' }}>{title}</Text>
            <Text type="secondary" style={{ fontSize: '12px' }}>{description}</Text>
        </div>
        <Row gutter={[12, 12]}>
            {options.map(option => (
                <Col span={12} key={option.id}>
                    <PackageCard
                        option={option}
                        isSelected={selectedBillingId === option.id}
                        onSelect={setSelectedBillingId}
                        t={t}
                    />
                </Col>
            ))}
        </Row>
    </section>
);

export default Screen11;
