import api from "./api";

export const stateService = {
    // Get all states
    getAllStates: async (params = {}) => {
        const response = await api.get('/states', { params });
        return response.data;
    },

    // Get state by ID
    getStateById: async (id) => {
        const response = await api.get(`/states/${id}`);
        return response.data;
    }
};

export default stateService;