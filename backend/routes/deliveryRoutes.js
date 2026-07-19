const express = require("express");
const router = express.Router();

const {
  getMyDeliveries,
  verifyOtp,
} = require("../controllers/orderController");

const auth = require("../middleware/auth");
const { isDeliveryBoy } = require("../middleware/roles");

router.use(auth, isDeliveryBoy);

router.get("/my-deliveries", getMyDeliveries);
router.post("/verify-otp", verifyOtp); // marks order as Delivered

module.exports = router;