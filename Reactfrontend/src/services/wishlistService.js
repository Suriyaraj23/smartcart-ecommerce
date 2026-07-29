import API from "./api";

export const getWishlist = async () => {
  const response = await API.get("/wishlist");
  return response.data;
};

export const addToWishlist = async (userId, productId) => {
  const response = await API.post("/wishlist", {
    user: {
      id: Number(userId),
    },
    product: {
      id: Number(productId),
    },
  });

  return response.data;
};

export const removeFromWishlist = async (wishlistId) => {
  const response = await API.delete(`/wishlist/${wishlistId}`);
  return response.data;
};

const wishlistService = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};

export default wishlistService;