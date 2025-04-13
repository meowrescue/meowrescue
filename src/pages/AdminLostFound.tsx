
import React from 'react';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { PlusCircle } from 'lucide-react';
import SEO from '@/components/SEO';

const AdminLostFound: React.FC = () => {
  return (
    <AdminLayout title="Lost & Found">
      <SEO title="Lost & Found | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Lost & Found</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Post
          </Button>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-center py-12">
            <h2 className="text-2xl font-semibold text-gray-700 mb-4">Lost & Found Management</h2>
            <p className="text-gray-500 mb-8">
              This area allows you to manage all lost and found pet listings.
              <br />Coming soon: Review, moderate, and update lost and found posts.
            </p>
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              Create New Post
            </Button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminLostFound;
