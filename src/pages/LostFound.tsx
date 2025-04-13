import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import SectionHeading from "@/components/ui/SectionHeading";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { MapPin, CalendarDays, Search, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { LostFoundPost } from "@/types/supabase";
import SEO from "@/components/SEO";
import { getStatusBadgeClass, getStatusIcon } from "@/utils/lostFoundUtils";

const LostFound = () => {
  const { user } = useAuth();
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
          {/* Filter buttons row - always visible */}
          <div className="flex flex-wrap gap-2">
            <Button
              variant={filter === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("all")}
            >
              All Posts
            </Button>
            <Button
              variant={filter === "lost" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("lost")}
            >
              Lost Pets
            </Button>
            <Button
              variant={filter === "found" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("found")}
            >
              Found Pets
            </Button>
            <Button
              variant={filter === "reunited" ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter("reunited")}
            >
              Reunited
            </Button>
          </div>

          {/* Search and new post row */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
            <div className="relative w-full sm:w-auto flex-grow max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
              <Input
                type="text"
                placeholder="Search posts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 w-full"
              />
            </div>
            <Button asChild variant="meow" className="whitespace-nowrap">
              <Link to="/lost-found/new">
                <Plus className="mr-1" size={16} /> New Post
              </Link>
            </Button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-4"></div>
                <div className="h-24 bg-gray-200 rounded mb-4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/3"></div>
              </div>
            ))}
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPosts.map((post) => (
              <Link
                to={`/lost-found/${post.id}`}
                key={post.id}
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
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-5xl mb-4">🔍</div>
            <h3 className="text-xl font-medium mb-2">No posts found</h3>
            <p className="text-gray-600 mb-6">
              {filter !== "all"
                ? `There are no ${filter} pets posts available. Try another filter or check back later.`
                : "There are no posts available at the moment. Be the first to create one!"}
            </p>
            <Button asChild variant="meow">
              <Link to="/lost-found/new">Create a Post</Link>
            </Button>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default LostFound;
