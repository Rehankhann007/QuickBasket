const User = require("../models/User");
const Order = require("../models/Order");

/**
 * GET /api/admin/users
 * Returns all users (customers and delivery boys), excluding admins themselves.
 */
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find({ role: { $in: ["user", "deliveryBoy"] } })
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * GET /api/admin/dashboard
 * Returns: Total Users, Total Orders, Total Revenue,
 * Pending Orders Count, Delivered Orders Count
 */
const getDashboardStats = async (req, res) => {
  try {
    const [
      totalUsers,
      totalOrders,
      pendingOrdersCount,
      deliveredOrdersCount,
      revenueResult,
    ] = await Promise.all([
      User.countDocuments({ role: "user" }),
      Order.countDocuments(),
      Order.countDocuments({ status: "Pending" }),
      Order.countDocuments({ status: "Delivered" }),
      Order.aggregate([
        { $match: { status: "Delivered" } },
        { $group: { _id: null, total: { $sum: "$totalAmount" } } },
      ]),
    ]);

    const totalRevenue = revenueResult.length > 0 ? revenueResult[0].total : 0;

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalOrders,
        totalRevenue,
        pendingOrdersCount,
        deliveredOrdersCount,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
};