import { Link, useSearchParams } from "react-router";
import { CheckCircle2, ArrowRight } from "lucide-react";

const PaymentSuccess = () => {
    const [searchParams] = useSearchParams();

    const transactionId = searchParams.get("transactionId");
    const message = searchParams.get("message");
    const amount = searchParams.get("amount");
    const status = searchParams.get("status");

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-[#0f0720] dark:via-[#120a28] dark:to-[#1b0f35] p-6">
            <div className="w-full max-w-lg rounded-3xl border border-purple-200/40 dark:border-purple-500/20 bg-white/70 dark:bg-[#1a1033]/70 backdrop-blur-xl shadow-2xl p-8">

                <div className="flex flex-col items-center text-center">
                    <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/40 mb-4">
                        <CheckCircle2 className="text-purple-600 dark:text-purple-400" size={48} />
                    </div>

                    <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mb-2">
                        Payment Successful
                    </h1>

                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-6">
                        {message || "Your payment has been completed successfully."}
                    </p>
                </div>

                <div className="space-y-4 rounded-xl bg-purple-50/70 dark:bg-purple-900/20 border border-purple-200/50 dark:border-purple-700/30 p-5 text-sm">

                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Transaction ID</span>
                        <span className="font-medium text-gray-800 dark:text-gray-200">
                            {transactionId}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Amount Paid</span>
                        <span className="font-semibold text-purple-600 dark:text-purple-400">
                            ৳{amount}
                        </span>
                    </div>

                    <div className="flex justify-between">
                        <span className="text-gray-500 dark:text-gray-400">Status</span>
                        <span className="px-3 py-1 text-xs rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/40 dark:text-purple-300">
                            {status}
                        </span>
                    </div>
                </div>

                <Link to="/" className="mt-8 flex gap-3 cursor-pointer">
                    <button
                        className="flex-1 flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-xl transition"
                    >
                        Go Home
                        <ArrowRight size={16} />
                    </button>
                </Link>
            </div>
        </div>
    );
};

export default PaymentSuccess;