
import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Edit, Trash2, Plus, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@integrations/supabase';
import SEO from '@/components/SEO';
import { useAuth } from '@/contexts/AuthContext';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';

interface Cat {
  id: string;
  name: string;
  age_estimate: string | null;
  breed: string | null;
  description: string | null;
  photos_urls: string[] | null;
  status: string;
  internal_status: string | null;
  intake_date: string;
  gender: string | null;
}

const AdminCats: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [internalStatusFilter, setInternalStatusFilter] = useState('all');
  const [genderFilter, setGenderFilter] = useState('all');
  const { user } = useAuth();
  
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
  
  // Check if user is admin
  const isAdmin = user?.role === 'admin';
  
  // Delete cat
  const handleDeleteCat = async (id: string, event: React.MouseEvent) => {
    event.stopPropagation(); // Prevent row click event
    
    // Only allow admins to delete
    if (!isAdmin) {
      toast({
        title: "Permission Denied",
        description: "Only administrators can delete cats.",
        variant: "destructive"
      });
      return;
    }
    
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
  
  // Reset all filters
  const resetFilters = () => {
    setSearchQuery('');
    setStatusFilter('all');
    setInternalStatusFilter('all');
    setGenderFilter('all');
  };
  
  // Filter cats based on search query and filters
  const filteredCats = cats?.filter(cat => {
    // Search filter
    const matchesSearch = 
      cat.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      cat.breed?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.description?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    // Status filter
    const matchesStatus = 
      statusFilter === 'all' || cat.status === statusFilter;
    
    // Internal status filter
    const matchesInternalStatus = 
      internalStatusFilter === 'all' || cat.internal_status === internalStatusFilter;
    
    // Gender filter
    const matchesGender = 
      genderFilter === 'all' || (cat.gender?.toLowerCase() || '') === genderFilter.toLowerCase();
    
    return matchesSearch && matchesStatus && matchesInternalStatus && matchesGender;
  });

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

  // Get internal status badge color
  const getInternalStatusBadgeClass = (status: string | null) => {
    if (!status) return "bg-gray-100 text-gray-800";
    
    switch(status) {
      case 'Alive':
        return "bg-green-100 text-green-800";
      case 'Deceased':
        return "bg-red-100 text-red-800";
      case 'Missing':
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Get human-readable status
  const getDisplayStatus = (status: string) => {
    if (status === 'NotListed') return 'Not Listed';
    return status;
  };

  // Navigate to cat detail
  const handleRowClick = (id: string) => {
    navigate(`/admin/cats/edit/${id}`);
  };

  return (
    <AdminLayout title="Cats">
      <SEO title="Cats | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10 pt-20 sm:pt-10"> {/* Fixed top padding for mobile view */}
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
        
        {/* Filters */}
        <div className="bg-gray-50 p-4 rounded-lg mb-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-full sm:w-auto">
              <Select 
                value={statusFilter} 
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Adopted">Adopted</SelectItem>
                  <SelectItem value="NotListed">Not Listed</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Select 
                value={internalStatusFilter} 
                onValueChange={setInternalStatusFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Internal Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Internal Statuses</SelectItem>
                  <SelectItem value="Alive">Alive</SelectItem>
                  <SelectItem value="Deceased">Deceased</SelectItem>
                  <SelectItem value="Missing">Missing</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full sm:w-auto">
              <Select 
                value={genderFilter} 
                onValueChange={setGenderFilter}
              >
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Genders</SelectItem>
                  <SelectItem value="male">Male</SelectItem>
                  <SelectItem value="female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <Button 
              variant="outline" 
              size="sm" 
              onClick={resetFilters}
              className="w-full sm:w-auto"
            >
              Clear Filters
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
                  <TableHead>Public Status</TableHead>
                  <TableHead>Internal Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredCats?.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No cats found with the current filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredCats?.map((cat) => (
                    <TableRow 
                      key={cat.id} 
                      onClick={() => handleRowClick(cat.id)}
                      className="cursor-pointer hover:bg-gray-50"
                    >
                      <TableCell>{cat.name}</TableCell>
                      <TableCell>{cat.age_estimate || 'Unknown'}</TableCell>
                      <TableCell>{cat.breed || 'Unknown'}</TableCell>
                      <TableCell>
                        <Badge className={getStatusBadgeClass(cat.status)}>
                          {getDisplayStatus(cat.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {cat.internal_status && (
                          <Badge className={getInternalStatusBadgeClass(cat.internal_status)}>
                            {cat.internal_status}
                          </Badge>
                        )}
                      </TableCell>
                      <TableCell className="text-right">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/cats/edit/${cat.id}`);
                          }}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        {isAdmin && (
                          <Button 
                            variant="ghost" 
                            size="icon" 
                            onClick={(e) => handleDeleteCat(cat.id, e)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminCats;
