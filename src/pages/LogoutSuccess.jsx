import React, { useEffect } from 'react';
import { Button, Result, Typography } from 'antd';
import { CheckCircleFilled } from '@ant-design/icons';
import { useTranslation } from 'react-i18next';
import MobileLayout from '../components/MobileLayout';

const { Text } = Typography;

const LogoutSuccess = () => {
    const { t, i18n } = useTranslation();

    useEffect(() => {
        document.title = `${t('logout_success.title')} | AMR Battery Swap`;
    }, [t]);

    return (
        <MobileLayout>
            <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'linear-gradient(180deg, #ECFDF5 0%, #FFFFFF 100%)', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '28px' }}>
                    <Button
                        type="text"
                        onClick={() => i18n.changeLanguage(i18n.language === 'th' ? 'en' : 'th')}
                        style={{ background: 'rgba(255,255,255,0.85)', borderRadius: '12px', height: 'auto', padding: '4px 12px', fontWeight: 700 }}
                    >
                        {i18n.language === 'th' ? 'TH' : 'EN'}
                    </Button>
                </div>

                <div style={{ flex: 1, display: 'flex', alignItems: 'center' }}>
                <Result
                    icon={<CheckCircleFilled style={{ color: '#10b981' }} />}
                    title={t('logout_success.title')}
                    subTitle={t('logout_success.desc')}
                    extra={(
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '10px' }}>
                            <Text strong style={{ fontSize: '14px', color: '#0f172a' }}>
                                {t('logout_success.scan_again')}
                            </Text>
                            <Text type="secondary" style={{ fontSize: '12px', lineHeight: 1.5 }}>
                                {t('logout_success.note')}
                            </Text>
                        </div>
                    )}
                />
                </div>
            </div>
        </MobileLayout>
    );
};

export default LogoutSuccess;
