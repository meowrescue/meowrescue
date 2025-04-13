
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCaption, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Dialog, 
  DialogContent, 
  DialogDescription, 
  DialogFooter, 
  DialogHeader, 
  DialogTitle,
  DialogClose
} from '@/components/ui/dialog';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { CatFood, CatFeedingRecord } from '@/types/finance';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { CirclePlus, Receipt, Cat, FileSpreadsheet, BookOpen } from 'lucide-react';
import { format } from 'date-fns';
import { PieChart, Pie, Cell, ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

const catFoodSchema = z.object({
  brand: z.string().min(1, 'Brand is required'),
  type: z.string().min(1, 'Type is required'),
  quantity: z.coerce.number().min(1, 'Quantity must be at least 1'),
  units: z.string().min(1, 'Unit is required'),
  cost_per_unit: z.coerce.number().min(0.01, 'Cost must be at least 0.01'),
  purchase_date: z.string().min(1, 'Purchase date is required')
});

const catFeedingSchema = z.object({
  cat_id: z.string().min(1, 'Cat is required'),
  cat_food_id: z.string().min(1, 'Food type is required'),
  amount: z.coerce.number().min(0.1, 'Amount must be at least 0.1'),
  feeding_date: z.string().min(1, 'Feeding date is required')
});

const CatFoodTracker: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [addFoodOpen, setAddFoodOpen] = useState(false);
  const [addFeedingOpen, setAddFeedingOpen] = useState(false);
  
  const catFoodForm = useForm<z.infer<typeof catFoodSchema>>({
    resolver: zodResolver(catFoodSchema),
    defaultValues: {
      brand: '',
      type: '',
      quantity: 0,
      units: 'lbs',
      cost_per_unit: 0,
      purchase_date: format(new Date(), 'yyyy-MM-dd')
    }
  });
  
  const catFeedingForm = useForm<z.infer<typeof catFeedingSchema>>({
    resolver: zodResolver(catFeedingSchema),
    defaultValues: {
      cat_id: '',
      cat_food_id: '',
      amount: 0,
      feeding_date: format(new Date(), 'yyyy-MM-dd')
    }
  });
  
  // Query to get cat food inventory
  const { data: catFood, isLoading: isCatFoodLoading } = useQuery({
    queryKey: ['cat-food'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_cat_food');
      
      if (error) throw error;
      
      return data as CatFood[];
    }
  });
  
  // Query to get cat feeding records
  const { data: catFeedings, isLoading: isFeedingsLoading } = useQuery({
    queryKey: ['cat-feedings'],
    queryFn: async () => {
      const { data, error } = await supabase.rpc('get_cat_feeding_records');
      
      if (error) throw error;
      
      return data as CatFeedingRecord[];
    }
  });
  
  // Query to get cats for the feeding form
  const { data: cats } = useQuery({
    queryKey: ['cats-basic'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cats')
        .select('id, name')
        .order('name');
      
      if (error) throw error;
      
      return data as { id: string; name: string }[];
    }
  });
  
  // Mutation for adding new cat food
  const addCatFoodMutation = useMutation({
    mutationFn: async (values: z.infer<typeof catFoodSchema>) => {
      const { data, error } = await supabase.rpc('add_cat_food', {
        p_brand: values.brand,
        p_type: values.type,
        p_quantity: values.quantity,
        p_units: values.units,
        p_cost_per_unit: values.cost_per_unit,
        p_purchase_date: values.purchase_date
      });
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Cat Food Added',
        description: 'The cat food has been added to inventory.'
      });
      
      catFoodForm.reset();
      setAddFoodOpen(false);
      
      // Invalidate the cat food query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['cat-food'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error Adding Cat Food',
        description: error.message || 'There was an error adding the cat food.',
        variant: 'destructive'
      });
    }
  });
  
  // Mutation for adding new cat feeding record
  const addCatFeedingMutation = useMutation({
    mutationFn: async (values: z.infer<typeof catFeedingSchema>) => {
      const { data, error } = await supabase.rpc('add_cat_feeding_record', {
        p_cat_id: values.cat_id,
        p_cat_food_id: values.cat_food_id,
        p_amount: values.amount,
        p_feeding_date: values.feeding_date
      });
      
      if (error) throw error;
      
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Feeding Record Added',
        description: 'The feeding record has been saved.'
      });
      
      catFeedingForm.reset();
      setAddFeedingOpen(false);
      
      // Invalidate the cat feeding query to refresh the data
      queryClient.invalidateQueries({ queryKey: ['cat-feedings'] });
    },
    onError: (error: any) => {
      toast({
        title: 'Error Adding Feeding Record',
        description: error.message || 'There was an error adding the feeding record.',
        variant: 'destructive'
      });
    }
  });
  
  // Prepare data for charts
  const prepareBrandChartData = () => {
    if (!catFood) return [];
    
    const brandCount: Record<string, number> = {};
    
    catFood.forEach(food => {
      if (brandCount[food.brand]) {
        brandCount[food.brand] += food.quantity;
      } else {
        brandCount[food.brand] = food.quantity;
      }
    });
    
    return Object.keys(brandCount).map(brand => ({
      name: brand,
      value: brandCount[brand]
    }));
  };
  
  const prepareFeedingChartData = () => {
    if (!catFeedings) return [];
    
    const feedingByFood: Record<string, number> = {};
    
    catFeedings.forEach(feeding => {
      const key = `${feeding.food_brand} - ${feeding.food_type}`;
      
      if (feedingByFood[key]) {
        feedingByFood[key] += Number(feeding.amount);
      } else {
        feedingByFood[key] = Number(feeding.amount);
      }
    });
    
    return Object.keys(feedingByFood).map(food => ({
      name: food,
      amount: feedingByFood[food]
    }));
  };
  
  const onSubmitCatFood = (values: z.infer<typeof catFoodSchema>) => {
    addCatFoodMutation.mutate(values);
  };
  
  const onSubmitCatFeeding = (values: z.infer<typeof catFeedingSchema>) => {
    addCatFeedingMutation.mutate(values);
  };
  
  const brandChartData = prepareBrandChartData();
  const feedingChartData = prepareFeedingChartData();

  return (
    <div className="space-y-8">
      <Tabs defaultValue="inventory" className="w-full">
        <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-4">
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="feedings">Feedings</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        {/* Inventory Tab */}
        <TabsContent value="inventory" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Cat Food Inventory</h2>
            <Button onClick={() => setAddFoodOpen(true)}>
              <CirclePlus className="h-4 w-4 mr-2" />
              Add Food
            </Button>
          </div>
          
          {isCatFoodLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
            </div>
          ) : !catFood || catFood.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No cat food in inventory. Add some using the button above.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableCaption>Current cat food inventory.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Units</TableHead>
                    <TableHead>Cost/Unit</TableHead>
                    <TableHead>Purchase Date</TableHead>
                    <TableHead>Total Cost</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catFood.map((food) => (
                    <TableRow key={food.id}>
                      <TableCell className="font-medium">{food.brand}</TableCell>
                      <TableCell>{food.type}</TableCell>
                      <TableCell>{food.quantity}</TableCell>
                      <TableCell>{food.units}</TableCell>
                      <TableCell>${food.cost_per_unit.toFixed(2)}</TableCell>
                      <TableCell>{new Date(food.purchase_date).toLocaleDateString()}</TableCell>
                      <TableCell>${(food.quantity * food.cost_per_unit).toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        {/* Feedings Tab */}
        <TabsContent value="feedings" className="space-y-6">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-bold">Cat Feeding Records</h2>
            <Button onClick={() => setAddFeedingOpen(true)}>
              <CirclePlus className="h-4 w-4 mr-2" />
              Add Feeding
            </Button>
          </div>
          
          {isFeedingsLoading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
            </div>
          ) : !catFeedings || catFeedings.length === 0 ? (
            <Card>
              <CardContent className="pt-6 text-center">
                <p className="text-gray-500">No feeding records yet. Add some using the button above.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="bg-white rounded-lg shadow overflow-hidden">
              <Table>
                <TableCaption>Recent cat feeding records.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cat</TableHead>
                    <TableHead>Food</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Feeding Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {catFeedings.map((feeding) => (
                    <TableRow key={feeding.id}>
                      <TableCell className="font-medium">{feeding.cat_name}</TableCell>
                      <TableCell>{feeding.food_brand} - {feeding.food_type}</TableCell>
                      <TableCell>{feeding.amount} {feeding.amount === 1 ? 'unit' : 'units'}</TableCell>
                      <TableCell>{new Date(feeding.feeding_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </TabsContent>
        
        {/* Analytics Tab */}
        <TabsContent value="analytics" className="space-y-6">
          <h2 className="text-2xl font-bold">Food Usage Analytics</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Food Inventory by Brand</CardTitle>
                <CardDescription>Distribution of cat food quantities by brand</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {brandChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={brandChartData}
                        cx="50%"
                        cy="50%"
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      >
                        {brandChartData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} units`, 'Quantity']} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">No inventory data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Food Usage by Type</CardTitle>
                <CardDescription>How much of each food type has been used</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {feedingChartData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={feedingChartData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey="name" 
                        angle={-45} 
                        textAnchor="end"
                        height={80}
                        interval={0}
                      />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="amount" name="Amount Used" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center">
                    <p className="text-gray-500">No feeding data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Inventory Value</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Receipt className="h-10 w-10 text-meow-primary mr-4" />
                    <div>
                      <p className="text-3xl font-bold">
                        ${catFood?.reduce((total, food) => total + (food.quantity * food.cost_per_unit), 0).toFixed(2) || '0.00'}
                      </p>
                      <p className="text-sm text-gray-500">Current value</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Total Feedings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <Cat className="h-10 w-10 text-meow-primary mr-4" />
                    <div>
                      <p className="text-3xl font-bold">{catFeedings?.length || 0}</p>
                      <p className="text-sm text-gray-500">Recorded feedings</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-xl">Food Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <FileSpreadsheet className="h-10 w-10 text-meow-primary mr-4" />
                    <div>
                      <p className="text-3xl font-bold">
                        {new Set(catFood?.map(food => `${food.brand} ${food.type}`)).size || 0}
                      </p>
                      <p className="text-sm text-gray-500">Unique food types</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
      
      {/* Add Food Dialog */}
      <Dialog open={addFoodOpen} onOpenChange={setAddFoodOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Cat Food to Inventory</DialogTitle>
            <DialogDescription>
              Add a new cat food purchase to the inventory.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...catFoodForm}>
            <form onSubmit={catFoodForm.handleSubmit(onSubmitCatFood)} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={catFoodForm.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand</FormLabel>
                      <FormControl>
                        <Input placeholder="Purina" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={catFoodForm.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Type</FormLabel>
                      <FormControl>
                        <Input placeholder="Kitten Chow" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={catFoodForm.control}
                  name="quantity"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Quantity</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={catFoodForm.control}
                  name="units"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Units</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select units" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="lbs">Pounds (lbs)</SelectItem>
                          <SelectItem value="kg">Kilograms (kg)</SelectItem>
                          <SelectItem value="oz">Ounces (oz)</SelectItem>
                          <SelectItem value="cans">Cans</SelectItem>
                          <SelectItem value="bags">Bags</SelectItem>
                          <SelectItem value="boxes">Boxes</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={catFoodForm.control}
                  name="cost_per_unit"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cost per Unit ($)</FormLabel>
                      <FormControl>
                        <Input type="number" min="0" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={catFoodForm.control}
                  name="purchase_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Purchase Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={addCatFoodMutation.isPending}>
                  {addCatFoodMutation.isPending ? 'Adding...' : 'Add to Inventory'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Add Feeding Dialog */}
      <Dialog open={addFeedingOpen} onOpenChange={setAddFeedingOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Record Cat Feeding</DialogTitle>
            <DialogDescription>
              Record a new feeding for a cat.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...catFeedingForm}>
            <form onSubmit={catFeedingForm.handleSubmit(onSubmitCatFeeding)} className="space-y-4">
              <FormField
                control={catFeedingForm.control}
                name="cat_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cat</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select cat" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {cats?.map(cat => (
                          <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={catFeedingForm.control}
                name="cat_food_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Food</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select food" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {catFood?.map(food => (
                          <SelectItem key={food.id} value={food.id}>
                            {food.brand} - {food.type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={catFeedingForm.control}
                  name="amount"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <Input type="number" min="0.1" step="0.1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={catFeedingForm.control}
                  name="feeding_date"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Feeding Date</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <DialogClose asChild>
                  <Button variant="outline">Cancel</Button>
                </DialogClose>
                <Button type="submit" disabled={addCatFeedingMutation.isPending}>
                  {addCatFeedingMutation.isPending ? 'Saving...' : 'Save Feeding'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CatFoodTracker;
