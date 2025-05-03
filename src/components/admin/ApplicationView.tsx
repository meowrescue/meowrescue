import React, { useState } from 'react';
import { Application } from '@/types/applications';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface ApplicationViewProps {
  application: Application;
  onClose: () => void;
}

const ApplicationView: React.FC<ApplicationViewProps> = ({ application, onClose }) => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [feedback, setFeedback] = useState(application.feedback || '');

  const updateApplicationStatus = useMutation({
    mutationFn: async ({ id, status, feedback }: { id: string; status: string; feedback: string }) => {
      console.log(`Updating application ${id} to status: ${status} with feedback: ${feedback}`);
      
      try {
        // Check which table to update based on application type
        if (application.application_type === 'adoption') {
          // Try to update adoption_applications first
          const { data: adoptionData, error: adoptionError } = await getSupabaseClient()
            .from('adoption_applications')
            .update({ 
              status: status.charAt(0).toUpperCase() + status.slice(1), // Capitalize status for adoption_applications
              notes: feedback,
              reviewed_at: new Date().toISOString(),
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();
            
          if (!adoptionError) return adoptionData;
          
          console.log('Could not update adoption_applications, falling back to applications table');
        }
        
        // Fallback to applications table or for other application types
        const { data, error } = await getSupabaseClient()
          .rpc('update_application_status', {
            p_application_id: id,
            p_status: status,
            p_feedback: feedback
          });

        if (error) {
          console.error('Error updating application status with RPC:', error);
          
          // Direct update if RPC fails
          const { data: updateData, error: updateError } = await getSupabaseClient()
            .from('applications')
            .update({ 
              status: status,
              feedback,
              reviewed_at: new Date().toISOString(),
              reviewer_id: (await getSupabaseClient().auth.getUser()).data.user?.id,
              updated_at: new Date().toISOString()
            })
            .eq('id', id)
            .select();
            
          if (updateError) throw updateError;
          return updateData;
        }
        
        return data;
      } catch (error) {
        console.error('Error in application status update:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });
      toast({
        title: "Application Updated",
        description: "The application status has been updated successfully."
      });
      onClose();
    },
    onError: (error: any) => {
      console.error('Error in updateApplicationStatus mutation:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to update application",
        variant: "destructive"
      });
    }
  });

  const handleUpdateStatus = (status: string) => {
    updateApplicationStatus.mutate({ id: application.id, status, feedback });
  };

  const renderFormData = () => {
    // For adoption applications, the form data might be in applicant_details
    const formData = application.form_data;
    
    return Object.entries(formData).map(([key, value]) => {
      // Skip internal fields or empty values
      if (key.startsWith('_') || value === null || value === '') return null;
      
      // Format the key for display
      const formattedKey = key
        .replace(/([A-Z])/g, ' $1') // Add space before capital letters
        .replace(/^./, str => str.toUpperCase()); // Capitalize first letter
      
      return (
        <div key={key} className="mb-4">
          <h4 className="text-sm font-medium text-gray-700">{formattedKey}</h4>
          <p className="mt-1 text-sm text-gray-900">{value as string}</p>
        </div>
      );
    });
  };

  
  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{application.application_type.toUpperCase()} Application</DialogTitle>
          <DialogDescription>
            Submitted on {new Date(application.created_at).toLocaleDateString()} by {application.form_data.firstName || application.profiles?.first_name} {application.form_data.lastName || application.profiles?.last_name}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Applicant Information</h3>
              {renderFormData()}
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-4">Application Review</h3>
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700">Current Status</h4>
                <p className="mt-1 text-sm font-medium">
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    application.status === 'approved' ? 'bg-green-100 text-green-800' :
                    application.status === 'rejected' ? 'bg-red-100 text-red-800' :
                    application.status === 'in-review' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-blue-100 text-blue-800'
                  }`}>
                    {application.status.toUpperCase()}
                  </span>
                </p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-gray-700">Feedback</h4>
                <Textarea
                  className="mt-1"
                  placeholder="Enter feedback or notes about this application"
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  rows={5}
                />
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button 
              variant="destructive" 
              onClick={() => handleUpdateStatus('rejected')}
              disabled={application.status === 'rejected'}
            >
              Reject
            </Button>
            <Button
              variant="outline"
              onClick={() => handleUpdateStatus('in-review')}
              disabled={application.status === 'in-review'}
            >
              Mark as In Review
            </Button>
            <Button 
              variant="default"
              onClick={() => handleUpdateStatus('approved')}
              disabled={application.status === 'approved'}
            >
              Approve
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationView;
