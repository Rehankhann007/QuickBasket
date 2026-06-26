import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiHome, FiShoppingBag, FiShoppingCart, FiPackage, FiUser } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";
import { useCartFly } from "../context/CartFlyContext";

const navItems = [
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
  const { cartIconRefMobile, cartIconRefDesktop } = useCartFly();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-orange-50/40 flex flex-col">
      {/* Top bar */}
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg shadow-sm">
        <div className="max-w-6xl mx-auto px-5 py-4 flex justify-between items-center">
          <Link to="/user" className="text-2xl font-bold text-orange-500">
            QuickBasket
          </Link>
          <div className="flex items-center gap-4">
            <span className="hidden sm:block text-sm text-gray-600">
              Hi, {user?.name?.split(" ")[0]}
            </span>
            <button
              onClick={handleLogout}
              className="text-sm font-medium text-orange-500 hover:text-orange-600"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Page content */}
      <main className="flex-1 max-w-6xl mx-auto w-full px-5 py-6 pb-24 md:pb-6">
        <Outlet />
      </main>

      {/* Bottom nav - mobile first */}
      <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.06)] md:hidden">
        <div className="flex justify-between px-2">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            const Icon = item.icon;
            return (
              <Link
                key={item.to}
                to={item.to}
                ref={item.to === "/user/cart" ? cartIconRefMobile : null}
                className="relative flex-1 flex flex-col items-center py-2.5"
              >
                {active && (
                  <motion.div
                    layoutId="user-nav-active"
                    className="absolute top-0 h-0.5 w-8 bg-orange-500 rounded-full"
                  />
                )}
                <Icon
                  size={20}
                  className={active ? "text-orange-500" : "text-gray-400"}
                />
                <span
                  className={`text-[11px] mt-1 ${
                    active ? "text-orange-500 font-medium" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Desktop side nav */}
      <div className="hidden md:flex fixed left-0 top-20 flex-col gap-1 bg-white shadow-lg rounded-r-2xl p-2 z-30">
        {navItems.map((item) => {
          const active = location.pathname === item.to;
          const Icon = item.icon;
          return (
            <Link
              key={item.to}
              to={item.to}
              ref={item.to === "/user/cart" ? cartIconRefDesktop : null}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition ${
                active
                  ? "bg-orange-500 text-white"
                  : "text-gray-500 hover:bg-orange-50"
              }`}
            >
              <Icon size={18} />
              <span className="text-sm font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default UserLayout;