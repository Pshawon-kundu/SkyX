import { useState } from "react";
import { Menu, MoonStar, Sun, X } from "lucide-react";
import {
  motion as Motion,
  AnimatePresence,
  useScroll,
  useSpring,
} from "framer-motion";

const navAnimation = {
  hidden: { opacity: 0, y: -12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.35 } },
};

function Navbar({ brand, links, activeSection, theme, onThemeToggle }) {
  const [isOpen, setIsOpen] = useState(false);
  const { scrollYProgress } = useScroll();
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 130,
    damping: 26,
    mass: 0.18,
  });

  const closeMenu = () => setIsOpen(false);
  const isDark = theme === "dark";

  const navLinkClass = (href) => {
    const isActive = activeSection === href.replace("#", "");

    return [
      "relative z-10 rounded-full px-3 py-1.5 text-sm font-medium transition",
      isActive
        ? isDark
          ? "text-cyan-100"
          : "text-cyan-700"
        : "text-slate-300 hover:text-cyan-300",
    ].join(" ");
  };

  return (
    <>
      <Motion.div
        aria-hidden="true"
        style={{ scaleX: smoothProgress }}
        className="pointer-events-none fixed left-0 top-0 z-[70] h-0.5 w-full origin-left bg-cyan-300 shadow-[0_0_14px_rgba(34,211,238,0.9)]"
      />
      <Motion.header
        variants={navAnimation}
        initial="hidden"
        animate="visible"
        className="sticky top-0 z-50 border-b border-cyan-500/20 bg-slate-950/85 backdrop-blur-xl"
      >
        <nav className="mx-auto flex h-20 w-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <a href="#home" className="group flex items-center gap-3">
            <span className="inline-flex h-9 w-9 items-center justify-center rounded-xl bg-cyan-400/10 text-sm font-bold text-cyan-300 ring-1 ring-cyan-400/40">
              {brand.ticker}
            </span>
            <span className="text-lg font-semibold tracking-wide text-white">
              {brand.name}
            </span>
          </a>

          <ul className="hidden items-center gap-4 lg:flex">
            {links.map((link) => (
              <li key={link.label} className="relative">
                {activeSection === link.href.replace("#", "") && (
                  <Motion.span
                    layoutId="active-nav-pill"
                    className="absolute inset-0 rounded-full border border-cyan-300/40 bg-cyan-400/15 shadow-[0_0_14px_rgba(34,211,238,0.35)]"
                    transition={{
                      type: "spring",
                      bounce: 0.22,
                      stiffness: 420,
                      damping: 32,
                    }}
                  />
                )}
                <a href={link.href} className={navLinkClass(link.href)}>
                  {link.label}
                </a>
              </li>
            ))}
          </ul>

          <div className="hidden items-center gap-3 lg:flex">
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-cyan-300/35 bg-cyan-400/10 text-cyan-200 transition hover:bg-cyan-300/20"
            >
              {isDark ? <Sun size={17} /> : <MoonStar size={17} />}
            </button>
            <a
              href="#apps"
              className="rounded-full bg-cyan-400 px-5 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
            >
              Launch App
            </a>
          </div>

          <div className="flex items-center gap-2 lg:hidden">
            <button
              type="button"
              onClick={onThemeToggle}
              aria-label={`Switch to ${isDark ? "light" : "dark"} mode`}
              className="inline-flex rounded-lg border border-cyan-400/30 p-2 text-cyan-300"
            >
              {isDark ? <Sun size={18} /> : <MoonStar size={18} />}
            </button>
            <button
              type="button"
              aria-label="Toggle menu"
              onClick={() => setIsOpen((value) => !value)}
              className="inline-flex rounded-lg border border-cyan-400/30 p-2 text-cyan-300"
            >
              {isOpen ? <X size={18} /> : <Menu size={18} />}
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
              className="max-h-[70vh] overflow-y-auto border-t border-cyan-500/20 bg-slate-950/95 px-4 py-4 lg:hidden"
            >
              <ul className="space-y-3">
                {links.map((link) => (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      onClick={closeMenu}
                      className={[
                        "block rounded-lg px-3 py-2 text-sm font-medium transition hover:bg-slate-900 hover:text-cyan-300",
                        activeSection === link.href.replace("#", "")
                          ? "bg-cyan-400/15 text-cyan-200 ring-1 ring-cyan-300/35"
                          : "text-slate-300",
                      ].join(" ")}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
              <a
                href="#apps"
                onClick={closeMenu}
                className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-cyan-400 px-4 py-2 text-sm font-semibold text-slate-950"
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
