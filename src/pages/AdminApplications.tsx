
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Application } from '@/types/applications';
import { supabase } from '@/integrations/supabase/client';
import { Search } from 'lucide-react';
import SEO from '@/components/SEO';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import ApplicationView from '@/components/admin/ApplicationView';

const AdminApplications = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedApplication, setSelectedApplication] = useState<Application | null>(null);

  // Fetch applications from Supabase
  const { data: applications, isLoading } = useQuery({
    queryKey: ['admin-applications'],
    queryFn: async () => {
      try {
        // Check if applications table exists
        const { data: tableExists, error: tableError } = await supabase
          .from('applications')
          .select('id')
          .limit(1);
          
        if (tableError) {
          console.error("Error checking applications table:", tableError);
          return [] as Application[];
        }
        
        const { data, error } = await supabase
          .from('applications')
          .select(`
            id, applicant_id, application_type, 
            status, form_data, created_at, 
            updated_at, reviewed_at, reviewer_id, feedback
          `)
          .order('created_at', { ascending: false });
          
        if (error) {
          console.error("Error fetching applications:", error);
          return [] as Application[];
        }
        
        // Map the returned data to match the Application interface
        const mappedData = data.map(app => ({
          ...app,
          user_id: app.applicant_id // Map applicant_id to user_id to match the interface
        })) as Application[];
        
        return mappedData;
      } catch (error: any) {
        console.error("Error in applications query:", error);
        return [] as Application[];
      }
    }
  });

  // Filter applications based on search query
  const filteredApplications = applications?.filter(application =>
    application.form_data.firstName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    application.form_data.lastName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    application.form_data.email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    application.application_type?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AdminLayout title="Applications">
      <SEO title="Applications | Meow Rescue Admin" />

      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Applications</h1>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <div className="relative w-full md:w-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search applications..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-full md:w-64"
              />
            </div>
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : filteredApplications && filteredApplications.length > 0 ? (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <Table>
              <TableCaption>All applications submitted.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Submitted</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredApplications.map((application) => (
                  <TableRow key={application.id}>
                    <TableCell className="font-medium">
                      {application.form_data.firstName} {application.form_data.lastName}
                    </TableCell>
                    <TableCell>{application.form_data.email}</TableCell>
                    <TableCell>{application.application_type}</TableCell>
                    <TableCell>
                      <Badge variant="secondary">{application.status}</Badge>
                    </TableCell>
                    <TableCell>{new Date(application.created_at).toLocaleDateString()}</TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => setSelectedApplication(application)}
                      >
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
              <h2 className="text-2xl font-semibold text-gray-700 mb-4">No Applications</h2>
              <p className="text-gray-500 mb-8">
                There are no applications in the database yet.
              </p>
            </div>
          </div>
        )}
      </div>

      {selectedApplication && (
        <ApplicationView 
          application={selectedApplication} 
          onClose={() => setSelectedApplication(null)} 
        />
      )}
    </AdminLayout>
  );
};

export default AdminApplications;
