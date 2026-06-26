import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiUser, FiMail, FiAtSign, FiLogOut } from "react-icons/fi";

import { useAuth } from "../../context/AuthContext";
import Footer from "../../components/Footer";

const Profile = () => {
  const { user, logoutUser } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logoutUser();
    navigate("/login");
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-5">My Profile</h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-6 shadow-sm"
      >
        <div className="flex flex-col items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-orange-100 flex items-center justify-center text-2xl font-bold text-orange-500 overflow-hidden">
            {user?.profilePic ? (
              <img src={user.profilePic} alt={user.name} className="w-full h-full object-cover" />
            ) : (
              user?.name?.[0]?.toUpperCase()
            )}
          </div>
          <h2 className="font-bold text-gray-800 mt-3 text-lg">{user?.name}</h2>
          <span className="text-xs bg-orange-100 text-orange-600 px-3 py-1 rounded-full mt-1 capitalize">
            {user?.role}
          </span>
        </div>

        <div className="space-y-3">
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <FiAtSign className="text-orange-500" />
            <span className="text-gray-700 text-sm">{user?.username}</span>
          </div>
          <div className="flex items-center gap-3 bg-gray-50 rounded-xl p-3">
            <FiMail className="text-orange-500" />
            <span className="text-gray-700 text-sm">{user?.email}</span>
          </div>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={handleLogout}
          className="w-full mt-6 flex items-center justify-center gap-2 bg-red-50 text-red-500 py-3 rounded-xl font-medium"
        >
          <FiLogOut /> Logout
        </motion.button>
      </motion.div>

      <Footer />
    </div>
  );
};

export default Profile;
