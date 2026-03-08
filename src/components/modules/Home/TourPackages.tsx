import { useEffect, useRef, useState } from "react";
import {
    Clock, Users, Star, ArrowRight, Flame,
    Mountain, Waves, TreePine, Building2, Camera, ChevronLeft, ChevronRight
} from "lucide-react";
import { Container } from "@/components/shared/Container";

const categories = [
    { label: "All", icon: Flame },
    { label: "Adventure", icon: Mountain },
    { label: "Beach", icon: Waves },
    { label: "Nature", icon: TreePine },
    { label: "Heritage", icon: Building2 },
    { label: "Photography", icon: Camera },
];

const packages = [
    {
        id: 1,
        title: "Sundarban Tiger Trail",
        location: "Khulna Division",
        category: "Adventure",
        duration: "4 Days / 3 Nights",
        groupSize: "6–12",
        rating: 4.9,
        reviews: 834,
        price: 8500,
        originalPrice: 10200,
        badge: "Best Seller",
        badgeColor: "from-amber-500 to-orange-500",
        highlights: ["Boat safari", "Tiger spotting", "Forest camping"],
        image: "https://indiantigersafaris.com/wp-content/uploads/2024/09/sun-banner-3.webp?w=600&q=80",
    },
    {
        id: 2,
        title: "Sajek Cloud Kingdom",
        location: "Rangamati, CHT",
        category: "Nature",
        duration: "3 Days / 2 Nights",
        groupSize: "4–10",
        rating: 4.8,
        reviews: 1220,
        price: 5900,
        originalPrice: 7000,
        badge: "Trending",
        badgeColor: "from-violet-500 to-purple-600",
        highlights: ["Cloud sea view", "Tribal village", "Sunrise hike"],
        image: "https://images.unsplash.com/photo-1658383895221-173f07c6a9d0?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8U2FqZWslMjBDbG91ZCUyMEtpbmdkb218ZW58MHx8MHx8fDA%3D?w=600&q=80",
    },
    {
        id: 3,
        title: "Cox's Bazar Luxury Escape",
        location: "Cox's Bazar",
        category: "Beach",
        duration: "3 Days / 2 Nights",
        groupSize: "2–8",
        rating: 4.7,
        reviews: 2100,
        price: 6200,
        originalPrice: 7800,
        badge: "Popular",
        badgeColor: "from-sky-500 to-blue-600",
        highlights: ["Sea beach", "Inani rocks", "Sunset cruise"],
        image: "https://images.unsplash.com/photo-1587222318667-31212ce2828d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8Q294J3MlMjBCYXphcnxlbnwwfHwwfHx8MA%3D%3D?w=600&q=80",
    },
    {
        id: 4,
        title: "Bandarban Peak Expedition",
        location: "Bandarban Hills",
        category: "Adventure",
        duration: "5 Days / 4 Nights",
        groupSize: "6–14",
        rating: 4.9,
        reviews: 567,
        price: 11500,
        originalPrice: 14000,
        badge: "Exclusive",
        badgeColor: "from-purple-600 to-fuchsia-600",
        highlights: ["Keokradong summit", "Tribal homestay", "Waterfall trek"],
        image: "https://images.unsplash.com/photo-1673632417072-b1366fda0e22?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8N3x8QmFuZGFyYmFuJTIwUGVhayUyMEV4cGVkaXRpb258ZW58MHx8MHx8fDA%3D?w=600&q=80",
    },
    {
        id: 5,
        title: "Bagerhat Heritage Walk",
        location: "Bagerhat, Khulna",
        category: "Heritage",
        duration: "2 Days / 1 Night",
        groupSize: "4–16",
        rating: 4.6,
        reviews: 430,
        price: 3200,
        originalPrice: 4000,
        badge: "UNESCO Site",
        badgeColor: "from-amber-600 to-yellow-600",
        highlights: ["Sixty Dome Mosque", "Shat Gambuj", "Local cuisine"],
        image: "https://toursntripsbd.com/wp-content/uploads/2025/08/Experience-Bangladeshs-premier-UNESCO-World-Heritage-Tour-to-Bagerhat.webp?w=600&q=80",
    },
    {
        id: 6,
        title: "Sreemangal Tea & Lens",
        location: "Sylhet Division",
        category: "Photography",
        duration: "3 Days / 2 Nights",
        groupSize: "4–10",
        rating: 4.8,
        reviews: 712,
        price: 4800,
        originalPrice: 5900,
        badge: "Photo Tour",
        badgeColor: "from-lime-600 to-green-600",
        highlights: ["Tea garden shoot", "Seven-layer tea", "Lawachara forest"],
        image: "https://images.unsplash.com/photo-1724257288409-dd6e1de5c20d?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8U3JlZW1hbmdhbCUyMFRlYSUyMCUyNiUyMExlbnN8ZW58MHx8MHx8fDA%3D?w=600&q=80",
    },
    {
        id: 7,
        title: "Rangamati Lake Retreat",
        location: "Rangamati, CHT",
        category: "Nature",
        duration: "3 Days / 2 Nights",
        groupSize: "4–12",
        rating: 4.7,
        reviews: 645,
        price: 5200,
        originalPrice: 6500,
        badge: "Scenic",
        badgeColor: "from-cyan-500 to-teal-600",
        highlights: ["Kaptai Lake", "Hanging bridge", "Tribal culture"],
        image: "https://images.unsplash.com/photo-1576419326170-74f6f9451993?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8NHx8cmFuZ2FtYXRpfGVufDB8fDB8fHww?w=600&q=80",
    },
    {
        id: 8,
        title: "Kuakata Sunrise & Sea",
        location: "Patuakhali, Barishal",
        category: "Beach",
        duration: "2 Days / 1 Night",
        groupSize: "2–10",
        rating: 4.6,
        reviews: 389,
        price: 2900,
        originalPrice: 3800,
        badge: "Sunrise Special",
        badgeColor: "from-orange-500 to-rose-500",
        highlights: ["Sunrise & sunset", "Fishing village", "Mangrove walk"],
        image: "https://www.travelmate.com.bd/wp-content/uploads/2020/08/kuakata-patuakhai.jpg.webp?w=600&q=80",
    },
    {
        id: 9,
        title: "Jaflong Crystal Waters",
        location: "Sylhet Division",
        category: "Adventure",
        duration: "2 Days / 1 Night",
        groupSize: "4–12",
        rating: 4.8,
        reviews: 920,
        price: 3600,
        originalPrice: 4500,
        badge: "Hidden Gem",
        badgeColor: "from-teal-500 to-emerald-600",
        highlights: ["Stone collection", "River crossing", "Khasi village"],
        image: "https://images.unsplash.com/photo-1643001607577-0a0332e79aab?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8c3lsaGV0fGVufDB8fDB8fHww?w=600&q=80",
    },
];

const CARDS_PER_PAGE = 3;

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

function PackageCard({ pkg, index }: { pkg: typeof packages[0]; index: number }) {
    const [ref, visible] = useInView();
    const [, setHovered] = useState(false);
    const [imgError, setImgError] = useState(false);
    const discount = Math.round(((pkg.originalPrice - pkg.price) / pkg.originalPrice) * 100);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative rounded-2xl border overflow-hidden cursor-pointer flex flex-col
        bg-white dark:bg-zinc-900/70
        border-purple-100 dark:border-purple-900/40
        hover:border-purple-400 dark:hover:border-purple-500
        hover:shadow-2xl hover:shadow-purple-500/10 dark:hover:shadow-purple-500/20"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0) scale(1)" : "translateY(28px) scale(0.97)",
                transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s, box-shadow 0.3s ease, border-color 0.3s ease`,
            }}
        >
            {/* Image */}
            <div className="relative h-48 overflow-hidden bg-purple-950">
                {!imgError ? (
                    <img
                        src={pkg.image}
                        alt={pkg.title}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                        onError={() => setImgError(true)}
                    />
                ) : (
                    <div className="w-full h-full bg-gradient-to-br from-purple-900 to-violet-950 flex items-center justify-center">
                        <Mountain size={40} className="text-purple-400/40" />
                    </div>
                )}

                {/* Dark overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

                {/* Badge */}
                <div className="absolute top-3 left-3">
                    <div className={`inline-flex items-center bg-gradient-to-r ${pkg.badgeColor} rounded-full px-3 py-1 shadow-lg`}>
                        <span className="text-[11px] font-bold text-white">{pkg.badge}</span>
                    </div>
                </div>

                {/* Discount */}
                <div className="absolute top-3 right-3 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1">
                    <span className="text-[11px] font-bold text-emerald-400">−{discount}% OFF</span>
                </div>

                {/* Bottom overlay info */}
                <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
                    <div>
                        <h3 className="text-base font-bold text-white leading-tight drop-shadow-lg">{pkg.title}</h3>
                        <p className="text-[11px] text-white/70 mt-0.5">{pkg.location}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-black/40 backdrop-blur-sm border border-white/10 rounded-full px-2.5 py-1 shrink-0 ml-2">
                        <Star size={11} className="fill-amber-400 text-amber-400" />
                        <span className="text-xs font-bold text-white">{pkg.rating}</span>
                        <span className="text-[10px] text-white/60">({pkg.reviews.toLocaleString()})</span>
                    </div>
                </div>
            </div>

            {/* Body */}
            <div className="p-4 flex flex-col flex-1">
                <div className="flex items-center gap-2 flex-wrap mb-3">
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 rounded-full px-2.5 py-1">
                        <Clock size={10} className="text-purple-500" />
                        {pkg.duration}
                    </div>
                    <div className="flex items-center gap-1.5 text-[11px] font-medium text-muted-foreground bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/40 rounded-full px-2.5 py-1">
                        <Users size={10} className="text-purple-500" />
                        {pkg.groupSize} pax
                    </div>
                </div>

                <div className="flex flex-wrap gap-1.5 mb-4">
                    {pkg.highlights.map((h) => (
                        <span key={h} className="text-[10px] font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/40 rounded-md px-2 py-0.5">
                            {h}
                        </span>
                    ))}
                </div>

                <div className="flex-1" />
                <div className="h-px bg-gradient-to-r from-purple-100 dark:from-purple-900/40 via-purple-200/50 dark:via-purple-800/30 to-transparent mb-4" />

                <div className="flex items-center justify-between">
                    <div>
                        <div className="flex items-baseline gap-1.5">
                            <span className="text-xl font-black text-foreground">৳{pkg.price.toLocaleString()}</span>
                            <span className="text-xs text-muted-foreground line-through">৳{pkg.originalPrice.toLocaleString()}</span>
                        </div>
                        <p className="text-[10px] text-muted-foreground">per person</p>
                    </div>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600
            hover:from-purple-500 hover:to-violet-500 text-white text-xs font-bold
            px-4 py-2.5 rounded-xl shadow-md shadow-purple-500/25
            hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 group/btn">
                        Book Now
                        <ArrowRight size={13} className="group-hover/btn:translate-x-0.5 transition-transform duration-200" />
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function TourPackages() {
    const [headerRef, headerVisible] = useInView(0.2);
    const [activeCategory, setActiveCategory] = useState("All");
    const [page, setPage] = useState(0);
    const [animDir, setAnimDir] = useState<"left" | "right">("right");
    const [animating, setAnimating] = useState(false);
    const [displayPage, setDisplayPage] = useState(0);

    const filtered = activeCategory === "All"
        ? packages
        : packages.filter((p) => p.category === activeCategory);

    const totalPages = Math.ceil(filtered.length / CARDS_PER_PAGE);
    const currentCards = filtered.slice(displayPage * CARDS_PER_PAGE, displayPage * CARDS_PER_PAGE + CARDS_PER_PAGE);

    const goTo = (newPage: number, dir: "left" | "right") => {
        if (animating || newPage === page) return;
        setAnimDir(dir);
        setAnimating(true);
        setTimeout(() => {
            setDisplayPage(newPage);
            setPage(newPage);
            setAnimating(false);
        }, 280);
    };

    // Reset page when category changes
    useEffect(() => {
        setPage(0);
        setDisplayPage(0);
    }, [activeCategory]);

    return (
        <Container className="relative py-20 overflow-hidden bg-background">
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/8 dark:bg-purple-500/12 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />
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
                        <Flame size={12} className="text-purple-500" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                            Handcrafted For Every Traveler
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        Popular{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                            Tour Packages
                        </span>
                    </h2>
                    <p className="font-open-sans text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                        Whether you crave jungle thrills, beach sunsets, or ancient history — we have a package crafted just for you.
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-400/60" />
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <div className="w-10 h-px bg-gradient-to-l from-transparent to-purple-400/60" />
                    </div>
                </div>

                {/* Filters */}
                <div
                    className="flex flex-wrap gap-2 justify-center mb-10"
                    style={{ opacity: headerVisible ? 1 : 0, transition: "opacity 0.7s ease 0.2s" }}
                >
                    {categories.map(({ label, icon: Icon }) => (
                        <button
                            key={label}
                            onClick={() => setActiveCategory(label)}
                            className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200
                ${activeCategory === label
                                    ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/30"
                                    : "bg-white dark:bg-zinc-900/60 border-purple-100 dark:border-purple-900/40 text-muted-foreground hover:border-purple-400 dark:hover:border-purple-600 hover:text-purple-600 dark:hover:text-purple-400"
                                }`}
                        >
                            <Icon size={12} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Cards with page transition */}
                <div className="relative overflow-hidden min-h-[480px]">
                    <div
                        style={{
                            opacity: animating ? 0 : 1,
                            transform: animating
                                ? `translateX(${animDir === "right" ? "-40px" : "40px"})`
                                : "translateX(0)",
                            transition: "opacity 0.28s ease, transform 0.28s ease",
                        }}
                    >
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                            {currentCards.map((pkg, i) => (
                                <PackageCard key={pkg.id} pkg={pkg} index={i} />
                            ))}
                        </div>
                    </div>
                </div>

                {/* Pagination controls */}
                {totalPages > 1 && (
                    <div className="flex items-center justify-center gap-4">
                        <button
                            onClick={() => goTo(page - 1, "left")}
                            disabled={page === 0}
                            className="w-10 h-10 rounded-full flex items-center justify-center border
                bg-white dark:bg-zinc-900/60
                border-purple-100 dark:border-purple-900/40
                hover:border-purple-400 dark:hover:border-purple-500
                text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-200 shadow-sm"
                        >
                            <ChevronLeft size={18} />
                        </button>

                        <div className="flex items-center gap-2">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => goTo(i, i > page ? "right" : "left")}
                                    className="transition-all duration-300 rounded-full flex items-center justify-center"
                                    style={{
                                        width: i === page ? "32px" : "10px",
                                        height: "10px",
                                        background: i === page
                                            ? "linear-gradient(to right, #a855f7, #7c3aed)"
                                            : undefined,
                                    }}
                                >
                                    {i !== page && (
                                        <span className="block w-2.5 h-2.5 rounded-full bg-purple-200 dark:bg-purple-800 hover:bg-purple-400 transition-colors duration-200" />
                                    )}
                                </button>
                            ))}
                        </div>

                        <button
                            onClick={() => goTo(page + 1, "right")}
                            disabled={page === totalPages - 1}
                            className="w-10 h-10 rounded-full flex items-center justify-center border
                bg-white dark:bg-zinc-900/60
                border-purple-100 dark:border-purple-900/40
                hover:border-purple-400 dark:hover:border-purple-500
                text-muted-foreground hover:text-purple-600 dark:hover:text-purple-400
                disabled:opacity-30 disabled:cursor-not-allowed
                transition-all duration-200 shadow-sm"
                        >
                            <ChevronRight size={18} />
                        </button>
                    </div>
                )}
                <div
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-8 pt-8 border-t border-border"
                    style={{ opacity: headerVisible ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}
                >
                    <p className="text-sm text-muted-foreground">
                        Showing{" "}
                        <span className="font-semibold text-foreground">
                            {displayPage * CARDS_PER_PAGE + 1}–{Math.min((displayPage + 1) * CARDS_PER_PAGE, filtered.length)}
                        </span>{" "}
                        of{" "}
                        <span className="font-semibold text-foreground">{filtered.length}</span> packages
                        {activeCategory !== "All" && (
                            <> in <span className="font-semibold text-purple-600 dark:text-purple-400">{activeCategory}</span></>
                        )}
                    </p>
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-white dark:bg-zinc-900/60 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:border-purple-400 dark:hover:border-purple-500 transition-all duration-200 group">
                        Browse All Packages
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                </div>
            </div>
        </Container>
    );
}