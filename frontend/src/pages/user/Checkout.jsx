import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import { FiMapPin, FiTruck } from "react-icons/fi";
import "leaflet/dist/leaflet.css";

import { getCart } from "../../services/cartApi";
import { placeOrder } from "../../services/orderApi";
import LoadingSpinner from "../../components/LoadingSpinner";
import OrderSuccessOverlay from "../../components/OrderSuccessOverlay";
import { homePinIcon } from "../../utils/mapIcons";

const DEFAULT_CENTER = [22.7196, 75.8577]; // Indore, fallback

const LocationPicker = ({ position, setPosition }) => {
  useMapEvents({
    click(e) {
      setPosition([e.latlng.lat, e.latlng.lng]);
    },
  });
  return position ? <Marker position={position} icon={homePinIcon} /> : null;
};

const Checkout = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [address, setAddress] = useState("");
  const [position, setPosition] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await getCart();
        setCart(res.data.cart || { items: [] });
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCart();

    // Try to get user's current location to center the map nicely
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => setPosition([pos.coords.latitude, pos.coords.longitude]),
        () => setPosition(DEFAULT_CENTER)
      );
    } else {
      setPosition(DEFAULT_CENTER);
    }
  }, []);

  const handlePlaceOrder = async () => {
    setError("");

    if (!address.trim()) {
      setError("Please enter your delivery address");
      return;
    }
    if (!position) {
      setError("Please select your location on the map");
      return;
    }

    try {
      setPlacing(true);
      const res = await placeOrder({
        address,
        lat: position[0],
        lng: position[1],
      });

      if (res.data.success) {
        setShowSuccess(true);
        setTimeout(() => {
          navigate("/user/orders");
        }, 1600);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Could not place order");
    } finally {
      setPlacing(false);
    }
  };

  if (loading || !position) return <LoadingSpinner fullScreen />;

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Checkout</h1>

      {error && (
        <p className="bg-red-50 text-red-500 text-sm px-4 py-2.5 rounded-xl mb-4">
          {error}
        </p>
      )}

      {/* Address */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FiMapPin className="text-orange-500" /> Delivery Address
        </h2>
        <textarea
          value={address}
          onChange={(e) => setAddress(e.target.value)}
          placeholder="House no, street, area, landmark..."
          rows={2}
          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500 transition resize-none"
        />
        <p className="text-xs text-gray-400 mt-2">
          Tap on the map below to set your exact delivery pin
        </p>
        <div className="rounded-xl overflow-hidden mt-3 h-56">
          <MapContainer
            center={position}
            zoom={15}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
            <LocationPicker position={position} setPosition={setPosition} />
          </MapContainer>
        </div>
      </div>

      {/* Payment method */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-4">
        <h2 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
          <FiTruck className="text-orange-500" /> Payment Method
        </h2>
        <div className="flex items-center gap-3 border-2 border-orange-500 bg-orange-50 rounded-xl p-3">
          <input type="radio" checked readOnly className="accent-orange-500" />
          <span className="font-medium text-gray-700">Cash on Delivery (COD)</span>
        </div>
      </div>

      {/* Order summary */}
      <div className="bg-white rounded-2xl p-5 shadow-sm mb-24 md:mb-4">
        <h2 className="font-semibold text-gray-800 mb-3">Order Summary</h2>
        {items.map((item) => (
          <div key={item.product._id} className="flex justify-between text-sm text-gray-600 mb-1.5">
            <span>{item.product.name} x{item.quantity}</span>
            <span>₹{item.product.price * item.quantity}</span>
          </div>
        ))}
        <div className="flex justify-between font-bold text-gray-800 border-t pt-3 mt-2">
          <span>Total (Pay on delivery)</span>
          <span>₹{total}</span>
        </div>
      </div>

      <motion.button
        whileTap={{ scale: 0.97 }}
        disabled={placing}
        onClick={handlePlaceOrder}
        className="fixed bottom-20 md:bottom-6 left-4 right-4 md:left-auto md:right-6 md:w-80 bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-semibold transition disabled:opacity-60 shadow-lg"
      >
        {placing ? "Placing Order..." : `Place Order • ₹${total}`}
      </motion.button>

      <OrderSuccessOverlay show={showSuccess} message="Order Placed!" />
    </div>
  );
};

export default Checkout;