import { useEffect, useRef, useState } from "react";
import { MapPin, ArrowRight, Play, Star, Users, Map, Compass } from "lucide-react";
import { Container } from "@/components/shared/Container";

const destinations = [
  { name: "Sundarbans", tag: "Wildlife" },
  { name: "Cox's Bazar", tag: "Beach" },
  { name: "Bandarban", tag: "Hills" },
  { name: "Sreemangal", tag: "Tea" },
  { name: "Sajek Valley", tag: "Clouds" },
];

const floatingBadges = [
  { icon: Star, label: "4.9 Rated", sub: "50K+ reviews", top: "18%", left: "4%", delay: 0 },
  { icon: Users, label: "50K+ Travelers", sub: "Joined this year", top: "62%", left: "2%", delay: 0.4 },
  { icon: Map, label: "64 Districts", sub: "Fully covered", top: "20%", right: "4%", delay: 0.2 },
  { icon: Compass, label: "500+ Tours", sub: "Ready to book", top: "65%", right: "3%", delay: 0.6 },
];

function useInView(threshold = 0.1) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);
  return [ref, visible] as const;
}

function FloatingBadge({
  icon: Icon, label, sub, top, left, right, delay,
}: {
  icon: React.ElementType; label: string; sub: string;
  top: string; left?: string; right?: string; delay: number;
}) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 600 + delay * 1000);
    return () => clearTimeout(t);
  }, [delay]);

  return (
    <div
      className="absolute hidden lg:flex items-center gap-2.5 rounded-2xl px-4 py-3 border
        bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md
        border-purple-100 dark:border-purple-900/50
        shadow-xl shadow-purple-500/10 dark:shadow-purple-500/20"
      style={{
        top, left, right,
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0px)" : "translateY(12px)",
        transition: `opacity 0.6s ease, transform 0.6s ease`,
        animation: visible ? `floatY 4s ease-in-out ${delay}s infinite alternate` : "none",
        zIndex: 10,
      }}
    >
      <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 flex items-center justify-center shrink-0">
        <Icon size={15} className="text-purple-600 dark:text-purple-400" />
      </div>
      <div>
        <p className="text-xs font-semibold text-foreground leading-none">{label}</p>
        <p className="text-[10px] text-muted-foreground mt-0.5">{sub}</p>
      </div>
    </div>
  );
}

export default function HeroSection() {
  const [heroRef, heroVisible] = useInView(0.05);
  const [activeDestIdx, setActiveDestIdx] = useState(0);
  const [searchFocused, setSearchFocused] = useState(false);

  useEffect(() => {
    const t = setInterval(() => setActiveDestIdx(i => (i + 1) % destinations.length), 2500);
    return () => clearInterval(t);
  }, []);

  return (
    <Container className="relative overflow-hidden bg-background">
      <div className="relative flex flex-col items-center justify-center min-h-[90vh] py-20 w-full pt-32">
        <style>{`
        @keyframes floatY {
          from { transform: translateY(0px); }
          to   { transform: translateY(-10px); }
        }
        @keyframes spinSlow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }
        @keyframes pulseRing {
          0%   { transform: scale(1);   opacity: 0.6; }
          100% { transform: scale(1.7); opacity: 0; }
        }
        @keyframes tickerScroll {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
      `}</style>

        {/* ── Grid background ── */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "linear-gradient(rgba(139,92,246,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.045) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />

        {/* ── Ambient center glow ── */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="w-[700px] h-[700px] rounded-full bg-purple-500/10 dark:bg-purple-500/15 blur-[120px]" />
        </div>

        {/* ── Corner radial vignettes ── */}
        <div className="absolute top-0 left-0 w-72 h-72 bg-violet-500/10 dark:bg-violet-500/15 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

        {/* ── Rotating decorative ring ── */}
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
          style={{ animation: "spinSlow 40s linear infinite" }}
        >
          <svg width="700" height="700" viewBox="0 0 700 700" fill="none">
            <circle cx="350" cy="350" r="320" stroke="url(#ringGrad)" strokeWidth="1" strokeDasharray="6 18" opacity="0.35" />
            <circle cx="350" cy="350" r="260" stroke="url(#ringGrad2)" strokeWidth="1" strokeDasharray="3 24" opacity="0.2" />
            <defs>
              <linearGradient id="ringGrad" x1="0" y1="0" x2="700" y2="700" gradientUnits="userSpaceOnUse">
                <stop stopColor="#a855f7" /><stop offset="1" stopColor="#7c3aed" />
              </linearGradient>
              <linearGradient id="ringGrad2" x1="700" y1="0" x2="0" y2="700" gradientUnits="userSpaceOnUse">
                <stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#6d28d9" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        {/* ── Floating stat badges ── */}
        {floatingBadges.map((b) => (
          <FloatingBadge key={b.label} {...b} />
        ))}

        {/* ── Main content ── */}
        <div ref={heroRef} className="relative z-10 flex flex-col items-center text-center w-full mt-10">

          {/* Eyebrow pill */}
          <div
            className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 rounded-full px-4 py-1.5 mb-8"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s",
            }}
          >
            {/* Pulse dot */}
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75"
                style={{ animation: "pulseRing 1.5s ease-out infinite" }} />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600" />
            </span>
            <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
              Bangladesh's #1 Tour Platform
            </span>
          </div>

          {/* Headline */}
          <h1
            className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-4 leading-[1.08]"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
            }}
          >
            Discover the Soul of
            <br />
            <span className="relative inline-block mt-1">
              <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                Bangladesh
              </span>
              {/* Underline squiggle */}
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 300 8" preserveAspectRatio="none">
                <path d="M0,5 Q37.5,0 75,5 Q112.5,10 150,5 Q187.5,0 225,5 Q262.5,10 300,5"
                  stroke="url(#squiggleGrad)" strokeWidth="2.5" fill="none" strokeLinecap="round"
                  style={{
                    strokeDasharray: 320,
                    strokeDashoffset: heroVisible ? 0 : 320,
                    transition: "stroke-dashoffset 1.2s ease 0.8s",
                  }}
                />
                <defs>
                  <linearGradient id="squiggleGrad" x1="0" y1="0" x2="300" y2="0">
                    <stop stopColor="#a855f7" /><stop offset="1" stopColor="#7c3aed" />
                  </linearGradient>
                </defs>
              </svg>
            </span>
          </h1>

          {/* Subheading */}
          <p
            className="text-lg text-muted-foreground max-w-xl leading-relaxed mb-10"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s",
            }}
          >
            From the tiger-roamed mangroves of the Sundarbans to the cloud-kissed peaks of Sajek — TrekOn crafts journeys that feel like home.
          </p>

          {/* Search bar */}
          <div
            className="w-full max-w-xl mb-10"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease 0.45s, transform 0.7s ease 0.45s",
            }}
          >
            <div className={`relative flex items-center gap-3 rounded-2xl border px-5 py-4 transition-all duration-300
            bg-white dark:bg-zinc-900/80 backdrop-blur-md
            ${searchFocused
                ? "border-purple-400 dark:border-purple-500 shadow-lg shadow-purple-500/15"
                : "border-purple-100 dark:border-purple-900/50 shadow-md shadow-purple-500/5"
              }`}
            >
              <MapPin size={18} className="text-purple-500 shrink-0" />
              <div className="flex-1 text-left overflow-hidden">
                <p className="text-[10px] uppercase tracking-widest text-muted-foreground mb-0.5 font-medium">Where to?</p>
                <div className="relative h-5 overflow-hidden">
                  {destinations.map((d, i) => (
                    <span
                      key={d.name}
                      className="absolute left-0 text-sm font-medium text-foreground whitespace-nowrap"
                      style={{
                        opacity: i === activeDestIdx ? 1 : 0,
                        transform: i === activeDestIdx ? "translateY(0)" : "translateY(8px)",
                        transition: "opacity 0.4s ease, transform 0.4s ease",
                      }}
                    >
                      {d.name}
                      <span className="ml-2 text-[10px] font-semibold text-purple-500 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/60 px-1.5 py-0.5 rounded-full border border-purple-200 dark:border-purple-800/50">
                        {d.tag}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
              <input
                className="absolute inset-0 opacity-0 cursor-text"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
                readOnly
              />
              <button className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5">
                Explore
                <ArrowRight size={15} />
              </button>
            </div>
          </div>

          {/* CTA row */}
          <div
            className="flex flex-wrap items-center justify-center gap-4"
            style={{
              opacity: heroVisible ? 1 : 0,
              transform: heroVisible ? "translateY(0)" : "translateY(16px)",
              transition: "opacity 0.7s ease 0.55s, transform 0.7s ease 0.55s",
            }}
          >
            <button className="flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400 transition-colors duration-200 group">
              <span className="relative flex items-center justify-center w-10 h-10 rounded-full border border-purple-200 dark:border-purple-800/60 bg-white dark:bg-zinc-900/60 group-hover:border-purple-400 dark:group-hover:border-purple-500 group-hover:shadow-md group-hover:shadow-purple-500/15 transition-all duration-200">
                <Play size={13} className="text-purple-500 ml-0.5" fill="currentColor" />
              </span>
              Watch how it works
            </button>
          </div>
        </div>

      </div>

      {/* ── Scrolling destination ticker ── */}
      <div
        className="absolute bottom-0 left-0 right-0 border-t border-purple-100 dark:border-purple-900/40 bg-white/60 dark:bg-zinc-900/60 backdrop-blur-sm py-3 overflow-hidden"
        style={{
          opacity: heroVisible ? 1 : 0,
          transition: "opacity 0.7s ease 0.9s",
        }}
      >
        <div
          className="flex gap-0 whitespace-nowrap"
          style={{ animation: "tickerScroll 28s linear infinite" }}
        >
          {[...Array(2)].map((_, rep) => (
            <span key={rep} className="flex items-center font-open-sans">
              {["Sundarbans", "Cox's Bazar", "Bandarban", "Sreemangal", "Sajek Valley", "Rangamati", "Bagerhat", "Kuakata", "Sylhet", "Jaflong", "Ratargul", "Kaptai Lake"].map((place) => (
                <span key={place} className="inline-flex items-center gap-2 px-6">
                  <span className="w-1 h-1 rounded-full bg-purple-400" />
                  <span className="text-xs font-medium text-muted-foreground">{place}</span>
                </span>
              ))}
            </span>
          ))}
        </div>
      </div>
    </Container >
  );
}