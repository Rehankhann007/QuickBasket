import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiPackage, FiCheckCircle, FiTruck } from "react-icons/fi";

import { getMyDeliveries } from "../../services/orderApi";
import { StatCardSkeleton, SkeletonList } from "../../components/Skeletons";

const Dashboard = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await getMyDeliveries();
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
        <h1 className="text-xl font-bold text-gray-800 mb-5">Welcome back!</h1>
        <div className="grid grid-cols-2 gap-4 mb-6">
          <StatCardSkeleton />
          <StatCardSkeleton />
        </div>
        <h2 className="font-semibold text-gray-700 mb-3">Active Orders</h2>
        <SkeletonList count={2} height="h-16" />
      </div>
    );
  }

  const active = orders.filter((o) => o.status === "Out For Delivery");
  const delivered = orders.filter((o) => o.status === "Delivered");

  return (
    <div>
      <h1 className="text-xl font-bold text-gray-800 mb-5">Welcome back!</h1>

      <div className="grid grid-cols-2 gap-4 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <FiTruck className="text-orange-500 mb-2" size={22} />
          <p className="text-2xl font-bold text-gray-800">{active.length}</p>
          <p className="text-xs text-gray-400">Active Deliveries</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="bg-white rounded-2xl p-5 shadow-sm"
        >
          <FiCheckCircle className="text-green-500 mb-2" size={22} />
          <p className="text-2xl font-bold text-gray-800">{delivered.length}</p>
          <p className="text-xs text-gray-400">Completed</p>
        </motion.div>
      </div>

      <h2 className="font-semibold text-gray-700 mb-3">Active Orders</h2>

      {active.length === 0 ? (
        <div className="bg-white rounded-2xl p-8 text-center shadow-sm">
          <FiPackage className="text-orange-200 mx-auto mb-3" size={36} />
          <p className="text-gray-400 text-sm">No active deliveries right now</p>
        </div>
      ) : (
        <div className="space-y-3">
          {active.map((order) => (
            <motion.div
              key={order._id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              onClick={() => navigate(`/delivery/orders/${order._id}/map`)}
              className="bg-white rounded-2xl p-4 shadow-sm flex justify-between items-center cursor-pointer"
            >
              <div>
                <p className="font-medium text-gray-700">{order.user?.name}</p>
                <p className="text-xs text-gray-400">₹{order.totalAmount} • COD</p>
              </div>
              <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full font-medium">
                Navigate
              </span>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;
