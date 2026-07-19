import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  FiHome, FiShoppingBag, FiShoppingCart, FiPackage,
  FiUser, FiMoon, FiSun, FiBell
} from "react-icons/fi";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { getCart } from "../services/cartApi";

const bottomNavItems = [
  { to: "/user", icon: FiHome, label: "Home" },
  { to: "/user/products", icon: FiShoppingBag, label: "Shop" },
  { to: "/user/cart", icon: FiShoppingCart, label: "Cart" },
  { to: "/user/orders", icon: FiPackage, label: "Orders" },
  { to: "/user/profile", icon: FiUser, label: "Profile" },
];

const UserLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logoutUser } = useAuth();
  const [cartCount, setCartCount] = useState(0);
  const [dark, setDark] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  // Fetch cart count on mount and when user navigates
  useEffect(() => {
    if (!user) return;
    getCart()
      .then((res) => {
        const items = res.data?.cart?.items || [];
        setCartCount(items.reduce((s, i) => s + i.quantity, 0));
      })
      .catch(() => {});
  }, [location.pathname, user]);

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  const isActive = (path) =>
    path === "/user"
      ? location.pathname === "/user"
      : location.pathname.startsWith(path);

  return (
    <div className={`min-h-screen ${dark ? "dark bg-slate-950" : "bg-slate-50"} flex flex-col`}>
      {/* ── Top Navbar (Medcare style) ─────────────────────────── */}
      <header className="sticky top-0 z-50 bg-slate-50 backdrop-blur-md shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-5 md:px-10 h-16 flex items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/user" className="flex items-center gap-2 shrink-0">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center">
              <FiShoppingBag size={16} className="text-white" />
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
              QuickBasket
            </span>
          </Link>

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center gap-1">
            {[
              { to: "/user", label: "Home" },
              { to: "/user/products", label: "Shop" },
              { to: "/user/orders", label: "Orders" },
            ].map((item) => (
              <Link
                key={item.to}
                to={item.to}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                  isActive(item.to)
                    ? "bg-blue-50 text-blue-600"
                    : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Right side icons */}
          <div className="flex items-center gap-2">
            {/* Dark mode toggle */}
            <button
              onClick={() => setDark(!dark)}
              className="w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {dark ? <FiSun size={18} /> : <FiMoon size={18} />}
            </button>

            {/* Cart */}
            <Link
              to="/user/cart"
              className="relative w-9 h-9 rounded-xl flex items-center justify-center text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              <FiShoppingCart size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-blue-600 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                  {cartCount > 9 ? "9+" : cartCount}
                </span>
              )}
            </Link>

            {/* User avatar / dropdown */}
            <div className="relative">
              <button
                onClick={() => setProfileOpen(!profileOpen)}
                className="flex items-center gap-2 pl-1 pr-3 py-1 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              >
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white text-sm font-bold overflow-hidden">
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="" className="w-full h-full object-cover" />
                  ) : (
                    user?.name?.[0]?.toUpperCase()
                  )}
                </div>
                <span className="hidden sm:block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  {user?.name?.split(" ")[0]}
                </span>
              </button>

              {profileOpen && (
                <div className="absolute right-0 top-12 w-48 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-100 dark:border-slate-700 p-2 z-50">
                  <Link
                    to="/user/profile"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <FiUser size={15} /> My Profile
                  </Link>
                  <Link
                    to="/user/orders"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700"
                  >
                    <FiPackage size={15} /> My Orders
                  </Link>
                  <div className="border-t border-slate-100 dark:border-slate-700 my-1" />
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
                  >
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* ── Main Content ──────────────────────────────────────── */}
      <main className="flex-1 max-w-7xl mx-auto w-full px-4 md:px-10 py-6 pb-24 md:pb-8">
        <Outlet />
      </main>

      {/* ── Mobile Bottom Nav ─────────────────────────────────── */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md shadow-[0_-1px_12px_rgba(0,0,0,0.07)] border-t border-slate-100 dark:border-slate-800 md:hidden">
        <div className="flex">
          {bottomNavItems.map((item) => {
            const active = isActive(item.to);
            const Icon = item.icon;
            const isCart = item.to === "/user/cart";
            return (
              <Link
                key={item.to}
                to={item.to}
                className="relative flex-1 flex flex-col items-center py-2.5 gap-0.5"
              >
                {active && (
                  <motion.div
                    layoutId="qb-bottom-active"
                    className="absolute top-0 h-0.5 w-8 bg-blue-600 rounded-full"
                  />
                )}
                <div className="relative">
                  <Icon size={20} className={active ? "text-blue-600" : "text-slate-400"} />
                  {isCart && cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 w-4 h-4 bg-blue-600 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
                      {cartCount > 9 ? "9+" : cartCount}
                    </span>
                  )}
                </div>
                <span className={`text-[10px] ${active ? "text-blue-600 font-semibold" : "text-slate-400"}`}>
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

export default UserLayout;
