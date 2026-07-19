import { FiHeart } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="text-center py-8 text-xs text-gray-400">
      <p className="flex items-center justify-center gap-1.5">
        Made with <FiHeart className="text-orange-400" size={12} /> by QuickBasket
      </p>
      <p className="mt-1">Fresh groceries, delivered fast • v1.0.0</p>
    </footer>
  );
};

export default Footer;
