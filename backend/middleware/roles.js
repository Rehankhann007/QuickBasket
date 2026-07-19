const isAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      success: false,
      message: "Admin access required",
    });
  }

  next();
};

const isDeliveryBoy = (req, res, next) => {
  if (req.user.role !== "deliveryBoy") {
    return res.status(403).json({
      success: false,
      message: "Delivery Boy access required",
    });
  }

  next();
};

module.exports = {
  isAdmin,
  isDeliveryBoy,
};