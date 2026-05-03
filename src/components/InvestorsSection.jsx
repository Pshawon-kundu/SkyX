import { motion as Motion } from "framer-motion";

// Investor logos as SVG components
const LogoA16Z = ({ grayscale }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <text
      x="50"
      y="60"
      fontSize="44"
      fontWeight="900"
      fill="currentColor"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
    >
      a16z
    </text>
  </svg>
);

const LogoParadigm = ({ grayscale }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <circle cx="30" cy="50" r="18" fill="currentColor" />
    <rect x="55" y="32" width="10" height="36" fill="currentColor" />
    <rect x="72" y="32" width="10" height="36" fill="currentColor" />
  </svg>
);

const LogoPantera = ({ grayscale }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <path d="M 20 70 L 50 20 L 80 70 Z" fill="currentColor" opacity="0.8" />
    <path d="M 35 70 L 50 40 L 65 70 Z" fill="currentColor" />
  </svg>
);

const LogoMulticoin = ({ grayscale }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <circle cx="30" cy="50" r="16" fill="currentColor" />
    <circle cx="70" cy="50" r="16" fill="currentColor" />
    <circle cx="50" cy="30" r="16" fill="currentColor" />
    <circle cx="50" cy="70" r="16" fill="currentColor" />
  </svg>
);

const LogoCoinbase = ({ grayscale }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <rect x="15" y="15" width="70" height="70" rx="8" fill="currentColor" />
    <text
      x="50"
      y="65"
      fontSize="36"
      fontWeight="bold"
      fill="white"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
    >
      CB
    </text>
  </svg>
);

const LogoBinance = ({ grayscale }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <polygon points="30,25 45,40 30,55 15,40" fill="currentColor" />
    <polygon points="55,25 70,40 55,55 40,40" fill="currentColor" />
    <polygon points="30,50 45,65 30,80 15,65" fill="currentColor" />
  </svg>
);

const LogoAnimoca = ({ grayscale }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <rect x="20" y="25" width="18" height="18" fill="currentColor" />
    <rect x="45" y="25" width="18" height="18" fill="currentColor" />
    <rect x="70" y="25" width="18" height="18" fill="currentColor" />
    <rect x="32.5" y="50" width="18" height="18" fill="currentColor" />
    <rect x="57.5" y="50" width="18" height="18" fill="currentColor" />
  </svg>
);

const LogoElectric = ({ grayscale }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <path
      d="M 50 15 L 35 50 L 55 50 L 40 85 L 65 35 L 45 35 Z"
      fill="currentColor"
    />
  </svg>
);

const LogoFramework = ({ grayscale }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <circle cx="25" cy="25" r="6" fill="currentColor" />
    <circle cx="50" cy="25" r="6" fill="currentColor" />
    <circle cx="75" cy="25" r="6" fill="currentColor" />
    <circle cx="25" cy="50" r="6" fill="currentColor" />
    <circle cx="50" cy="50" r="6" fill="currentColor" />
    <circle cx="75" cy="50" r="6" fill="currentColor" />
    <circle cx="25" cy="75" r="6" fill="currentColor" />
    <circle cx="50" cy="75" r="6" fill="currentColor" />
    <circle cx="75" cy="75" r="6" fill="currentColor" />
    <line
      x1="25"
      y1="31"
      x2="25"
      y2="44"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line
      x1="50"
      y1="31"
      x2="50"
      y2="44"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line
      x1="75"
      y1="31"
      x2="75"
      y2="44"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line
      x1="31"
      y1="25"
      x2="44"
      y2="25"
      stroke="currentColor"
      strokeWidth="1.5"
    />
    <line
      x1="56"
      y1="25"
      x2="69"
      y2="25"
      stroke="currentColor"
      strokeWidth="1.5"
    />
  </svg>
);

const LogoDragonfly = ({ grayscale }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <circle cx="50" cy="50" r="10" fill="currentColor" />
    <path
      d="M 50 40 L 50 20"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M 50 60 L 50 80"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M 60 50 Q 75 40 80 35"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M 60 50 Q 75 60 80 65"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M 40 50 Q 25 40 20 35"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
    <path
      d="M 40 50 Q 25 60 20 65"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
    />
  </svg>
);

const LogoMetalpha = ({ grayscale }) => (
  <svg
    viewBox="0 0 140 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <rect x="12" y="54" width="16" height="26" fill="#df6a3f" />
    <rect x="38" y="40" width="16" height="40" fill="#df6a3f" />
    <path d="M 64 28 L 80 20 V 80 H 64 Z" fill="#df6a3f" />
    <text
      x="90"
      y="60"
      fontSize="26"
      fontWeight="700"
      fill="currentColor"
      fontFamily="Arial, sans-serif"
    >
      M
    </text>
  </svg>
);

const LogoCrunchbase = ({ grayscale }) => (
  <svg
    viewBox="0 0 100 100"
    fill="none"
    className={grayscale ? "grayscale" : ""}
  >
    <circle cx="50" cy="50" r="38" fill="#146aff" />
    <text
      x="50"
      y="63"
      fontSize="40"
      fontWeight="800"
      fill="white"
      textAnchor="middle"
      fontFamily="Arial, sans-serif"
    >
      cb
    </text>
  </svg>
);

function InvestorsSection({ theme = "dark" }) {
  const isDark = theme === "dark";

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6, ease: "easeOut" },
    },
  };

  const investors = [
    { name: "Vantec Angel Network", logo: LogoA16Z },
    { name: "Mantella Venture Partners", logo: LogoParadigm },
    { name: "Inovia Capital", logo: LogoPantera },
    { name: "Backed VC", logo: LogoMulticoin },
    { name: "Skyland Ventures", logo: LogoCoinbase },
    { name: "Metalpha", logo: LogoMetalpha },
    { name: "B Strategy", logo: LogoBinance },
    {
      name: "Crunchbase",
      logo: LogoCrunchbase,
      href: "https://www.crunchbase.com/",
    },
  ];

  return (
    <section
      id="investors"
      className={`relative py-20 sm:py-28 overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-slate-900/50 to-slate-950/50"
          : "bg-gradient-to-b from-purple-50/30 to-white/30"
      }`}
    >
      {/* Background elements */}
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-1/2 left-1/4 h-96 w-96 bg-purple-500/5 rounded-full blur-3xl" />
        <div className="absolute top-1/3 right-1/4 h-96 w-96 bg-violet-500/5 rounded-full blur-3xl" />
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <Motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          className="space-y-12 sm:space-y-16"
        >
          {/* Section Header */}
          <Motion.div
            variants={itemVariants}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <h2
              className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              🏦 Investors & Backing
            </h2>
            <p
              className={`text-lg sm:text-xl ${isDark ? "text-slate-300" : "text-slate-600"}`}
            >
              SkyX is backed by leading VCs and institutional investors who
              provide capital, domain expertise, and strategic partnerships
              across fintech and Web3.
            </p>
          </Motion.div>

          {/* Investors Grid */}
          <Motion.div variants={itemVariants} className="space-y-8">
            {/* Label */}
            <div className="text-center">
              <p
                className={`text-sm font-semibold uppercase tracking-[0.2em] ${
                  isDark ? "text-purple-300" : "text-purple-600"
                }`}
              >
                Our Backers
              </p>
            </div>

            {/* Logos Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {investors.map((investor, index) => {
                const LogoComponent = investor.logo;
                const CardComponent = investor.href ? Motion.a : Motion.div;

                return (
                  <Motion.div
                    key={investor.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.6, delay: index * 0.05 }}
                    className="group"
                  >
                    <CardComponent
                      {...(investor.href
                        ? {
                            href: investor.href,
                            target: "_blank",
                            rel: "noreferrer",
                            "aria-label": `Open ${investor.name}`,
                          }
                        : {})}
                      className={`relative rounded-xl border p-6 backdrop-blur-sm transition-all h-full flex flex-col items-center justify-center ${
                        isDark
                          ? "border-purple-400/20 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 hover:border-purple-400/40"
                          : "border-purple-300/30 bg-gradient-to-br from-white/70 via-purple-50/40 to-white/50 hover:border-purple-400/50"
                      }`}
                      whileHover={{ y: -4, transition: { duration: 0.3 } }}
                    >
                      {/* Logo */}
                      <div
                        className={`w-16 h-16 sm:w-20 sm:h-20 mb-4 flex items-center justify-center transition-all grayscale group-hover:grayscale-0 [&>svg]:h-full [&>svg]:w-full ${
                          isDark
                            ? "text-slate-300 group-hover:text-purple-300"
                            : "text-slate-600 group-hover:text-purple-600"
                        }`}
                      >
                        <LogoComponent grayscale={true} />
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-semibold text-center ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {investor.name}
                      </p>

                      {/* Hover Glow Effect */}
                      <div className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-r from-purple-500/20 to-pink-500/20 blur-xl -z-10" />
                    </CardComponent>
                  </Motion.div>
                );
              })}
            </div>
          </Motion.div>
        </Motion.div>
      </div>
    </section>
  );
}

export default InvestorsSection;
