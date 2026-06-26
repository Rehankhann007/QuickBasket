import { motion, AnimatePresence } from "framer-motion";
import { FiCheck } from "react-icons/fi";
import ConfettiBurst from "./ConfettiBurst";

/**
 * Full screen success overlay. Shows a checkmark pop + confetti.
 * Parent is responsible for showing this for ~1.5s then navigating away.
 */
const OrderSuccessOverlay = ({ show, message = "Order Placed!" }) => {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[150] bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center"
        >
          <ConfettiBurst show={show} />

          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 18 }}
            className="w-20 h-20 rounded-full bg-green-500 flex items-center justify-center mb-4"
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 }}
            >
              <FiCheck size={36} className="text-white" />
            </motion.div>
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl font-bold text-gray-800"
          >
            {message}
          </motion.h2>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OrderSuccessOverlay;
