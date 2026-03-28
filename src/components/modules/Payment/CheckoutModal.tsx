import { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import {
    Elements,
    PaymentElement,
    useStripe,
    useElements,
} from "@stripe/react-stripe-js";
import { X, CreditCard, Lock, ShieldCheck } from "lucide-react";
import { toast } from "sonner";

const stripePublishableKey = import.meta.env
    .VITE_STRIPE_PUBLISHABLE_KEY as string;
const stripePromise = loadStripe(stripePublishableKey);

// ─── Inner form that uses Stripe hooks ───────────────────────────────────────
interface CheckoutFormProps {
    amount: number;
    tourTitle: string;
    onClose: () => void;
}

function CheckoutForm({ amount, tourTitle, onClose }: CheckoutFormProps) {
    const stripe = useStripe();
    const elements = useElements();
    const [isProcessing, setIsProcessing] = useState(false);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!stripe || !elements) return;

        setIsProcessing(true);
        setErrorMessage(null);

        const { error } = await stripe.confirmPayment({
            elements,
            confirmParams: {
                // Stripe will redirect here after payment completion
                return_url: `${window.location.origin}/payment/success`,
            },
        });

        // Only reaches here if there was an error
        if (error) {
            if (error.type === "card_error" || error.type === "validation_error") {
                setErrorMessage(error.message ?? "An unexpected error occurred.");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again.");
            }
            toast.error(errorMessage ?? "Payment failed");
        }

        setIsProcessing(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-5">
            {/* Tour summary */}
            <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-xl p-4 border border-indigo-100 dark:border-indigo-800/40">
                <p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider mb-1">
                    Booking Summary
                </p>
                <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
                    {tourTitle}
                </p>
                <p className="text-xl font-bold text-indigo-600 dark:text-indigo-400 mt-1">
                    ৳{amount.toLocaleString()}
                </p>
            </div>

            {/* Stripe Elements */}
            <div>
                <label className="block text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                    Card Details
                </label>
                <div className="rounded-xl border border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 p-4 focus-within:ring-2 focus-within:ring-indigo-500 transition-all">
                    <PaymentElement
                        options={{
                            layout: "tabs",
                        }}
                    />
                </div>
            </div>

            {/* Error message */}
            {errorMessage && (
                <div className="flex items-start gap-2 p-3 rounded-xl bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800/40 text-sm text-rose-700 dark:text-rose-300">
                    <span>{errorMessage}</span>
                </div>
            )}

            {/* Security badge */}
            <div className="flex items-center gap-2 text-xs text-slate-400 dark:text-zinc-500">
                <Lock className="w-3 h-3 flex-shrink-0" />
                <span>Your payment is secured by Stripe and 256-bit SSL encryption</span>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-1">
                <button
                    type="button"
                    onClick={onClose}
                    className="flex-1 py-3 rounded-xl border border-slate-200 dark:border-zinc-700 text-slate-700 dark:text-zinc-300 font-semibold text-sm hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all duration-200"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isProcessing || !stripe || !elements}
                    className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 active:bg-indigo-800 text-white font-bold text-sm transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-indigo-600/30 hover:shadow-indigo-600/40 hover:-translate-y-0.5 flex items-center justify-center gap-2"
                >
                    {isProcessing ? (
                        <>
                            <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Processing…
                        </>
                    ) : (
                        <>
                            <CreditCard className="w-4 h-4" />
                            Pay ৳{amount.toLocaleString()}
                        </>
                    )}
                </button>
            </div>
        </form>
    );
}

// ─── Modal wrapper ────────────────────────────────────────────────────────────
interface CheckoutModalProps {
    clientSecret: string;
    amount: number;
    tourTitle: string;
    onClose: () => void;
}

export function CheckoutModal({
    clientSecret,
    amount,
    tourTitle,
    onClose,
}: CheckoutModalProps) {
    return (
        // Backdrop
        <div
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            {/* Blurred background overlay */}
            <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

            {/* Modal card */}
            <div className="relative z-10 w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                {/* Header */}
                <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-slate-200 dark:border-zinc-800 bg-slate-50 dark:bg-zinc-800/60">
                    <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-lg bg-indigo-100 dark:bg-indigo-900/40 flex items-center justify-center">
                            <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                        </div>
                        <div>
                            <p className="text-sm font-bold text-slate-900 dark:text-white">
                                Secure Checkout
                            </p>
                            <p className="text-xs text-slate-500 dark:text-zinc-400">
                                Powered by Stripe
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-500 hover:text-slate-700 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-200 dark:hover:bg-zinc-700 transition-all duration-150"
                    >
                        <X className="w-4 h-4" />
                    </button>
                </div>

                {/* Body */}
                <div className="p-4 sm:p-6">
                    <Elements
                        stripe={stripePromise}
                        options={{
                            clientSecret,
                            appearance: {
                                theme: "stripe",
                                variables: {
                                    colorPrimary: "#4f46e5",
                                    colorBackground: "#ffffff",
                                    colorText: "#1e293b",
                                    colorDanger: "#ef4444",
                                    fontFamily: "Inter, system-ui, sans-serif",
                                    borderRadius: "8px",
                                },
                            },
                        }}
                    >
                        <CheckoutForm
                            amount={amount}
                            tourTitle={tourTitle}
                            onClose={onClose}
                        />
                    </Elements>
                </div>
            </div>
        </div>
    );
}
