import { motion, AnimatePresence } from "framer-motion";
import { useCartFly } from "../context/CartFlyContext";

const FlyToCartLayer = () => {
  const { flyingItems } = useCartFly();

  return (
    <div className="fixed inset-0 pointer-events-none z-100">
      <AnimatePresence>
        {flyingItems.map((item) => (
          <motion.div
            key={item.id}
            initial={{
              left: item.startX,
              top: item.startY,
              opacity: 1,
              scale: 1,
              x: "-50%",
              y: "-50%",
            }}
            animate={{
              left: item.endX,
              top: item.endY,
              opacity: 0.3,
              scale: 0.3,
              x: "-50%",
              y: "-50%",
            }}
            transition={{ duration: 0.6, ease: "easeIn" }}
            style={{ position: "fixed" }}
            className="w-10 h-10 rounded-full overflow-hidden shadow-lg ring-2 ring-white"
          >
            {item.imageUrl ? (
              <img src={item.imageUrl} alt="" className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full bg-orange-400" />
            )}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default FlyToCartLayer;
