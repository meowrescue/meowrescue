
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import AdminLayout from '@/pages/Admin';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { FileText, Calendar, User, Mail, Phone, Home, CheckCircle2, XCircle } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import ApplicationView from '@/components/admin/ApplicationView';
import { format, formatDistanceToNow } from 'date-fns';
import SEO from '@/components/SEO';
import { Badge } from '@/components/ui/badge';

interface Application {
  id: string;
  applicant_id: string;
  application_type: 'adoption' | 'foster' | 'volunteer';
  status: 'pending' | 'approved' | 'rejected' | 'in-review';
  form_data: any;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  feedback?: string;
  profiles?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}

const AdminApplications = () => {
  const [selectedTab, setSelectedTab] = useState<string>('all');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);
  
  // Fetch applications
  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('applications')
        .select(`
          *,
          profiles:applicant_id (
            email,
            first_name,
            last_name
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Application[];
    }
  });

  // Filter applications based on selected tab
  const filteredApplications = applications?.filter(app => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'adoption') return app.application_type === 'adoption';
    if (selectedTab === 'foster') return app.application_type === 'foster';
    if (selectedTab === 'volunteer') return app.application_type === 'volunteer';
    if (selectedTab === 'pending') return app.status === 'pending';
    if (selectedTab === 'in-review') return app.status === 'in-review';
    if (selectedTab === 'approved') return app.status === 'approved';
    if (selectedTab === 'rejected') return app.status === 'rejected';
    return true;
  });

  // Calculate counts for each category
  const counts = {
    all: applications?.length || 0,
    adoption: applications?.filter(app => app.application_type === 'adoption').length || 0,
    foster: applications?.filter(app => app.application_type === 'foster').length || 0,
    volunteer: applications?.filter(app => app.application_type === 'volunteer').length || 0,
    pending: applications?.filter(app => app.status === 'pending').length || 0,
    'in-review': applications?.filter(app => app.status === 'in-review').length || 0,
    approved: applications?.filter(app => app.status === 'approved').length || 0,
    rejected: applications?.filter(app => app.status === 'rejected').length || 0,
  };

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'pending':
        return <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">Pending</Badge>;
      case 'in-review':
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">In Review</Badge>;
      case 'approved':
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">Approved</Badge>;
      case 'rejected':
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Applications">
      <SEO title="Applications | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-meow-primary mb-6">Application Management</h1>
        
        <Tabs defaultValue="all" value={selectedTab} onValueChange={setSelectedTab}>
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <TabsList className="mr-auto">
              <TabsTrigger value="all">
                All
                <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full">
                  {counts.all}
                </span>
              </TabsTrigger>
              <TabsTrigger value="adoption">
                Adoption
                <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full">
                  {counts.adoption}
                </span>
              </TabsTrigger>
              <TabsTrigger value="foster">
                Foster
                <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full">
                  {counts.foster}
                </span>
              </TabsTrigger>
              <TabsTrigger value="volunteer">
                Volunteer
                <span className="ml-2 bg-gray-100 text-gray-700 px-2 py-0.5 text-xs rounded-full">
                  {counts.volunteer}
                </span>
              </TabsTrigger>
            </TabsList>
            
            <TabsList>
              <TabsTrigger value="pending">
                Pending
                <span className="ml-2 bg-yellow-100 text-yellow-700 px-2 py-0.5 text-xs rounded-full">
                  {counts.pending}
                </span>
              </TabsTrigger>
              <TabsTrigger value="in-review">
                In Review
                <span className="ml-2 bg-blue-100 text-blue-700 px-2 py-0.5 text-xs rounded-full">
                  {counts['in-review']}
                </span>
              </TabsTrigger>
              <TabsTrigger value="approved">
                Approved
                <span className="ml-2 bg-green-100 text-green-700 px-2 py-0.5 text-xs rounded-full">
                  {counts.approved}
                </span>
              </TabsTrigger>
              <TabsTrigger value="rejected">
                Rejected
                <span className="ml-2 bg-red-100 text-red-700 px-2 py-0.5 text-xs rounded-full">
                  {counts.rejected}
                </span>
              </TabsTrigger>
            </TabsList>
          </div>
          
          <TabsContent value={selectedTab}>
            {isLoading ? (
              <div className="flex justify-center py-10">
                <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : filteredApplications && filteredApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredApplications.map((application) => (
                  <Card key={application.id} className={`
                    ${application.status === 'approved' ? 'border-green-300 bg-green-50' : ''}
                    ${application.status === 'rejected' ? 'border-red-300 bg-red-50' : ''}
                  `}>
                    <CardHeader className="pb-2">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center mb-1">
                            {application.status === 'approved' && (
                              <CheckCircle2 className="h-4 w-4 text-green-600 mr-1" />
                            )}
                            {application.status === 'rejected' && (
                              <XCircle className="h-4 w-4 text-red-600 mr-1" />
                            )}
                            <CardTitle className="text-lg capitalize">
                              {application.application_type} Application
                            </CardTitle>
                          </div>
                          <CardDescription>
                            Submitted {formatDistanceToNow(new Date(application.created_at), { addSuffix: true })}
                          </CardDescription>
                        </div>
                        {getStatusBadge(application.status)}
                      </div>
                    </CardHeader>
                    <CardContent className="pb-2">
                      <div className="space-y-2">
                        <div className="flex items-center text-sm">
                          <User className="h-4 w-4 mr-2 text-gray-500" />
                          <span>
                            {application.profiles?.first_name} {application.profiles?.last_name}
                          </span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Mail className="h-4 w-4 mr-2 text-gray-500" />
                          <span>{application.profiles?.email}</span>
                        </div>
                        {application.form_data?.phone && (
                          <div className="flex items-center text-sm">
                            <Phone className="h-4 w-4 mr-2 text-gray-500" />
                            <span>{application.form_data.phone}</span>
                          </div>
                        )}
                        {application.reviewed_at && (
                          <div className="flex items-center text-sm">
                            <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                            <span>Reviewed on {format(new Date(application.reviewed_at), 'MMM d, yyyy')}</span>
                          </div>
                        )}
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button 
                        variant="outline" 
                        className="w-full mt-2"
                        onClick={() => setSelectedApplication(application)}
                      >
                        <FileText className="h-4 w-4 mr-2" />
                        View Application
                      </Button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="py-10 text-center">
                  <FileText className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                  <p className="text-gray-500">No applications found in this category.</p>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
      
      {selectedApplication && (
        <Dialog open={!!selectedApplication} onOpenChange={(open) => !open && setSelectedApplication(null)}>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-xl">
                {selectedApplication.application_type.charAt(0).toUpperCase() + selectedApplication.application_type.slice(1)} Application
              </DialogTitle>
            </DialogHeader>
            <ApplicationView 
              application={selectedApplication} 
              onClose={() => setSelectedApplication(null)} 
            />
          </DialogContent>
        </Dialog>
      )}
    </AdminLayout>
  );
};

export default AdminApplications;
