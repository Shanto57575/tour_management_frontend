import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router";
import {
    CheckCircle2,
    XCircle,
    Clock,
    Loader2,
    MapPin,
    Users,
    Calendar,
    CreditCard,
    ArrowRight,
    Home,
    BookOpen,
    Download,
} from "lucide-react";

type PaymentStatus =
    | "succeeded"
    | "processing"
    | "requires_payment_method"
    | string;

interface BookingData {
    tourTitle: string;
    tourLocation: string;
    tourImage: string | null;
    guestCount: number;
    amount: number;
    costPerPerson: number;
    startDate: string;
    endDate: string;
    bookingId: string;
}

const formatDate = (s?: string) =>
    s
        ? new Date(s).toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
            year: "numeric",
        })
        : "—";

const formatCurrency = (n: number) =>
    `৳${n.toLocaleString("en-US")}`;

// ─────────────────────────────────────────────────────────────────────────────

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const paymentIntentId = searchParams.get("payment_intent");
    const redirectStatus = searchParams.get("redirect_status") as PaymentStatus | null;

    const [booking, setBooking] = useState<BookingData | null>(null);

    useEffect(() => {
        const raw = localStorage.getItem("pendingBooking");
        if (raw) {
            try {
                setBooking(JSON.parse(raw));
            } catch {
                // malformed — ignore
            }
            // Clean up only on success so that refresh still shows data
            if (redirectStatus === "succeeded") {
                localStorage.removeItem("pendingBooking");
            }
        }
    }, [redirectStatus]);

    // ── Succeeded ───────────────────────────────────────────────────────────────
    if (redirectStatus === "succeeded") {
        return (
            <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 dark:from-zinc-950 dark:via-indigo-950/20 dark:to-purple-950/20 flex items-center justify-center p-4">
                <div className="w-full max-w-2xl space-y-4">

                    {/* ── Status card ── */}
                    <div className="bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl shadow-slate-200/60 dark:shadow-zinc-950/80 overflow-hidden">

                        {/* Green header */}
                        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 px-8 py-10 text-center relative overflow-hidden">
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(255,255,255,0.15),_transparent_60%)]" />
                            <div className="relative">
                                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm mb-4 ring-4 ring-white/30">
                                    <CheckCircle2 className="w-8 h-8 text-white" />
                                </div>
                                <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
                                    Booking Confirmed!
                                </h1>
                                <p className="text-emerald-100 text-sm">
                                    Your payment was successful. A confirmation email & invoice will be sent shortly.
                                </p>
                            </div>
                        </div>

                        <div className="p-6 md:p-8 space-y-6">

                            {/* ── Tour summary card (if booking data is available) ── */}
                            {booking && (
                                <div className="flex gap-4 p-4 rounded-2xl bg-slate-50 dark:bg-zinc-800/60 border border-slate-200 dark:border-zinc-700/50">
                                    {booking.tourImage && (
                                        <img
                                            src={booking.tourImage}
                                            alt={booking.tourTitle}
                                            className="w-20 h-20 rounded-xl object-cover flex-shrink-0 border border-slate-200 dark:border-zinc-700"
                                        />
                                    )}
                                    <div className="flex-1 min-w-0">
                                        <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                                            Tour Booked
                                        </p>
                                        <h2 className="font-bold text-slate-900 dark:text-white text-base leading-tight truncate">
                                            {booking.tourTitle}
                                        </h2>
                                        {booking.tourLocation && (
                                            <p className="flex items-center gap-1 text-xs text-slate-500 dark:text-zinc-400 mt-1">
                                                <MapPin className="w-3 h-3 flex-shrink-0" />
                                                {booking.tourLocation}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* ── Booking details grid ── */}
                            {booking && (
                                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                                    {[
                                        {
                                            icon: <Users className="w-4 h-4" />,
                                            label: "Guests",
                                            value: `${booking.guestCount} ${booking.guestCount === 1 ? "person" : "people"}`,
                                        },
                                        {
                                            icon: <Calendar className="w-4 h-4" />,
                                            label: "Start Date",
                                            value: formatDate(booking.startDate),
                                        },
                                        {
                                            icon: <Calendar className="w-4 h-4" />,
                                            label: "End Date",
                                            value: formatDate(booking.endDate),
                                        },
                                        {
                                            icon: <CreditCard className="w-4 h-4" />,
                                            label: "Total Paid",
                                            value: formatCurrency(booking.amount),
                                            highlight: true,
                                        },
                                    ].map((item, i) => (
                                        <div
                                            key={i}
                                            className={`rounded-xl p-3 border text-center ${item.highlight
                                                    ? "bg-indigo-50 dark:bg-indigo-900/20 border-indigo-200 dark:border-indigo-800/40"
                                                    : "bg-slate-50 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700/50"
                                                }`}
                                        >
                                            <div className={`flex justify-center mb-1.5 ${item.highlight ? "text-indigo-600 dark:text-indigo-400" : "text-slate-400 dark:text-zinc-500"}`}>
                                                {item.icon}
                                            </div>
                                            <p className="text-xs text-slate-500 dark:text-zinc-400 mb-0.5">
                                                {item.label}
                                            </p>
                                            <p className={`text-sm font-bold ${item.highlight ? "text-indigo-600 dark:text-indigo-400" : "text-slate-900 dark:text-white"}`}>
                                                {item.value}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {/* ── Payment reference ── */}
                            <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-slate-50 dark:bg-zinc-800/40 p-4 space-y-2.5 text-sm">
                                <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider">
                                    Payment Reference
                                </p>
                                {booking?.bookingId && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-zinc-400">Booking ID</span>
                                        <span className="font-mono font-medium text-slate-800 dark:text-zinc-200 text-xs">
                                            {booking.bookingId}
                                        </span>
                                    </div>
                                )}
                                {paymentIntentId && (
                                    <div className="flex items-center justify-between">
                                        <span className="text-slate-500 dark:text-zinc-400">Payment ID</span>
                                        <span className="font-mono text-slate-800 dark:text-zinc-200 text-xs truncate max-w-[180px]">
                                            {paymentIntentId}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-zinc-400">Status</span>
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                        Confirmed
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <span className="text-slate-500 dark:text-zinc-400">Invoice</span>
                                    <span className="flex items-center gap-1 text-xs text-indigo-600 dark:text-indigo-400">
                                        <Download className="w-3 h-3" />
                                        Being sent to your email
                                    </span>
                                </div>
                            </div>

                            {/* ── Actions ── */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Link to="/user/bookings" className="flex-1">
                                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all duration-200">
                                        <BookOpen className="w-4 h-4" />
                                        My Bookings
                                    </button>
                                </Link>
                                <Link to="/" className="flex-1">
                                    <button className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all duration-200 shadow-lg shadow-indigo-600/30 hover:-translate-y-0.5">
                                        <Home className="w-4 h-4" />
                                        Back to Home
                                        <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    // ── Processing ───────────────────────────────────────────────────────────────
    if (redirectStatus === "processing") {
        return (
            <StatusScreen
                icon={<Clock className="w-10 h-10 text-amber-500" />}
                iconBg="bg-amber-100 dark:bg-amber-900/30"
                title="Payment Processing"
                description="Your payment is being processed. We'll send you a confirmation email as soon as it clears — usually within a few minutes."
                badgeColor="bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300"
                badgeText="Processing"
                booking={booking}
            />
        );
    }

    // ── Failed ───────────────────────────────────────────────────────────────────
    if (redirectStatus === "requires_payment_method") {
        return (
            <StatusScreen
                icon={<XCircle className="w-10 h-10 text-rose-500" />}
                iconBg="bg-rose-100 dark:bg-rose-900/30"
                title="Payment Failed"
                description="Your payment wasn't completed. Please go back and try again with a different payment method."
                badgeColor="bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-300"
                badgeText="Failed"
                booking={booking}
                backLink
            />
        );
    }

    // ── Loading / unknown ────────────────────────────────────────────────────────
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50 dark:from-zinc-950 dark:to-indigo-950">
            <div className="flex flex-col items-center gap-4 text-center p-8">
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                <p className="text-slate-600 dark:text-zinc-300 font-medium">Verifying your payment…</p>
            </div>
        </div>
    );
}

// ─── Shared status screen for non-success states ─────────────────────────────
function StatusScreen({
    icon,
    iconBg,
    title,
    description,
    badgeColor,
    badgeText,
    booking,
    backLink,
}: {
    icon: React.ReactNode;
    iconBg: string;
    title: string;
    description: string;
    badgeColor: string;
    badgeText: string;
    booking: BookingData | null;
    backLink?: boolean;
}) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/30 to-purple-50/40 dark:from-zinc-950 dark:via-indigo-950/20 dark:to-purple-950/20 flex items-center justify-center p-4">
            <div className="w-full max-w-lg bg-white dark:bg-zinc-900 rounded-3xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden">
                <div className="p-8 flex flex-col items-center text-center gap-4">
                    <div className={`w-20 h-20 rounded-full ${iconBg} flex items-center justify-center ring-4 ring-white dark:ring-zinc-900 shadow-lg`}>
                        {icon}
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-slate-900 dark:text-white mb-2">{title}</h1>
                        <p className="text-slate-500 dark:text-zinc-400 text-sm leading-relaxed">{description}</p>
                    </div>

                    {booking && (
                        <div className="w-full rounded-xl border border-slate-200 dark:border-zinc-700 p-4 text-left space-y-2 text-sm">
                            <p className="font-semibold text-slate-900 dark:text-white">{booking.tourTitle}</p>
                            <div className="flex justify-between text-slate-500 dark:text-zinc-400">
                                <span>{booking.guestCount} guest{booking.guestCount > 1 ? "s" : ""}</span>
                                <span className="font-bold text-slate-700 dark:text-zinc-200">{formatCurrency(booking.amount)}</span>
                            </div>
                        </div>
                    )}

                    <span className={`px-4 py-1.5 rounded-full text-xs font-semibold ${badgeColor}`}>
                        {badgeText}
                    </span>

                    <div className="flex w-full gap-3">
                        {backLink ? (
                            <Link to="/" className="flex-1">
                                <button className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                                    Try Again <ArrowRight className="w-4 h-4" />
                                </button>
                            </Link>
                        ) : (
                            <Link to="/" className="flex-1">
                                <button className="w-full py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2">
                                    <Home className="w-4 h-4" />
                                    Back to Home
                                </button>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}