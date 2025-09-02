import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Search, Users } from "lucide-react";

export default function SearchBox() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-6 max-w-4xl mx-auto border border-gray-200 dark:border-gray-700">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Destination
          </label>
          <div className="relative">
            <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Where to?"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <input
              type="date"
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-300">
            Travelers
          </label>
          <div className="relative">
            <Users className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
            <select className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white appearance-none">
              <option>1 Person</option>
              <option>2 People</option>
              <option>3-5 People</option>
              <option>6+ People</option>
            </select>
          </div>
        </div>

        <div className="flex items-end">
          <Button className="w-full py-3 bg-gradient-to-r from-purple-600 to-purple-500 hover:from-purple-700 hover:to-purple-600 text-white font-semibold rounded-lg transition-all duration-200 transform hover:scale-105">
            <Search className="w-5 h-5 mr-2" />
            Search Tours
          </Button>
        </div>
      </div>
    </div>
  );
}
