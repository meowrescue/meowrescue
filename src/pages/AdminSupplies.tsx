
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import { Plus, Pencil, Trash2 } from 'lucide-react';

// Define type for supply
interface Supply {
  id: string;
  name: string;
  description?: string;
  category: string;
  unit: string;
  quantity: number;
  minimum_quantity: number;
  created_at: string;
  updated_at: string;
}

// Define type for new supply
interface NewSupply {
  name: string;
  description: string;
  category: string;
  unit: string;
  minimumQuantity: number;
}

const AdminSupplies = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isAddSupplyDialogOpen, setIsAddSupplyDialogOpen] = useState(false);
  const [newSupply, setNewSupply] = useState<NewSupply>({
    name: '',
    description: '',
    category: '',
    unit: '',
    minimumQuantity: 0
  });

  // Fetch supplies
  const { data: supplies, isLoading, error } = useQuery({
    queryKey: ['admin-supplies'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('supplies')
        .select('*')
        .order('name', { ascending: true });

      if (error) throw error;
      return data as Supply[];
    }
  });

  // Add supply mutation
  const addSupplyMutation = useMutation({
    mutationFn: async (supplyData: NewSupply) => {
      const { data, error } = await getSupabaseClient().rpc('add_supply', {
        p_name: supplyData.name,
        p_description: supplyData.description,
        p_category: supplyData.category,
        p_unit: supplyData.unit,
        p_minimum_quantity: supplyData.minimumQuantity
      });

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: "Supply Added",
        description: "New supply item created successfully."
      });
      queryClient.invalidateQueries({ queryKey: ['admin-supplies'] });
      setIsAddSupplyDialogOpen(false);
      // Reset form
      setNewSupply({
        name: '',
        description: '',
        category: '',
        unit: '',
        minimumQuantity: 0
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add supply",
        variant: "destructive"
      });
    }
  });

  const handleAddSupply = () => {
    addSupplyMutation.mutate(newSupply);
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error loading supplies</div>;

  return (
    <AdminLayout title="Supplies Management">
      <div className="container mx-auto py-10">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Supplies Inventory</h1>
          <Button onClick={() => setIsAddSupplyDialogOpen(true)}>
            <Plus className="mr-2 h-4 w-4" /> Add Supply
          </Button>
        </div>

        <Card>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Quantity</TableHead>
                  <TableHead>Unit</TableHead>
                  <TableHead>Min. Quantity</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {supplies?.map((supply) => (
                  <TableRow key={supply.id}>
                    <TableCell>{supply.name}</TableCell>
                    <TableCell>{supply.category}</TableCell>
                    <TableCell>{supply.quantity}</TableCell>
                    <TableCell>{supply.unit}</TableCell>
                    <TableCell>{supply.minimum_quantity}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="outline" size="icon" title="Edit">
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button variant="destructive" size="icon" title="Delete">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {/* Add Supply Dialog */}
        <Dialog open={isAddSupplyDialogOpen} onOpenChange={setIsAddSupplyDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Supply</DialogTitle>
              <DialogDescription>
                Create a new supply item for tracking inventory.
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="name" className="text-right">Name</label>
                <Input 
                  id="name"
                  value={newSupply.name}
                  onChange={(e) => setNewSupply({...newSupply, name: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="description" className="text-right">Description</label>
                <Input 
                  id="description"
                  value={newSupply.description}
                  onChange={(e) => setNewSupply({...newSupply, description: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="category" className="text-right">Category</label>
                <Select 
                  value={newSupply.category} 
                  onValueChange={(value) => setNewSupply({...newSupply, category: value})}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Select Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medical">Medical</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="hygiene">Hygiene</SelectItem>
                    <SelectItem value="equipment">Equipment</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="unit" className="text-right">Unit</label>
                <Input 
                  id="unit"
                  value={newSupply.unit}
                  onChange={(e) => setNewSupply({...newSupply, unit: e.target.value})}
                  className="col-span-3" 
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <label htmlFor="minimumQuantity" className="text-right">Minimum Quantity</label>
                <Input 
                  id="minimumQuantity"
                  type="number"
                  value={newSupply.minimumQuantity}
                  onChange={(e) => setNewSupply({...newSupply, minimumQuantity: Number(e.target.value)})}
                  className="col-span-3" 
                />
              </div>
            </div>

            <DialogFooter>
              <Button type="submit" onClick={handleAddSupply}>Add Supply</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </AdminLayout>
  );
};

export default AdminSupplies;
