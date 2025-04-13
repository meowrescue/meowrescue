
import React from 'react';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TrendingUp, Users, CatIcon, Calendar, DollarSign, Clock } from 'lucide-react';
import SEO from '@/components/SEO';

const AdminAnalytics: React.FC = () => {
  return (
    <AdminLayout title="Analytics">
      <SEO title="Analytics | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Analytics</h1>
          <div>
            <Button variant="outline" className="mr-2">
              Last 30 Days
            </Button>
            <Button variant="outline">
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
              <div className="text-2xl font-bold">3,246</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +12.5%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs. last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12,849</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +8.3%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs. last month</span>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Avg. Time on Site</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">4m 32s</div>
              <div className="flex items-center mt-1">
                <span className="text-xs text-green-500 flex items-center">
                  <TrendingUp className="h-3 w-3 mr-1" />
                  +23.7%
                </span>
                <span className="text-xs text-gray-500 ml-2">vs. last month</span>
              </div>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow mb-8">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Analytics Dashboard</h2>
            <p className="text-gray-500 mb-8">
              Detailed analytics and reports will be available here.
              <br />Coming soon: Traffic trends, user behavior, adoption metrics, and more.
            </p>
            <Button>
              Generate Detailed Report
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Top Pages</CardTitle>
              <CardDescription>Most visited pages in the last 30 days</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <span className="text-sm">Home Page</span>
                  <span className="text-sm font-medium">2,451 views</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Adoptable Cats</span>
                  <span className="text-sm font-medium">1,826 views</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Adoption Process</span>
                  <span className="text-sm font-medium">943 views</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Contact Us</span>
                  <span className="text-sm font-medium">782 views</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Volunteer</span>
                  <span className="text-sm font-medium">651 views</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Traffic Sources</CardTitle>
              <CardDescription>Where your visitors are coming from</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                <li className="flex justify-between items-center">
                  <span className="text-sm">Direct</span>
                  <span className="text-sm font-medium">38%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Social Media</span>
                  <span className="text-sm font-medium">27%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Search Engines</span>
                  <span className="text-sm font-medium">22%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Referrals</span>
                  <span className="text-sm font-medium">9%</span>
                </li>
                <li className="flex justify-between items-center">
                  <span className="text-sm">Other</span>
                  <span className="text-sm font-medium">4%</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAnalytics;
