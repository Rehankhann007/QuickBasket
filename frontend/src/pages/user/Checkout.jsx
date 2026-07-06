import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import {
  FiMapPin, FiShoppingBag, FiTruck, FiCheckCircle,
  FiChevronRight, FiArrowLeft
} from "react-icons/fi";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

import { getCart } from "../../services/cartApi";
import { placeOrder } from "../../services/orderApi";
import { SkeletonList } from "../../components/Skeletons";

// Fix default Leaflet marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const DEFAULT_CENTER = [22.7196, 75.8577]; // Indore fallback

const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({ click(e) { setPosition([e.latlng.lat, e.latlng.lng]); } });
  return position ? <Marker position={position} /> : null;
};

// ─── Section Card ─────────────────────────────────────────────────────────
const SectionCard = ({ icon: Icon, title, children, step }) => (
  <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
    <div className="flex items-center gap-3 mb-4">
      {step && (
        <span className="w-7 h-7 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center shrink-0">
          {step}
        </span>
      )}
      <div className="w-8 h-8 rounded-xl bg-blue-50 flex items-center justify-center">
        <Icon size={16} className="text-blue-600" />
      </div>
      <h2 className="font-bold text-slate-800">{title}</h2>
    </div>
    {children}
  </div>
);

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState(null);

  useEffect(() => {
    getCart()
      .then((res) => setCart(res.data.cart || { items: [] }))
      .catch(() => {})
      .finally(() => setLoading(false));

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setPosition(DEFAULT_CENTER)
      );
    } else {
      setPosition(DEFAULT_CENTER);
    }
  }, []);

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    setError("");
    if (!address.trim()) { setError("Please enter your delivery address."); return; }
    if (!position) { setError("Please select your location on the map."); return; }
    try {
      setPlacing(true);
      const res = await placeOrder({ address, lat: position[0], lng: position[1] });
      if (res.data.success) {
        setSuccess(true);
        setTimeout(() => navigate("/user/orders"), 2000);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order. Please try again.");
    } finally {
      setPlacing(false);
    }
  };

  if (loading || !position) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-5">Checkout</h1>
        <SkeletonList count={3} height="h-24" />
      </div>
    );
  }

  // Success state
  if (success) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex flex-col items-center justify-center py-24 text-center"
      >
        <div className="w-24 h-24 bg-green-50 rounded-full flex items-center justify-center mb-5">
          <FiCheckCircle size={48} className="text-green-500" />
        </div>
        <h2 className="text-2xl font-bold text-slate-800">Order Placed!</h2>
        <p className="text-slate-400 mt-2">Redirecting to your orders...</p>
      </motion.div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate(-1)}
          className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500 hover:bg-slate-50 transition"
        >
          <FiArrowLeft size={17} />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Checkout</h1>
          <p className="text-sm text-slate-400">Complete your order</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -6 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-2xl mb-4"
        >
          <span>⚠️</span> {error}
        </motion.div>
      )}

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Left column ──────────────────────────────────────── */}
        <div className="flex-1 space-y-0">

          {/* Step 1: Delivery Address */}
          <SectionCard icon={FiMapPin} title="Delivery Address" step="1">
            <textarea
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="House no., street, area, landmark..."
              rows={2}
              className="w-full border border-slate-200 rounded-2xl p-3.5 text-sm text-slate-800 outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition resize-none bg-slate-50"
            />
            <p className="text-xs text-slate-400 mt-2 mb-3 flex items-center gap-1.5">
              <FiMapPin size={12} className="text-blue-400" />
              Tap on the map to pin your exact delivery location
            </p>
            <div className="rounded-2xl overflow-hidden h-52 border border-slate-200">
              <MapContainer center={position} zoom={15} style={{ height: "100%", width: "100%" }}>
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <LocationPicker position={position} setPosition={setPosition} />
              </MapContainer>
            </div>
            {position && (
              <p className="text-xs text-blue-500 font-medium mt-2 text-center">
                📌 Pinned at {position[0].toFixed(4)}, {position[1].toFixed(4)}
              </p>
            )}
          </SectionCard>

          {/* Step 2: Payment Method */}
          <SectionCard icon={FiTruck} title="Payment Method" step="2">
            <div className="flex items-center gap-3 border-2 border-blue-500 bg-blue-50 rounded-2xl px-4 py-3.5">
              <div className="w-5 h-5 rounded-full border-2 border-blue-500 flex items-center justify-center shrink-0">
                <div className="w-2.5 h-2.5 rounded-full bg-blue-500" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-slate-800 text-sm">Cash on Delivery</p>
                <p className="text-xs text-slate-400">Pay when your order arrives</p>
              </div>
              <FiCheckCircle size={18} className="text-blue-500" />
            </div>
            {deliveryFee === 0 && (
              <p className="text-xs text-green-600 font-semibold mt-3 text-center bg-green-50 py-2 rounded-xl">
                🎉 You've unlocked FREE delivery!
              </p>
            )}
          </SectionCard>
        </div>

        {/* ── Right column: Order Summary ───────────────────────── */}
        <div className="lg:w-80 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 sticky top-24">
            <h3 className="font-bold text-slate-800 flex items-center gap-2 mb-4">
              <FiShoppingBag size={16} className="text-blue-500" /> Order Summary
            </h3>

            {/* Items list */}
            <div className="space-y-3 mb-4 max-h-56 overflow-y-auto">
              {items.map((item) => (
                <div key={item.product._id} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center overflow-hidden shrink-0">
                    {item.product.image ? (
                      <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                    ) : (
                      <FiShoppingBag size={14} className="text-slate-300" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold text-slate-700 line-clamp-1">{item.product.name}</p>
                    <p className="text-xs text-slate-400">Qty: {item.quantity}</p>
                  </div>
                  <p className="text-xs font-bold text-slate-800 shrink-0">
                    ₹{(item.product.price * item.quantity).toFixed(0)}
                  </p>
                </div>
              ))}
            </div>

            {/* Price breakdown */}
            <div className="border-t border-slate-100 pt-4 space-y-2">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal</span>
                <span>₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Delivery fee</span>
                <span className={deliveryFee === 0 ? "text-green-600 font-semibold" : ""}>
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="flex justify-between font-bold text-slate-800 text-base border-t border-slate-100 pt-2">
                <span>Total (COD)</span>
                <span className="text-blue-600">₹{total.toFixed(0)}</span>
              </div>
            </div>

            {/* Place Order button */}
            <motion.button
              whileTap={{ scale: 0.97 }}
              disabled={placing || items.length === 0}
              onClick={handlePlaceOrder}
              className="w-full mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-4 rounded-2xl font-bold flex items-center justify-between px-5 shadow-lg shadow-blue-200 transition disabled:opacity-60"
            >
              <span className="flex items-center gap-2">
                {placing ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                    Placing order...
                  </>
                ) : (
                  <>
                    <FiCheckCircle size={18} />
                    Place Order
                  </>
                )}
              </span>
              {!placing && (
                <span className="flex items-center gap-1">
                  ₹{total.toFixed(0)} <FiChevronRight size={16} />
                </span>
              )}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;
