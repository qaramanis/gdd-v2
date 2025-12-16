import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

export function GamesFilters({ searchTerm, setSearchTerm }: FiltersProps) {
  return (
    <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
      <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 size-4" />
          <Input
            placeholder="Search games..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full sm:w-64"
          />
        </div>
      </div>
    </div>
  );
}
