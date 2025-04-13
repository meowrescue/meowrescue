
import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Plus } from "lucide-react";
import { Link } from "react-router-dom";

interface FilterControlsProps {
  filter: "all" | "lost" | "found" | "reunited";
  setFilter: (filter: "all" | "lost" | "found" | "reunited") => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const FilterControls: React.FC<FilterControlsProps> = ({
  filter,
  setFilter,
  searchTerm,
  setSearchTerm,
}) => {
  return (
    <div className="flex flex-col gap-6 mb-8">
      {/* Filter buttons row - always visible */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={filter === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("all")}
        >
          All Posts
        </Button>
        <Button
          variant={filter === "lost" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("lost")}
        >
          Lost Pets
        </Button>
        <Button
          variant={filter === "found" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("found")}
        >
          Found Pets
        </Button>
        <Button
          variant={filter === "reunited" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("reunited")}
        >
          Reunited
        </Button>
      </div>

      {/* Search and new post row */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative w-full sm:w-auto flex-grow max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
          <Input
            type="text"
            placeholder="Search posts..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Button asChild variant="meow" className="whitespace-nowrap">
          <Link to="/lost-found/new">
            <Plus className="mr-1" size={16} /> New Post
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default FilterControls;
