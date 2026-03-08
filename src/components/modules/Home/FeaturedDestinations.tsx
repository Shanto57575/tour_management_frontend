import { useEffect, useRef, useState } from "react";
import { MapPin, Clock, Star, ArrowRight, TrendingUp } from "lucide-react";
import { Container } from "@/components/shared/Container";

const destinations = [
    {
        name: "Sundarbans",
        division: "Khulna",
        image:
            "https://images.unsplash.com/photo-1706459671568-9809c9d13430?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8M3x8c3VuZGFyYmFufGVufDB8fDB8fHww?q=80&w=1600&auto=format&fit=crop",
        description:
            "The world's largest mangrove forest, home to the Royal Bengal Tiger and breathtaking waterways.",
        duration: "3–5 Days",
        rating: 4.9,
        reviews: 1240,
        startingPrice: 4500,
        tag: "Wildlife",
        tagColor: "from-emerald-500 to-teal-600",
        trending: true,
        gradient: "from-emerald-900/80 via-teal-900/60 to-transparent",
        accentLight: "bg-emerald-100 text-emerald-700 border-emerald-200",
        accentDark:
            "dark:bg-emerald-950/60 dark:text-emerald-400 dark:border-emerald-800/50",
    },
    {
        name: "Cox's Bazar",
        division: "Chittagong",
        image:
            "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=1600&auto=format&fit=crop",
        description:
            "The world's longest natural sea beach — 120km of golden sand, crashing waves, and vivid sunsets.",
        duration: "2–4 Days",
        rating: 4.8,
        reviews: 3870,
        startingPrice: 3200,
        tag: "Beach",
        tagColor: "from-sky-500 to-blue-600",
        trending: true,
        gradient: "from-blue-900/80 via-sky-900/60 to-transparent",
        accentLight: "bg-sky-100 text-sky-700 border-sky-200",
        accentDark: "dark:bg-sky-950/60 dark:text-sky-400 dark:border-sky-800/50",
    },
    {
        name: "Bandarban",
        division: "Chittagong",
        image:
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
        description:
            "Mist-wrapped peaks, tribal culture, and the highest points in Bangladesh — Keokradong awaits.",
        duration: "3–6 Days",
        rating: 4.9,
        reviews: 980,
        startingPrice: 5800,
        tag: "Hills",
        tagColor: "from-violet-500 to-purple-600",
        trending: false,
        gradient: "from-violet-900/80 via-purple-900/60 to-transparent",
        accentLight: "bg-violet-100 text-violet-700 border-violet-200",
        accentDark:
            "dark:bg-violet-950/60 dark:text-violet-400 dark:border-violet-800/50",
    },
    {
        name: "Sajek Valley",
        division: "Rangamati",
        image:
            "https://images.unsplash.com/photo-1469474968028-56623f02e42e?q=80&w=1600&auto=format&fit=crop",
        description:
            "Bangladesh's own 'Kingdom of Clouds' — rolling hills blanketed in morning mist and tribal charm.",
        duration: "2–3 Days",
        rating: 4.8,
        reviews: 2100,
        startingPrice: 3900,
        tag: "Clouds",
        tagColor: "from-indigo-500 to-blue-600",
        trending: true,
        gradient: "from-indigo-900/80 via-blue-900/60 to-transparent",
        accentLight: "bg-indigo-100 text-indigo-700 border-indigo-200",
        accentDark:
            "dark:bg-indigo-950/60 dark:text-indigo-400 dark:border-indigo-800/50",
    },
    {
        name: "Sreemangal",
        division: "Sylhet",
        image:
            "https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1600&auto=format&fit=crop",
        description:
            "The tea capital of Bangladesh — endless green gardens, the seven-layer tea, and Lawachara forest.",
        duration: "2–3 Days",
        rating: 4.7,
        reviews: 1560,
        startingPrice: 2800,
        tag: "Tea & Nature",
        tagColor: "from-lime-600 to-green-600",
        trending: false,
        gradient: "from-green-900/80 via-lime-900/60 to-transparent",
        accentLight: "bg-lime-100 text-lime-700 border-lime-200",
        accentDark:
            "dark:bg-lime-950/60 dark:text-lime-400 dark:border-lime-800/50",
    },
    {
        name: "Kuakata",
        division: "Barishal",
        image:
            "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?q=80&w=1600&auto=format&fit=crop",
        description:
            "The 'Daughter of the Sea' — one of the rare beaches where you can watch both sunrise and sunset.",
        duration: "2–3 Days",
        rating: 4.6,
        reviews: 870,
        startingPrice: 2500,
        tag: "Sunrise & Sunset",
        tagColor: "from-orange-500 to-amber-600",
        trending: false,
        gradient: "from-orange-900/80 via-amber-900/60 to-transparent",
        accentLight: "bg-orange-100 text-orange-700 border-orange-200",
        accentDark:
            "dark:bg-orange-950/60 dark:text-orange-400 dark:border-orange-800/50",
    },
];

const filters = [
    "All",
    "Beach",
    "Hills",
    "Wildlife",
    "Clouds",
    "Tea & Nature",
    "Sunrise & Sunset",
];

function useInView(threshold = 0.1) {
    const ref = useRef<HTMLDivElement>(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) setVisible(true);
            },
            { threshold }
        );

        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);

    return [ref, visible] as const;
}

function DestinationCard({
    d,
    index,
}: {
    d: (typeof destinations)[0];
    index: number;
}) {
    const [ref, visible] = useInView();
    const [hovered, setHovered] = useState(false);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative rounded-2xl overflow-hidden border border-purple-100 dark:border-purple-900/40 cursor-pointer"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible
                    ? "translateY(0) scale(1)"
                    : "translateY(28px) scale(0.97)",
                transition: `opacity 0.55s ease ${index * 0.08}s, transform 0.55s ease ${index * 0.08
                    }s`,
            }}
        >
            <div className="relative h-52 overflow-hidden">
                <img
                    src={d.image}
                    alt={d.name}
                    className="absolute inset-0 w-full h-full object-cover"
                />

                <div
                    className="absolute inset-0 opacity-20"
                    style={{
                        backgroundImage:
                            "radial-gradient(circle at 20% 50%, rgba(255,255,255,0.15) 0%, transparent 60%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.1) 0%, transparent 50%)",
                    }}
                />

                <div
                    className="absolute inset-0 opacity-30"
                    style={{
                        background:
                            "linear-gradient(135deg, transparent 30%, rgba(255,255,255,0.05) 50%, transparent 70%)",
                        transform: hovered ? "translateX(100%)" : "translateX(-100%)",
                        transition: "transform 0.7s ease",
                    }}
                />

                <div className={`absolute inset-0 bg-gradient-to-t ${d.gradient}`} />

                <div className="absolute top-3 left-3 right-3 flex items-start justify-between">
                    <div
                        className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${d.tagColor} rounded-full px-3 py-1 shadow-lg`}
                    >
                        <span className="text-[11px] font-bold text-white tracking-wide">
                            {d.tag}
                        </span>
                    </div>

                    {d.trending && (
                        <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
                            <TrendingUp size={10} className="text-amber-400" />
                            <span className="text-[10px] font-semibold text-amber-400">
                                Trending
                            </span>
                        </div>
                    )}
                </div>

                <div className="absolute bottom-4 left-4">
                    <h3 className="text-xl font-bold text-white leading-tight drop-shadow-lg">
                        {d.name}
                    </h3>
                    <div className="flex items-center gap-1 mt-0.5">
                        <MapPin size={11} className="text-white/70" />
                        <span className="text-xs text-white/70">
                            {d.division} Division
                        </span>
                    </div>
                </div>

                <div className="absolute bottom-4 right-4 flex items-center gap-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
                    <Star size={11} className="fill-amber-400 text-amber-400" />
                    <span className="text-xs font-bold text-white">{d.rating}</span>
                    <span className="text-[10px] text-white/60">
                        ({d.reviews.toLocaleString()})
                    </span>
                </div>
            </div>

            <div className="p-4 font-open-sans bg-white dark:bg-zinc-900/70 border-t border-purple-100 dark:border-purple-900/30">
                <p className="text-xs text-muted-foreground leading-relaxed mb-4 line-clamp-2">
                    {d.description}
                </p>

                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div
                            className={`flex items-center gap-1.5 rounded-full px-2.5 py-1 border text-[11px] font-medium ${d.accentLight} ${d.accentDark}`}
                        >
                            <Clock size={10} />
                            {d.duration}
                        </div>
                    </div>

                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <p className="text-[10px] text-muted-foreground">Starting</p>
                            <p className="text-sm font-bold text-foreground">
                                ৳{d.startingPrice.toLocaleString()}
                            </p>
                        </div>

                        <div className="w-8 h-8 rounded-xl bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center group-hover:bg-purple-600 dark:group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-200">
                            <ArrowRight
                                size={14}
                                className="text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors duration-200"
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FeaturedDestinations() {
    const [headerRef, headerVisible] = useInView(0.2);
    const [activeFilter, setActiveFilter] = useState("All");

    const filtered =
        activeFilter === "All"
            ? destinations
            : destinations.filter((d) => d.tag === activeFilter);

    return (
        <Container className="relative py-24 overflow-hidden bg-background">
            <div
                className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage:
                        "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />

            <div className="absolute top-0 right-1/3 w-96 h-96 bg-purple-500/8 dark:bg-purple-500/12 rounded-full blur-3xl pointer-events-none" />

            <div className="relative">
                <div
                    ref={headerRef}
                    className="text-center mb-12"
                    style={{
                        opacity: headerVisible ? 1 : 0,
                        transform: headerVisible ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity 0.7s ease, transform 0.7s ease",
                    }}
                >
                    <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 rounded-full px-4 py-1.5 mb-6">
                        <MapPin size={12} className="text-purple-500" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                            Top Picks Across Bangladesh
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        Explore{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                            Featured Destinations
                        </span>
                    </h2>

                    <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                        Handpicked locations that showcase the incredible diversity of
                        Bangladesh — from dense jungles to cloud-wrapped hills.
                    </p>

                    <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-400/60" />
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <div className="w-10 h-px bg-gradient-to-l from-transparent to-purple-400/60" />
                    </div>
                </div>

                <div className="flex flex-wrap gap-2 justify-center mb-10">
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => setActiveFilter(f)}
                            className={`px-4 py-1.5 rounded-full text-xs font-semibold border transition-all duration-200
              ${activeFilter === f
                                    ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/30"
                                    : "bg-white dark:bg-zinc-900/60 border-purple-100 dark:border-purple-900/40 text-muted-foreground hover:border-purple-400 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400"
                                }`}
                        >
                            {f}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {filtered.map((d, i) => (
                        <DestinationCard key={d.name} d={d} index={i} />
                    ))}
                </div>

                <div className="text-center mt-12">
                    <a
                        href="/all-places"
                        className="inline-flex items-center gap-2 px-6 py-3 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-white dark:bg-zinc-900/60 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 group"
                    >
                        View All Destinations
                        <ArrowRight
                            size={15}
                            className="group-hover:translate-x-1 transition-transform duration-200"
                        />
                    </a>
                </div>
            </div>
        </Container>
    );
}