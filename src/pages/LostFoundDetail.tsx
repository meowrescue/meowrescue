import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import Layout from "../components/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChevronLeft, AlertCircle, RefreshCw } from "lucide-react";
import { supabase } from '@integrations/supabase';
import { LostFoundPost } from '@supabase/types';
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import SEO from "@/components/SEO";

const LostFoundDetail = () => {
  const { id: postId } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [errorRetries, setErrorRetries] = useState(0);

  // Fetch post details
  const { data: post, isLoading, error, refetch } = useQuery({
    queryKey: ['lost-found-post', postId, errorRetries],
    queryFn: async () => {
      console.log(`Fetching lost & found post with ID: ${postId}`);
      
      try {
        
        const { data, error } = await supabase
          .from('lost_found_posts')
          .select('*')
          .eq('id', postId)
          .single();

        if (error) throw error;
        
        // Fetch author profile separately
        let authorProfile = null;
        if (data.profile_id) {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('first_name, last_name, email')
            .eq('id', data.profile_id)
            .single();
            
          if (!profileError && profileData) {
            authorProfile = profileData;
          }
        }
        
        // Return post with author profile
        return {
          ...data,
          profiles: authorProfile
        } as LostFoundPost;
      } catch (error: any) {
        console.error("Error fetching lost & found post:", error);
        throw error;
      }
    },
    retry: false
  });

  // Subscribe to real-time updates for this lost and found post
  useEffect(() => {
    if (!postId) return;
    
    const subscription = supabase
      .channel(`lost-found-${postId}-updates`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'lost_found_posts', filter: `id=eq.${postId}` }, (payload) => {
        console.log('Lost and found update received:', payload);
        window.location.reload(); // Temporary workaround to refresh the page
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [postId]);

  // Function to handle retry
  const handleRetry = () => {
    setErrorRetries(prev => prev + 1);
  };

  // Function to handle going back to the list
  const handleBackToList = () => {
    navigate("/lost-found");
  };

  // Determine if current user is the author
  const isAuthor = user && post?.profile_id === user.id;

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
            <div className="h-64 bg-gray-200 rounded mb-6"></div>
            <div className="space-y-4">
              <div className="h-6 bg-gray-200 rounded w-1/3"></div>
              <div className="h-6 bg-gray-200 rounded w-1/2"></div>
              <div className="h-6 bg-gray-200 rounded w-1/4"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  // Error state
  if (error) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-center text-center py-12">
            <AlertCircle className="w-16 h-16 text-red-500 mb-4" />
            <h2 className="text-2xl font-bold mb-2">Error loading post details</h2>
            <p className="text-gray-600 mb-6">Please try again later.</p>
            <div className="flex gap-4">
              <Button onClick={handleRetry} className="flex items-center gap-2">
                <RefreshCw size={16} />
                Try Again
              </Button>
              <Button variant="outline" onClick={handleBackToList}>
                Return to Lost & Found
              </Button>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${post.title} | Lost & Found`}
        description={post.description}
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

        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold text-meow-primary mb-4">{post.title}</h1>
          <div className="mb-4">
            <Badge variant={
              post.status === 'lost' ? 'destructive' :
              post.status === 'found' ? 'outline' :
              post.status === 'reunited' ? 'default' :
              'secondary'
            }>
              {post.status.charAt(0).toUpperCase() + post.status.slice(1)}
            </Badge>
          </div>

          {post.photos_urls && post.photos_urls.length > 0 && (
            <div className="mb-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {post.photos_urls.map((url, index) => (
                  <img
                    key={index}
                    src={url}
                    alt={`${post.pet_type} ${index + 1}`}
                    className="rounded-md w-full h-64 object-cover"
                  />
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            <div>
              <h2 className="text-xl font-semibold mb-2">Details</h2>
              <p>
                <span className="font-medium">Pet Type:</span> {post.pet_type}
              </p>
              {post.pet_name && (
                <p>
                  <span className="font-medium">Pet Name:</span> {post.pet_name}
                </p>
              )}
              <p>
                <span className="font-medium">Location:</span> {post.location}
              </p>
              <p>
                <span className="font-medium">Date:</span> {new Date(post.date_occurred).toLocaleDateString()}
              </p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="whitespace-pre-wrap">{post.description}</p>
            </div>

            <div>
              <h2 className="text-xl font-semibold mb-2">Contact Information</h2>
              {post.profiles ? (
                <>
                  <p>
                    <span className="font-medium">Name:</span> {post.profiles.first_name} {post.profiles.last_name}
                  </p>
                  <p>
                    <span className="font-medium">Email:</span> {post.profiles.email}
                  </p>
                  {post.contact_info && (
                    <p>
                      <span className="font-medium">Additional Contact Info:</span> {post.contact_info}
                    </p>
                  )}
                </>
              ) : (
                <p>No contact information available.</p>
              )}
            </div>

            {isAuthor && (
              <div>
                <Button asChild variant="meow">
                  <Link to={`/lost-found/edit/${postId}`}>Edit Post</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default LostFoundDetail;
