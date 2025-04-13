
import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LostFoundPost, Comment } from "@/types/supabase";
import { getStatusBadgeClass, getStatusIcon } from "@/utils/lostFoundUtils";
import PostImages from "@/components/LostFound/PostImages";
import PostDetailsCard from "@/components/LostFound/PostDetailsCard";
import CommentSection from "@/components/LostFound/CommentSection";
import LoadingState from "@/components/LostFound/LoadingState";
import NotFoundState from "@/components/LostFound/NotFoundState";
import SEO from "@/components/SEO";

const LostFoundDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [post, setPost] = useState<LostFoundPost | null>(null);
  const [comments, setComments] = useState<Comment[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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

  if (isLoading) {
    return (
      <Layout>
        <LoadingState />
      </Layout>
    );
  }

  if (!post) {
    return (
      <Layout>
        <NotFoundState />
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${post.title} | Lost & Found Pets`}
        description={post.description.slice(0, 160)}
      />
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
          <PostImages 
            post={post} 
            statusBadgeClass={getStatusBadgeClass(post.status)}
            statusIcon={getStatusIcon(post.status)}
          />

          {/* Right column - Details */}
          <PostDetailsCard 
            post={post} 
            statusBadgeClass={getStatusBadgeClass(post.status)}
            statusIcon={getStatusIcon(post.status)}
          />
        </div>

        {/* Comments Section */}
        <CommentSection 
          postId={id || ''} 
          comments={comments} 
          setComments={setComments} 
        />
      </div>
    </Layout>
  );
};

export default LostFoundDetail;
