import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { motion } from "framer-motion";
import { FiArrowLeft, FiPhone, FiPackage } from "react-icons/fi";
import "leaflet/dist/leaflet.css";

import { getSingleOrder } from "../../services/orderApi";
import { getSocket } from "../../services/socket";
import LoadingSpinner from "../../components/LoadingSpinner";
import { scooterIcon, homePinIcon } from "../../utils/mapIcons";

const TrackOrder = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [liveLocation, setLiveLocation] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await getSingleOrder(id);
        setOrder(res.data.order);

        // Seed with last known location from DB before live updates arrive
        if (res.data.order.currentLocation?.lat) {
          setLiveLocation([
            res.data.order.currentLocation.lat,
            res.data.order.currentLocation.lng,
          ]);
        }
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
    if (!socket) return;

    socket.emit("join_order_room", { orderId: id });

    const handleLocationUpdate = (data) => {
      if (data.orderId === id) {
        setLiveLocation([data.lat, data.lng]);
      }
    };

    const handleStatusUpdate = (data) => {
      if (data.orderId === id) {
        setOrder((prev) => (prev ? { ...prev, status: data.status } : prev));
      }
    };

    socket.on("location_update", handleLocationUpdate);
    socket.on("order_status_updated", handleStatusUpdate);

    return () => {
      socket.emit("leave_order_room", { orderId: id });
      socket.off("location_update", handleLocationUpdate);
      socket.off("order_status_updated", handleStatusUpdate);
    };
  }, [id]);

  if (loading) return <LoadingSpinner fullScreen />;
  if (!order) return <p className="text-center text-gray-400 py-12">Order not found</p>;

  const destination = order.deliveryAddress?.lat
    ? [order.deliveryAddress.lat, order.deliveryAddress.lng]
    : null;

  const mapCenter = liveLocation || destination || [22.7196, 75.8577];

  return (
    <div>
      <div className="flex items-center gap-3 mb-5">
        <button onClick={() => navigate(-1)} className="text-gray-500">
          <FiArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800">Track Order</h1>
      </div>

      <div className="rounded-2xl overflow-hidden h-80 mb-4 shadow-sm">
        <MapContainer center={mapCenter} zoom={14} style={{ height: "100%", width: "100%" }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {destination && (
            <Marker position={destination} icon={homePinIcon}>
              <Popup>Delivery Address</Popup>
            </Marker>
          )}

          {liveLocation && (
            <Marker position={liveLocation} icon={scooterIcon}>
              <Popup>Delivery Partner</Popup>
            </Marker>
          )}
        </MapContainer>
      </div>

      {!liveLocation && order.status === "Out For Delivery" && (
        <p className="text-center text-sm text-gray-400 mb-4">
          Waiting for delivery partner's live location...
        </p>
      )}

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-2xl p-5 shadow-sm"
      >
        <div className="flex justify-between items-center mb-3">
          <span className="font-semibold text-gray-800 flex items-center gap-2">
            <FiPackage className="text-orange-500" /> {order.status}
          </span>
          {order.deliveryBoy && (
            <span className="text-sm text-gray-500 flex items-center gap-1">
              <FiPhone size={14} /> {order.deliveryBoy.name}
            </span>
          )}
        </div>

        {order.status === "Out For Delivery" && (
          <div className="bg-orange-50 rounded-xl p-3 text-center">
            <p className="text-xs text-gray-500">Share this OTP with delivery partner</p>
            <p className="text-2xl font-bold text-orange-600 tracking-widest mt-1">
              {order.otp}
            </p>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default TrackOrder;