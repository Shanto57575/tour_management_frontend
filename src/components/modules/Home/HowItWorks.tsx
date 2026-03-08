import { useEffect, useRef, useState } from "react";
import { Search, Calendar, Compass, CheckCircle2, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";

const steps = [
    {
        number: "01",
        icon: Search,
        title: "Discover Your Destination",
        description:
            "Browse handpicked destinations across all 64 districts of Bangladesh. Filter by budget, duration, season, or vibe — from wild jungles to serene tea gardens.",
        details: ["64 districts covered", "Advanced filters", "Curated recommendations"],
        color: "from-purple-500 to-violet-600",
        glow: "rgba(139,92,246,0.25)",
    },
    {
        number: "02",
        icon: Calendar,
        title: "Customize Your Plan",
        description:
            "Pick your dates, group size, and preferences. Our smart planner builds a full itinerary — transport, stays, meals, and activities — tailored just for you.",
        details: ["Smart itinerary builder", "Group & solo options", "Flexible scheduling"],
        color: "from-violet-500 to-fuchsia-600",
        glow: "rgba(167,139,250,0.25)",
    },
    {
        number: "03",
        icon: Compass,
        title: "Trek On & Explore",
        description:
            "Set off with confidence. Your guide, transport, and accommodations are all set. Our 24/7 support team has your back every step of the way.",
        details: ["Expert local guides", "24/7 live support", "Instant confirmations"],
        color: "from-fuchsia-500 to-purple-600",
        glow: "rgba(217,70,239,0.2)",
    },
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

function StepCard({
    step,
    index,
    isLast,
}: {
    step: typeof steps[0];
    index: number;
    isLast: boolean;
}) {
    const [ref, visible] = useInView();
    const [hovered, setHovered] = useState(false);
    const Icon = step.icon;

    return (
        <div className="relative flex flex-col items-center">
            {/* Connector line between steps */}
            {!isLast && (
                <div className="hidden lg:block absolute top-16 left-[calc(50%+80px)] w-[calc(100%-160px)] h-px z-0"
                    style={{
                        background: "linear-gradient(to right, rgba(139,92,246,0.5), rgba(167,139,250,0.2))",
                    }}
                >
                    {/* Animated travel dot */}
                    <div
                        className="absolute top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-purple-500"
                        style={{
                            animation: visible ? "travelDot 2.5s ease-in-out infinite" : "none",
                            animationDelay: `${index * 0.4}s`,
                        }}
                    />
                    <ArrowRight
                        size={14}
                        className="absolute right-0 top-1/2 -translate-y-1/2 text-purple-400/60"
                    />
                </div>
            )}

            <div
                ref={ref}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                className="relative w-full rounded-3xl border overflow-hidden cursor-default z-10
          bg-white dark:bg-zinc-900/70
          border-purple-100 dark:border-purple-900/40
          hover:border-purple-400 dark:hover:border-purple-500
          backdrop-blur-sm"
                style={{
                    opacity: visible ? 1 : 0,
                    transform: visible ? "translateY(0) scale(1)" : "translateY(32px) scale(0.97)",
                    transition: `opacity 0.6s ease ${index * 0.15}s, transform 0.6s ease ${index * 0.15}s, box-shadow 0.3s ease, border-color 0.3s ease`,
                    boxShadow: hovered
                        ? `0 24px 60px ${step.glow}, 0 0 0 1px rgba(139,92,246,0.2)`
                        : "0 4px 24px rgba(139,92,246,0.06)",
                }}
            >
                {/* Top gradient bar */}
                <div className={`h-1 w-full bg-gradient-to-r ${step.color}`} />

                {/* Large faded step number */}
                <div
                    className="absolute top-2 right-2 text-[66px] font-black leading-none select-none pointer-events-none"
                    style={{
                        background: `linear-gradient(135deg, rgba(139,92,246,0.08), transparent)`,
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                        backgroundClip: "text",
                    }}
                >
                    {step.number}
                </div>

                <div className="p-7">
                    <div className="flex items-center gap-4 mb-6">
                        <div
                            className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center shadow-lg shrink-0`}
                            style={{
                                transform: hovered ? "scale(1.08)" : "scale(1)",
                                transition: "transform 0.3s ease",
                                boxShadow: hovered ? `0 12px 32px ${step.glow}` : "none",
                            }}
                        >
                            <Icon size={24} color="white" strokeWidth={1.8} />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-[11px] font-bold uppercase tracking-widest text-purple-500 dark:text-purple-400 mb-0.5">
                                Step {step.number}
                            </span>
                            <h3 className="text-lg font-bold text-foreground leading-tight">
                                {step.title}
                            </h3>
                        </div>
                    </div>

                    {/* Description */}
                    <p className="font-open-sans text-sm text-muted-foreground leading-relaxed mb-6">
                        {step.description}
                    </p>

                    {/* Detail checklist */}
                    <ul className="space-y-2">
                        {step.details.map((detail) => (
                            <li key={detail} className="flex items-center gap-2.5">
                                <div className={`w-4 h-4 rounded-full bg-gradient-to-br ${step.color} flex items-center justify-center shrink-0`}>
                                    <CheckCircle2 size={10} color="white" strokeWidth={2.5} />
                                </div>
                                <span className="text-xs font-medium text-muted-foreground font-open-sans">{detail}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}

export default function HowItWorks() {
    const [headerRef, headerVisible] = useInView(0.2);
    const [bottomRef, bottomVisible] = useInView(0.2);

    return (
        <Container className="relative py-24 overflow-hidden bg-background">
            <style>{`
        @keyframes travelDot {
          0%   { left: 0%;   opacity: 1; }
          80%  { left: 95%;  opacity: 1; }
          100% { left: 95%;  opacity: 0; }
        }
      `}</style>

            {/* Grid bg */}
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />
            <div className="absolute bottom-0 left-1/3 w-96 h-96 bg-violet-500/8 dark:bg-violet-500/12 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">

                {/* Header */}
                <div
                    ref={headerRef}
                    className="text-center mb-16"
                    style={{
                        opacity: headerVisible ? 1 : 0,
                        transform: headerVisible ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity 0.7s ease, transform 0.7s ease",
                    }}
                >
                    <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 rounded-full px-4 py-1.5 mb-6">
                        <Compass size={12} className="text-purple-500" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                            Simple as 1 — 2 — 3
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        How{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                            TrekOn Works
                        </span>
                    </h2>
                    <p className="font-open-sans text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                        From first click to first footstep — we've made planning your Bangladesh adventure effortless.
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-400/60" />
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <div className="w-10 h-px bg-gradient-to-l from-transparent to-purple-400/60" />
                    </div>
                </div>

                {/* Steps grid */}
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative">
                    {steps.map((step, i) => (
                        <StepCard key={step.number} step={step} index={i} isLast={i === steps.length - 1} />
                    ))}
                </div>

                {/* Bottom experience strip */}
                <div
                    ref={bottomRef}
                    className="mt-16 rounded-3xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-zinc-900/60 overflow-hidden"
                    style={{
                        opacity: bottomVisible ? 1 : 0,
                        transform: bottomVisible ? "translateY(0)" : "translateY(24px)",
                        transition: "opacity 0.7s ease 0.2s, transform 0.7s ease 0.2s",
                    }}
                >
                    {/* Top gradient bar */}
                    <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600" />

                    <div className="p-8 flex flex-col sm:flex-row items-center justify-between gap-6">
                        <div className="text-center sm:text-left">
                            <h3 className="text-xl font-bold text-foreground mb-1">
                                Ready to start your journey?
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Join 50,000+ travelers who've already explored Bangladesh with TrekOn.
                            </p>
                        </div>
                        <div className="flex items-center gap-3 shrink-0">
                            {/* Stacked avatars */}
                            <div className="flex -space-x-2.5">
                                {["RI", "NJ", "TA", "SH"].map((initials, i) => (
                                    <div
                                        key={initials}
                                        className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 flex items-center justify-center text-[10px] font-bold text-white shadow-sm"
                                        style={{
                                            background: `linear-gradient(135deg, hsl(${260 + i * 20}, 80%, 55%), hsl(${280 + i * 20}, 80%, 45%))`,
                                            zIndex: 4 - i,
                                        }}
                                    >
                                        {initials}
                                    </div>
                                ))}
                                <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-purple-100 dark:bg-purple-900/60 flex items-center justify-center text-[9px] font-bold text-purple-600 dark:text-purple-400"
                                    style={{ zIndex: 0 }}>
                                    +50K
                                </div>
                            </div>
                            <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all duration-200 shadow-md shadow-purple-500/30 hover:shadow-purple-500/50 hover:-translate-y-0.5 group">
                                Get Started
                                <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}