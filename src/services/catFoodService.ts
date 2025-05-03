import { supabase } from '@integrations/supabase';
import { CatFoodAPI, CatFood, CatFeedingRecord, Cat } from '@/types/finance';

export async function getCatFood(): Promise<CatFood[]> {
  try {
    
    const { data, error } = await supabase
      .rpc('get_cat_food');
      
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
    
    const { data, error } = await supabase
      .rpc('add_cat_food', {
        p_brand: brand,
        p_type: type,
        p_quantity: quantity,
        p_units: units,
        p_cost_per_unit: costPerUnit,
        p_purchase_date: purchaseDate.toISOString()
      });
      
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
    
    const { data, error } = await supabase
      .rpc('get_cat_feeding_records');
      
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
    
    const { data, error } = await supabase
      .rpc('add_cat_feeding_record', {
        p_cat_id: catId,
        p_cat_food_id: catFoodId,
        p_amount: amount,
        p_feeding_date: feedingDate.toISOString()
      });
      
    if (error) {
      throw error;
    }
    
    return data as CatFeedingRecord;
  } catch (error) {
    console.error('Error adding cat feeding record:', error);
    throw error;
  }
}

export async function getCats(): Promise<Cat[]> {
  try {
    
    const { data, error } = await supabase
      .from('cats')
      .select('id, name, status')
      .eq('status', 'Available');
      
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
    food.brand || '',
    food.type || '',
    food.quantity || 0,
    food.units || '',
    food.cost_per_unit || 0,
    new Date(food.purchase_date || new Date())
  ),
  getCatFeedingRecords,
  addCatFeedingRecord: (record) => addCatFeedingRecord(
    record.cat_id || '',
    record.cat_food_id || '',
    record.amount || 0,
    new Date(record.feeding_date || new Date())
  ),
  getCats
};
