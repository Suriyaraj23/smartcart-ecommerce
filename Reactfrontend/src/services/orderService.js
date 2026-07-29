import api from "./api";

// Place an order using the logged-in user's ID
export const placeOrder = (userId) => {
  return api.post(`/orders/place/${userId}`);
};

// Get all orders
export const getAllOrders = () => {
  return api.get("/orders");
};

// Get one order by ID
export const getOrderById = (id) => {
  return api.get(`/orders/${id}`);
};

// Get orders belonging to one user
export const getOrdersByUser = (userId) => {
  return api.get(`/orders/user/${userId}`);
};

// Update order status
export const updateOrderStatus = (
  orderId,
  status
) => {
  return api.put(`/orders/${orderId}/status`, {
    status,
  });
};

// Delete an order
export const deleteOrder = (id) => {
  return api.delete(`/orders/${id}`);
};