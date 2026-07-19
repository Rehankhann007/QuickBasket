import { motion, AnimatePresence } from "framer-motion";

const COLORS = ["#f97316", "#fb923c", "#22c55e", "#3b82f6", "#eab308", "#ec4899"];

// Generates a fixed set of particles with random-ish but deterministic spread
const PARTICLES = Array.from({ length: 28 }).map((_, i) => {
  const angle = (i / 28) * Math.PI * 2;
  const distance = 120 + (i % 4) * 30;
  return {
    id: i,
    x: Math.cos(angle) * distance,
    y: Math.sin(angle) * distance - 40, // slight upward bias
    rotate: (i * 47) % 360,
    color: COLORS[i % COLORS.length],
    size: 6 + (i % 3) * 3,
    isSquare: i % 2 === 0,
  };
});

/**
 * Full-screen confetti burst. Mount conditionally with `show`.
 * Auto-invisible after ~1.2s via parent unmounting it (parent controls `show`).
 */
const ConfettiBurst = ({ show }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 pointer-events-none z-[200] flex items-center justify-center">
          {PARTICLES.map((p) => (
            <motion.div
              key={p.id}
              initial={{ x: 0, y: 0, opacity: 1, rotate: 0, scale: 0.6 }}
              animate={{
                x: p.x,
                y: p.y + 180, // gravity fall
                opacity: 0,
                rotate: p.rotate,
                scale: 1,
              }}
              transition={{ duration: 1.1, ease: "easeOut" }}
              style={{
                position: "absolute",
                width: p.size,
                height: p.size,
                backgroundColor: p.color,
                borderRadius: p.isSquare ? "2px" : "50%",
              }}
            />
          ))}
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfettiBurst;
