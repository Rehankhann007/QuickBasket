import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";

import { getAllProducts } from "../../services/productApi";
import { addToCart } from "../../services/cartApi";
import { CATEGORIES } from "../../constants/categories";
import ProductCard from "../../components/ProductCard";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";
import Footer from "../../components/Footer";

const Home = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await getAllProducts();
        setProducts(res.data.products || []);
      } catch (err) {
        console.log(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const handleAddToCart = async (product) => {
    try {
      setAddingId(product._id);
      await addToCart(product._id, 1);
      setToast(`${product.name} added to cart`);
      setTimeout(() => setToast(""), 2000);
    } catch (err) {
      setToast(err.response?.data?.message || "Could not add to cart");
      setTimeout(() => setToast(""), 2000);
    } finally {
      setAddingId(null);
    }
  };

  return (
    <div>
      {/* Hero */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-linear-to-r from-orange-500 to-orange-400 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden mb-8"
      >
        <div className="relative z-10 max-w-md">
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl md:text-4xl font-bold mb-2"
          >
            Fresh Groceries, Delivered Fast
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-orange-50 mb-6"
          >
            Get fruits, vegetables, and daily essentials at your doorstep in minutes.
          </motion.p>
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            whileTap={{ scale: 0.96 }}
            whileHover={{ scale: 1.03 }}
            onClick={() => navigate("/user/products")}
            className="bg-white hover:cursor-pointer text-orange-500 font-semibold px-5 py-3 rounded-xl flex items-center gap-2"
          >
            Shop Now <FiArrowRight />
          </motion.button>
        </div>
        <motion.div
          animate={{ scale: [1, 1.08, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute -right-10 -bottom-10 w-56 h-56 bg-white/10 rounded-full"
        />
        <motion.div
          animate={{ scale: [1, 1.15, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute right-10 top-5 w-24 h-24 bg-white/10 rounded-full"
        />
      </motion.div>

      {/* Shop by Category */}
      <div className="mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Shop by Category</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
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
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden shadow-sm ring-1 ring-black/5 group-hover:ring-orange-300 transition">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </div>
              <span className="text-xs font-medium text-gray-600 text-center leading-tight">
                {cat.name}
              </span>
            </motion.button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold text-gray-800">Popular Items</h2>
        <button
          onClick={() => navigate("/user/products")}
          className="text-orange-500 hover:cursor-pointer text-sm font-medium"
        >
          See all
        </button>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : products.length === 0 ? (
        <p className="text-gray-400 text-center py-12">No products available yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.slice(0, 8).map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              adding={addingId === product._id}
            />
          ))}
        </div>
      )}

      <Footer />

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm shadow-lg z-50"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
};

export default Home;