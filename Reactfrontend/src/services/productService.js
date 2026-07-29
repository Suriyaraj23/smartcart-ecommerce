import api from "./api";

const getAllProducts = () => {
  return api.get("/products");
};

const getProductById = (id) => {
  return api.get(`/products/${id}`);
};

const createProduct = (product) => {
  return api.post("/products", product);
};

const updateProduct = (id, product) => {
  return api.put(`/products/${id}`, product);
};

const deleteProduct = (id) => {
  return api.delete(`/products/${id}`);
};

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};

export default productService;