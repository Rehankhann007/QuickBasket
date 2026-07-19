const express = require("express");
const router = express.Router();

const {
  createProduct,
  getAllProducts,
  getSingleProduct,
  updateProduct,
  deleteProduct,
} = require("../controllers/productController");

const auth = require("../middleware/auth");
const { isAdmin } = require("../middleware/roles");

// Public - anyone (even logged out) can browse the store
router.get("/", getAllProducts);
router.get("/:id", getSingleProduct);

// Admin only
router.post("/", auth, isAdmin, createProduct);
router.put("/:id", auth, isAdmin, updateProduct);
router.delete("/:id", auth, isAdmin, deleteProduct);

module.exports = router;