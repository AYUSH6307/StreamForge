import api from "./api";

export const registerUser = async (userData) => {
    return await api.post("/users/register", userData);
};

export const loginUser = async (userData) => {
    return await api.post("/users/login", userData);
};

export const getCurrentUser = async () => {
    return await api.get("/users/me");
};