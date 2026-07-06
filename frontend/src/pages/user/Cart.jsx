import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiMinus, FiPlus, FiTrash2, FiShoppingBag,
  FiArrowRight, FiTag, FiTruck
} from "react-icons/fi";

import { getCart, updateCartItem, removeCartItem } from "../../services/cartApi";
import { SkeletonList } from "../../components/Skeletons";

const Cart = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

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

  useEffect(() => { fetchCart(); }, []);

  const handleQtyChange = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      setUpdatingId(productId);
      const res = await updateCartItem(productId, newQty);
      setCart(res.data.cart);
    } catch (err) {
      console.log(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (productId) => {
    try {
      setUpdatingId(productId);
      const res = await removeCartItem(productId);
      setCart(res.data.cart);
    } catch (err) {
      console.log(err);
    } finally {
      setUpdatingId(null);
    }
  };

  if (loading) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-slate-800 mb-5">Shopping Cart</h1>
        <SkeletonList count={3} height="h-24" />
      </div>
    );
  }

  const items = cart?.items || [];
  const subtotal = items.reduce((s, i) => s + (i.product?.price || 0) * i.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 40;
  const total = subtotal + deliveryFee;

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-24 text-center">
        <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mb-5">
          <FiShoppingBag size={40} className="text-blue-200" />
        </div>
        <h2 className="text-xl font-bold text-slate-700">Your cart is empty</h2>
        <p className="text-slate-400 text-sm mt-2">Add some items to get started</p>
        <motion.button
          whileTap={{ scale: 0.96 }}
          onClick={() => navigate("/user/products")}
          className="mt-6 bg-blue-600 hover:bg-blue-700 text-white px-7 py-3 rounded-2xl font-semibold flex items-center gap-2 transition"
        >
          Browse Products <FiArrowRight size={16} />
        </motion.button>
      </div>
    );
  }

  return (
    <div>
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800">Shopping Cart</h1>
        <p className="text-sm text-slate-400 mt-1">
          Review your selected items before checking out
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* ── Cart Items ──────────────────────────────────────── */}
        <div className="flex-1 space-y-3">
          <AnimatePresence>
            {items.map((item) => (
              <motion.div
                key={item.product._id}
                initial={{ opacity: 1 }}
                exit={{ opacity: 0, x: -40, height: 0 }}
                transition={{ duration: 0.25 }}
                className="bg-white rounded-2xl border border-slate-100 p-4 flex items-center gap-4 shadow-sm"
              >
                {/* Product image */}
                <div className="w-16 h-16 rounded-xl bg-blue-50 flex items-center justify-center overflow-hidden shrink-0">
                  {item.product.image ? (
                    <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                  ) : (
                    <FiShoppingBag size={24} className="text-blue-200" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-slate-800 text-sm line-clamp-1">
                    {item.product.name}
                  </h3>
                  {item.product.category && (
                    <p className="text-xs text-slate-400 mt-0.5">{item.product.category}</p>
                  )}
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-sm font-bold text-blue-600">₹{item.product.price}</span>
                    {item.product.mrp && item.product.mrp > item.product.price && (
                      <span className="text-xs text-slate-400 line-through">₹{item.product.mrp}</span>
                    )}
                  </div>
                </div>

                {/* Qty stepper */}
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-xl px-2 py-1">
                  <button
                    disabled={updatingId === item.product._id}
                    onClick={() => handleQtyChange(item.product._id, item.quantity - 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 transition disabled:opacity-40"
                  >
                    <FiMinus size={13} />
                  </button>
                  <span className="text-sm font-bold text-slate-800 w-5 text-center">
                    {item.quantity}
                  </span>
                  <button
                    disabled={updatingId === item.product._id}
                    onClick={() => handleQtyChange(item.product._id, item.quantity + 1)}
                    className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-200 transition disabled:opacity-40"
                  >
                    <FiPlus size={13} />
                  </button>
                </div>

                {/* Remove */}
                <button
                  onClick={() => handleRemove(item.product._id)}
                  disabled={updatingId === item.product._id}
                  className="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 transition disabled:opacity-40"
                >
                  <FiTrash2 size={16} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* ── Order Summary ───────────────────────────────────── */}
        <div className="lg:w-80 shrink-0 space-y-4">

          {/* Free delivery nudge */}
          {deliveryFee > 0 && (
            <div className="bg-amber-50 border border-amber-100 rounded-2xl px-4 py-3 flex items-start gap-3">
              <FiTruck size={16} className="text-amber-500 mt-0.5 shrink-0" />
              <p className="text-xs text-amber-700 font-medium">
                Add ₹{(499 - subtotal).toFixed(0)} more to get <span className="font-bold">FREE delivery!</span>
              </p>
            </div>
          )}

          {/* Price breakdown */}
          <div className="bg-white rounded-2xl border border-slate-100 p-5 shadow-sm">
            <h3 className="font-bold text-slate-800 mb-4">Price Breakdown</h3>
            <div className="space-y-2.5">
              <div className="flex justify-between text-sm text-slate-500">
                <span>Subtotal ({items.length} item{items.length > 1 ? "s" : ""})</span>
                <span className="font-medium text-slate-700">₹{subtotal.toFixed(0)}</span>
              </div>
              <div className="flex justify-between text-sm text-slate-500">
                <span>Delivery fee</span>
                <span className={`font-medium ${deliveryFee === 0 ? "text-green-600" : "text-slate-700"}`}>
                  {deliveryFee === 0 ? "FREE" : `₹${deliveryFee}`}
                </span>
              </div>
              <div className="border-t border-slate-100 pt-3 flex justify-between font-bold text-slate-800 text-base">
                <span>Order Total</span>
                <span className="text-blue-600">₹{total.toFixed(0)}</span>
              </div>
            </div>

            <motion.button
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate("/user/checkout")}
              className="w-full mt-5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white py-3.5 rounded-2xl font-bold flex items-center justify-center gap-2 shadow-lg shadow-blue-200 transition"
            >
              Proceed to Checkout <FiArrowRight size={16} />
            </motion.button>

            <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-1.5">
              🔒 Safe & Secure Payments
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Cart;
