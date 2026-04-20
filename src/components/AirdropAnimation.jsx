import { useEffect, useState } from "react";
import { motion as Motion, AnimatePresence } from "framer-motion";

function AirdropAnimation() {
  const [dataStreams, setDataStreams] = useState([]);
  const [tokens, setTokens] = useState([]);
  const [glitchEffects, setGlitchEffects] = useState([]);
  const [clickedTokens, setClickedTokens] = useState(new Set());

  const tokenTypes = [
    {
      symbol: "SKYX",
      color: "from-cyan-400 to-blue-600",
      textColor: "text-cyan-100",
      glow: "shadow-cyan-400/60",
      streamColor: "border-cyan-400",
    },
    {
      symbol: "⚡",
      color: "from-yellow-400 to-orange-600",
      textColor: "text-yellow-100",
      glow: "shadow-yellow-400/60",
      streamColor: "border-yellow-400",
    },
    {
      symbol: "🎮",
      color: "from-pink-400 to-purple-600",
      textColor: "text-pink-100",
      glow: "shadow-pink-400/60",
      streamColor: "border-pink-400",
    },
    {
      symbol: "🚀",
      color: "from-green-400 to-emerald-600",
      textColor: "text-green-100",
      glow: "shadow-green-400/60",
      streamColor: "border-green-400",
    },
    {
      symbol: "💎",
      color: "from-violet-400 to-purple-600",
      textColor: "text-violet-100",
      glow: "shadow-violet-400/60",
      streamColor: "border-violet-400",
    },
    {
      symbol: "🔥",
      color: "from-red-400 to-orange-600",
      textColor: "text-red-100",
      glow: "shadow-red-400/60",
      streamColor: "border-red-400",
    },
  ];

  const matrixChars =
    "01アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲンABCDEFGHIJKLMNOPQRSTUVWXYZ";

  const createDataStream = () => {
    const streamId = Date.now() + Math.random();
    const startX = Math.random() * 100;
    const speed = 2 + Math.random() * 3;
    const length = 15 + Math.floor(Math.random() * 20);

    const stream = {
      id: streamId,
      x: startX,
      chars: Array.from(
        { length },
        () => matrixChars[Math.floor(Math.random() * matrixChars.length)],
      ),
      speed,
      opacity: 0.3 + Math.random() * 0.7,
    };

    setDataStreams((prev) => [...prev, stream]);

    // Remove stream after animation
    setTimeout(() => {
      setDataStreams((prev) => prev.filter((s) => s.id !== streamId));
    }, 3000);
  };

  const deployToken = () => {
    const tokenType = tokenTypes[Math.floor(Math.random() * tokenTypes.length)];
    const tokenId = Date.now() + Math.random();
    const streamX = Math.random() * 100;

    // Create data stream first
    const stream = {
      id: tokenId + "_stream",
      x: streamX,
      chars: Array.from(
        { length: 12 },
        () => matrixChars[Math.floor(Math.random() * matrixChars.length)],
      ),
      speed: 3,
      opacity: 0.8,
    };

    setDataStreams((prev) => [...prev, stream]);

    // Deploy token after stream builds up
    setTimeout(() => {
      const token = {
        id: tokenId,
        type: tokenType,
        x: streamX,
        y: -50,
        vx: (Math.random() - 0.5) * 2,
        vy: 1 + Math.random() * 2,
      };

      setTokens((prev) => [...prev, token]);

      // Create glitch effect
      createGlitchEffect(streamX, 50);

      // Remove stream and token
      setTimeout(() => {
        setDataStreams((prev) => prev.filter((s) => s.id !== stream.id));
        setTokens((prev) => prev.filter((t) => t.id !== tokenId));
      }, 4000);
    }, 800);
  };

  const createGlitchEffect = (x, y) => {
    const glitchId = Date.now() + Math.random();
    const glitch = {
      id: glitchId,
      x,
      y,
      intensity: 0.5 + Math.random() * 0.5,
    };

    setGlitchEffects((prev) => [...prev, glitch]);

    setTimeout(() => {
      setGlitchEffects((prev) => prev.filter((g) => g.id !== glitchId));
    }, 300);
  };

  const createParticleExplosion = (x, y, color) => {
    const particles = [];
    for (let i = 0; i < 15; i++) {
      particles.push({
        id: Date.now() + Math.random(),
        x: x + (Math.random() - 0.5) * 50,
        y: y + (Math.random() - 0.5) * 50,
        vx: (Math.random() - 0.5) * 8,
        vy: (Math.random() - 0.5) * 8,
        color,
        life: 1,
      });
    }

    // Add particles to existing particles state
    setGlitchEffects((prev) => [
      ...prev,
      ...particles.map((p) => ({ ...p, type: "particle" })),
    ]);

    setTimeout(() => {
      setGlitchEffects((prev) =>
        prev.filter((g) => !particles.find((p) => p.id === g.id)),
      );
    }, 800);
  };

  const handleTokenClick = (tokenId, event, tokenType) => {
    event.stopPropagation();
    setClickedTokens((prev) => new Set([...prev, tokenId]));

    const rect = event.currentTarget.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    createParticleExplosion(
      centerX,
      centerY,
      tokenType.color.split(" ")[0].replace("from-", ""),
    );
    createGlitchEffect(centerX, centerY);

    setTimeout(() => {
      setClickedTokens((prev) => {
        const newSet = new Set(prev);
        newSet.delete(tokenId);
        return newSet;
      });
    }, 800);
  };

  useEffect(() => {
    // Create continuous data streams
    const streamInterval = setInterval(createDataStream, 800);

    // Deploy tokens periodically
    const tokenInterval = setInterval(deployToken, 3500 + Math.random() * 2000);

    // Initial setup
    setTimeout(createDataStream, 500);
    setTimeout(deployToken, 1500);

    return () => {
      clearInterval(streamInterval);
      clearInterval(tokenInterval);
    };
  }, []);

  return (
    <>
      {/* Data Streams Background */}
      <div className="absolute inset-0 overflow-hidden opacity-20">
        {dataStreams.map((stream) => (
          <Motion.div
            key={stream.id}
            className="absolute font-mono text-green-400 text-xs leading-none"
            style={{ left: `${stream.x}%`, top: "0%" }}
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: "120vh",
              opacity: [0, stream.opacity, stream.opacity, 0],
            }}
            transition={{
              duration: 3 / stream.speed,
              ease: "linear",
            }}
          >
            {stream.chars.map((char, index) => (
              <Motion.div
                key={index}
                className="text-green-300"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  color: ["#00ff00", "#00ff88", "#00ff00"],
                }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1,
                  repeat: Number.POSITIVE_INFINITY,
                }}
              >
                {char}
              </Motion.div>
            ))}
          </Motion.div>
        ))}
      </div>

      {/* Glitch Effects */}
      <AnimatePresence>
        {glitchEffects.map((effect) => (
          <Motion.div
            key={effect.id}
            className="absolute pointer-events-none"
            style={{ left: effect.x, top: effect.y }}
            initial={{ scale: 0, opacity: 1 }}
            animate={{
              scale: effect.intensity * 3,
              opacity: 0,
              rotate: [0, 5, -5, 0],
            }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {effect.type === "particle" ? (
              <div className={`w-1 h-1 rounded-full bg-${effect.color}-400`} />
            ) : (
              <div className="w-16 h-16 border-2 border-cyan-400 rounded-lg opacity-50 animate-pulse" />
            )}
          </Motion.div>
        ))}
      </AnimatePresence>

      {/* Cyberpunk Portal Rings */}
      <div className="absolute inset-0 overflow-hidden">
        {Array.from({ length: 3 }, (_, i) => (
          <Motion.div
            key={`portal-${i}`}
            className="absolute border-2 border-cyan-400/30 rounded-full"
            style={{
              left: `${20 + i * 25}%`,
              top: `${30 + i * 15}%`,
              width: "80px",
              height: "80px",
            }}
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.2, 0.5, 0.2],
              borderColor: [
                "rgba(34, 211, 238, 0.3)",
                "rgba(34, 211, 238, 0.6)",
                "rgba(34, 211, 238, 0.3)",
              ],
            }}
            transition={{
              duration: 3,
              repeat: Number.POSITIVE_INFINITY,
              delay: i * 0.8,
            }}
          />
        ))}
      </div>

      {/* Falling Tokens */}
      <div className="absolute inset-0 overflow-hidden">
        {tokens.map((token) => {
          const isClicked = clickedTokens.has(token.id);

          return (
            <Motion.div
              key={token.id}
              className="absolute cursor-pointer z-10"
              style={{ left: `${token.x}%`, top: `${token.y}px` }}
              animate={{
                x: token.vx * 100,
                y: token.vy * 100,
                rotate: [0, 360],
                scale: isClicked ? [1, 1.5, 0.8, 1] : [0.8, 1.2, 1],
              }}
              transition={{
                duration: 4,
                ease: "easeOut",
                rotate: {
                  duration: 2,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                },
                scale: isClicked
                  ? { duration: 0.8 }
                  : { duration: 1.5, repeat: Number.POSITIVE_INFINITY },
              }}
            >
              {/* Token Container with Glow */}
              <Motion.div
                className={`relative w-8 h-8 bg-linear-to-br ${token.type.color} rounded-lg border-2 border-white shadow-2xl ${token.type.glow} overflow-hidden`}
                animate={{
                  boxShadow: isClicked
                    ? [
                        "0 0 20px rgba(168,85,247,0.5)",
                        "0 0 40px rgba(168,85,247,0.9)",
                        "0 0 20px rgba(168,85,247,0.5)",
                      ]
                    : `0 0 20px rgba(168,85,247,0.4)`,
                }}
                transition={{ duration: 0.3 }}
                onClick={(e) => handleTokenClick(token.id, e, token.type)}
                whileHover={{ scale: 1.15 }}
                whileTap={{ scale: 0.9 }}
              >
                {/* Digital Circuit Pattern */}
                <div className="absolute inset-0 opacity-30">
                  <div className="absolute top-1 left-1 w-1 h-1 bg-white rounded-full animate-pulse"></div>
                  <div
                    className="absolute top-1 right-1 w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="absolute bottom-1 left-1 w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                  <div
                    className="absolute bottom-1 right-1 w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0.6s" }}
                  ></div>
                  <div
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-2 h-0.5 bg-white rounded-full animate-pulse"
                    style={{ animationDelay: "0.8s" }}
                  ></div>
                </div>

                {/* Token Symbol */}
                <div
                  className={`absolute inset-0 flex items-center justify-center text-lg font-bold ${token.type.textColor} drop-shadow-lg`}
                >
                  {token.type.symbol}
                </div>

                {/* Data Stream Trail */}
                <Motion.div
                  className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-1 h-4 bg-linear-to-b from-transparent to-cyan-400 rounded-full"
                  animate={{
                    opacity: [0, 1, 0],
                    scaleY: [0, 1, 0],
                  }}
                  transition={{
                    duration: 1,
                    repeat: Number.POSITIVE_INFINITY,
                  }}
                />

                {/* Glitch Lines */}
                <Motion.div
                  className="absolute inset-0 border border-cyan-300/50 rounded-lg"
                  animate={{
                    opacity: [0, 0.5, 0],
                    scale: [1, 1.05, 1],
                  }}
                  transition={{
                    duration: 0.3,
                    repeat: Number.POSITIVE_INFINITY,
                    delay: Math.random(),
                  }}
                />
              </Motion.div>

              {/* Click Feedback Effect */}
              <AnimatePresence>
                {isClicked && (
                  <Motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0, opacity: 1 }}
                    animate={{ scale: 4, opacity: 0 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 1 }}
                  >
                    <div className="w-16 h-16 border-3 border-cyan-400 rounded-full animate-ping"></div>
                  </Motion.div>
                )}
              </AnimatePresence>
            </Motion.div>
          );
        })}
      </div>

      {/* Floating Data Fragments */}
      <div className="absolute inset-0 overflow-hidden opacity-10">
        {Array.from({ length: 20 }, (_, i) => (
          <Motion.div
            key={`fragment-${i}`}
            className="absolute text-cyan-400 font-mono text-xs"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              opacity: [0.2, 0.8, 0.2],
              x: [0, Math.random() * 10 - 5, 0],
            }}
            transition={{
              duration: 3 + Math.random() * 2,
              repeat: Number.POSITIVE_INFINITY,
              delay: Math.random() * 2,
            }}
          >
            {matrixChars[Math.floor(Math.random() * matrixChars.length)]}
          </Motion.div>
        ))}
      </div>
    </>
  );
}

export default AirdropAnimation;
