import api from "./api";

export const getCurrentUser = async () => {

    return await api.get("/me");

};