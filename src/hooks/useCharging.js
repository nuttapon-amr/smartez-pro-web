import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import chargingService from '../services/chargingService';

export const useCharging = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [isCharging, setIsCharging] = useState(false);

    const checkStatus = async () => {
        setIsLoading(true);
        try {
            const result = await chargingService.getStatus();
            setIsCharging(result.isCharging);
        } catch (error) {
            console.error('Failed to fetch charging status', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    const stopCharging = async () => {
        try {
            await chargingService.stopCharging();
            navigate('/screen6');
        } catch (error) {
            console.error('Failed to stop charging', error);
        }
    };

    return {
        isLoading,
        isCharging,
        stopCharging,
        refreshStatus: checkStatus
    };
};

export default useCharging;
