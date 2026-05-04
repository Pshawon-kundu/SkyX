import { motion as Motion } from "framer-motion";
import { BadgeCheck, Building2, Sparkles, UserRound, Users } from "lucide-react";

function createInitials(name = "") {
  return (
    name
      .split(" ")
      .filter(Boolean)
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase() || "SX"
  );
}

function Team({ members = [], isDark = true }) {
  return (
    <section
      id="team"
      className={`relative overflow-hidden py-16 sm:py-20 ${
        isDark ? "bg-slate-950/80" : "bg-white"
      }`}
    >
      <div
        className={`absolute inset-0 pointer-events-none ${
          isDark ? "opacity-25" : "opacity-45"
        }`}
        style={{
          backgroundImage: isDark
            ? "linear-gradient(rgba(34,211,238,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(236,72,153,0.1) 1px, transparent 1px)"
            : "linear-gradient(rgba(14,116,144,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(219,39,119,0.1) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
          maskImage:
            "linear-gradient(to bottom, transparent, black 14%, black 86%, transparent)",
        }}
      />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <div
            className={`mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-lg border ${
              isDark
                ? "border-cyan-300/30 bg-cyan-400/10 text-cyan-200"
                : "border-cyan-700/20 bg-cyan-50 text-cyan-700"
            }`}
          >
            <Users className="h-6 w-6" aria-hidden="true" />
          </div>
          <p
            className={`mb-3 text-sm font-semibold uppercase tracking-normal ${
              isDark ? "text-cyan-200" : "text-cyan-700"
            }`}
          >
            Core leadership
          </p>
          <h2
            className={`text-4xl font-black tracking-normal sm:text-5xl lg:text-6xl ${
              isDark ? "text-[#ff2e9f]" : "text-pink-600"
            }`}
          >
            Our Team
          </h2>
        </div>

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {members.map((member) => (
            <Motion.article
              key={member.name}
              whileHover={{ y: -6 }}
              transition={{ duration: 0.22 }}
              className={`group relative overflow-hidden rounded-lg border p-6 text-center ${
                isDark
                  ? "border-slate-800 bg-slate-950/70 hover:border-cyan-300/35"
                  : "border-slate-200 bg-white/95 shadow-sm shadow-slate-200/70 hover:border-cyan-600/30"
              }`}
            >
              <div
                className={`absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-cyan-300/70 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
              />

              <div
                className={`mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full border text-2xl font-black ${
                  isDark
                    ? "border-cyan-300/25 bg-gradient-to-b from-cyan-300/15 to-pink-500/15 text-white shadow-lg shadow-cyan-500/10"
                    : "border-cyan-700/20 bg-gradient-to-b from-cyan-50 to-pink-50 text-slate-900 shadow-sm shadow-slate-200"
                }`}
              >
                {member.initials || createInitials(member.name)}
              </div>

              <h3
                className={`text-xl font-bold tracking-normal ${
                  isDark ? "text-white" : "text-slate-950"
                }`}
              >
                {member.name}
              </h3>
              <div
                className={`mt-3 inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-semibold ${
                  isDark
                    ? "border-cyan-300/25 bg-cyan-400/10 text-cyan-200"
                    : "border-cyan-700/20 bg-cyan-50 text-cyan-700"
                }`}
              >
                <BadgeCheck className="h-4 w-4" aria-hidden="true" />
                {member.designation}
              </div>

              <div
                className={`mx-auto mt-3 inline-flex max-w-full items-center gap-2 rounded-lg px-3 py-1.5 text-xs font-semibold ${
                  isDark
                    ? "bg-slate-900/70 text-slate-300"
                    : "bg-slate-100 text-slate-600"
                }`}
              >
                <Building2 className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                <span className="truncate">{member.company}</span>
              </div>

              <p
                className={`mx-auto mt-4 min-h-[96px] max-w-xs text-sm leading-6 ${
                  isDark ? "text-slate-400" : "text-slate-600"
                }`}
              >
                {member.experience}
              </p>

              <div
                className={`mt-6 flex items-center justify-center gap-3 border-t pt-5 ${
                  isDark ? "border-slate-800" : "border-slate-200"
                }`}
              >
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                    isDark
                      ? "border-slate-700 text-slate-400 group-hover:text-cyan-200"
                      : "border-slate-200 text-slate-500 group-hover:text-cyan-700"
                  }`}
                  aria-label={`${member.name} profile`}
                >
                  <UserRound className="h-4 w-4" aria-hidden="true" />
                </div>
                <div
                  className={`flex h-9 w-9 items-center justify-center rounded-lg border ${
                    isDark
                      ? "border-slate-700 text-slate-400 group-hover:text-pink-300"
                      : "border-slate-200 text-slate-500 group-hover:text-pink-700"
                  }`}
                  aria-label={`${member.name} verified role`}
                >
                  <Sparkles className="h-4 w-4" aria-hidden="true" />
                </div>
              </div>
            </Motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Team;
