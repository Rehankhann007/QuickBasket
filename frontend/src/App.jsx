import { Routes, Route } from "react-router-dom";

import RoleProtectedRoute from "./components/RoleProtectedRoute";
import FlyToCartLayer from "./components/FlyToCartLayer";

import UserLayout from "./layouts/UserLayout";
import AdminLayout from "./layouts/AdminLayout";
import DeliveryLayout from "./layouts/DeliveryLayout";

// Public / Auth pages
import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";
import OtpVerify from "./pages/auth/OtpVerify";
import ForgotPassword from "./pages/auth/ForgotPassword";

// User pages
import Home from "./pages/user/Home";
import Products from "./pages/user/Products";
import Cart from "./pages/user/Cart";
import Checkout from "./pages/user/Checkout";
import MyOrders from "./pages/user/MyOrders";
import TrackOrder from "./pages/user/TrackOrder";
import UserProfile from "./pages/user/Profile";

// Admin pages
import AdminDashboard from "./pages/admin/Dashboard";
import AdminProducts from "./pages/admin/Products";
import AddProduct from "./pages/admin/AddProduct";
import AdminOrders from "./pages/admin/Orders";
import AdminUsers from "./pages/admin/Users";

// Delivery pages
import DeliveryDashboard from "./pages/delivery/Dashboard";
import DeliveryOrders from "./pages/delivery/Orders";
import MapTracking from "./pages/delivery/MapTracking";
import DeliveryProfile from "./pages/delivery/Profile";

function App() {
  return (
    <>
      <FlyToCartLayer />
      <Routes>
      {/* ---------- Public / Auth ---------- */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/otp-verify" element={<OtpVerify />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />

      {/* ---------- User (role: user) ---------- */}
      <Route
        path="/user"
        element={
          <RoleProtectedRoute allowedRoles={["user"]}>
            <UserLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<Home />} />
        <Route path="products" element={<Products />} />
        <Route path="cart" element={<Cart />} />
        <Route path="checkout" element={<Checkout />} />
        <Route path="orders" element={<MyOrders />} />
        <Route path="orders/:id/track" element={<TrackOrder />} />
        <Route path="profile" element={<UserProfile />} />
      </Route>

      {/* ---------- Admin (role: admin) ---------- */}
      <Route
        path="/admin"
        element={
          <RoleProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="add-product" element={<AddProduct />} />
        <Route path="orders" element={<AdminOrders />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>

      {/* ---------- Delivery Boy (role: deliveryBoy) ---------- */}
      <Route
        path="/delivery"
        element={
          <RoleProtectedRoute allowedRoles={["deliveryBoy"]}>
            <DeliveryLayout />
          </RoleProtectedRoute>
        }
      >
        <Route index element={<DeliveryDashboard />} />
        <Route path="orders" element={<DeliveryOrders />} />
        <Route path="orders/:id/map" element={<MapTracking />} />
        <Route path="profile" element={<DeliveryProfile />} />
      </Route>

      {/* ---------- Fallback: landing page redirects to login ---------- */}
      <Route path="/" element={<Login />} />
      <Route path="*" element={<Login />} />
      </Routes>
    </>
  );
}

export default App;
