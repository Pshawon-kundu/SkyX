import { motion as Motion } from "framer-motion";

const investors = [
  {
    name: "VANTEC Angel Network",
    logoSrc: "/investors/vantec-angel-network.png",
  },
  {
    name: "Mantella Venture Partners",
    logoSrc: "/investors/mantella-venture-partners.png",
  },
  {
    name: "Inovia Capital",
    logoSrc: "/investors/inovia-capital.png",
  },
  {
    name: "Skyland Ventures",
    logoSrc: "/investors/skyland-ventures.png",
  },
  {
    name: "Metalpha",
    logoSrc: "/investors/metalpha.png",
  },
  {
    name: "B Strategy",
    logoSrc: "/investors/b-strategy.png",
  },
];

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

  return (
    <section
      id="investors"
      className={`relative py-20 sm:py-28 overflow-hidden ${
        isDark
          ? "bg-gradient-to-b from-slate-900/50 to-slate-950/50"
          : "bg-gradient-to-b from-purple-50/30 to-white/30"
      }`}
    >
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
          <Motion.div
            variants={itemVariants}
            className="text-center space-y-4 max-w-3xl mx-auto"
          >
            <h2
              className={`text-4xl sm:text-5xl lg:text-6xl font-black leading-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Investors & Backing
            </h2>
            <p
              className={`text-lg sm:text-xl ${
                isDark ? "text-slate-300" : "text-slate-600"
              }`}
            >
              SkyX is backed by leading VCs and institutional investors who
              provide capital, domain expertise, and strategic partnerships
              across fintech and Web3.
            </p>
          </Motion.div>

          <Motion.div variants={itemVariants} className="space-y-8">
            <div className="text-center">
              <p
                className={`text-sm font-semibold uppercase tracking-[0.2em] ${
                  isDark ? "text-purple-300" : "text-purple-600"
                }`}
              >
                Our Backers
              </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
              {investors.map((investor, index) => {
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
                      className={`relative rounded-xl border p-5 backdrop-blur-sm transition-all min-h-[190px] h-full flex flex-col items-center justify-center ${
                        isDark
                          ? "border-purple-400/20 bg-gradient-to-br from-slate-900/80 via-slate-950/60 to-slate-950/80 hover:border-purple-400/40"
                          : "border-purple-300/30 bg-gradient-to-br from-white/70 via-purple-50/40 to-white/50 hover:border-purple-400/50"
                      }`}
                      whileHover={{ y: -4, transition: { duration: 0.3 } }}
                    >
                      <div className="mb-5 flex h-24 w-full items-center justify-center rounded-lg bg-white px-4 py-3 shadow-sm ring-1 ring-slate-200/70">
                        <img
                          src={investor.logoSrc}
                          alt={`${investor.name} logo`}
                          className="h-full w-full object-contain"
                          loading="lazy"
                        />
                      </div>
                      <p
                        className={`text-xs sm:text-sm font-semibold text-center ${
                          isDark ? "text-slate-300" : "text-slate-700"
                        }`}
                      >
                        {investor.name}
                      </p>

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
