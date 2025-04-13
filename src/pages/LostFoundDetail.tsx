
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LostFoundPost, Comment } from "@/types/supabase";
import {
  MapPin,
  CalendarDays,
  User,
  Phone,
  Mail,
  Clock,
  AlertCircle,
  Search,
  CheckCircle,
  MessageSquare,
  ChevronLeft,
  Edit,
} from "lucide-react";

const LostFoundDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [post, setPost] = useState<LostFoundPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      fetchPostAndComments();
    }
  }, [id]);

  const fetchPostAndComments = async () => {
    setIsLoading(true);
    try {
      // Fetch post
      const { data: postData, error: postError } = await supabase
        .from("lost_found_posts")
        .select("*, profiles(first_name, last_name, email)")
        .eq("id", id)
        .single();

      if (postError) {
        console.error("Error fetching post:", postError);
        toast({
          title: "Error",
          description: "Unable to load the post details.",
          variant: "destructive",
        });
        navigate("/lost-found");
        return;
      }

      setPost(postData as unknown as LostFoundPost);

      // Fetch comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("post_comments")
        .select("*, profiles(first_name, last_name)")
        .eq("post_id", id)
        .order("created_at", { ascending: true });

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
        toast({
          title: "Error",
          description: "Unable to load comments.",
          variant: "destructive",
        });
        return;
      }

      setComments(commentsData as unknown as Comment[]);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to comment on posts.",
        variant: "destructive",
      });
      return;
    }

    if (!newComment.trim()) {
      toast({
        title: "Empty comment",
        description: "Please enter a comment before submitting.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmittingComment(true);
    try {
      const { data, error } = await supabase.from("post_comments").insert({
        post_id: id,
        profile_id: user.id,
        content: newComment.trim(),
      }).select();

      if (error) {
        console.error("Error submitting comment:", error);
        toast({
          title: "Error",
          description: "Unable to submit your comment. Please try again.",
          variant: "destructive",
        });
        return;
      }

      // Add the newly created comment to the list
      const newCommentData = data[0] as unknown as Comment;
      
      // Get the user's profile info
      const { data: profileData } = await supabase
        .from("profiles")
        .select("first_name, last_name")
        .eq("id", user.id)
        .single();
        
      // Add the profile info to the comment
      newCommentData.profiles = profileData as Comment["profiles"];
      
      setComments([...comments, newCommentData]);
      setNewComment("");
      
      toast({
        title: "Comment posted",
        description: "Your comment has been posted successfully.",
      });
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsSubmittingComment(false);
    }
  };

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
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-1/2 mb-8"></div>
            <div className="md:flex gap-8">
              <div className="w-full md:w-1/2 h-[400px] bg-gray-200 rounded mb-6 md:mb-0"></div>
              <div className="w-full md:w-1/2">
                <div className="h-8 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-6"></div>
                <div className="h-20 bg-gray-200 rounded mb-6"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
              </div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8 text-center">
          <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
          <p className="mb-6">The post you are looking for does not exist or has been removed.</p>
          <Button asChild variant="outline">
            <Link to="/lost-found">
              <ChevronLeft className="mr-1" size={16} /> Back to Lost & Found
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button
          asChild
          variant="outline"
          className="mb-6"
          size="sm"
        >
          <Link to="/lost-found">
            <ChevronLeft className="mr-1" size={16} /> Back to Lost & Found
          </Link>
        </Button>

        <div className="md:flex gap-8">
          {/* Left column - Photos */}
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
                    className={`absolute top-4 right-4 px-3 py-1 rounded-full text-sm font-medium flex items-center gap-1 ${getStatusBadgeClass(
                      post.status
                    )}`}
                  >
                    {getStatusIcon(post.status)}
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

          {/* Right column - Details */}
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
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium mb-4 ${getStatusBadgeClass(
                post.status
              )}`}
            >
              {getStatusIcon(post.status)}
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
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <h2 className="text-xl font-bold flex items-center mb-6">
            <MessageSquare className="mr-2" size={20} />
            Comments {comments.length > 0 && `(${comments.length})`}
          </h2>

          {/* Comment form */}
          {user ? (
            <div className="mb-8">
              <Textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share additional information or updates..."
                className="mb-2"
                rows={4}
              />
              <Button
                variant="meow"
                onClick={handleCommentSubmit}
                disabled={isSubmittingComment || !newComment.trim()}
              >
                {isSubmittingComment ? "Posting..." : "Post Comment"}
              </Button>
            </div>
          ) : (
            <div className="bg-gray-50 p-4 rounded-lg mb-8 text-center">
              <p className="text-gray-700 mb-3">Please log in to comment on this post.</p>
              <Button asChild variant="meow">
                <Link to="/login">Log In</Link>
              </Button>
            </div>
          )}

          {/* Comments list */}
          {comments.length > 0 ? (
            <div className="space-y-4">
              {comments.map((comment) => (
                <div key={comment.id} className="bg-white p-4 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center mb-2">
                    <div className="font-medium">
                      {comment.profiles?.first_name
                        ? `${comment.profiles.first_name} ${comment.profiles.last_name || ""}`
                        : "Anonymous User"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {new Date(comment.created_at).toLocaleDateString()}
                    </div>
                  </div>
                  <p className="text-gray-700">{comment.content}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 bg-gray-50 rounded-lg">
              <MessageSquare className="mx-auto text-gray-400 mb-2" size={24} />
              <p className="text-gray-600">No comments yet. Be the first to comment!</p>
            </div>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default LostFoundDetail;
