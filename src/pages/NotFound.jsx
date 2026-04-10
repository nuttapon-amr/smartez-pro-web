import React, { useEffect } from 'react';
import { Result, Button } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const NotFound = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  useEffect(() => {
    document.title = `${t('common.not_found')} | EVC Prepaid`;
  }, [t]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100vh',
      backgroundColor: '#f0f2f5'
    }}>
      <Result
        status="404"
        title="404"
        subTitle={t('common.not_found_desc')}
        extra={
          <Button type="primary" onClick={() => navigate('/screen1')}>
            {t('common.back_home')}
          </Button>
        }
      />
    </div>
  );
};

export default NotFound;
