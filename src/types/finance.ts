
export interface Donation {
  id: string;
  amount: number | string;
  donation_date: string;
  donor_name?: string;
  donor_email?: string;
  is_recurring: boolean;
  status: string;
  notes?: string;
  donor_profile_id?: string;
  income_type: string; // Field for donation/grant/personal funds
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
  donation_id?: string;
  created_at: string;
  created_by?: string;
}

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

export interface Cat {
  id: string;
  name: string;
}

// Fix the CatFoodAPI interface to match the implementation
export interface CatFoodAPI {
  getCatFood: () => Promise<CatFood[]>;
  addCatFood: (food: Omit<CatFood, 'id' | 'created_at'>) => Promise<CatFood>;
  getCatFeedingRecords: () => Promise<CatFeedingRecord[]>;
  addCatFeedingRecord: (record: Omit<CatFeedingRecord, 'id' | 'created_at' | 'cat_name' | 'food_brand' | 'food_type'>) => Promise<CatFeedingRecord>;
  getCats: () => Promise<Cat[]>;
}
