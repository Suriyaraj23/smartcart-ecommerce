import api from "./api";

export const getOrderItemsByOrderId = (orderId) => {
  return api.get(`/order-items/order/${orderId}`);
};