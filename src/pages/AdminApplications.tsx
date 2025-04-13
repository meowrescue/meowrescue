
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ArrowLeft, File, Search, UserCheck, UserX } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { Application } from '@/types/applications';

const AdminApplications: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [filterType, setFilterType] = useState<string | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();

  const { data: applications, isLoading, refetch } = useQuery({
    queryKey: ['admin-applications', filterStatus, filterType],
    queryFn: async () => {
      try {
        let query = supabase.from('applications')
          .select(`
            *,
            profiles(
              email,
              first_name,
              last_name
            )
          `);
        
        if (filterStatus) {
          query = query.eq('status', filterStatus);
        }
        
        if (filterType) {
          query = query.eq('application_type', filterType);
        }
        
        const { data, error } = await query.order('created_at', { ascending: false });
        
        if (error) {
          console.error("Error fetching applications:", error);
          throw error;
        }
        
        return data as Application[];
      } catch (error) {
        console.error('Error fetching applications:', error);
        return [] as Application[];
      }
    }
  });

  const handleStatusChange = async (applicationId: string, newStatus: string, feedback: string = '') => {
    try {
      const { error } = await supabase
        .from('applications')
        .update({ 
          status: newStatus,
          feedback: feedback,
          reviewed_at: new Date().toISOString(),
          reviewer_id: (await supabase.auth.getUser()).data.user?.id,
          updated_at: new Date().toISOString()
        })
        .eq('id', applicationId);
      
      if (error) {
        console.error("Error updating application status:", error);
        toast({
          title: "Error",
          description: "Failed to update application status.",
          variant: "destructive",
        });
        throw error;
      }
      
      toast({
        title: "Status Updated",
        description: `Application status changed to ${newStatus}.`,
      });
      
      refetch();
    } catch (error) {
      console.error('Error updating application status:', error);
    }
  };

  const goBack = () => {
    navigate(-1);
  };

  const filteredApplications = applications?.filter(app => {
    const searchMatch = 
      (app.form_data?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (app.form_data?.lastName?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      (app.form_data?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ?? false) ||
      app.application_type.toLowerCase().includes(searchTerm.toLowerCase());
    
    return searchMatch;
  });

  // Function to determine badge color based on status
  const getStatusBadgeVariant = (status: string): "default" | "outline" | "secondary" | "destructive" => {
    switch(status) {
      case 'Submitted': return 'default';
      case 'Under Review': return 'secondary';
      case 'Approved': return 'outline';
      case 'Rejected': return 'destructive';
      default: return 'default';
    }
  };

  return (
    <AdminLayout title="Applications">
      <SEO title="Applications | Meow Rescue Admin" />
      
      <div className="container mx-auto py-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <Button 
              variant="ghost" 
              onClick={goBack} 
              className="mb-2 md:mb-0 flex items-center text-gray-600 hover:text-meow-primary"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <h1 className="text-2xl md:text-3xl font-bold text-meow-primary">Volunteer & Adoption Applications</h1>
          </div>
          
          <div className="w-full md:w-auto mt-4 md:mt-0 flex flex-wrap gap-4">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search applications..."
                className="pl-10 pr-4 py-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <Select 
              value={filterType || ''} 
              onValueChange={(value) => setFilterType(value === '' ? null : value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Types</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
                <SelectItem value="adoption">Adoption</SelectItem>
                <SelectItem value="foster">Foster</SelectItem>
              </SelectContent>
            </Select>
            
            <Select 
              value={filterStatus || ''} 
              onValueChange={(value) => setFilterStatus(value === '' ? null : value)}
            >
              <SelectTrigger className="w-full md:w-[180px]">
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">All Statuses</SelectItem>
                <SelectItem value="Submitted">Submitted</SelectItem>
                <SelectItem value="Under Review">Under Review</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <Tabs defaultValue="all" className="w-full">
          <TabsList className="w-full md:w-auto mb-6 flex flex-wrap overflow-x-auto">
            <TabsTrigger value="all" className="flex-grow md:flex-grow-0">All</TabsTrigger>
            <TabsTrigger value="volunteer" className="flex-grow md:flex-grow-0">Volunteer</TabsTrigger>
            <TabsTrigger value="adoption" className="flex-grow md:flex-grow-0">Adoption</TabsTrigger>
            <TabsTrigger value="foster" className="flex-grow md:flex-grow-0">Foster</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="w-full overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-meow-primary"></div>
                <p className="mt-2 text-gray-500">Loading applications...</p>
              </div>
            ) : filteredApplications?.length === 0 ? (
              <div className="text-center py-10">
                <File className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No applications found</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'There are no applications matching your filters.'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Applicant</TableHead>
                      <TableHead className="whitespace-nowrap">Type</TableHead>
                      <TableHead className="whitespace-nowrap">Submitted</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications?.map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent((application.form_data?.firstName || '') + " " + (application.form_data?.lastName || ''))}&background=random`} />
                              <AvatarFallback>{application.form_data?.firstName?.[0]}{application.form_data?.lastName?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{application.form_data?.firstName} {application.form_data?.lastName}</div>
                              <div className="text-xs text-gray-500">{application.form_data?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="capitalize">
                            {application.application_type}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(application.status)}>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(application.id, 'Approved')}
                              disabled={application.status === 'Approved'}
                              className="inline-flex items-center"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">Approve</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(application.id, 'Rejected')}
                              disabled={application.status === 'Rejected'}
                              className="inline-flex items-center text-destructive hover:text-destructive"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">Reject</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
          
          {/* We'll repeat the same pattern for other tab contents but with filtered lists */}
          <TabsContent value="volunteer" className="w-full overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-meow-primary"></div>
                <p className="mt-2 text-gray-500">Loading volunteer applications...</p>
              </div>
            ) : filteredApplications?.filter(app => app.application_type === 'volunteer').length === 0 ? (
              <div className="text-center py-10">
                <File className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No volunteer applications found</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'There are no volunteer applications matching your filters.'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Applicant</TableHead>
                      <TableHead className="whitespace-nowrap">Submitted</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications?.filter(app => app.application_type === 'volunteer').map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent((application.form_data?.firstName || '') + " " + (application.form_data?.lastName || ''))}&background=random`} />
                              <AvatarFallback>{application.form_data?.firstName?.[0]}{application.form_data?.lastName?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{application.form_data?.firstName} {application.form_data?.lastName}</div>
                              <div className="text-xs text-gray-500">{application.form_data?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(application.status)}>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(application.id, 'Approved')}
                              disabled={application.status === 'Approved'}
                              className="inline-flex items-center"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">Approve</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(application.id, 'Rejected')}
                              disabled={application.status === 'Rejected'}
                              className="inline-flex items-center text-destructive hover:text-destructive"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">Reject</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          {/* Similar implementations for Adoption and Foster tabs */}
          <TabsContent value="adoption" className="w-full overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-meow-primary"></div>
                <p className="mt-2 text-gray-500">Loading adoption applications...</p>
              </div>
            ) : filteredApplications?.filter(app => app.application_type === 'adoption').length === 0 ? (
              <div className="text-center py-10">
                <File className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No adoption applications found</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'There are no adoption applications matching your filters.'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  {/* Similar table structure as the volunteer tab */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Applicant</TableHead>
                      <TableHead className="whitespace-nowrap">Submitted</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications?.filter(app => app.application_type === 'adoption').map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent((application.form_data?.firstName || '') + " " + (application.form_data?.lastName || ''))}&background=random`} />
                              <AvatarFallback>{application.form_data?.firstName?.[0]}{application.form_data?.lastName?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{application.form_data?.firstName} {application.form_data?.lastName}</div>
                              <div className="text-xs text-gray-500">{application.form_data?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(application.status)}>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(application.id, 'Approved')}
                              disabled={application.status === 'Approved'}
                              className="inline-flex items-center"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">Approve</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(application.id, 'Rejected')}
                              disabled={application.status === 'Rejected'}
                              className="inline-flex items-center text-destructive hover:text-destructive"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">Reject</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>

          <TabsContent value="foster" className="w-full overflow-x-auto">
            {isLoading ? (
              <div className="text-center py-10">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-meow-primary"></div>
                <p className="mt-2 text-gray-500">Loading foster applications...</p>
              </div>
            ) : filteredApplications?.filter(app => app.application_type === 'foster').length === 0 ? (
              <div className="text-center py-10">
                <File className="mx-auto h-12 w-12 text-gray-400" />
                <h3 className="mt-2 text-lg font-medium text-gray-900">No foster applications found</h3>
                <p className="mt-1 text-gray-500">
                  {searchTerm ? 'Try adjusting your search terms.' : 'There are no foster applications matching your filters.'}
                </p>
              </div>
            ) : (
              <div className="rounded-md border overflow-hidden">
                <Table>
                  {/* Similar table structure as the other tabs */}
                  <TableHeader>
                    <TableRow>
                      <TableHead className="whitespace-nowrap">Applicant</TableHead>
                      <TableHead className="whitespace-nowrap">Submitted</TableHead>
                      <TableHead className="whitespace-nowrap">Status</TableHead>
                      <TableHead className="text-right whitespace-nowrap">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredApplications?.filter(app => app.application_type === 'foster').map((application) => (
                      <TableRow key={application.id}>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Avatar className="h-8 w-8 mr-2">
                              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent((application.form_data?.firstName || '') + " " + (application.form_data?.lastName || ''))}&background=random`} />
                              <AvatarFallback>{application.form_data?.firstName?.[0]}{application.form_data?.lastName?.[0]}</AvatarFallback>
                            </Avatar>
                            <div>
                              <div className="font-medium">{application.form_data?.firstName} {application.form_data?.lastName}</div>
                              <div className="text-xs text-gray-500">{application.form_data?.email}</div>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {new Date(application.created_at).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusBadgeVariant(application.status)}>
                            {application.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(application.id, 'Approved')}
                              disabled={application.status === 'Approved'}
                              className="inline-flex items-center"
                            >
                              <UserCheck className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">Approve</span>
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm" 
                              onClick={() => handleStatusChange(application.id, 'Rejected')}
                              disabled={application.status === 'Rejected'}
                              className="inline-flex items-center text-destructive hover:text-destructive"
                            >
                              <UserX className="h-4 w-4 mr-1" />
                              <span className="hidden md:inline">Reject</span>
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
};

export default AdminApplications;
