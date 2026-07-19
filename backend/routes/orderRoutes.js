const express = require("express");
const router = express.Router();

const {
  placeOrder,
  getMyOrders,
  getSingleOrder,
} = require("../controllers/orderController");

const auth = require("../middleware/auth");

router.use(auth);

router.post("/", placeOrder); // COD order placed from cart
router.get("/my-orders", getMyOrders);
router.get("/:id", getSingleOrder); // user/admin/deliveryBoy can view if they have access (controller can be tightened later)

module.exports = router;