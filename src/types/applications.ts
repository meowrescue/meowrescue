
export interface Application {
  id: string;
  user_id: string;
  applicant_id?: string;
  application_type: string;
  form_data: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phone?: string;
    address?: string;
    city?: string;
    state?: string;
    zip?: string;
    experience?: string;
    references?: string;
    housing?: string;
    preference?: string;
    availability?: string;
    otherInfo?: string;
    [key: string]: any; // Allow other arbitrary properties
  };
  status: string;
  created_at: string;
  updated_at: string;
  reviewed_at?: string;
  reviewer_id?: string;
  feedback?: string;
  cat_id?: string;
  profiles?: {
    email?: string;
    first_name?: string;
    last_name?: string;
  };
}
