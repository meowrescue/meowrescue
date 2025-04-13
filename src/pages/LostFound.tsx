
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

const LostFound = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [posts, setPosts] = useState<LostFoundPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "lost" | "found" | "reunited">("all");
  const [petTypeFilter, setPetTypeFilter] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [petTypes, setPetTypes] = useState<string[]>([]);

  useEffect(() => {
    fetchPosts();
  }, [filter]);

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      let query = supabase
        .from("lost_found_posts")
        .select("*")
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
      
      // Extract unique pet types
      if (data && data.length > 0) {
        const types = [...new Set(data.map(post => post.pet_type))];
        setPetTypes(types);
      }
    } catch (error) {
      console.error("Unexpected error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredPosts = posts
    .filter(post => petTypeFilter === "" || post.pet_type.toLowerCase() === petTypeFilter.toLowerCase())
    .filter(post => 
      searchTerm === "" || 
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.pet_type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (post.pet_name && post.pet_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
      post.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <Layout>
      <SEO 
        title="Lost & Found Pets" 
        description="Help reunite lost pets with their families. Report lost or found pets in our community."
      />
      
      <div className="container mx-auto px-4 py-8">
        <SectionHeading
          title="Lost & Found Pets"
          subtitle="Help reunite lost pets with their families"
          centered
        />

        <div className="flex flex-col gap-6 mb-8">
          {/* Filter buttons */}
          <LostFoundFilters 
            filter={filter} 
            setFilter={setFilter} 
            petTypeFilter={petTypeFilter}
            setPetTypeFilter={setPetTypeFilter}
            petTypes={petTypes}
          />

          {/* Search and new post */}
          <LostFoundSearch searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
        </div>

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
