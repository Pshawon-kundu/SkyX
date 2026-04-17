function Footer({ brand, links }) {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 py-12">
      <div className="mx-auto grid w-full max-w-7xl gap-10 px-4 sm:px-6 md:grid-cols-2 lg:grid-cols-5 lg:px-8">
        <div className="lg:col-span-2">
          <p className="text-lg font-semibold text-white">{brand.name}</p>
          <p className="mt-2 text-sm text-slate-400">Ticker: {brand.ticker}</p>
          <p className="mt-4 max-w-md text-sm leading-relaxed text-slate-400">
            Infrastructure for borderless digital markets with high-performance
            settlement and open developer access.
          </p>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Quick Links
          </p>
          <ul className="mt-3 space-y-2">
            {links.slice(0, 4).map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-sm text-slate-400 hover:text-cyan-300"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Docs
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>
              <a href="#about" className="hover:text-cyan-300">
                Developer Docs
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-cyan-300">
                API Reference
              </a>
            </li>
            <li>
              <a href="#about" className="hover:text-cyan-300">
                Security
              </a>
            </li>
          </ul>
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-wider text-cyan-300">
            Legal
          </p>
          <ul className="mt-3 space-y-2 text-sm text-slate-400">
            <li>Privacy Policy</li>
            <li>Terms of Use</li>
            <li>Risk Notice</li>
          </ul>
        </div>
      </div>
      <div className="mx-auto mt-10 w-full max-w-7xl border-t border-slate-800 px-4 pt-6 text-xs text-slate-500 sm:px-6 lg:px-8">
        {`© ${new Date().getFullYear()} ${brand.name}. All rights reserved.`}
      </div>
    </footer>
  );
}

export default Footer;
