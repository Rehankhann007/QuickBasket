import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import { motion } from "framer-motion";
import { FiArrowLeft, FiNavigation, FiCheckCircle } from "react-icons/fi";
import "leaflet/dist/leaflet.css";

import { getSingleOrder, verifyDeliveryOtp } from "../../services/orderApi";
import { getSocket } from "../../services/socket";
import LoadingSpinner from "../../components/LoadingSpinner";

const deliveryIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/3097/3097144.png",
  iconSize: [36, 36],
  iconAnchor: [18, 18],
});

const homeIcon = new L.Icon({
  iconUrl: "https://cdn-icons-png.flaticon.com/512/684/684908.png",
  iconSize: [32, 32],
  iconAnchor: [16, 32],
});

const MapTracking = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [myLocation, setMyLocation] = useState(null);
  const [sharing, setSharing] = useState(false);
  const [otpInput, setOtpInput] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [error, setError] = useState("");

  const watchIdRef = useRef(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getSingleOrder(id);
        setOrder(res.data.order);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [id]);

  useEffect(() => {
    const socket = getSocket();
    if (socket) {
      socket.emit("join_order_room", { orderId: id });
    }
    return () => {
      if (socket) socket.emit("leave_order_room", { orderId: id });
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, [id]);

  const startSharing = () => {
    if (!navigator.geolocation) {
      setError("Geolocation not supported on this device");
      return;
    }

    setSharing(true);

    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const lat = pos.coords.latitude;
        const lng = pos.coords.longitude;
        setMyLocation([lat, lng]);

        const socket = getSocket();
        if (socket) {
          socket.emit("update_location", { orderId: id, lat, lng });
        }
      },
      (err) => {
        setError("Could not access your location: " + err.message);
        setSharing(false);
      },
      { enableHighAccuracy: true, maximumAge: 5000, timeout: 10000 }
    );
  };

  const stopSharing = () => {
    if (watchIdRef.current) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }
    setSharing(false);
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setVerifying(true);
      const res = await verifyDeliveryOtp(id, otpInput);
      if (res.data.success) {
        stopSharing();
        navigate("/delivery/orders");
      }
    } catch (err) {
      setError(err.response?.data?.message || "Invalid OTP");
    } finally {
      setVerifying(false);
    }
  };

  if (loading) return <LoadingSpinner fullScreen />;
  if (!order) return <p className="text-center text-gray-400 py-12">Order not found</p>;

  const destination = order.deliveryAddress?.lat
    ? [order.deliveryAddress.lat, order.deliveryAddress.lng]
    : null;

  const mapCenter = myLocation || destination || [22.7196, 75.8577];

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button onClick={() => navigate(-1)} className="text-gray-500">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-lg font-bold text-gray-800">Deliver Order</h1>
      </div>

      {error && (
        <p className="bg-red-50 text-red-500 text-sm px-4 py-2.5 rounded-xl mb-4">{error}</p>
      )}

      <div className="rounded-2xl overflow-hidden h-64 mb-4 shadow-sm">
        <MapContainer center={mapCenter} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {destination && (
            <Marker position={destination} icon={homeIcon}>
              <Popup>{order.deliveryAddress?.address || "Delivery Address"}</Popup>
            </Marker>
          )}
          {myLocation && (
            <Marker position={myLocation} icon={deliveryIcon}>
              <Popup>You</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <p className="font-medium text-gray-700 mb-1">{order.user?.name}</p>
        <p className="text-sm text-gray-400 mb-3">
          {order.deliveryAddress?.address || "No address provided"}
        </p>
        <p className="font-bold text-gray-800">₹{order.totalAmount} (COD - collect from customer)</p>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={sharing ? stopSharing : startSharing}
        className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-semibold mb-4 transition ${
          sharing ? "bg-gray-800 text-white" : "bg-orange-500 text-white"
        }`}
      >
        <FiNavigation /> {sharing ? "Sharing Live Location..." : "Start Sharing Location"}
      </motion.button>

      <div className="bg-white rounded-2xl p-5 shadow-sm">
        <h3 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <FiCheckCircle className="text-green-500" /> Complete Delivery
        </h3>
        <p className="text-xs text-gray-400 mb-3">
          Ask the customer for their OTP to confirm delivery
        </p>
        <form onSubmit={handleVerifyOtp} className="flex gap-2">
          <input
            type="text"
            value={otpInput}
            onChange={(e) => setOtpInput(e.target.value)}
            placeholder="Enter OTP"
            maxLength={4}
            required
            className="flex-1 border border-gray-200 rounded-xl p-3 text-center tracking-widest outline-none focus:border-orange-500 transition"
          />
          <button
            type="submit"
            disabled={verifying}
            className="bg-green-500 text-white px-5 rounded-xl font-semibold disabled:opacity-60"
          >
            {verifying ? "..." : "Verify"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MapTracking;
