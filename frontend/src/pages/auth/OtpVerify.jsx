import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { verifyOtp as verifyOtpApi, resendOtp } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";

const roleHomeMap = {
  admin: "/admin",
  deliveryBoy: "/delivery",
  user: "/user",
};

const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const userId = localStorage.getItem("userId");

  // Guard: if someone lands here directly without registering first
  useEffect(() => {
    if (!userId) {
      navigate("/register", { replace: true });
    }
  }, [userId, navigate]);

  const verifyOtpHandler = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);
      const res = await verifyOtpApi({ userId, otp });

      if (res.data.success) {
        localStorage.removeItem("userId");
        localStorage.removeItem("email");

        // Backend now returns token + user right after verification
        loginUser(res.data.token, res.data.user);
        navigate(roleHomeMap[res.data.user.role] || "/user");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const resendOtpHandler = async () => {
    try {
      setResending(true);
      const email = localStorage.getItem("email");
      await resendOtp({ email });
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className="bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-orange-500">Verify OTP</h1>
          <p className="text-gray-500 mt-2">
            Enter the OTP sent to your email
          </p>
        </div>

        {error && (
          <p className="text-red-500 text-sm text-center mb-4">{error}</p>
        )}

        <form onSubmit={verifyOtpHandler}>
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            maxLength={4}
            required
            className="w-full border border-gray-300 rounded-xl p-4 text-center text-xl tracking-widest focus:border-orange-500 outline-none transition"
          />

          <motion.button
            whileTap={{ scale: 0.97 }}
            type="submit"
            disabled={loading}
            className="w-full mt-5 bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </motion.button>
        </form>

        <button
          onClick={resendOtpHandler}
          disabled={resending}
          className="w-full mt-4 text-orange-500 font-semibold disabled:opacity-60"
        >
          {resending ? "Sending..." : "Resend OTP"}
        </button>
      </motion.div>
    </div>
  );
};

export default OtpVerify;
