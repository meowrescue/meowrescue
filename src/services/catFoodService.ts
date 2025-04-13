
import { supabase } from '@/integrations/supabase/client';
import { CatFood, CatFeedingRecord, CatFoodAPI } from '@/types/finance';

export const catFoodApi: CatFoodAPI = {
  getCatFood: async () => {
    try {
      // Use direct fetch with SQL query instead of .from() method
      const { data, error } = await supabase.rpc('get_cat_food');
      
      if (error) {
        console.error('Error fetching cat food:', error);
        return [];
      }
      
      return data as CatFood[];
    } catch (error) {
      console.error('Error in getCatFood:', error);
      return [];
    }
  },
  
  addCatFood: async (food) => {
    try {
      // Use direct execution of SQL for insert
      const { error } = await supabase.rpc('add_cat_food', {
        p_brand: food.brand,
        p_type: food.type,
        p_quantity: food.quantity,
        p_units: food.units,
        p_cost_per_unit: food.cost_per_unit,
        p_purchase_date: food.purchase_date
      });
      
      if (error) {
        console.error('Error adding cat food:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in addCatFood:', error);
      throw error;
    }
  },
  
  getCatFeedingRecords: async () => {
    try {
      // Use direct fetch with SQL query
      const { data, error } = await supabase.rpc('get_cat_feeding_records');
      
      if (error) {
        console.error('Error fetching feeding records:', error);
        return [];
      }
      
      if (data && Array.isArray(data)) {
        return data as CatFeedingRecord[];
      }
      
      return [];
    } catch (error) {
      console.error('Error in getCatFeedingRecords:', error);
      return [];
    }
  },
  
  addCatFeedingRecord: async (record) => {
    try {
      // Use direct execution of SQL for insert
      const { error } = await supabase.rpc('add_cat_feeding_record', {
        p_cat_id: record.cat_id,
        p_cat_food_id: record.cat_food_id,
        p_amount: record.amount,
        p_feeding_date: record.feeding_date
      });
      
      if (error) {
        console.error('Error recording feeding:', error);
        throw error;
      }
    } catch (error) {
      console.error('Error in addCatFeedingRecord:', error);
      throw error;
    }
  },
  
  getCats: async () => {
    try {
      const { data, error } = await supabase
        .from('cats')
        .select('id, name')
        .order('name', { ascending: true });
        
      if (error) {
        console.error('Error fetching cats:', error);
        return [];
      }
      
      return data as {id: string; name: string}[];
    } catch (error) {
      console.error('Error in getCats:', error);
      return [];
    }
  }
};
