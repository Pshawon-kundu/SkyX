import { useEffect, useMemo, useState, Suspense, lazy } from "react";
import { motion as Motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import Stats from "../components/Stats";
import AnimatedBackground from "../components/AnimatedBackground";

// Lazy load below-the-fold components
const Features = lazy(() => import("../components/Features"));
const Problem = lazy(() => import("../components/Problem"));
const How = lazy(() => import("../components/How"));
const GamingDashboard = lazy(() => import("../components/GamingDashboard"));
const Products = lazy(() => import("../components/Products"));
const DashboardPreview = lazy(() => import("../components/DashboardPreview"));
const WhyMatters = lazy(() => import("../components/WhyMatters"));
const TokenSection = lazy(() => import("../components/TokenSection"));
const Ecosystem = lazy(() => import("../components/Ecosystem"));
const DataAnalysis = lazy(() => import("../components/DataAnalysis"));
const Audience = lazy(() => import("../components/Audience"));
const OperatorsSection = lazy(() => import("../components/OperatorsSection"));
const PitchDeck = lazy(() => import("../components/PitchDeck"));
const PitchDeckDownload = lazy(() => import("../components/PitchDeckDownload"));
const Roadmap = lazy(() => import("../components/Roadmap"));
const Trust = lazy(() => import("../components/Trust"));
const WhitePaper = lazy(() => import("../components/WhitePaper"));
const Profile = lazy(() => import("../components/profile/UserProfile"));
const Apps = lazy(() => import("../components/Apps"));
const Partners = lazy(() => import("../components/Partners"));
const InvestorsSection = lazy(() => import("../components/InvestorsSection"));
const Community = lazy(() => import("../components/Community"));
const FinalCta = lazy(() => import("../components/FinalCta"));
const Footer = lazy(() => import("../components/Footer"));

function Home({
  content,
  theme: initialTheme,
  onThemeToggle: parentOnThemeToggle,
}) {
  const sectionIds = useMemo(
    () => content.navLinks.map((link) => link.href.replace("#", "")),
    [content.navLinks],
  );

  const [theme, setTheme] = useState(() => {
    if (initialTheme) {
      return initialTheme;
    }

    if (typeof window === "undefined") {
      return "dark";
    }

    const storedTheme = window.localStorage.getItem("skyx-theme");
    if (storedTheme === "light" || storedTheme === "dark") {
      return storedTheme;
    }

    return window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
  });

  const [activeSection, setActiveSection] = useState(() =>
    sectionIds && sectionIds.length ? sectionIds[0] : "home",
  );
  const [ignoreObserverUntil, setIgnoreObserverUntil] = useState(0);

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
    document.documentElement.style.colorScheme = theme;
    window.localStorage.setItem("skyx-theme", theme);
  }, [theme]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        // If we recently clicked a nav link, ignore observer updates briefly
        if (Date.now() < ignoreObserverUntil) return;

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
  }, [sectionIds, ignoreObserverUntil]);

  return (
    <div
      className={`relative min-h-screen text-slate-100 overflow-hidden ${
        theme === "dark" ? "bg-slate-950" : "bg-white"
      }`}
    >
      {/* Animated background */}
      <AnimatedBackground isDark={theme === "dark"} />

      {/* Content overlay */}
      <div className="relative z-10">
        <Navbar
          brand={content.brand}
          links={content.navLinks}
          activeSection={activeSection}
          theme={theme}
          onThemeToggle={() => {
            const newTheme = theme === "dark" ? "light" : "dark";
            setTheme(newTheme);
            if (parentOnThemeToggle) {
              parentOnThemeToggle();
            }
          }}
          onSectionClick={(sectionId) => {
            setActiveSection(sectionId);
            setIgnoreObserverUntil(Date.now() + 800);
          }}
        />
        <main>
          <Hero brand={content.brand} content={content.hero} theme={theme} />
          <Stats stats={content.stats} isDark={theme === "dark"} />
          <Suspense fallback={<div className="min-h-96" />}>
            <Problem content={content.problems} theme={theme} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <How content={content.how} theme={theme} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <OperatorsSection theme={theme} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <GamingDashboard isDark={theme === "dark"} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <Products content={content.products} theme={theme} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <Profile />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <DashboardPreview theme={theme} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <WhyMatters
              content={content.whyMatters}
              isDark={theme === "dark"}
            />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <TokenSection
              content={content.tokenSection}
              isDark={theme === "dark"}
            />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <Ecosystem
              products={content.ecosystem.modules}
              title={content.ecosystem.title}
              isDark={theme === "dark"}
            />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <DataAnalysis
              content={content.dataAnalysis}
              isDark={theme === "dark"}
            />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <Audience content={content.audience} isDark={theme === "dark"} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <PitchDeck content={content.pitchDeck} isDark={theme === "dark"} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <section id="pitch-deck-download" className="py-12 sm:py-16">
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <PitchDeckDownload />
              </div>
            </section>
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <Roadmap content={content.roadmap} isDark={theme === "dark"} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <Trust content={content.trust} isDark={theme === "dark"} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <WhitePaper theme={theme} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <Features features={content.features} isDark={theme === "dark"} />
          </Suspense>

          <Suspense fallback={<div className="min-h-96" />}>
            <Apps apps={content.apps} theme={theme} isDark={theme === "dark"} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <Partners partners={content.partners} isDark={theme === "dark"} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <InvestorsSection theme={theme} />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <Community
              markets={content.markets}
              communities={content.communities}
              isDark={theme === "dark"}
            />
          </Suspense>
          <Suspense fallback={<div className="min-h-96" />}>
            <FinalCta content={content.finalCta} isDark={theme === "dark"} />
          </Suspense>
        </main>
        <Suspense fallback={<div className="min-h-32" />}>
          <Footer
            brand={content.brand}
            links={content.navLinks}
            isDark={theme === "dark"}
          />
        </Suspense>
      </div>
    </div>
  );
}

export default Home;
