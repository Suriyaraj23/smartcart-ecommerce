import api from "./api";

// Get All Users
export const getAllUsers = () => {
    return api.get("/users");
};

// Get User By Id
export const getUserById = (id) => {
    return api.get(`/users/${id}`);
};

// Get User By Email
export const getUserByEmail = (email) => {
    return api.get(`/users/email/${email}`);
};

// Create User
export const createUser = (user) => {
    return api.post("/users", user);
};

// Update User
export const updateUser = (id, user) => {
    return api.put(`/users/${id}`, user);
};

// Delete User
export const deleteUser = (id) => {
    return api.delete(`/users/${id}`);
};