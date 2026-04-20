import { motion as Motion } from "framer-motion";
import React from "react";

const AnimatedBackground = React.memo(({ isDark }) => {
  const floatingOrbs = [
    { id: 1, size: 300, duration: 25, delay: 0, x: "10%", y: "20%" },
    { id: 2, size: 250, duration: 30, delay: 8, x: "80%", y: "30%" },
  ];

  return (
    <div className="pointer-events-none fixed inset-0 -z-20 overflow-hidden will-change-transform">
      {/* Base gradient background - static */}
      <div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-br from-slate-950 via-purple-950/40 to-slate-950"
            : "bg-gradient-to-br from-slate-50 via-purple-100/30 to-slate-100"
        }`}
      />

      {/* Single animated gradient layer */}
      <Motion.div
        className={`absolute inset-0 ${
          isDark
            ? "bg-gradient-to-t from-purple-900/15 via-transparent to-transparent"
            : "bg-gradient-to-t from-purple-300/8 via-transparent to-transparent"
        }`}
        animate={{
          opacity: [0.4, 0.55, 0.4],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />

      {/* Reduced floating gradient orbs */}
      {floatingOrbs.map((orb) => (
        <Motion.div
          key={orb.id}
          className={`absolute rounded-full mix-blend-screen filter blur-3xl ${
            isDark
              ? "bg-gradient-to-br from-purple-500/25 to-pink-500/8"
              : "bg-gradient-to-br from-purple-400/15 to-pink-300/8"
          }`}
          style={{
            width: orb.size,
            height: orb.size,
            left: orb.x,
            top: orb.y,
            willChange: "transform",
          }}
          animate={{
            x: [0, 40, -40, 0],
            y: [0, 80, -80, 0],
            scale: [1, 1.15, 0.95, 1],
          }}
          transition={{
            duration: orb.duration,
            delay: orb.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      ))}
    </div>
  );
});

AnimatedBackground.displayName = "AnimatedBackground";

export default AnimatedBackground;
