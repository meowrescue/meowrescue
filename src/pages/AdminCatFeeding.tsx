
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { AdminLayout } from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Form, FormField, FormItem, FormLabel, FormControl } from '@/components/ui/form';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { CatFeedingRecord, Cat, CatFood } from '@/types/finance';

interface FeedingFormData {
  catFoodId: string;
  brand: string;
  type: string;
  quantity: number;
  catsToFeed: string[];
}

const AdminCatFeeding = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Form
  const form = useForm<FeedingFormData>({
    defaultValues: {
      brand: '',
      type: '',
      quantity: 1,
      catsToFeed: [],
    },
  });

  // Fetch active cats
  const { data: cats, isLoading: isLoadingCats } = useQuery({
    queryKey: ['admin-active-cats'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cats')
          .select('id, name, status')
          .in('status', ['Available', 'Foster']);
          
        if (error) throw error;
        return data as Cat[];
      } catch (error: any) {
        console.error("Error fetching cats:", error);
        toast({
          title: "Error",
          description: "Failed to load cats",
          variant: "destructive",
        });
        return [] as Cat[];
      }
    },
  });

  // Fetch cat food options
  const { data: catFoods, isLoading: isLoadingCatFoods } = useQuery({
    queryKey: ['admin-cat-foods'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cat_food')
          .select('*')
          .order('brand', { ascending: true });
          
        if (error) throw error;
        return data as CatFood[];
      } catch (error: any) {
        console.error("Error fetching cat food:", error);
        toast({
          title: "Error",
          description: "Failed to load cat food options",
          variant: "destructive",
        });
        return [] as CatFood[];
      }
    },
  });

  const handleAddCatFood = async (data: { brand: string; type: string; quantity: number }) => {
    try {
      setIsSubmitting(true);
      
      // Add new cat food
      const { data: newFood, error } = await supabase.rpc('add_cat_food', {
        p_brand: data.brand,
        p_type: data.type,
        p_quantity: data.quantity,
        p_units: 'cans',
        p_cost_per_unit: 0, // Default value
        p_purchase_date: new Date().toISOString(),
      });
      
      if (error) throw error;
      
      toast({
        title: "Cat food added",
        description: `Added ${data.quantity} cans of ${data.brand} ${data.type}`,
      });
      
      return newFood;
    } catch (error: any) {
      console.error("Error adding cat food:", error);
      toast({
        title: "Error",
        description: "Failed to add cat food",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFeedCats = async (data: FeedingFormData) => {
    try {
      setIsSubmitting(true);
      
      // First add the cat food
      const catFood = await handleAddCatFood({
        brand: data.brand,
        type: data.type,
        quantity: data.quantity,
      });
      
      if (!catFood) return;
      
      // Then add feeding records for each selected cat
      const feedingPromises = data.catsToFeed.map(async (catId) => {
        return supabase.rpc('add_cat_feeding_record', {
          p_cat_id: catId,
          p_cat_food_id: catFood.id,
          p_amount: 1, // Default amount per cat
          p_feeding_date: new Date().toISOString(),
        });
      });
      
      await Promise.all(feedingPromises);
      
      toast({
        title: "Cats fed successfully",
        description: `${data.catsToFeed.length} cats have been fed`,
      });
      
      // Reset form
      form.reset({
        brand: '',
        type: '',
        quantity: 1,
        catsToFeed: [],
      });
    } catch (error: any) {
      console.error("Error feeding cats:", error);
      toast({
        title: "Error",
        description: "Failed to record cat feeding",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const onSubmit = (data: FeedingFormData) => {
    if (data.catsToFeed.length === 0) {
      toast({
        title: "No cats selected",
        description: "Please select at least one cat to feed",
        variant: "destructive",
      });
      return;
    }
    
    handleFeedCats(data);
  };

  return (
    <AdminLayout title="Cat Feeding">
      <SEO title="Cat Feeding | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <h1 className="text-3xl font-bold text-meow-primary mb-6">Cat Feeding Records</h1>
        
        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Add New Feeding</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food Brand</FormLabel>
                        <FormControl>
                          <Input placeholder="Brand name" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Food Type</FormLabel>
                        <FormControl>
                          <Input placeholder="Food type" {...field} required />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="quantity"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of Cans</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            min={1} 
                            {...field}
                            onChange={e => field.onChange(parseInt(e.target.value))}
                            required 
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div>
                  <FormLabel className="block mb-2">Select Cats to Feed</FormLabel>
                  {isLoadingCats ? (
                    <div className="text-center py-4">Loading cats...</div>
                  ) : cats && cats.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                      {cats.map((cat) => (
                        <FormField
                          key={cat.id}
                          control={form.control}
                          name="catsToFeed"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-center space-x-2 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(cat.id)}
                                  onCheckedChange={(checked) => {
                                    const currentValue = [...(field.value || [])];
                                    if (checked) {
                                      field.onChange([...currentValue, cat.id]);
                                    } else {
                                      field.onChange(currentValue.filter(id => id !== cat.id));
                                    }
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="cursor-pointer">
                                {cat.name} ({cat.status})
                              </FormLabel>
                            </FormItem>
                          )}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-4 bg-gray-50 rounded-lg">
                      <p>No active cats found.</p>
                    </div>
                  )}
                </div>
                
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Saving..." : "Record Feeding"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
        
        {/* We can add history of feedings here in the future */}
      </div>
    </AdminLayout>
  );
};

export default AdminCatFeeding;
