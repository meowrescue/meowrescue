import React, { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from '@integrations/supabase';
import AdminLayout from "@/pages/Admin";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { Plus, Pencil, Trash2, Save, DollarSign, Calculator, PieChart, BarChart4, ArrowRight } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { calculateCatBudget } from "@/utils/financeUtils";

interface BudgetCategory {
  id: string;
  name: string;
  amount: number;
  description?: string;
  year: number;
  created_at: string;
  updated_at: string;
}

interface CatFoodItem {
  id: string;
  brand: string;
  type: string;
  cost_per_unit: number;
}

interface ExpenseSummary {
  category: string;
  amount: number;
  percentage: number;
}

const AdminBudget: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const currentYear = new Date().getFullYear();
  
  const [isAddCategoryDialogOpen, setIsAddCategoryDialogOpen] = useState(false);
  const [isEditCategoryDialogOpen, setIsEditCategoryDialogOpen] = useState(false);
  const [isCalculatorDialogOpen, setIsCalculatorDialogOpen] = useState(false);
  const [isInsightsDialogOpen, setIsInsightsDialogOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<BudgetCategory | null>(null);
  const [newCategory, setNewCategory] = useState({
    name: "",
    description: "",
    amount: 0,
    year: currentYear
  });

  // Calculator state
  const [calculatorInput, setCalculatorInput] = useState({
    catCount: 1,
    costPerUnit: 0,
    unitsPerDay: 3,
    daysPerYear: 365,
    categoryName: ""
  });
  
  // Fetch budget categories
  const {
    data: budgetCategories,
    isLoading,
    error
  } = useQuery({
    queryKey: ["admin-budget-categories"],
    queryFn: async () => {
      try {
        // Try to get budget categories from table
        const { data, error } = await supabase
          .from("budget_categories")
          .select("*")
          .eq("year", currentYear)
          .order("name");
          
        if (error) throw error;
        
        // If we have data, return it
        if (data && data.length > 0) {
          return data as BudgetCategory[];
        }
        
        // Otherwise, create default categories from expenses
        await createDefaultBudgetCategories();
        
        // Fetch again after creating defaults
        const { data: newData, error: newError } = await supabase
          .from("budget_categories")
          .select("*")
          .eq("year", currentYear)
          .order("name");
          
        if (newError) throw newError;
        return newData as BudgetCategory[];
      } catch (err) {
        console.error("Error fetching budget categories:", err);
        return [] as BudgetCategory[];
      }
    }
  });
  
  // Fetch cat food for budget calculator
  const { data: catFood } = useQuery({
    queryKey: ["cat-food-for-budget"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("cat_food")
        .select("id, brand, type, cost_per_unit")
        .order("brand");
        
      if (error) throw error;
      return data as CatFoodItem[];
    }
  });
  
  // Fetch cat count for budget calculator
  const { data: catCount } = useQuery({
    queryKey: ["cat-count-for-budget"],
    queryFn: async () => {
      const { count, error } = await supabase
        .from("cats")
        .select("*", { count: 'exact', head: true });
        
      if (error) throw error;
      return count || 0;
    }
  });
  
  // Fetch expense summary for insights
  const { data: expenseSummary, isLoading: isLoadingExpenses } = useQuery({
    queryKey: ["expense-summary"],
    queryFn: async () => {
      // Get current year expenses grouped by category
      const startDate = new Date(currentYear, 0, 1).toISOString(); // Jan 1st
      const endDate = new Date(currentYear, 11, 31).toISOString(); // Dec 31st
      
      const { data, error } = await supabase
        .from("expenses")
        .select("category, amount")
        .gte("expense_date", startDate)
        .lte("expense_date", endDate);
        
      if (error) throw error;
      
      // Group and sum expenses by category
      const categories: Record<string, number> = {};
      let total = 0;
      
      if (data) {
        data.forEach(expense => {
          const amount = typeof expense.amount === 'number' ? expense.amount : parseFloat(expense.amount);
          if (!isNaN(amount)) {
            categories[expense.category] = (categories[expense.category] || 0) + amount;
            total += amount;
          }
        });
      }
      
      // Convert to array with percentages
      return Object.entries(categories).map(([category, amount]) => ({
        category,
        amount,
        percentage: total > 0 ? (amount / total) * 100 : 0
      }));
    }
  });
  
  // Effect to update calculator when cat count loads
  useEffect(() => {
    if (catCount !== undefined) {
      setCalculatorInput(prev => ({
        ...prev,
        catCount
      }));
    }
  }, [catCount]);
  
  // Effect to auto-fill budget categories based on expense data
  useEffect(() => {
    if (expenseSummary && budgetCategories && budgetCategories.length === 0) {
      // Auto-create budget categories from expense data
      const categoriesToCreate = expenseSummary.map(item => ({
        name: item.category,
        description: `Auto-generated from expense data for ${item.category}`,
        amount: Math.ceil(item.amount * 1.2), // 20% buffer
        year: currentYear
      }));
      
      if (categoriesToCreate.length > 0) {
        toast({
          title: "Auto-generating budget categories",
          description: `Created ${categoriesToCreate.length} categories based on your expense data`,
        });
      }
    }
  }, [expenseSummary, budgetCategories]);

  // Create default budget categories
  async function createDefaultBudgetCategories() {
    try {
      // Get unique expense categories from database
      const { data: expenseCategories, error: expError } = await supabase
        .from("expenses")
        .select("category")
        .order("category");
        
      if (expError) throw expError;
      
      // Get unique categories
      const uniqueCategories = new Set<string>();
      expenseCategories?.forEach(expense => {
        if (expense.category) {
          uniqueCategories.add(expense.category);
        }
      });
      
      // Add default categories if none found
      if (uniqueCategories.size === 0) {
        ['Medical', 'Food', 'Supplies', 'Transport', 'Operations', 'Veterinary', 'Medicines', 
         'Spay/Neuter', 'Vaccinations', 'Microchipping', 'Facilities', 'Administration'].forEach(cat => {
          uniqueCategories.add(cat);
        });
      }
      
      // Create budget categories with default amounts
      const defaultCategories = Array.from(uniqueCategories).map(name => ({
        name,
        description: `Budget for ${name.toLowerCase()} expenses`,
        amount: 5000, // Default amount
        year: currentYear
      }));
      
      // Insert into database
      const { error: insertError } = await supabase
        .from("budget_categories")
        .insert(defaultCategories);
        
      if (insertError) throw insertError;
    } catch (err) {
      console.error("Error creating default budget categories:", err);
      toast({
        title: "Error",
        description: "Failed to create default budget categories",
        variant: "destructive"
      });
    }
  }
  
  // Add category mutation
  const addCategoryMutation = useMutation({
    mutationFn: async (categoryData: Omit<BudgetCategory, "id" | "created_at" | "updated_at">) => {
      const { data, error } = await supabase
        .from("budget_categories")
        .insert([categoryData])
        .select()
        .single();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Category Added",
        description: "Budget category created successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["admin-budget-categories"] });
      setIsAddCategoryDialogOpen(false);
      // Reset form
      setNewCategory({
        name: "",
        description: "",
        amount: 0,
        year: currentYear
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add budget category",
        variant: "destructive"
      });
    }
  });
  
  // Update category mutation
  const updateCategoryMutation = useMutation({
    mutationFn: async (category: BudgetCategory) => {
      const { data, error } = await supabase
        .from("budget_categories")
        .update({
          name: category.name,
          description: category.description,
          amount: category.amount,
          updated_at: new Date().toISOString()
        })
        .eq("id", category.id)
        .select();
        
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Category Updated",
        description: "Budget category updated successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["admin-budget-categories"] });
      setIsEditCategoryDialogOpen(false);
      setSelectedCategory(null);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update budget category",
        variant: "destructive"
      });
    }
  });
  
  // Delete category mutation
  const deleteCategoryMutation = useMutation({
    mutationFn: async (categoryId: string) => {
      const { error } = await supabase
        .from("budget_categories")
        .delete()
        .eq("id", categoryId);
        
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: "Category Deleted",
        description: "Budget category deleted successfully."
      });
      queryClient.invalidateQueries({ queryKey: ["admin-budget-categories"] });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete budget category",
        variant: "destructive"
      });
    }
  });

  const handleAddCategory = () => {
    addCategoryMutation.mutate(newCategory);
  };

  const handleUpdateCategory = () => {
    if (selectedCategory) {
      updateCategoryMutation.mutate(selectedCategory);
    }
  };

  const handleDeleteCategory = (id: string) => {
    if (confirm("Are you sure you want to delete this budget category?")) {
      deleteCategoryMutation.mutate(id);
    }
  };

  const handleEditClick = (category: BudgetCategory) => {
    setSelectedCategory(category);
    setIsEditCategoryDialogOpen(true);
  };
  
  const handleCalculatorSave = () => {
    const calculatedBudget = calculateCatBudget(
      calculatorInput.catCount,
      calculatorInput.costPerUnit,
      calculatorInput.unitsPerDay,
      calculatorInput.daysPerYear
    );
    
    // Find if category exists
    const existingCategory = budgetCategories?.find(
      cat => cat.name.toLowerCase() === calculatorInput.categoryName.toLowerCase()
    );
    
    if (existingCategory) {
      // Update existing category
      setSelectedCategory({
        ...existingCategory,
        amount: calculatedBudget
      });
      setIsEditCategoryDialogOpen(true);
    } else {
      // Create new category
      setNewCategory({
        name: calculatorInput.categoryName || "Cat Food",
        description: `Budget calculated based on ${calculatorInput.catCount} cats, $${calculatorInput.costPerUnit} per unit, ${calculatorInput.unitsPerDay} units per day`,
        amount: calculatedBudget,
        year: currentYear
      });
      setIsAddCategoryDialogOpen(true);
    }
    
    setIsCalculatorDialogOpen(false);
  };

  // Calculate expense vs budget insights
  const getExpensesVsBudgetInsights = () => {
    if (!budgetCategories || !expenseSummary) return [];
    
    return budgetCategories.map(category => {
      const expenseItem = expenseSummary.find(e => e.category.toLowerCase() === category.name.toLowerCase());
      const spent = expenseItem?.amount || 0;
      const allocated = category.amount;
      const remaining = allocated - spent;
      const percentUsed = allocated > 0 ? Math.min(100, (spent / allocated) * 100) : 0;
      
      let status = "On track";
      if (percentUsed > 90) status = "Critical";
      else if (percentUsed > 75) status = "Warning";
      
      return {
        category: category.name,
        allocated,
        spent,
        remaining,
        percentUsed,
        status
      };
    });
  };
  
  const totalBudget = budgetCategories?.reduce(
    (sum, category) => sum + (typeof category.amount === 'number' ? category.amount : 0), 
    0
  ) || 0;

  const insights = getExpensesVsBudgetInsights();

  return (
    <AdminLayout title="Budget Planning">
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-meow-primary">Budget Planning {currentYear}</h1>
            <p className="text-gray-600">
              Total Annual Budget: <span className="font-bold">{formatCurrency(totalBudget)}</span>
            </p>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setIsInsightsDialogOpen(true)} variant="outline">
              <PieChart className="mr-2 h-4 w-4" /> Budget Insights
            </Button>
            <Button onClick={() => setIsCalculatorDialogOpen(true)} variant="outline">
              <Calculator className="mr-2 h-4 w-4" /> Budget Calculator
            </Button>
            <Button onClick={() => setIsAddCategoryDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" /> Add Budget Category
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Total Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatCurrency(totalBudget)}</div>
              <p className="text-sm text-gray-500">Annual budget for {currentYear}</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Categories</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{budgetCategories?.length || 0}</div>
              <p className="text-sm text-gray-500">Budget categories</p>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg font-medium">Smart Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm text-gray-700">
                {insights.filter(i => i.status !== "On track").length > 0 ? (
                  <p>
                    {insights.filter(i => i.status === "Critical").length} categories need urgent attention
                  </p>
                ) : (
                  <p>Your budget is on track! No immediate actions needed.</p>
                )}
              </div>
              <Button 
                variant="link" 
                className="p-0 h-auto text-sm text-meow-primary" 
                onClick={() => setIsInsightsDialogOpen(true)}
              >
                View all insights <ArrowRight className="h-3 w-3 ml-1" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Category</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead className="text-right">Budget Amount</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={4} className="h-24 text-center">
                      <div className="flex justify-center">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-meow-primary"></div>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : error ? (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center text-red-500 py-8">
                      Error loading budget data
                    </TableCell>
                  </TableRow>
                ) : budgetCategories?.length ? (
                  budgetCategories.map((category) => (
                    <TableRow key={category.id}>
                      <TableCell className="font-medium">{category.name}</TableCell>
                      <TableCell>{category.description}</TableCell>
                      <TableCell className="text-right">{formatCurrency(category.amount)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="icon" 
                            onClick={() => handleEditClick(category)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button 
                            variant="destructive" 
                            size="icon"
                            onClick={() => handleDeleteCategory(category.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-8">
                      No budget categories found. Add your first budget category.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Category Dialog */}
        <Dialog open={isAddCategoryDialogOpen} onOpenChange={setIsAddCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add Budget Category</DialogTitle>
              <DialogDescription>
                Create a new budget category for tracking planned expenses.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">Name</label>
                <Input 
                  id="name"
                  value={newCategory.name}
                  onChange={(e) => setNewCategory({...newCategory, name: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right">Description</label>
                <Textarea 
                  id="description"
                  value={newCategory.description}
                  onChange={(e) => setNewCategory({...newCategory, description: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="amount" className="text-right">Amount ($)</label>
                <div className="flex items-center col-span-3">
                  <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                  <Input 
                    id="amount"
                    type="number"
                    value={newCategory.amount}
                    onChange={(e) => setNewCategory({...newCategory, amount: parseFloat(e.target.value)})}
                  />
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsAddCategoryDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleAddCategory}
                disabled={!newCategory.name || newCategory.amount <= 0}
              >
                Add Category
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Edit Category Dialog */}
        <Dialog open={isEditCategoryDialogOpen} onOpenChange={setIsEditCategoryDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit Budget Category</DialogTitle>
              <DialogDescription>
                Update this budget category's details.
              </DialogDescription>
            </DialogHeader>

            {selectedCategory && (
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-name" className="text-right">Name</label>
                  <Input 
                    id="edit-name"
                    value={selectedCategory.name}
                    onChange={(e) => setSelectedCategory({...selectedCategory, name: e.target.value})}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-description" className="text-right">Description</label>
                  <Textarea 
                    id="edit-description"
                    value={selectedCategory.description || ""}
                    onChange={(e) => setSelectedCategory({...selectedCategory, description: e.target.value})}
                    className="col-span-3" 
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <label htmlFor="edit-amount" className="text-right">Amount ($)</label>
                  <div className="flex items-center col-span-3">
                    <DollarSign className="h-4 w-4 mr-1 text-gray-500" />
                    <Input 
                      id="edit-amount"
                      type="number"
                      value={selectedCategory.amount}
                      onChange={(e) => setSelectedCategory({...selectedCategory, amount: parseFloat(e.target.value)})}
                    />
                  </div>
                </div>
              </div>
            )}

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsEditCategoryDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleUpdateCategory}
                disabled={!selectedCategory?.name || (selectedCategory?.amount || 0) <= 0}
              >
                Save Changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Budget Calculator Dialog */}
        <Dialog open={isCalculatorDialogOpen} onOpenChange={setIsCalculatorDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Budget Calculator</DialogTitle>
              <DialogDescription>
                Calculate budget needs based on cat count and expenses.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="category-name" className="text-right text-sm">Category Name</label>
                <Input 
                  id="category-name"
                  value={calculatorInput.categoryName}
                  onChange={(e) => setCalculatorInput({...calculatorInput, categoryName: e.target.value})}
                  placeholder="Cat Food"
                  className="col-span-2" 
                />
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="cat-count" className="text-right text-sm">Number of Cats</label>
                <Input 
                  id="cat-count"
                  type="number"
                  value={calculatorInput.catCount}
                  onChange={(e) => setCalculatorInput({...calculatorInput, catCount: parseInt(e.target.value) || 0})}
                  className="col-span-2" 
                />
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="cost-per-unit" className="text-right text-sm">Cost per Unit ($)</label>
                <Input 
                  id="cost-per-unit"
                  type="number"
                  step="0.01"
                  value={calculatorInput.costPerUnit}
                  onChange={(e) => setCalculatorInput({...calculatorInput, costPerUnit: parseFloat(e.target.value) || 0})}
                  className="col-span-2" 
                />
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="units-per-day" className="text-right text-sm">Units per Day</label>
                <Input 
                  id="units-per-day"
                  type="number"
                  step="0.5"
                  value={calculatorInput.unitsPerDay}
                  onChange={(e) => setCalculatorInput({...calculatorInput, unitsPerDay: parseFloat(e.target.value) || 0})}
                  className="col-span-2" 
                />
              </div>
              
              <div className="grid grid-cols-3 items-center gap-4">
                <label htmlFor="days-per-year" className="text-right text-sm">Days in Budget</label>
                <Input 
                  id="days-per-year"
                  type="number"
                  value={calculatorInput.daysPerYear}
                  onChange={(e) => setCalculatorInput({...calculatorInput, daysPerYear: parseInt(e.target.value) || 0})}
                  className="col-span-2" 
                />
              </div>
              
              <div className="bg-gray-50 p-4 rounded-md mt-4">
                <div className="text-sm text-gray-500 mb-2">Calculated Annual Budget:</div>
                <div className="text-2xl font-bold text-meow-primary">
                  {formatCurrency(
                    calculateCatBudget(
                      calculatorInput.catCount,
                      calculatorInput.costPerUnit,
                      calculatorInput.unitsPerDay,
                      calculatorInput.daysPerYear
                    )
                  )}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  Formula: {calculatorInput.catCount} cats × ${calculatorInput.costPerUnit} cost × {calculatorInput.unitsPerDay} units/day × {calculatorInput.daysPerYear} days
                </div>
              </div>
            </div>

            <DialogFooter>
              <Button 
                variant="outline" 
                onClick={() => setIsCalculatorDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                onClick={handleCalculatorSave}
                disabled={calculatorInput.costPerUnit <= 0 || calculatorInput.unitsPerDay <= 0}
              >
                <Save className="mr-2 h-4 w-4" />
                Save to Budget
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        
        {/* Budget Insights Dialog */}
        <Dialog open={isInsightsDialogOpen} onOpenChange={setIsInsightsDialogOpen}>
          <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Budget Insights & Recommendations</DialogTitle>
              <DialogDescription>
                Analyzing your budget vs. actual expenses to provide actionable insights
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-6 pt-4">
              <div className="bg-blue-50 border border-blue-100 rounded-md p-4">
                <h4 className="font-medium text-blue-700 mb-1">Budget Advisor AI</h4>
                <p className="text-sm text-blue-600">
                  Based on your current spending patterns and budget allocations, here are some recommendations:
                </p>
                <ul className="mt-2 space-y-1 text-sm text-blue-600">
                  {insights.some(i => i.percentUsed > 75) ? (
                    <>
                      <li>• Consider increasing budget for categories close to spending limits</li>
                      <li>• Review spending in critical categories and reduce if possible</li>
                    </>
                  ) : (
                    <li>• Your budget allocations appear to be well balanced</li>
                  )}
                  {insights.some(i => i.percentUsed < 25) && (
                    <li>• Some categories have significant unused budget that could be reallocated</li>
                  )}
                  {insights.length === 0 && (
                    <li>• Start tracking expenses to get personalized recommendations</li>
                  )}
                </ul>
              </div>
              
              <h3 className="font-semibold text-lg">Budget vs. Actual Spending</h3>
              
              {isLoadingExpenses ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-meow-primary"></div>
                </div>
              ) : insights.length > 0 ? (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Category</TableHead>
                        <TableHead className="text-right">Budget</TableHead>
                        <TableHead className="text-right">Spent</TableHead>
                        <TableHead className="text-right">Remaining</TableHead>
                        <TableHead>Usage</TableHead>
                        <TableHead>Status</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {insights.map((item, i) => (
                        <TableRow key={i}>
                          <TableCell className="font-medium">{item.category}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.allocated)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.spent)}</TableCell>
                          <TableCell className="text-right">{formatCurrency(item.remaining)}</TableCell>
                          <TableCell>
                            <div className="w-full bg-gray-200 rounded-full h-2">
                              <div
                                className={`h-2 rounded-full ${
                                  item.percentUsed > 90 ? 'bg-red-500' : 
                                  item.percentUsed > 75 ? 'bg-amber-500' : 'bg-green-500'
                                }`}
                                style={{ width: `${item.percentUsed}%` }}
                              ></div>
                            </div>
                            <span className="text-xs text-gray-500">{Math.round(item.percentUsed)}%</span>
                          </TableCell>
                          <TableCell>
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              item.status === 'Critical' ? 'bg-red-100 text-red-800' :
                              item.status === 'Warning' ? 'bg-amber-100 text-amber-800' :
                              'bg-green-100 text-green-800'
                            }`}>
                              {item.status}
                            </span>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No expense data available to compare with budget categories.
                </div>
              )}
              
              <div className="bg-gray-50 p-4 rounded-md">
                <h3 className="font-semibold mb-2">Recommended Actions</h3>
                <ul className="text-sm space-y-2">
                  {insights.filter(i => i.status === "Critical").map((item, i) => (
                    <li key={`critical-${i}`} className="flex gap-2">
                      <span className="text-red-500 font-medium">URGENT:</span>
                      <span>Increase budget for {item.category} or reduce spending - currently at {Math.round(item.percentUsed)}% of budget</span>
                    </li>
                  ))}
                  {insights.filter(i => i.status === "Warning").map((item, i) => (
                    <li key={`warning-${i}`} className="flex gap-2">
                      <span className="text-amber-500 font-medium">WARNING:</span>
                      <span>Monitor spending on {item.category} - currently at {Math.round(item.percentUsed)}% of budget</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminBudget;
