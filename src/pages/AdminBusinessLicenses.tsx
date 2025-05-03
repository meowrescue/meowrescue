
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/supabase/client';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Clipboard, FileText, Plus, Search, Calendar, Info, 
  AlertTriangle, Trash2, Edit, Download, Upload
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import SEO from '@/components/SEO';
import ImageUploader from '@/components/ImageUploader';
import { format } from 'date-fns';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface BusinessLicense {
  id: string;
  license_type: string;
  license_number: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date: string | null;
  document_id: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

const AdminBusinessLicenses = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState<BusinessLicense | null>(null);
  
  const [formData, setFormData] = useState({
    license_type: '',
    license_number: '',
    issuing_authority: '',
    issue_date: '',
    expiry_date: '',
    notes: '',
    document_url: '',
  });

  // Fetch licenses
  const { data: licenses, isLoading } = useQuery({
    queryKey: ['business-licenses'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('business_licenses')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as BusinessLicense[];
    }
  });

  // Add license mutation
  const addLicenseMutation = useMutation({
    mutationFn: async (license: typeof formData) => {
      const { data, error } = await getSupabaseClient()
        .from('business_licenses')
        .insert([{
          license_type: license.license_type,
          license_number: license.license_number,
          issuing_authority: license.issuing_authority,
          issue_date: license.issue_date,
          expiry_date: license.expiry_date || null,
          notes: license.notes || null,
        }])
        .select();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'License added successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['business-licenses'] });
      setIsAddDialogOpen(false);
      resetForm();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add license',
        variant: 'destructive',
      });
    }
  });

  // Delete license mutation
  const deleteLicenseMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await getSupabaseClient()
        .from('business_licenses')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      toast({
        title: 'Success',
        description: 'License deleted successfully',
      });
      queryClient.invalidateQueries({ queryKey: ['business-licenses'] });
      setIsDeleteDialogOpen(false);
      setSelectedLicense(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete license',
        variant: 'destructive',
      });
    }
  });

  const resetForm = () => {
    setFormData({
      license_type: '',
      license_number: '',
      issuing_authority: '',
      issue_date: '',
      expiry_date: '',
      notes: '',
      document_url: '',
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    addLicenseMutation.mutate(formData);
  };

  const handleDeleteLicense = () => {
    if (selectedLicense) {
      deleteLicenseMutation.mutate(selectedLicense.id);
    }
  };

  // Filter licenses based on search query
  const filteredLicenses = licenses?.filter(license => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      license.license_type.toLowerCase().includes(query) ||
      license.license_number.toLowerCase().includes(query) ||
      license.issuing_authority.toLowerCase().includes(query) ||
      (license.notes && license.notes.toLowerCase().includes(query))
    );
  });

  // Check for soon-to-expire licenses (within 30 days)
  const soonToExpire = licenses?.filter(license => {
    if (!license.expiry_date) return false;
    
    const expiryDate = new Date(license.expiry_date);
    const today = new Date();
    const differenceInDays = Math.ceil((expiryDate.getTime() - today.getTime()) / (1000 * 3600 * 24));
    
    return differenceInDays > 0 && differenceInDays <= 30;
  });

  // Check for expired licenses
  const expired = licenses?.filter(license => {
    if (!license.expiry_date) return false;
    
    const expiryDate = new Date(license.expiry_date);
    const today = new Date();
    
    return expiryDate < today;
  });

  return (
    <AdminLayout title="Business Licenses">
      <SEO title="Business Licenses | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Business Licenses</h1>
          
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search licenses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
            <Button onClick={() => setIsAddDialogOpen(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add License
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-blue-100 text-blue-600">
                  <Clipboard className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Total Licenses</p>
                  <p className="text-xl font-semibold">{licenses?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-amber-100 text-amber-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                  <p className="text-xl font-semibold">{soonToExpire?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Expired</p>
                  <p className="text-xl font-semibold">{expired?.length || 0}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : (
          <>
            {soonToExpire && soonToExpire.length > 0 && (
              <Card className="mb-6 border-amber-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-amber-700 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Licenses Expiring Soon
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {soonToExpire.map(license => {
                      const daysLeft = Math.ceil(
                        (new Date(license.expiry_date!).getTime() - new Date().getTime()) / (1000 * 3600 * 24)
                      );
                      
                      return (
                        <div key={license.id} className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{license.license_type}</h3>
                              <p className="text-sm text-gray-600">
                                License #{license.license_number} • {license.issuing_authority}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-amber-700 font-medium">Expires in {daysLeft} days</p>
                              <p className="text-sm text-gray-600">
                                {license.expiry_date && format(new Date(license.expiry_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
            
            {expired && expired.length > 0 && (
              <Card className="mb-6 border-red-200">
                <CardHeader className="pb-2">
                  <CardTitle className="text-red-700 flex items-center">
                    <AlertTriangle className="h-5 w-5 mr-2" />
                    Expired Licenses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {expired.map(license => {
                      const daysPast = Math.ceil(
                        (new Date().getTime() - new Date(license.expiry_date!).getTime()) / (1000 * 3600 * 24)
                      );
                      
                      return (
                        <div key={license.id} className="p-4 bg-red-50 rounded-lg border border-red-200">
                          <div className="flex justify-between">
                            <div>
                              <h3 className="font-medium">{license.license_type}</h3>
                              <p className="text-sm text-gray-600">
                                License #{license.license_number} • {license.issuing_authority}
                              </p>
                            </div>
                            <div className="text-right">
                              <p className="text-red-700 font-medium">Expired {daysPast} days ago</p>
                              <p className="text-sm text-gray-600">
                                {license.expiry_date && format(new Date(license.expiry_date), 'MMM d, yyyy')}
                              </p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clipboard className="mr-2 h-5 w-5" />
                  All Licenses
                </CardTitle>
              </CardHeader>
              <CardContent>
                {filteredLicenses && filteredLicenses.length > 0 ? (
                  <div className="space-y-6">
                    {filteredLicenses.map(license => (
                      <div key={license.id} className="p-4 bg-white rounded-lg border border-gray-200 shadow-sm">
                        <div className="flex flex-col md:flex-row justify-between">
                          <div>
                            <h3 className="font-medium text-lg">{license.license_type}</h3>
                            <p className="text-gray-600">License #{license.license_number}</p>
                            <p className="text-sm text-gray-500">Issued by: {license.issuing_authority}</p>
                            <div className="flex gap-4 text-sm text-gray-500 mt-2">
                              <span className="flex items-center">
                                <Calendar className="h-4 w-4 mr-1" />
                                Issued: {format(new Date(license.issue_date), 'MMM d, yyyy')}
                              </span>
                              {license.expiry_date && (
                                <span className="flex items-center">
                                  <Calendar className="h-4 w-4 mr-1" />
                                  Expires: {format(new Date(license.expiry_date), 'MMM d, yyyy')}
                                </span>
                              )}
                            </div>
                            {license.notes && (
                              <div className="mt-2">
                                <p className="text-sm text-gray-600">{license.notes}</p>
                              </div>
                            )}
                          </div>
                          <div className="mt-4 md:mt-0 md:ml-4 flex md:flex-col items-center gap-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4 mr-2" />
                              Edit
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                              onClick={() => {
                                setSelectedLicense(license);
                                setIsDeleteDialogOpen(true);
                              }}
                            >
                              <Trash2 className="h-4 w-4 mr-2" />
                              Delete
                            </Button>
                            {license.document_id && (
                              <Button variant="outline" size="sm">
                                <Download className="h-4 w-4 mr-2" />
                                Download
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <Clipboard className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-700 mb-2">No licenses found</h3>
                    <p className="text-gray-500 mb-6">Add your business licenses to keep track of them.</p>
                    <Button onClick={() => setIsAddDialogOpen(true)}>
                      <Plus className="mr-2 h-4 w-4" />
                      Add License
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </>
        )}
      </div>
      
      {/* Add License Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-xl">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <Plus className="mr-2 h-5 w-5" />
              Add Business License
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="license_type">License Type</Label>
                  <Input
                    id="license_type"
                    value={formData.license_type}
                    onChange={(e) => setFormData({ ...formData, license_type: e.target.value })}
                    placeholder="e.g., Business Permit, Health Certificate"
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="license_number">License Number</Label>
                  <Input
                    id="license_number"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    placeholder="e.g., BL-12345"
                    required
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="issuing_authority">Issuing Authority</Label>
                <Input
                  id="issuing_authority"
                  value={formData.issuing_authority}
                  onChange={(e) => setFormData({ ...formData, issuing_authority: e.target.value })}
                  placeholder="e.g., City of New York"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Input
                    id="issue_date"
                    type="date"
                    value={formData.issue_date}
                    onChange={(e) => setFormData({ ...formData, issue_date: e.target.value })}
                    required
                  />
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expiry_date">Expiry Date</Label>
                  <Input
                    id="expiry_date"
                    type="date"
                    value={formData.expiry_date}
                    onChange={(e) => setFormData({ ...formData, expiry_date: e.target.value })}
                  />
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes</Label>
                <Input
                  id="notes"
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Additional information about this license"
                />
              </div>
              
              <div className="grid gap-2">
                <Label>Upload Document</Label>
                <div className="flex items-center gap-4">
                  <Button type="button" variant="outline">
                    <Upload className="h-4 w-4 mr-2" />
                    Upload Document
                  </Button>
                  <p className="text-sm text-gray-500">No file selected</p>
                </div>
                <p className="text-xs text-gray-500">
                  Supported formats: PDF, JPG, PNG. Max size: 10MB
                </p>
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  resetForm();
                  setIsAddDialogOpen(false);
                }}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={addLicenseMutation.isPending}
              >
                {addLicenseMutation.isPending ? 'Saving...' : 'Save License'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This will permanently delete this license record. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleDeleteLicense}
              className="bg-red-600 hover:bg-red-700"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </AdminLayout>
  );
};

export default AdminBusinessLicenses;
