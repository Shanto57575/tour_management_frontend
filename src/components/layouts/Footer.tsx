import Logo from "@/assets/icons/trekOn.png";
import { Link } from "react-router";
import { Facebook, Instagram, Twitter, Github, Dribbble, MapPin, Mail, Phone } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const links = {
    "Trek Services": [
      "Custom Tour Planning",
      "Local Guide Matching",
      "Group Travel Management",
      "Solo Trip Support",
      "Real-Time Tracking",
    ],
    Company: ["About TrekOn", "Our Team", "Partner with Us"],
    Resources: ["Support Center", "Blog", "Travel Safety Tips"],
    Legal: [
      "Terms of Service",
      "Privacy Policy",
      "Cancellation Policy",
      "License Info",
    ],
  };

  const socials = [
    { label: "Facebook", icon: <Facebook className="w-4 h-4" />, href: "#" },
    { label: "Instagram", icon: <Instagram className="w-4 h-4" />, href: "#" },
    { label: "Twitter", icon: <Twitter className="w-4 h-4" />, href: "#" },
    { label: "GitHub", icon: <Github className="w-4 h-4" />, href: "#" },
    { label: "Dribbble", icon: <Dribbble className="w-4 h-4" />, href: "#" },
  ];

  return (
    <footer className="bg-slate-900 dark:bg-zinc-950 text-slate-300 dark:text-zinc-400">

      {/* ── TOP BAND ─────────────────────────────────────────────── */}
      <div className="border-b border-slate-800 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-indigo-400 mb-1">
              Ready to explore?
            </p>
            <h2 className="text-xl md:text-2xl font-bold text-white leading-tight">
              Your next adventure is one click away.
            </h2>
          </div>
          <Link
            to="/all-places"
            className="flex-shrink-0 inline-flex items-center gap-2 px-5 py-2.5 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:-translate-y-0.5"
          >
            Browse Tours
          </Link>
        </div>
      </div>

      {/* ── MAIN FOOTER GRID ─────────────────────────────────────── */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">

          {/* Brand column */}
          <div className="lg:col-span-4 space-y-6">
            <Link to="/" className="inline-block">
              <img src={Logo} className="w-14 h-14 rounded-xl" alt="TrekOn logo" />
            </Link>

            <p className="text-sm text-slate-400 dark:text-zinc-500 leading-relaxed max-w-xs">
              TrekOn helps you explore the world with ease — manage, book, and
              track every journey from start to summit.
            </p>

            {/* Contact tidbits */}
            <ul className="space-y-2.5 text-sm">
              <li className="flex items-center gap-2.5 text-slate-400 dark:text-zinc-500">
                <MapPin className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                Dhaka, Bangladesh
              </li>
              <li className="flex items-center gap-2.5 text-slate-400 dark:text-zinc-500">
                <Mail className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                hello@trekon.app
              </li>
              <li className="flex items-center gap-2.5 text-slate-400 dark:text-zinc-500">
                <Phone className="w-4 h-4 text-indigo-400 flex-shrink-0" />
                +880 1700-000000
              </li>
            </ul>

            {/* Social icons */}
            <div className="flex items-center gap-2">
              {socials.map(({ label, icon, href }) => (
                <a
                  key={label}
                  href={href}
                  rel="noreferrer"
                  target="_blank"
                  aria-label={label}
                  className="w-9 h-9 rounded-lg bg-slate-800 dark:bg-zinc-800 hover:bg-indigo-600 dark:hover:bg-indigo-600 border border-slate-700 dark:border-zinc-700 hover:border-indigo-500 flex items-center justify-center text-slate-400 hover:text-white transition-all duration-200"
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {/* Links grid */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-8">
            {Object.entries(links).map(([category, items]) => (
              <div key={category}>
                <p className="text-xs font-bold uppercase tracking-widest text-slate-200 dark:text-zinc-200 mb-4">
                  {category}
                </p>
                <ul className="space-y-3">
                  {items.map((item) => (
                    <li key={item}>
                      <a
                        href="#"
                        className="text-sm text-slate-400 dark:text-zinc-500 hover:text-indigo-400 dark:hover:text-indigo-400 transition-colors duration-150 flex items-center gap-1.5 group"
                      >
                        <span className="w-0 group-hover:w-1.5 h-0.5 bg-indigo-400 rounded-full transition-all duration-200 flex-shrink-0" />
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── BOTTOM BAR ───────────────────────────────────────────── */}
      <div className="border-t border-slate-800 dark:border-zinc-800/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-500 dark:text-zinc-600">
            &copy; {currentYear} TrekOn. All rights reserved.
          </p>
          <div className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-600">
            <span>Made with</span>
            <span className="text-rose-400">♥</span>
            <span>for adventurers worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  );
};