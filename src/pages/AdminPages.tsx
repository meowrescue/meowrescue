
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Edit, FileText, Plus } from 'lucide-react';
import getSupabaseClient from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

interface ContentBlock {
  id: string;
  page: string;
  block_identifier: string;
  content: string;
  created_at: string;
  updated_at: string;
}

const pageGroups = [
  {
    title: 'Main Pages',
    pages: [
      { name: 'Home', route: '/' },
      { name: 'About', route: '/about' },
      { name: 'Adoption', route: '/cats' },
      { name: 'Contact', route: '/contact' },
    ]
  },
  {
    title: 'Informational Pages',
    pages: [
      { name: 'Resources', route: '/resources' },
      { name: 'Volunteer', route: '/volunteer' },
      { name: 'Privacy Policy', route: '/privacy-policy' },
      { name: 'Terms of Service', route: '/terms-of-service' },
    ]
  }
];

const AdminPages: React.FC = () => {
  // Fetch content blocks
  const { data: contentBlocks, isLoading, error } = useQuery({
    queryKey: ['content-blocks'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('content_blocks')
        .select('*')
        .order('page', { ascending: true });
      
      if (error) throw error;
      return data as ContentBlock[];
    }
  });

  // Group content blocks by page
  const contentBlocksByPage = contentBlocks?.reduce((acc, block) => {
    if (!acc[block.page]) {
      acc[block.page] = [];
    }
    acc[block.page].push(block);
    return acc;
  }, {} as Record<string, ContentBlock[]>) || {};

  return (
    <AdminLayout title="Pages">
      <SEO title="Pages | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Pages</h1>
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Content Block
          </Button>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading pages. Please try again later.</p>
          </div>
        ) : (
          <div className="space-y-10">
            {pageGroups.map((group, index) => (
              <div key={index} className="space-y-6">
                <h2 className="text-xl font-semibold">{group.title}</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {group.pages.map((page) => (
                    <Card key={page.route} className="overflow-hidden">
                      <CardHeader className="bg-gray-50 pb-4">
                        <CardTitle className="flex items-center">
                          <FileText className="h-5 w-5 mr-2 text-meow-primary" />
                          {page.name}
                        </CardTitle>
                        <CardDescription>
                          {page.route}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-4">
                        <p className="text-sm text-gray-500">
                          {contentBlocksByPage[page.name]?.length || 0} content blocks
                        </p>
                        <div className="mt-2">
                          {contentBlocksByPage[page.name]?.slice(0, 3).map((block) => (
                            <div key={block.id} className="text-xs text-gray-600 my-1 truncate">
                              • {block.block_identifier}
                            </div>
                          ))}
                          {(contentBlocksByPage[page.name]?.length || 0) > 3 && (
                            <div className="text-xs text-gray-600 my-1">
                              • {contentBlocksByPage[page.name].length - 3} more...
                            </div>
                          )}
                          {!contentBlocksByPage[page.name]?.length && (
                            <div className="text-xs text-gray-400 italic my-1">
                              No content blocks
                            </div>
                          )}
                        </div>
                      </CardContent>
                      <CardFooter className="bg-gray-50 border-t">
                        <Button variant="ghost" size="sm" className="w-full">
                          <Edit className="h-4 w-4 mr-2" />
                          Manage Content
                        </Button>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminPages;
