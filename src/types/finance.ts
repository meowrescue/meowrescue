
export interface Donation {
  id: string;
  amount: number;
  donation_date: string;
  donor_profile_id: string | null;
  donor_name?: string;
  donor_email?: string;
  is_recurring: boolean;
  status: string;
  notes: string | null;
}

export interface Expense {
  id: string;
  amount: number;
  expense_date: string;
  description: string;
  category: string;
  vendor: string;
  payment_method: string;
  receipt_url?: string | null;
  donation_id?: string | null;
  created_at: string;
  created_by: string;
}
