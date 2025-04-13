import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { AdminLayout } from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

interface Cat {
  id: string;
  name: string;
  age_estimate: string | null;
  breed: string | null;
  description: string | null;
  photos_urls: string[] | null;
  status: string;
  intake_date: string;
}

const AdminCats: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  
  // Fetch cats
  const { data: cats, isLoading, error, refetch } = useQuery({
    queryKey: ['cats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .order('name', { ascending: true });
      
      if (error) throw error;
      return data as Cat[];
    }
  });
  
  // Delete cat
  const handleDeleteCat = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this cat?")) return;
    
    try {
      const { error } = await supabase
        .from('cats')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      toast({
        title: "Cat Deleted",
        description: "The cat has been successfully deleted."
      });
      
      refetch();
    } catch (error: any) {
      toast({
        title: "Error Deleting Cat",
        description: error.message,
        variant: "destructive"
      });
    }
  };
  
  // Filter cats based on search query
  const filteredCats = cats?.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    cat.breed?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Get status badge color
  const getStatusBadgeClass = (status: string) => {
    switch(status) {
      case 'Available':
        return "bg-green-100 text-green-800";
      case 'Pending':
        return "bg-yellow-100 text-yellow-800";
      case 'Adopted':
        return "bg-blue-100 text-blue-800";
      case 'NotListed':
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get human-readable status
  const getDisplayStatus = (status: string) => {
    if (status === 'NotListed') return 'Not Listed';
    return status;
  };

  return (
    <AdminLayout title="Cats">
      <SEO title="Cats | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Cats</h1>
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search cats..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-sm"
            />
            <Button onClick={() => navigate('/admin/cats/new')}>
              <Plus className="mr-2 h-4 w-4" />
              Add Cat
            </Button>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading cats. Please try again later.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of all cats in our shelter.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Age</TableHead>
                  <TableHead>Breed</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCats?.map((cat) => (
                  <TableRow key={cat.id}>
                    <TableCell>{cat.name}</TableCell>
                    <TableCell>{cat.age_estimate || 'Unknown'}</TableCell>
                    <TableCell>{cat.breed || 'Unknown'}</TableCell>
                    <TableCell>
                      <Badge className={getStatusBadgeClass(cat.status)}>
                        {getDisplayStatus(cat.status)}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button variant="ghost" size="icon" onClick={() => navigate(`/admin/cats/edit/${cat.id}`)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleDeleteCat(cat.id)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCats;
