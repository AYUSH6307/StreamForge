import api from "./api";

// Get statistics for current user
export const getStats = async () => {
    return await api.get("/stats");
};