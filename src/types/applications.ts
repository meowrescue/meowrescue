
export interface Application {
  id: string;
  applicant_id: string;
  application_type: 'adoption' | 'foster' | 'volunteer' | 'volunteer+foster';
  status: 'pending' | 'approved' | 'denied';
  form_data: any;
  created_at: string;
  updated_at: string;
  reviewed_at: string | null;
  reviewer_id: string | null;
  feedback: string | null;
  profiles?: {
    email: string;
    first_name: string | null;
    last_name: string | null;
  };
}
