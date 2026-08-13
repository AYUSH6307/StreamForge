import api from "./api";

// Get all streams
export const getStreams = async () => {
    return await api.get("/streams");
};

// Get single stream
export const getStream = async (id) => {
    return await api.get(`/streams/${id}`);
};

// Create stream
export const createStream = async (streamData) => {
    return await api.post("/streams/create", streamData);
};

// Update stream
export const updateStream = async (id, streamData) => {
    return await api.put(`/streams/${id}`, streamData);
};

// Delete stream
export const deleteStream = async (id) => {
    return await api.delete(`/streams/${id}`);
};