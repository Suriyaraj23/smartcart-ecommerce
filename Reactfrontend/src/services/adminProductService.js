import API from "./api";

export const getAllProducts = async () => {
    const response = await API.get("/products");
    return response.data;
};

export const addProduct = async (product) => {
    const response = await API.post("/products", product);
    return response.data;
};

export const updateProduct = async (id, product) => {
    const response = await API.put(`/products/${id}`, product);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
};

export const getProductById = async (id) => {
    const response = await API.get(`/products/${id}`);
    return response.data;
};