const express = require("express");
const router = express.Router();

const { getDashboardStats, getAllUsers } = require("../controllers/adminController");

const {
  getAllOrders,
  updateOrderStatus,
  assignDeliveryBoy,
  getDeliveryBoys,
} = require("../controllers/orderController");

const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/roles");

router.use(auth, isAdmin); // every route below is admin-only

router.get("/dashboard", getDashboardStats);
router.get("/users", getAllUsers);

router.get("/orders", getAllOrders);
router.put("/orders/:id/status", updateOrderStatus); // Pending/Confirmed/Cancelled
router.put("/orders/:id/assign-delivery-boy", assignDeliveryBoy); // Confirmed -> Out For Delivery

router.get("/delivery-boys", getDeliveryBoys);

module.exports = router;