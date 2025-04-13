
import { supabase } from '@/integrations/supabase/client';
import { CatFood, CatFeedingRecord, CatFoodAPI } from '@/types/finance';

// Helper function to call Supabase RPC functions with proper type handling
const callRpcFunction = async <T>(functionName: string, params: any = {}): Promise<T[]> => {
  try {
    // Use type assertion to avoid TypeScript errors with RPC function names
    const { data, error } = await supabase.rpc(functionName as any, params);
    
    if (error) {
      console.error(`Error calling RPC function ${functionName}:`, error);
      return [];
    }
    
    // Use type assertion to ensure we return the correct type
    return (data as T[]) || [];
  } catch (error) {
    console.error(`Error in RPC function ${functionName}:`, error);
    return [];
  }
};

export const catFoodApi: CatFoodAPI = {
  getCatFood: async () => {
    try {
      // Use RPC function to get cat food
      const data = await callRpcFunction<CatFood>('get_cat_food');
      return data;
    } catch (error) {
      console.error('Error in getCatFood:', error);
      return [];
    }
  },
  
  addCatFood: async (food) => {
    try {
      // Use type assertion to bypass TypeScript checking for RPC function name
      const { data, error } = await supabase.rpc('add_cat_food' as any, {
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
      // Use RPC function to get feeding records
      const data = await callRpcFunction<CatFeedingRecord>('get_cat_feeding_records');
      return data;
    } catch (error) {
      console.error('Error in getCatFeedingRecords:', error);
      return [];
    }
  },
  
  addCatFeedingRecord: async (record) => {
    try {
      // Use type assertion to bypass TypeScript checking for RPC function name
      const { data, error } = await supabase.rpc('add_cat_feeding_record' as any, {
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
      // This function directly accesses the cats table which is in the type definitions
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
