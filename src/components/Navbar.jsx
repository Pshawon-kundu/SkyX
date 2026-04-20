import { useState, useCallback, memo } from "react";
import { Menu, MoonStar, Sun, X as XIcon, Zap } from "lucide-react";
import {
  motion as Motion,
  AnimatePresence,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";

// Bitcoin-inspired Logo with crypto vibes
const SkyXLogo = memo(function SkyXLogo({ isDark }) {
  return (
    <div className="relative inline-flex h-9 w-9 items-center justify-center">
      {/* Outer rotating ring with Bitcoin orange accent */}
      <Motion.div
        className={`absolute inset-0 rounded-lg border-2 border-transparent bg-gradient-to-r ${
          isDark
            ? "from-amber-500 via-orange-400 to-amber-500"
            : "from-amber-600 via-orange-500 to-amber-600"
        } bg-clip-border`}
        animate={{ rotate: 360 }}
        transition={{ duration: 25, repeat: Infinity, ease: "linear" }}
        style={{ willChange: "transform" }}
      />

      {/* Inner glow - Bitcoin orange */}
      <div
        className={`absolute inset-1 rounded-lg backdrop-blur-sm ${
          isDark
            ? "bg-gradient-to-br from-amber-500/20 to-orange-500/10"
            : "bg-gradient-to-br from-amber-500/30 to-orange-500/20"
        }`}
      />

      {/* X Letter */}
      <svg
        className={`relative z-10 h-6 w-6 drop-shadow-lg ${
          isDark ? "text-white" : "text-amber-900"
        }`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        <path
          d="M 4 4 L 20 20 M 20 4 L 4 20"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
        />
        <circle cx="12" cy="12" r="2" fill="currentColor" />
      </svg>
    </div>
  );
});

const navAnimation = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function Navbar({
  brand,
  links,
  activeSection,
  onNavClick,
  theme,
  onThemeToggle,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();

  // Smoother spring animation with better damping
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 180,
    damping: 20,
    mass: 0.1,
    velocity: 0,
  });

  const closeMenu = useCallback(() => setIsOpen(false), []);
  const isDark = theme === "dark";

  const handleNavLinkClick = useCallback(
    (href) => {
      const sectionId = href.replace("#", "");
      onNavClick?.(sectionId);
      closeMenu();
    },
    [onNavClick, closeMenu],
  );

  const navLinkClass = (href) => {
    const isActive = activeSection === href.replace("#", "");
    return [
      "relative z-10 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200",
      isActive
        ? isDark
          ? "text-amber-200 font-semibold"
          : "text-amber-700 font-semibold"
        : isDark
          ? "text-slate-300 hover:text-amber-300"
          : "text-slate-600 hover:text-amber-600",
    ].join(" ");
  };

  return (
    <>
      {/* Scroll progress bar - Bitcoin orange */}
      <Motion.div
        aria-hidden="true"
        style={{ scaleX: smoothProgress }}
        className={`pointer-events-none fixed left-0 top-0 z-40 h-0.5 w-full origin-left ${
          isDark
            ? "bg-gradient-to-r from-amber-400 to-orange-500 shadow-[0_0_16px_rgba(217,119,6,0.9)]"
            : "bg-gradient-to-r from-amber-500 to-orange-600 shadow-[0_0_16px_rgba(180,83,9,0.7)]"
        }`}
      />

      <Motion.header
        variants={navAnimation}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-50 w-full border-b backdrop-blur-2xl transition-colors duration-300 ${
          isDark
            ? "border-amber-500/15 bg-slate-950/98"
            : "border-amber-200/40 bg-white/98"
        }`}
      >
        <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          {/* Brand */}
          <a
            href="#home"
            className="group flex items-center gap-3 transition-transform duration-200 hover:scale-105"
          >
            <SkyXLogo isDark={isDark} />
            <div className="flex flex-col">
              <span
                className={`text-lg font-bold tracking-tight ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                {brand.name}
              </span>
              <span
                className={`text-xs font-semibold ${isDark ? "text-amber-400" : "text-amber-600"}`}
              >
                {brand.ticker}
              </span>
            </div>
          </a>

          {/* Desktop Navigation */}
          <ul className="hidden items-center gap-2 lg:flex">
            {links.map((link) => (
              <li key={link.label} className="relative">
                {activeSection === link.href.replace("#", "") && (
                  <Motion.span
                    layoutId="active-nav-pill"
                    className={`absolute inset-0 rounded-full border-2 ${
                      isDark
                        ? "border-amber-400/50 bg-gradient-to-r from-amber-500/20 to-orange-400/10 shadow-[inset_0_0_8px_rgba(251,146,60,0.3)]"
                        : "border-amber-500/60 bg-gradient-to-r from-amber-300/30 to-orange-200/20 shadow-[inset_0_0_8px_rgba(217,119,6,0.2)]"
                    }`}
                    transition={{
                      type: "spring",
                      bounce: 0.25,
                      stiffness: 400,
                      damping: 30,
                    }}
                  />
                )}
                <a
                  href={link.href}
                  className={navLinkClass(link.href)}
                  onClick={(e) => {
                    e.preventDefault();
                    handleNavLinkClick(link.href);
                  }}
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition-all duration-200 hover:scale-110 ${
                isDark
                  ? "border-amber-400/30 bg-amber-500/10 text-amber-300 hover:bg-amber-500/20 hover:border-amber-400/60"
                  : "border-amber-500/40 bg-amber-200/20 text-amber-700 hover:bg-amber-300/30 hover:border-amber-500/60"
              }`}
            >
              {isDark ? <Sun size={17} /> : <MoonStar size={17} />}
            </button>
            <Motion.a
              href="#apps"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`rounded-full px-5 py-2 text-sm font-semibold transition-all duration-200 flex items-center gap-1.5 ${
                isDark
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950 hover:shadow-[0_0_20px_rgba(217,119,6,0.5)]"
                  : "bg-gradient-to-r from-amber-600 to-orange-600 text-white hover:shadow-[0_0_20px_rgba(180,83,9,0.4)]"
              }`}
            >
              <Zap size={15} />
              Launch App
            </Motion.a>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={`inline-flex rounded-lg border p-2 transition-all duration-200 ${
                isDark
                  ? "border-amber-400/30 text-amber-300 hover:bg-amber-500/10"
                  : "border-amber-500/40 text-amber-700 hover:bg-amber-200/20"
              }`}
            >
              {isDark ? <Sun size={18} /> : <MoonStar size={18} />}
            </button>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setIsOpen((value) => !value)}
              className={`inline-flex rounded-lg border p-2 transition-all duration-200 ${
                isDark
                  ? "border-amber-400/30 text-amber-300 hover:bg-amber-500/10"
                  : "border-amber-500/40 text-amber-700 hover:bg-amber-200/20"
              }`}
            >
              {isOpen ? <XIcon size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isOpen && (
            <Motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: "auto" }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              transition={{ duration: 0.2 }}
              className={`border-t lg:hidden ${
                isDark
                  ? "border-amber-500/15 bg-slate-950/95"
                  : "border-amber-200/40 bg-white/90"
              }`}
            >
              <div className="px-4 py-4 max-h-[60vh] overflow-y-auto">
                <ul className="space-y-2">
                  {links.map((link) => (
                    <li key={link.label}>
                      <a
                        href={link.href}
                        onClick={(e) => {
                          e.preventDefault();
                          handleNavLinkClick(link.href);
                        }}
                        className={[
                          "block rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                          activeSection === link.href.replace("#", "")
                            ? isDark
                              ? "bg-gradient-to-r from-amber-500/20 to-orange-400/10 text-amber-200 border-l-2 border-amber-400"
                              : "bg-gradient-to-r from-amber-300/30 to-orange-200/20 text-amber-700 border-l-2 border-amber-600"
                            : isDark
                              ? "text-slate-300 hover:bg-slate-800 hover:text-amber-300"
                              : "text-slate-600 hover:bg-amber-50 hover:text-amber-700",
                        ].join(" ")}
                      >
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
                <Motion.a
                  href="#apps"
                  onClick={closeMenu}
                  whileHover={{ scale: 1.02 }}
                  className={`mt-4 block text-center rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-200 ${
                    isDark
                      ? "bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950"
                      : "bg-gradient-to-r from-amber-600 to-orange-600 text-white"
                  }`}
                >
                  Launch App
                </Motion.a>
              </div>
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.header>
    </>
  );
}

export default memo(Navbar);
