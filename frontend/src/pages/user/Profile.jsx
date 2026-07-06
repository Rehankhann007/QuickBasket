import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiUser, FiMail, FiAtSign, FiLogOut,
  FiPackage, FiShield, FiChevronRight, FiShoppingBag
} from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";

// ─── Info Row ──────────────────────────────────────────────────────────────
const InfoRow = ({ icon: Icon, label, value }) => (
  <div className="flex items-center gap-4 bg-slate-50 rounded-2xl px-4 py-3.5">
    <div className="w-9 h-9 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
      <Icon size={16} className="text-blue-600" />
    </div>
    <div className="min-w-0 flex-1">
      <p className="text-xs text-slate-400 font-medium">{label}</p>
      <p className="text-sm font-semibold text-slate-800 truncate">{value || "—"}</p>
    </div>
  </div>
);

// ─── Menu Item ─────────────────────────────────────────────────────────────
const MenuItem = ({ icon: Icon, label, onClick, iconBg = "bg-blue-100", iconColor = "text-blue-600" }) => (
  <motion.button
    whileTap={{ scale: 0.98 }}
    onClick={onClick}
    className="w-full flex items-center justify-between bg-slate-50 hover:bg-slate-100 rounded-2xl px-4 py-3.5 transition"
  >
    <div className="flex items-center gap-3">
      <div className={`w-9 h-9 rounded-xl ${iconBg} flex items-center justify-center`}>
        <Icon size={16} className={iconColor} />
      </div>
      <span className="text-sm font-semibold text-slate-700">{label}</span>
    </div>
    <FiChevronRight size={16} className="text-slate-400" />
  </motion.button>
);

const Profile = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const roleLabel = {
    user: "Customer",
    admin: "Administrator",
    deliveryBoy: "Delivery Partner",
  }[user?.role] || user?.role;

  return (
    <div className="max-w-lg mx-auto">
      <h1 className="text-2xl font-bold text-slate-800 mb-6">My Profile</h1>

      {/* Avatar Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-6 text-white text-center mb-5 shadow-xl shadow-blue-200"
      >
        <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center mx-auto mb-3 overflow-hidden text-3xl font-bold">
          {user?.profilePic ? (
            <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
          ) : (
            user?.name?.[0]?.toUpperCase() || "?"
          )}
        </div>
        <h2 className="text-xl font-bold">{user?.name}</h2>
        {user?.username && (
          <p className="text-blue-200 text-sm mt-0.5">@{user.username}</p>
        )}
        <span className="inline-block mt-2 text-xs font-semibold px-3 py-1 rounded-full bg-white/20 text-white">
          {roleLabel}
        </span>
      </motion.div>

      {/* Account Details */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 mb-4 space-y-3"
      >
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Account Details
        </h3>
        <InfoRow icon={FiUser} label="Full Name" value={user?.name} />
        {user?.username && (
          <InfoRow icon={FiAtSign} label="Username" value={`@${user.username}`} />
        )}
        <InfoRow icon={FiMail} label="Email Address" value={user?.email} />
        <InfoRow icon={FiShield} label="Account Role" value={roleLabel} />
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="bg-white rounded-3xl border border-slate-100 shadow-sm p-5 mb-4 space-y-2"
      >
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
          Quick Actions
        </h3>
        <MenuItem
          icon={FiPackage}
          label="My Orders"
          onClick={() => navigate("/user/orders")}
        />
        <MenuItem
          icon={FiShoppingBag}
          label="Continue Shopping"
          onClick={() => navigate("/user/products")}
        />
      </motion.div>

      {/* Logout */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        whileTap={{ scale: 0.97 }}
        onClick={handleLogout}
        className="w-full flex items-center justify-center gap-2.5 bg-red-50 hover:bg-red-100 text-red-600 font-semibold py-4 rounded-3xl transition mb-8"
      >
        <FiLogOut size={18} />
        Sign Out
      </motion.button>

      <Footer />
    </div>
  );
};

export default Profile;
