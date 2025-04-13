
import { supabase } from '@/integrations/supabase/client';
import { CatFood, CatFeedingRecord, Cat } from '@/types/applications';

export const catFoodApi = {
  async getCatFood(): Promise<CatFood[]> {
    const { data, error } = await supabase
      .from('cat_food')
      .select('*')
      .order('purchase_date', { ascending: false });
      
    if (error) throw error;
    return data || [];
  },
  
  async addCatFood(food: Omit<CatFood, 'id' | 'created_at'>): Promise<CatFood> {
    const { data, error } = await supabase
      .from('cat_food')
      .insert([food])
      .select()
      .single();
      
    if (error) throw error;
    return data;
  },
  
  async getCatFeedingRecords(): Promise<CatFeedingRecord[]> {
    const { data, error } = await supabase
      .from('cat_feeding_records')
      .select(`
        *,
        cats(name),
        cat_food(brand, type)
      `)
      .order('feeding_date', { ascending: false });
      
    if (error) throw error;
    
    return (data || []).map(record => ({
      ...record,
      cat_name: record.cats?.name || 'Unknown Cat',
      food_brand: record.cat_food?.brand || 'Unknown Brand',
      food_type: record.cat_food?.type || 'Unknown Type'
    }));
  },
  
  async addCatFeedingRecord(record: Omit<CatFeedingRecord, 'id' | 'created_at' | 'cat_name' | 'food_brand' | 'food_type'>): Promise<CatFeedingRecord> {
    const { data, error } = await supabase
      .from('cat_feeding_records')
      .insert([record])
      .select()
      .single();
      
    if (error) throw error;
    return data;
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
