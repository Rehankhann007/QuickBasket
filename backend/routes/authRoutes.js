const express = require("express");
const router = express.Router();

const {
  signup,
  verifyOtp,
  resendOtp,
  forgotPassword,
  resetPassword,
  login,
  googleLogin,
  getMe,
} = require("../controllers/authController");

const auth = require("../middleware/auth");

router.post("/signup", signup);
router.post("/verify-otp", verifyOtp);
router.post("/resend-otp", resendOtp);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/login", login);
router.post("/google", googleLogin);

router.get("/me", auth, getMe);

module.exports = router;