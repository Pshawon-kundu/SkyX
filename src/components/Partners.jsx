import { motion as Motion } from "framer-motion";

function Partners({ partners }) {
  return (
    <section id="partners" className="py-16 sm:py-20">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-10 max-w-2xl">
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-cyan-300">
            Partners
          </p>
          <h2 className="mt-3 text-3xl font-black text-white sm:text-4xl">
            Trusted by operators across digital markets
          </h2>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {partners.map((partner, index) => (
            <Motion.div
              key={partner}
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.3, delay: index * 0.03 }}
              className="rounded-2xl border border-slate-800 bg-slate-900/60 px-4 py-6 text-center"
            >
              <span className="text-sm font-semibold tracking-wide text-slate-300">
                {partner}
              </span>
            </Motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Partners;
