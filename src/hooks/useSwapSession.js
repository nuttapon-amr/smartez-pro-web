import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import swapService from '../services/swapService';

export const useSwapSession = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [hasActiveSwap, setHasActiveSwap] = useState(false);

    const checkStatus = async () => {
        setIsLoading(true);
        try {
            const result = await swapService.getStatus();
            setHasActiveSwap(result.hasActiveSwap);
        } catch (error) {
            console.error('Failed to fetch swap status', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        checkStatus();
    }, []);

    const completeSwap = async () => {
        try {
            await swapService.completeSwap();
            navigate('/screen6');
        } catch (error) {
            console.error('Failed to complete swap', error);
        }
    };

    return {
        isLoading,
        hasActiveSwap,
        completeSwap,
        refreshStatus: checkStatus
    };
};

export default useSwapSession;
