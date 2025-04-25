
import React from 'react';
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

interface SearchAndFilterProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

const SearchAndFilter: React.FC<SearchAndFilterProps> = ({
  searchQuery,
  onSearchChange,
}) => {
  return (
    <div className="flex items-center gap-4 w-full md:w-auto">
      <div className="relative w-full md:w-auto">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <Input
          placeholder="Search posts..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-10 w-full md:w-64"
        />
      </div>
    </div>
  );
};

export default SearchAndFilter;
