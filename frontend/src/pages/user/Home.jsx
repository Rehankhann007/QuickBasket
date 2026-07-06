import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight, FiShoppingBag, FiTruck, FiShield, FiClock } from "react-icons/fi";

import { getAllProducts } from "../../services/productApi";
import { addToCart } from "../../services/cartApi";
import { CATEGORIES } from "../../constants/categories";
import ProductCard from "../../components/ProductCard";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";
import Footer from "../../components/Footer";

// ─── Feature pill ──────────────────────────────────────────────────────────
const FeaturePill = ({ icon: Icon, text }) => (
  <div className="flex items-center gap-2 bg-white rounded-2xl px-4 py-2.5 shadow-sm border border-slate-100">
    <Icon size={16} className="text-blue-500 shrink-0" />
    <span className="text-xs font-semibold text-slate-600 whitespace-nowrap">{text}</span>
  </div>
);

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    getAllProducts()
      .then((res) => setProducts(res.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const handleAddToCart = async (product) => {
    try {
      setAddingId(product._id);
      await addToCart(product._id, 1);
      setToast(`${product.name} added to cart ✓`);
    } catch (err) {
      setToast(err.response?.data?.message || "Could not add to cart");
    } finally {
      setAddingId(null);
      setTimeout(() => setToast(""), 2500);
    }
  };

  return (
    <div className="space-y-10">

      {/* ── Hero ──────────────────────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden"
      >
        {/* Decorative circles */}
        <motion.div
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-12 -bottom-12 w-64 h-64 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute right-16 top-4 w-28 h-28 bg-white/10 rounded-full"
        />

        <div className="relative z-10 max-w-lg">
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-block bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-full mb-4"
          >
            🛒 Fast Delivery • Fresh Products
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-3xl md:text-4xl font-bold mb-3 leading-tight"
          >
            Fresh Groceries,<br />Delivered Fast
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-blue-100 mb-7 text-sm md:text-base"
          >
            Get fruits, vegetables, and daily essentials at your doorstep in minutes.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate("/user/products")}
            className="inline-flex items-center gap-2 bg-white text-blue-600 font-bold px-6 py-3 rounded-2xl shadow-lg hover:shadow-xl transition"
          >
            Shop Now <FiArrowRight size={18} />
          </motion.button>
        </div>
      </motion.div>

      {/* ── Feature pills ─────────────────────────────────────── */}
      <div className="flex gap-3 overflow-x-auto pb-1 scrollbar-hide">
        <FeaturePill icon={FiTruck} text="Free Delivery above ₹499" />
        <FeaturePill icon={FiClock} text="30-min Delivery" />
        <FeaturePill icon={FiShield} text="100% Fresh Guarantee" />
        <FeaturePill icon={FiShoppingBag} text="1000+ Products" />
      </div>

      {/* ── Shop by Category ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Shop by Category</h2>
        </div>
        <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-3">
          {CATEGORIES.map((cat, i) => (
            <motion.button
              key={cat.name}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.04 }}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/user/products", { state: { category: cat.name } })}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden shadow-sm border border-slate-100 group-hover:border-blue-300 group-hover:shadow-md transition">
                <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" loading="lazy" />
              </div>
              <span className="text-[10px] font-semibold text-slate-500 text-center leading-tight">
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      {/* ── Popular Products ──────────────────────────────────── */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-slate-800">Popular Items</h2>
          <button
            onClick={() => navigate("/user/products")}
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-800 transition"
          >
            See all <FiArrowRight size={14} />
          </button>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16 text-slate-400">
            <FiShoppingBag size={40} className="mx-auto mb-3 opacity-30" />
            <p>No products available yet.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {products.slice(0, 10).map((product) => (
              <ProductCard
                key={product._id}
                product={product}
                onAddToCart={handleAddToCart}
                adding={addingId === product._id}
              />
            ))}
          </div>
        )}
      </div>

      <Footer />

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm shadow-xl z-50 whitespace-nowrap"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
};

export default Home;
