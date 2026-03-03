import { useState } from "react";
import {
  ArrowRight,
  Compass,
  Calendar,
  Users,
  Shield,
  Zap,
  Map,
  TrendingUp,
  CheckCircle2,
  Award,
  MoveRight,
} from "lucide-react";

const stats = [
  { value: "12K+", label: "Tours Managed" },
  { value: "340+", label: "Destinations" },
  { value: "98%", label: "Satisfaction" },
  { value: "50K+", label: "Travelers" },
];

const features = [
  { icon: Calendar, title: "Smart Scheduling", desc: "Conflict detection, availability slots, and automated reminders that keep operations airtight." },
  { icon: Users, title: "Group Management", desc: "Unlimited group sizes, guide assignment, dietary tracking — one command centre." },
  { icon: Shield, title: "Secure Payments", desc: "PCI-DSS compliant, multi-currency, instant invoicing and live financial dashboards." },
  { icon: Zap, title: "Live Push Alerts", desc: "Real-time itinerary changes, weather alerts and emergencies land on every device instantly." },
  { icon: Map, title: "Route Intelligence", desc: "AI-optimised routes, offline maps and dynamic re-routing built for the field." },
  { icon: TrendingUp, title: "Analytics & Reports", desc: "Revenue trends, retention curves and efficiency metrics that actually drive decisions." },
];

const pillars = [
  "Purpose-built for operators, not generic businesses",
  "Offline-first for remote and rugged destinations",
  "Designed by real guides, tested in real terrain",
  "Scales from solo operators to enterprise fleets",
];

export default function About() {
  const [hovered, setHovered] = useState<number | null>(null);

  return (
    <div className="bg-white dark:bg-[#0a0a0f] text-gray-900 dark:text-gray-100 min-h-screen overflow-x-hidden">
      <style>{`
        @keyframes slideRight {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes fillUp {
          0%   { height: 0%; }
          100% { height: 100%; }
        }
        @keyframes revealLeft {
          0%   { clip-path: inset(0 100% 0 0); }
          100% { clip-path: inset(0 0% 0 0); }
        }
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(18px); }
          to   { opacity:1; transform:translateY(0); }
        }
        @keyframes ticker {
          from { transform:translateX(0); }
          to   { transform:translateX(-50%); }
        }
        .anim-a { animation: fadeUp .65s ease both .05s; }
        .anim-b { animation: fadeUp .65s ease both .18s; }
        .anim-c { animation: fadeUp .65s ease both .32s; }
        .anim-d { animation: fadeUp .65s ease both .46s; }
        .ticker  { animation: ticker 26s linear infinite; }

        /* Button — wipe fill from left */
        .btn-wipe {
          position: relative;
          overflow: hidden;
          transition: color .28s ease;
        }
        .btn-wipe::before {
          content: '';
          position: absolute;
          inset: 0;
          background: #7c3aed;
          transform: translateX(-102%);
          transition: transform .32s cubic-bezier(.4,0,.2,1);
          z-index: 0;
        }
        .btn-wipe:hover::before { transform: translateX(0); }
        .btn-wipe:hover { color: #fff; }
        .btn-wipe > * { position: relative; z-index: 1; }

        /* Button — border draw */
        .btn-draw {
          position: relative;
          overflow: hidden;
        }
        .btn-draw::after {
          content: '';
          position: absolute;
          inset: 0;
          border: 1.5px solid #7c3aed;
          border-radius: inherit;
          transform: scaleX(0);
          transform-origin: left center;
          transition: transform .35s cubic-bezier(.4,0,.2,1);
        }
        .btn-draw:hover::after { transform: scaleX(1); }

        /* Feature card — left accent bar grow */
        .feat-card::before {
          content: '';
          position: absolute;
          left: 0; top: 0;
          width: 3px;
          height: 0;
          background: #7c3aed;
          border-radius: 0 2px 2px 0;
          transition: height .35s cubic-bezier(.4,0,.2,1);
        }
        .feat-card:hover::before { height: 100%; }

        /* Stat number colour flash */
        .stat-val {
          transition: color .22s ease;
        }
        .stat-wrap:hover .stat-val { color: #7c3aed; }
      `}</style>

      <section className="relative min-h-[92vh] flex items-center px-8 md:px-16 lg:px-24 pt-20 pb-16">

        <div className="absolute right-0 top-1/2 -translate-y-1/2 text-[28vw] font-black
          text-gray-100 dark:text-white/[0.025] select-none pointer-events-none leading-none
          translate-x-8 tabular-nums">
          T
        </div>

        <div className="hidden lg:block absolute left-[46%] top-16 bottom-16
          w-px bg-gray-200 dark:bg-gray-800" />

        <div className="relative max-w-6xl w-full mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div>
            <div className="anim-a flex items-center gap-3 mb-8">
              <div className="w-8 h-8 rounded-lg bg-violet-600 flex items-center justify-center">
                <Compass size={16} className="text-white" />
              </div>
              <span className="text-xs font-semibold uppercase tracking-[0.18em]
                text-violet-600 dark:text-violet-400">
                TrekOn — Tour Management
              </span>
            </div>

            <h1 className="anim-b text-[52px] md:text-[68px] font-black leading-[1.0]
              tracking-[-0.03em] mb-8
              text-gray-900 dark:text-white">
              The operating
              <br />
              system for{" "}
              <span className="relative inline-block">
                <span className="relative z-10">tours.</span>
                <span className="absolute bottom-1 left-0 w-full h-3
                  bg-violet-600/20 dark:bg-violet-500/25 -z-0" />
              </span>
            </h1>

            <p className="anim-c text-[17px] text-gray-500 dark:text-gray-400
              leading-relaxed max-w-md mb-12">
              TrekOn is the all-in-one platform built for operators who believe
              extraordinary experiences deserve extraordinary tools — not
              spreadsheets.
            </p>

            {/* Buttons */}
            <div className="anim-d flex flex-wrap gap-4 items-center">

              {/* Primary — wipe fill */}
              <button className="btn-wipe
                inline-flex items-center gap-2.5
                px-6 py-3 rounded-lg
                border border-violet-600
                text-violet-700 dark:text-violet-300
                font-semibold text-[15px]
                dark:border-violet-500">
                <span>Start Free Trial</span>
                <ArrowRight size={15}
                  className="transition-transform duration-300 group-hover:translate-x-1" />
              </button>

              {/* Ghost — border draw */}
              <button className="btn-draw
                inline-flex items-center gap-2.5
                px-6 py-3 rounded-lg
                border border-gray-200 dark:border-gray-700
                text-gray-600 dark:text-gray-400
                hover:text-violet-600 dark:hover:text-violet-400
                font-semibold text-[15px]
                transition-colors duration-300">
                <span>Watch Demo</span>
                <MoveRight size={15} />
              </button>
            </div>
          </div>

          {/* Right — stat stack */}
          <div className="grid grid-cols-2 gap-4">
            {stats.map((s, i) => (
              <div key={i}
                className="stat-wrap group rounded-2xl p-7
                  border border-gray-100 dark:border-gray-800/80
                  bg-gray-50 dark:bg-gray-900/50
                  hover:border-violet-200 dark:hover:border-violet-800/60
                  transition-all duration-300 cursor-default
                  hover:shadow-lg hover:shadow-violet-500/5
                  hover:-translate-y-0.5">
                <p className="stat-val text-[42px] font-black tracking-tight
                  text-gray-900 dark:text-white leading-none mb-2">
                  {s.value}
                </p>
                <p className="text-sm text-gray-500 dark:text-gray-500 font-medium">
                  {s.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          TICKER
      ════════════════════════════════════ */}
      <div className="border-y border-gray-100 dark:border-gray-800/80 py-3
        bg-gray-50/80 dark:bg-gray-900/40 overflow-hidden">
        <div className="ticker flex gap-12 whitespace-nowrap">
          {Array(3).fill([
            "Booking Automation", "Live Itineraries", "Multi-Currency",
            "Guide Assignment", "Offline Maps", "Group Manifests",
            "Revenue Analytics", "Traveler Notifications", "API Integrations",
          ]).flat().map((item, i) => (
            <span key={i}
              className="text-[13px] font-medium text-gray-400 dark:text-gray-600
                inline-flex items-center gap-3">
              <span className="w-1 h-1 rounded-full bg-violet-500 inline-block" />
              {item}
            </span>
          ))}
        </div>
      </div>

      {/* ════════════════════════════════════
          STORY — full-bleed asymmetric
      ════════════════════════════════════ */}
      <section className="px-8 md:px-16 lg:px-24 py-28">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-[1fr_2px_1fr] gap-16 items-start">

          {/* Left label column */}
          <div className="lg:pt-2">
            <span className="inline-block text-[11px] uppercase tracking-[0.2em]
              font-bold text-violet-600 dark:text-violet-400 mb-4">
              Our Story
            </span>
            <h2 className="text-4xl md:text-5xl font-black leading-tight
              tracking-tight text-gray-900 dark:text-white mb-6">
              Born on
              <br />
              the trail.
            </h2>
            {/* Divider dot-line */}
            <div className="flex items-center gap-3 mt-8">
              <div className="w-2 h-2 rounded-full bg-violet-600" />
              <div className="flex-1 h-px bg-gray-200 dark:bg-gray-800" />
            </div>
          </div>

          {/* Thin rule */}
          <div className="hidden lg:block w-px self-stretch bg-gray-100 dark:bg-gray-800" />

          {/* Right text column */}
          <div>
            <p className="text-[17px] text-gray-600 dark:text-gray-400
              leading-relaxed mb-6">
              TrekOn was built in 2019 by guides who were exhausted managing
              tours across disconnected spreadsheets, WhatsApp threads, and
              handwritten manifests. We wanted software that worked as hard as
              we did — in the mountains, not just in the office.
            </p>
            <p className="text-[17px] text-gray-600 dark:text-gray-400
              leading-relaxed mb-10">
              Every feature exists because an operator asked for it in the
              field. That philosophy hasn't changed.
            </p>
            <ul className="space-y-4">
              {pillars.map((p, i) => (
                <li key={i}
                  className="flex items-start gap-3
                    text-[15px] text-gray-700 dark:text-gray-300">
                  <CheckCircle2 size={16}
                    className="text-violet-600 dark:text-violet-400 mt-0.5 flex-shrink-0" />
                  {p}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          FEATURES — editorial bento-ish grid
      ════════════════════════════════════ */}
      <section className="px-8 md:px-16 lg:px-24 py-20
        bg-gray-50/60 dark:bg-gray-900/30 border-y
        border-gray-100 dark:border-gray-800/60">
        <div className="max-w-6xl mx-auto">

          {/* Section label row */}
          <div className="flex items-end justify-between mb-14 flex-wrap gap-4">
            <div>
              <span className="text-[11px] uppercase tracking-[0.2em] font-bold
                text-violet-600 dark:text-violet-400 block mb-3">
                Platform Features
              </span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tight
                text-gray-900 dark:text-white leading-tight">
                Everything you need.
                <br />
                <span className="text-gray-400 dark:text-gray-600">
                  Nothing you don't.
                </span>
              </h2>
            </div>
            <span className="text-sm text-gray-400 dark:text-gray-600
              font-medium self-end pb-1">
              6 core modules
            </span>
          </div>

          {/* Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-px
            bg-gray-200 dark:bg-gray-800/60 rounded-2xl overflow-hidden">
            {features.map((f, i) => {
              const Icon = f.icon;
              const isActive = hovered === i;
              return (
                <div key={i}
                  onMouseEnter={() => setHovered(i)}
                  onMouseLeave={() => setHovered(null)}
                  className="feat-card relative group cursor-default
                    bg-white dark:bg-[#0a0a0f] p-8
                    transition-colors duration-300
                    hover:bg-violet-50 dark:hover:bg-violet-950/20">

                  {/* Number */}
                  <span className="text-[11px] font-bold tabular-nums
                    text-gray-300 dark:text-gray-700
                    group-hover:text-violet-400 dark:group-hover:text-violet-600
                    transition-colors duration-300 mb-6 block">
                    0{i + 1}
                  </span>

                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl mb-5
                    bg-gray-100 dark:bg-gray-800/80
                    group-hover:bg-violet-100 dark:group-hover:bg-violet-900/40
                    flex items-center justify-center
                    transition-colors duration-300">
                    <Icon size={18}
                      className={`transition-colors duration-300
                        ${isActive
                          ? "text-violet-600 dark:text-violet-400"
                          : "text-gray-400 dark:text-gray-600"}`} />
                  </div>

                  <h3 className="font-bold text-[16px] text-gray-900 dark:text-white
                    mb-2.5 transition-colors duration-300
                    group-hover:text-violet-700 dark:group-hover:text-violet-300">
                    {f.title}
                  </h3>
                  <p className="text-[14px] text-gray-500 dark:text-gray-500
                    leading-relaxed">
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ════════════════════════════════════
          CTA — stark, minimal, high contrast
      ════════════════════════════════════ */}
      <section className="px-8 md:px-16 lg:px-24 py-28">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-[1fr_auto] gap-12 items-center">

            <div>
              <div className="flex items-center gap-2 mb-6">
                <Award size={14} className="text-violet-500" />
                <span className="text-xs font-semibold uppercase tracking-[0.18em]
                  text-violet-600 dark:text-violet-400">
                  Limited Beta Spots Open
                </span>
              </div>
              <h2 className="text-4xl md:text-[56px] font-black leading-[1.05]
                tracking-tight text-gray-900 dark:text-white mb-5">
                Ready to run your
                <br />
                best tours yet?
              </h2>
              <p className="text-[17px] text-gray-500 dark:text-gray-400
                leading-relaxed max-w-lg">
                Join hundreds of operators who've ditched the spreadsheets.
                Free 30-day trial, no credit card required.
              </p>
            </div>

            {/* CTA button stack */}
            <div className="flex flex-col gap-4 min-w-[220px]">

              {/* Primary — full wipe, bold */}
              <button className="btn-wipe
                w-full flex items-center justify-between
                px-6 py-4 rounded-xl
                border-2 border-violet-600
                text-violet-700 dark:text-violet-300
                font-bold text-[15px]
                dark:border-violet-500">
                <span>Get Started Free</span>
                <ArrowRight size={16} />
              </button>

              {/* Secondary — border draw */}
              <button className="btn-draw
                w-full flex items-center justify-between
                px-6 py-4 rounded-xl
                border border-gray-200 dark:border-gray-700
                text-gray-600 dark:text-gray-400
                hover:text-violet-600 dark:hover:text-violet-400
                font-semibold text-[15px]
                transition-colors duration-300">
                <span>Book a Demo</span>
                <MoveRight size={16} />
              </button>

              <p className="text-center text-xs text-gray-400 dark:text-gray-600 pt-1">
                No credit card · Cancel anytime
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}