import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiPackage, FiMapPin, FiUser, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/delivery", icon: FiHome, label: "Home" },
  { to: "/delivery/orders", icon: FiPackage, label: "Orders" },
  { to: "/delivery/profile", icon: FiUser, label: "Profile" },
];

const DeliveryLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="sticky top-0 z-40 bg-gray-900 text-white">
        <div className="px-5 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-lg font-bold text-orange-400">QuickBasket</h1>
            <span className="text-xs text-gray-400">Delivery Partner</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-1 text-sm text-gray-300"
          >
            <FiLogOut size={16} /> Logout
          </button>
        </div>
      </header>

      <main className="flex-1 px-4 py-5 pb-20">
        <Outlet />
      </main>

      <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
        <div className="flex justify-between px-2">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className="flex-1 flex flex-col items-center py-2.5"
              >
                <Icon size={20} className={active ? "text-orange-500" : "text-gray-400"} />
                <span className={`text-[11px] mt-1 ${active ? "text-orange-500 font-medium" : "text-gray-400"}`}>
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
};

export default DeliveryLayout;