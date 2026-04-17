import { motion as Motion } from "framer-motion";
import {
  MessageSquare,
  Send,
  GitBranch,
  AtSign,
  CandlestickChart,
} from "lucide-react";

const iconsByName = {
  X: AtSign,
  Discord: MessageSquare,
  Telegram: Send,
  GitHub: GitBranch,
};

function Community({ markets, communities }) {
  return (
    <section id="community" className="py-16 sm:py-20">
      <div className="mx-auto grid w-full max-w-7xl gap-8 px-4 sm:px-6 lg:grid-cols-2 lg:px-8">
        <Motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4 }}
          className="rounded-3xl border border-cyan-400/20 bg-slate-900/65 p-7"
        >
          <div className="inline-flex rounded-xl border border-cyan-300/30 bg-cyan-400/10 p-2 text-cyan-300">
            <CandlestickChart size={18} />
          </div>
          <h3 className="mt-4 text-2xl font-bold text-white">Markets</h3>
          <p className="mt-3 text-sm text-slate-300">
            {`$MCRT is available on selected digital asset venues.`}
          </p>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {markets.map((market) => (
              <div
                key={market}
                className="rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-sm font-medium text-slate-200"
              >
                {market}
              </div>
            ))}
          </div>
        </Motion.article>

        <Motion.article
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.4, delay: 0.05 }}
          className="rounded-3xl border border-cyan-400/20 bg-slate-900/65 p-7"
        >
          <h3 className="text-2xl font-bold text-white">Community</h3>
          <p className="mt-3 text-sm text-slate-300">
            Stay close to releases, governance updates, and ecosystem growth.
          </p>
          <div className="mt-6 space-y-3">
            {communities.map((item) => {
              const Icon = iconsByName[item.name];
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/70 px-4 py-3 transition hover:border-cyan-300/30"
                >
                  <span className="flex items-center gap-2 text-sm text-slate-100">
                    <Icon size={16} className="text-cyan-300" />
                    {item.name}
                  </span>
                  <span className="text-xs text-slate-400">{item.handle}</span>
                </a>
              );
            })}
          </div>
          <a
            href="#"
            className="mt-6 inline-flex rounded-full bg-cyan-400 px-5 py-2.5 text-sm font-semibold text-slate-950 transition hover:bg-cyan-300"
          >
            Join Community
          </a>
        </Motion.article>
      </div>
    </section>
  );
}

export default Community;
