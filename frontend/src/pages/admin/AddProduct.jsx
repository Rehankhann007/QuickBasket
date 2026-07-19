import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

import { createProduct } from "../../services/productApi";
import { CATEGORY_NAMES, getCategoryImage } from "../../constants/categories";

const AddProduct = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    description: "",
    category: CATEGORY_NAMES[0],
    price: "",
    stock: "",
    image: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      setLoading(true);
      await createProduct({
        ...form,
        price: Number(form.price),
        stock: Number(form.stock),
        image: form.image.trim() || getCategoryImage(form.category),
      });
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Could not create product");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl">
      <h1 className="text-2xl font-bold text-gray-800 mb-6">Add Product</h1>

      <motion.form
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl p-6 shadow-sm space-y-4"
      >
        {error && (
          <p className="bg-red-50 text-red-500 text-sm px-4 py-2.5 rounded-xl">{error}</p>
        )}

        <input
          name="name"
          placeholder="Product Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500 transition"
        />

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          rows={3}
          required
          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500 transition resize-none"
        />

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          required
          className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500 transition bg-white"
        >
          {CATEGORY_NAMES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <div className="grid grid-cols-2 gap-4">
          <input
            name="price"
            type="number"
            min="0"
            placeholder="Price (₹)"
            value={form.price}
            onChange={handleChange}
            required
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500 transition"
          />
          <input
            name="stock"
            type="number"
            min="0"
            placeholder="Stock Quantity"
            value={form.stock}
            onChange={handleChange}
            required
            className="border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500 transition"
          />
        </div>

        <div>
          <input
            name="image"
            placeholder="Image URL (optional)"
            value={form.image}
            onChange={handleChange}
            className="w-full border border-gray-200 rounded-xl p-3 outline-none focus:border-orange-500 transition"
          />
          <p className="text-xs text-gray-400 mt-1.5">
            Leave empty to use a default {form.category} image
          </p>
        </div>

        <motion.button
          whileTap={{ scale: 0.97 }}
          type="submit"
          disabled={loading}
          className="w-full bg-orange-500 hover:bg-orange-600 text-white py-3 rounded-xl font-semibold transition disabled:opacity-60"
        >
          {loading ? "Adding..." : "Add Product"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddProduct;
