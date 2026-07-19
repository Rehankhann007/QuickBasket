import { motion } from "framer-motion";

const LoadingSpinner = ({ size = 40, fullScreen = false }) => {
  const spinner = (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.8, ease: "linear" }}
      style={{ width: size, height: size }}
      className="border-4 border-orange-200 border-t-orange-500 rounded-full"
    />
  );

  if (fullScreen) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        {spinner}
      </div>
    );
  }

  return <div className="flex items-center justify-center py-8">{spinner}</div>;
};

export default LoadingSpinner;
