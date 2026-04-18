import React from 'react';
import { Button, Card, Divider, Empty, Progress, Tag, Typography } from 'antd';
import {
    CalendarOutlined,
    FileTextOutlined,
    GiftOutlined,
    HistoryOutlined,
    ShoppingCartOutlined
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
    getBillingOption,
    getMockUserEntitlement
} from '../data/mockSwapData';

const { Title, Text } = Typography;

const getMockPurchaseHistory = (entitlement, packageTitle) => {
    if (!entitlement.hasActivePlan) return [];

    return [
        {
            id: 'PKG-2026-0418-001',
            title: packageTitle,
            date: '18 Apr 2026',
            amount: entitlement.profile === 'quota' ? '790.00' : entitlement.profile === 'daily' ? '99.00' : '1,990.00',
            statusKey: 'package_page.active',
            remaining: entitlement.remainingQuota,
            expiresAt: entitlement.expiresAt
        },
        {
            id: 'PKG-2026-0320-001',
            title: entitlement.profile === 'quota' ? 'แพ็ก 10 ครั้ง' : 'เหมารายเดือน',
            date: '20 Mar 2026',
            amount: entitlement.profile === 'quota' ? '420.00' : '1,990.00',
            statusKey: 'package_page.expired',
            remaining: 0,
            expiresAt: '2026-04-18T23:59:00'
        }
    ];
};

const Screen8 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const entitlement = getMockUserEntitlement();
    const activePackage = getBillingOption(entitlement.billingOptionId);
    const packageTitle = entitlement.hasActivePlan ? t(activePackage.titleKey) : t('billing.no_active_plan');
    const packageQuota = entitlement.hasActivePlan ? t(activePackage.quotaLabelKey) : t('package_page.no_package_desc');
    const purchaseHistory = getMockPurchaseHistory(entitlement, packageTitle);
    const quotaLimit = activePackage.swapQuota || Number(String(activePackage.quotaLabelKey || '').match(/\d+/)?.[0]) || 120;
    const remainingPercent = entitlement.hasActivePlan
        ? Math.max(0, Math.min(100, Math.round((entitlement.remainingQuota / quotaLimit) * 100)))
        : 0;

    React.useEffect(() => {
        document.title = `${t('package_page.title')} | AMR Battery Swap`;
    }, [t]);

    const formatDate = (dateStr) => {
        if (!dateStr) return '-';
        return new Date(dateStr).toLocaleDateString(i18n.language === 'th' ? 'th-TH' : 'en-GB', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return (
        <MobileLayout>
            <div style={{ minHeight: '100%', display: 'flex', flexDirection: 'column', background: '#f8fafc' }}>
                <Header title={t('package_page.title')} />

                <div style={{ padding: '18px 20px 24px', display: 'flex', flexDirection: 'column', flex: 1 }}>
                    <Card style={{ borderRadius: '24px', border: entitlement.hasActivePlan ? '1px solid #BBF7D0' : '1px solid #E2E8F0', background: entitlement.hasActivePlan ? '#F0FDF4' : '#fff', marginBottom: '18px' }} styles={{ body: { padding: '20px' } }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '14px', alignItems: 'flex-start', marginBottom: '16px' }}>
                            <div>
                                <Text type="secondary" style={{ display: 'block', fontSize: '12px', fontWeight: 800, letterSpacing: '0.8px', textTransform: 'uppercase' }}>
                                    {t('package_page.current_package')}
                                </Text>
                                <Title level={4} style={{ margin: '6px 0 6px', color: '#0f172a' }}>{packageTitle}</Title>
                                <Text type="secondary" style={{ fontSize: '13px' }}>{packageQuota}</Text>
                            </div>
                            <div style={{ width: '48px', height: '48px', borderRadius: '16px', background: entitlement.hasActivePlan ? '#D1FAE5' : '#F1F5F9', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                                <GiftOutlined style={{ color: entitlement.hasActivePlan ? '#10b981' : '#94a3b8', fontSize: '24px' }} />
                            </div>
                        </div>

                        {entitlement.hasActivePlan ? (
                            <>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                                    <PackageStat label={t('package_page.remaining')} value={entitlement.remainingQuota} sub={t('charging.unit_swap')} />
                                    <PackageStat label={t('package_page.expires_at')} value={formatDate(entitlement.expiresAt)} />
                                </div>
                                <Progress percent={remainingPercent} strokeColor="#10b981" trailColor="#d1fae5" showInfo={false} />
                            </>
                        ) : (
                            <Button
                                type="primary"
                                block
                                icon={<ShoppingCartOutlined />}
                                onClick={() => navigate('/screen11')}
                                style={{ height: '50px', borderRadius: '16px', background: '#10b981', border: 'none', fontWeight: 800 }}
                            >
                                {t('billing.choose_plan')}
                            </Button>
                        )}
                    </Card>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                        <HistoryOutlined style={{ color: '#10b981' }} />
                        <Text strong style={{ fontSize: '16px', color: '#0f172a' }}>{t('package_page.purchase_history')}</Text>
                    </div>

                    {purchaseHistory.length === 0 ? (
                        <Card style={{ borderRadius: '22px', border: '1px solid #E2E8F0' }} styles={{ body: { padding: '28px 18px' } }}>
                            <Empty description={t('package_page.empty_history')} />
                        </Card>
                    ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                            {purchaseHistory.map(item => (
                                <Card key={item.id} style={{ borderRadius: '20px', border: '1px solid #E2E8F0' }} styles={{ body: { padding: '16px' } }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', alignItems: 'flex-start', marginBottom: '12px' }}>
                                        <div>
                                            <Text strong style={{ display: 'block', fontSize: '15px', color: '#0f172a' }}>{item.title}</Text>
                                            <Text type="secondary" style={{ fontSize: '12px' }}>{item.id}</Text>
                                        </div>
                                        <Tag color={item.remaining > 0 ? 'success' : 'default'} style={{ margin: 0, borderRadius: '999px', fontWeight: 700 }}>
                                            {t(item.statusKey)}
                                        </Tag>
                                    </div>
                                    <Divider style={{ margin: '10px 0' }} />
                                    <InfoRow icon={<CalendarOutlined />} label={t('package_page.purchase_date')} value={item.date} />
                                    <InfoRow label={t('package_page.remaining')} value={`${item.remaining} ${t('charging.unit_swap')}`} />
                                    <InfoRow label={t('package_page.expires_at')} value={formatDate(item.expiresAt)} />
                                    <InfoRow label={t('package_page.amount')} value={`฿${item.amount}`} strong />
                                    <Button
                                        block
                                        icon={<FileTextOutlined />}
                                        onClick={() => navigate('/screen10')}
                                        style={{ height: '42px', borderRadius: '14px', marginTop: '14px', color: '#047857', borderColor: '#10b981', fontWeight: 800 }}
                                    >
                                        {t('screen8.view_receipt')}
                                    </Button>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </MobileLayout>
    );
};

const PackageStat = ({ label, value, sub }) => (
    <div style={{ background: 'rgba(255,255,255,0.74)', border: '1px solid #D1FAE5', borderRadius: '16px', padding: '12px' }}>
        <Text type="secondary" style={{ display: 'block', fontSize: '11px', fontWeight: 700, marginBottom: '4px' }}>{label}</Text>
        <Text strong style={{ fontSize: '17px', color: '#0f172a' }}>{value}</Text>
        {sub && <Text type="secondary" style={{ fontSize: '12px', marginLeft: '4px' }}>{sub}</Text>}
    </div>
);

const InfoRow = ({ icon, label, value, strong }) => (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px', marginTop: '8px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            {icon && React.cloneElement(icon, { style: { color: '#10b981', fontSize: '13px' } })}
            <Text type="secondary" style={{ fontSize: '12px' }}>{label}</Text>
        </div>
        <Text strong={strong} style={{ fontSize: '13px', textAlign: 'right', color: strong ? '#0f172a' : '#475569' }}>{value}</Text>
    </div>
);

export default Screen8;
