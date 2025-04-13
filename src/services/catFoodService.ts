
import { supabase } from '@/integrations/supabase/client';
import { CatFood, CatFeedingRecord, Cat } from '@/types/applications';

export const catFoodApi = {
  async getCatFood(): Promise<CatFood[]> {
    const { data, error } = await supabase
      .rpc('get_cat_food');
      
    if (error) throw error;
    return data as CatFood[] || [];
  },
  
  async addCatFood(food: Omit<CatFood, 'id' | 'created_at'>): Promise<CatFood> {
    const { data, error } = await supabase
      .rpc('add_cat_food', {
        p_brand: food.brand,
        p_type: food.type,
        p_quantity: food.quantity,
        p_units: food.units,
        p_cost_per_unit: food.cost_per_unit,
        p_purchase_date: food.purchase_date
      });
      
    if (error) throw error;
    return data as CatFood;
  },
  
  async getCatFeedingRecords(): Promise<CatFeedingRecord[]> {
    const { data, error } = await supabase
      .rpc('get_cat_feeding_records');
      
    if (error) throw error;
    
    return data as CatFeedingRecord[] || [];
  },
  
  async addCatFeedingRecord(record: Omit<CatFeedingRecord, 'id' | 'created_at' | 'cat_name' | 'food_brand' | 'food_type'>): Promise<CatFeedingRecord> {
    const { data, error } = await supabase
      .rpc('add_cat_feeding_record', {
        p_cat_id: record.cat_id,
        p_cat_food_id: record.cat_food_id,
        p_amount: record.amount,
        p_feeding_date: record.feeding_date
      });
      
    if (error) throw error;
    return data as CatFeedingRecord;
  },
  
  async getCats(): Promise<Cat[]> {
    const { data, error } = await supabase
      .from('cats')
      .select('id, name')
      .order('name');
      
    if (error) throw error;
    return data || [];
  }
};
