
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays } from "lucide-react";
import { LostFoundPost } from "@/types/getSupabaseClient()";
import { getStatusBadgeClass, getStatusIcon } from "@/utils/lostFoundUtils";

interface LostFoundCardProps {
  post: LostFoundPost;
}

const LostFoundCard: React.FC<LostFoundCardProps> = ({ post }) => {
  return (
    <Link
      to={`/lost-found/${post.id}`}
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
  );
};

export default LostFoundCard;
