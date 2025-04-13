
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { LostFoundPost } from "@/types/supabase";

export const useLostFoundPosts = () => {
  const { toast } = useToast();
  const [posts, setPosts] = useState<LostFoundPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "lost" | "found" | "reunited">("all");
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("lost_found_posts")
        .select("*, profiles(first_name, last_name)")
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
        toast({
          title: "Error fetching posts",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setPosts(data as unknown as LostFoundPost[]);
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = searchTerm
    ? posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          post.pet_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (post.pet_name && post.pet_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
          post.location.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : posts;

  return {
    posts: filteredPosts,
    isLoading,
    filter,
    setFilter,
    searchTerm,
    setSearchTerm,
  };
};
