import api from "./api";

export const cityService = {
    // Get all cities
    getAllCities: async (params = {}) => {
        const response = await api.get('/cities', { params });
        return response.data;
    },

    // Get cities by state ID
    getCitiesByState: async (stateId) => {
        const response = await api.get(`/cities/state/${stateId}`);
        return response.data;
    },

    // Get city by ID
    getCityById: async (id) => {
        const response = await api.get(`/cities/${id}`);
        return response.data;
    }
};

export default cityService;