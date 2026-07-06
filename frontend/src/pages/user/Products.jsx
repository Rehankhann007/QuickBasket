import { useEffect, useState, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiSearch, FiFilter, FiX, FiShoppingBag } from "react-icons/fi";

import { getAllProducts } from "../../services/productApi";
import { addToCart } from "../../services/cartApi";
import { CATEGORY_NAMES } from "../../constants/categories";
import ProductCard from "../../components/ProductCard";
import ProductCardSkeleton from "../../components/ProductCardSkeleton";

const SORT_OPTIONS = [
  { value: "default", label: "Default" },
  { value: "priceAsc", label: "Price: Low to High" },
  { value: "priceDesc", label: "Price: High to Low" },
  { value: "name", label: "Name A–Z" },
];

const Products = () => {
  const location = useLocation();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(location.state?.category || "All");
  const [sort, setSort] = useState("default");
  const [addingId, setAddingId] = useState(null);
  const [toast, setToast] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    getAllProducts()
      .then((res) => setProducts(res.data.products || []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (location.state?.category) setCategory(location.state.category);
  }, [location.state]);

  const categories = useMemo(() => ["All", ...CATEGORY_NAMES], []);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = category === "All" || p.category === category;
      return matchSearch && matchCat;
    });

    if (sort === "priceAsc") list = [...list].sort((a, b) => a.price - b.price);
    else if (sort === "priceDesc") list = [...list].sort((a, b) => b.price - a.price);
    else if (sort === "name") list = [...list].sort((a, b) => a.name.localeCompare(b.name));

    return list;
  }, [products, search, category, sort]);

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
    <div>
      {/* ── Header ────────────────────────────────────────────── */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-slate-800">Shop</h1>
        <p className="text-sm text-slate-400 mt-1">
          {loading ? "Loading..." : `${filtered.length} products found`}
        </p>
      </div>

      {/* ── Search + Controls ─────────────────────────────────── */}
      <div className="flex gap-3 mb-5">
        <div className="relative flex-1">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input
            type="text"
            placeholder="Search fruits, brands, salts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-slate-200 rounded-2xl pl-11 pr-4 py-3 text-sm outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <FiX size={16} />
            </button>
          )}
        </div>

        {/* Sort dropdown */}
        <select
          value={sort}
          onChange={(e) => setSort(e.target.value)}
          className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm text-slate-700 outline-none focus:border-blue-500 transition hidden sm:block"
        >
          {SORT_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>

        {/* Mobile filter button */}
        <button
          onClick={() => setShowFilters(true)}
          className="sm:hidden flex items-center gap-2 bg-white border border-slate-200 rounded-2xl px-4 py-3 text-sm font-medium text-slate-600"
        >
          <FiFilter size={16} />
        </button>
      </div>

      <div className="flex gap-6">
        {/* ── Sidebar Filters (desktop) ────────────────────── */}
        <aside className="hidden md:block w-52 shrink-0">
          <div className="bg-white rounded-2xl border border-slate-100 p-4 sticky top-24">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Category</h3>
            <div className="space-y-1">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
                    category === cat
                      ? "bg-blue-600 text-white"
                      : "text-slate-600 hover:bg-slate-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 mt-4 pt-4">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sort By</h3>
              <div className="space-y-1">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => setSort(o.value)}
                    className={`w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition ${
                      sort === o.value
                        ? "bg-blue-600 text-white"
                        : "text-slate-600 hover:bg-slate-50"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </aside>

        {/* ── Products Grid ─────────────────────────────────── */}
        <div className="flex-1 min-w-0">
          {/* Mobile category chips */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-4 md:hidden scrollbar-hide">
            {categories.map((cat) => (
              <motion.button
                key={cat}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition ${
                  category === cat
                    ? "bg-blue-600 text-white"
                    : "bg-white border border-slate-200 text-slate-500"
                }`}
              >
                {cat}
              </motion.button>
            ))}
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : filtered.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex flex-col items-center justify-center py-20 text-center"
            >
              <FiShoppingBag size={44} className="text-slate-200 mb-3" />
              <p className="text-slate-400 font-medium">No products found</p>
              {(search || category !== "All") && (
                <button
                  onClick={() => { setSearch(""); setCategory("All"); }}
                  className="mt-4 text-sm text-blue-600 font-semibold hover:underline"
                >
                  Clear filters
                </button>
              )}
            </motion.div>
          ) : (
            <AnimatePresence mode="wait">
              <motion.div
                key={`${category}-${sort}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4"
              >
                {filtered.map((product, i) => (
                  <motion.div
                    key={product._id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.03 }}
                  >
                    <ProductCard
                      product={product}
                      onAddToCart={handleAddToCart}
                      adding={addingId === product._id}
                    />
                  </motion.div>
                ))}
              </motion.div>
            </AnimatePresence>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      <AnimatePresence>
        {showFilters && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowFilters(false)}
              className="fixed inset-0 bg-black/40 z-50 sm:hidden"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 bg-white rounded-t-3xl z-50 p-6 sm:hidden"
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="font-bold text-slate-800">Filters</h3>
                <button onClick={() => setShowFilters(false)} className="text-slate-400">
                  <FiX size={22} />
                </button>
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Category</p>
              <div className="flex flex-wrap gap-2 mb-5">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setShowFilters(false); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      category === cat
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Sort By</p>
              <div className="flex flex-wrap gap-2">
                {SORT_OPTIONS.map((o) => (
                  <button
                    key={o.value}
                    onClick={() => { setSort(o.value); setShowFilters(false); }}
                    className={`px-4 py-2 rounded-full text-sm font-medium border transition ${
                      sort === o.value
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-slate-200 text-slate-600"
                    }`}
                  >
                    {o.label}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Toast */}
      {toast && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="fixed bottom-24 md:bottom-8 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-2.5 rounded-full text-sm shadow-xl z-50 whitespace-nowrap"
        >
          {toast}
        </motion.div>
      )}
    </div>
  );
};

export default Products;
