
import React from "react";
import { Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface LostFoundSearchProps {
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const LostFoundSearch: React.FC<LostFoundSearchProps> = ({ searchTerm, setSearchTerm }) => {
  return (
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
  );
};

export default LostFoundSearch;
