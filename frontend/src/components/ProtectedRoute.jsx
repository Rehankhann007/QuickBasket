import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getRoleHome } from "../utils/roleRedirect";

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
    return <Navigate to={getRoleHome(user.role)} replace />;
  }

  return children;
};

export default RoleProtectedRoute;