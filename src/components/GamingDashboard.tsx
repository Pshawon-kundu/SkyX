import React from "react";
import { motion as Motion } from "framer-motion";
import {
  Gamepad2,
  TrendingUp,
  Zap,
  Lock,
  ArrowRight,
  ChevronRight,
} from "lucide-react";

// Type definitions
interface StatItem {
  value: string;
  label: string;
  sublabel: string;
  icon: React.ReactNode;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
  icon: React.ReactNode;
}

interface Principle {
  title: string;
  description: string;
}

// Reusable Components
const GlassCard: React.FC<{
  children: React.ReactNode;
  className?: string;
  glow?: boolean;
}> = ({ children, className = "", glow = true }) => (
  <div
    className={`relative rounded-lg border border-purple-400/20 bg-gradient-to-br from-slate-900/40 via-purple-900/20 to-slate-950/40 backdrop-blur-xl overflow-hidden ${className}`}
  >
    {glow && (
      <div className="absolute inset-0 rounded-lg bg-gradient-to-br from-purple-500/5 to-cyan-500/5 pointer-events-none" />
    )}
    <div className="relative z-10">{children}</div>
  </div>
);

const NeonBorder: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="relative group">
    <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-pink-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-500" />
    <div className="relative bg-slate-900 rounded-lg">{children}</div>
  </div>
);

const SectionBadge: React.FC<{ text: string }> = ({ text }) => (
  <Motion.div
    initial={{ opacity: 0, y: -10 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-cyan-400/40 bg-gradient-to-r from-cyan-500/10 to-purple-500/10 backdrop-blur"
  >
    <div className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
    <span className="text-xs font-bold uppercase tracking-widest text-cyan-300">
      {text}
    </span>
  </Motion.div>
);

const StatCard: React.FC<StatItem> = ({ value, label, sublabel, icon }) => (
  <Motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6 }}
    whileHover={{ y: -4 }}
    className="group"
  >
    <GlassCard glow className="p-6 h-full">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-2xl font-black tracking-tight bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent">
              {value}
            </p>
            <p className="text-xs uppercase tracking-wider text-cyan-400 font-bold mt-1">
              {label}
            </p>
          </div>
          <Motion.div
            animate={{ y: [0, -4, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="text-cyan-400/60 group-hover:text-cyan-300 transition"
          >
            {icon}
          </Motion.div>
        </div>
        <p className="text-xs text-slate-400">{sublabel}</p>
        <div className="h-1 w-full bg-gradient-to-r from-cyan-500/50 to-purple-500/50 rounded-full overflow-hidden">
          <Motion.div
            className="h-full bg-gradient-to-r from-cyan-400 to-purple-400"
            animate={{ scaleX: [0, 1, 0] }}
            transition={{ duration: 3, repeat: Infinity }}
            style={{ originX: 0 }}
          />
        </div>
      </div>
    </GlassCard>
  </Motion.div>
);

const ProcessCard: React.FC<ProcessStep & { index: number }> = ({
  step,
  title,
  description,
  icon,
  index,
}) => (
  <Motion.div
    initial={{ opacity: 0, x: -20 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="relative group"
  >
    <div className="flex gap-4">
      {/* Connector line and step number */}
      <div className="flex flex-col items-center">
        <div className="w-12 h-12 rounded-full border-2 border-purple-500/50 bg-gradient-to-br from-purple-600/20 to-cyan-600/20 flex items-center justify-center group-hover:border-purple-400 transition">
          <span className="text-sm font-bold text-purple-300">{step}</span>
        </div>
        {index < 3 && (
          <div className="w-1 h-12 bg-gradient-to-b from-purple-500/50 to-transparent mt-2 group-hover:from-purple-400 transition" />
        )}
      </div>

      {/* Content */}
      <GlassCard className="flex-1 p-4 group-hover:border-purple-300/40 transition">
        <div className="flex items-start gap-3 mb-3">
          <div className="text-purple-400 group-hover:text-purple-300 transition">
            {icon}
          </div>
          <h4 className="font-black uppercase tracking-wider text-white group-hover:text-cyan-300 transition">
            {title}
          </h4>
        </div>
        <p className="text-sm text-slate-400 group-hover:text-slate-300 transition">
          {description}
        </p>
      </GlassCard>
    </div>
  </Motion.div>
);

const PrincipleItem: React.FC<Principle & { index: number }> = ({
  title,
  description,
  index,
}) => (
  <Motion.div
    initial={{ opacity: 0, y: 20 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.6, delay: index * 0.1 }}
    className="group"
  >
    <GlassCard className="p-5 h-full group-hover:border-cyan-300/40 transition">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-2 h-2 rounded-full bg-cyan-400 mt-2 group-hover:bg-purple-400 transition" />
        <h4 className="font-bold text-white group-hover:text-cyan-300 transition uppercase tracking-wide">
          {title}
        </h4>
      </div>
      <p className="text-sm text-slate-400 group-hover:text-slate-300 transition">
        {description}
      </p>
    </GlassCard>
  </Motion.div>
);

// Main Component
const GamingDashboard: React.FC<{ isDark?: boolean }> = ({ isDark = true }) => {
  const stats: StatItem[] = [
    {
      value: "< 5 min",
      label: "Session Length",
      sublabel: "Fast Gameplay",
      icon: <Zap size={24} />,
    },
    {
      value: "Instant",
      label: "Match Flow",
      sublabel: "Quick Entry",
      icon: <TrendingUp size={24} />,
    },
    {
      value: "Mobile-First",
      label: "Format",
      sublabel: "Lightweight UI",
      icon: <Gamepad2 size={24} />,
    },
  ];

  const processSteps: ProcessStep[] = [
    {
      step: "01",
      title: "Play",
      description: "Play matches to gain experience",
      icon: <Gamepad2 size={20} />,
    },
    {
      step: "02",
      title: "Progress",
      description: "Progress through rankings and levels",
      icon: <TrendingUp size={20} />,
    },
    {
      step: "03",
      title: "Earn",
      description: "Earn utility-based rewards",
      icon: <Zap size={20} />,
    },
    {
      step: "04",
      title: "Unlock",
      description: "Unlock advanced platform features",
      icon: <Lock size={20} />,
    },
  ];

  const principles: Principle[] = [
    {
      title: "Gameplay-First Approach",
      description: "Everything is designed around core gameplay experience",
    },
    {
      title: "Skill-Based Reward Model",
      description: "Rewards scale with player skill and dedication",
    },
    {
      title: "No Early Token Dependency",
      description: "Play to earn without upfront investment",
    },
    {
      title: "Long-Term Sustainability",
      description: "Economy designed for lasting engagement",
    },
  ];

  return (
    <section className="relative w-full py-20 md:py-32 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Cosmic background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-cyan-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-pink-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10 animate-blob animation-delay-4000" />
      </div>

      {/* Grid overlay */}
      <div className="absolute inset-0 -z-10 opacity-5">
        <div
          className="absolute inset-0 bg-[linear-gradient(0deg,transparent_24%,rgba(168,85,247,.1)_25%,rgba(168,85,247,.1)_26%,transparent_27%,transparent_74%,rgba(168,85,247,.1)_75%,rgba(168,85,247,.1)_76%,transparent_77%,transparent)] bg-[length:50px_50px]"
          style={{
            backgroundPosition: "0 0",
            animation: "grid 20s linear infinite",
          }}
        />
      </div>

      <div className="mx-auto max-w-7xl">
        {/* Header Section */}
        <Motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mb-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        >
          <div>
            <SectionBadge text="SkyX > System" />
          </div>
        </Motion.div>

        {/* Title Section */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="mb-12 md:mb-16"
        >
          <h2
            className="text-5xl md:text-7xl font-black tracking-tighter mb-3 bg-gradient-to-r from-cyan-300 via-purple-300 to-pink-300 bg-clip-text text-transparent"
            style={{ fontFamily: '"Orbitron", sans-serif' }}
          >
            Play
          </h2>
          <p className="text-xl md:text-2xl text-purple-300 font-bold mb-4">
            Competitive skill-based gameplay
          </p>
          <p className="max-w-2xl text-slate-400 leading-relaxed text-lg">
            SkyX begins with gameplay. Players enter fast, skill-driven matches
            designed for progression, utility, and long-term engagement.
          </p>
        </Motion.div>

        {/* Stats Grid */}
        <Motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 md:mb-20"
        >
          {stats.map((stat, idx) => (
            <StatCard key={idx} {...stat} />
          ))}
        </Motion.div>

        {/* CTA Button */}
        <Motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-20 md:mb-28"
        >
          <button className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-lg font-bold uppercase tracking-widest text-white">
            {/* Glow effect */}
            <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-600 via-cyan-600 to-purple-600 rounded-lg opacity-0 group-hover:opacity-100 blur transition duration-500" />

            {/* Button content */}
            <div className="relative flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg group-hover:from-purple-500 group-hover:to-cyan-500 transition">
              <Gamepad2 size={18} />
              Open Progress
              <Motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                <ArrowRight size={18} />
              </Motion.span>
            </div>
          </button>
        </Motion.div>

        {/* Two Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left Panel - How SkyX Works */}
          <Motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3
              className="text-2xl md:text-3xl font-black uppercase tracking-wider mb-8 bg-gradient-to-r from-purple-300 to-pink-300 bg-clip-text text-transparent"
              style={{ fontFamily: '"Rajdhani", sans-serif' }}
            >
              How SkyX Works
            </h3>

            <p className="text-sm text-purple-400 font-bold uppercase tracking-widest mb-8">
              Play → Progress → Earn → Unlock More
            </p>

            <div className="space-y-6">
              {processSteps.map((step, idx) => (
                <ProcessCard key={idx} {...step} index={idx} />
              ))}
            </div>
          </Motion.div>

          {/* Right Panel - Key Principles */}
          <Motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <h3
              className="text-2xl md:text-3xl font-black uppercase tracking-wider mb-8 bg-gradient-to-r from-cyan-300 to-purple-300 bg-clip-text text-transparent"
              style={{ fontFamily: '"Rajdhani", sans-serif' }}
            >
              Key Principles
            </h3>

            <p className="text-sm text-cyan-400 font-bold uppercase tracking-widest mb-8">
              Foundational Philosophy
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {principles.map((principle, idx) => (
                <PrincipleItem key={idx} {...principle} index={idx} />
              ))}
            </div>

            {/* Bottom accent card */}
            <Motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="mt-8 group"
            >
              <GlassCard className="p-6 border-cyan-400/30 group-hover:border-cyan-300/50 transition">
                <div className="flex items-start gap-4">
                  <div className="text-cyan-400 flex-shrink-0 mt-1">
                    <ChevronRight size={24} />
                  </div>
                  <div>
                    <p className="font-bold text-white mb-2">
                      Ready to Experience Next-Gen Gaming?
                    </p>
                    <p className="text-sm text-slate-400">
                      Join the SkyX ecosystem and start your journey from casual
                      player to elite competitor.
                    </p>
                  </div>
                </div>
              </GlassCard>
            </Motion.div>
          </Motion.div>
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Orbitron:wght@400;700;900&family=Rajdhani:wght@400;600;700&display=swap');
        
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        
        .animate-blob {
          animation: blob 7s infinite;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        
        @keyframes grid {
          0% { background-position: 0 0; }
          100% { background-position: 50px 50px; }
        }
      `}</style>
    </section>
  );
};

export default GamingDashboard;
