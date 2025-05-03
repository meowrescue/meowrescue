import getSupabaseClient from '@/integrations/supabase/client';

/**
 * Fetches budget categories from database
 */
export const getBudgetCategories = async () => {
  try {
    // Let's try a more direct approach without filtering by year first
    console.log('Fetching budget categories (all years)');
    
    const getSupabaseClient() = getSupabaseClient();
    const { data: allCategories, error: initialError } = await getSupabaseClient()
      .from('budget_categories')
      .select('*')
      .order('name');
      
    if (initialError) {
      console.error('Error fetching budget categories:', initialError);
      return [];
    }
    
    if (!allCategories || allCategories.length === 0) {
      console.log("No budget categories found in the database");
      return [];
    }
    
    console.log(`Retrieved ${allCategories.length} budget categories`, allCategories);
    return allCategories;
  } catch (err) {
    console.error('Failed to fetch budget categories:', err);
    return [];
  }
};

/**
 * Calculates spending for each budget category by
 * querying expenses in each category
 */
export const calculateCategorySpending = async (categories) => {
  try {
    if (!categories || categories.length === 0) {
      console.log("No categories provided to calculate spending");
      return [];
    }
    
    console.log(`Calculating spending for ${categories.length} categories`);
    const enrichedCategories = await Promise.all(
      categories.map(async (category) => {
        const getSupabaseClient() = getSupabaseClient();
        // Query expenses for this category
        const { data: expenses, error } = await getSupabaseClient()
          .from('expenses')
          .select('amount')
          .eq('category', category.name);
          
        if (error) {
          console.error(`Error fetching expenses for category ${category.name}:`, error);
          return {
            ...category,
            spent: 0,
            remaining: category.amount,
            percentUsed: 0,
            amountSpent: 0,
            budgetAmount: category.amount
          };
        }
        
        // Calculate total spent in this category
        const spent = expenses ? expenses.reduce((total, expense) => {
          const amount = typeof expense.amount === 'string' 
            ? parseFloat(expense.amount) 
            : expense.amount;
          return total + (isNaN(amount) ? 0 : amount);
        }, 0) : 0;
        
        const remaining = Math.max(0, category.amount - spent);
        const percentUsed = category.amount > 0 
          ? Math.min(100, (spent / category.amount) * 100) 
          : 0;
          
        console.log(`Category ${category.name}: spent ${spent}, remaining ${remaining}, percent ${percentUsed.toFixed(2)}%`);
        
        return {
          ...category,
          spent,
          remaining,
          percentUsed,
          amountSpent: spent,
          budgetAmount: category.amount
        };
      })
    );
    
    return enrichedCategories;
  } catch (err) {
    console.error('Failed to calculate category spending:', err);
    return categories.map(category => ({
      ...category,
      spent: 0,
      remaining: category.amount,
      percentUsed: 0,
      amountSpent: 0,
      budgetAmount: category.amount
    }));
  }
};
