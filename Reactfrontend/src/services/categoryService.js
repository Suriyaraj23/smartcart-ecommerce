import api from "./api";

const getAllCategories = () => {
  return api.get("/categories");
};

const getCategoryById = (id) => {
  return api.get(`/categories/${id}`);
};

const createCategory = (category) => {
  return api.post("/categories", category);
};

const updateCategory = (id, category) => {
  return api.put(`/categories/${id}`, category);
};

const deleteCategory = (id) => {
  return api.delete(`/categories/${id}`);
};

const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};

export {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
export const getCategories = () => {
  return api.get("/categories");
};

export default categoryService;