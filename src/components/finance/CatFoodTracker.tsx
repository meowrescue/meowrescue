
import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Package, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { CatFood } from '@/types/finance';

interface CatFoodTrackerProps {
  isAdmin?: boolean;
}

const CatFoodTracker: React.FC<CatFoodTrackerProps> = ({ isAdmin = false }) => {
  const [limit, setLimit] = useState(5);
  
  const { data: catFood, isLoading, error } = useQuery({
    queryKey: ['cat-food-recent'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cat_food')
        .select('*')
        .order('purchase_date', { ascending: false })
        .limit(limit);
        
      if (error) throw error;
      return data as CatFood[];
    }
  });
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Package className="mr-2 h-5 w-5" />
          Cat Food Inventory
        </CardTitle>
      </CardHeader>
      <CardContent>
        {error ? (
          <div className="py-4 text-center">
            <AlertCircle className="h-10 w-10 text-red-500 mx-auto mb-2" />
            <p className="text-red-500">Error loading cat food data</p>
          </div>
        ) : isLoading ? (
          <div className="py-8 text-center">
            <div className="animate-spin h-8 w-8 border-2 border-meow-primary border-t-transparent rounded-full mx-auto"></div>
            <p className="mt-2 text-sm text-gray-500">Loading inventory data...</p>
          </div>
        ) : catFood && catFood.length > 0 ? (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Brand</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead className="text-right">Cost</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {catFood.map((food) => (
                  <TableRow key={food.id}>
                    <TableCell>{food.brand}</TableCell>
                    <TableCell>{food.type}</TableCell>
                    <TableCell>{food.quantity} {food.units}</TableCell>
                    <TableCell className="text-right">${parseFloat(food.cost_per_unit.toString()).toFixed(2)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {catFood.length === limit && (
              <Button 
                variant="ghost" 
                className="mt-4 w-full text-sm" 
                onClick={() => setLimit(limit + 5)}
              >
                Load more
              </Button>
            )}
          </>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No cat food entries found</p>
          </div>
        )}
        
        {isAdmin && (
          <div className="mt-4 flex justify-end">
            <Link to="/admin/supplies">
              <Button className="flex items-center gap-2" size="sm">
                <Package size={16} />
                <span>Manage Supplies</span>
              </Button>
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CatFoodTracker;
