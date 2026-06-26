import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const roleHomeMap = {
  admin: "/admin",
  deliveryBoy: "/delivery",
  user: "/user",
};

/**
 * Usage: <RoleProtectedRoute allowedRoles={["admin"]}>...</RoleProtectedRoute>
 */
const RoleProtectedRoute = ({ allowedRoles, children }) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Logged in but wrong role -> send them to their own home, not login
    return <Navigate to={roleHomeMap[user.role] || "/"} replace />;
  }

  return children;
};

export default RoleProtectedRoute;
