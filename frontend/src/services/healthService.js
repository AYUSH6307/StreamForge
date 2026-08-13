import api from "./api";

export const getHealth = async () => {
    return await api.get("/health/");
};