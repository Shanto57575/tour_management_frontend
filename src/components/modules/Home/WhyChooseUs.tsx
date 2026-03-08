import { MapPin, Shield, Users, Clock, Headphones, Award, Compass } from "lucide-react";
import { useEffect, useRef, useState, type Ref } from "react";
import { Container } from "@/components/shared/Container";

const features = [
    {
        icon: MapPin,
        title: "Bangladesh Expert Guides",
        description: "Our local guides know every hidden trail of the Sundarbans, every tea garden in Sylhet, and every ancient mosque in Bagerhat — insider knowledge no app can replicate.",
        stat: "120+",
        statLabel: "Local Guides",
    },
    {
        icon: Shield,
        title: "Safety First, Always",
        description: "Comprehensive travel insurance, 24/7 emergency support, and strict safety protocols for every journey across Bangladesh's diverse landscapes.",
        stat: "99.8%",
        statLabel: "Safe Trips",
    },
    {
        icon: Users,
        title: "Community of Trekkers",
        description: "Join thousands of passionate travelers who've explored Cox's Bazar, the Chittagong Hill Tracts, and Sylhet with TrekOn as their trusted companion.",
        stat: "50K+",
        statLabel: "Happy Travelers",
    },
    {
        icon: Clock,
        title: "Seamless Booking",
        description: "Book your entire tour in minutes — from Dhaka to Bandarban — with real-time availability, flexible scheduling, and instant confirmation.",
        stat: "< 2min",
        statLabel: "Booking Time",
    },
    {
        icon: Headphones,
        title: "24/7 Dedicated Support",
        description: "Whether you're navigating Rangamati or need last-minute help in Sreemangal, our support team is always one call away.",
        stat: "24/7",
        statLabel: "Support",
    },
    {
        icon: Award,
        title: "Award-Winning Experience",
        description: "Recognized as Bangladesh's top travel platform, TrekOn has been crafting unforgettable journeys since 2018.",
        stat: "#1",
        statLabel: "In Bangladesh",
    },
];

function useInView(threshold = 0.15) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => { if (entry.isIntersecting) setVisible(true); },
            { threshold }
        );
        if (ref.current) observer.observe(ref.current);
        return () => observer.disconnect();
    }, []);
    return [ref, visible];
}

function FeatureCard({ feature, index }: { feature: any, index: number }) {
    const [ref, visible] = useInView();
    const Icon = feature.icon;

    return (
        <div
            ref={ref as Ref<HTMLDivElement>}
            className="relative group rounded-2xl p-6 border overflow-hidden
        bg-white dark:bg-zinc-900/60
        border-purple-100 dark:border-purple-900/40
        hover:border-purple-400 dark:hover:border-purple-500
        hover:shadow-xl hover:shadow-purple-500/10
        dark:hover:shadow-purple-500/20
        backdrop-blur-sm
        transition-all duration-300"
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0px)" : "translateY(28px)",
                transition: `opacity 0.55s ease ${index * 0.08}s, transform 0.55s ease ${index * 0.08}s, box-shadow 0.3s ease, border-color 0.3s ease`,
            }}
        >
            {/* Subtle hover glow */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none bg-gradient-to-br from-purple-500/5 to-violet-500/5" />

            {/* Stat badge — top right */}
            <div className="absolute top-4 right-4 text-center bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 rounded-xl px-3 py-1.5">
                <p className="text-sm font-bold leading-none text-purple-600 dark:text-purple-400">{feature.stat}</p>
                <p className="text-[9px] uppercase tracking-widest text-muted-foreground mt-0.5 font-medium">{feature.statLabel}</p>
            </div>

            {/* Icon */}
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-5 bg-purple-100 dark:bg-purple-900/40 border border-purple-200 dark:border-purple-700/40 group-hover:scale-110 transition-transform duration-300">
                <Icon size={22} className="text-purple-600 dark:text-purple-400" strokeWidth={1.8} />
            </div>

            <h3 className="text-base font-semibold text-foreground mb-2 leading-snug pr-16">
                {feature.title}
            </h3>
            <p className="text-sm text-muted-foreground leading-relaxed font-open-sans">
                {feature.description}
            </p>
        </div>
    );
}

export default function WhyChooseUs() {
    const [headerRef, headerVisible] = useInView(0.2);

    return (
        <Container className="relative py-24 overflow-hidden bg-background">

            {/* Background grid */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(var(--grid-color, rgba(139,92,246,0.05)) 1px, transparent 1px), linear-gradient(90deg, var(--grid-color, rgba(139,92,246,0.05)) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />

            {/* Ambient blobs */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-violet-500/8 dark:bg-violet-500/12 rounded-full blur-3xl pointer-events-none translate-y-1/2" />

            <div className="relative">

                {/* Header */}
                <div
                    ref={headerRef as Ref<HTMLDivElement>}
                    className="text-center mb-16"
                    style={{
                        opacity: headerVisible ? 1 : 0,
                        transform: headerVisible ? "translateY(0)" : "translateY(20px)",
                        transition: "opacity 0.7s ease, transform 0.7s ease",
                    }}
                >
                    {/* Eyebrow pill */}
                    <div className="inline-flex items-center gap-2 bg-purple-100 dark:bg-purple-950/70 border border-purple-200 dark:border-purple-800/60 rounded-full px-4 py-1.5 mb-6">
                        <Compass size={13} className="text-purple-600 dark:text-purple-400" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                            Bangladesh's Trusted Travel Partner
                        </span>
                    </div>

                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        Why Travelers Choose{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                            TrekOn
                        </span>
                    </h2>

                    <p className="font-open-sans text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                        From the mangroves of the Sundarbans to the misty peaks of Bandarban — we craft journeys that last a lifetime.
                    </p>

                    {/* Decorative divider */}
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-400/60" />
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <div className="w-10 h-px bg-gradient-to-l from-transparent to-purple-400/60" />
                    </div>
                </div>

                {/* Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {features.map((feature, i) => (
                        <FeatureCard key={i} feature={feature} index={i} />
                    ))}
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
                        { value: "50K+", label: "Travelers Served" },
                        { value: "64", label: "Districts Covered" },
                        { value: "500+", label: "Tour Packages" },
                        { value: "4.9★", label: "Average Rating" },
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