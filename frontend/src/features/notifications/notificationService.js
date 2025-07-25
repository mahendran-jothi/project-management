import { apiWithAuth } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/api";

const getAll = async () => {
    try {
        const response = await apiWithAuth.get(ENDPOINTS.NOTIFICATIONS);
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


const notificationService = {
    getAll
};

export default notificationService;
