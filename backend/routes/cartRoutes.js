const express = require("express");
const router = express.Router();

const {
  addToCart,
  getCart,
  clearCart,
  updateCartItem,
  removeCartItem,
} = require("../controllers/cartController");

const auth = require("../middleware/auth");

router.use(auth); // every cart route needs a logged-in user

router.get("/", getCart);
router.post("/add", addToCart);
router.put("/update", updateCartItem);
router.delete("/remove", removeCartItem);
router.delete("/clear", clearCart);

module.exports = router;