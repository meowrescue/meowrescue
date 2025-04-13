
export interface Application {
  id: string;
  applicant_id: string;
  application_type: 'adoption' | 'foster' | 'volunteer' | 'volunteer+foster';
  status: 'pending' | 'approved' | 'denied';
  form_data: Record<string, any>;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  feedback?: string;
  profiles?: {
    email: string;
    first_name?: string;
    last_name?: string;
  };
}
