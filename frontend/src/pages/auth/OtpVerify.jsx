import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiMail, FiShield } from "react-icons/fi";

import { verifyOtp as verifyOtpApi, resendOtp } from "../../services/authApi";
import { useAuth } from "../../context/AuthContext";
import { getRoleHome } from "../../utils/roleRedirect";

const OTP_LENGTH = 4;

const OtpVerify = () => {
  const [digits, setDigits] = useState(Array(OTP_LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const inputsRef = useRef([]);
  const navigate = useNavigate();
  const { loginUser } = useAuth();

  const userId = localStorage.getItem("userId");
  const email = localStorage.getItem("email");

  // Guard: if someone lands here without registering first
  useEffect(() => {
    if (!userId) navigate("/register", { replace: true });
  }, [userId, navigate]);

  // Countdown timer
  useEffect(() => {
    if (countdown <= 0) { setCanResend(true); return; }
    const t = setTimeout(() => setCountdown(c => c - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown]);

  const handleDigitChange = (idx, val) => {
    const sanitized = val.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = sanitized;
    setDigits(next);
    if (sanitized && idx < OTP_LENGTH - 1) {
      inputsRef.current[idx + 1]?.focus();
    }
  };

  const handleKeyDown = (idx, e) => {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, OTP_LENGTH);
    const next = Array(OTP_LENGTH).fill("");
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setDigits(next);
    inputsRef.current[Math.min(pasted.length, OTP_LENGTH - 1)]?.focus();
  };

  const otp = digits.join("");

  const handleVerify = async (e) => {
    e.preventDefault();
    if (otp.length < OTP_LENGTH) {
      setError(`Please enter the ${OTP_LENGTH}-digit OTP.`);
      return;
    }
    setError("");
    try {
      setLoading(true);
      const res = await verifyOtpApi({ userId, otp });
      if (res.data.success) {
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        loginUser(res.data.token, res.data.user);
        navigate(getRoleHome(res.data.user.role), { replace: true });
      }
    } catch (err) {
      setError(err.response?.data?.message || "Verification failed. Check your OTP.");
      setDigits(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (!canResend) return;
    try {
      setResending(true);
      setError("");
      await resendOtp({ email });
      setCountdown(30);
      setCanResend(false);
      setDigits(Array(OTP_LENGTH).fill(""));
      inputsRef.current[0]?.focus();
    } catch (err) {
      setError(err.response?.data?.message || "Could not resend OTP.");
    } finally {
      setResending(false);
    }
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
            <FiShield size={30} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold">Verify Your Email</h1>
          <p className="text-blue-100 mt-2 text-sm">
            We sent a {OTP_LENGTH}-digit code to{" "}
            <span className="font-semibold text-white">{email || "your email"}</span>
          </p>
        </div>

        {/* Form Card */}
        <div className="bg-white rounded-3xl shadow-xl shadow-slate-100 p-8">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl mb-5"
            >
              <span>⚠️</span> {error}
            </motion.div>
          )}

          <form onSubmit={handleVerify}>
            {/* OTP Digit Boxes */}
            <div className="flex justify-center gap-3 mb-8" onPaste={handlePaste}>
              {digits.map((d, i) => (
                <input
                  key={i}
                  ref={el => inputsRef.current[i] = el}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={d}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleKeyDown(i, e)}
                  className={`w-14 h-14 text-center text-xl font-bold rounded-2xl border-2 outline-none transition ${
                    d
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 bg-slate-50 text-slate-800"
                  } focus:border-blue-500 focus:ring-2 focus:ring-blue-100`}
                />
              ))}
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              type="submit"
              disabled={loading || otp.length < OTP_LENGTH}
              className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-semibold text-sm transition shadow-md shadow-blue-200 disabled:opacity-60"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify OTP"
              )}
            </motion.button>
          </form>

          {/* Resend */}
          <div className="text-center mt-5">
            {canResend ? (
              <button
                onClick={handleResend}
                disabled={resending}
                className="text-blue-600 font-semibold text-sm hover:text-blue-800 transition disabled:opacity-60"
              >
                {resending ? "Sending..." : "Resend OTP"}
              </button>
            ) : (
              <p className="text-sm text-slate-400">
                Resend available in{" "}
                <span className="font-semibold text-blue-600">{countdown}s</span>
              </p>
            )}
          </div>

          <div className="mt-6 bg-blue-50 rounded-2xl px-4 py-3 flex items-start gap-3">
            <FiMail size={16} className="text-blue-400 mt-0.5 shrink-0" />
            <p className="text-xs text-slate-500">
              Didn&apos;t receive the code? Check your spam folder or resend after the timer expires.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default OtpVerify;
