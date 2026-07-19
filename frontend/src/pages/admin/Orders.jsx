import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiClock, FiTruck, FiX } from "react-icons/fi";
import { connectSocket, getSocket } from "../../services/socket";

import {
  getAllOrders,
  updateOrderStatus,
  assignDeliveryBoy,
  getDeliveryBoys,
} from "../../services/orderApi";
import { SkeletonList } from "../../components/Skeletons";

const statusStyles = {
  Pending: "bg-yellow-100 text-yellow-700",
  Confirmed: "bg-blue-100 text-blue-700",
  "Out For Delivery": "bg-orange-100 text-orange-700",
  Delivered: "bg-green-100 text-green-700",
  Cancelled: "bg-red-100 text-red-700",
};

const filters = ["All", "Pending", "Confirmed", "Out For Delivery", "Delivered", "Cancelled"];

const AssignModal = ({ order, deliveryBoys, onClose, onAssign }) => {
  const [selectedId, setSelectedId] = useState("");
  const [assigning, setAssigning] = useState(false);

  const handleAssign = async () => {
    if (!selectedId) return;
    setAssigning(true);
    await onAssign(order._id, selectedId);
    setAssigning(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4"
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white rounded-2xl p-6 w-full max-w-sm"
      >
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-bold text-gray-800">Assign Delivery Boy</h3>
          <button onClick={onClose}><FiX className="text-gray-400" /></button>
        </div>

        {deliveryBoys.length === 0 ? (
          <p className="text-sm text-gray-400">No delivery boys registered yet.</p>
        ) : (
          <div className="space-y-2 max-h-60 overflow-y-auto">
            {deliveryBoys.map((boy) => (
              <button
                key={boy._id}
                onClick={() => setSelectedId(boy._id)}
                className={`w-full text-left px-4 py-3 rounded-xl border-2 transition ${
                  selectedId === boy._id
                    ? "border-orange-500 bg-orange-50"
                    : "border-gray-200"
                }`}
              >
                <p className="font-medium text-gray-700 text-sm">{boy.name}</p>
                <p className="text-xs text-gray-400">{boy.email}</p>
              </button>
            ))}
          </div>
        )}

        <motion.button
          whileTap={{ scale: 0.97 }}
          disabled={!selectedId || assigning}
          onClick={handleAssign}
          className="w-full mt-5 bg-orange-500 text-white py-3 rounded-xl font-semibold disabled:opacity-50"
        >
          {assigning ? "Assigning..." : "Assign"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [deliveryBoys, setDeliveryBoys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [assignTarget, setAssignTarget] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const fetchData = async () => {
    try {
      const [ordersRes, boysRes] = await Promise.all([getAllOrders(), getDeliveryBoys()]);
      setOrders(ordersRes.data.orders || []);
      setDeliveryBoys(boysRes.data.deliveryBoys || []);
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

useEffect(() => {
  fetchData();

  connectSocket();

  const socket = getSocket();

  if (!socket) return;

  socket.on("new_order", () => {
    fetchData();
  });

  socket.on("order_status_updated", () => {
    fetchData();
  });

  socket.on("new_assignment", () => {
    fetchData();
  });

  return () => {
    socket.off("new_order");
    socket.off("order_status_updated");
    socket.off("new_assignment");
  };
}, []);

  const handleConfirm = async (orderId) => {
    try {
      setBusyId(orderId);
      await updateOrderStatus(orderId, "Confirmed");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Could not confirm order");
    } finally {
      setBusyId(null);
    }
  };

  const handleCancel = async (orderId) => {
    if (!window.confirm("Cancel this order?")) return;
    try {
      setBusyId(orderId);
      await updateOrderStatus(orderId, "Cancelled");
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Could not cancel order");
    } finally {
      setBusyId(null);
    }
  };

  const handleAssign = async (orderId, deliveryBoyId) => {
    try {
      await assignDeliveryBoy(orderId, deliveryBoyId);
      setAssignTarget(null);
      fetchData();
    } catch (err) {
      alert(err.response?.data?.message || "Could not assign delivery boy");
    }
  };

  const filteredOrders = orders.filter((o) => filter === "All" || o.status === filter);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-5">Orders</h1>
        <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
          {filters.map((f) => (
            <span
              key={f}
              className="px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap bg-gray-100 text-transparent animate-pulse"
            >
              {f}
            </span>
          ))}
        </div>
        <SkeletonList count={4} height="h-32" />
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Orders</h1>

      <div className="flex gap-2 overflow-x-auto pb-2 mb-5">
        {filters.map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              filter === f ? "bg-orange-500 text-white" : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredOrders.map((order) => (
          <motion.div
            key={order._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl p-5 shadow-sm"
          >
            <div className="flex justify-between items-start mb-3">
              <div>
                <p className="font-semibold text-gray-800">{order.user?.name}</p>
                <p className="text-xs text-gray-400">{order.user?.email}</p>
                <p className="flex items-center gap-1 text-xs text-gray-400 mt-1">
                  <FiClock size={12} /> {new Date(order.createdAt).toLocaleString()}
                </p>
              </div>
              <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusStyles[order.status]}`}>
                {order.status}
              </span>
            </div>

            <div className="text-sm text-gray-600 space-y-1 mb-3">
              {order.items.map((item, idx) => (
                <p key={idx}>{item.product?.name} x{item.quantity}</p>
              ))}
            </div>

            <div className="flex justify-between items-center border-t pt-3">
              <span className="font-bold text-gray-800">₹{order.totalAmount} (COD)</span>

              <div className="flex gap-2">
                {order.status === "Pending" && (
                  <>
                    <button
                      onClick={() => handleConfirm(order._id)}
                      disabled={busyId === order._id}
                      className="bg-blue-500 text-white text-sm px-4 py-2 rounded-xl font-medium disabled:opacity-50"
                    >
                      Confirm
                    </button>
                    <button
                      onClick={() => handleCancel(order._id)}
                      disabled={busyId === order._id}
                      className="bg-red-50 text-red-500 text-sm px-4 py-2 rounded-xl font-medium disabled:opacity-50"
                    >
                      Cancel
                    </button>
                  </>
                )}

                {order.status === "Confirmed" && (
                  <button
                    onClick={() => setAssignTarget(order)}
                    className="flex items-center gap-1.5 bg-orange-500 text-white text-sm px-4 py-2 rounded-xl font-medium"
                  >
                    <FiTruck size={14} /> Assign
                  </button>
                )}

                {order.status === "Out For Delivery" && (
                  <span className="text-sm text-gray-500">
                    Assigned to {order.deliveryBoy?.name}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}

        {filteredOrders.length === 0 && (
          <p className="text-center text-gray-400 py-12">No orders in this category</p>
        )}
      </div>

      <AnimatePresence>
        {assignTarget && (
          <AssignModal
            order={assignTarget}
            deliveryBoys={deliveryBoys}
            onClose={() => setAssignTarget(null)}
            onAssign={handleAssign}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Orders;
