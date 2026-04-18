const authService = {
    login: async (phone) => {
        // In a real app, this would call an API:
        // const response = await api.post('/auth/login', { phone });
        // return response.data;

        // Simulating API behavior for now as the current code uses localStorage directly
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem('userPhone', phone);
                resolve({ success: true });
            }, 500);
        });
    },

    verifyOtp: async (phone, otp) => {
        // In a real app:
        // const response = await api.post('/auth/verify-otp', { username: phone, password: otp });
        // return response.data;

        return new Promise((resolve) => {
            setTimeout(() => {
                if (otp === '123456') {
                    resolve({ success: true });
                } else {
                    resolve({ success: false, message: 'รหัส OTP ไม่ถูกต้อง' });
                }
            }, 500);
        });
    },

    logout: async () => {
        localStorage.clear();
        return { success: true };
    }
};

export default authService;
