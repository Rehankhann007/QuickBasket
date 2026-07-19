const { Server } = require("socket.io");
const jwt = require("jsonwebtoken");
const Order = require("../models/Order");
const User = require("../models/User");


const initSocket = (httpServer) => {
  const io = new Server(httpServer, {
    cors: {
      origin: process.env.CLIENT_URL || "*",
      methods: ["GET", "POST"],
    },
  });

  // Auth middleware for sockets: client sends JWT same as REST API
  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication token missing"));

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = decoded; // { id, role }
      next();
    } catch (err) {
      next(new Error("Invalid or expired token"));
    }
  });

  io.on("connection", (socket) => {
    const { id, role } = socket.user;

    // Auto-join role-specific rooms
    if (role === "admin") {
      socket.join("admins");
    } else if (role === "deliveryBoy") {
      socket.join(`delivery_${id}`);
    } else {
      socket.join(`user_${id}`);
    }

    socket.on("join_order_room", ({ orderId }) => {
      if (orderId) socket.join(`order_${orderId}`);
    });

    socket.on("leave_order_room", ({ orderId }) => {
      if (orderId) socket.leave(`order_${orderId}`);
    });

    // Delivery boy broadcasts their live GPS position for a specific order
    socket.on("update_location", async ({ orderId, lat, lng }) => {
      try {
        if (role !== "deliveryBoy") return;
        if (!orderId || lat == null || lng == null) return;

        const updatedAt = new Date();

        // Persist on the order (so a late-joining client can fetch last known position via REST)
        await Order.findByIdAndUpdate(orderId, {
          currentLocation: { lat, lng, updatedAt },
        });

        // Also persist on the delivery boy's own profile
        await User.findByIdAndUpdate(id, {
          currentLocation: { lat, lng, updatedAt },
          isOnline: true,
        });

        io.to(`order_${orderId}`).emit("location_update", {
          orderId,
          lat,
          lng,
          updatedAt,
        });
      } catch (err) {
        console.log("update_location error:", err.message);
      }
    });

    socket.on("disconnect", async () => {
      if (role === "deliveryBoy") {
        try {
          await User.findByIdAndUpdate(id, { isOnline: false });
        } catch (err) {
          console.log("disconnect cleanup error:", err.message);
        }
      }
    });
  });

  return io;
};

module.exports = initSocket;