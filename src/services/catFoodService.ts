
import { supabase } from '@/integrations/supabase/client';
import { CatFoodAPI, CatFood, CatFeedingRecord, Cat } from '@/types/finance';

export async function getCatFood(): Promise<CatFood[]> {
  try {
    // Using type assertion to bypass TypeScript's strict checking
    const { data, error } = await supabase
      .rpc('get_cat_food' as any) as { data: CatFood[] | null, error: Error | null };
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching cat food:', error);
    throw error;
  }
}

export async function addCatFood(
  brand: string,
  type: string,
  quantity: number,
  units: string,
  costPerUnit: number,
  purchaseDate: Date
): Promise<CatFood> {
  try {
    // Using type assertion to bypass TypeScript's strict checking
    const { data, error } = await supabase
      .rpc('add_cat_food' as any, {
        p_brand: brand,
        p_type: type,
        p_quantity: quantity,
        p_units: units,
        p_cost_per_unit: costPerUnit,
        p_purchase_date: purchaseDate.toISOString()
      }) as { data: CatFood | null, error: Error | null };
      
    if (error) {
      throw error;
    }
    
    return data as CatFood;
  } catch (error) {
    console.error('Error adding cat food:', error);
    throw error;
  }
}

export async function getCatFeedingRecords(): Promise<CatFeedingRecord[]> {
  try {
    // Using type assertion to bypass TypeScript's strict checking
    const { data, error } = await supabase
      .rpc('get_cat_feeding_records' as any) as { data: CatFeedingRecord[] | null, error: Error | null };
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching cat feeding records:', error);
    throw error;
  }
}

export async function addCatFeedingRecord(
  catId: string,
  catFoodId: string,
  amount: number,
  feedingDate: Date
): Promise<CatFeedingRecord> {
  try {
    // Using type assertion to bypass TypeScript's strict checking
    const { data, error } = await supabase
      .rpc('add_cat_feeding_record' as any, {
        p_cat_id: catId,
        p_cat_food_id: catFoodId,
        p_amount: amount,
        p_feeding_date: feedingDate.toISOString()
      }) as { data: CatFeedingRecord | null, error: Error | null };
      
    if (error) {
      throw error;
    }
    
    return data as CatFeedingRecord;
  } catch (error) {
    console.error('Error adding cat feeding record:', error);
    throw error;
  }
}

// Mock function to get cats - replace with actual implementation when available
export async function getCats(): Promise<Cat[]> {
  try {
    const { data, error } = await supabase
      .from('cats')
      .select('id, name');
      
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching cats:', error);
    throw error;
  }
}

// Create and export the catFoodApi object for use in components
export const catFoodApi: CatFoodAPI = {
  getCatFood,
  addCatFood: (food) => addCatFood(
    food.brand,
    food.type,
    food.quantity,
    food.units,
    food.cost_per_unit,
    new Date(food.purchase_date)
  ),
  getCatFeedingRecords,
  addCatFeedingRecord: (record) => addCatFeedingRecord(
    record.cat_id,
    record.cat_food_id,
    record.amount,
    new Date(record.feeding_date)
  ),
  getCats
};
