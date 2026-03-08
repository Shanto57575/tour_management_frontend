import { useEffect, useRef, useState } from "react";
import { Star, MapPin, ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { Container } from "@/components/shared/Container";

const testimonials = [
    {
        name: "Rafiul Islam",
        location: "Dhaka",
        tour: "Sundarbans Expedition",
        rating: 5,
        avatar: "RI",
        review:
            "TrekOn made our Sundarbans trip absolutely magical. The guide knew every creek and channel by heart. Saw a Royal Bengal Tiger on day two — something I'll never forget as long as I live.",
        color: "from-purple-500 to-violet-600",
    },
    {
        name: "Nusrat Jahan",
        location: "Chittagong",
        tour: "Bandarban Hill Trek",
        rating: 5,
        avatar: "NJ",
        review:
            "The Bandarban package was flawlessly organized. Accommodation, transport, meals — everything was taken care of. Our guide Karim bhai was incredibly knowledgeable about the hill tribes.",
        color: "from-violet-500 to-purple-700",
    },
    {
        name: "Tanvir Ahmed",
        location: "Sylhet",
        tour: "Cox's Bazar Retreat",
        rating: 5,
        avatar: "TA",
        review:
            "Booked a last-minute Cox's Bazar trip and TrekOn pulled it off in under 10 minutes. Best beach sunrise I've ever witnessed. The hotel selection was top-notch for the price.",
        color: "from-purple-600 to-fuchsia-600",
    },
    {
        name: "Sabrina Hossain",
        location: "Rajshahi",
        tour: "Sreemangal Tea Tour",
        rating: 5,
        avatar: "SH",
        review:
            "Seven layers of tea at Nilkantha — worth every taka. TrekOn's itinerary gave us enough time to truly soak in Sreemangal instead of rushing. Perfectly paced, perfectly planned.",
        color: "from-violet-600 to-indigo-600",
    },
    {
        name: "Mehedi Hassan",
        location: "Khulna",
        tour: "Rangamati Lake Tour",
        rating: 5,
        avatar: "MH",
        review:
            "The Kaptai Lake boat ride at sunset was otherworldly. TrekOn handled every detail and the 24/7 support actually responded at 11pm when I had a question. Truly exceptional service.",
        color: "from-purple-500 to-violet-500",
    },
    {
        name: "Fatema Akter",
        location: "Mymensingh",
        tour: "Bagerhat Heritage Trail",
        rating: 5,
        avatar: "FA",
        review:
            "As a history lover, the Bagerhat mosque city tour exceeded every expectation. Our guide's storytelling brought the Sultanate era to life. TrekOn clearly invests in quality people.",
        color: "from-fuchsia-500 to-purple-600",
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

function StarRow({ rating }: { rating: number }) {
    return (
        <div className="flex gap-0.5">
            {[...Array(5)].map((_, i) => (
                <Star key={i} size={12} className={i < rating ? "fill-amber-400 text-amber-400" : "text-muted-foreground/20"} />
            ))}
        </div>
    );
}

export default function Testimonials() {
    const [active, setActive] = useState(0);
    const [animating, setAnimating] = useState(false);
    const [direction, setDirection] = useState<"left" | "right">("right");
    const [headerRef, headerVisible] = useInView(0.2);
    const autoRef = useRef<ReturnType<typeof setInterval> | null>(null);

    const go = (dir: "left" | "right") => {
        if (animating) return;
        setDirection(dir);
        setAnimating(true);
        setTimeout(() => {
            setActive((prev) =>
                dir === "right"
                    ? (prev + 1) % testimonials.length
                    : (prev - 1 + testimonials.length) % testimonials.length
            );
            setAnimating(false);
        }, 200);
    };

    useEffect(() => {
        autoRef.current = setInterval(() => go("right"), 5000);
        return () => { if (autoRef.current) clearInterval(autoRef.current); };
    }, [animating]);

    const t = testimonials[active];
    const prev = testimonials[(active - 1 + testimonials.length) % testimonials.length];
    const next = testimonials[(active + 1) % testimonials.length];

    return (
        <Container className="relative py-24 overflow-hidden bg-background">
            {/* Grid bg */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />
            {/* Blobs */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-purple-500/8 dark:bg-purple-500/12 rounded-full blur-3xl pointer-events-none" />

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
                        <Star size={12} className="fill-purple-500 text-purple-500" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                            Real Stories, Real Travelers
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        What Our{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                            Travelers Say
                        </span>
                    </h2>
                    <p className="font-open-sans text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                        Thousands of Bangladeshis have explored their own backyard with TrekOn. Here's what they experienced.
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-400/60" />
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <div className="w-10 h-px bg-gradient-to-l from-transparent to-purple-400/60" />
                    </div>
                </div>

                {/* Stage */}
                <div className="relative flex items-center justify-center gap-4 min-h-[340px]">

                    {/* Prev ghost card */}
                    <div
                        className="hidden md:block w-64 shrink-0 cursor-pointer select-none"
                        onClick={() => go("left")}
                        style={{ opacity: 0.4, transform: "scale(0.88) translateX(24px)", transition: "all 0.3s ease" }}
                    >
                        <GhostCard t={prev} />
                    </div>

                    {/* Main active card */}
                    <div
                        className="flex-1 max-w-xl z-10"
                        style={{
                            opacity: animating ? 0 : 1,
                            transform: animating
                                ? `translateX(${direction === "right" ? "-40px" : "40px"}) scale(0.97)`
                                : "translateX(0) scale(1)",
                            transition: "opacity 0.32s ease, transform 0.32s ease",
                        }}
                    >
                        <div className="relative rounded-3xl border overflow-hidden
              bg-white dark:bg-zinc-900/80
              border-purple-200 dark:border-purple-800/50
              shadow-2xl shadow-purple-500/10 dark:shadow-purple-500/20
              p-8"
                        >
                            {/* Gradient top strip */}
                            <div className={`absolute top-0 left-0 right-0 h-1 bg-gradient-to-r ${t.color}`} />

                            {/* Quote mark — small, tasteful */}
                            <div className="absolute top-6 right-7 opacity-15 dark:opacity-10 pointer-events-none select-none">
                                <Quote size={36} className="text-purple-500" strokeWidth={1.5} />
                            </div>

                            {/* Stars */}
                            <div className="mb-5">
                                <StarRow rating={t.rating} />
                            </div>

                            {/* Review */}
                            <p className="text-sm text-foreground leading-relaxed mb-7 pr-6 font-open-sans">
                                "{t.review}"
                            </p>

                            {/* Divider */}
                            <div className="h-px bg-gradient-to-r from-purple-200/60 via-purple-300/40 to-transparent dark:from-purple-800/40 dark:via-purple-700/30 mb-5" />

                            {/* Author row */}
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${t.color} flex items-center justify-center shadow-md`}>
                                        <span className="text-xs font-bold text-white">{t.avatar}</span>
                                    </div>
                                    <div>
                                        <p className="text-sm font-semibold text-foreground leading-tight">{t.name}</p>
                                        <div className="flex items-center gap-1 mt-0.5">
                                            <MapPin size={10} className="text-purple-500" />
                                            <span className="text-xs text-muted-foreground font-open-sans">{t.location}</span>
                                        </div>
                                    </div>
                                </div>
                                <div className="bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/50 rounded-full px-3 py-1">
                                    <span className="text-[11px] font-medium text-purple-600 dark:text-purple-400 font-open-sans">{t.tour}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Next ghost card */}
                    <div
                        className="hidden md:block w-64 shrink-0 cursor-pointer select-none"
                        onClick={() => go("right")}
                        style={{ opacity: 0.4, transform: "scale(0.88) translateX(-24px)", transition: "all 0.3s ease" }}
                    >
                        <GhostCard t={next} />
                    </div>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-center gap-6 mt-10">
                    <button
                        onClick={() => go("left")}
                        className="w-10 h-10 rounded-full flex items-center justify-center border
              border-purple-200 dark:border-purple-800/60
              bg-white dark:bg-zinc-900/60
              hover:bg-purple-50 dark:hover:bg-purple-950/60
              hover:border-purple-400 dark:hover:border-purple-500
              text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400
              transition-all duration-200 shadow-sm"
                    >
                        <ChevronLeft size={18} />
                    </button>

                    {/* Dot indicators */}
                    <div className="flex items-center gap-2">
                        {testimonials.map((_, i) => (
                            <button
                                key={i}
                                onClick={() => {
                                    if (animating || i === active) return;
                                    setDirection(i > active ? "right" : "left");
                                    setAnimating(true);
                                    setTimeout(() => { setActive(i); setAnimating(false); }, 320);
                                }}
                                className="transition-all duration-300 rounded-full"
                                style={{
                                    width: i === active ? "24px" : "8px",
                                    height: "8px",
                                    background: i === active
                                        ? "linear-gradient(to right, #a855f7, #7c3aed)"
                                        : undefined,
                                }}
                            >
                                {i !== active && (
                                    <span className="block w-2 h-2 rounded-full bg-purple-200 dark:bg-purple-800 hover:bg-purple-400 dark:hover:bg-purple-600 transition-colors duration-200" />
                                )}
                            </button>
                        ))}
                    </div>

                    <button
                        onClick={() => go("right")}
                        className="w-10 h-10 rounded-full flex items-center justify-center border
              border-purple-200 dark:border-purple-800/60
              bg-white dark:bg-zinc-900/60
              hover:bg-purple-50 dark:hover:bg-purple-950/60
              hover:border-purple-400 dark:hover:border-purple-500
              text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400
              transition-all duration-200 shadow-sm"
                    >
                        <ChevronRight size={18} />
                    </button>
                </div>

                {/* Bottom trust bar */}
                <div
                    className="flex flex-wrap items-center justify-center gap-8 mt-16 pt-10 border-t border-border"
                    style={{
                        opacity: headerVisible ? 1 : 0,
                        transition: "opacity 0.7s ease 0.5s",
                    }}
                >
                    {[
                        { value: "4.9★", label: "Average Rating" },
                        { value: "50K+", label: "Reviews" },
                        { value: "98%", label: "Recommend Us" },
                        { value: "6 Yrs", label: "Of Trust" },
                    ].map((item) => (
                        <div key={item.label} className="text-center">
                            <p className="text-2xl font-bold text-purple-600 dark:text-purple-400">{item.value}</p>
                            <p className="text-xs text-muted-foreground uppercase tracking-wider mt-0.5">{item.label}</p>
                        </div>
                    ))}
                </div>

            </div>
        </Container>
    );
}

function GhostCard({ t }: { t: typeof testimonials[0] }) {
    return (
        <div className="rounded-2xl border p-5 h-48
      bg-white dark:bg-zinc-900/40
      border-purple-100 dark:border-purple-900/30
      overflow-hidden relative"
        >
            <div className={`absolute top-0 left-0 right-0 h-0.5 bg-gradient-to-r ${t.color} opacity-60`} />
            <p className="text-xs text-muted-foreground leading-relaxed line-clamp-4 mb-4">"{t.review}"</p>
            <div className="flex items-center gap-2 absolute bottom-5 left-5">
                <div className={`w-7 h-7 rounded-lg bg-gradient-to-br ${t.color} flex items-center justify-center`}>
                    <span className="text-[10px] font-bold text-white">{t.avatar}</span>
                </div>
                <div>
                    <p className="text-xs font-semibold text-foreground leading-none">{t.name}</p>
                    <p className="text-[10px] text-muted-foreground mt-0.5">{t.tour}</p>
                </div>
            </div>
        </div>
    );
}