import api from "./api";

// ---- User ----
export const placeOrder = (deliveryAddress) =>
  api.post("/orders", { deliveryAddress });

export const getMyOrders = () => api.get("/orders/my-orders");

export const getSingleOrder = (id) => api.get(`/orders/${id}`);

// ---- Admin ----
export const getDashboardStats = () => api.get("/admin/dashboard");

export const getAllOrders = () => api.get("/admin/orders");

export const getAllUsers = () => api.get("/admin/users");

export const updateOrderStatus = (id, status) =>
  api.put(`/admin/orders/${id}/status`, { status });

export const assignDeliveryBoy = (id, deliveryBoyId) =>
  api.put(`/admin/orders/${id}/assign-delivery-boy`, { deliveryBoyId });

export const getDeliveryBoys = () => api.get("/admin/delivery-boys");

// ---- Delivery Boy ----
export const getMyDeliveries = () => api.get("/delivery/my-deliveries");

export const verifyDeliveryOtp = (orderId, otp) =>
  api.post("/delivery/verify-otp", { orderId, otp });
