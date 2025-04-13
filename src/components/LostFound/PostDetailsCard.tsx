
import React from "react";
import { Link } from "react-router-dom";
import { MapPin, CalendarDays, User, Phone, Mail, Clock, Edit } from "lucide-react";
import { Button } from "@/components/ui/button";
import { LostFoundPost } from "@/types/supabase";
import { useAuth } from "@/contexts/AuthContext";

interface PostDetailsCardProps {
  post: LostFoundPost;
  statusBadgeClass: string;
  statusIcon: React.ReactNode;
}

const PostDetailsCard: React.FC<PostDetailsCardProps> = ({ 
  post, 
  statusBadgeClass, 
  statusIcon 
}) => {
  const { user } = useAuth();
  
  return (
    <div className="w-full md:w-1/2">
      <div className="flex justify-between items-start">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{post.title}</h1>
        {user && user.id === post.profile_id && (
          <Button asChild variant="outline" size="sm">
            <Link to={`/lost-found/edit/${post.id}`}>
              <Edit size={16} className="mr-1" /> Edit
            </Link>
          </Button>
        )}
      </div>
      
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-4 ${statusBadgeClass}`}
      >
        {statusIcon}
        {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
      </div>

      <p className="text-gray-700 mb-6">{post.description}</p>

      <div className="space-y-3 mb-6">
        <div className="flex items-start">
          <MapPin size={18} className="text-meow-primary mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">Location</h3>
            <p className="text-gray-600">{post.location}</p>
          </div>
        </div>

        <div className="flex items-start">
          <CalendarDays size={18} className="text-meow-primary mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">Date</h3>
            <p className="text-gray-600">{new Date(post.date_occurred).toLocaleDateString()}</p>
          </div>
        </div>

        {post.pet_name && (
          <div className="flex items-start">
            <User size={18} className="text-meow-primary mr-2 mt-0.5 flex-shrink-0" />
            <div>
              <h3 className="font-medium text-gray-900">Pet Name</h3>
              <p className="text-gray-600">{post.pet_name}</p>
            </div>
          </div>
        )}

        <div className="flex items-start">
          <Clock size={18} className="text-meow-primary mr-2 mt-0.5 flex-shrink-0" />
          <div>
            <h3 className="font-medium text-gray-900">Posted</h3>
            <p className="text-gray-600">{new Date(post.created_at).toLocaleDateString()}</p>
          </div>
        </div>
      </div>

      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h3 className="font-medium text-gray-900 mb-2">Contact Information</h3>
        <div className="space-y-2">
          {post.profiles?.first_name && (
            <div className="flex items-center">
              <User size={16} className="text-gray-500 mr-2" />
              <span className="text-gray-700">
                {post.profiles.first_name} {post.profiles?.last_name || ""}
              </span>
            </div>
          )}
          {post.contact_info && post.contact_info.includes("@") ? (
            <div className="flex items-center">
              <Mail size={16} className="text-gray-500 mr-2" />
              <a href={`mailto:${post.contact_info}`} className="text-meow-primary hover:underline">
                {post.contact_info}
              </a>
            </div>
          ) : post.contact_info ? (
            <div className="flex items-center">
              <Phone size={16} className="text-gray-500 mr-2" />
              <a href={`tel:${post.contact_info}`} className="text-meow-primary hover:underline">
                {post.contact_info}
              </a>
            </div>
          ) : post.profiles?.email ? (
            <div className="flex items-center">
              <Mail size={16} className="text-gray-500 mr-2" />
              <a href={`mailto:${post.profiles.email}`} className="text-meow-primary hover:underline">
                {post.profiles.email}
              </a>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default PostDetailsCard;
