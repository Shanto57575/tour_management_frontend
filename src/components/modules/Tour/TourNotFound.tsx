import { MapPin } from "lucide-react";

export default function TourNotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 to-purple-50 dark:from-gray-950 dark:to-purple-950">
      <div className="text-center">
        <div className="w-20 h-20 mx-auto mb-4 rounded-full bg-gradient-to-br from-purple-100 to-purple-100 dark:from-purple-900 dark:to-purple-900 flex items-center justify-center">
          <MapPin className="w-10 h-10 text-purple-600 dark:text-purple-400" />
        </div>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Tour not found
        </p>
      </div>
    </div>
  );
}
