import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Search, Filter, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Application } from '@/types/applications';

const AdminApplications: React.FC = () => {
  const { toast } = useToast();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string | null>(null);
  const [viewingApplication, setViewingApplication] = useState<Application | null>(null);
  const [feedback, setFeedback] = useState('');
  const [newStatus, setNewStatus] = useState<'pending' | 'approved' | 'denied'>('pending');

  // Fetch applications using RPC
  const { data: applications, isLoading, error, refetch } = useQuery({
    queryKey: ['applications', statusFilter, typeFilter],
    queryFn: async () => {
      try {
        // Use a custom RPC function to get applications
        const { data, error } = await supabase
          .rpc('get_applications', {
            p_status: statusFilter,
            p_type: typeFilter
          });
        
        if (error) throw error;
        
        return data as Application[];
      } catch (err) {
        console.error('Error fetching applications:', err);
        throw err;
      }
    }
  });

  // Filter applications based on search query
  const filteredApplications = applications?.filter(app =>
    app.profiles?.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.profiles?.first_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    app.profiles?.last_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUpdateApplicationStatus = async () => {
    if (!viewingApplication) return;
    
    try {
      // Use RPC function to update application
      const { error } = await supabase
        .rpc('update_application_status', {
          p_application_id: viewingApplication.id,
          p_status: newStatus,
          p_feedback: feedback
        });
        
      if (error) throw error;
      
      toast({
        title: 'Application Updated',
        description: `Application has been ${newStatus}.`,
      });
      
      setViewingApplication(null);
      refetch();
    } catch (err: any) {
      toast({
        title: 'Error',
        description: err.message || 'Failed to update application status.',
        variant: 'destructive'
      });
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'approved': return 'default';
      case 'denied': return 'destructive';
      default: return 'secondary';
    }
  };

  const getApplicationTypeBadge = (type: string) => {
    switch (type) {
      case 'adoption': return { label: 'Adoption', color: 'bg-blue-100 text-blue-800' };
      case 'foster': return { label: 'Foster', color: 'bg-green-100 text-green-800' };
      case 'volunteer': return { label: 'Volunteer', color: 'bg-purple-100 text-purple-800' };
      default: return { label: type, color: 'bg-gray-100 text-gray-800' };
    }
  };

  const handleViewApplication = (application: Application) => {
    setViewingApplication(application);
    setFeedback(application.feedback || '');
    setNewStatus(application.status);
  };

  return (
    <AdminLayout title="Applications">
      <SEO title="Applications | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Applications</h1>
          
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applicants..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
            
            <Select
              value={statusFilter || 'all'}
              onValueChange={(value) => setStatusFilter(value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All statuses</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="denied">Denied</SelectItem>
              </SelectContent>
            </Select>
            
            <Select
              value={typeFilter || 'all'}
              onValueChange={(value) => setTypeFilter(value === 'all' ? null : value)}
            >
              <SelectTrigger className="w-40">
                <SelectValue placeholder="All types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All types</SelectItem>
                <SelectItem value="adoption">Adoption</SelectItem>
                <SelectItem value="foster">Foster</SelectItem>
                <SelectItem value="volunteer">Volunteer</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error loading applications. Please try again later.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={() => refetch()}
            >
              Try Again
            </Button>
          </div>
        ) : filteredApplications && filteredApplications.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>List of all applications.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Applicant</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((app) => (
                  <TableRow key={app.id}>
                    <TableCell>
                      <div className="font-medium">
                        {app.profiles ? 
                          `${app.profiles.first_name || ''} ${app.profiles.last_name || ''}`.trim() || 
                          app.profiles.email : 
                          'Unknown User'}
                      </div>
                      <div className="text-sm text-gray-500">{app.profiles?.email}</div>
                    </TableCell>
                    <TableCell>
                      <Badge className={getApplicationTypeBadge(app.application_type).color}>
                        {getApplicationTypeBadge(app.application_type).label}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(app.status)}>
                        {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                      </Badge>
                    </TableCell>
                    <TableCell>{new Date(app.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm"
                        onClick={() => handleViewApplication(app)}
                      >
                        <Eye className="h-4 w-4 mr-2" />
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-center py-12">
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Applications Found</h2>
              <p className="text-gray-500 mb-8">
                There are no applications in the system yet. Applications will appear here when submitted.
              </p>
            </div>
          </div>
        )}
      </div>
      
      {/* Application View Dialog */}
      {viewingApplication && (
        <Dialog open={!!viewingApplication} onOpenChange={(open) => !open && setViewingApplication(null)}>
          <DialogContent className="sm:max-w-[700px]">
            <DialogHeader>
              <DialogTitle>Application Details</DialogTitle>
              <DialogDescription>
                Review the application details and update its status.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-6 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold mb-2">Applicant Information</h3>
                  <p><span className="text-gray-500">Name:</span> {viewingApplication.profiles ? 
                    `${viewingApplication.profiles.first_name || ''} ${viewingApplication.profiles.last_name || ''}`.trim() || 
                    viewingApplication.profiles.email : 
                    'Unknown User'}</p>
                  <p><span className="text-gray-500">Email:</span> {viewingApplication.profiles?.email}</p>
                  <p><span className="text-gray-500">Submitted:</span> {new Date(viewingApplication.created_at).toLocaleString()}</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Application Status</h3>
                  <div className="flex items-center mb-2">
                    <span className="text-gray-500 mr-2">Current Status:</span>
                    <Badge variant={getStatusBadgeVariant(viewingApplication.status)}>
                      {viewingApplication.status.charAt(0).toUpperCase() + viewingApplication.status.slice(1)}
                    </Badge>
                  </div>
                  <p><span className="text-gray-500">Type:</span> {getApplicationTypeBadge(viewingApplication.application_type).label}</p>
                  {viewingApplication.reviewed_at && (
                    <p><span className="text-gray-500">Last Reviewed:</span> {new Date(viewingApplication.reviewed_at).toLocaleString()}</p>
                  )}
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Form Submission</h3>
                <div className="border rounded-md p-4 bg-gray-50 max-h-60 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-sm">
                    {JSON.stringify(viewingApplication.form_data, null, 2)}
                  </pre>
                </div>
              </div>
              
              <div>
                <h3 className="font-semibold mb-2">Update Status</h3>
                <div className="flex gap-4 mb-4">
                  <Button 
                    variant={newStatus === 'approved' ? 'default' : 'outline'} 
                    className={newStatus === 'approved' ? 'bg-green-600 hover:bg-green-700' : ''}
                    onClick={() => setNewStatus('approved')}
                  >
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Approve
                  </Button>
                  <Button 
                    variant={newStatus === 'denied' ? 'default' : 'outline'} 
                    className={newStatus === 'denied' ? 'bg-red-600 hover:bg-red-700' : ''}
                    onClick={() => setNewStatus('denied')}
                  >
                    <XCircle className="h-4 w-4 mr-2" />
                    Deny
                  </Button>
                  <Button 
                    variant={newStatus === 'pending' ? 'default' : 'outline'} 
                    onClick={() => setNewStatus('pending')}
                  >
                    Keep Pending
                  </Button>
                </div>
                
                <Textarea 
                  placeholder="Add feedback or notes for this application"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full min-h-[100px]"
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button variant="outline" onClick={() => setViewingApplication(null)}>
                Cancel
              </Button>
              <Button onClick={handleUpdateApplicationStatus}>
                Update Status
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminApplications;
