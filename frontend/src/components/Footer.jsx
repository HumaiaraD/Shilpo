import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="border-t border-stone-200 bg-stone-950 text-stone-300">
      <div className="mx-auto max-w-6xl px-6 pb-6 pt-14">
        <div className="grid gap-10 pb-12 sm:grid-cols-2">
          <div>
            <Link to="/" className="font-lavishly text-5xl text-stone-50">
              Shilpo
            </Link>

            <p className="mt-4 text-xs uppercase tracking-[0.2em] text-stone-400">
              A Space for Artists and Their Art
            </p>

            <p className="mt-5 max-w-sm text-sm leading-7 text-stone-400">
              A place to discover creative voices, bring collections together,
              and give every artwork a home.
            </p>
          </div>

          <nav aria-label="Footer navigation" className="sm:justify-self-end">
            <h2 className="mb-5 text-xs uppercase tracking-[0.2em] text-stone-500">
              Explore
            </h2>

            <ul className="grid grid-cols-2 gap-x-12 gap-y-4 text-sm">
              {[
                { to: "/", label: "Home" },
                { to: "/artwork", label: "Artworks" },
                { to: "/user", label: "My Account" },
                { to: "/about", label: "About & Contact" },
              ].map(({ to, label }) => (
                <li key={to}>
                  <Link
                    to={to}
                    className="rounded-sm transition-colors hover:text-white focus-visible:outline focus-visible:outline-offset-4 focus-visible:outline-stone-300"
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>

            <Link
              to="/user"
              className="mt-7 inline-flex items-center gap-3 rounded-full border border-stone-700 px-5 py-3 text-sm transition-colors hover:border-stone-400 hover:bg-stone-900 hover:text-white"
            >
              Start Your Portfolio
              <span aria-hidden="true">↗</span>
            </Link>
          </nav>
        </div>

        <div className="flex flex-col gap-3 border-t border-stone-800 pt-6 text-xs text-stone-500 sm:flex-row sm:items-center sm:justify-between">
          <p>© {new Date().getFullYear()} Shilpo.</p>
          <p>Created by Humaiara Diea · Built with art in mind.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
