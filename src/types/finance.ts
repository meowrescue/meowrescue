
// Add the missing interfaces or extend existing ones with the necessary properties

export interface Donation {
  id: string;
  amount: number | string;
  donation_date: string;
  donor_name?: string;
  donor_email?: string;
  donor_profile_id?: string;
  is_recurring: boolean;
  status: string;
  notes?: string;
  payment_gateway_id?: string;
  created_at: string;
  income_type?: string;
}

export interface Expense {
  id: string;
  amount: number | string;
  expense_date: string;
  description: string;
  category: string;
  vendor: string;
  payment_method: string;
  receipt_url?: string;
  donation_id?: string | null;
  created_at: string;
  created_by?: string;
}
