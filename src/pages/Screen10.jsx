import React, { useState, useEffect } from 'react';
import { Typography, Card, Button, Divider, Row, Col, Tag, Modal, Form, Input, Select, Space, message } from 'antd';
import {
    DownloadOutlined,
    FileTextOutlined,
    ThunderboltFilled,
    EnvironmentOutlined,
    ClockCircleOutlined,
    ArrowLeftOutlined,
    CheckCircleFilled,
    PrinterOutlined
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { SWAP_RECEIPT, getBillingOption } from '../data/mockSwapData';

const { Title, Text } = Typography;
const { Option } = Select;

const Screen9 = () => {
    const { t, i18n } = useTranslation();
    const navigate = useNavigate();
    const [isTaxModalVisible, setIsTaxModalVisible] = useState(false);
    const [form] = Form.useForm();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasRequestedTax, setHasRequestedTax] = useState(() => {
        const requestedReceipts = localStorage.getItem('requestedTaxReceipts');
        if (!requestedReceipts) return false;
        return JSON.parse(requestedReceipts).includes(SWAP_RECEIPT.receiptNo);
    });
    const receiptData = {
        ...SWAP_RECEIPT,
        purchasedDuration: t('screen6.mock_purchased_duration')
    };
    const activeBillingOptionId = localStorage.getItem('activeBillingOptionId') || 'swap_5_30d';
    const activeBilling = getBillingOption(activeBillingOptionId);
    const activeBillingLabel = t(activeBilling.titleKey);
    const activeBillingQuota = t(activeBilling.quotaLabelKey);

    const formatDate = (dateStr) => {
        const date = new Date(dateStr);
        return date.toLocaleDateString(i18n.language === 'th' ? 'th-TH' : 'en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    useEffect(() => {
        document.title = `${t('screen9.title')} | AMR Battery Swap`;

        // Load saved tax info from localStorage
        const savedTaxInfo = localStorage.getItem('taxInvoiceInfo');
        if (savedTaxInfo) {
            try {
                const parsedInfo = JSON.parse(savedTaxInfo);
                form.setFieldsValue(parsedInfo);
            } catch (e) {
                console.error("Failed to parse saved tax info", e);
            }
        }
    }, [form, t]);

    const handleDownload = () => {
        message.loading({ content: t('screen9.preparing_file'), key: 'download' });
        setTimeout(() => {
            message.success({ content: t('screen9.download_success'), key: 'download' });
        }, 1500);
    };

    const handleTaxSubmit = (values) => {
        setIsSubmitting(true);
        // Save user info to localStorage for next time (pre-fill)
        localStorage.setItem('taxInvoiceInfo', JSON.stringify(values));

        setTimeout(() => {
            // Track that THIS specific receipt has requested tax
            const requestedReceipts = localStorage.getItem('requestedTaxReceipts') || '[]';
            const parsed = JSON.parse(requestedReceipts);
            if (!parsed.includes(SWAP_RECEIPT.receiptNo)) {
                parsed.push(SWAP_RECEIPT.receiptNo);
                localStorage.setItem('requestedTaxReceipts', JSON.stringify(parsed));
            }

            setIsSubmitting(false);
            setIsTaxModalVisible(false);
            setHasRequestedTax(true);
            message.success(t('screen9.request_success'));
        }, 2000);
    };

    return (
        <MobileLayout>
            <div style={{ background: '#f8fafc', minHeight: '100%', display: 'flex', flexDirection: 'column' }}>
                <Header title={t('screen9.title')} />

                <div style={{ padding: '20px', flex: 1 }}>
                    {/* Premium Receipt Card */}
                    <Card
                        style={{
                            borderRadius: '24px',
                            border: 'none',
                            boxShadow: '0 10px 25px rgba(0,0,0,0.05)',
                            position: 'relative',
                            overflow: 'hidden'
                        }}
                        styles={{ body: { padding: '32px 24px' } }}
                    >
                        {/* Status Watermark / Icon */}
                        <div style={{ position: 'absolute', top: '24px', right: '24px' }}>
                            <CheckCircleFilled style={{ color: '#10b981', fontSize: '32px' }} />
                        </div>

                        {/* Company/Station Header */}
                        <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                            <div style={{
                                width: '60px',
                                height: '60px',
                                borderRadius: '18px',
                                background: '#fee2e2',
                                display: 'inline-flex',
                                justifyContent: 'center',
                                alignItems: 'center',
                                marginBottom: '16px'
                            }}>
                                <ThunderboltFilled style={{ color: '#EF4444', fontSize: '28px' }} />
                            </div>
                            <Title level={4} style={{ margin: '0 0 4px 0', color: '#1e293b' }}>{receiptData.stationName}</Title>
                            <Text type="secondary" style={{ fontSize: '13px' }}>{t('screen9.electronic_receipt')}</Text>
                        </div>

                        <Divider style={{ borderStyle: 'dashed', margin: '24px 0' }} />

                        {/* Receipt Info Grid */}
                        <Row gutter={[16, 16]} style={{ marginBottom: '24px' }}>
                            <Col span={12}>
                                <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>{t('screen9.bill_no')}</Text>
                                <Text strong style={{ fontSize: '14px' }}>{receiptData.receiptNo}</Text>
                            </Col>
                            <Col span={12} style={{ textAlign: 'right' }}>
                                <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>{t('screen9.date') || 'วันที่'}</Text>
                                <Text strong style={{ fontSize: '14px' }}>{formatDate(receiptData.date)}</Text>
                            </Col>
                            <Col span={24}>
                                <Text type="secondary" style={{ fontSize: '11px', display: 'block' }}>{t('screen6.charger_id')}</Text>
                                <Text strong style={{ fontSize: '14px' }}>{receiptData.cabinetCode} • {receiptData.batteryModel} ({t('screen6.connector_no')} #{receiptData.pickupSlot})</Text>
                            </Col>
                        </Row>

                        {/* Transaction Detail Box */}
                        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '16px', marginBottom: '24px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>{t('screen5.energy_delivered')}</Text>
                                <Text strong style={{ fontSize: '13px' }}>{receiptData.pickupBatterySoc}%</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>{t('screen6.duration')}</Text>
                                <Text strong style={{ fontSize: '13px' }}>{receiptData.serviceTime}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>{t('history.purchased_duration')}</Text>
                                <Text strong style={{ fontSize: '13px' }}>{receiptData.purchasedDuration}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', gap: '12px', marginBottom: '12px' }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>{t('billing.your_plan')}</Text>
                                <div style={{ textAlign: 'right' }}>
                                    <Text strong style={{ display: 'block', fontSize: '13px' }}>{activeBillingLabel}</Text>
                                    <Text type="secondary" style={{ fontSize: '11px' }}>{activeBillingQuota}</Text>
                                </div>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>{t('history.price_per_hour')}</Text>
                                <Text strong style={{ fontSize: '13px' }}>฿{receiptData.unitPrice}/{t('charging.unit_swap')}</Text>
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                                <Text type="secondary" style={{ fontSize: '12px' }}>VAT 7%  </Text>
                                <Text strong style={{ fontSize: '13px' }}>฿{receiptData.vatAmount}</Text>
                            </div>
                        </div>

                        {/* Financial Summary */}
                        <Divider style={{ margin: '16px 0' }} />
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text strong style={{ fontSize: '18px', color: '#1e293b' }}>{t('history.net_amount')}</Text>
                            <Text strong style={{ fontSize: '24px', color: '#EF4444' }}>฿{receiptData.netAmount}</Text>
                        </div>

                        {/* Zig-zag bottom edge simulation */}
                        <div style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '6px',
                            background: 'white',
                            backgroundImage: 'linear-gradient(-45deg, #f8fafc 4px, transparent 0), linear-gradient(45deg, #f8fafc 4px, transparent 0)',
                            backgroundSize: '12px 12px'
                        }} />
                    </Card>

                    {/* Action Buttons */}
                    <div style={{ marginTop: '32px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        <Button
                            type="primary"
                            size="large"
                            block
                            icon={<DownloadOutlined />}
                            style={{
                                height: '56px',
                                borderRadius: '16px',
                                background: '#1e293b',
                                border: 'none',
                                fontWeight: 'bold'
                            }}
                            onClick={handleDownload}
                        >
                            {t('screen9.download')}
                        </Button>
                        {hasRequestedTax ? (
                            <div style={{
                                background: '#f0fdf4',
                                border: '1px solid #bbf7d0',
                                borderRadius: '16px',
                                padding: '16px',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <CheckCircleFilled style={{ color: '#10b981' }} />
                                <Text strong style={{ color: '#166534', fontSize: '13px' }}>{t('screen9.tax_already_requested')}</Text>
                            </div>
                        ) : (
                            <Button
                                size="large"
                                block
                                icon={<FileTextOutlined />}
                                style={{
                                    height: '56px',
                                    borderRadius: '16px',
                                    color: '#EF4444',
                                    borderColor: '#EF4444',
                                    fontWeight: 'bold'
                                }}
                                onClick={() => setIsTaxModalVisible(true)}
                            >
                                {t('screen9.tax_invoice')}
                            </Button>
                        )}
                        <Button
                            type="text"
                            block
                            icon={<ArrowLeftOutlined />}
                            style={{ marginTop: '8px', color: '#64748b' }}
                            onClick={() => navigate(-1)}
                        >
                            {t('screen9.back_to_history')}
                        </Button>
                    </div>
                </div>

                {/* Tax Invoice Modal */}
                <Modal
                    title={<div style={{ textAlign: 'center', width: '100%', paddingRight: '38px' }}><Title level={4} style={{ margin: 0 }}>{t('screen9.tax_invoice_request')}</Title></div>}
                    open={isTaxModalVisible}
                    onCancel={() => setIsTaxModalVisible(false)}
                    footer={null}
                    centered
                    borderRadius={24}
                    width={500}
                    styles={{ body: { padding: '24px' } }}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        onFinish={handleTaxSubmit}
                        requiredMark={false}
                    >
                        <Form.Item
                            label={t('screen9.tax_type')}
                            name="type"
                            initialValue="personal"
                        >
                            <Select size="large">
                                <Option value="personal">{t('screen9.personal')}</Option>
                                <Option value="company">{t('screen9.company')}</Option>
                            </Select>
                        </Form.Item>

                        <Form.Item
                            label={t('screen9.tax_name')}
                            name="name"
                            rules={[{ required: true, message: t('screen9.tax_name') }]}
                        >
                            <Input size="large" placeholder="" />
                        </Form.Item>

                        <Form.Item
                            label={t('screen9.tax_id')}
                            name="taxId"
                            rules={[{ required: true, message: t('screen9.tax_id') }]}
                        >
                            <Input size="large" placeholder="13 digits" maxLength={13} />
                        </Form.Item>

                        <Form.Item
                            label={t('screen9.address')}
                            name="address"
                            rules={[{ required: true, message: t('screen9.address') }]}
                        >
                            <Input.TextArea size="large" rows={3} placeholder="" />
                        </Form.Item>

                        <Form.Item
                            label={t('screen9.email')}
                            name="email"
                            rules={[
                                { required: true, message: t('screen9.email') },
                                { type: 'email', message: t('common.error') }
                            ]}
                        >
                            <Input size="large" placeholder="example@mail.com" />
                        </Form.Item>

                        <div style={{ marginTop: '24px' }}>
                            <Button
                                type="primary"
                                size="large"
                                block
                                htmlType="submit"
                                loading={isSubmitting}
                                style={{
                                    height: '52px',
                                    borderRadius: '12px',
                                    background: '#EF4444',
                                    border: 'none',
                                    fontWeight: 'bold'
                                }}
                            >
                                {t('common.confirm')}
                            </Button>
                            <Button
                                type="text"
                                size="large"
                                block
                                style={{ marginTop: '8px', color: '#94a3b8' }}
                                onClick={() => setIsTaxModalVisible(false)}
                            >
                                {t('common.cancel')}
                            </Button>
                        </div>
                    </Form>
                </Modal>
            </div>
        </MobileLayout>
    );
};

export default Screen9;
