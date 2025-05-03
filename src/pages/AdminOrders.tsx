
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Package, Search, Check, X, AlertTriangle, Clock, TruckIcon,
  CheckCircle, XCircle, Loader, ListFilter, Calendar
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import SEO from '@/components/SEO';
import { formatDistanceToNow } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface OrderItem {
  id: string;
  order_id: string;
  supply_id: string;
  quantity: number;
  notes: string | null;
  created_at: string;
  supply: {
    id: string;
    name: string;
    category: string;
    unit: string;
  };
}

interface Order {
  id: string;
  foster_id: string;
  status: string;
  notes: string | null;
  tracking_number: string | null;
  created_at: string;
  updated_at: string;
  approved_at: string | null;
  approved_by: string | null;
  rejected_reason: string | null;
  items: OrderItem[];
  foster: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    avatar_url: string | null;
  };
}

const AdminOrders = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [isUpdateOrderDialogOpen, setIsUpdateOrderDialogOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [trackingNumber, setTrackingNumber] = useState('');
  const [statusUpdate, setStatusUpdate] = useState('');
  const [rejectedReason, setRejectedReason] = useState('');
  const [additionalNotes, setAdditionalNotes] = useState('');
  
  // Fetch orders
  const { data: orders, isLoading } = useQuery({
    queryKey: ['foster-orders'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('supply_orders')
        .select(`
          *,
          items:supply_order_items(
            *,
            supply:supply_id(id, name, category, unit)
          ),
          foster:foster_id(id, first_name, last_name, email, avatar_url)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as Order[];
    }
  });

  // Update order mutation
  const updateOrderMutation = useMutation({
    mutationFn: async ({ orderId, status, trackingNumber, rejectedReason, notes }: { 
      orderId: string; 
      status: string; 
      trackingNumber?: string;
      rejectedReason?: string;
      notes?: string;
    }) => {
      const updateData: any = {
        status,
        updated_at: new Date().toISOString(),
      };
      
      if (status === 'Approved') {
        updateData.approved_at = new Date().toISOString();
        updateData.approved_by = (await getSupabaseClient().auth.getUser()).data.user?.id;
      }
      
      if (trackingNumber) {
        updateData.tracking_number = trackingNumber;
      }
      
      if (rejectedReason) {
        updateData.rejected_reason = rejectedReason;
      }
      
      if (notes) {
        updateData.notes = notes;
      }
      
      const { data, error } = await supabase
        .from('supply_orders')
        .update(updateData)
        .eq('id', orderId)
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'Order updated successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['foster-orders'] });
      setIsUpdateOrderDialogOpen(false);
      resetFormState();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update order',
        variant: 'destructive',
      });
    }
  });

  const resetFormState = () => {
    setSelectedOrder(null);
    setTrackingNumber('');
    setStatusUpdate('');
    setRejectedReason('');
    setAdditionalNotes('');
  };

  const handleOpenUpdateDialog = (order: Order) => {
    setSelectedOrder(order);
    setStatusUpdate(order.status);
    setTrackingNumber(order.tracking_number || '');
    setRejectedReason(order.rejected_reason || '');
    setAdditionalNotes(order.notes || '');
    setIsUpdateOrderDialogOpen(true);
  };

  const handleUpdateOrder = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedOrder || !statusUpdate) return;
    
    updateOrderMutation.mutate({
      orderId: selectedOrder.id,
      status: statusUpdate,
      trackingNumber: trackingNumber || undefined,
      rejectedReason: statusUpdate === 'Rejected' ? rejectedReason : undefined,
      notes: additionalNotes || undefined,
    });
  };

  // Filter orders based on search and status
  const filteredOrders = React.useMemo(() => {
    if (!orders) return [];
    
    return orders.filter(order => {
      // Filter by status
      if (statusFilter !== 'all' && order.status !== statusFilter) {
        return false;
      }
      
      // Filter by search query
      if (searchQuery) {
        const query = searchQuery.toLowerCase();
        const fosterName = `${order.foster.first_name} ${order.foster.last_name}`.toLowerCase();
        
        // Check if search matches foster name or tracking number
        return fosterName.includes(query) || 
               (order.tracking_number && order.tracking_number.toLowerCase().includes(query));
      }
      
      return true;
    });
  }, [orders, searchQuery, statusFilter]);

  // Count orders by status
  const statusCounts = React.useMemo(() => {
    if (!orders) return { pending: 0, approved: 0, shipped: 0, delivered: 0, rejected: 0 };
    
    return orders.reduce((counts, order) => {
      counts[order.status.toLowerCase()] = (counts[order.status.toLowerCase()] || 0) + 1;
      return counts;
    }, {} as Record<string, number>);
  }, [orders]);

  // Get badge color based on status
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Pending':
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
      case 'Approved':
        return <Badge variant="outline" className="bg-green-100 text-green-800 border-green-200">Approved</Badge>;
      case 'Shipped':
        return <Badge variant="outline" className="bg-blue-100 text-blue-800 border-blue-200">Shipped</Badge>;
      case 'Delivered':
        return <Badge variant="outline" className="bg-purple-100 text-purple-800 border-purple-200">Delivered</Badge>;
      case 'Rejected':
        return <Badge variant="outline" className="bg-red-100 text-red-800 border-red-200">Rejected</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <AdminLayout title="Supply Orders">
      <SEO title="Supply Orders | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Supply Orders</h1>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search orders..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Select
              value={statusFilter}
              onValueChange={setStatusFilter}
            >
              <SelectTrigger className="w-40">
                <ListFilter className="h-4 w-4 mr-2" />
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Orders</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Approved">Approved</SelectItem>
                <SelectItem value="Shipped">Shipped</SelectItem>
                <SelectItem value="Delivered">Delivered</SelectItem>
                <SelectItem value="Rejected">Rejected</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
          <Card onClick={() => setStatusFilter('all')} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-full bg-gray-100">
                  <Package className="h-5 w-5 text-gray-700" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">All Orders</p>
                  <p className="text-xl font-semibold">{orders?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card onClick={() => setStatusFilter('Pending')} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-full bg-yellow-100">
                  <Clock className="h-5 w-5 text-yellow-700" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Pending</p>
                  <p className="text-xl font-semibold">{statusCounts.pending || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card onClick={() => setStatusFilter('Approved')} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-full bg-green-100">
                  <Check className="h-5 w-5 text-green-700" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Approved</p>
                  <p className="text-xl font-semibold">{statusCounts.approved || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card onClick={() => setStatusFilter('Shipped')} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-full bg-blue-100">
                  <TruckIcon className="h-5 w-5 text-blue-700" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Shipped</p>
                  <p className="text-xl font-semibold">{statusCounts.shipped || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card onClick={() => setStatusFilter('Rejected')} className="cursor-pointer hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="p-2 rounded-full bg-red-100">
                  <X className="h-5 w-5 text-red-700" />
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Rejected</p>
                  <p className="text-xl font-semibold">{statusCounts.rejected || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : filteredOrders.length > 0 ? (
          <div className="space-y-6">
            {filteredOrders.map(order => (
              <Card key={order.id} className="overflow-hidden">
                <CardHeader className="pb-2 border-b bg-gray-50">
                  <div className="flex flex-col md:flex-row md:items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-10 w-10">
                        <AvatarImage src={order.foster.avatar_url || ''} alt={`${order.foster.first_name} ${order.foster.last_name}`} />
                        <AvatarFallback>
                          {`${order.foster.first_name.charAt(0)}${order.foster.last_name.charAt(0)}`}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-medium">
                          Order from {order.foster.first_name} {order.foster.last_name}
                        </h3>
                        <p className="text-sm text-gray-500">
                          {formatDistanceToNow(new Date(order.created_at), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4 mt-2 md:mt-0">
                      {getStatusBadge(order.status)}
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleOpenUpdateDialog(order)}
                      >
                        Update Status
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-4">
                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium mb-2">Order Items</h4>
                      <div className="border rounded-md overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Item</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                              <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</th>
                              <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Notes</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white divide-y divide-gray-200">
                            {order.items.map(item => (
                              <tr key={item.id}>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{item.supply.name}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm">{item.supply.category}</td>
                                <td className="px-4 py-2 whitespace-nowrap text-sm text-right">
                                  {item.quantity} {item.supply.unit}
                                </td>
                                <td className="px-4 py-2 text-sm">{item.notes || '-'}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                    
                    {(order.tracking_number || order.notes || order.rejected_reason) && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                        {order.tracking_number && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Tracking Number</h4>
                            <p className="text-sm p-2 bg-gray-50 rounded">{order.tracking_number}</p>
                          </div>
                        )}
                        
                        {order.notes && (
                          <div>
                            <h4 className="text-sm font-medium mb-1">Admin Notes</h4>
                            <p className="text-sm p-2 bg-gray-50 rounded">{order.notes}</p>
                          </div>
                        )}
                        
                        {order.rejected_reason && (
                          <div className="col-span-full">
                            <h4 className="text-sm font-medium mb-1 text-red-600">Rejection Reason</h4>
                            <p className="text-sm p-2 bg-red-50 text-red-700 rounded">{order.rejected_reason}</p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="p-10 text-center">
            <Package className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-700 mb-2">No orders found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your filters to see more results'
                : 'Foster parents haven\'t placed any supply orders yet.'}
            </p>
            {(searchQuery || statusFilter !== 'all') && (
              <Button
                variant="outline"
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                }}
              >
                Clear Filters
              </Button>
            )}
          </Card>
        )}
      </div>
      
      {/* Update Order Dialog */}
      <Dialog open={isUpdateOrderDialogOpen} onOpenChange={setIsUpdateOrderDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Package className="mr-2 h-5 w-5" />
              Update Order Status
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleUpdateOrder}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={statusUpdate}
                  onValueChange={setStatusUpdate}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Approved">Approved</SelectItem>
                    <SelectItem value="Shipped">Shipped</SelectItem>
                    <SelectItem value="Delivered">Delivered</SelectItem>
                    <SelectItem value="Rejected">Rejected</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              {statusUpdate === 'Shipped' && (
                <div className="grid gap-2">
                  <Label htmlFor="tracking">Tracking Number</Label>
                  <Input
                    id="tracking"
                    value={trackingNumber}
                    onChange={(e) => setTrackingNumber(e.target.value)}
                    placeholder="Enter tracking number"
                  />
                </div>
              )}
              
              {statusUpdate === 'Rejected' && (
                <div className="grid gap-2">
                  <Label htmlFor="rejection_reason">Rejection Reason</Label>
                  <Textarea
                    id="rejection_reason"
                    value={rejectedReason}
                    onChange={(e) => setRejectedReason(e.target.value)}
                    placeholder="Enter reason for rejection"
                    rows={3}
                    required={statusUpdate === 'Rejected'}
                  />
                </div>
              )}
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <Textarea
                  id="notes"
                  value={additionalNotes}
                  onChange={(e) => setAdditionalNotes(e.target.value)}
                  placeholder="Any additional information"
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setIsUpdateOrderDialogOpen(false);
                  resetFormState();
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={updateOrderMutation.isPending}
              >
                {updateOrderMutation.isPending ? 'Updating...' : 'Update Order'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminOrders;
