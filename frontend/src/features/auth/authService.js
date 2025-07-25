import { apiWithAuth } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/api";

const login = async (credentials) => {
    try {
        const response = await apiWithAuth.post(ENDPOINTS.LOGIN, credentials);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const authService = {
    login
};

export default authService;
