import { GoogleLogin } from "@react-oauth/google";
import { googleLogin } from "../services/authApi";

/**
 * role: "user" | "deliveryBoy" - only used if this is a NEW signup via Google.
 * onSuccess(token, user) is called after backend verifies the Google token.
 */
const GoogleLoginButton = ({ role = "user", onSuccess, onError }) => {
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const idToken = credentialResponse.credential;
      const res = await googleLogin(idToken, role);

      if (res.data.success) {
        onSuccess(res.data.token, res.data.user);
      }
    } catch (err) {
      onError?.(err.response?.data?.message || "Google login failed");
    }
  };

  return (
    <div className="flex justify-center">
      <GoogleLogin
        onSuccess={handleGoogleSuccess}
        onError={() => onError?.("Google login failed")}
        shape="pill"
        width="320"
      />
    </div>
  );
};

export default GoogleLoginButton;
