import api from "./api";

export const getStats = async () => {
    return await api.get("/stats/");
};

export const getProcessingStatus = async () => {
    return await api.get("/stats/processing");
};

export const getProcessingState = async () => {
    return await api.get("/stats/state");
};