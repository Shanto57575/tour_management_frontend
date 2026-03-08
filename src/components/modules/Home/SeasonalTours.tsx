import { useEffect, useRef, useState } from "react";
import { CalendarDays, Clock, Users, ArrowRight, Zap, ChevronRight, Flame, Snowflake, Sun, Cloud } from "lucide-react";
import { Container } from "@/components/shared/Container";

const seasons = [
    { label: "All", icon: Flame, color: "text-purple-500" },
    { label: "Winter", icon: Snowflake, color: "text-sky-500" },
    { label: "Summer", icon: Sun, color: "text-amber-500" },
    { label: "Monsoon", icon: Cloud, color: "text-teal-500" },
];

const tours = [
    {
        id: 1,
        title: "Eid Special: Sundarbans Family Expedition",
        season: "Summer",
        label: "Eid Exclusive",
        labelColor: "from-amber-500 to-orange-500",
        date: "30 Mar – 3 Apr 2025",
        spotsLeft: 4,
        totalSpots: 20,
        duration: "5 Days",
        groupSize: "Up to 20",
        price: 9200,
        originalPrice: 12000,
        urgency: "Only 4 spots left!",
        urgencyColor: "text-red-500 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/40",
        description: "A rare Eid-season family package deep into the Sundarbans — boat safaris, campfire nights, and the chance to spot the Royal Bengal Tiger.",
        image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=800&q=85",
        countdown: { days: 12, hours: 6, mins: 44 },
        tags: ["Family", "Wildlife", "Camping"],
        featured: true,
    },
    {
        id: 2,
        title: "Winter Fog Trek: Bandarban Highlands",
        season: "Winter",
        label: "Winter Special",
        labelColor: "from-sky-500 to-blue-600",
        date: "15 Jan – 20 Jan 2025",
        spotsLeft: 8,
        totalSpots: 16,
        duration: "6 Days",
        groupSize: "Up to 16",
        price: 13500,
        originalPrice: 16000,
        urgency: "8 spots remaining",
        urgencyColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40",
        description: "The Bandarban peaks in January are draped in thick morning fog — an ethereal trekking experience to Keokradong through tribal villages.",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800&q=85",
        countdown: { days: 28, hours: 14, mins: 20 },
        tags: ["Trekking", "Hills", "Adventure"],
        featured: false,
    },
    {
        id: 3,
        title: "Monsoon Magic: Ratargul Swamp Forest",
        season: "Monsoon",
        label: "Monsoon Exclusive",
        labelColor: "from-teal-500 to-emerald-600",
        date: "10 Jul – 12 Jul 2025",
        spotsLeft: 12,
        totalSpots: 24,
        duration: "3 Days",
        groupSize: "Up to 24",
        price: 4500,
        originalPrice: 6000,
        urgency: "Filling fast",
        urgencyColor: "text-teal-600 bg-teal-50 dark:bg-teal-950/40 border-teal-200 dark:border-teal-800/40",
        description: "Ratargul is only accessible by boat during monsoon — paddle through a flooded forest canopy where trees rise straight out of the water.",
        image: "https://images.unsplash.com/photo-1536768139911-e290a59011e4?w=800&q=85",
        countdown: { days: 45, hours: 9, mins: 15 },
        tags: ["Boat Tour", "Forest", "Unique"],
        featured: false,
    },
    {
        id: 4,
        title: "New Year's Eve at Sajek Valley",
        season: "Winter",
        label: "New Year Special",
        labelColor: "from-violet-500 to-purple-600",
        date: "29 Dec – 1 Jan 2025",
        spotsLeft: 2,
        totalSpots: 12,
        duration: "4 Days",
        groupSize: "Up to 12",
        price: 10800,
        originalPrice: 14000,
        urgency: "Almost full!",
        urgencyColor: "text-red-500 bg-red-50 dark:bg-red-950/40 border-red-200 dark:border-red-800/40",
        description: "Ring in the New Year above the clouds at Sajek. Bonfires, stargazing, and waking up to a misty sunrise over Bangladesh's most scenic valley.",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=85",
        countdown: { days: 6, hours: 18, mins: 30 },
        tags: ["New Year", "Luxury", "Scenic"],
        featured: false,
    },
    {
        id: 5,
        title: "Summer Beach Week: Cox's Bazar",
        season: "Summer",
        label: "Summer Deal",
        labelColor: "from-orange-400 to-rose-500",
        date: "5 May – 9 May 2025",
        spotsLeft: 15,
        totalSpots: 30,
        duration: "5 Days",
        groupSize: "Up to 30",
        price: 5500,
        originalPrice: 7500,
        urgency: "Early bird pricing",
        urgencyColor: "text-emerald-600 bg-emerald-50 dark:bg-emerald-950/40 border-emerald-200 dark:border-emerald-800/40",
        description: "Cox's Bazar in May means warm seas, golden evenings, and empty stretches of the world's longest beach. Beat the crowd with our early summer package.",
        image: "https://images.unsplash.com/photo-1520942702018-0862200e6873?w=800&q=85",
        countdown: { days: 52, hours: 3, mins: 55 },
        tags: ["Beach", "Summer", "Group"],
        featured: false,
    },
    {
        id: 6,
        title: "Monsoon Cruise: Kaptai Lake",
        season: "Monsoon",
        label: "Monsoon Deal",
        labelColor: "from-cyan-500 to-blue-500",
        date: "18 Aug – 20 Aug 2025",
        spotsLeft: 9,
        totalSpots: 18,
        duration: "3 Days",
        groupSize: "Up to 18",
        price: 5800,
        originalPrice: 7200,
        urgency: "9 spots left",
        urgencyColor: "text-amber-600 bg-amber-50 dark:bg-amber-950/40 border-amber-200 dark:border-amber-800/40",
        description: "Kaptai Lake swells magnificently during monsoon. Cruise through lush hills reflected in jade water, and visit remote tribal communities by boat.",
        image: "https://images.unsplash.com/photo-1609766857901-c8a81a88dd9d?w=800&q=85",
        countdown: { days: 71, hours: 11, mins: 0 },
        tags: ["Lake", "Cruise", "Tribal"],
        featured: false,
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

function CountdownUnit({ value, label }: { value: number; label: string }) {
    return (
        <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-purple-600/20 dark:bg-purple-500/20 border border-purple-400/30 dark:border-purple-500/30 flex items-center justify-center">
                <span className="text-base font-black text-purple-600 dark:text-purple-300 tabular-nums leading-none">
                    {String(value).padStart(2, "0")}
                </span>
            </div>
            <span className="text-[9px] uppercase tracking-widest text-muted-foreground mt-1 font-semibold">{label}</span>
        </div>
    );
}

function SpotBar({ left, total }: { left: number; total: number }) {
    const pct = Math.round(((total - left) / total) * 100);
    return (
        <div className="w-full">
            <div className="flex justify-between mb-1">
                <span className="text-[10px] text-muted-foreground font-medium">{total - left} booked</span>
                <span className="text-[10px] text-muted-foreground font-medium">{left} left</span>
            </div>
            <div className="h-1.5 rounded-full bg-purple-100 dark:bg-purple-900/40 overflow-hidden">
                <div
                    className="h-full rounded-full bg-gradient-to-r from-purple-500 to-violet-500 transition-all duration-700"
                    style={{ width: `${pct}%` }}
                />
            </div>
        </div>
    );
}

function FeaturedCard({ tour }: { tour: typeof tours[0] }) {
    const [ref, visible] = useInView(0.1);
    const [hovered, setHovered] = useState(false);
    const discount = Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="relative rounded-3xl overflow-hidden border border-purple-200 dark:border-purple-800/50 cursor-pointer group"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease",
                boxShadow: hovered
                    ? "0 32px 80px rgba(139,92,246,0.2), 0 0 0 1px rgba(139,92,246,0.25)"
                    : "0 8px 32px rgba(139,92,246,0.08)",
            }}
        >
            {/* Full bleed image */}
            <div className="relative h-80 overflow-hidden">
                <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

                {/* Top row */}
                <div className="absolute top-4 left-4 right-4 flex items-start justify-between">
                    <div className={`inline-flex items-center gap-1.5 bg-gradient-to-r ${tour.labelColor} rounded-full px-3 py-1.5 shadow-lg`}>
                        <Zap size={11} className="text-white" fill="white" />
                        <span className="text-[11px] font-bold text-white">{tour.label}</span>
                    </div>
                    <div className="bg-black/50 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1.5">
                        <span className="text-[11px] font-bold text-emerald-400">−{discount}% OFF</span>
                    </div>
                </div>

                {/* Bottom text on image */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {tour.tags.map(t => (
                            <span key={t} className="text-[10px] font-semibold text-white/90 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-0.5">
                                {t}
                            </span>
                        ))}
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug drop-shadow-lg mb-1">{tour.title}</h3>
                    <div className="flex items-center gap-1.5">
                        <CalendarDays size={12} className="text-purple-300" />
                        <span className="text-xs text-white/75 font-medium">{tour.date}</span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="bg-white dark:bg-zinc-900/90 p-5">
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{tour.description}</p>

                {/* Countdown */}
                <div className="flex items-center gap-3 mb-5">
                    <span className="text-[10px] uppercase tracking-widest font-bold text-muted-foreground shrink-0">Starts in</span>
                    <div className="flex items-center gap-2">
                        <CountdownUnit value={tour.countdown.days} label="Days" />
                        <span className="text-purple-400 font-bold text-sm mb-3">:</span>
                        <CountdownUnit value={tour.countdown.hours} label="Hrs" />
                        <span className="text-purple-400 font-bold text-sm mb-3">:</span>
                        <CountdownUnit value={tour.countdown.mins} label="Min" />
                    </div>
                </div>

                {/* Spot bar */}
                <div className="mb-5">
                    <SpotBar left={tour.spotsLeft} total={tour.totalSpots} />
                </div>

                {/* Meta + CTA */}
                <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Clock size={11} className="text-purple-500" />
                            {tour.duration}
                        </div>
                        <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                            <Users size={11} className="text-purple-500" />
                            {tour.groupSize}
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <div className="text-right">
                            <p className="text-lg font-black text-foreground leading-none">৳{tour.price.toLocaleString()}</p>
                            <p className="text-[10px] text-muted-foreground line-through">৳{tour.originalPrice.toLocaleString()}</p>
                        </div>
                        <button className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold px-4 py-2.5 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200">
                            Book Now <ArrowRight size={13} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

function TourRow({ tour, index }: { tour: typeof tours[0]; index: number }) {
    const [ref, visible] = useInView();
    const [, setHovered] = useState(false);
    const discount = Math.round(((tour.originalPrice - tour.price) / tour.originalPrice) * 100);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group flex gap-0 rounded-2xl border overflow-hidden cursor-pointer
        bg-white dark:bg-zinc-900/70
        border-purple-100 dark:border-purple-900/40
        hover:border-purple-400 dark:hover:border-purple-500
        hover:shadow-xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/15"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateX(0)" : "translateX(32px)",
                transition: `opacity 0.55s ease ${index * 0.1}s, transform 0.55s ease ${index * 0.1}s, box-shadow 0.3s ease, border-color 0.3s ease`,
            }}
        >
            {/* Thumbnail */}
            <div className="relative w-36 shrink-0 overflow-hidden">
                <img
                    src={tour.image}
                    alt={tour.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/20" />
                <div className={`absolute top-2 left-2 inline-flex items-center bg-gradient-to-r ${tour.labelColor} rounded-full px-2 py-0.5`}>
                    <span className="text-[9px] font-bold text-white leading-none">{tour.season}</span>
                </div>
                <div className="absolute bottom-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-1.5 py-0.5">
                    <span className="text-[9px] font-bold text-emerald-400">−{discount}%</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div>
                    <div className={`inline-flex items-center gap-1 text-[10px] font-semibold border rounded-full px-2 py-0.5 mb-2 ${tour.urgencyColor}`}>
                        <Zap size={9} className="shrink-0" />
                        {tour.urgency}
                    </div>
                    <h4 className="text-sm font-bold text-foreground leading-snug line-clamp-2 mb-1.5">{tour.title}</h4>
                    <div className="flex items-center gap-1 mb-3">
                        <CalendarDays size={10} className="text-purple-500 shrink-0" />
                        <span className="text-[11px] text-muted-foreground">{tour.date}</span>
                    </div>
                    {/* Mini spot bar */}
                    <SpotBar left={tour.spotsLeft} total={tour.totalSpots} />
                </div>

                <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
                            <Clock size={10} className="text-purple-500" />
                            {tour.duration}
                        </div>
                    </div>
                    <div className="flex items-center gap-2">
                        <div className="text-right">
                            <span className="text-sm font-black text-foreground">৳{tour.price.toLocaleString()}</span>
                            <span className="text-[10px] text-muted-foreground line-through ml-1">৳{tour.originalPrice.toLocaleString()}</span>
                        </div>
                        <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-200">
                            <ChevronRight size={13} className="text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors duration-200" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function SeasonalTours() {
    const [headerRef, headerVisible] = useInView(0.2);
    const [activeSeason, setActiveSeason] = useState("All");

    const filtered = activeSeason === "All" ? tours : tours.filter(t => t.season === activeSeason);
    const featured = filtered[0];
    const rest = filtered.slice(1);

    return (
        <Container className="relative py-24 overflow-hidden bg-background">
            {/* Grid bg */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-violet-500/8 dark:bg-violet-500/12 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-500/8 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

            <div className="relative">

                {/* Header */}
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
                        <CalendarDays size={12} className="text-purple-500" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                            Limited Seats · Book Early
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        Seasonal &{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                            Upcoming Tours
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                        Time-limited journeys crafted around Bangladesh's most magical seasons — from misty winter peaks to monsoon-flooded forests.
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-400/60" />
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <div className="w-10 h-px bg-gradient-to-l from-transparent to-purple-400/60" />
                    </div>
                </div>

                {/* Season filters */}
                <div
                    className="flex flex-wrap gap-2 justify-center mb-10"
                    style={{ opacity: headerVisible ? 1 : 0, transition: "opacity 0.7s ease 0.2s" }}
                >
                    {seasons.map(({ label, icon: Icon, color }) => (
                        <button
                            key={label}
                            onClick={() => setActiveSeason(label)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200
                ${activeSeason === label
                                    ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/30"
                                    : "bg-white dark:bg-zinc-900/60 border-purple-100 dark:border-purple-900/40 text-muted-foreground hover:border-purple-400 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400"
                                }`}
                        >
                            <Icon size={12} className={activeSeason === label ? "text-white" : color} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Asymmetric layout: big featured left + stacked list right */}
                {featured && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
                        {/* Featured — takes 2 columns */}
                        <div className="lg:col-span-2">
                            <FeaturedCard tour={featured} />
                        </div>

                        {/* Right stack — takes 3 columns */}
                        <div className="lg:col-span-3 flex flex-col gap-4">
                            {rest.length > 0 ? rest.map((tour, i) => (
                                <TourRow key={tour.id} tour={tour} index={i} />
                            )) : (
                                <div className="flex-1 flex items-center justify-center rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-zinc-900/40 p-12">
                                    <p className="text-muted-foreground text-sm">No other {activeSeason} tours right now.</p>
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {/* Bottom trust strip */}
                <div
                    className="mt-14 rounded-2xl border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-zinc-900/60 overflow-hidden"
                    style={{ opacity: headerVisible ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}
                >
                    <div className="h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600" />
                    <div className="px-6 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-800/40 flex items-center justify-center">
                                <Zap size={18} className="text-purple-600 dark:text-purple-400" fill="currentColor" />
                            </div>
                            <div>
                                <p className="text-sm font-bold text-foreground">Flash deals go fast</p>
                                <p className="text-xs text-muted-foreground">Seasonal tours sell out weeks in advance. Reserve your spot early.</p>
                            </div>
                        </div>
                        <button className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-bold px-5 py-2.5 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 group">
                            View All Upcoming Tours
                            <ArrowRight size={14} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                        </button>
                    </div>
                </div>

            </div>
        </Container>
    );
}