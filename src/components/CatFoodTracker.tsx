import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { CatFood, CatFeedingRecord } from '@/types/applications';
import { catFoodApi } from '@/services/catFoodService';

// Form schemas
const catFoodSchema = z.object({
  brand: z.string().min(1, { message: 'Brand is required' }),
  type: z.string().min(1, { message: 'Type is required' }),
  quantity: z.coerce.number().positive({ message: 'Quantity must be a positive number' }),
  units: z.string().min(1, { message: 'Units are required' }),
  total_cost: z.coerce.number().min(0, { message: 'Cost must be a valid number' }),
  purchase_date: z.string().min(1, { message: 'Purchase date is required' }),
});

const feedingSchema = z.object({
  cat_id: z.string().min(1, { message: 'Cat is required' }),
  cat_food_id: z.string().min(1, { message: 'Food type is required' }),
  amount: z.coerce.number().positive({ message: 'Amount must be a positive number' }),
  feeding_date: z.string().min(1, { message: 'Feeding date is required' }),
});

const CatFoodTracker: React.FC = () => {
  const { toast } = useToast();
  const [foodDialogOpen, setFoodDialogOpen] = useState(false);
  const [feedingDialogOpen, setFeedingDialogOpen] = useState(false);

  // Set up forms
  const foodForm = useForm<z.infer<typeof catFoodSchema>>({
    resolver: zodResolver(catFoodSchema),
    defaultValues: {
      brand: '',
      type: '',
      quantity: 0,
      units: 'cans',
      total_cost: 0,
      purchase_date: new Date().toISOString().split('T')[0],
    },
  });

  const feedingForm = useForm<z.infer<typeof feedingSchema>>({
    resolver: zodResolver(feedingSchema),
    defaultValues: {
      cat_id: '',
      cat_food_id: '',
      amount: 0,
      feeding_date: new Date().toISOString().split('T')[0],
    },
  });

  // Query for cat food inventory
  const { data: foodInventory = [], isLoading: isLoadingFood, refetch: refetchFood } = useQuery({
    queryKey: ['cat-food-inventory'],
    queryFn: () => catFoodApi.getCatFood()
  });

  // Query for feeding records
  const { data: feedingRecords = [], isLoading: isLoadingFeedings, refetch: refetchFeedings } = useQuery({
    queryKey: ['cat-feeding-records'],
    queryFn: () => catFoodApi.getCatFeedingRecords()
  });

  // Query for available cats
  const { data: cats = [] } = useQuery({
    queryKey: ['available-cats'],
    queryFn: () => catFoodApi.getCats()
  });

  // Handle food form submission
  const onSubmitFood = async (values: z.infer<typeof catFoodSchema>) => {
    const costPerUnit = values.total_cost / values.quantity;
    
    try {
      await catFoodApi.addCatFood({
        brand: values.brand,
        type: values.type,
        quantity: values.quantity,
        units: values.units,
        cost_per_unit: costPerUnit,
        purchase_date: values.purchase_date,
      });
      
      toast({
        title: "Food Added",
        description: "Cat food has been added to inventory.",
      });
      
      foodForm.reset();
      setFoodDialogOpen(false);
      refetchFood();
      
    } catch (error: any) {
      toast({
        title: "Error Adding Food",
        description: error.message || "Failed to add cat food",
        variant: "destructive",
      });
    }
  };

  // Handle feeding form submission
  const onSubmitFeeding = async (values: z.infer<typeof feedingSchema>) => {
    try {
      await catFoodApi.addCatFeedingRecord({
        cat_id: values.cat_id,
        cat_food_id: values.cat_food_id,
        amount: values.amount,
        feeding_date: values.feeding_date,
      });
      
      toast({
        title: "Feeding Recorded",
        description: "Cat feeding record has been saved.",
      });
      
      feedingForm.reset();
      setFeedingDialogOpen(false);
      refetchFeedings();
      
    } catch (error: any) {
      toast({
        title: "Error Recording Feeding",
        description: error.message || "Failed to record feeding",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-meow-primary">Cat Food Tracker</h2>
        <div className="flex gap-4">
          <Dialog open={foodDialogOpen} onOpenChange={setFoodDialogOpen}>
            <DialogTrigger asChild>
              <Button>Add Food Purchase</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add Cat Food</DialogTitle>
                <DialogDescription>
                  Record a new cat food purchase to inventory.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...foodForm}>
                <form onSubmit={foodForm.handleSubmit(onSubmitFood)} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={foodForm.control}
                      name="brand"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Brand</FormLabel>
                          <FormControl>
                            <Input placeholder="Fancy Feast" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={foodForm.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Type</FormLabel>
                          <FormControl>
                            <Input placeholder="Chicken Paté" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={foodForm.control}
                      name="quantity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Quantity</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              min="1" 
                              placeholder="24" 
                              {...field}
                              onChange={(e) => field.onChange(parseInt(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={foodForm.control}
                      name="units"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Units</FormLabel>
                          <Select 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select unit type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="cans">Cans</SelectItem>
                              <SelectItem value="bags">Bags</SelectItem>
                              <SelectItem value="pounds">Pounds</SelectItem>
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
                      control={foodForm.control}
                      name="total_cost"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Total Cost ($)</FormLabel>
                          <FormControl>
                            <Input 
                              type="number" 
                              step="0.01" 
                              min="0" 
                              placeholder="18.99" 
                              {...field}
                              onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={foodForm.control}
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
                    <Button type="submit">Add to Inventory</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          
          <Dialog open={feedingDialogOpen} onOpenChange={setFeedingDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline">Record Feeding</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Record Cat Feeding</DialogTitle>
                <DialogDescription>
                  Log food given to a cat.
                </DialogDescription>
              </DialogHeader>
              
              <Form {...feedingForm}>
                <form onSubmit={feedingForm.handleSubmit(onSubmitFeeding)} className="space-y-4">
                  <FormField
                    control={feedingForm.control}
                    name="cat_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cat</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select cat" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {cats.map(cat => (
                              <SelectItem key={cat.id} value={cat.id}>{cat.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={feedingForm.control}
                    name="cat_food_id"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select food" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {foodInventory.map(food => (
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
                      control={feedingForm.control}
                      name="amount"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Amount (in portions of 1/4 can)</FormLabel>
                          <Select 
                            onValueChange={(value) => field.onChange(parseFloat(value))} 
                            value={field.value.toString()}
                          >
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select amount" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="0.25">1/4 can</SelectItem>
                              <SelectItem value="0.5">1/2 can</SelectItem>
                              <SelectItem value="0.75">3/4 can</SelectItem>
                              <SelectItem value="1">1 full can</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={feedingForm.control}
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
                    <Button type="submit">Record Feeding</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Food Inventory</CardTitle>
            <CardDescription>
              All cat food currently in inventory
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingFood ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : foodInventory.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Brand</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Quantity</TableHead>
                    <TableHead>Cost/Unit</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {foodInventory.map(food => (
                    <TableRow key={food.id}>
                      <TableCell>{food.brand}</TableCell>
                      <TableCell>{food.type}</TableCell>
                      <TableCell>{food.quantity} {food.units}</TableCell>
                      <TableCell>${food.cost_per_unit.toFixed(2)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No food in inventory yet. Add a purchase to get started.
              </div>
            )}
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Recent Feedings</CardTitle>
            <CardDescription>
              Recent cat feeding records
            </CardDescription>
          </CardHeader>
          <CardContent>
            {isLoadingFeedings ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : feedingRecords.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Cat</TableHead>
                    <TableHead>Food</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {feedingRecords.map(record => (
                    <TableRow key={record.id}>
                      <TableCell>{record.cat_name}</TableCell>
                      <TableCell>{record.food_brand} {record.food_type}</TableCell>
                      <TableCell>{record.amount === 0.25 ? '1/4' : record.amount === 0.5 ? '1/2' : record.amount === 0.75 ? '3/4' : '1'} can</TableCell>
                      <TableCell>{new Date(record.feeding_date).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-8 text-gray-500">
                No feeding records yet. Record a feeding to get started.
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CatFoodTracker;
