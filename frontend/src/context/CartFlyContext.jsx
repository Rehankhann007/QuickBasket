import { createContext, useContext, useRef, useState, useCallback } from "react";

const CartFlyContext = createContext(null);

let flyIdCounter = 0;

export const CartFlyProvider = ({ children }) => {
  // Two refs because the cart icon renders twice (mobile bottom nav + desktop side nav),
  // only one of which is visible at a time depending on screen size.
  const cartIconRefMobile = useRef(null);
  const cartIconRefDesktop = useRef(null);
  const [flyingItems, setFlyingItems] = useState([]);

  const getVisibleCartIcon = () => {
    const candidates = [cartIconRefMobile.current, cartIconRefDesktop.current];
    return candidates.find((el) => el && el.offsetParent !== null) || null;
  };

  // Call this with the DOM element that was clicked (e.g. the "Add" button or product image)
  // and an image URL to show flying towards the cart icon.
  const flyToCart = useCallback((sourceEl, imageUrl) => {
    const cartEl = getVisibleCartIcon();
    if (!sourceEl || !cartEl) return;

    const sourceRect = sourceEl.getBoundingClientRect();
    const cartRect = cartEl.getBoundingClientRect();

    const id = ++flyIdCounter;

    const item = {
      id,
      imageUrl,
      startX: sourceRect.left + sourceRect.width / 2,
      startY: sourceRect.top + sourceRect.height / 2,
      endX: cartRect.left + cartRect.width / 2,
      endY: cartRect.top + cartRect.height / 2,
    };

    setFlyingItems((prev) => [...prev, item]);

    // Clean up after animation finishes
    setTimeout(() => {
      setFlyingItems((prev) => prev.filter((i) => i.id !== id));
    }, 700);
  }, []);

  return (
    <CartFlyContext.Provider
      value={{ cartIconRefMobile, cartIconRefDesktop, flyToCart, flyingItems }}
    >
      {children}
    </CartFlyContext.Provider>
  );
};

export const useCartFly = () => useContext(CartFlyContext);
