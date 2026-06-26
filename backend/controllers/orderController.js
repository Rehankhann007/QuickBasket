const Cart = require("../models/Cart");
const Order = require("../models/Order");
const User = require("../models/User");

const generateOTP = () => {
  return Math.floor(1000 + Math.random() * 9000).toString();
};

const getDeliveryBoys = async (req, res) => {
  try {
    const deliveryBoys = await User.find({
      role: "deliveryBoy",
    }).select("-password");

    res.status(200).json({
      success: true,
      count: deliveryBoys.length,
      deliveryBoys,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Place a new order from the user's cart. COD only for now.
 * Optionally accepts deliveryAddress { address, lat, lng } in body.
 */
const placeOrder = async (req, res) => {
  try {
    const { deliveryAddress } = req.body;

    const cart = await Cart.findOne({
      user: req.user.id,
    }).populate("items.product");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Cart is empty",
      });
    }

    let totalAmount = 0;

    cart.items.forEach((item) => {
      totalAmount += item.product.price * item.quantity;
    });

    const order = await Order.create({
      user: req.user.id,
      items: cart.items,
      totalAmount,
      paymentMethod: "COD",
      paymentStatus: "Pending",
      deliveryAddress: deliveryAddress || undefined,
    });

    cart.items = [];
    await cart.save();

    // Notify admins in real time that a new order has arrived
    const io = req.app.get("io");
    if (io) {
      io.to("admins").emit("new_order", { orderId: order._id });
    }

    res.status(201).json({
      success: true,
      message: "Order placed successfully (Cash on Delivery)",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("deliveryBoy", "name email")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user.id })
      .populate("items.product")
      .populate("deliveryBoy", "name")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getSingleOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("deliveryBoy", "name email currentLocation")
      .populate("items.product");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    res.status(200).json({
      success: true,
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Admin confirms an order (before assigning a delivery boy).
 * Pending -> Confirmed
 */
const updateOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatuses = ["Pending", "Confirmed", "Cancelled"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message:
          "Use this endpoint only for Pending/Confirmed/Cancelled. Use assign-delivery-boy for Out For Delivery.",
      });
    }

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const io = req.app.get("io");
    if (io) {
      io.to(`order_${order._id}`).emit("order_status_updated", {
        orderId: order._id,
        status: order.status,
      });
      io.to(`user_${order.user}`).emit("order_status_updated", {
        orderId: order._id,
        status: order.status,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order updated successfully",
      order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Admin assigns a delivery boy to a CONFIRMED order.
 * Confirmed -> Out For Delivery. Generates the delivery OTP here.
 */
const assignDeliveryBoy = async (req, res) => {
  try {
    const { deliveryBoyId } = req.body;

    const existingOrder = await Order.findById(req.params.id);

    if (!existingOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (existingOrder.status !== "Confirmed") {
      return res.status(400).json({
        success: false,
        message: "Order must be Confirmed before assigning a delivery boy",
      });
    }

    const deliveryBoy = await User.findOne({
      _id: deliveryBoyId,
      role: "deliveryBoy",
    });

    if (!deliveryBoy) {
      return res.status(404).json({
        success: false,
        message: "Delivery boy not found",
      });
    }

    const otp = generateOTP();

    const order = await Order.findByIdAndUpdate(
      req.params.id,
      {
        deliveryBoy: deliveryBoyId,
        status: "Out For Delivery",
        otp,
        assignedAt: new Date(),
      },
      { new: true }
    );

    const io = req.app.get("io");
    if (io) {
      io.to(`delivery_${deliveryBoyId}`).emit("new_assignment", {
        orderId: order._id,
      });
      io.to(`user_${order.user}`).emit("order_status_updated", {
        orderId: order._id,
        status: order.status,
      });
      io.to("admins").emit("order_status_updated", {
    orderId: order._id,
    status: order.status,
});
    }

    res.status(200).json({
      success: true,
      message: "Delivery boy assigned. Order is now Out For Delivery.",
      order,
      // OTP is also emailed/shown to the user separately in a real app;
      // returned here only because it's the user who reads it out to the
      // delivery boy on arrival - the order owner should see it via getSingleOrder/getMyOrders.
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyDeliveries = async (req, res) => {
  try {
    const orders = await Order.find({
      deliveryBoy: req.user.id,
    })
      .populate("user", "name email")
      .populate("items.product")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * Delivery boy verifies OTP given by the user at the doorstep.
 * Out For Delivery -> Delivered
 */
const verifyOtp = async (req, res) => {
  try {
    const { orderId, otp } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.deliveryBoy?.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: "You are not assigned to this order",
      });
    }

    if (order.otp !== otp) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP",
      });
    }

    order.status = "Delivered";
    order.otpVerified = true;
    order.paymentStatus = "Paid"; // COD collected on delivery
    order.deliveredAt = new Date();

    await order.save();

    const io = req.app.get("io");
    if (io) {
      io.to(`order_${order._id}`).emit("order_status_updated", {
        orderId: order._id,
        status: order.status,
      });
      io.to(`user_${order.user}`).emit("order_status_updated", {
        orderId: order._id,
        status: order.status,
      });
    }

    res.status(200).json({
      success: true,
      message: "Order Delivered Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getAllOrders,
  getMyOrders,
  getSingleOrder,
  updateOrderStatus,
  getMyDeliveries,
  getDeliveryBoys,
  assignDeliveryBoy,
  verifyOtp,
};