import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SearchIcon, SlidersHorizontal, XIcon } from "lucide-react";
import { useId } from "react";

interface IFilterPanelProps {
  searchTerm: string;
  selectedDivision: string;
  selectedDistricts: string[];
  divisions: Array<{ _id: string; name: string }>;
  districts: Array<{ _id: string; name: string }>;
  onSearchChange: (value: string) => void;
  onSelectDivision: (divisionId: string) => void;
  onDistrictToggle: (districtName: string) => void;
  onClearDivision: () => void;
  onClearDistrict: () => void;
  onClearFilters: () => void;
  hasActiveFilters: boolean;
}

export const DestinationFilterPanel = ({
  searchTerm,
  selectedDivision,
  selectedDistricts,
  divisions,
  districts,
  onSearchChange,
  onSelectDivision,
  onDistrictToggle,
  onClearDivision,
  onClearDistrict,
  onClearFilters,
  hasActiveFilters,
}: IFilterPanelProps) => {
  const divisionRadioName = useId();

  return (
    <div className="h-full rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-black p-4 space-y-5 overflow-y-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="h-4 w-4 text-gray-400 dark:text-gray-500" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-100">Filters</h3>
        </div>
        {hasActiveFilters && (
          <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onClearFilters}>
            <XIcon className="h-3.5 w-3.5" />
            Clear
          </Button>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Search</label>
        <div className="relative">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-gray-400" />
          <Input
            placeholder="Name, summary, district..."
            className="pl-9 h-9 text-sm"
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">Division</label>
          <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onClearDivision}>
            All Divisions
          </Button>
        </div>
        <div className="space-y-2 pr-1">
          <label className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
            <input
              type="radio"
              name={divisionRadioName}
              checked={selectedDivision === "all"}
              onChange={() => onSelectDivision("all")}
              className="size-4 accent-purple-600 dark:accent-purple-400"
            />
            <span>All Divisions</span>
          </label>
          {divisions.map((division) => (
            <label key={division._id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
              <input
                type="radio"
                name={divisionRadioName}
                checked={selectedDivision === division._id}
                onChange={() => onSelectDivision(division._id)}
                className="size-4 accent-purple-600 dark:accent-purple-400"
              />
              <span>{division.name}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-gray-500 dark:text-gray-400">District</label>
          <Button type="button" variant="ghost" size="sm" className="h-7 px-2 text-xs" onClick={onClearDistrict}>
            All Districts
          </Button>
        </div>
        {districts.length === 0 ? (
          <p className="text-xs text-gray-500 dark:text-gray-400">No district options available for current selection.</p>
        ) : (
          <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
            {districts.map((district) => (
              <label key={district._id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedDistricts.includes(district.name)}
                  onChange={() => onDistrictToggle(district.name)}
                  className="size-4 rounded accent-black dark:accent-white"
                />
                <span>{district.name}</span>
              </label>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
