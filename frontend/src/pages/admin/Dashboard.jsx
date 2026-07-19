import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUsers, FiShoppingBag, FiDollarSign, FiClock, FiCheckCircle } from "react-icons/fi";

import { getDashboardStats } from "../../services/orderApi";
import { StatCardSkeleton } from "../../components/Skeletons";

const StatCard = ({ icon: Icon, label, value, color, delay }) => (
  <motion.div
    initial={{ opacity: 0, y: 12 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ delay }}
    className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
  >
    <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${color}`}>
      <Icon size={22} className="text-white" />
    </div>
    <div>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-2xl font-bold text-gray-800">{value}</p>
    </div>
  </motion.div>
);

const Dashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await getDashboardStats();
        setStats(res.data.stats);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <StatCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Dashboard Overview</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard
          icon={FiUsers}
          label="Total Users"
          value={stats?.totalUsers ?? 0}
          color="bg-blue-500"
          delay={0}
        />
        <StatCard
          icon={FiShoppingBag}
          label="Total Orders"
          value={stats?.totalOrders ?? 0}
          color="bg-purple-500"
          delay={0.05}
        />
        <StatCard
          icon={FiDollarSign}
          label="Total Revenue"
          value={`₹${stats?.totalRevenue ?? 0}`}
          color="bg-green-500"
          delay={0.1}
        />
        <StatCard
          icon={FiClock}
          label="Pending Orders"
          value={stats?.pendingOrdersCount ?? 0}
          color="bg-yellow-500"
          delay={0.15}
        />
        <StatCard
          icon={FiCheckCircle}
          label="Delivered Orders"
          value={stats?.deliveredOrdersCount ?? 0}
          color="bg-orange-500"
          delay={0.2}
        />
      </div>
    </div>
  );
};

export default Dashboard;
