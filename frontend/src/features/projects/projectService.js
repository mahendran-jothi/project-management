import { apiWithAuth } from "@/lib/axios";
import { ENDPOINTS } from "@/constants/api";

const getAll = async (search = "") => {
    try {
        const response = await apiWithAuth.get(ENDPOINTS.PROJECTS, {
            params: { search }
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const create = async (payload) => {
    try {
        const res = await apiWithAuth.post(ENDPOINTS.PROJECTS, payload);
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const getById = async (id) => {
    try {
        const res = await apiWithAuth.get(`${ENDPOINTS.PROJECTS}/${id}`);
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};

const update = async (id, payload) => {
    try {
        const res = await apiWithAuth.put(`${ENDPOINTS.PROJECTS}/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


const remove = async (id, payload) => {
    try {
        const res = await apiWithAuth.delete(`${ENDPOINTS.PROJECTS}/${id}`, payload);
        return res.data;
    } catch (error) {
        throw error.response?.data || error;
    }
};


const projectService = {
    getAll,
    create,
    getById,
    update,
    remove
};

export default projectService;
