
import { supabase } from '@/integrations/supabase/client';
import { CatFood, CatFeedingRecord, CatFoodAPI } from '@/types/finance';

export const catFoodApi: CatFoodAPI = {
  getCatFood: async () => {
    try {
      // Direct table query instead of RPC
      const { data, error } = await supabase
        .from('cat_food')
        .select('*')
        .order('purchase_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching cat food:', error);
        return [];
      }
      
      return data as CatFood[] || [];
    } catch (error) {
      console.error('Error in getCatFood:', error);
      return [];
    }
  },
  
  addCatFood: async (food) => {
    try {
      // Direct table insert instead of RPC
      const { error } = await supabase
        .from('cat_food')
        .insert({
          brand: food.brand,
          type: food.type,
          quantity: food.quantity,
          units: food.units,
          cost_per_unit: food.cost_per_unit,
          purchase_date: food.purchase_date
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
      // Direct table query with joins instead of RPC
      const { data, error } = await supabase
        .from('cat_feeding_records')
        .select(`
          *,
          cats:cat_id(name),
          cat_food:cat_food_id(brand, type)
        `)
        .order('feeding_date', { ascending: false });
      
      if (error) {
        console.error('Error fetching feeding records:', error);
        return [];
      }
      
      // Transform the joined data to match the expected interface
      const records = data.map(record => ({
        id: record.id,
        cat_id: record.cat_id,
        cat_food_id: record.cat_food_id,
        amount: record.amount,
        feeding_date: record.feeding_date,
        created_at: record.created_at,
        cat_name: record.cats?.name,
        food_brand: record.cat_food?.brand,
        food_type: record.cat_food?.type
      }));
      
      return records as CatFeedingRecord[];
    } catch (error) {
      console.error('Error in getCatFeedingRecords:', error);
      return [];
    }
  },
  
  addCatFeedingRecord: async (record) => {
    try {
      // Direct table insert instead of RPC
      const { error } = await supabase
        .from('cat_feeding_records')
        .insert({
          cat_id: record.cat_id,
          cat_food_id: record.cat_food_id,
          amount: record.amount,
          feeding_date: record.feeding_date
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
      // This function directly accesses the cats table since there's no RPC for it
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
