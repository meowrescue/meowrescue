
import { supabase } from '@/integrations/supabase/client';
import { CatFood, CatFeedingRecord, CatFoodAPI } from '@/types/finance';

// This is a workaround for tables that aren't in the TypeScript definitions
// Using a function for better type safety
const safeFetch = async <T>(tableName: string): Promise<T[]> => {
  try {
    // Using 'any' to bypass TypeScript's table name checking
    const { data, error } = await (supabase as any)
      .from(tableName)
      .select('*');
    
    if (error) {
      console.error(`Error fetching from ${tableName}:`, error);
      return [];
    }
    
    return (data as T[]) || [];
  } catch (error) {
    console.error(`Error in safeFetch for ${tableName}:`, error);
    return [];
  }
};

// Same approach for insert operations
const safeInsert = async <T>(tableName: string, data: any): Promise<void> => {
  try {
    const { error } = await (supabase as any)
      .from(tableName)
      .insert(data);
    
    if (error) {
      console.error(`Error inserting into ${tableName}:`, error);
      throw error;
    }
  } catch (error) {
    console.error(`Error in safeInsert for ${tableName}:`, error);
    throw error;
  }
};

export const catFoodApi: CatFoodAPI = {
  getCatFood: async () => {
    try {
      const data = await safeFetch<CatFood>('cat_food');
      return data;
    } catch (error) {
      console.error('Error in getCatFood:', error);
      return [];
    }
  },
  
  addCatFood: async (food) => {
    try {
      await safeInsert('cat_food', {
        brand: food.brand,
        type: food.type,
        quantity: food.quantity,
        units: food.units,
        cost_per_unit: food.cost_per_unit,
        purchase_date: food.purchase_date
      });
    } catch (error) {
      console.error('Error in addCatFood:', error);
      throw error;
    }
  },
  
  getCatFeedingRecords: async () => {
    try {
      // For joined data, we need a more specific approach
      const { data, error } = await (supabase as any)
        .from('cat_feeding_records')
        .select(`
          *,
          cats:cat_id(name),
          cat_food:cat_food_id(brand, type)
        `);
      
      if (error) {
        console.error('Error fetching feeding records:', error);
        return [];
      }
      
      // Map the data to match our expected type
      const records = data.map((record: any) => ({
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
      await safeInsert('cat_feeding_records', {
        cat_id: record.cat_id,
        cat_food_id: record.cat_food_id,
        amount: record.amount,
        feeding_date: record.feeding_date
      });
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
