import { motion } from "framer-motion";
import { FiPlus, FiShoppingCart, FiStar } from "react-icons/fi";

const ProductCard = ({ product, onAddToCart, adding }) => {
  const outOfStock = product.stock <= 0;
  const discount = product.mrp && product.mrp > product.price
    ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
    : null;

  return (
    <motion.div
      whileHover={{ y: -4, boxShadow: "0 12px 32px rgba(59,130,246,0.10)" }}
      transition={{ duration: 0.2 }}
      className="bg-white rounded-2xl overflow-hidden flex flex-col border border-slate-100 shadow-sm"
    >
      {/* Image */}
      <div className="relative aspect-square bg-slate-50 flex items-center justify-center overflow-hidden">
        {discount && (
          <span className="absolute top-2 left-2 z-10 bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            {discount}% OFF
          </span>
        )}
        {product.stock > 0 && product.stock <= 5 && (
          <span className="absolute top-2 right-2 z-10 bg-amber-400 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
            Only {product.stock} left
          </span>
        )}
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover"
            loading="lazy"
          />
        ) : (
          <FiShoppingCart size={36} className="text-slate-200" />
        )}
      </div>

      {/* Body */}
      <div className="p-3 flex flex-col flex-1">
        <span className="text-[10px] font-semibold text-blue-500 uppercase tracking-wide">
          {product.category}
        </span>
        <h3 className="font-semibold text-slate-800 mt-0.5 text-sm line-clamp-1">
          {product.name}
        </h3>
        {product.description && (
          <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 flex-1">
            {product.description}
          </p>
        )}

        {/* Rating */}
        {product.rating && (
          <div className="flex items-center gap-1 mt-1">
            <FiStar size={11} className="text-amber-400 fill-amber-400" />
            <span className="text-xs text-slate-500 font-medium">{product.rating}</span>
          </div>
        )}

        {/* Price + Add button */}
        <div className="flex items-center justify-between mt-2.5 gap-2">
          <div>
            <span className="text-base font-bold text-slate-900">₹{product.price}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-xs text-slate-400 line-through ml-1.5">₹{product.mrp}</span>
            )}
          </div>

          <motion.button
            whileTap={{ scale: 0.88 }}
            disabled={outOfStock || adding}
            onClick={() => onAddToCart(product)}
            className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-semibold transition shrink-0 ${
              outOfStock
                ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                : adding
                ? "bg-blue-100 text-blue-400"
                : "bg-blue-600 hover:bg-blue-700 text-white"
            }`}
          >
            <FiPlus size={13} />
            {outOfStock ? "Sold out" : adding ? "Adding…" : "Add"}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
