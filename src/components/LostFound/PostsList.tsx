
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays, AlertCircle, Search, CheckCircle } from "lucide-react";
import { LostFoundPost } from "@/types/supabase";
import { Button } from "@/components/ui/button";

interface PostsListProps {
  posts: LostFoundPost[];
  isLoading: boolean;
}

const PostsList: React.FC<PostsListProps> = ({ posts, isLoading }) => {
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "lost":
        return "bg-red-100 text-red-800 border-red-200";
      case "found":
        return "bg-amber-100 text-amber-800 border-amber-200";
      case "reunited":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "lost":
        return <AlertCircle className="w-4 h-4" />;
      case "found":
        return <Search className="w-4 h-4" />;
      case "reunited":
        return <CheckCircle className="w-4 h-4" />;
      default:
        return null;
    }
  };

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
          There are no posts available at the moment. Be the first to create one!
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
        <Link
          to={`/lost-found/${post.id}`}
          key={post.id}
          className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-300"
        >
          <div className="relative">
            {post.photos_urls && post.photos_urls.length > 0 ? (
              <img
                src={post.photos_urls[0]}
                alt={post.title}
                className="w-full h-48 object-cover"
              />
            ) : (
              <div className="w-full h-48 bg-gray-200 flex items-center justify-center">
                <span className="text-gray-500">No image available</span>
              </div>
            )}
            <div
              className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-medium flex items-center gap-1 ${getStatusBadgeClass(
                post.status
              )}`}
            >
              {getStatusIcon(post.status)}
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </div>
          </div>
          <div className="p-4">
            <h3 className="text-lg font-bold mb-2 text-gray-800 line-clamp-1">{post.title}</h3>
            <p className="text-gray-600 mb-4 line-clamp-2">{post.description}</p>
            <div className="flex items-start mb-2">
              <MapPin size={16} className="text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-500 line-clamp-1">{post.location}</span>
            </div>
            <div className="flex items-start">
              <CalendarDays size={16} className="text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-gray-500">
                {new Date(post.date_occurred).toLocaleDateString()}
              </span>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default PostsList;
