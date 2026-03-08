import { useEffect, useRef, useState } from "react";
import { ArrowRight, BookOpen, Clock, TrendingUp, Compass, Camera, Map } from "lucide-react";
import { Container } from "@/components/shared/Container";

const categories = [
    { label: "All", icon: BookOpen },
    { label: "Guide", icon: Map },
    { label: "Tips", icon: Compass },
    { label: "Photography", icon: Camera },
    { label: "Trending", icon: TrendingUp },
];

const posts = [
    {
        id: 1,
        title: "The Ultimate Guide to Surviving the Sundarbans in 2025",
        excerpt: "Everything you need to know before entering the world's largest mangrove — permits, safety, wildlife, and the best time to go.",
        category: "Guide",
        readTime: "8 min read",
        date: "Jan 12, 2025",
        image: "https://images.unsplash.com/photo-1561731216-c3a4d99437d5?w=900&q=85",
        tags: ["Sundarbans", "Wildlife", "Safety"],
        featured: true,
        author: { name: "Rafiul Islam", avatar: "RI" },
    },
    {
        id: 2,
        title: "Sajek in Monsoon: Why the Rainy Season is Actually the Best Time to Go",
        excerpt: "Most travelers avoid Sajek in July. We argue they're missing the most dramatic, cinematic version of Bangladesh's cloud kingdom.",
        category: "Tips",
        readTime: "5 min read",
        date: "Feb 3, 2025",
        image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=900&q=85",
        tags: ["Sajek", "Monsoon", "Travel Tips"],
        featured: false,
        author: { name: "Nusrat Jahan", avatar: "NJ" },
    },
    {
        id: 3,
        title: "10 Hidden Gems in Sylhet That Tourists Always Miss",
        excerpt: "Beyond Jaflong and Ratargul lies a Sylhet few travelers ever see — secret waterfalls, village tea gardens, and ancient shrines.",
        category: "Guide",
        readTime: "6 min read",
        date: "Feb 18, 2025",
        image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=85",
        tags: ["Sylhet", "Hidden Gems", "Guide"],
        featured: false,
        author: { name: "Tanvir Ahmed", avatar: "TA" },
    },
    {
        id: 4,
        title: "Photography in Bandarban: Golden Hour Spots Nobody Talks About",
        excerpt: "The hills of Bandarban are endlessly photogenic — but only if you know exactly where to stand at exactly the right hour.",
        category: "Photography",
        readTime: "7 min read",
        date: "Mar 1, 2025",
        image: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=900&q=85",
        tags: ["Photography", "Bandarban", "Golden Hour"],
        featured: false,
        author: { name: "Sabrina Hossain", avatar: "SH" },
    },
    {
        id: 5,
        title: "Cox's Bazar on a Budget: How to Do It for Under ৳5000",
        excerpt: "The world's longest beach doesn't have to drain your wallet. Here's the full breakdown for a perfect budget trip.",
        category: "Tips",
        readTime: "4 min read",
        date: "Mar 9, 2025",
        image: "https://images.unsplash.com/photo-1520942702018-0862200e6873?w=900&q=85",
        tags: ["Cox's Bazar", "Budget", "Tips"],
        featured: false,
        author: { name: "Mehedi Hassan", avatar: "MH" },
    },
    {
        id: 6,
        title: "Why Kuakata is Bangladesh's Most Underrated Destination Right Now",
        excerpt: "With Cox's Bazar getting crowded, Kuakata's raw, unspoiled beauty is finally having its moment — and you should be there.",
        category: "Trending",
        readTime: "5 min read",
        date: "Mar 14, 2025",
        image: "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=900&q=85",
        tags: ["Kuakata", "Trending", "Beach"],
        featured: false,
        author: { name: "Fatema Akter", avatar: "FA" },
    },
];

const gradients = [
    "from-purple-500 to-violet-600",
    "from-violet-500 to-fuchsia-600",
    "from-fuchsia-500 to-purple-600",
    "from-indigo-500 to-violet-600",
    "from-purple-600 to-indigo-600",
    "from-violet-600 to-purple-700",
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

function FeaturedPost({ post }: { post: typeof posts[0] }) {
    const [ref, visible] = useInView(0.1);
    const [hovered, setHovered] = useState(false);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group relative rounded-3xl overflow-hidden border cursor-pointer
        border-purple-200 dark:border-purple-800/50"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: "opacity 0.6s ease, transform 0.6s ease, box-shadow 0.3s ease",
                boxShadow: hovered
                    ? "0 32px 80px rgba(139,92,246,0.18), 0 0 0 1px rgba(139,92,246,0.2)"
                    : "0 8px 32px rgba(139,92,246,0.07)",
            }}
        >
            {/* Image */}
            <div className="relative h-72 overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

                {/* Featured pill */}
                <div className="absolute top-4 left-4 flex items-center gap-2">
                    <div className="inline-flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-violet-600 rounded-full px-3 py-1.5 shadow-lg">
                        <TrendingUp size={11} className="text-white" />
                        <span className="text-[11px] font-bold text-white">Featured Story</span>
                    </div>
                </div>

                {/* Category */}
                <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-sm border border-white/15 rounded-full px-3 py-1">
                    <span className="text-[11px] font-semibold text-white/90">{post.category}</span>
                </div>

                {/* Bottom overlay */}
                <div className="absolute bottom-4 left-4 right-4">
                    <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.map(t => (
                            <span key={t} className="text-[10px] font-semibold text-white/80 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-2.5 py-0.5">{t}</span>
                        ))}
                    </div>
                    <h3 className="text-xl font-bold text-white leading-snug drop-shadow-lg">{post.title}</h3>
                </div>
            </div>

            {/* Body */}
            <div className="bg-white dark:bg-zinc-900/90 p-6">
                <p className="text-sm text-muted-foreground leading-relaxed mb-5">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-xl bg-gradient-to-br ${gradients[post.id - 1]} flex items-center justify-center shadow-sm`}>
                            <span className="text-[10px] font-bold text-white">{post.author.avatar}</span>
                        </div>
                        <div>
                            <p className="text-xs font-semibold text-foreground">{post.author.name}</p>
                            <div className="flex items-center gap-2 mt-0.5">
                                <Clock size={9} className="text-muted-foreground" />
                                <span className="text-[10px] text-muted-foreground">{post.readTime}</span>
                                <span className="text-muted-foreground/40 text-[10px]">·</span>
                                <span className="text-[10px] text-muted-foreground">{post.date}</span>
                            </div>
                        </div>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-bold text-purple-600 dark:text-purple-400 hover:text-purple-700 dark:hover:text-purple-300 transition-colors duration-200 group/btn">
                        Read more
                        <ArrowRight size={13} className="group-hover/btn:translate-x-1 transition-transform duration-200" />
                    </button>
                </div>
            </div>
        </div>
    );
}

function BlogCard({ post, index }: { post: typeof posts[0]; index: number }) {
    const [ref, visible] = useInView();
    const [, setHovered] = useState(false);

    return (
        <div
            ref={ref}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            className="group flex flex-col rounded-2xl border overflow-hidden cursor-pointer
        bg-white dark:bg-zinc-900/70
        border-purple-100 dark:border-purple-900/40
        hover:border-purple-400 dark:hover:border-purple-500
        hover:shadow-xl hover:shadow-purple-500/10"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(24px)",
                transition: `opacity 0.5s ease ${index * 0.1}s, transform 0.5s ease ${index * 0.1}s, box-shadow 0.3s ease, border-color 0.3s ease`,
            }}
        >
            {/* Image */}
            <div className="relative h-44 overflow-hidden">
                <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                {/* Category badge */}
                <div className="absolute top-3 left-3">
                    <div className={`inline-flex items-center bg-gradient-to-r ${gradients[post.id - 1]} rounded-full px-2.5 py-1`}>
                        <span className="text-[10px] font-bold text-white">{post.category}</span>
                    </div>
                </div>

                {/* Read time */}
                <div className="absolute bottom-3 right-3 flex items-center gap-1 bg-black/50 backdrop-blur-sm border border-white/10 rounded-full px-2 py-1">
                    <Clock size={9} className="text-white/80" />
                    <span className="text-[10px] font-medium text-white/80">{post.readTime}</span>
                </div>
            </div>

            {/* Content */}
            <div className="flex flex-col flex-1 p-4">
                <div className="flex flex-wrap gap-1 mb-2.5">
                    {post.tags.slice(0, 2).map(t => (
                        <span key={t} className="text-[10px] font-medium text-purple-700 dark:text-purple-300 bg-purple-50 dark:bg-purple-950/50 border border-purple-200 dark:border-purple-800/40 rounded-md px-2 py-0.5">
                            {t}
                        </span>
                    ))}
                </div>

                <h4 className="text-sm font-bold text-foreground leading-snug mb-2 line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-200">
                    {post.title}
                </h4>
                <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2 mb-4 flex-1">
                    {post.excerpt}
                </p>

                {/* Footer */}
                <div className="h-px bg-gradient-to-r from-purple-100 dark:from-purple-900/40 to-transparent mb-3" />
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className={`w-6 h-6 rounded-lg bg-gradient-to-br ${gradients[post.id - 1]} flex items-center justify-center`}>
                            <span className="text-[9px] font-bold text-white">{post.author.avatar}</span>
                        </div>
                        <span className="text-[11px] font-medium text-muted-foreground">{post.date}</span>
                    </div>
                    <div className="w-7 h-7 rounded-lg bg-purple-100 dark:bg-purple-900/50 border border-purple-200 dark:border-purple-800/50 flex items-center justify-center group-hover:bg-purple-600 group-hover:border-purple-600 transition-all duration-200">
                        <ArrowRight size={13} className="text-purple-600 dark:text-purple-400 group-hover:text-white transition-colors duration-200" />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function TravelBlog() {
    const [headerRef, headerVisible] = useInView(0.2);
    const [activeCategory, setActiveCategory] = useState("All");

    const filtered = activeCategory === "All" ? posts : posts.filter(p => p.category === activeCategory);
    const featured = filtered.find(p => p.featured) ?? filtered[0];
    const rest = filtered.filter(p => p.id !== featured?.id).slice(0, 4);

    return (
        <Container className="relative py-24 overflow-hidden bg-background">
            {/* Grid bg */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />
            <div className="absolute top-1/3 left-0 w-80 h-80 bg-violet-500/8 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />
            <div className="absolute bottom-1/3 right-0 w-80 h-80 bg-purple-500/8 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2" />

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
                        <BookOpen size={12} className="text-purple-500" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                            Travel Stories & Insider Tips
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        From the{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                            TrekOn Journal
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                        Real stories, practical guides, and photography tips from travelers who've explored every corner of Bangladesh.
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
                                    : "bg-white dark:bg-zinc-900/60 border-purple-100 dark:border-purple-900/40 text-muted-foreground hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400"
                                }`}
                        >
                            <Icon size={12} />
                            {label}
                        </button>
                    ))}
                </div>

                {/* Layout: featured left + 2x2 grid right */}
                {featured && (
                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

                        {/* Featured post — 2 cols */}
                        <div className="lg:col-span-2">
                            <FeaturedPost post={featured} />
                        </div>

                        {/* 2×2 grid — 3 cols */}
                        <div className="lg:col-span-3 grid grid-cols-1 sm:grid-cols-2 gap-5 content-start">
                            {rest.map((post, i) => (
                                <BlogCard key={post.id} post={post} index={i} />
                            ))}
                        </div>
                    </div>
                )}

                {/* Bottom bar */}
                <div
                    className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-12 pt-8 border-t border-border"
                    style={{ opacity: headerVisible ? 1 : 0, transition: "opacity 0.7s ease 0.5s" }}
                >
                    <div className="flex items-center gap-3">
                        <div className="flex -space-x-2">
                            {["RI", "NJ", "TA", "SH"].map((av, i) => (
                                <div key={av}
                                    className="w-7 h-7 rounded-full border-2 border-background flex items-center justify-center text-[9px] font-bold text-white"
                                    style={{ background: `linear-gradient(135deg, hsl(${260 + i * 20},80%,55%), hsl(${280 + i * 20},80%,45%))`, zIndex: 4 - i }}
                                >
                                    {av}
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground">
                            Written by <span className="font-semibold text-foreground">real travelers</span> across Bangladesh
                        </p>
                    </div>
                    <button className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl border border-purple-200 dark:border-purple-800/60 bg-white dark:bg-zinc-900/60 text-sm font-semibold text-purple-600 dark:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/60 hover:border-purple-400 transition-all duration-200 group">
                        Read All Articles
                        <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform duration-200" />
                    </button>
                </div>

            </div>
        </Container>
    );
}