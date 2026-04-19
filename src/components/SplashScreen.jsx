import { motion as Motion } from "framer-motion";
import { useEffect, useState } from "react";

function SplashScreen({ onComplete }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsExiting(true);
      setTimeout(() => onComplete(), 600);
    }, 3200);
    return () => clearTimeout(timer);
  }, [onComplete]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
    exit: {
      opacity: 0,
      transition: { duration: 0.6 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
      },
    },
  };

  const logoVariants = {
    hidden: { opacity: 0, scale: 0.5 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        duration: 1,
        ease: [0.175, 0.885, 0.32, 1.275],
      },
    },
  };

  const orbitVariants = {
    animate: {
      rotate: 360,
      transition: {
        duration: 8,
        repeat: Infinity,
        ease: "linear",
      },
    },
  };

  const pulseVariants = {
    animate: {
      scale: [1, 1.2, 1],
      opacity: [0.5, 1, 0.5],
      transition: {
        duration: 2,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  return (
    <Motion.div
      variants={containerVariants}
      initial="hidden"
      animate={isExiting ? "exit" : "visible"}
      className="fixed inset-0 z-[9999] bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 flex items-center justify-center overflow-hidden"
    >
      {/* Animated Background Orbs */}
      <div className="absolute inset-0">
        <Motion.div
          className="absolute top-20 left-10 w-40 h-40 rounded-full bg-purple-500/20 blur-3xl"
          animate={{
            y: [0, -30, 0],
            opacity: [0.3, 0.6, 0.3],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <Motion.div
          className="absolute bottom-20 right-10 w-52 h-52 rounded-full bg-cyan-500/15 blur-3xl"
          animate={{
            x: [0, 40, 0],
            opacity: [0.2, 0.5, 0.2],
          }}
          transition={{
            duration: 5,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
      </div>

      {/* Main Content */}
      <Motion.div
        className="relative z-10 text-center max-w-2xl px-6"
        variants={containerVariants}
      >
        {/* Orbiting Ring Background */}
        <div className="relative w-48 h-48 sm:w-64 sm:h-64 mx-auto mb-8">
          {/* Outer Ring */}
          <Motion.div
            className="absolute inset-0 rounded-full border-2 border-purple-500/30"
            variants={orbitVariants}
            animate="animate"
          />

          {/* Middle Ring */}
          <Motion.div
            className="absolute inset-4 rounded-full border border-cyan-500/20"
            animate={{ rotate: -360 }}
            transition={{
              duration: 6,
              repeat: Infinity,
              ease: "linear",
            }}
          />

          {/* Inner Ring */}
          <Motion.div
            className="absolute inset-8 rounded-full border border-purple-400/10"
            variants={orbitVariants}
            animate="animate"
          />

          {/* Center Logo */}
          <Motion.div
            className="absolute inset-0 flex items-center justify-center"
            variants={logoVariants}
          >
            <div className="relative">
              {/* Glowing Background */}
              <Motion.div
                className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 to-cyan-500 blur-xl opacity-50"
                variants={pulseVariants}
                animate="animate"
              />

              {/* Logo Container */}
              <div className="relative bg-gradient-to-br from-slate-900 via-purple-900 to-slate-950 rounded-full w-32 h-32 sm:w-40 sm:h-40 flex items-center justify-center border border-purple-500/30 backdrop-blur-sm">
                <span className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300">
                  ✨
                </span>
              </div>
            </div>
          </Motion.div>
        </div>

        {/* Brand Name */}
        <Motion.h1
          variants={itemVariants}
          className="text-5xl sm:text-7xl font-black mb-4 text-white"
        >
          SkyX
        </Motion.h1>

        {/* Tagline */}
        <Motion.p
          variants={itemVariants}
          className="text-lg sm:text-xl font-medium text-purple-200 mb-2"
        >
          Build, Play, and Earn
        </Motion.p>

        {/* Subtitle */}
        <Motion.p
          variants={itemVariants}
          className="text-sm sm:text-base text-slate-400 max-w-md mx-auto mb-12"
        >
          A Next-Gen Gaming Ecosystem
        </Motion.p>

        {/* Loading Indicator */}
        <Motion.div variants={itemVariants} className="flex justify-center gap-2">
          {[0, 1, 2].map((index) => (
            <Motion.div
              key={index}
              className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400"
              animate={{
                scale: [1, 1.5, 1],
                opacity: [0.5, 1, 0.5],
              }}
              transition={{
                duration: 1.5,
                delay: index * 0.2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          ))}
        </Motion.div>

        {/* Loading Text */}
        <Motion.p
          variants={itemVariants}
          className="text-xs text-slate-500 mt-6"
        >
          Initializing ecosystem...
        </Motion.p>
      </Motion.div>

      {/* Corner Accents */}
      <Motion.div
        className="absolute top-10 right-10 w-20 h-20 border border-purple-500/20 rounded-lg"
        animate={{
          rotate: [0, 90, 180, 270, 360],
          borderColor: ["rgba(168, 85, 247, 0.2)", "rgba(236, 72, 153, 0.3)", "rgba(168, 85, 247, 0.2)"],
        }}
        transition={{
          duration: 8,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <Motion.div
        className="absolute bottom-10 left-10 w-16 h-16 border-2 border-cyan-500/15 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
    </Motion.div>
  );
}

export default SplashScreen;
