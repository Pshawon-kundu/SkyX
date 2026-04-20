import { useEffect, useState, useRef, useCallback } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

function AirdropAnimation() {
  const [tokens, setTokens] = useState([]);
  const [particles, setParticles] = useState([]);
  const containerRef = useRef(null);
  const intervalRef = useRef(null);

  const tokenTypes = [
    {
      symbol: "SKYX",
      color: "from-purple-500 to-cyan-500",
      textColor: "text-purple-300",
      glow: "shadow-purple-500/50",
    },
    {
      symbol: "✨",
      color: "from-cyan-400 to-blue-500",
      textColor: "text-cyan-300",
      glow: "shadow-cyan-400/50",
    },
  ];

  const deployToken = useCallback(() => {
    if (!containerRef.current) return;

    const tokenType = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
    const tokenId = Date.now() + Math.random();
    const startX = Math.random() * (containerRef.current?.offsetWidth || 100);

    const token = {
      id: tokenId,
      symbol: tokenType.symbol,
      startX,
      color: tokenType.color,
      textColor: tokenType.textColor,
      glow: tokenType.glow,
    };

    setTokens((prev) => [...prev, token]);

    const timeout = setTimeout(() => {
      setTokens((prev) => prev.filter((t) => t.id !== tokenId));
    }, 2500);

    return () => clearTimeout(timeout);
  }, []);

  const createParticleExplosion = useCallback((x, y) => {
    const particleCount = 8;
    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: Date.now() + i,
      x,
      y,
      vx: (Math.random() - 0.5) * 6,
      vy: (Math.random() - 0.5) * 6,
    }));

    setParticles((prev) => [...prev, ...newParticles]);

    const timeout = setTimeout(() => {
      setParticles((prev) =>
        prev.filter((p) => !newParticles.find((np) => np.id === p.id)),
      );
    }, 600);

    return () => clearTimeout(timeout);
  }, []);

  const handleTokenClick = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      createParticleExplosion(
        rect.left + rect.width / 2,
        rect.top + rect.height / 2,
      );
      setTokens((prev) =>
        prev.filter((t) => t.id !== e.currentTarget.dataset.id),
      );
    },
    [createParticleExplosion],
  );

  useEffect(() => {
    intervalRef.current = setInterval(deployToken, 4000);
    const initialTimeout = setTimeout(deployToken, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
      clearTimeout(initialTimeout);
    };
  }, [deployToken]);

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
    >
      <AnimatePresence>
        {tokens.map((token) => (
          <Motion.button
            key={token.id}
            data-id={token.id}
            onClick={handleTokenClick}
            className={`absolute pointer-events-auto px-4 py-2 rounded-lg font-bold text-sm backdrop-blur-sm border border-purple-500/30 hover:border-purple-500/60 transition-colors ${token.textColor} bg-gradient-to-br ${token.color} bg-opacity-10 shadow-lg ${token.glow} cursor-pointer`}
            style={{ left: token.startX }}
            initial={{ y: -40, opacity: 0, scale: 0.8 }}
            animate={{ y: "100vh", opacity: [0, 1, 1, 0] }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 2.5,
              ease: "linear",
              opacity: { duration: 2.5, times: [0, 0.1, 0.9, 1] },
            }}
          >
            {token.symbol}
          </Motion.button>
        ))}
      </AnimatePresence>

      <AnimatePresence>
        {particles.map((particle) => (
          <Motion.div
            key={particle.id}
            className="absolute w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-cyan-400 pointer-events-none"
            style={{ left: particle.x, top: particle.y }}
            animate={{
              x: particle.vx * 40,
              y: particle.vy * 40,
              opacity: [1, 0],
              scale: [1, 0],
            }}
            transition={{ duration: 0.6, ease: "easeOut" }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
}

export default AirdropAnimation;
