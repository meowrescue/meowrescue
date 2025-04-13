
import React from "react";
import { Button } from "@/components/ui/button";
import { Filter } from "lucide-react";

interface LostFoundFiltersProps {
  filter: "all" | "lost" | "found" | "reunited";
  setFilter: (filter: "all" | "lost" | "found" | "reunited") => void;
  petTypeFilter: string;
  setPetTypeFilter: (petType: string) => void;
  petTypes: string[];
}

const LostFoundFilters: React.FC<LostFoundFiltersProps> = ({ 
  filter, 
  setFilter, 
  petTypeFilter, 
  setPetTypeFilter, 
  petTypes 
}) => {
  return (
    <div className="space-y-4">
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
          className={filter === "lost" ? "bg-red-600 hover:bg-red-700" : ""}
        >
          Lost Pets
        </Button>
        <Button
          variant={filter === "found" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("found")}
          className={filter === "found" ? "bg-amber-600 hover:bg-amber-700" : ""}
        >
          Found Pets
        </Button>
        <Button
          variant={filter === "reunited" ? "default" : "outline"}
          size="sm"
          onClick={() => setFilter("reunited")}
          className={filter === "reunited" ? "bg-green-600 hover:bg-green-700" : ""}
        >
          Reunited
        </Button>
      </div>
      
      {petTypes.length > 0 && (
        <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center">
          <div className="flex items-center gap-1 text-gray-600 text-sm">
            <Filter size={16} />
            <span>Filter by pet type:</span>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button
              variant={petTypeFilter === "" ? "default" : "outline"}
              size="sm"
              onClick={() => setPetTypeFilter("")}
            >
              All Types
            </Button>
            {petTypes.map((type) => (
              <Button
                key={type}
                variant={petTypeFilter === type ? "default" : "outline"}
                size="sm"
                onClick={() => setPetTypeFilter(type)}
              >
                {type}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LostFoundFilters;
