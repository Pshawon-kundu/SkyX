import { motion as Motion } from "framer-motion";
import { animations } from "../data/animations";

function Footer({ brand, links, isDark = true }) {
  return (
    <footer
      className={`border-t py-12 ${
        isDark
          ? "border-slate-800 bg-slate-950"
          : "border-purple-200/40 bg-white"
      }`}
    >
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={animations.viewport}
          transition={{ duration: 0.5 }}
          className="lg:col-span-2"
        >
          <Motion.p
            className={`text-lg font-semibold ${
              isDark ? "text-white" : "text-slate-900"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={animations.viewport}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {brand.name}
          </Motion.p>
          <Motion.p
            className={`mt-2 text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={animations.viewport}
            transition={{ duration: 0.4, delay: 0.2 }}
          >
            Ticker: {brand.ticker}
          </Motion.p>
          <Motion.p
            className={`mt-4 max-w-md text-sm leading-relaxed ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={animations.viewport}
            transition={{ duration: 0.4, delay: 0.3 }}
          >
            Ultimate gaming platform connecting players worldwide with seamless
            matchmaking and competitive arenas.
          </Motion.p>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={animations.viewport}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Motion.p
            className={`text-sm font-semibold uppercase tracking-wider ${
              isDark ? "text-purple-300" : "text-purple-600"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={animations.viewport}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Quick Links
          </Motion.p>
          <Motion.ul
            variants={animations.staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={animations.viewport}
            className="mt-3 space-y-2"
          >
            {links.slice(0, 4).map((link, index) => (
              <Motion.li key={link.label} variants={animations.staggerItem}>
                <Motion.a
                  href={link.href}
                  className={`text-sm transition-colors ${
                    isDark
                      ? "text-slate-400 hover:text-purple-300"
                      : "text-slate-600 hover:text-purple-600"
                  }`}
                  whileHover={{ x: 3 }}
                  transition={{ duration: 0.2 }}
                >
                  {link.label}
                </Motion.a>
              </Motion.li>
            ))}
          </Motion.ul>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={animations.viewport}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <Motion.p
            className={`text-sm font-semibold uppercase tracking-wider ${
              isDark ? "text-purple-300" : "text-purple-600"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={animations.viewport}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Docs
          </Motion.p>
          <Motion.ul
            variants={animations.staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={animations.viewport}
            className={`mt-3 space-y-2 text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {["Developer Docs", "API Reference", "Security"].map(
              (item, index) => (
                <Motion.li key={item} variants={animations.staggerItem}>
                  <Motion.a
                    href="#about"
                    className={`transition-colors ${
                      isDark ? "hover:text-purple-300" : "hover:text-purple-600"
                    }`}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </Motion.a>
                </Motion.li>
              ),
            )}
          </Motion.ul>
        </Motion.div>

        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={animations.viewport}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Motion.p
            className={`text-sm font-semibold uppercase tracking-wider ${
              isDark ? "text-purple-300" : "text-purple-600"
            }`}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={animations.viewport}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            Legal
          </Motion.p>
          <Motion.ul
            variants={animations.staggerContainer}
            initial="hidden"
            whileInView="visible"
            viewport={animations.viewport}
            className={`mt-3 space-y-2 text-sm ${
              isDark ? "text-slate-400" : "text-slate-600"
            }`}
          >
            {["Privacy Policy", "Terms of Use", "Risk Notice"].map(
              (item, index) => (
                <Motion.li key={item} variants={animations.staggerItem}>
                  <Motion.span
                    className={`transition-colors cursor-pointer ${
                      isDark ? "hover:text-purple-300" : "hover:text-purple-600"
                    }`}
                    whileHover={{ x: 3 }}
                    transition={{ duration: 0.2 }}
                  >
                    {item}
                  </Motion.span>
                </Motion.li>
              ),
            )}
          </Motion.ul>
        </Motion.div>
      </div>
      <Motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={animations.viewport}
        transition={{ duration: 0.5, delay: 0.4 }}
        className={`mx-auto mt-10 w-full max-w-7xl border-t px-4 pt-6 text-xs sm:px-6 lg:px-8 ${
          isDark
            ? "border-slate-800 text-slate-500"
            : "border-slate-300 text-slate-600"
        }`}
      >
        <p className="mb-3">
          SkyX can be deployed and operated as your own venture platform.
        </p>
        <p>
          {`© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`}
        </p>
      </Motion.div>
    </footer>
  );
}

export default Footer;
