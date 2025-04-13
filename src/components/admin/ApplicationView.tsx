
import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Application } from '@/types/applications';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, 
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useQueryClient } from '@tanstack/react-query';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose
} from '@/components/ui/dialog';
import { formatApplicationType, capitalizeWords } from '@/utils/stringUtils';

interface ApplicationViewProps {
  application: Application;
  onClose: () => void;
}

const ApplicationView: React.FC<ApplicationViewProps> = ({ application, onClose }) => {
  const [status, setStatus] = useState(application.status);
  const [feedback, setFeedback] = useState(application.feedback || '');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const handleUpdateStatus = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase.rpc('update_application_status', {
        p_application_id: application.id,
        p_status: status,
        p_feedback: feedback,
      });

      if (error) throw error;

      // Update UI and notify user
      toast({
        title: 'Status Updated',
        description: `Application status changed to ${capitalizeWords(status)}`,
      });

      // Refresh the applications list
      queryClient.invalidateQueries({ queryKey: ['admin-applications'] });

      // Close the modal
      onClose();
    } catch (error: any) {
      console.error('Error updating application status:', error);
      toast({
        title: 'Error',
        description: error.message || 'Failed to update application status',
        variant: 'destructive',
      });
    } finally {
      setIsUpdating(false);
    }
  };

  // Render form fields based on the application type and data
  const renderFormData = () => {
    if (!application.form_data) return null;

    const formData = application.form_data;
    
    // Exclude these fields from the rendering
    const excludedFields = ['submit', 'terms', 'privacy'];
    
    return Object.entries(formData)
      .filter(([key]) => !excludedFields.includes(key))
      .map(([key, value]) => {
        const formattedKey = key
          .replace(/([A-Z])/g, ' $1')
          .replace(/^./, str => str.toUpperCase());

        if (value === true) value = 'Yes';
        if (value === false) value = 'No';
        
        return (
          <div key={key} className="mb-4 bg-gray-50 p-4 rounded-lg">
            <h3 className="text-sm font-medium text-gray-700 mb-1">{formattedKey}</h3>
            <p className="text-gray-900">{value}</p>
          </div>
        );
      });
  };

  return (
    <Dialog open={true} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl flex items-center gap-2">
            <span className="text-meow-primary">
              {formatApplicationType(application.application_type)} Application
            </span>
            <span className="ml-auto">
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                status === 'approved' ? 'bg-green-100 text-green-800' :
                status === 'rejected' ? 'bg-red-100 text-red-800' :
                status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-blue-100 text-blue-800'
              }`}>
                {capitalizeWords(status)}
              </span>
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="py-4">
          <div className="space-y-6">
            <div>
              <h2 className="text-lg font-semibold mb-4 text-meow-primary">Applicant Information</h2>
              <div className="grid grid-cols-1 gap-4 mb-6">
                {renderFormData()}
              </div>
            </div>

            <div className="border-t pt-6">
              <h2 className="text-lg font-semibold mb-4 text-meow-primary">Application Status</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <Select 
                    value={status} 
                    onValueChange={setStatus}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="reviewing">Reviewing</SelectItem>
                      <SelectItem value="approved">Approved</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Feedback / Notes
                  </label>
                  <Textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Add feedback or notes for the applicant..."
                    className="resize-none h-24"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="flex justify-between">
          <DialogClose asChild>
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
          </DialogClose>
          <Button 
            onClick={handleUpdateStatus} 
            disabled={isUpdating}
            className="bg-meow-primary hover:bg-meow-primary/90"
          >
            {isUpdating ? 'Updating...' : 'Update Status'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationView;
