
export interface Donation {
  id: string;
  donor_profile_id: string;
  amount: number;
  donation_date: string;
  created_at: string;
  is_recurring: boolean;
  notes: string;
  payment_gateway_id: string;
  status: string;
  income_type: string; // Add this property
  donor_name?: string;
  donor_email?: string;
}

export interface Expense {
  id: string;
  amount: number;
  expense_date: string;
  created_at: string;
  category: string;
  vendor: string;
  notes: string;
  receipt_url?: string;
  status: string;
  expense_type: string;
}

export interface Budget {
  id: string;
  category: string;
  amount: number;
  period: 'monthly' | 'quarterly' | 'annual';
  created_at: string;
  updated_at: string;
  notes?: string;
}

export interface FinancialSummary {
  total_income: number;
  total_expenses: number;
  net_income: number;
  donations_count: number;
  recurring_donations: number;
  expenses_count: number;
}
