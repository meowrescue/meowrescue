import React, { useState, useEffect } from "react";
import Layout from "../components/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { LostFoundPost } from "@/types/supabase";
import SEO from "@/components/SEO";
import LostFoundFilters from "@/components/LostFound/LostFoundFilters";
import LostFoundSearch from "@/components/LostFound/LostFoundSearch";
import LostFoundGrid from "@/components/LostFound/LostFoundGrid";
import { Button } from "@/components/ui/button";

const LostFound = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<LostFoundPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<"all" | "lost" | "found" | "reunited">("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Create structured data for this page
  const lostFoundStructuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Lost & Found Pets",
    "description": "Help reunite lost pets with their families. Report lost or found pets in our community.",
    "url": "https://meowrescue.org/lost-found",
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": posts.map((post, index) => ({
        "@type": "ListItem",
        "position": index + 1,
        "item": {
          "@type": "Article",
          "name": post.title,
          "description": post.description,
          "url": `https://meowrescue.org/lost-found/${post.id}`
        }
      }))
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setIsLoading(true);
    setError(null);
    try {
      let query = supabase
        .from("lost_found_posts")
        .select("*")
        .neq("status", "archived") // Exclude archived posts
        .order("created_at", { ascending: false });

      if (filter !== "all") {
        query = query.eq("status", filter);
      }

      const { data, error } = await query;

      if (error) {
        console.error("Error fetching posts:", error);
        setError(error.message);
        toast({
          title: "Error fetching posts",
          description: error.message,
          variant: "destructive",
        });
        return;
      }

      setPosts(data as unknown as LostFoundPost[]);
    } catch (error: any) {
      console.error("Unexpected error:", error);
      setError(error.message || "An unexpected error occurred");
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

  return (
    <Layout>
      <SEO 
        title="Lost & Found Pets | Meow Rescue" 
        description="Help reunite lost pets with their families. Report lost or found pets in our community."
        keywords="lost pets, found pets, missing cats, missing pets, pet reunification, animal rescue"
        canonicalUrl="/lost-found"
        structuredData={lostFoundStructuredData}
      />
      
      <div className="container mx-auto px-4 py-8 mt-2">
        <SectionHeading
          title="Lost & Found Pets"
          subtitle="Help reunite lost pets with their families"
          centered
        />

        <div className="flex flex-col gap-6 mb-8">
          {/* Filter buttons */}
          <LostFoundFilters filter={filter} setFilter={setFilter} />

          {/* Search and new post */}
          <LostFoundSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

        {/* Error state */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-500 mb-4">{error}</p>
            <Button onClick={fetchPosts}>Try Again</Button>
          </div>
        )}

        {/* Posts grid */}
        <LostFoundGrid 
          posts={filteredPosts} 
          isLoading={isLoading} 
          filter={filter} 
        />
      </div>
    </Layout>
  );
};

export default LostFound;
