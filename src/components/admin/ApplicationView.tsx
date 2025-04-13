
import React, { useState } from 'react';
import { Application } from '@/types/applications';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

interface ApplicationViewProps {
  application: Application;
  onClose: () => void;
}

const ApplicationView: React.FC<ApplicationViewProps> = ({
  application,
  onClose,
}) => {
  const { toast } = useToast();
  const [feedback, setFeedback] = useState(application.feedback || '');
  const [status, setStatus] = useState(application.status);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setStatus(newStatus);
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('applications')
        .update({
          status,
          feedback,
          reviewed_at: new Date().toISOString(),
          reviewer_id: (await supabase.auth.getUser()).data.user?.id,
        })
        .eq('id', application.id);

      if (error) throw error;

      toast({
        title: 'Application Updated',
        description: 'The application has been successfully updated.',
      });
      onClose();
    } catch (error) {
      console.error('Error updating application:', error);
      toast({
        title: 'Update Failed',
        description: 'Failed to update the application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Helper to render form data sections
  const renderFormSection = (title: string, data: Record<string, any>) => {
    return (
      <Card className="mb-4">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">{title}</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <dl className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            {Object.entries(data).map(([key, value]) => {
              // Skip internal fields or empty values
              if (key.startsWith('_') || !value) return null;
              
              // Format the key for display
              const formattedKey = key
                .replace(/([A-Z])/g, ' $1')
                .replace(/^./, (str) => str.toUpperCase());
              
              return (
                <div key={key} className="py-1">
                  <dt className="text-sm font-medium text-gray-500">{formattedKey}</dt>
                  <dd className="text-sm text-gray-900">{value}</dd>
                </div>
              );
            })}
          </dl>
        </CardContent>
      </Card>
    );
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {application.application_type} Application
          </DialogTitle>
          <DialogDescription>
            Submitted on {formatDate(application.created_at)}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 my-4">
          {/* Applicant Information */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Applicant Information</CardTitle>
              <CardDescription>
                Contact information for the applicant
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="text-gray-900">
                    {application.form_data.firstName} {application.form_data.lastName}
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <p className="text-gray-900">{application.form_data.email}</p>
                </div>
                {application.form_data.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <p className="text-gray-900">{application.form_data.phone}</p>
                  </div>
                )}
                {application.form_data.address && (
                  <div className="col-span-1 md:col-span-2">
                    <p className="text-sm font-medium text-gray-500">Address</p>
                    <p className="text-gray-900">
                      {application.form_data.address}
                      {application.form_data.city && `, ${application.form_data.city}`}
                      {application.form_data.state && `, ${application.form_data.state}`}
                      {application.form_data.zip && ` ${application.form_data.zip}`}
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Application Details */}
          {application.form_data && renderFormSection('Application Details', application.form_data)}

          {/* Admin Feedback */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Admin Feedback</CardTitle>
              <CardDescription>
                Add notes and change application status
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Status
                  </label>
                  <select
                    id="status"
                    value={status}
                    onChange={(e) => handleStatusChange(e.target.value)}
                    className="w-full rounded-md border border-gray-300 p-2"
                  >
                    <option value="Submitted">Submitted</option>
                    <option value="Under Review">Under Review</option>
                    <option value="Approved">Approved</option>
                    <option value="Rejected">Rejected</option>
                    <option value="On Hold">On Hold</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <label
                    htmlFor="feedback"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Feedback/Notes
                  </label>
                  <Textarea
                    id="feedback"
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={4}
                    placeholder="Add any feedback or notes about this application..."
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Saving...' : 'Save Changes'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationView;
