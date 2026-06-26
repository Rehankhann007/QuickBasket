import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiEye, FiEyeOff, FiUser, FiTruck } from "react-icons/fi";

import { signup } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import GoogleLoginButton from "../../components/GoogleLoginButton";

const roleHomeMap = {
  admin: "/admin",
  deliveryBoy: "/delivery",
  user: "/user",
};

const Register = () => {
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    password: "",
    role: "user",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await signup(form);

      if (res.data.success) {
        localStorage.setItem("userId", res.data.userId);
        localStorage.setItem("email", form.email);
        navigate("/otp-verify");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = (token, user) => {
    loginUser(token, user);
    navigate(roleHomeMap[user.role] || "/user");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-6">
          <h1 className="text-4xl font-bold text-orange-500">QuickBasket</h1>
          <p className="text-gray-500 mt-2">Create Your Account</p>
        </div>

        {error && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-500 text-sm text-center mb-4"
          >
            {error}
          </motion.p>
        )}

        {/* Role selection */}
        <div className="grid grid-cols-2 gap-3 mb-5">
          <button
            type="button"
            onClick={() => setForm({ ...form, role: "user" })}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition ${
              form.role === "user"
                ? "border-orange-500 bg-orange-50 text-orange-600"
                : "border-gray-200 text-gray-400"
            }`}
          >
            <FiUser size={20} />
            <span className="text-sm font-medium">I'm a Customer</span>
          </button>

          <button
            type="button"
            onClick={() => setForm({ ...form, role: "deliveryBoy" })}
            className={`flex flex-col items-center gap-1.5 py-3 rounded-xl border-2 transition ${
              form.role === "deliveryBoy"
                ? "border-orange-500 bg-orange-50 text-orange-600"
                : "border-gray-200 text-gray-400"
            }`}
          >
            <FiTruck size={20} />
            <span className="text-sm font-medium">I'm a Delivery Partner</span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            value={form.name}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl p-3 focus:border-orange-500 outline-none transition"
          />

          <input
            type="text"
            name="username"
            placeholder="Username"
            value={form.username}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl p-3 focus:border-orange-500 outline-none transition"
          />

          <input
            type="email"
            name="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded-xl p-3 focus:border-orange-500 outline-none transition"
          />

          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
              minLength={6}
              className="w-full border border-gray-300 rounded-xl p-3 focus:border-orange-500 outline-none transition"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-3.5 text-gray-500"
            >
              {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
            </button>
          </div>

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {loading ? "Creating Account..." : "Register"}
          </motion.button>
        </form>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <GoogleLoginButton
          role={form.role}
          onSuccess={handleGoogleSuccess}
          onError={setError}
        />

        <div className="text-center mt-6">
          <p className="text-gray-600">Already have an account?</p>
          <Link to="/login" className="text-orange-500 font-semibold">
            Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default Register;
