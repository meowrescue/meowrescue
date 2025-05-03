
import React from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { LostFoundPost } from "@/types/getSupabaseClient()";
import LostFoundCard from "./LostFoundCard";

interface LostFoundGridProps {
  posts: LostFoundPost[];
  isLoading: boolean;
  filter: string;
}

const LostFoundGrid: React.FC<LostFoundGridProps> = ({ posts, isLoading, filter }) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-24 bg-gray-200 rounded mb-4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-5xl mb-4">🔍</div>
        <h3 className="text-xl font-medium mb-2">No posts found</h3>
        <p className="text-gray-600 mb-6">
          {filter !== "all"
            ? `There are no ${filter} pets posts available. Try another filter or check back later.`
            : "There are no posts available at the moment. Be the first to create one!"}
        </p>
        <Button asChild variant="meow">
          <Link to="/lost-found/new">Create a Post</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {posts.map((post) => (
        <LostFoundCard key={post.id} post={post} />
      ))}
    </div>
  );
};

export default LostFoundGrid;
