
import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { useToast } from '@/hooks/use-toast';
import { catFoodApi } from '@/services/catFoodService';
import { Cat, CatFood, CatFeedingRecord } from '@/types/finance';
import { format } from 'date-fns';
import { capitalizeWords } from '@/utils/stringUtils';

const CatFoodTracker: React.FC = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  // State for adding new cat food
  const [brand, setBrand] = useState('');
  const [type, setType] = useState('');
  const [quantity, setQuantity] = useState('');
  const [units, setUnits] = useState('cans');
  const [cost, setCost] = useState('');
  const [purchaseDate, setPurchaseDate] = useState('');
  
  // State for recording feeding
  const [selectedCatFood, setSelectedCatFood] = useState('');
  const [selectedCats, setSelectedCats] = useState<Record<string, boolean>>({});
  const [feedingAmount, setFeedingAmount] = useState('1');
  const [feedingDate, setFeedingDate] = useState('');
  
  // Fetch cat food data
  const { 
    data: catFoodItems, 
    isLoading: isCatFoodLoading 
  } = useQuery({
    queryKey: ['catFood'],
    queryFn: catFoodApi.getCatFood,
  });
  
  // Fetch cats data
  const {
    data: cats,
    isLoading: isCatsLoading,
  } = useQuery({
    queryKey: ['cats'],
    queryFn: catFoodApi.getCats,
  });
  
  // Fetch feeding records
  const {
    data: feedingRecords,
    isLoading: isFeedingRecordsLoading,
  } = useQuery({
    queryKey: ['catFeedingRecords'],
    queryFn: catFoodApi.getCatFeedingRecords,
  });
  
  // Add cat food mutation
  const addCatFoodMutation = useMutation({
    mutationFn: catFoodApi.addCatFood,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catFood'] });
      toast({
        title: 'Cat Food Added',
        description: 'New cat food item has been added successfully.',
      });
      
      // Reset form
      setBrand('');
      setType('');
      setQuantity('');
      setUnits('cans');
      setCost('');
      setPurchaseDate('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to add cat food: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Add feeding record mutation
  const addFeedingRecordMutation = useMutation({
    mutationFn: catFoodApi.addCatFeedingRecord,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['catFeedingRecords'] });
      toast({
        title: 'Feeding Recorded',
        description: 'Cat feeding has been recorded successfully.',
      });
      
      // Reset form
      setSelectedCatFood('');
      setSelectedCats({});
      setFeedingAmount('1');
      setFeedingDate('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: `Failed to record feeding: ${error.message}`,
        variant: 'destructive',
      });
    },
  });
  
  // Set default dates when component mounts
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    setPurchaseDate(today);
    setFeedingDate(today);
  }, []);
  
  // Handle adding new cat food
  const handleAddCatFood = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!brand || !type || !quantity || !units || !cost || !purchaseDate) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields.',
        variant: 'destructive',
      });
      return;
    }
    
    addCatFoodMutation.mutate({
      brand,
      type,
      quantity: Number(quantity),
      units,
      cost_per_unit: Number(cost),
      purchase_date: purchaseDate,
    });
  };
  
  // Handle recording feeding
  const handleRecordFeeding = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedCatIds = Object.entries(selectedCats)
      .filter(([_, isSelected]) => isSelected)
      .map(([catId]) => catId);
    
    if (!selectedCatFood || selectedCatIds.length === 0 || !feedingAmount || !feedingDate) {
      toast({
        title: 'Validation Error',
        description: 'Please select cat food, cats, and specify amount and date.',
        variant: 'destructive',
      });
      return;
    }
    
    // Create a feeding record for each selected cat
    for (const catId of selectedCatIds) {
      await addFeedingRecordMutation.mutateAsync({
        cat_id: catId,
        cat_food_id: selectedCatFood,
        amount: Number(feedingAmount) / selectedCatIds.length, // Divide equally among cats
        feeding_date: feedingDate,
      });
    }
  };
  
  const handleCatCheckboxChange = (catId: string, checked: boolean) => {
    setSelectedCats(prev => ({
      ...prev,
      [catId]: checked,
    }));
  };
  
  // Calculate cat food inventory
  const calculateInventory = () => {
    if (!catFoodItems || !feedingRecords) return [];
    
    return catFoodItems.map(food => {
      // Calculate how much has been used in feeding records
      const usedAmount = feedingRecords
        .filter(record => record.cat_food_id === food.id)
        .reduce((sum, record) => sum + record.amount, 0);
      
      // Calculate remaining quantity
      const remaining = food.quantity - usedAmount;
      
      return {
        ...food,
        remaining: Math.max(0, remaining),
        usedAmount,
      };
    });
  };
  
  const inventory = calculateInventory();
  
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle>Cat Food Tracker</CardTitle>
        <CardDescription>Manage cat food inventory and track feedings</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="inventory">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="inventory">Inventory</TabsTrigger>
            <TabsTrigger value="add">Add Cat Food</TabsTrigger>
            <TabsTrigger value="feeding">Record Feeding</TabsTrigger>
          </TabsList>
          
          {/* Inventory Tab */}
          <TabsContent value="inventory">
            <div className="space-y-4">
              <h3 className="text-lg font-medium">Current Inventory</h3>
              {isCatFoodLoading || isFeedingRecordsLoading ? (
                <p>Loading inventory...</p>
              ) : inventory.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Brand</TableHead>
                        <TableHead>Type</TableHead>
                        <TableHead>Initial Quantity</TableHead>
                        <TableHead>Used</TableHead>
                        <TableHead>Remaining</TableHead>
                        <TableHead>Cost Per Unit</TableHead>
                        <TableHead>Purchase Date</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {inventory.map((item) => (
                        <TableRow key={item.id}>
                          <TableCell className="font-medium">{capitalizeWords(item.brand)}</TableCell>
                          <TableCell>{capitalizeWords(item.type)}</TableCell>
                          <TableCell>{item.quantity} {item.units}</TableCell>
                          <TableCell>{item.usedAmount.toFixed(2)} {item.units}</TableCell>
                          <TableCell>{item.remaining.toFixed(2)} {item.units}</TableCell>
                          <TableCell>${item.cost_per_unit.toFixed(2)}</TableCell>
                          <TableCell>{format(new Date(item.purchase_date), 'MMM d, yyyy')}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p>No cat food in inventory. Add some using the "Add Cat Food" tab.</p>
              )}
              
              <h3 className="text-lg font-medium mt-6">Recent Feedings</h3>
              {isFeedingRecordsLoading ? (
                <p>Loading feeding records...</p>
              ) : feedingRecords && feedingRecords.length > 0 ? (
                <div className="border rounded-md">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Date</TableHead>
                        <TableHead>Cat</TableHead>
                        <TableHead>Food</TableHead>
                        <TableHead>Amount</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {feedingRecords.slice(0, 10).map((record) => (
                        <TableRow key={record.id}>
                          <TableCell>{format(new Date(record.feeding_date), 'MMM d, yyyy')}</TableCell>
                          <TableCell>{record.cat_name}</TableCell>
                          <TableCell>{record.food_brand ? `${capitalizeWords(record.food_brand)} - ${capitalizeWords(record.food_type || '')}` : 'Unknown'}</TableCell>
                          <TableCell>{record.amount} units</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ) : (
                <p>No feeding records yet. Record feedings using the "Record Feeding" tab.</p>
              )}
            </div>
          </TabsContent>
          
          {/* Add Cat Food Tab */}
          <TabsContent value="add">
            <form onSubmit={handleAddCatFood} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="brand">Brand</Label>
                  <Input 
                    id="brand" 
                    value={brand} 
                    onChange={(e) => setBrand(e.target.value)} 
                    placeholder="e.g., Purina, Fancy Feast" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="type">Type</Label>
                  <Input 
                    id="type" 
                    value={type} 
                    onChange={(e) => setType(e.target.value)} 
                    placeholder="e.g., Wet, Dry, Kitten" 
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input 
                    id="quantity" 
                    type="number" 
                    value={quantity} 
                    onChange={(e) => setQuantity(e.target.value)} 
                    placeholder="e.g., 24" 
                    min="1" 
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="units">Units</Label>
                  <Select value={units} onValueChange={setUnits}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select units" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cans">Cans</SelectItem>
                      <SelectItem value="pounds">Pounds</SelectItem>
                      <SelectItem value="boxes">Boxes</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="cost">Cost Per Unit ($)</Label>
                  <Input 
                    id="cost" 
                    type="number" 
                    value={cost} 
                    onChange={(e) => setCost(e.target.value)} 
                    placeholder="e.g., 0.75" 
                    min="0.01" 
                    step="0.01" 
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="purchase-date">Purchase Date</Label>
                <Input 
                  id="purchase-date" 
                  type="date" 
                  value={purchaseDate} 
                  onChange={(e) => setPurchaseDate(e.target.value)} 
                />
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={addCatFoodMutation.isPending}
              >
                {addCatFoodMutation.isPending ? 'Adding...' : 'Add Cat Food'}
              </Button>
            </form>
          </TabsContent>
          
          {/* Record Feeding Tab */}
          <TabsContent value="feeding">
            <form onSubmit={handleRecordFeeding} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="cat-food">Select Cat Food</Label>
                <Select 
                  value={selectedCatFood} 
                  onValueChange={setSelectedCatFood}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select cat food" />
                  </SelectTrigger>
                  <SelectContent>
                    {isCatFoodLoading ? (
                      <SelectItem value="loading" disabled>Loading...</SelectItem>
                    ) : catFoodItems && catFoodItems.length > 0 ? (
                      catFoodItems.map((food) => (
                        <SelectItem key={food.id} value={food.id}>
                          {capitalizeWords(food.brand)} - {capitalizeWords(food.type)} 
                          ({inventory.find(i => i.id === food.id)?.remaining.toFixed(1) || 0} {food.units} left)
                        </SelectItem>
                      ))
                    ) : (
                      <SelectItem value="none" disabled>No cat food available</SelectItem>
                    )}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label>Select Cats</Label>
                <div className="border rounded-md p-4 space-y-2 max-h-40 overflow-y-auto">
                  {isCatsLoading ? (
                    <p>Loading cats...</p>
                  ) : cats && cats.length > 0 ? (
                    cats.map((cat) => (
                      <div key={cat.id} className="flex items-center space-x-2">
                        <Checkbox 
                          id={`cat-${cat.id}`} 
                          checked={selectedCats[cat.id] || false}
                          onCheckedChange={(checked) => handleCatCheckboxChange(cat.id, Boolean(checked))}
                        />
                        <Label htmlFor={`cat-${cat.id}`} className="cursor-pointer">
                          {cat.name}
                        </Label>
                      </div>
                    ))
                  ) : (
                    <p>No cats available</p>
                  )}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="feeding-amount">Amount (cans)</Label>
                  <Input 
                    id="feeding-amount" 
                    type="number" 
                    value={feedingAmount} 
                    onChange={(e) => setFeedingAmount(e.target.value)} 
                    placeholder="e.g., 1" 
                    min="0.25" 
                    step="0.25" 
                  />
                  <p className="text-xs text-gray-500">Use 0.25 for quarter can, 0.5 for half can, etc.</p>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="feeding-date">Feeding Date</Label>
                  <Input 
                    id="feeding-date" 
                    type="date" 
                    value={feedingDate} 
                    onChange={(e) => setFeedingDate(e.target.value)} 
                  />
                </div>
              </div>
              
              <Button 
                type="submit" 
                className="w-full"
                disabled={addFeedingRecordMutation.isPending}
              >
                {addFeedingRecordMutation.isPending ? 'Recording...' : 'Record Feeding'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default CatFoodTracker;
