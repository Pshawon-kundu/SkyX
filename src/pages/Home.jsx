import { useEffect, useMemo, useState } from "react";
import { motion as Motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import Features from "../components/Features";
import Ecosystem from "../components/Ecosystem";
import Apps from "../components/Apps";
import Partners from "../components/Partners";
import Community from "../components/Community";
import Footer from "../components/Footer";

function Home({ content }) {
  const sectionIds = useMemo(
    () => content.navLinks.map((link) => link.href.replace("#", "")),
    [content.navLinks],
  );

  const [theme, setTheme] = useState(() => {
    if (typeof window === "undefined") {
      return "dark";
    }

    const storedTheme = window.localStorage.getItem("metacrate-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [activeSection, setActiveSection] = useState("home");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("metacrate-theme", theme);
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visibleSection = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

        if (visibleSection?.target?.id) {
          setActiveSection(visibleSection.target.id);
        }
      },
      {
        rootMargin: "-25% 0px -55% 0px",
        threshold: [0.25, 0.45, 0.7],
      },
    );

    sectionIds.forEach((id) => {
      const sectionElement = document.getElementById(id);
      if (sectionElement) {
        observer.observe(sectionElement);
      }
    });

    return () => observer.disconnect();
  }, [sectionIds]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Navbar
        brand={content.brand}
        links={content.navLinks}
        activeSection={activeSection}
        theme={theme}
        onThemeToggle={() =>
          setTheme((currentTheme) =>
            currentTheme === "dark" ? "light" : "dark",
          )
        }
      />
      <main>
        <Hero brand={content.brand} content={content.hero} theme={theme} />
        <Stats stats={content.stats} />
        <Features features={content.features} />
        <Ecosystem products={content.ecosystem} />
        <Apps apps={content.apps} theme={theme} />
        <Partners partners={content.partners} />
        <Community
          markets={content.markets}
          communities={content.communities}
        />

        <section id="about" className="py-16 sm:py-20">
          <div className="mx-auto w-full max-w-4xl px-4 sm:px-6 lg:px-8">
            <Motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.3 }}
              transition={{ duration: 0.45 }}
              className="rounded-3xl border border-cyan-400/20 bg-slate-900/70 p-8 sm:p-10"
            >
              <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
                About {content.brand.name}
              </p>
              <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
                Vision for borderless digital trade
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-slate-300 sm:text-base">
                {content.about}
              </p>
            </Motion.div>
          </div>
        </section>
      </main>
      <Footer brand={content.brand} links={content.navLinks} />
    </div>
  );
}

export default Home;
