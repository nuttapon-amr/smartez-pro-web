import React, { useState } from 'react';
import { Button, Typography, Card, Space, Modal, Upload, Spin, message } from 'antd';
import {
    DownloadOutlined,
    UploadOutlined,
    LoadingOutlined
} from '@ant-design/icons';
import MobileLayout from '../components/MobileLayout';
import Header from '../components/Header';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getBillingOption, setMockUserEntitlement } from '../data/mockSwapData';

import qrImage from '../assets/thai_promptpay_qr_mockup.png';

const { Title, Text } = Typography;

const Screen4 = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploading, setUploading] = useState(false);

    const billingOptionId = location.state?.billingOptionId || 'swap_5_30d';
    const selectedBilling = getBillingOption(billingOptionId);
    const amountToPay = location.state?.price ?? selectedBilling.price;
    const packageLabel = location.state?.packageLabel || t(selectedBilling.titleKey);
    const quotaLabel = location.state?.quotaLabel || t(selectedBilling.quotaLabelKey);

    const handleDownloadQR = () => {
        const link = document.createElement('a');
        link.href = qrImage;
        link.download = `AMR_Swap_Payment_QR_${amountToPay.toFixed(2)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        message.success(t('payment.save_image_success'));
    };

    React.useEffect(() => {
        const hasActiveSwap = localStorage.getItem('activeSwapSession') === 'true'
            || localStorage.getItem('isCharging') === 'true';
        if (hasActiveSwap) {
            navigate('/screen6');
        }
    }, [navigate]);

    const handleUploadSlip = () => {
        setIsModalOpen(false);
        setUploading(true);

        // Mocking slip verification process
        setTimeout(() => {
            setUploading(false);

            // Randomly simulate success (80%) or failure (20%) for demo purposes
            const isSuccess = Math.random() > 0.2;

            if (isSuccess) {
                message.success(t('payment.success_slip'));
                if (selectedBilling.group === 'per_swap') {
                    setMockUserEntitlement('quota');
                } else if (selectedBilling.id === 'pass_1d') {
                    setMockUserEntitlement('daily');
                } else if (selectedBilling.group === 'pass') {
                    setMockUserEntitlement('monthly');
                }
                localStorage.setItem('activeSwapSession', 'true');
                localStorage.setItem('activeBillingOptionId', billingOptionId);
                localStorage.setItem('activeBillingMode', selectedBilling.type);
                navigate('/screen6');
            } else {
                Modal.error({
                    title: t('payment.failed_slip_title'),
                    content: (
                        <div>
                            <p>{t('payment.failed_slip_desc')}</p>
                            <Text type="secondary" style={{ fontSize: '12px' }}>{t('payment.failed_slip_reason')}</Text>
                        </div>
                    ),
                    okText: t('common.retry'),
                    centered: true,
                    borderRadius: 16
                });
            }
        }, 5000);
    };

    const uploadProps = {
        beforeUpload: (file) => {
            const isImage = file.type.startsWith('image/');
            if (!isImage) {
                message.error(t('payment.support_images_only'));
                return Upload.LIST_IGNORE;
            }
            return true;
        },
        customRequest: ({ onSuccess }) => {
            setTimeout(() => {
                onSuccess("ok");
                handleUploadSlip();
            }, 500);
        },
        showUploadList: false,
    };

    return (
        <MobileLayout>
            {/* Full Screen Loading Overlay */}
            {uploading && (
                <div style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    zIndex: 2000,
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    gap: '20px'
                }}>
                    <Spin indicator={<LoadingOutlined style={{ fontSize: 48, color: '#EF4444' }} spin />} />
                    <div style={{ textAlign: 'center' }}>
                        <Text strong style={{ fontSize: '18px', display: 'block', color: '#1f2937' }}>
                            {t('payment.verifying_slip')}
                        </Text>
                        <Text type="secondary">{t('payment.dont_close_page')}</Text>
                    </div>
                </div>
            )}

            <Header title={t('payment.title')} showBack={true} />

            <div style={{ padding: '0 20px 24px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>

                {/* Payment Amount Card */}
                <div style={{ textAlign: 'center', margin: '10px 0 24px 0' }}>
                    <Text type="secondary" style={{ fontSize: '14px' }}>{t('payment.amount_to_pay')}</Text>
                    <Title level={1} style={{ margin: '4px 0', color: '#1f2937', fontSize: '36px' }}>
                        <span style={{ fontSize: '24px', marginRight: '4px', fontWeight: 400 }}>฿</span>
                        {amountToPay.toFixed(2)}
                    </Title>
                    <div style={{
                        display: 'inline-block',
                        padding: '4px 12px',
                        backgroundColor: '#f1f5f9',
                        borderRadius: '20px'
                    }}>
                        <Text style={{ fontSize: '12px', color: '#64748b' }}>{packageLabel}</Text>
                    </div>
                    <Text type="secondary" style={{ display: 'block', fontSize: '12px', marginTop: '8px' }}>
                        {quotaLabel}
                    </Text>
                </div>

                {/* QR Code Card */}
                <Card
                    style={{
                        borderRadius: '24px',
                        border: '1px solid #e2e8f0',
                        boxShadow: '0 10px 25px -5px rgba(0,0,0,0.05)',
                        marginBottom: '24px',
                        overflow: 'hidden'
                    }}
                    styles={{ body: { padding: '32px 24px' } }}
                >
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
                        <div style={{
                            padding: '12px',
                            backgroundColor: '#fff',
                            borderRadius: '16px',
                            border: '1px solid #f8fafc'
                        }}>
                            <img
                                src={qrImage}
                                alt="Payment QR Code"
                                style={{ width: '220px', height: '220px', display: 'block' }}
                            />
                        </div>

                        <Space direction="vertical" align="center" size={4}>
                            <Text strong style={{ fontSize: '16px' }}>{t('payment.scan_banking_title') || 'Scan with Banking App'}</Text>
                            <Text type="secondary" style={{ fontSize: '13px' }}>{t('payment.scan_banking')}</Text>
                        </Space>

                        <Button
                            icon={<DownloadOutlined />}
                            onClick={handleDownloadQR}
                            style={{
                                borderRadius: '20px',
                                color: '#10b981',
                                borderColor: '#10b981'
                            }}
                        >
                            {t('payment.save_image')}
                        </Button>
                    </div>
                </Card>

                {/* Footer Actions */}
                <div style={{ marginTop: 'auto' }}>
                    <Button
                        type="primary"
                        size="large"
                        block
                        icon={<UploadOutlined />}
                        style={{
                            height: '56px',
                            borderRadius: '28px',
                            backgroundColor: '#1f2937',
                            border: 'none',
                            fontSize: '16px',
                            fontWeight: 'bold',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '10px',
                            marginBottom: '12px'
                        }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        {t('payment.attach_slip')}
                    </Button>
                    <Button
                        type="text"
                        block
                        style={{ color: '#6b7280' }}
                        onClick={() => {
                            Modal.confirm({
                                title: t('payment.cancel_confirm_title'),
                                content: t('payment.cancel_confirm_desc'),
                                okText: t('common.ok'),
                                cancelText: t('common.cancel'),
                                centered: true,
                                onOk: () => navigate('/screen11'),
                                okButtonProps: {
                                    danger: true,
                                    style: { borderRadius: '8px' }
                                },
                                cancelButtonProps: {
                                    style: { borderRadius: '8px' }
                                }
                            });
                        }}
                    >
                        {t('payment.cancel_payment')}
                    </Button>
                </div>

            </div>

            {/* Upload Modal */}
            <Modal
                title={t('payment.select_slip')}
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                footer={null}
                centered
                styles={{ body: { padding: '24px' } }}
            >
                <Upload.Dragger {...uploadProps} accept="image/*">
                    <p className="ant-upload-drag-icon" style={{ marginBottom: '16px' }}>
                        <UploadOutlined style={{ fontSize: '48px', color: '#10b981' }} />
                    </p>
                    <p className="ant-upload-text" style={{ fontSize: '16px', fontWeight: 600 }}>
                        {t('payment.click_or_drag')}
                    </p>
                    <p className="ant-upload-hint" style={{ color: '#6b7280' }}>
                        {t('payment.support_images_only')}
                    </p>
                </Upload.Dragger>
            </Modal>
        </MobileLayout>
    );
};

export default Screen4;
