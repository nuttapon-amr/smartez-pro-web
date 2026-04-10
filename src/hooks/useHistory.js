import { useState, useEffect } from 'react';
import chargingService from '../services/chargingService';

export const useHistory = () => {
    const [history, setHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchHistory = async () => {
        setIsLoading(true);
        try {
            const data = await chargingService.getHistory();
            setHistory(data);
        } catch (error) {
            console.error('Failed to fetch history', error);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchHistory();
    }, []);

    return {
        history,
        isLoading,
        refreshHistory: fetchHistory
    };
};

export default useHistory;
