
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { MessageSquare, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Comment } from "@/types/supabase";

interface CommentSectionProps {
  postId: string;
  comments: Comment[];
  setComments: React.Dispatch<React.SetStateAction<Comment[]>>;
}

const CommentSection: React.FC<CommentSectionProps> = ({ postId, comments, setComments }) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [newComment, setNewComment] = useState("");
  const [isSubmittingComment, setIsSubmittingComment] = useState(false);

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
        post_id: postId,
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

  return (
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
            {isSubmittingComment ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Posting...
              </>
            ) : (
              "Post Comment"
            )}
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
  );
};

export default CommentSection;
