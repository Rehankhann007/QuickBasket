const express = require("express");
const router = express.Router();

const auth = require("../middleware/auth");

router.get("/profile", auth, (req, res) => {
  res.status(200).json({
    success: true,
    message: "Protected Route Accessed",
    user: req.user,
  });
});

module.exports = router;
