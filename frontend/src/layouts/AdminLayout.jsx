import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiGrid,
  FiBox,
  FiPlusCircle,
  FiClipboard,
  FiUsers,
  FiLogOut,
} from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

const navItems = [
  { to: "/admin", icon: FiGrid, label: "Dashboard" },
  { to: "/admin/products", icon: FiBox, label: "Products" },
  { to: "/admin/add-product", icon: FiPlusCircle, label: "Add Product" },
  { to: "/admin/orders", icon: FiClipboard, label: "Orders" },
  { to: "/admin/users", icon: FiUsers, label: "Users" },
];

const AdminLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-20 md:w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="px-4 py-6 text-center md:text-left">
          <h1 className="text-xl font-bold text-orange-400 hidden md:block">
            QuickBasket
          </h1>
          <span className="text-xs text-gray-400 hidden md:block">
            Admin Panel
          </span>
        </div>

        <nav className="flex-1 flex flex-col gap-1 px-2">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition justify-center md:justify-start ${
                  active
                    ? "bg-orange-500 text-white"
                    : "text-gray-300 hover:bg-gray-800"
                }`}
              >
                <Icon size={18} />
                <span className="text-sm font-medium hidden md:block">
                  {item.label}
                </span>
              </Link>
            );
          })}
        </nav>

        <div className="p-2 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-300 hover:bg-gray-800 justify-center md:justify-start"
          >
            <FiLogOut size={18} />
            <span className="text-sm font-medium hidden md:block">Logout</span>
          </button>
        </div>
      </aside>

      {/* Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="bg-white shadow-sm px-6 py-4 flex justify-between items-center">
          <h2 className="font-semibold text-gray-700">
            Welcome, {user?.name}
          </h2>
        </header>
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;