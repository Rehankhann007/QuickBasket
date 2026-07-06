import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiUser, FiLock, FiShoppingCart } from "react-icons/fi";

import { login as loginApi } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import GoogleLoginButton from "../../components/GoogleLoginButton";
import { getRoleHome } from "../../utils/roleRedirect";

// ─── Reusable Input ──────────────────────────────────────────────────────────
const InputField = ({ icon: Icon, type = "text", placeholder, value, onChange, name, required }) => {
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative">
      {Icon && (
        <Icon className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={17} />
      )}
      <input
        type={isPassword && showPw ? "text" : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className="w-full rounded-2xl border border-slate-200 bg-slate-50 py-3.5 pl-11 pr-11 text-sm text-slate-800 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-100"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPw(!showPw)}
          className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
        >
          {showPw ? <FiEyeOff size={17} /> : <FiEye size={17} />}
        </button>
      )}
    </div>
  );
};

// ─── Main Component ──────────────────────────────────────────────────────────
const Login = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({ identifier: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const goToRoleHome = (role) => navigate(getRoleHome(role), { replace: true });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      const res = await loginApi(form);
      if (res.data.success) {
        loginUser(res.data.token, res.data.user);
        goToRoleHome(res.data.user.role);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (token, user) => {
    loginUser(token, user);
    goToRoleHome(user.role);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-sky-50 to-indigo-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 28 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="w-full max-w-md"
      >
        {/* Header Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-600 rounded-3xl p-8 text-white text-center mb-4 shadow-xl shadow-blue-200">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/20 rounded-2xl mb-4">
            <FiShoppingCart size={30} className="text-white" />
          </div>
          <h1 className="text-3xl font-bold tracking-tight">QuickBasket</h1>
          <p className="text-blue-100 mt-1 text-sm">Welcome back! Please sign in.</p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl mb-5"
            >
              <span className="text-base">⚠️</span> {error}
            </motion.div>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider pl-1">
                Email or Username
              </label>
              <InputField
                icon={FiUser}
                name="identifier"
                placeholder="Enter email or username"
                value={form.identifier}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-1.5">
              <div className="flex items-center justify-between pl-1">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-xs text-blue-500 font-medium hover:text-blue-700 transition"
                >
                  Forgot password?
                </Link>
              </div>
              <InputField
                icon={FiLock}
                type="password"
                name="password"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                required
              />
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-semibold text-sm transition shadow-md shadow-blue-200 disabled:opacity-60 mt-2"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                "Sign In"
              )}
            </motion.button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-slate-100" />
            <span className="text-xs text-slate-400 font-medium">OR CONTINUE WITH</span>
            <div className="flex-1 h-px bg-slate-100" />
          </div>

          <GoogleLoginButton role="user" onSuccess={handleGoogleSuccess} onError={setError} />

          <p className="text-center text-sm text-slate-500 mt-6">
            Don&apos;t have an account?{" "}
            <Link to="/register" className="text-blue-600 font-semibold hover:text-blue-800 transition">
              Register
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
