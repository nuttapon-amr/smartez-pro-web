const ACTIVE_SWAP_STORAGE_KEY = 'activeSwapSession';
const LEGACY_ACTIVE_SESSION_KEY = 'isCharging';

const swapService = {
    getStatus: async () => {
        return new Promise((resolve) => {
            const hasActiveSwap = localStorage.getItem(ACTIVE_SWAP_STORAGE_KEY) === 'true'
                || localStorage.getItem(LEGACY_ACTIVE_SESSION_KEY) === 'true';
            setTimeout(() => {
                resolve({ hasActiveSwap });
            }, 1000);
        });
    },

    completeSwap: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.removeItem(ACTIVE_SWAP_STORAGE_KEY);
                localStorage.removeItem(LEGACY_ACTIVE_SESSION_KEY);
                resolve({ success: true });
            }, 500);
        });
    },

    getHistory: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([
                    { title: "วันนี้สลับแบต", energy: "2", cost: "90.00", type: 'today' },
                    { title: "อาทิตย์นี้สลับแบต", energy: "8", cost: "360.00", type: 'week' },
                    { title: "ปีนี้สลับแบต", energy: "96", cost: "4,320.00", type: 'year' },
                ]);
            }, 500);
        });
    }
};

export default swapService;
