
import { supabase } from '@/integrations/supabase/client';
import { CatFood, CatFeedingRecord, Cat } from '@/types/applications';

export const catFoodApi = {
  async getCatFood(): Promise<CatFood[]> {
    const { data, error } = await supabase
      .from('cat_food')
      .select('*')
      .order('purchase_date', { ascending: false });
      
    if (error) throw error;
    return data as CatFood[] || [];
  },
  
  async addCatFood(food: Omit<CatFood, 'id' | 'created_at'>): Promise<CatFood> {
    const { data, error } = await supabase
      .from('cat_food')
      .insert({
        brand: food.brand,
        type: food.type,
        quantity: food.quantity,
        units: food.units,
        cost_per_unit: food.cost_per_unit,
        purchase_date: food.purchase_date
      })
      .select()
      .single();
      
    if (error) throw error;
    return data as CatFood;
  },
  
  async getCatFeedingRecords(): Promise<CatFeedingRecord[]> {
    const { data, error } = await supabase
      .from('cat_feeding_records')
      .select(`
        *,
        cats (name),
        cat_food (brand, type)
      `)
      .order('feeding_date', { ascending: false });
      
    if (error) throw error;
    
    // Transform the data to match the expected CatFeedingRecord structure
    const records = data.map(record => ({
      ...record,
      cat_name: record.cats?.name || '',
      food_brand: record.cat_food?.brand || '',
      food_type: record.cat_food?.type || ''
    }));
    
    return records as CatFeedingRecord[] || [];
  },
  
  async addCatFeedingRecord(record: Omit<CatFeedingRecord, 'id' | 'created_at' | 'cat_name' | 'food_brand' | 'food_type'>): Promise<CatFeedingRecord> {
    const { data, error } = await supabase
      .from('cat_feeding_records')
      .insert({
        cat_id: record.cat_id,
        cat_food_id: record.cat_food_id,
        amount: record.amount,
        feeding_date: record.feeding_date
      })
      .select()
      .single();
      
    if (error) throw error;
    
    // We don't have the cat_name and food details yet, so we'll fetch them separately
    const catResponse = await supabase
      .from('cats')
      .select('name')
      .eq('id', record.cat_id)
      .single();
    
    const foodResponse = await supabase
      .from('cat_food')
      .select('brand, type')
      .eq('id', record.cat_food_id)
      .single();
    
    return {
      ...data,
      cat_name: catResponse.data?.name || '',
      food_brand: foodResponse.data?.brand || '',
      food_type: foodResponse.data?.type || ''
    } as CatFeedingRecord;
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
