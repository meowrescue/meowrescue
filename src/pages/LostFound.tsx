
import React from "react";
import Layout from "../components/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { useAuth } from "@/contexts/AuthContext";
import { useLostFoundPosts } from "@/hooks/useLostFoundPosts";
import FilterControls from "@/components/LostFound/FilterControls";
import PostsList from "@/components/LostFound/PostsList";
import SEO from "@/components/SEO";

const LostFound = () => {
  const { user } = useAuth();
  const { posts, isLoading, filter, setFilter, searchTerm, setSearchTerm } = useLostFoundPosts();

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

        <FilterControls 
          filter={filter}
          setFilter={setFilter}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <PostsList posts={posts} isLoading={isLoading} />
      </div>
    </Layout>
  );
};

export default LostFound;
