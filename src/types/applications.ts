
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
  cat_name: string;
  food_brand: string;
  food_type: string;
}

export interface Cat {
  id: string;
  name: string;
}

export type FinanceTypes = {
  CatFood: CatFood;
  CatFeedingRecord: CatFeedingRecord;
  Cat: Cat;
};
