import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiMapPin, FiClock } from "react-icons/fi";

import { getMyOrders } from "../../services/orderApi";
import { SkeletonList } from "../../components/Skeletons";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  "Out For Delivery": "bg-orange-100 text-orange-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const MyOrders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyOrders();
        setOrders(res.data.orders || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-5">My Orders</h1>
        <SkeletonList count={3} height="h-32" />
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FiPackage size={48} className="text-orange-200 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700">No orders yet</h2>
        <button
          onClick={() => navigate("/user/products")}
          className="mt-5 bg-orange-500 text-white px-6 py-2.5 rounded-xl font-medium"
        >
          Start Shopping
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-5">My Orders</h1>

      <div className="space-y-4">
        {orders.map((order, i) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <span className="text-xs text-gray-400">
                  Order #{order._id.slice(-6).toUpperCase()}
                </span>
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <FiClock size={12} />
                  {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span
                className={`text-xs font-semibold px-3 py-1 rounded-full ${
                  statusStyles[order.status] || "bg-gray-100 text-gray-600"
                }`}
              >
                {order.status}
              </span>
            </div>

            <div className="space-y-1 mb-3">
              {order.items.map((item, idx) => (
                <p key={idx} className="text-sm text-gray-600">
                  {item.product?.name || "Item"} x{item.quantity}
                </p>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-3">
              <span className="font-bold text-gray-800">₹{order.totalAmount}</span>
              <span className="text-xs text-gray-400">COD</span>
            </div>

            {order.status === "Out For Delivery" && (
              <div className="mt-3 bg-orange-50 rounded-xl p-3 flex items-center justify-between">
                <div>
                  <p className="text-xs text-gray-500">Delivery OTP</p>
                  <p className="text-lg font-bold text-orange-600 tracking-widest">
                    {order.otp}
                  </p>
                </div>
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(`/user/orders/${order._id}/track`)}
                  className="flex items-center gap-1 bg-orange-500 text-white px-4 py-2 rounded-xl text-sm font-medium"
                >
                  <FiMapPin size={14} /> Track
                </motion.button>
              </div>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default MyOrders;
