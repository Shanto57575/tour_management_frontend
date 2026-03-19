import { Input } from "@/components/ui/input";
import { SearchIcon, XIcon, SlidersHorizontal } from "lucide-react";
import { useMemo } from "react";

interface IFilterPanelProps {
  searchTerm: string;
  selectedDivisions: string[];
  divisions: Array<{ _id: string; name: string }>;
  onSearchChange: (value: string) => void;
  onDivisionToggle: (divisionId: string) => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const DestinationFilterPanel = ({
  searchTerm,
  selectedDivisions,
  divisions,
  onSearchChange,
  onDivisionToggle,
  onClearFilters,
  hasActiveFilters,
}: IFilterPanelProps) => {
  const selectedDivisionNames = useMemo(() => {
    return divisions
      .filter((d) => selectedDivisions.includes(d._id))
      .map((d) => d.name)
      .join(", ");
  }, [divisions, selectedDivisions]);

  return (
    <div className="rounded-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 space-y-5">

      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Filters</h3>
        </div>
        {hasActiveFilters && (
          <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300">
            {selectedDivisions.length + (searchTerm ? 1 : 0)} active
          </span>
        )}
      </div>

      <div className="h-px bg-gray-100 dark:bg-gray-800" />

      {/* Search */}
      <div className="space-y-1.5">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Search</label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Name, summary, district…"
            className="pl-9 h-9 text-sm bg-white dark:bg-gray-900 border-gray-200 dark:border-gray-700 focus-visible:ring-purple-500 focus-visible:border-purple-500"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
          {searchTerm && (
            <button
              onClick={() => onSearchChange("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 transition-colors"
            >
              <XIcon className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Division Filter */}
      {divisions.length > 0 && (
        <div className="space-y-2">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Division</label>
          <div className="flex flex-wrap gap-1.5">
            {divisions.map((division) => {
              const isActive = selectedDivisions.includes(division._id);
              return (
                <button
                  key={division._id}
                  type="button"
                  onClick={() => onDivisionToggle(division._id)}
                  className={`
                    px-3 py-1 rounded-md text-xs font-medium border transition-colors duration-150
                    ${isActive
                      ? "bg-purple-600 text-white border-purple-600 hover:bg-purple-700 hover:border-purple-700"
                      : "bg-white dark:bg-black text-gray-600 dark:text-gray-400 border-gray-200 dark:border-gray-700 hover:border-purple-500 hover:text-purple-700 dark:hover:text-purple-400 dark:hover:border-purple-600"
                    }
                  `}
                >
                  {division.name}
                </button>
              );
            })}
          </div>
          {selectedDivisions.length > 0 && (
            <p className="text-xs text-gray-400 dark:text-gray-500 leading-relaxed">
              Selected: {selectedDivisionNames}
            </p>
          )}
        </div>
      )}

      {/* Clear Filters */}
      {hasActiveFilters && (
        <>
          <div className="h-px bg-gray-100 dark:bg-gray-800" />
          <button
            type="button"
            onClick={onClearFilters}
            className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium rounded-md text-red-500 dark:text-red-400 border border-gray-200 dark:border-gray-700 hover:bg-red-50 dark:hover:bg-red-950/20 hover:border-red-300 dark:hover:border-red-800 transition-colors duration-150"
          >
            <XIcon className="h-3.5 w-3.5" />
            Clear All Filters
          </button>
        </>
      )}
    </div>
  );
};