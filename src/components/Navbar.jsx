import { useState } from "react";
import { Menu, MoonStar, Sun, X as XIcon } from "lucide-react";
import {
  motion as Motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion";

// Custom SKYX X-type Logo Component
function SkyXLogo({ isDark }) {
  return (
    <div className="relative inline-flex h-9 w-9 items-center justify-center">
      {/* Outer rotating ring */}
      <Motion.div
        className={`absolute inset-0 rounded-lg border-2 border-transparent bg-linear-to-r ${
          isDark
            ? "from-purple-400 via-pink-400 to-purple-400"
            : "from-purple-600 via-pink-500 to-purple-600"
        } bg-clip-border`}
        animate={{ rotate: 360 }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Inner glow */}
      <div
        className={`absolute inset-1 rounded-lg backdrop-blur-sm ${
          isDark
            ? "bg-linear-to-br from-purple-500/20 to-pink-500/10"
            : "bg-linear-to-br from-purple-500/30 to-pink-500/20"
        }`}
      />

      {/* X Letter */}
      <svg
        className={`relative z-10 h-6 w-6 drop-shadow-lg ${
          isDark ? "text-white" : "text-purple-900"
        }`}
        viewBox="0 0 24 24"
        fill="currentColor"
      >
        {/* Diagonal lines forming X */}
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
}

const navAnimation = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function Navbar({
  brand,
  links,
  activeSection,
  theme,
  onThemeToggle,
  onSectionClick,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 200,
    damping: 16,
    mass: 0.1,
  });

  const closeMenu = () => setIsOpen(false);
  const isDark = theme === "dark";

  const handleNavClick = (href) => {
    const sectionId = href.replace("#", "");
    onSectionClick?.(sectionId);

    // Smooth scroll to section
    const element = document.getElementById(sectionId);
    if (element) {
      setTimeout(() => {
        element.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 0);
    }
  };

  const navLinkClass = (href) => {
    const isActive = activeSection === href.replace("#", "");

    return [
      "relative z-10 rounded-full px-3 py-1.5 text-sm font-medium transition",
      isActive
        ? isDark
          ? "text-cyan-100"
          : "text-purple-700"
        : isDark
          ? "text-slate-300 hover:text-cyan-300"
          : "text-slate-600 hover:text-purple-600",
    ].join(" ");
  };

  return (
    <>
      <Motion.div
        aria-hidden="true"
        style={{ scaleX: smoothProgress }}
        className={`pointer-events-none fixed left-0 top-0 z-40 h-0.5 w-full origin-left ${
          isDark
            ? "bg-purple-300 shadow-[0_0_14px_rgba(168,85,247,0.9)]"
            : "bg-purple-500 shadow-[0_0_14px_rgba(139,69,193,0.7)]"
        }`}
      />
      <Motion.header
        variants={navAnimation}
        initial="hidden"
        animate="visible"
        className={`fixed top-0 left-0 right-0 z-50 w-full border-b backdrop-blur-xl ${
          isDark
            ? "border-purple-500/20 bg-slate-950/95"
            : "border-purple-200/40 bg-white/95"
        }`}
      >
        <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#home" className="group flex items-center gap-3">
            <SkyXLogo isDark={isDark} />
            <span
              className={`text-lg font-semibold tracking-wide ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {brand.name}
            </span>
          </a>

          <ul className="hidden items-center gap-4 lg:flex">
            {links.map((link) => (
              <li key={link.label} className="relative">
                {activeSection === link.href.replace("#", "") && (
                  <Motion.span
                    layoutId="active-nav-pill"
                    className={`absolute inset-0 rounded-full border shadow-[0_0_14px_rgba(168,85,247,0.35)] ${
                      isDark
                        ? "border-purple-300/40 bg-purple-400/15"
                        : "border-purple-400/60 bg-purple-200/30"
                    }`}
                    transition={{
                      type: "spring",
                      bounce: 0.22,
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}
                <button
                  onClick={() => handleNavClick(link.href)}
                  className={navLinkClass(link.href)}
                  type="button"
                >
                  {link.label}
                </button>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={`inline-flex h-10 w-10 items-center justify-center rounded-full border transition ${
                isDark
                  ? "border-purple-300/35 bg-purple-400/10 text-purple-200 hover:bg-purple-300/20"
                  : "border-purple-400/40 bg-purple-200/20 text-purple-700 hover:bg-purple-300/30"
              }`}
            >
              {isDark ? <Sun size={17} /> : <MoonStar size={17} />}
            </button>
            <a
              href="#apps"
              className={`rounded-full px-5 py-2 text-sm font-semibold transition ${
                isDark
                  ? "bg-purple-400 text-slate-950 hover:bg-purple-300"
                  : "bg-purple-600 text-white hover:bg-purple-700"
              }`}
            >
              Launch App
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className={`inline-flex rounded-lg border p-2 ${
                isDark
                  ? "border-purple-400/30 text-purple-300"
                  : "border-purple-400/40 text-purple-700"
              }`}
            >
              {isDark ? <Sun size={18} /> : <MoonStar size={18} />}
            </button>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setIsOpen((value) => !value)}
              className={`inline-flex rounded-lg border p-2 ${
                isDark
                  ? "border-purple-400/30 text-purple-300"
                  : "border-purple-400/40 text-purple-700"
              }`}
            >
              {isOpen ? <XIcon size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </nav>

        <AnimatePresence>
          {isOpen && (
            <Motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              className={`max-h-[70vh] overflow-y-auto border-t px-4 py-4 lg:hidden ${
                isDark
                  ? "border-purple-500/20 bg-slate-950/95"
                  : "border-purple-200/40 bg-white/90"
              }`}
            >
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <button
                      onClick={() => {
                        handleNavClick(link.href);
                        closeMenu();
                      }}
                      type="button"
                      className={[
                        "block w-full text-left rounded-lg px-3 py-2 text-sm font-medium transition",
                        activeSection === link.href.replace("#", "")
                          ? isDark
                            ? "bg-purple-400/15 text-purple-200 ring-1 ring-purple-300/35"
                            : "bg-purple-200/40 text-purple-700 ring-1 ring-purple-400/50"
                          : isDark
                            ? "text-slate-300 hover:bg-slate-900 hover:text-cyan-300"
                            : "text-slate-600 hover:bg-purple-100 hover:text-purple-700",
                      ].join(" ")}
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
              <a
                href="#apps"
                onClick={closeMenu}
                className={`mt-4 inline-flex w-full items-center justify-center rounded-full px-4 py-2 text-sm font-semibold ${
                  isDark
                    ? "bg-purple-400 text-slate-950"
                    : "bg-purple-600 text-white"
                }`}
              >
                Launch App
              </a>
            </Motion.div>
          )}
        </AnimatePresence>
      </Motion.header>
    </>
  );
}

export default Navbar;
