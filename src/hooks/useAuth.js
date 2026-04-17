import { useState, useEffect, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Modal } from 'antd';
import { useTranslation } from 'react-i18next';
import authService from '../services/authService';

export const useAuth = () => {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();
    const [phone, setPhone] = useState(localStorage.getItem('userPhone') || '');
    const [otp, setOtp] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
        const hasActiveSwap = localStorage.getItem('activeSwapSession') === 'true'
            || localStorage.getItem('isCharging') === 'true';
        const publicScreens = ['/screen1', '/screen3', '/'];

        if (isLoggedIn && publicScreens.includes(location.pathname)) {
            const cabinetId = localStorage.getItem('currentCabinetId') || localStorage.getItem('currentChargerId');
            const nextPath = hasActiveSwap
                ? '/screen6'
                : cabinetId ? `/screen2?cabinetId=${cabinetId}` : '/screen2';
            navigate(nextPath, { replace: true });
        }
    }, [navigate, location.pathname]);

    const handlePhoneChange = useCallback((value) => {
        // Only allow digits
        if (!/^\d*$/.test(value)) return;
        // Must start with 0 if not empty
        if (value.length > 0 && value[0] !== '0') return;
        // Max length 10
        if (value.length <= 10) {
            setPhone(value);
        }
    }, []);

    const login = useCallback(async () => {
        if (!phone) {
            Modal.error({ title: t('common.error'), content: t('auth.error_phone_required'), centered: true });
            return;
        }
        if (phone.length < 10) {
            Modal.error({ title: t('common.error'), content: t('auth.error_phone_invalid'), centered: true });
            return;
        }

        setIsLoading(true);
        try {
            await authService.login(phone);
            if (location.pathname !== '/screen3') {
                navigate('/screen3');
            }
        } catch {
            Modal.error({ title: t('common.error'), content: t('auth.error_generic'), centered: true });
        } finally {
            setIsLoading(false);
        }
    }, [location.pathname, navigate, phone, t]);

    const verifyOtp = async () => {
        if (otp.length !== 6) return;

        setIsLoading(true);
        setError('');
        try {
            // Use the current phone number from state or localStorage
            const userPhone = phone || localStorage.getItem('userPhone');
            const result = await authService.verifyOtp(userPhone, otp);

            if (result.success) {
                // Return success so the component can decide what to do next
                return { success: true };
            } else {
                setError(t('auth.otp_invalid'));
                Modal.error({
                    title: t('auth.otp_invalid_title'),
                    content: t('auth.otp_invalid_desc'),
                    centered: true,
                    okText: t('common.retry'),
                    maskClosable: true
                });
            }
        } catch {
            setError(t('auth.otp_error_generic'));
            Modal.error({
                title: t('common.error'),
                content: t('auth.otp_error_generic_desc'),
                centered: true
            });
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        await authService.logout();
        navigate('/screen1');
    };

    const proceedToOtp = () => {
        if (!phone || phone.length < 10) {
            Modal.error({ title: t('common.error'), content: t('auth.error_phone_invalid'), centered: true });
            return;
        }
        localStorage.setItem('userPhone', phone);
        navigate('/screen3');
    };

    const editPhone = () => {
        setPhone('');
        navigate('/screen1');
    };

    const resendOtp = async () => {
        setIsLoading(true);
        try {
            await authService.login(phone);
            Modal.success({ title: t('common.success'), content: t('auth.otp_resend_success'), centered: true });
        } catch {
            Modal.error({ title: t('common.error'), content: t('auth.otp_resend_error'), centered: true });
        } finally {
            setIsLoading(false);
        }
    };

    return {
        phone,
        setPhone: handlePhoneChange,
        otp,
        setOtp,
        isLoading,
        login,
        proceedToOtp,
        editPhone,
        resendOtp,
        verifyOtp,
        logout,
        error
    };
};

export default useAuth;
