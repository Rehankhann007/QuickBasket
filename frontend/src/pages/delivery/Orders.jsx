import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMapPin, FiClock } from "react-icons/fi";
import { connectSocket, getSocket } from "../../services/socket";

import { getMyDeliveries } from "../../services/orderApi";
import { SkeletonList } from "../../components/Skeletons";

const statusStyles = {
  "Out For Delivery": "bg-orange-100 text-orange-700",
  Delivered: "bg-green-100 text-green-700",
};

const filters = ["All", "Out For Delivery", "Delivered"];

const Orders = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");

  useEffect(() => {

    const fetchOrders = async () => {
        try {
            const res = await getMyDeliveries();
            setOrders(res.data.orders || []);
        } finally {
            setLoading(false);
        }
    };

    fetchOrders();

    connectSocket();

    const socket = getSocket();

    if (!socket) return;

    socket.on("new_assignment", fetchOrders);

    socket.on("order_status_updated", fetchOrders);

    return () => {
        socket.off("new_assignment");
        socket.off("order_status_updated");
    };

}, []);

  const filtered = orders.filter((o) => filter === "All" || o.status === filter);

  if (loading) {
    return (
      <div>
        <h1 className="text-xl font-bold text-gray-800 mb-4">My Deliveries</h1>
        <div className="flex gap-2 mb-5">
          {filters.map((f) => (
            <span
              key={f}
              className="px-4 py-2 rounded-full text-sm font-medium bg-gray-100 text-transparent animate-pulse"
            >
              {f}
            </span>
          ))}
        </div>
        <SkeletonList count={3} height="h-28" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-4">My Deliveries</h1>

      <div className="flex gap-2 mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              filter === f ? "bg-orange-500 text-white" : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        {filtered.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <p className="font-medium text-gray-700">{order.user?.name}</p>
                <p className="text-xs text-gray-400">{order.user?.email}</p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
                {order.status}
              </span>
            </div>

            <p className="flex items-center gap-1 text-xs text-gray-400 mb-3">
              <FiClock size={12} /> {new Date(order.createdAt).toLocaleString()}
            </p>

            <div className="flex justify-between items-center border-t pt-3">
              <span className="font-bold text-gray-800">₹{order.totalAmount}</span>
              {order.status === "Out For Delivery" && (
                <button
                  onClick={() => navigate(`/delivery/orders/${order._id}/map`)}
                  className="flex items-center gap-1.5 bg-orange-500 text-white text-sm px-4 py-2 rounded-xl font-medium"
                >
                  <FiMapPin size={14} /> Navigate
                </button>
              )}
            </div>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="text-center text-gray-400 py-12">No orders here</p>
        )}
      </div>
    </div>
  );
};

export default Orders;
