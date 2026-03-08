import { useEffect, useRef, useState } from "react";
import {
    Mail, Send, Sparkles, Users, MapPin, Bell, CheckCircle2, ArrowRight
} from "lucide-react";
import { Container } from "@/components/shared/Container";

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

const perks = [
    { icon: Bell, text: "Early access to seasonal tour drops" },
    { icon: MapPin, text: "Hidden destination guides every week" },
    { icon: Sparkles, text: "Exclusive flash deals for subscribers only" },
    { icon: Users, text: "Join a community of 50K+ Bangladesh explorers" },
];

const recentAlerts = [
    { text: "New Year's Eve Sajek package just dropped", time: "2h ago", dot: "bg-purple-500" },
    { text: "Winter discount: Bandarban −30% this week", time: "1d ago", dot: "bg-violet-500" },
    { text: "Ratargul monsoon boats now booking", time: "3d ago", dot: "bg-fuchsia-500" },
];

const avatars = [
    { initials: "RI", gradient: "from-purple-500 to-violet-600" },
    { initials: "NJ", gradient: "from-violet-500 to-fuchsia-500" },
    { initials: "TA", gradient: "from-fuchsia-500 to-purple-600" },
    { initials: "SH", gradient: "from-indigo-500 to-violet-600" },
    { initials: "MH", gradient: "from-purple-600 to-indigo-600" },
];

export default function Newsletter() {
    const [sectionRef, sectionVisible] = useInView(0.15);
    const [email, setEmail] = useState("");
    const [submitted, setSubmitted] = useState(false);
    const [focused, setFocused] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = () => {
        if (!email.includes("@") || !email.includes(".")) {
            setError("Please enter a valid email address.");
            return;
        }
        setError("");
        setSubmitted(true);
    };

    return (
        <Container className="relative py-24 overflow-hidden bg-background">
            {/* Grid bg */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />

            {/* Ambient blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[400px] bg-purple-500/8 dark:bg-purple-500/12 rounded-full blur-[100px] pointer-events-none" />
            <div className="absolute top-0 left-0 w-64 h-64 bg-violet-500/8 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-500/8 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 translate-y-1/2" />

            <div className="relative">
                <div
                    ref={sectionRef}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch"
                    style={{
                        opacity: sectionVisible ? 1 : 0,
                        transform: sectionVisible ? "translateY(0)" : "translateY(28px)",
                        transition: "opacity 0.7s ease, transform 0.7s ease",
                    }}
                >

                    {/* ── LEFT: Subscribe card ── */}
                    <div className="relative rounded-3xl overflow-hidden border border-purple-200 dark:border-purple-800/50 bg-white dark:bg-zinc-900/80 flex flex-col">
                        {/* Top gradient bar */}
                        <div className="h-1 w-full bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500" />

                        {/* Purple glow inside card */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/8 dark:bg-purple-500/12 rounded-full blur-3xl pointer-events-none translate-x-1/3 -translate-y-1/3" />

                        <div className="relative flex flex-col flex-1 p-8">

                            {/* Eyebrow */}
                            <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 rounded-full px-4 py-1.5 w-fit mb-6">
                                <Mail size={12} className="text-purple-500" />
                                <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                                    TrekOn Newsletter
                                </span>
                            </div>

                            <h2 className="text-3xl sm:text-4xl font-bold text-foreground tracking-tight leading-tight mb-3">
                                Never Miss a{" "}
                                <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-fuchsia-500 bg-clip-text text-transparent">
                                    Perfect Trip
                                </span>
                            </h2>

                            <p className="text-muted-foreground text-base leading-relaxed mb-8">
                                Get handpicked Bangladesh travel deals, seasonal tour alerts, and destination guides — delivered straight to your inbox. No spam. Unsubscribe anytime.
                            </p>

                            {/* Perks */}
                            <ul className="space-y-3 mb-8">
                                {perks.map(({ icon: Icon, text }) => (
                                    <li key={text} className="flex items-center gap-3">
                                        <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center shrink-0">
                                            <Icon size={13} className="text-purple-600 dark:text-purple-400" />
                                        </div>
                                        <span className="text-sm text-muted-foreground">{text}</span>
                                    </li>
                                ))}
                            </ul>

                            {/* Input */}
                            {!submitted ? (
                                <div className="mt-auto">
                                    <div
                                        className={`flex items-center gap-3 rounded-2xl border px-4 py-3.5 transition-all duration-300 mb-2
                      bg-white dark:bg-zinc-900
                      ${focused
                                                ? "border-purple-400 dark:border-purple-500 shadow-lg shadow-purple-500/15"
                                                : "border-purple-100 dark:border-purple-900/50"
                                            }`}
                                    >
                                        <Mail size={16} className="text-purple-400 shrink-0" />
                                        <input
                                            type="email"
                                            value={email}
                                            onChange={(e) => { setEmail(e.target.value); setError(""); }}
                                            onFocus={() => setFocused(true)}
                                            onBlur={() => setFocused(false)}
                                            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                                            placeholder="your@email.com"
                                            className="flex-1 bg-transparent text-sm text-foreground placeholder:text-muted-foreground/50 outline-none"
                                        />
                                        <button
                                            onClick={handleSubmit}
                                            className="shrink-0 flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold px-4 py-2 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200"
                                        >
                                            <Send size={13} />
                                            Subscribe
                                        </button>
                                    </div>
                                    {error && (
                                        <p className="text-xs text-red-500 dark:text-red-400 ml-1">{error}</p>
                                    )}
                                    <p className="text-[11px] text-muted-foreground ml-1 mt-1">
                                        By subscribing you agree to our privacy policy. Unsubscribe anytime.
                                    </p>
                                </div>
                            ) : (
                                <div className="mt-auto flex items-center gap-4 rounded-2xl border border-emerald-200 dark:border-emerald-800/50 bg-emerald-50 dark:bg-emerald-950/30 px-5 py-4">
                                    <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-900/50 border border-emerald-200 dark:border-emerald-800/40 flex items-center justify-center shrink-0">
                                        <CheckCircle2 size={20} className="text-emerald-600 dark:text-emerald-400" />
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400">You're in!</p>
                                        <p className="text-xs text-emerald-600/80 dark:text-emerald-500 mt-0.5">
                                            Welcome to the TrekOn community. Your first newsletter is on its way.
                                        </p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* ── RIGHT: Community card ── */}
                    <div className="flex flex-col gap-5">

                        {/* Community join panel */}
                        <div className="relative rounded-3xl overflow-hidden border border-purple-200 dark:border-purple-800/50 bg-white dark:bg-zinc-900/80 flex-1">
                            <div className="h-1 w-full bg-gradient-to-r from-violet-500 via-purple-500 to-indigo-500" />

                            {/* Background image with overlay */}
                            <div className="relative h-44 overflow-hidden">
                                <img
                                    src="https://images.unsplash.com/photo-1501854140801-50d01698950b?w=900&q=80"
                                    alt="Bangladesh community hikers"
                                    className="w-full h-full object-cover"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                                {/* Community label */}
                                <div className="absolute top-4 left-4 inline-flex items-center gap-1.5 bg-gradient-to-r from-violet-600 to-purple-600 rounded-full px-3 py-1.5 shadow-lg">
                                    <Users size={11} className="text-white" />
                                    <span className="text-[11px] font-bold text-white">TrekOn Community</span>
                                </div>

                                {/* Members preview */}
                                <div className="absolute bottom-4 left-4 flex items-center gap-3">
                                    <div className="flex -space-x-2.5">
                                        {avatars.map((a, i) => (
                                            <div
                                                key={a.initials}
                                                className={`w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-gradient-to-br ${a.gradient} flex items-center justify-center text-[10px] font-bold text-white shadow-sm`}
                                                style={{ zIndex: avatars.length - i }}
                                            >
                                                {a.initials}
                                            </div>
                                        ))}
                                        <div className="w-8 h-8 rounded-full border-2 border-white dark:border-zinc-900 bg-purple-100 dark:bg-purple-900 flex items-center justify-center text-[9px] font-bold text-purple-600 dark:text-purple-400" style={{ zIndex: 0 }}>
                                            +50K
                                        </div>
                                    </div>
                                    <p className="text-xs text-white/90 font-medium drop-shadow">Active explorers this month</p>
                                </div>
                            </div>

                            <div className="p-5">
                                <h3 className="text-lg font-bold text-foreground mb-1.5">
                                    Join Bangladesh's Biggest Trekker Community
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                                    Share trip reports, find travel buddies, get local tips, and connect with fellow explorers from every corner of Bangladesh.
                                </p>
                                <button className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white text-sm font-bold py-3 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 group">
                                    Join the Community
                                    <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                                </button>
                            </div>
                        </div>

                        {/* Recent alerts feed */}
                        <div className="rounded-3xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-zinc-900/80 overflow-hidden">
                            <div className="h-1 w-full bg-gradient-to-r from-fuchsia-500 via-purple-500 to-violet-500" />
                            <div className="p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-6 h-6 rounded-lg bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center">
                                        <Bell size={12} className="text-purple-600 dark:text-purple-400" />
                                    </div>
                                    <span className="text-xs font-bold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                                        Latest Alerts
                                    </span>
                                    {/* Live pulse */}
                                    <span className="relative flex h-2 w-2 ml-auto">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-purple-400 opacity-75" />
                                        <span className="relative inline-flex h-2 w-2 rounded-full bg-purple-600" />
                                    </span>
                                </div>
                                <ul className="space-y-3">
                                    {recentAlerts.map((alert, i) => (
                                        <li
                                            key={i}
                                            className="flex items-start gap-3 group cursor-pointer"
                                        >
                                            <div className={`w-2 h-2 rounded-full ${alert.dot} mt-1.5 shrink-0`} />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-xs font-medium text-foreground leading-snug group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200 line-clamp-1">
                                                    {alert.text}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground mt-0.5">{alert.time}</p>
                                            </div>
                                            <ArrowRight size={12} className="text-muted-foreground/40 group-hover:text-purple-500 mt-0.5 shrink-0 transition-colors duration-200" />
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
        </Container>
    );
}