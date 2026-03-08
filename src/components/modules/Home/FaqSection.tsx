import { useEffect, useRef, useState } from "react";
import { HelpCircle, Plus, Minus, MessageCircle, ArrowRight } from "lucide-react";
import { Container } from "@/components/shared/Container";

const faqs = [
    {
        id: 1,
        question: "How do I book a tour on TrekOn?",
        answer: "Booking is simple — browse destinations or packages, pick your preferred dates and group size, then click 'Book Now'. You'll get an instant confirmation via email and SMS. The entire process takes under 2 minutes.",
        category: "Booking",
    },
    {
        id: 2,
        question: "Can I customize a tour package to fit my group?",
        answer: "Absolutely. Every TrekOn package is fully customizable. You can adjust the itinerary, add or remove activities, change accommodation tiers, and request private transport. Just contact us after booking or use the 'Customize' option on any package page.",
        category: "Booking",
    },
    {
        id: 3,
        question: "What is TrekOn's cancellation and refund policy?",
        answer: "Cancellations made 7+ days before departure receive a full refund. Cancellations 3–7 days before receive a 50% refund. Within 3 days, refunds are at the guide's discretion. For weather-related cancellations, we always offer a full reschedule or refund.",
        category: "Policy",
    },
    {
        id: 4,
        question: "Are your local guides certified and vetted?",
        answer: "Yes — all TrekOn guides go through a thorough background check, first aid certification, and region-specific training before being listed. Most guides are native to their tour region and have 3+ years of active experience.",
        category: "Safety",
    },
    {
        id: 5,
        question: "What safety measures are in place for remote treks?",
        answer: "For all remote tours (Bandarban, Sundarbans, CHT), we require guides to carry emergency communication devices and first aid kits. You'll also receive a detailed safety briefing before departure. Our 24/7 support line is always active during your trip.",
        category: "Safety",
    },
    {
        id: 6,
        question: "Does TrekOn provide travel insurance?",
        answer: "We offer optional travel insurance add-ons at checkout, covering medical emergencies, trip cancellations, and lost belongings. For international travelers, we strongly recommend adding it. Domestic travelers can opt in for full peace of mind.",
        category: "Policy",
    },
    {
        id: 7,
        question: "What's the best season to travel in Bangladesh?",
        answer: "October to March (winter) is peak season — dry, cool, and perfect for most destinations. Sajek and Bandarban are magical in monsoon (June–September) despite rain. The Sundarbans is best visited November–February to avoid cyclone season.",
        category: "Travel",
    },
    {
        id: 8,
        question: "Can solo travelers join group tour packages?",
        answer: "Yes! All our group packages welcome solo travelers. It's one of the best ways to meet fellow explorers. You can also filter packages by 'Solo-Friendly' on the tour listing page. Solo pricing applies to single-occupancy accommodation.",
        category: "Travel",
    },
    {
        id: 9,
        question: "How do I pay? Is it safe?",
        answer: "We accept bKash, Nagad, Rocket, all major debit/credit cards, and bank transfers. All payments are processed over SSL-encrypted connections. You'll receive a digital receipt instantly. We never store your card details.",
        category: "Booking",
    },
];

const categoryColors: Record<string, string> = {
    Booking: "text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-950/50 border-purple-200 dark:border-purple-800/40",
    Policy: "text-violet-600 dark:text-violet-400 bg-violet-50 dark:bg-violet-950/50 border-violet-200 dark:border-violet-800/40",
    Safety: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 border-emerald-200 dark:border-emerald-800/40",
    Travel: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/50 border-amber-200 dark:border-amber-800/40",
};

const filters = ["All", "Booking", "Policy", "Safety", "Travel"];

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

function FaqItem({
    faq,
    index,
    isOpen,
    onToggle,
}: {
    faq: typeof faqs[0];
    index: number;
    isOpen: boolean;
    onToggle: () => void;
}) {
    const [ref, visible] = useInView();
    const bodyRef = useRef<HTMLDivElement>(null);
    const [height, setHeight] = useState(0);

    useEffect(() => {
        if (bodyRef.current) {
            setHeight(isOpen ? bodyRef.current.scrollHeight : 0);
        }
    }, [isOpen]);

    return (
        <div
            ref={ref}
            className={`group rounded-2xl border overflow-hidden transition-all duration-300 cursor-pointer
        ${isOpen
                    ? "border-purple-300 dark:border-purple-600/60 shadow-lg shadow-purple-500/10 dark:shadow-purple-500/15 bg-white dark:bg-zinc-900/90"
                    : "border-purple-100 dark:border-purple-900/40 bg-white dark:bg-zinc-900/60 hover:border-purple-300 dark:hover:border-purple-700/60 hover:shadow-md hover:shadow-purple-500/8"
                }`}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0)" : "translateY(20px)",
                transition: `opacity 0.5s ease ${index * 0.06}s, transform 0.5s ease ${index * 0.06}s, border-color 0.25s ease, box-shadow 0.25s ease`,
            }}
            onClick={onToggle}
        >
            {/* Animated left accent bar */}
            <div
                className="absolute left-0 top-0 bottom-0 w-0.5 bg-gradient-to-b from-purple-500 via-violet-500 to-purple-600 rounded-full transition-opacity duration-300"
                style={{ opacity: isOpen ? 1 : 0 }}
            />

            <div className="relative px-5 py-4 flex items-start gap-4">
                {/* Number */}
                <div className={`shrink-0 w-8 h-8 rounded-xl flex items-center justify-center text-xs font-black transition-all duration-300
          ${isOpen
                        ? "bg-gradient-to-br from-purple-500 to-violet-600 text-white shadow-md shadow-purple-500/30"
                        : "bg-purple-50 dark:bg-purple-950/50 border border-purple-100 dark:border-purple-900/40 text-purple-500 dark:text-purple-400"
                    }`}
                >
                    {String(faq.id).padStart(2, "0")}
                </div>

                {/* Question + category */}
                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                                <span className={`text-[10px] font-semibold border rounded-full px-2 py-0.5 ${categoryColors[faq.category]}`}>
                                    {faq.category}
                                </span>
                            </div>
                            <p className={`text-sm font-semibold leading-snug transition-colors duration-200
                ${isOpen ? "text-purple-700 dark:text-purple-300" : "text-foreground group-hover:text-purple-700 dark:group-hover:text-purple-300"}`}
                            >
                                {faq.question}
                            </p>
                        </div>

                        {/* Toggle icon */}
                        <div className={`shrink-0 w-7 h-7 rounded-xl border flex items-center justify-center transition-all duration-300
              ${isOpen
                                ? "bg-purple-100 dark:bg-purple-900/50 border-purple-300 dark:border-purple-600/60 rotate-0"
                                : "bg-white dark:bg-zinc-900 border-purple-100 dark:border-purple-900/40"
                            }`}
                        >
                            {isOpen
                                ? <Minus size={13} className="text-purple-600 dark:text-purple-400" />
                                : <Plus size={13} className="text-muted-foreground group-hover:text-purple-500 transition-colors duration-200" />
                            }
                        </div>
                    </div>
                </div>
            </div>

            {/* Animated answer body */}
            <div
                style={{ height, overflow: "hidden", transition: "height 0.35s cubic-bezier(0.4,0,0.2,1)" }}
            >
                <div ref={bodyRef}>
                    <div className="px-5 pb-5 pl-[68px]">
                        <div className="h-px bg-gradient-to-r from-purple-200 dark:from-purple-800/50 to-transparent mb-4" />
                        <p className="text-sm text-muted-foreground leading-relaxed">{faq.answer}</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function FaqSection() {
    const [headerRef, headerVisible] = useInView(0.2);
    const [activeFilter, setActiveFilter] = useState("All");
    const [openId, setOpenId] = useState<number | null>(1);

    const filtered = activeFilter === "All" ? faqs : faqs.filter(f => f.category === activeFilter);

    return (
        <Container className="relative py-24 overflow-hidden bg-background">
            {/* Grid bg */}
            <div className="absolute inset-0 pointer-events-none"
                style={{
                    backgroundImage: "linear-gradient(rgba(139,92,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.04) 1px, transparent 1px)",
                    backgroundSize: "56px 56px",
                }}
            />
            <div className="absolute top-1/2 left-0 w-96 h-96 bg-violet-500/8 dark:bg-violet-500/10 rounded-full blur-3xl pointer-events-none -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute top-1/2 right-0 w-96 h-96 bg-purple-500/8 dark:bg-purple-500/10 rounded-full blur-3xl pointer-events-none translate-x-1/2 -translate-y-1/2" />

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
                        <HelpCircle size={12} className="text-purple-500" />
                        <span className="text-xs font-semibold uppercase tracking-widest text-purple-600 dark:text-purple-400">
                            Got Questions? We've Got Answers
                        </span>
                    </div>
                    <h2 className="text-4xl sm:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        Frequently Asked{" "}
                        <span className="bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600 bg-clip-text text-transparent">
                            Questions
                        </span>
                    </h2>
                    <p className="text-muted-foreground text-lg max-w-xl mx-auto leading-relaxed">
                        Everything you need to know about booking, safety, and exploring Bangladesh with TrekOn.
                    </p>
                    <div className="flex items-center justify-center gap-3 mt-8">
                        <div className="w-10 h-px bg-gradient-to-r from-transparent to-purple-400/60" />
                        <div className="w-2 h-2 rounded-full bg-purple-500" />
                        <div className="w-10 h-px bg-gradient-to-l from-transparent to-purple-400/60" />
                    </div>
                </div>

                {/* Filters */}
                <div
                    className="flex flex-wrap gap-2 justify-center mb-8"
                    style={{ opacity: headerVisible ? 1 : 0, transition: "opacity 0.7s ease 0.2s" }}
                >
                    {filters.map((f) => (
                        <button
                            key={f}
                            onClick={() => { setActiveFilter(f); setOpenId(null); }}
                            className={`px-4 py-2 rounded-full text-xs font-semibold border transition-all duration-200
                ${activeFilter === f
                                    ? "bg-purple-600 border-purple-600 text-white shadow-md shadow-purple-500/30"
                                    : "bg-white dark:bg-zinc-900/60 border-purple-100 dark:border-purple-900/40 text-muted-foreground hover:border-purple-400 hover:text-purple-600 dark:hover:text-purple-400"
                                }`}
                        >
                            {f}
                            {f !== "All" && (
                                <span className={`ml-1.5 text-[10px] font-bold ${activeFilter === f ? "text-white/70" : "text-muted-foreground/60"}`}>
                                    {faqs.filter(fq => fq.category === f).length}
                                </span>
                            )}
                        </button>
                    ))}
                </div>

                {/* FAQ list */}
                <div className="space-y-3 relative">
                    {filtered.map((faq, i) => (
                        <div key={faq.id} className="relative">
                            <FaqItem
                                faq={faq}
                                index={i}
                                isOpen={openId === faq.id}
                                onToggle={() => setOpenId(openId === faq.id ? null : faq.id)}
                            />
                        </div>
                    ))}
                </div>

                {/* Bottom support card */}
                <div
                    className="mt-12 rounded-3xl overflow-hidden border border-purple-100 dark:border-purple-900/40 bg-white dark:bg-zinc-900/70"
                    style={{ opacity: headerVisible ? 1 : 0, transition: "opacity 0.7s ease 0.4s" }}
                >
                    <div className="h-1 bg-gradient-to-r from-purple-500 via-violet-500 to-purple-600" />
                    <div className="p-7 flex flex-col sm:flex-row items-center gap-5">
                        {/* Icon */}
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-violet-600 flex items-center justify-center shadow-lg shadow-purple-500/30 shrink-0">
                            <MessageCircle size={24} color="white" strokeWidth={1.8} />
                        </div>
                        <div className="flex-1 text-center sm:text-left">
                            <h3 className="text-base font-bold text-foreground mb-1">Still have questions?</h3>
                            <p className="text-sm text-muted-foreground">
                                Our support team is online 24/7 — reach us via live chat, WhatsApp, or email and we'll respond within minutes.
                            </p>
                        </div>
                        <button className="shrink-0 inline-flex items-center gap-2 bg-gradient-to-r from-purple-600 to-violet-600 hover:from-purple-500 hover:to-violet-500 text-white text-sm font-bold px-5 py-3 rounded-xl shadow-md shadow-purple-500/25 hover:shadow-purple-500/40 hover:-translate-y-0.5 transition-all duration-200 group">
                            Chat With Us
                            <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform duration-200" />
                        </button>
                    </div>
                </div>
            </div>
        </Container>
    );
}