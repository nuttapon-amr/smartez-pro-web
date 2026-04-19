import React, { useEffect } from 'react';
import { Button, Result, Typography } from 'antd';
import { CheckCircleFilled, QrcodeOutlined } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import MobileLayout from '../components/MobileLayout';

const { Text } = Typography;

const LogoutSuccess = () => {
    const { t } = useTranslation();

    useEffect(() => {
        document.title = `${t('logout_success.title')} | AMR Battery Swap`;
    }, [t]);

    return (
        <MobileLayout>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 100%)', padding: '24px' }}>
                <Result
                    icon={<CheckCircleFilled style={{ color: '#10b981' }} />}
                    title={t('logout_success.title')}
                    subTitle={t('logout_success.desc')}
                    extra={(
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
                            <Button
                                type="primary"
                                size="large"
                                icon={<QrcodeOutlined />}
                                style={{ height: '54px', borderRadius: '18px', background: '#10b981', border: 'none', fontWeight: 800, padding: '0 22px' }}
                                onClick={() => window.location.replace('#/404')}
                            >
                                {t('logout_success.scan_again')}
                            </Button>
                            <Text type="secondary" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                                {t('logout_success.note')}
                            </Text>
                        </div>
                    )}
                />
            </div>
        </MobileLayout>
    );
};

export default LogoutSuccess;
