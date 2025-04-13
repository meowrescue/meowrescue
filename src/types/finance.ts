
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
  income_type: string;
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
  description: string;
  payment_method: string;
  donation_id?: string;
  created_by?: string;
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

// Adding the missing interfaces for CatFood related functionality
export interface Cat {
  id: string;
  name: string;
}

export interface CatFood {
  id: string;
  brand: string;
  type: string;
  quantity: number;
  units: string;
  cost_per_unit: number;
  purchase_date: string;
  created_at: string;
}

export interface CatFeedingRecord {
  id: string;
  cat_id: string;
  cat_food_id: string;
  amount: number;
  feeding_date: string;
  created_at: string;
  cat_name?: string;
  food_brand?: string;
  food_type?: string;
}

export interface Cat {
  id: string;
  name: string;
}

export interface CatFoodAPI {
  getCatFood: () => Promise<CatFood[]>;
  addCatFood: (food: Partial<CatFood>) => Promise<CatFood>;
  getCatFeedingRecords: () => Promise<CatFeedingRecord[]>;
  addCatFeedingRecord: (record: Partial<CatFeedingRecord>) => Promise<CatFeedingRecord>;
  getCats: () => Promise<Cat[]>;
}
