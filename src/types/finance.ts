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

// Add Cat interface
export interface Cat {
  id: string;
  name: string;
  status?: string;
}

// Add CatFood interface
export interface CatFood {
  id: string;
  brand: string;
  type: string;
  quantity: number;
  units: string;
  cost_per_unit: number;
  purchase_date: string;
  created_at?: string;
}

// Add CatFeedingRecord interface
export interface CatFeedingRecord {
  id: string;
  cat_id: string;
  cat_food_id: string;
  amount: number;
  feeding_date: string;
  created_at?: string;
  cat_name?: string;
  food_brand?: string;
  food_type?: string;
}

// Add CatFoodAPI interface
export interface CatFoodAPI {
  getCatFood: () => Promise<CatFood[]>;
  addCatFood: (food: Partial<CatFood>) => Promise<CatFood>;
  getCatFeedingRecords: () => Promise<CatFeedingRecord[]>;
  addCatFeedingRecord: (record: Partial<CatFeedingRecord>) => Promise<CatFeedingRecord>;
  getCats: () => Promise<Cat[]>;
}

// Add FundraisingCampaign interface
export interface FundraisingCampaign {
  id: string;
  name: string;
  description: string;
  targetAmount: number;
  amountRaised: number;
  percentComplete: number;
  startDate: string;
  endDate: string;
  campaignType: string;
}
