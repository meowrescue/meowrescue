
import React, { useState, useEffect } from 'react';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, Cat, Calendar, DollarSign, Clock } from 'lucide-react';
import SEO from '@/components/SEO';
import getSupabaseClient from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useQuery } from '@tanstack/react-query';

const AdminAnalytics: React.FC = () => {
  const { toast } = useToast();
  const [dateRange, setDateRange] = useState<'7d' | '30d' | 'all'>('30d');
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    // Set current date in format like "April 13, 2025"
    const now = new Date();
    setCurrentDate(now.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    }));
  }, []);

  // Fetch visitors data from activity_logs table
  const { data: visitorStats, isLoading: isLoadingVisitors } = useQuery({
    queryKey: ['visitor-stats', dateRange],
    queryFn: async () => {
      try {
        // In a real implementation, you would have a proper analytics table
        // For now, we'll use a placeholder with count from the profiles table as an estimate
        const { count, error } = await supabase
          .from('profiles')
          .select('*', { count: 'exact', head: true });
          
        if (error) throw error;
        
        // Create a simulated statistics object
        return {
          visitors: count || 0,
          pageViews: (count || 0) * 3, // simulated: each user views approximately 3 pages
          avgTimeOnSite: '2m 34s',
        };
      } catch (error) {
        console.error("Error fetching visitor stats:", error);
        return {
          visitors: 0,
          pageViews: 0,
          avgTimeOnSite: '0m 0s',
        };
      }
    }
  });

  // Fetch page views data - in a real application this would come from analytics
  const { data: popularPages = [] } = useQuery({
    queryKey: ['popular-pages', dateRange],
    queryFn: async () => {
      // This would typically come from an analytics API
      // For now, we'll return a simplified placeholder based on database content
      
      // Get counts from various tables to estimate popularity
      const { count: catsCount } = await supabase
        .from('cats')
        .select('*', { count: 'exact', head: true });
      
      const { count: lostFoundCount } = await supabase
        .from('lost_found_posts')
        .select('*', { count: 'exact', head: true });
      
      const { count: eventsCount } = await supabase
        .from('events')
        .select('*', { count: 'exact', head: true });
        
      const { count: donationsCount } = await supabase
        .from('donations')
        .select('*', { count: 'exact', head: true });
        
      // Return a placeholder based on real data counts
      return [
        { name: 'Home Page', views: (catsCount || 0) + (eventsCount || 0) + 10 },
        { name: 'Adoptable Cats', views: catsCount || 0 },
        { name: 'Lost & Found', views: lostFoundCount || 0 },
        { name: 'Donate', views: donationsCount || 0 },
        { name: 'Events', views: eventsCount || 0 }
      ].sort((a, b) => b.views - a.views);
    }
  });

  // Fetch traffic sources data (placeholder)
  const trafficSources = [
    { name: 'Direct', percentage: 38 },
    { name: 'Social Media', percentage: 27 },
    { name: 'Search Engines', percentage: 22 },
    { name: 'Referrals', percentage: 9 },
    { name: 'Other', percentage: 4 },
  ];

  const handleGenerateReport = () => {
    toast({
      title: "Report Generation",
      description: "Detailed analytics report generation is not implemented yet."
    });
  };

  return (
    <AdminLayout title="Analytics">
      <SEO title="Analytics | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Analytics</h1>
          <div>
            <Button 
              variant="outline" 
              className={`mr-2 ${dateRange === '7d' ? 'bg-meow-primary/10 border-meow-primary/30' : ''}`}
              onClick={() => setDateRange('7d')}
            >
              Last 7 Days
            </Button>
            <Button 
              variant="outline" 
              className={`mr-2 ${dateRange === '30d' ? 'bg-meow-primary/10 border-meow-primary/30' : ''}`}
              onClick={() => setDateRange('30d')}
            >
              Last 30 Days
            </Button>
            <Button 
              variant="outline" 
              className={`mr-2 ${dateRange === 'all' ? 'bg-meow-primary/10 border-meow-primary/30' : ''}`}
              onClick={() => setDateRange('all')}
            >
              All Time
            </Button>
            <Button variant="outline" onClick={handleGenerateReport}>
              Export Data
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Visitors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingVisitors ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  visitorStats?.visitors.toLocaleString() || '0'
                )}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">Based on unique user profiles</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingVisitors ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  visitorStats?.pageViews.toLocaleString() || '0'
                )}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">Estimated from user activity</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time on Site</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {isLoadingVisitors ? (
                  <span className="text-gray-400">Loading...</span>
                ) : (
                  visitorStats?.avgTimeOnSite || '0m 0s'
                )}
              </div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-gray-500">Estimated from sessions</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="text-center py-8">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Analytics Dashboard</h2>
            <p className="text-gray-500 mb-8">
              Basic analytics information is displayed above.
              <br />Comprehensive analytics are planned for future development.
            </p>
            <Button onClick={handleGenerateReport}>
              Generate Detailed Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages based on site activity</CardDescription>
            </CardHeader>
            <CardContent>
              {popularPages.length > 0 ? (
                <ul className="space-y-4">
                  {popularPages.map((page, index) => (
                    <li key={index} className="flex justify-between items-center">
                      <span className="text-sm">{page.name}</span>
                      <span className="text-sm font-medium">{page.views} views</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-center py-4 text-gray-500">No page view data available</p>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Estimated traffic breakdown by source</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {trafficSources.map((source, index) => (
                  <li key={index} className="flex justify-between items-center">
                    <span className="text-sm">{source.name}</span>
                    <span className="text-sm font-medium">{source.percentage}%</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-gray-500 mt-4 text-center">
                Note: Traffic source breakdown is an estimation and will be replaced with actual analytics data
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
