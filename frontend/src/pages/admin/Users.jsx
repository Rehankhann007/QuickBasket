import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiUser, FiTruck, FiMail } from "react-icons/fi";

import { getAllUsers } from "../../services/orderApi";
import { RowSkeleton } from "../../components/Skeletons";

const tabs = ["All", "Customers", "Delivery Partners"];

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("All");

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsers();
        setUsers(res.data.users || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter((u) => {
    if (tab === "Customers") return u.role === "user";
    if (tab === "Delivery Partners") return u.role === "deliveryBoy";
    return true;
  });

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-gray-800 mb-5">Users</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <RowSkeleton key={i} height="h-[76px]" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Users</h1>

      <div className="flex gap-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition ${
              tab === t ? "bg-orange-500 text-white" : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((u, i) => (
          <motion.div
            key={u._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.03 }}
            className="bg-white rounded-2xl p-5 shadow-sm flex items-center gap-4"
          >
            <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 font-bold overflow-hidden shrink-0">
              {u.profilePic ? (
                <img src={u.profilePic} alt={u.name} className="w-full h-full object-cover" />
              ) : (
                u.name?.[0]?.toUpperCase()
              )}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-800 truncate">{u.name}</p>
              <p className="text-xs text-gray-400 flex items-center gap-1 truncate">
                <FiMail size={12} /> {u.email}
              </p>
            </div>
            <span
              className={`flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full shrink-0 ${
                u.role === "deliveryBoy" ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"
              }`}
            >
              {u.role === "deliveryBoy" ? <FiTruck size={12} /> : <FiUser size={12} />}
              {u.role === "deliveryBoy" ? "Delivery" : "Customer"}
            </span>
          </motion.div>
        ))}

        {filtered.length === 0 && (
          <p className="text-gray-400 col-span-full text-center py-12">No users found</p>
        )}
      </div>
    </div>
  );
};

export default Users;
