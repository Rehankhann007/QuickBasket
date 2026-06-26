const express = require("express");
const http = require("http");
const cors = require("cors");
const dotenv = require("dotenv");

const connectDB = require("./config/db");
const initSocket = require("./config/socket");

const authRoutes = require("./routes/authRoutes");
const testRoutes = require("./routes/testRoutes");
const adminRoutes = require("./routes/adminRoutes");
const deliveryRoutes = require("./routes/deliveryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");

dotenv.config();

connectDB();

const app = express();
const httpServer = http.createServer(app);

app.use(cors());
app.use(express.json());

// ---- Socket.io (for live delivery location tracking) ----
const io = initSocket(httpServer);
app.set("io", io); // controllers use req.app.get("io") to emit events

app.use("/api/auth", authRoutes);
app.use("/api/test", testRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/delivery", deliveryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);

app.get("/", (req, res) => {
  res.send("QuickBasket API Running");
});

const PORT = process.env.PORT || 5000;

// NOTE: listen is now on httpServer, not app directly, so socket.io works on the same port
httpServer.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});