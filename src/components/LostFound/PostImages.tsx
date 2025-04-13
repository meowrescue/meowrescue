
import React, { useState } from "react";
import { LostFoundPost } from "@/types/supabase";

interface PostImagesProps {
  post: LostFoundPost;
  statusBadgeClass: string;
  statusIcon: React.ReactNode;
}

const PostImages: React.FC<PostImagesProps> = ({ post, statusBadgeClass, statusIcon }) => {
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  return (
    <div className="w-full md:w-1/2 mb-6 md:mb-0">
      {post.photos_urls && post.photos_urls.length > 0 ? (
        <div>
          <div className="relative rounded-lg overflow-hidden mb-2">
            <img
              src={post.photos_urls[activeImageIndex]}
              alt={post.title}
              className="w-full h-[400px] object-cover"
            />
            <div
              className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${statusBadgeClass}`}
            >
              {statusIcon}
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </div>
          </div>
          {post.photos_urls.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-2">
              {post.photos_urls.map((url, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImageIndex(index)}
                  className={`w-20 h-20 rounded-md overflow-hidden flex-shrink-0 border-2 ${
                    index === activeImageIndex ? "border-meow-primary" : "border-transparent"
                  }`}
                >
                  <img src={url} alt={`Thumbnail ${index + 1}`} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full h-[400px] bg-gray-200 rounded-lg flex items-center justify-center">
          <span className="text-gray-500">No images available</span>
        </div>
      )}
    </div>
  );
};

export default PostImages;
