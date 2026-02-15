import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const HEARTS = ["❤️", "💖", "💝", "💕", "💗"];

export function HeartRain() {
  const [hearts, setHearts] = useState<{ id: number; emoji: string; x: number }[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const id = Date.now();
      setHearts((prev) => [
        ...prev,
        {
          id,
          emoji: HEARTS[Math.floor(Math.random() * HEARTS.length)],
          x: Math.random() * 100, // percentage
        },
      ]);

      // Cleanup
      setTimeout(() => {
        setHearts((prev) => prev.filter((h) => h.id !== id));
      }, 4000);
    }, 800);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      <AnimatePresence>
        {hearts.map((heart) => (
          <motion.div
            key={heart.id}
            initial={{ y: "100vh", opacity: 0, scale: 0.5 }}
            animate={{ y: "-20vh", opacity: 1, scale: 1.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 4, ease: "easeOut" }}
            style={{ left: `${heart.x}%`, position: "absolute" }}
            className="text-2xl"
          >
            {heart.emoji}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
