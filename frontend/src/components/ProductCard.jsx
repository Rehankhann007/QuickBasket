import { motion } from "framer-motion";
import { FiPlus, FiShoppingCart } from "react-icons/fi";

const ProductCard = ({ product, onAddToCart, adding }) => {
  const outOfStock = product.stock <= 0;

  const handleAddClick = () => {
    onAddToCart(product);
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-shadow overflow-hidden flex flex-col"
    >
      <div className="aspect-square bg-orange-50 flex items-center justify-center overflow-hidden">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <FiShoppingCart size={36} className="text-orange-200" />
        )}
      </div>

      <div className="p-4 flex flex-col flex-1">
        <span className="text-xs text-orange-500 font-medium uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-semibold text-gray-800 mt-1 line-clamp-1">
          {product.name}
        </h3>
        <p className="text-sm text-gray-400 line-clamp-2 mt-1 flex-1">
          {product.description}
        </p>

        <div className="flex items-center justify-between mt-3">
          <span className="text-lg font-bold text-gray-900">
            ₹{product.price}
          </span>

          <motion.button
            whileTap={{ scale: 0.9 }}
            disabled={outOfStock || adding}
            onClick={handleAddClick}
            className={`flex items-center gap-1 px-3 py-2 rounded-xl text-sm font-medium transition cursor-pointer ${
              outOfStock
                ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                : "bg-orange-500 text-white hover:bg-orange-600"
            }`}
          >
            <FiPlus size={14} />
            {outOfStock ? "Out of stock" : adding ? "Adding..." : "Add"}
          </motion.button>
        </div>

        {!outOfStock && product.stock <= 5 && (
          <span className="text-[11px] text-red-500 mt-1">
            Only {product.stock} left
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ProductCard;