
import { supabase } from '@/integrations/supabase/client';
import { CatFood, CatFeedingRecord, Cat, CatFoodAPI } from '@/types/finance';

export const catFoodApi: CatFoodAPI = {
  async getCatFood(): Promise<CatFood[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_cat_food') as {data: CatFood[] | null, error: Error | null};
        
      if (error) throw error;
      return data as CatFood[] || [];
    } catch (err) {
      console.error('Error fetching cat food:', err);
      return [];
    }
  },
  
  async addCatFood(food: Omit<CatFood, 'id' | 'created_at'>): Promise<CatFood> {
    try {
      const { data, error } = await supabase
        .rpc('add_cat_food', {
          p_brand: food.brand,
          p_type: food.type,
          p_quantity: food.quantity,
          p_units: food.units,
          p_cost_per_unit: food.cost_per_unit,
          p_purchase_date: food.purchase_date
        }) as {data: CatFood | null, error: Error | null};
        
      if (error) throw error;
      return data as CatFood;
    } catch (err) {
      console.error('Error adding cat food:', err);
      throw err;
    }
  },
  
  async getCatFeedingRecords(): Promise<CatFeedingRecord[]> {
    try {
      const { data, error } = await supabase
        .rpc('get_cat_feeding_records') as {data: CatFeedingRecord[] | null, error: Error | null};
        
      if (error) throw error;
      return data as CatFeedingRecord[] || [];
    } catch (err) {
      console.error('Error fetching cat feeding records:', err);
      return [];
    }
  },
  
  async addCatFeedingRecord(record: Omit<CatFeedingRecord, 'id' | 'created_at' | 'cat_name' | 'food_brand' | 'food_type'>): Promise<CatFeedingRecord> {
    try {
      const { data, error } = await supabase
        .rpc('add_cat_feeding_record', {
          p_cat_id: record.cat_id,
          p_cat_food_id: record.cat_food_id,
          p_amount: record.amount,
          p_feeding_date: record.feeding_date
        }) as {data: CatFeedingRecord | null, error: Error | null};
        
      if (error) throw error;
      return data as CatFeedingRecord;
    } catch (err) {
      console.error('Error adding cat feeding record:', err);
      throw err;
    }
  },
  
  async getCats(): Promise<Cat[]> {
    try {
      const { data, error } = await supabase
        .from('cats')
        .select('id, name')
        .order('name');
        
      if (error) throw error;
      return data || [];
    } catch (err) {
      console.error('Error fetching cats:', err);
      return [];
    }
  }
};
