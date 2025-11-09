import api from "./api";

export const hosterService = {
    // ✅ Get all hosters
    getAllHosters: async () => {
        const response = await api.get('/hosters');
        return response.data;
        console.log("Hosters API response:", response.data);

    },

    // ✅ Get single hoster by ID
    getHosterById: async (id) => {
        const response = await api.get(`/hosters/${id}`);
        return response.data;
    },

    // ✅ Create new hoster
    createHoster: async (hosterData) => {
        const response = await api.post('/hosters', hosterData);
        return response.data;
    },

    // ✅ Update hoster details
    updateHoster: async (id, hosterData) => {
        const response = await api.put(`/hosters/${id}`, hosterData);
        return response.data;
    },

    // ✅ PATCH — Update hoster status (Admin Validation)
    updateHosterStatus: async (id, statusData) => {
        // debugger 
        try {
            console.log("🔹 Sending PATCH:", `/hosters/${id}/status`, statusData);
            const response = await api.patch(`/hosters/${id}/status`, statusData );
                // {
                // headers: {
                //     "Content-Type": "application/json",
                // },
                // withCredentials: false, // keep false unless backend requires cookies
            // });
            return response.data;
        } catch (error) {
            console.error("❌ Error updating hoster status:", error);
            throw error;
        }
    },

    // ✅ Upload document
    uploadDocument: async (hosterId, documentType, file) => {
        const formData = new FormData();
        formData.append('file', file);
        formData.append('documentType', documentType);

        const response = await api.post(`/hosters/${hosterId}/documents`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' },
        });
        return response.data;
    },

    // ✅ Delete hoster
    deleteHoster: async (id) => {
        const response = await api.delete(`/hosters/${id}`);
        return response.data;
    },
};

export default hosterService;
