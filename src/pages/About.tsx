import { useEffect, useRef, useState } from "react";
import {
  MapPin, Users, Award, Heart, ArrowRight,
  Mountain, Compass, Shield, Star, TrendingUp, Globe
} from "lucide-react";
import { Container } from "@/components/shared/Container";

// ── Data ──────────────────────────────────────────────────────────────────────

const stats = [
  { value: "50K+", label: "Happy Travelers", icon: Users },
  { value: "64", label: "Districts Covered", icon: MapPin },
  { value: "500+", label: "Tour Packages", icon: Compass },
  { value: "6 Yrs", label: "Of Experience", icon: Award },
];

const values = [
  {
    icon: Heart,
    title: "Bangladesh First",
    description: "We are proudly Bangladeshi. Every itinerary, every guide, every recommendation is rooted in a deep love for this land and its people.",
    gradient: "from-rose-500 to-pink-600",
  },
  {
    icon: Shield,
    title: "Safety Above All",
    description: "From the Sundarbans to the Chittagong Hill Tracts, your safety is our highest priority — with vetted guides, emergency support, and full insurance coverage.",
    gradient: "from-purple-500 to-violet-600",
  },
  {
    icon: Globe,
    title: "Sustainable Travel",
    description: "We partner with local communities and practice low-impact tourism. Every tour we run gives back to the region it explores.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Star,
    title: "Unmatched Quality",
    description: "Award-winning itineraries, hand-screened accommodations, and guides who know their destinations like the back of their hand.",
    gradient: "from-amber-500 to-orange-500",
  },
];

const team = [
  {
    name: "Arif Hossain",
    role: "Founder & CEO",
    bio: "Born in Sylhet, raised on the trails of Bandarban. Arif built TrekOn after a decade of leading unofficial treks across Bangladesh.",
    avatar: "AH",
    gradient: "from-purple-500 to-violet-600",
    location: "Dhaka",
    tours: 340,
  },
  {
    name: "Nadia Rahman",
    role: "Head of Experience",
    bio: "Former anthropologist turned travel curator. Nadia designs every TrekOn itinerary with cultural depth and local authenticity.",
    avatar: "NR",
    gradient: "from-violet-500 to-fuchsia-500",
    location: "Chittagong",
    tours: 210,
  },
  {
    name: "Karim Uddin",
    role: "Chief Guide Officer",
    bio: "Karim has summited every major peak in the CHT and personally vets every guide on the TrekOn platform. He is the backbone of our safety culture.",
    avatar: "KU",
    gradient: "from-fuchsia-500 to-purple-600",
    location: "Bandarban",
    tours: 480,
  },
  {
    name: "Tania Begum",
    role: "Community & Marketing",
    bio: "Tania grew TrekOn's community from 0 to 50,000 members. She tells the stories of Bangladesh that the world hasn't heard yet.",
    avatar: "TB",
    gradient: "from-indigo-500 to-violet-600",
    location: "Sylhet",
    tours: 180,
  },
];

const milestones = [
  { year: "2018", title: "TrekOn Founded", desc: "Started with 3 tour packages and a dream to show Bangladesh to Bangladesh.", side: "left" },
  { year: "2019", title: "First 1,000 Travelers", desc: "Reached our first milestone — 1,000 happy trekkers across 12 destinations.", side: "right" },
  { year: "2020", title: "Digital Booking Launch", desc: "Launched our online platform — making tour booking instant and paperless.", side: "left" },
  { year: "2021", title: "Expanded to All 8 Divisions", desc: "TrekOn tours now cover every division of Bangladesh, including the CHT.", side: "right" },
  { year: "2022", title: "#1 Tour Platform Award", desc: "Recognized as Bangladesh's top-rated tour management platform.", side: "left" },
  { year: "2023", title: "50,000 Community Members", desc: "Our traveler community crossed 50K — the largest in Bangladesh.", side: "right" },
  { year: "2025", title: "500+ Packages & Growing", desc: "Today we offer 500+ curated packages and keep adding more every season.", side: "left" },
];

// ── Hooks ─────────────────────────────────────────────────────────────────────

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

// ── Sub-components ─────────────────────────────────────────────────────────────

function StatCard({ stat, index }: { stat: typeof stats[0]; index: number }) {
  const [ref, visible] = useInView();
  const Icon = stat.icon;
  return (
    <div
      ref={ref}
      className="flex flex-col items-center text-center p-6 rounded-2xl border
        bg-white dark:bg-zinc-900/70
        border-purple-100 dark:border-purple-900/40
        hover:border-purple-400 dark:hover:border-purple-500
        hover:shadow-xl hover:shadow-purple-500/10
        transition-all duration-300 group cursor-default"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s, box-shadow 0.3s ease`,
      }}
    >
      <div className="w-12 h-12 rounded-xl bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-300">
        <Icon size={22} className="text-purple-600 dark:text-purple-400" strokeWidth={1.8} />
      </div>
      <p className="text-3xl font-black text-foreground mb-1">{stat.value}</p>
      <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{stat.label}</p>
    </div>
  );
}

function ValueCard({ value, index }: { value: typeof values[0]; index: number }) {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(false);
  const Icon = value.icon;
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl border overflow-hidden p-6 cursor-default
        bg-white dark:bg-zinc-900/70
        border-purple-100 dark:border-purple-900/40
        hover:border-purple-400 dark:hover:border-purple-500
        hover:shadow-xl hover:shadow-purple-500/10
        transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s, box-shadow 0.3s ease`,
      }}
    >
      <div className="absolute inset-0 opacity-0 pointer-events-none bg-gradient-to-br from-purple-500/5 to-violet-500/5 transition-opacity duration-300"
        style={{ opacity: hovered ? 1 : 0 }} />
      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${value.gradient} flex items-center justify-center mb-5 shadow-md transition-transform duration-300`}
        style={{ transform: hovered ? "scale(1.1) rotate(-4deg)" : "scale(1)" }}>
        <Icon size={22} color="white" strokeWidth={1.8} />
      </div>
      <h3 className="text-base font-bold text-foreground mb-2">{value.title}</h3>
      <p className="text-sm text-muted-foreground leading-relaxed">{value.description}</p>
    </div>
  );
}

function TeamCard({ member, index }: { member: typeof team[0]; index: number }) {
  const [ref, visible] = useInView();
  const [hovered, setHovered] = useState(false);
  return (
    <div
      ref={ref}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="relative rounded-2xl border overflow-hidden cursor-default
        bg-white dark:bg-zinc-900/70
        border-purple-100 dark:border-purple-900/40
        hover:border-purple-400 dark:hover:border-purple-500
        hover:shadow-2xl hover:shadow-purple-500/10
        transition-all duration-300"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
        transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s, box-shadow 0.3s ease`,
      }}
    >
      {/* Top gradient bar */}
      <div className={`h-1 w-full bg-gradient-to-r ${member.gradient}`} />

      {/* Avatar area */}
      <div className="relative p-6 pb-4">
        <div className="absolute inset-0 opacity-0 pointer-events-none bg-gradient-to-br from-purple-500/5 to-violet-500/5 transition-opacity duration-300"
          style={{ opacity: hovered ? 1 : 0 }} />

        <div className="flex items-start gap-4">
          <div className={`relative w-16 h-16 rounded-2xl bg-gradient-to-br ${member.gradient} flex items-center justify-center shadow-lg shrink-0 transition-transform duration-300`}
            style={{ transform: hovered ? "scale(1.05) rotate(-2deg)" : "scale(1)" }}>
            <span className="text-lg font-black text-white">{member.avatar}</span>
            {/* Online dot */}
            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-zinc-900" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-base font-bold text-foreground leading-tight">{member.name}</h4>
            <p className="text-xs font-semibold text-purple-600 dark:text-purple-400 mt-0.5">{member.role}</p>
            <div className="flex items-center gap-1 mt-1.5">
              <MapPin size={10} className="text-muted-foreground" />
              <span className="text-[11px] text-muted-foreground">{member.location}</span>
            </div>
          </div>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed mt-4">{member.bio}</p>

        {/* Footer stat */}
        <div className="mt-4 pt-4 border-t border-purple-100 dark:border-purple-900/40 flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Mountain size={12} className="text-purple-500" />
            <span className="text-xs font-semibold text-muted-foreground">
              <span className="text-foreground font-black">{member.tours}</span> tours led
            </span>
          </div>
          <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
              <Star key={i} size={11} className="fill-amber-400 text-amber-400" />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function TimelineItem({ milestone, index }: { milestone: typeof milestones[0]; index: number }) {
  const [ref, visible] = useInView(0.2);
  const isLeft = milestone.side === "left";

  return (
    <div
      ref={ref}
      className="relative grid grid-cols-[1fr_auto_1fr] gap-4 items-start"
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(20px)",
        transition: `opacity 0.6s ease ${index * 0.1}s, transform 0.6s ease ${index * 0.1}s`,
      }}
    >
      {/* Left content */}
      <div className={`${isLeft ? "text-right" : ""} pt-1`}>
        {isLeft ? (
          <div className="inline-block rounded-2xl border p-4 text-right
            bg-white dark:bg-zinc-900/70
            border-purple-100 dark:border-purple-900/40
            hover:border-purple-300 dark:hover:border-purple-700/60
            hover:shadow-lg hover:shadow-purple-500/10
            transition-all duration-300">
            <p className="text-base font-bold text-foreground mb-1">{milestone.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{milestone.desc}</p>
          </div>
        ) : (
          <div className="flex justify-end">
            <div className="text-right">
              <span className="text-2xl font-black bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent">
                {milestone.year}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Center dot */}
      <div className="flex flex-col items-center">
        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-violet-600 border-4 border-background flex items-center justify-center shadow-lg shadow-purple-500/30 z-10 shrink-0">
          <div className="w-2 h-2 rounded-full bg-white" />
        </div>
        {index < milestones.length - 1 && (
          <div className="w-0.5 flex-1 mt-1 bg-gradient-to-b from-purple-400/60 to-purple-200/20 dark:from-purple-600/40 dark:to-purple-900/20 min-h-[48px]" />
        )}
      </div>

      {/* Right content */}
      <div className="pt-1">
        {!isLeft ? (
          <div className="inline-block rounded-2xl border p-4
            bg-white dark:bg-zinc-900/70
            border-purple-100 dark:border-purple-900/40
            hover:border-purple-300 dark:hover:border-purple-700/60
            hover:shadow-lg hover:shadow-purple-500/10
            transition-all duration-300">
            <p className="text-base font-bold text-foreground mb-1">{milestone.title}</p>
            <p className="text-xs text-muted-foreground leading-relaxed">{milestone.desc}</p>
          </div>
        ) : (
          <span className="text-2xl font-black bg-gradient-to-r from-purple-500 to-violet-600 bg-clip-text text-transparent">
            {milestone.year}
          </span>
        )}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function About() {
  const [heroRef, heroVisible] = useInView(0.05);
  const [missionRef, missionVisible] = useInView(0.1);

  return (
    <div className="relative overflow-hidden bg-background">
      <style>{`
        @keyframes spinSlow { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes floatY { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-12px); } }
        @keyframes pulseRing { 0% { transform: scale(1); opacity: 0.6; } 100% { transform: scale(1.8); opacity: 0; } }
      `}</style>

      {/* ── HERO ─────────────────────────────────────────────────────────── */}
      <Container className="relative min-h-[88vh] overflow-hidden">
        <div ref={heroRef} className="relative flex flex-col items-center justify-center py-24 w-full h-full">
          {/* Grid */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage: "linear-gradient(rgba(139,92,246,0.045) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.045) 1px, transparent 1px)",
              backgroundSize: "56px 56px",
            }}
          />

          {/* Blobs */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-[120px] pointer-events-none" />
          <div className="absolute top-0 left-0 w-80 h-80 bg-violet-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
          <div className="absolute bottom-0 right-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

          {/* Rotating ring */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none"
            style={{ animation: "spinSlow 50s linear infinite" }}>
            <svg width="800" height="800" viewBox="0 0 800 800" fill="none">
              <circle cx="400" cy="400" r="370" stroke="url(#rg1)" strokeWidth="1" strokeDasharray="6 20" opacity="0.3" />
              <circle cx="400" cy="400" r="300" stroke="url(#rg2)" strokeWidth="1" strokeDasharray="3 28" opacity="0.18" />
              <defs>
                <linearGradient id="rg1" x1="0" y1="0" x2="800" y2="800" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#a855f7" /><stop offset="1" stopColor="#7c3aed" />
                </linearGradient>
                <linearGradient id="rg2" x1="800" y1="0" x2="0" y2="800" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#8b5cf6" /><stop offset="1" stopColor="#6d28d9" />
                </linearGradient>
              </defs>
            </svg>
          </div>

          {/* Floating image badges */}
          {[
            { src: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=200&q=80", label: "Sundarbans", top: "22%", left: "4%", delay: 0 },
            { src: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=200&q=80", label: "Sajek Valley", top: "20%", right: "4%", delay: 0.3 },
            { src: "https://images.unsplash.com/photo-1520942702018-0862200e6873?w=200&q=80", label: "Cox's Bazar", bottom: "22%", left: "3%", delay: 0.6 },
            { src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=200&q=80", label: "Bandarban", bottom: "22%", right: "3%", delay: 0.9 },
          ].map((b) => (
            <div
              key={b.label}
              className="absolute hidden xl:flex items-center gap-2.5 rounded-2xl px-3 py-2.5 border
              bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md
              border-purple-100 dark:border-purple-900/50
              shadow-xl shadow-purple-500/10"
              style={{
                top: b.top, left: (b as any).left, right: (b as any).right, bottom: (b as any).bottom,
                opacity: heroVisible ? 1 : 0,
                animation: heroVisible ? `floatY 5s ease-in-out ${b.delay}s infinite alternate` : "none",
                transition: `opacity 0.8s ease ${b.delay + 0.4}s`,
                zIndex: 10,
              }}
            >
              <img src={b.src} alt={b.label} className="w-10 h-10 rounded-xl object-cover" />
              <div>
                <p className="text-xs font-bold text-foreground leading-none">{b.label}</p>
                <p className="text-[10px] text-muted-foreground mt-0.5">Bangladesh</p>
              </div>
            </div>
          ))}

          {/* Hero text */}
          <div className="relative z-10 flex flex-col items-center text-center">
            <div
              className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 rounded-full px-4 py-1.5 mb-8"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.6s ease 0.1s, transform 0.6s ease 0.1s" }}
            >
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full rounded-full bg-purple-500 opacity-75" style={{ animation: "pulseRing 1.5s ease-out infinite" }} />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                Our Story
              </span>
            </div>

            <h1
              className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight text-foreground mb-6 leading-[1.08]"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s" }}
            >
              We Exist to Show
              <br />
              <span className="relative inline-block">
                <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                  Bangladesh to the World
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 400 8" preserveAspectRatio="none">
                  <path d="M0,5 Q50,0 100,5 Q150,10 200,5 Q250,0 300,5 Q350,10 400,5"
                    stroke="url(#sg)" strokeWidth="2.5" fill="none" strokeLinecap="round"
                    style={{ strokeDasharray: 440, strokeDashoffset: heroVisible ? 0 : 440, transition: "stroke-dashoffset 1.2s ease 0.9s" }}
                  />
                  <defs>
                    <linearGradient id="sg" x1="0" y1="0" x2="400" y2="0">
                      <stop stopColor="#a855f7" /><stop offset="1" stopColor="#7c3aed" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>

            <p
              className="text-lg text-muted-foreground max-w-2xl leading-relaxed mb-10"
              style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? "translateY(0)" : "translateY(16px)", transition: "opacity 0.7s ease 0.35s, transform 0.7s ease 0.35s" }}
            >
              TrekOn was born from a simple belief — Bangladesh is one of the most beautiful, diverse, and underexplored countries on earth. We're here to change that, one journey at a time.
            </p>

            {/* Stats row */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full max-w-2xl"
              style={{ opacity: heroVisible ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}
            >
              {stats.map((s, i) => <StatCard key={s.label} stat={s} index={i} />)}
            </div>
          </div>
        </div>
      </Container>

      {/* ── MISSION ──────────────────────────────────────────────────────── */}
      <Container className="relative py-24">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="relative">
          <div
            ref={missionRef}
            className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center"
            style={{ opacity: missionVisible ? 1 : 0, transform: missionVisible ? "translateY(0)" : "translateY(28px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
          >
            {/* Left: image collage */}
            <div className="relative h-[480px]">
              <img
                src="https://www.shutterstock.com/image-photo/chandranath-temple-located-on-top-600nw-2652601139.jpg?w=800&q=85"
                alt="Bangladesh hills"
                className="absolute top-0 left-0 w-[72%] h-[65%] object-cover rounded-3xl shadow-2xl shadow-purple-500/15 border border-purple-100 dark:border-purple-900/40"
              />
              <img
                src="https://i.ucanews.com/ucanews/uploads/2022/08/check-62f6332c0be71_600.jpeg?w=500&q=85"
                alt="Tea garden"
                className="absolute bottom-0 right-0 w-[55%] h-[50%] object-cover rounded-3xl shadow-2xl shadow-purple-500/15 border border-purple-100 dark:border-purple-900/40"
              />
              {/* Overlap badge */}
              <div className="absolute bottom-[30%] left-[62%] -translate-x-1/2 z-10 bg-white dark:bg-zinc-900 rounded-2xl border border-purple-200 dark:border-purple-800/50 shadow-xl shadow-purple-500/15 px-4 py-3 text-center">
                <p className="text-2xl font-black text-purple-600 dark:text-purple-400">6+</p>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">Years exploring</p>
              </div>
              {/* Decorative ring */}
              <div className="absolute -bottom-4 -left-4 w-24 h-24 rounded-full border-2 border-dashed border-purple-300/50 dark:border-purple-700/40 pointer-events-none" />
            </div>

            {/* Right: text */}
            <div>
              <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 rounded-full px-4 py-1.5 mb-6">
                <Compass size={12} className="text-purple-500" />
                <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">Our Mission</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-snug mb-5">
                Making Bangladesh{" "}
                <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                  Discoverable
                </span>
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                Too many Bangladeshis have never seen the Royal Bengal Tiger. Too many have never stood above the clouds in Sajek or paddled through a flooded forest in Ratargul. TrekOn exists to fix that.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-8">
                We believe domestic tourism is not just an industry — it's a form of national pride. When you travel Bangladesh with TrekOn, you're not just on vacation. You're falling in love with your own country.
              </p>
              <div className="flex items-center gap-4">
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 group">
                  Explore Tours
                  <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    {["AH", "NR", "KU"].map((av, i) => (
                      <div key={av} className="w-8 h-8 rounded-full border-2 border-background bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-[10px] font-bold text-white" style={{ zIndex: 3 - i }}>
                        {av}
                      </div>
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground font-medium">Meet the team</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Container>

      {/* ── VALUES ───────────────────────────────────────────────────────── */}
      <Container className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-purple-500/6 dark:bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="relative">
          <SectionHeader
            eyebrow="What Drives Us"
            title="Our Core Values"
            sub="The principles that guide every tour, every guide, and every decision we make at TrekOn."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {values.map((v, i) => <ValueCard key={v.title} value={v} index={i} />)}
          </div>
        </div>
      </Container>

      {/* ── TEAM ─────────────────────────────────────────────────────────── */}
      <Container className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-violet-500/8 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative">
          <SectionHeader
            eyebrow="The People Behind TrekOn"
            title="Meet Our Team"
            sub="A small, passionate team of Bangladeshis who live and breathe travel — and know every trail, river, and hidden corner of this country."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mt-12">
            {team.map((m, i) => <TeamCard key={m.name} member={m} index={i} />)}
          </div>
        </div>
      </Container>

      {/* ── TIMELINE ─────────────────────────────────────────────────────── */}
      <Container className="relative py-24 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
            backgroundSize: "56px 56px",
          }}
        />
        <div className="absolute top-1/2 left-0 w-80 h-80 bg-purple-500/8 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
        <div className="relative mx-auto" style={{ maxWidth: "56rem" }}>
          <SectionHeader
            eyebrow="How We Got Here"
            title="Our Journey"
            sub="From a three-package startup to Bangladesh's #1 tour platform — here's every milestone along the way."
          />
          <div className="mt-16 space-y-8">
            {milestones.map((m, i) => (
              <TimelineItem key={m.year} milestone={m} index={i} />
            ))}
          </div>
        </div>
      </Container>

      {/* ── BOTTOM CTA ───────────────────────────────────────────────────── */}
      <BottomCTA />
    </div>
  );
}

// ── Shared components ─────────────────────────────────────────────────────────

function SectionHeader({ eyebrow, title, sub }: { eyebrow: string; title: string; sub: string }) {
  const [ref, visible] = useInView(0.2);
  return (
    <div ref={ref} className="text-center"
      style={{ opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(20px)", transition: "opacity 0.7s ease, transform 0.7s ease" }}
    >
      <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 rounded-full px-4 py-1.5 mb-6">
        <TrendingUp size={12} className="text-purple-500" />
        <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">{eyebrow}</span>
      </div>
      <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
        {title.split(" ").map((word, i, arr) =>
          i === arr.length - 1
            ? <span key={i} className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent"> {word}</span>
            : <span key={i}>{word} </span>
        )}
      </h2>
      <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">{sub}</p>
      <div className="flex items-center justify-center gap-3 mt-8">
        <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-400/60" />
        <div className="w-2 h-2 rounded-full bg-purple-500" />
        <div className="w-10 h-px bg-gradient-to-l from-transparent to-purple-400/60" />
      </div>
    </div>
  );
}

function BottomCTA() {
  const [ref, visible] = useInView(0.2);
  return (
    <Container className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
          backgroundSize: "56px 56px",
        }}
      />
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-[700px] h-[300px] bg-purple-500/8 dark:bg-purple-500/12 rounded-full blur-[100px]" />
      </div>
      <div
        ref={ref}
        className="relative mx-auto rounded-3xl overflow-hidden border border-purple-200 dark:border-purple-800/50 bg-white dark:bg-zinc-900/80"
        style={{ maxWidth: "56rem", opacity: visible ? 1 : 0, transform: visible ? "translateY(0)" : "translateY(24px)", transition: "opacity 0.7s ease, transform 0.7s ease", boxShadow: "0 32px 80px rgba(139,92,246,0.12)" }}
      >
        <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500" />

        {/* Background image with overlay */}
        <div className="relative h-56 overflow-hidden">
          <img
            src="https://t4.ftcdn.net/jpg/07/12/26/83/360_F_712268301_Yp0QvVlga8VmQq4m7rCDUdY5OXMnhLKS.jpg?w=600&q=85"
            alt="Bangladesh landscape"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/20" />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2 tracking-tight drop-shadow-lg">
              Ready to Trek Bangladesh?
            </h2>
            <p className="text-white/80 text-base max-w-lg leading-relaxed">
              Join 50,000+ travelers who've discovered their own country through TrekOn.
            </p>
          </div>
        </div>

        <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-5">
          <div className="flex items-center gap-4">
            <div className="flex -space-x-3">
              {["AH", "NR", "KU", "TB"].map((av, i) => (
                <div key={av} className="w-10 h-10 rounded-full border-2 border-white dark:border-zinc-900 bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center text-[11px] font-bold text-white shadow-sm" style={{ zIndex: 4 - i }}>
                  {av}
                </div>
              ))}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">Our team is ready for you</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <p className="text-xs text-muted-foreground">Online now · Avg reply 3 min</p>
              </div>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-white dark:bg-zinc-900/60 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:border-purple-400 transition-all duration-200">
              Learn More
            </button>
            <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 group">
              Start Exploring
              <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
            </button>
          </div>
        </div>
      </div>
    </Container>
  );
}