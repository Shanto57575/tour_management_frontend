import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { ShieldX } from "lucide-react";

export const UnAuthorized = () => {
  return (
    <div className="font-merriweather flex min-h-screen items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-100 dark:from-[#0f0f1a] dark:via-[#0b0b13] dark:to-[#1a1033] px-4">
      
      <div className="w-full max-w-md rounded-2xl border border-purple-200/40 dark:border-purple-800/30 bg-white/70 dark:bg-white/5 backdrop-blur-xl shadow-xl p-8 text-center">
        
        {/* Icon */}
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-purple-100 dark:bg-purple-900/30">
            <ShieldX className="w-10 h-10 text-purple-600 dark:text-purple-400" />
          </div>
        </div>

        {/* Title */}
        <h1 className="flex flex-col text-3xl font-bold text-gray-800 dark:text-white">
          <span className="text-purple-800 mb-2">403</span>
          Unauthorized Access
        </h1>

        {/* Subtitle */}
        <p className="mt-2 text-gray-600 dark:text-gray-400">
          You don’t have permission to access this page.
        </p>

        {/* Button */}
        <div className="mt-6">
          <Button
            asChild
            className="bg-purple-600 hover:bg-purple-700 text-white rounded-md px-6 py-2"
          >
            <Link to="/">Go Back Home</Link>
          </Button>
        </div>

      </div>
    </div>
  );
};