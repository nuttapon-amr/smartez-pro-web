import api from './api';

const chargingService = {
    getStatus: async () => {
        // const response = await api.get('/charging/status');
        // return response.data;

        return new Promise((resolve) => {
            const isCharging = localStorage.getItem('isCharging') === 'true';
            setTimeout(() => {
                resolve({ isCharging });
            }, 1000);
        });
    },

    stopCharging: async () => {
        // const response = await api.post('/charging/stop');
        // return response.data;

        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.removeItem('isCharging');
                resolve({ success: true });
            }, 500);
        });
    },

    getHistory: async () => {
        // const response = await api.get('/charging/history');
        // return response.data;

        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { title: "วันนี้ชาร์จไป", energy: "35.00", cost: "350.00", type: 'today' },
                    { title: "อาทิตย์นี้ชาร์จไป", energy: "140.00", cost: "1,400.00", type: 'week' },
                    { title: "ปีนี้ชาร์จไป", energy: "1,680.00", cost: "16,800.00", type: 'year' },
                ]);
            }, 500);
        });
    }
};

export default chargingService;
