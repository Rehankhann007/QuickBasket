import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { FiSearch } from "react-icons/fi";

import { getAllProducts } from "../../services/productApi";
import { addToCart } from "../../services/cartApi";
import { CATEGORY_NAMES } from "../../constants/categories";
import ProductCard from "../../components/ProductCard";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";

const Products = () => {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(location.state?.category || "All");
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

  // If user navigates here again from Home with a different category, sync it
  useEffect(() => {
    if (location.state?.category) {
      setCategory(location.state.category);
    }
  }, [location.state]);

  const categories = useMemo(() => ["All", ...CATEGORY_NAMES], []);

  const filtered = useMemo(() => {
    return products.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchesCategory = category === "All" || p.category === category;
      return matchesSearch && matchesCategory;
    });
  }, [products, search, category]);

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
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Shop Groceries</h1>

      {/* Search */}
      <div className="relative mb-4">
        <FiSearch className="absolute left-4 top-3.5 text-gray-400" />
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-white border border-gray-200 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-orange-500 transition"
        />
      </div>

      {/* Category chips */}
      <div className="flex gap-2 overflow-x-auto pb-2 mb-5 scrollbar-hide">
        {categories.map((cat) => (
          <motion.button
            key={cat}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategory(cat)}
            className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition ${
              category === cat
                ? "bg-orange-500 text-white"
                : "bg-white text-gray-500 border border-gray-200"
            }`}
          >
            {cat}
          </motion.button>
        ))}
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <ProductCardSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-gray-400 text-center py-12"
        >
          No products found{category !== "All" ? ` in ${category}` : ""}.
        </motion.p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {filtered.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
              onAddToCart={handleAddToCart}
              adding={addingId === product._id}
            />
          ))}
        </div>
      )}

      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 md:bottom-6 left-1/2 -translate-x-1/2 bg-gray-900 text-white px-5 py-2.5 rounded-full text-sm shadow-lg z-50"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
};

export default Products;