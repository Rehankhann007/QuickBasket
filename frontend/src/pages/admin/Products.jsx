import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FiEdit2, FiTrash2, FiPlus, FiX, FiSave, FiPackage } from "react-icons/fi";

import { getAllProducts, updateProduct, deleteProduct } from "../../services/productApi";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [deletingId, setDeletingId] = useState(null);

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

  useEffect(() => {
    fetchProducts();
  }, []);

  const startEdit = (product) => {
    setEditingId(product._id);
    setEditForm({ price: product.price, stock: product.stock });
  };

  const saveEdit = async (id) => {
    try {
      await updateProduct(id, editForm);
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      alert(err.response?.data?.message || "Update failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      setDeletingId(id);
      await deleteProduct(id);
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
        <Link
          to="/admin/add-product"
          className="flex items-center gap-2 bg-orange-500 text-white px-4 py-2.5 rounded-xl font-medium hover:bg-orange-600 transition"
        >
          <FiPlus /> Add Product
        </Link>
      </div>

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="grid grid-cols-12 gap-2 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase">
          <span className="col-span-4">Product</span>
          <span className="col-span-2">Category</span>
          <span className="col-span-2">Price</span>
          <span className="col-span-2">Stock</span>
          <span className="col-span-2 text-right">Actions</span>
        </div>

        {loading ? (
          Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="grid grid-cols-12 gap-2 items-center px-5 py-4 border-t border-gray-100"
            >
              <div className="col-span-4 flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-gray-100 animate-pulse shrink-0" />
                <div className="h-3 w-24 bg-gray-100 rounded animate-pulse" />
              </div>
              <div className="col-span-2 h-3 w-16 bg-gray-100 rounded animate-pulse" />
              <div className="col-span-2 h-3 w-10 bg-gray-100 rounded animate-pulse" />
              <div className="col-span-2 h-3 w-10 bg-gray-100 rounded animate-pulse" />
              <div className="col-span-2" />
            </div>
          ))
        ) : (
          <AnimatePresence>
            {products.map((product) => (
              <motion.div
                key={product._id}
                exit={{ opacity: 0 }}
                className="grid grid-cols-12 gap-2 items-center px-5 py-4 border-t border-gray-100"
              >
                <div className="col-span-4 flex items-center gap-3 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-orange-50 overflow-hidden shrink-0 flex items-center justify-center">
                    {product.image ? (
                      <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                    ) : (
                      <FiPackage className="text-orange-300" size={16} />
                    )}
                  </div>
                  <span className="font-medium text-gray-700 truncate">{product.name}</span>
                </div>
                <span className="col-span-2 text-sm text-gray-500">{product.category}</span>

                {editingId === product._id ? (
                  <>
                    <input
                      type="number"
                      value={editForm.price}
                      onChange={(e) => setEditForm({ ...editForm, price: e.target.value })}
                      className="col-span-2 border border-gray-200 rounded-lg p-1.5 text-sm w-20"
                    />
                    <input
                      type="number"
                      value={editForm.stock}
                      onChange={(e) => setEditForm({ ...editForm, stock: e.target.value })}
                      className="col-span-2 border border-gray-200 rounded-lg p-1.5 text-sm w-20"
                    />
                    <div className="col-span-2 flex justify-end gap-2">
                      <button onClick={() => saveEdit(product._id)} className="text-green-500 p-1.5">
                        <FiSave size={16} />
                      </button>
                      <button onClick={() => setEditingId(null)} className="text-gray-400 p-1.5">
                        <FiX size={16} />
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <span className="col-span-2 text-sm font-semibold text-gray-700">
                      ₹{product.price}
                    </span>
                    <span
                      className={`col-span-2 text-sm ${
                        product.stock <= 5 ? "text-red-500" : "text-gray-600"
                      }`}
                    >
                      {product.stock}
                    </span>
                    <div className="col-span-2 flex justify-end gap-2">
                      <button onClick={() => startEdit(product)} className="text-blue-500 p-1.5">
                        <FiEdit2 size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(product._id)}
                        disabled={deletingId === product._id}
                        className="text-red-400 p-1.5"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </>
                )}
              </motion.div>
            ))}
          </AnimatePresence>
        )}

        {!loading && products.length === 0 && (
          <p className="text-center text-gray-400 py-10">No products yet</p>
        )}
      </div>
    </div>
  );
};

export default Products;
