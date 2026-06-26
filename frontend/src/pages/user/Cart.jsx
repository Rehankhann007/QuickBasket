import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiMinus, FiPlus, FiTrash2, FiShoppingBag } from "react-icons/fi";

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

  useEffect(() => {
    fetchCart();
  }, []);

  const handleQuantityChange = async (productId, newQty) => {
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
        <h1 className="text-2xl font-bold text-gray-800 mb-5">Your Cart</h1>
        <SkeletonList count={3} height="h-20" />
      </div>
    );
  }

  const items = cart?.items || [];
  const total = items.reduce(
    (sum, item) => sum + (item.product?.price || 0) * item.quantity,
    0
  );

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <FiShoppingBag size={48} className="text-orange-200 mb-4" />
        <h2 className="text-lg font-semibold text-gray-700">Your cart is empty</h2>
        <p className="text-gray-400 text-sm mt-1">Add some groceries to get started</p>
        <button
          onClick={() => navigate("/user/products")}
          className="mt-5 bg-orange-500 text-white px-6 py-2.5 rounded-xl font-medium"
        >
          Browse Products
        </button>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-800 mb-5">Your Cart</h1>

      <div className="space-y-3">
        <AnimatePresence>
          {items.map((item) => (
            <motion.div
              key={item.product._id}
              initial={{ opacity: 1 }}
              exit={{ opacity: 0, x: -50 }}
              className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm"
            >
              <div className="w-16 h-16 bg-orange-50 rounded-xl flex items-center justify-center overflow-hidden shrink-0">
                {item.product.image ? (
                  <img src={item.product.image} alt={item.product.name} className="w-full h-full object-cover" />
                ) : (
                  <FiShoppingBag className="text-orange-200" size={24} />
                )}
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-800 line-clamp-1">
                  {item.product.name}
                </h3>
                <p className="text-orange-500 font-bold text-sm mt-0.5">
                  ₹{item.product.price}
                </p>
              </div>

              <div className="flex items-center gap-3 bg-orange-50 rounded-full px-2 py-1">
                <button
                  disabled={updatingId === item.product._id}
                  onClick={() => handleQuantityChange(item.product._id, item.quantity - 1)}
                  className="text-orange-500 p-1"
                >
                  <FiMinus size={14} />
                </button>
                <span className="text-sm font-medium w-4 text-center">{item.quantity}</span>
                <button
                  disabled={updatingId === item.product._id}
                  onClick={() => handleQuantityChange(item.product._id, item.quantity + 1)}
                  className="text-orange-500 p-1"
                >
                  <FiPlus size={14} />
                </button>
              </div>

              <button
                onClick={() => handleRemove(item.product._id)}
                className="text-red-400 p-2"
              >
                <FiTrash2 size={18} />
              </button>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      <div className="bg-white rounded-2xl p-5 mt-6 shadow-sm sticky bottom-20 md:bottom-4">
        <div className="flex justify-between text-gray-600 mb-2">
          <span>Subtotal</span>
          <span>₹{total}</span>
        </div>
        <div className="flex justify-between text-gray-600 mb-3">
          <span>Delivery</span>
          <span className="text-green-600 font-medium">Free</span>
        </div>
        <div className="flex justify-between font-bold text-lg text-gray-800 border-t pt-3 mb-4">
          <span>Total</span>
          <span>₹{total}</span>
        </div>
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => navigate("/user/checkout")}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3.5 rounded-xl font-semibold transition"
        >
          Proceed to Checkout
        </motion.button>
      </div>
    </div>
  );
};

export default Cart;
