import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Calendar, ArrowLeft, MapPin, User, Phone, Mail, Tag, Info } from 'lucide-react';
import NotFound from './NotFound';
import { Carousel, CarouselContent, CarouselItem } from '@/components/ui/carousel';
import { scrollToTop } from '@/utils/scrollUtils';

const LostFoundDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  
  const { data: post, isLoading, error, refetch } = useQuery({
    queryKey: ['lostFoundPost', id],
    queryFn: async () => {
      try {
        console.log("Fetching lost & found post with ID:", id);
        
        const { data, error } = await supabase
          .from('lost_found_posts')
          .select(`
            *,
            profiles:profile_id (
              email,
              first_name,
              last_name,
              phone
            )
          `)
          .eq('id', id)
          .single();
        
        if (error) {
          console.error("Error fetching lost & found post:", error);
          if (error.code === 'PGRST116') {
            return null; // Not found
          }
          throw error;
        }
        
        console.log("Post retrieved:", data);
        return data;
      } catch (err) {
        console.error("Error in lostFoundPost query:", err);
        throw err;
      }
    }
  });
  
  // If post not found or not published
  if (!isLoading && !post && !error) {
    return <NotFound />;
  }
  
  return (
    <Layout>
      <SEO 
        title={post ? `${post.status === 'lost' ? 'Lost' : 'Found'}: ${post.title} | Meow Rescue` : 'Lost & Found | Meow Rescue'} 
        description={post ? post.description.substring(0, 160) : 'Details about a lost or found pet'}
        image={post?.photos_urls ? post.photos_urls[0] : undefined}
      />
      
      {isLoading ? (
        <div className="container mx-auto px-4 py-16">
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        </div>
      ) : error ? (
        <div className="container mx-auto px-4 py-16">
          <div className="text-center py-12">
            <p className="text-red-500">Error loading post details. Please try again later.</p>
            <Button variant="outline" className="mt-4" onClick={() => refetch()}>
              Try Again
            </Button>
            <Button variant="outline" className="mt-4 ml-2" onClick={() => navigate('/lost-found')}>
              Return to Lost & Found
            </Button>
          </div>
        </div>
      ) : post ? (
        <>
          {/* Hero Section */}
          <div className="w-full py-20 bg-gradient-to-r from-meow-primary/10 to-meow-secondary/10">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center">
                <span className={`inline-block px-4 py-1 rounded-full text-white text-sm font-medium mb-4 ${
                  post.status === 'lost' ? 'bg-red-500' : 'bg-green-500'
                }`}>
                  {post.status === 'lost' ? 'Lost Pet' : 'Found Pet'}
                </span>
                <h1 className="text-3xl md:text-4xl font-bold text-meow-primary mb-4">{post.title}</h1>
                <div className="flex items-center justify-center text-gray-600 mb-4">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>
                    {new Date(post.date_occurred).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
                <div className="flex items-center justify-center text-gray-600">
                  <MapPin className="h-4 w-4 mr-2" />
                  <span>{post.location}</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Content */}
          <div className="container mx-auto px-4 py-12">
            {/* Navigation */}
            <div className="mb-8">
              <Link to="/lost-found">
                <Button variant="ghost" className="flex items-center">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Lost & Found
                </Button>
              </Link>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Main Content */}
              <div className="md:col-span-2">
                {/* Photos */}
                {post.photos_urls && post.photos_urls.length > 0 && (
                  <Card className="mb-8 overflow-hidden">
                    <CardContent className="p-0">
                      <Carousel className="w-full">
                        <CarouselContent>
                          {post.photos_urls.map((url, index) => (
                            <CarouselItem key={index}>
                              <div className="p-1 h-80 md:h-96">
                                <img 
                                  src={url} 
                                  alt={`${post.title} - image ${index + 1}`} 
                                  className="w-full h-full object-cover rounded-md"
                                />
                              </div>
                            </CarouselItem>
                          ))}
                        </CarouselContent>
                      </Carousel>
                    </CardContent>
                  </Card>
                )}
                
                {/* Description */}
                <Card className="mb-8">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Description</h2>
                    <p className="text-gray-700 whitespace-pre-line">{post.description}</p>
                  </CardContent>
                </Card>
                
                {/* Details */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Details</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center">
                        <Tag className="h-5 w-5 mr-3 text-meow-primary" />
                        <div>
                          <p className="text-sm text-gray-500">Pet Type</p>
                          <p className="font-medium">{post.pet_type}</p>
                        </div>
                      </div>
                      
                      {post.pet_name && (
                        <div className="flex items-center">
                          <Info className="h-5 w-5 mr-3 text-meow-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Pet Name</p>
                            <p className="font-medium">{post.pet_name}</p>
                          </div>
                        </div>
                      )}
                      
                      <div className="flex items-center">
                        <Calendar className="h-5 w-5 mr-3 text-meow-primary" />
                        <div>
                          <p className="text-sm text-gray-500">Date</p>
                          <p className="font-medium">
                            {new Date(post.date_occurred).toLocaleDateString('en-US', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </p>
                        </div>
                      </div>
                      
                      <div className="flex items-center">
                        <MapPin className="h-5 w-5 mr-3 text-meow-primary" />
                        <div>
                          <p className="text-sm text-gray-500">Location</p>
                          <p className="font-medium">
                            <a 
                              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(post.location)}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:underline text-meow-primary"
                            >
                              {post.location}
                            </a>
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              {/* Sidebar */}
              <div>
                {/* Contact Information */}
                <Card className="mb-6">
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">Contact Information</h2>
                    
                    <div className="space-y-4">
                      {post.profiles && (
                        <div className="flex items-center">
                          <User className="h-5 w-5 mr-3 text-meow-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Contact Person</p>
                            <p className="font-medium">
                              {post.profiles.first_name || post.profiles.last_name
                                ? `${post.profiles.first_name || ''} ${post.profiles.last_name || ''}`.trim()
                                : 'Anonymous'
                              }
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {post.contact_info && (
                        <div className="flex items-center">
                          <Phone className="h-5 w-5 mr-3 text-meow-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Phone</p>
                            <p className="font-medium">
                              <a href={`tel:${post.contact_info}`} className="hover:underline text-meow-primary">
                                {post.contact_info}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                      
                      {post.profiles && post.profiles.email && (
                        <div className="flex items-center">
                          <Mail className="h-5 w-5 mr-3 text-meow-primary" />
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-medium">
                              <a href={`mailto:${post.profiles.email}`} className="hover:underline text-meow-primary">
                                {post.profiles.email}
                              </a>
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-6">
                      {post.profiles && post.profiles.email && (
                        <Button className="w-full" asChild>
                          <a href={`mailto:${post.profiles.email}?subject=Regarding your ${post.status} pet post: ${post.title}`}>
                            <Mail className="mr-2 h-4 w-4" />
                            Contact
                          </a>
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Help Section */}
                <Card>
                  <CardContent className="p-6">
                    <h2 className="text-xl font-semibold mb-4">How You Can Help</h2>
                    <p className="text-gray-700 mb-4">
                      {post.status === 'lost' 
                        ? "If you've seen this pet or have any information, please contact the owner directly." 
                        : "If this is your pet, please contact the finder directly with proof of ownership."}
                    </p>
                    <p className="text-gray-700 mb-4">
                      Share this post on social media to increase visibility.
                    </p>
                    <Button variant="outline" className="w-full" onClick={() => {
                      navigator.clipboard.writeText(window.location.href);
                      alert('Link copied to clipboard! Share it with others to help.');
                    }}>
                      Copy Link to Share
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </>
      ) : null}
    </Layout>
  );
};

export default LostFoundDetail;
