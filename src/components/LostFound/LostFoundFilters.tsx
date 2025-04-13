
import React from "react";
import { Button } from "@/components/ui/button";

interface LostFoundFiltersProps {
  filter: "all" | "lost" | "found" | "reunited";
  setFilter: (filter: "all" | "lost" | "found" | "reunited") => void;
}

const LostFoundFilters: React.FC<LostFoundFiltersProps> = ({ filter, setFilter }) => {
  return (
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
  );
};

export default LostFoundFilters;
