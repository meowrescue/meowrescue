import { supabase } from '@/integrations/supabase/client';

export interface CatFood {
  id: string;
  brand: string;
  type: string;
  quantity: number;
  units: string;
  cost_per_unit: number;
  purchase_date: string;
}

export interface CatFeedingRecord {
  id: string;
  cat_id: string;
  cat_food_id: string;
  amount: number;
  feeding_date: string;
}

export async function getCatFood() {
  try {
    // Type assertion for RPC function
    const { data, error } = await supabase
      .rpc('get_cat_food') as unknown as {data: CatFood[] | null, error: Error | null};
      
    if (error) {
      throw error;
    }
    
    return data;
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
) {
  try {
    // Type assertion for RPC function
    const { data, error } = await supabase
      .rpc('add_cat_food', {
        p_brand: brand,
        p_type: type,
        p_quantity: quantity,
        p_units: units,
        p_cost_per_unit: costPerUnit,
        p_purchase_date: purchaseDate.toISOString()
      }) as unknown as {data: CatFood | null, error: Error | null};
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error adding cat food:', error);
    throw error;
  }
}

export async function getCatFeedingRecords() {
  try {
    // Type assertion for RPC function
    const { data, error } = await supabase
      .rpc('get_cat_feeding_records') as unknown as {data: CatFeedingRecord[] | null, error: Error | null};
      
    if (error) {
      throw error;
    }
    
    return data;
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
) {
  try {
    // Type assertion for RPC function
    const { data, error } = await supabase
      .rpc('add_cat_feeding_record', {
        p_cat_id: catId,
        p_cat_food_id: catFoodId,
        p_amount: amount,
        p_feeding_date: feedingDate.toISOString()
      }) as unknown as {data: CatFeedingRecord | null, error: Error | null};
      
    if (error) {
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error adding cat feeding record:', error);
    throw error;
  }
}
