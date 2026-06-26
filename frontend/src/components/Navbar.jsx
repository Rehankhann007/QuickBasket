import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleHomeMap = {
  admin: "/admin",
  deliveryBoy: "/delivery",
  user: "/user",
};

export default function Navbar() {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-lg shadow-md">
      <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
        <Link to="/" className="text-3xl font-bold text-orange-500">
          QuickBasket
        </Link>

        <div className="flex gap-6 font-medium items-center">
          <Link to="/" className="hover:text-orange-500 transition">
            Home
          </Link>

          {user ? (
            <>
              <Link
                to={roleHomeMap[user.role] || "/user"}
                className="hover:text-orange-500 transition"
              >
                Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="text-orange-500 font-semibold"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-orange-500 transition">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-orange-500 text-white px-4 py-2 rounded-xl hover:bg-orange-600 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
