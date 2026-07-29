import api from "./api";

export const addToCart = (
  userId,
  productId,
  quantity = 1
) => {
  return api.post("/cart/add", {
    userId: Number(userId),
    productId: Number(productId),
    quantity: Number(quantity),
  });
};

export const getCartItems = () => {
  return api.get("/cart");
};

export const getAllCartItems = () => {
  return api.get("/cart");
};

// Added for compatibility with Cart.jsx
export const getCartByUser = () => {
  return api.get("/cart");
};

// Update cart quantity
export const updateCartQuantity = (
  cartId,
  quantity
) => {
  return api.put(
    `/cart/${cartId}/quantity`,
    null,
    {
      params: {
        quantity: Number(quantity),
      },
    }
  );
};

export const deleteCartItem = (cartId) => {
  return api.delete(`/cart/${cartId}`);
};

export const removeFromCart = (cartId) => {
  return api.delete(`/cart/${cartId}`);
};

// Added for compatibility
export const removeCartItem = (cartId) => {
  return api.delete(`/cart/${cartId}`);
};

const cartService = {
  addToCart,
  getCartItems,
  getAllCartItems,
  getCartByUser,
  updateCartQuantity,
  deleteCartItem,
  removeFromCart,
  removeCartItem,
};

export default cartService;