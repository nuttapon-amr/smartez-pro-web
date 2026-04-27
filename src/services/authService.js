const authService = {
    login: async (username) => {
        // In a real app, this would call an API:
        // const response = await api.post('/auth/login', { username });
        // return response.data;

        // Simulating API behavior for now as the current code uses localStorage directly
        return new Promise((resolve) => {
            setTimeout(() => {
                localStorage.setItem('username', username);
                resolve({ success: true });
            }, 500);
        });
    },

    logout: async () => {
        localStorage.clear();
        return { success: true };
    }
};

export default authService;
