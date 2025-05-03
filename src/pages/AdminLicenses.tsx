
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import { format } from 'date-fns';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Calendar as CalendarIcon, Plus, Edit, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';
import { format as formatDate, isAfter, addMonths } from 'date-fns';
import { cn } from '@/lib/utils';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';

interface License {
  id: string;
  license_type: string;
  license_number: string;
  issuing_authority: string;
  issue_date: string;
  expiry_date: string | null;
  notes: string | null;
  document_id: string | null;
  created_at: string;
  updated_at: string;
}

const AdminLicenses = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentLicense, setCurrentLicense] = useState<License | null>(null);
  
  const [licenseForm, setLicenseForm] = useState({
    license_type: '',
    license_number: '',
    issuing_authority: '',
    issue_date: new Date(),
    expiry_date: null as Date | null,
    notes: ''
  });
  
  // Fetch licenses
  const { data: licenses, isLoading } = useQuery({
    queryKey: ['business-licenses'],
    queryFn: async () => {
      const { data, error } = await getSupabaseClient()
        .from('business_licenses')
        .select('*')
        .order('expiry_date', { ascending: true });
      
      if (error) throw error;
      return data as License[];
    }
  });
  
  // Add license mutation
  const addLicenseMutation = useMutation({
    mutationFn: async (formData: typeof licenseForm) => {
      const newLicense = {
        license_type: formData.license_type,
        license_number: formData.license_number,
        issuing_authority: formData.issuing_authority,
        issue_date: formData.issue_date.toISOString().split('T')[0],
        expiry_date: formData.expiry_date ? formData.expiry_date.toISOString().split('T')[0] : null,
        notes: formData.notes || null
      };
      
      const { data, error } = await getSupabaseClient()
        .from('business_licenses')
        .insert([newLicense])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-licenses'] });
      resetForm();
      setShowAddDialog(false);
      
      toast({
        title: "License Added",
        description: "Business license has been added successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add license",
        variant: "destructive"
      });
    }
  });
  
  // Update license mutation
  const updateLicenseMutation = useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: typeof licenseForm }) => {
      const updatedLicense = {
        license_type: formData.license_type,
        license_number: formData.license_number,
        issuing_authority: formData.issuing_authority,
        issue_date: formData.issue_date.toISOString().split('T')[0],
        expiry_date: formData.expiry_date ? formData.expiry_date.toISOString().split('T')[0] : null,
        notes: formData.notes || null
      };
      
      const { data, error } = await getSupabaseClient()
        .from('business_licenses')
        .update(updatedLicense)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['business-licenses'] });
      resetForm();
      setShowAddDialog(false);
      setIsEditing(false);
      setCurrentLicense(null);
      
      toast({
        title: "License Updated",
        description: "Business license has been updated successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update license",
        variant: "destructive"
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
      return id;
    },
    onSuccess: (id) => {
      queryClient.invalidateQueries({ queryKey: ['business-licenses'] });
      
      toast({
        title: "License Deleted",
        description: "Business license has been deleted successfully."
      });
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete license",
        variant: "destructive"
      });
    }
  });
  
  const resetForm = () => {
    setLicenseForm({
      license_type: '',
      license_number: '',
      issuing_authority: '',
      issue_date: new Date(),
      expiry_date: null,
      notes: ''
    });
  };
  
  const handleEdit = (license: License) => {
    setCurrentLicense(license);
    setLicenseForm({
      license_type: license.license_type,
      license_number: license.license_number,
      issuing_authority: license.issuing_authority,
      issue_date: new Date(license.issue_date),
      expiry_date: license.expiry_date ? new Date(license.expiry_date) : null,
      notes: license.notes || ''
    });
    setIsEditing(true);
    setShowAddDialog(true);
  };
  
  const handleDelete = (id: string) => {
    if (window.confirm("Are you sure you want to delete this license?")) {
      deleteLicenseMutation.mutate(id);
    }
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isEditing && currentLicense) {
      updateLicenseMutation.mutate({ 
        id: currentLicense.id, 
        formData: licenseForm 
      });
    } else {
      addLicenseMutation.mutate(licenseForm);
    }
  };
  
  const closeDialog = () => {
    setShowAddDialog(false);
    setIsEditing(false);
    setCurrentLicense(null);
    resetForm();
  };
  
  const isLicenseExpired = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    return isAfter(new Date(), new Date(expiryDate));
  };
  
  const isLicenseExpiringSoon = (expiryDate: string | null) => {
    if (!expiryDate) return false;
    const today = new Date();
    const expiry = new Date(expiryDate);
    const threeMonthsFromNow = addMonths(today, 3);
    return isAfter(threeMonthsFromNow, expiry) && isAfter(expiry, today);
  };
  
  const getLicenseStatusClass = (expiryDate: string | null) => {
    if (isLicenseExpired(expiryDate)) {
      return "bg-red-100 text-red-800";
    } else if (isLicenseExpiringSoon(expiryDate)) {
      return "bg-yellow-100 text-yellow-800";
    } else {
      return "bg-green-100 text-green-800";
    }
  };
  
  const getLicenseStatusText = (expiryDate: string | null) => {
    if (!expiryDate) return "No Expiry";
    if (isLicenseExpired(expiryDate)) {
      return "Expired";
    } else if (isLicenseExpiringSoon(expiryDate)) {
      return "Expiring Soon";
    } else {
      return "Active";
    }
  };
  
  const filteredLicenses = licenses?.filter(license => 
    license.license_type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    license.license_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
    license.issuing_authority.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const expiredCount = licenses?.filter(license => isLicenseExpired(license.expiry_date)).length || 0;
  const expiringSoonCount = licenses?.filter(license => 
    !isLicenseExpired(license.expiry_date) && isLicenseExpiringSoon(license.expiry_date)
  ).length || 0;
  const activeCount = licenses?.filter(license => 
    license.expiry_date && !isLicenseExpired(license.expiry_date) && !isLicenseExpiringSoon(license.expiry_date)
  ).length || 0;
  
  return (
    <AdminLayout title="Business Licenses">
      <SEO title="Business Licenses | Meow Rescue Admin" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4">
          <h1 className="text-3xl font-bold text-meow-primary">Business Licenses</h1>
          
          <div className="flex items-center space-x-4">
            <Input
              placeholder="Search licenses..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="max-w-xs"
            />
            
            <Button onClick={() => setShowAddDialog(true)}>
              <Plus className="mr-2 h-4 w-4" />
              Add License
            </Button>
          </div>
        </div>
        
        {/* Dashboard Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-red-100 text-red-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Expired</p>
                  <p className="text-xl font-semibold">{expiredCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Expiring Soon</p>
                  <p className="text-xl font-semibold">{expiringSoonCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center">
                <div className="p-3 rounded-full bg-green-100 text-green-600">
                  <FileText className="h-6 w-6" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-500">Active</p>
                  <p className="text-xl font-semibold">{activeCount}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Licenses Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Business Licenses
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-meow-primary"></div>
              </div>
            ) : filteredLicenses && filteredLicenses.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>A list of all business licenses</TableCaption>
                  <TableHeader>
                    <TableRow>
                      <TableHead>License Type</TableHead>
                      <TableHead>License Number</TableHead>
                      <TableHead>Issuing Authority</TableHead>
                      <TableHead>Issue Date</TableHead>
                      <TableHead>Expiry Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLicenses.map((license) => (
                      <TableRow key={license.id}>
                        <TableCell>{license.license_type}</TableCell>
                        <TableCell>{license.license_number}</TableCell>
                        <TableCell>{license.issuing_authority}</TableCell>
                        <TableCell>{formatDate(new Date(license.issue_date), 'MMM d, yyyy')}</TableCell>
                        <TableCell>
                          {license.expiry_date 
                            ? formatDate(new Date(license.expiry_date), 'MMM d, yyyy')
                            : 'No Expiry'}
                        </TableCell>
                        <TableCell>
                          <Badge className={getLicenseStatusClass(license.expiry_date)}>
                            {getLicenseStatusText(license.expiry_date)}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-right">
                          <Button variant="ghost" size="icon" onClick={() => handleEdit(license)}>
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" onClick={() => handleDelete(license.id)}>
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <div className="text-center py-8">
                <FileText className="h-12 w-12 mx-auto text-gray-400 mb-3" />
                <p className="text-gray-500">No licenses found.</p>
                <Button 
                  variant="outline" 
                  className="mt-4"
                  onClick={() => setShowAddDialog(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Your First License
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Add/Edit License Dialog */}
      <Dialog open={showAddDialog} onOpenChange={closeDialog}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              {isEditing ? 'Edit License' : 'Add New License'}
            </DialogTitle>
          </DialogHeader>
          
          <form onSubmit={handleSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="license_type">License Type</Label>
                <Input
                  id="license_type"
                  placeholder="e.g., Business Permit, 501(c)(3), etc."
                  value={licenseForm.license_type}
                  onChange={(e) => setLicenseForm({ ...licenseForm, license_type: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="license_number">License Number</Label>
                <Input
                  id="license_number"
                  placeholder="Enter license/permit number"
                  value={licenseForm.license_number}
                  onChange={(e) => setLicenseForm({ ...licenseForm, license_number: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="issuing_authority">Issuing Authority</Label>
                <Input
                  id="issuing_authority"
                  placeholder="e.g., City of Example, State Department"
                  value={licenseForm.issuing_authority}
                  onChange={(e) => setLicenseForm({ ...licenseForm, issuing_authority: e.target.value })}
                  required
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="issue_date">Issue Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !licenseForm.issue_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {licenseForm.issue_date ? (
                          format(licenseForm.issue_date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={licenseForm.issue_date}
                        onSelect={(date) => setLicenseForm({ ...licenseForm, issue_date: date || new Date() })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                
                <div className="grid gap-2">
                  <Label htmlFor="expiry_date">Expiry Date (Optional)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !licenseForm.expiry_date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {licenseForm.expiry_date ? (
                          format(licenseForm.expiry_date, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={licenseForm.expiry_date || undefined}
                        onSelect={(date) => setLicenseForm({ ...licenseForm, expiry_date: date })}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="notes">Notes (Optional)</Label>
                <Textarea
                  id="notes"
                  placeholder="Enter any additional notes"
                  value={licenseForm.notes}
                  onChange={(e) => setLicenseForm({ ...licenseForm, notes: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={closeDialog}
              >
                Cancel
              </Button>
              <Button 
                type="submit"
                disabled={addLicenseMutation.isPending || updateLicenseMutation.isPending}
              >
                {isEditing 
                  ? (updateLicenseMutation.isPending ? 'Updating...' : 'Update License') 
                  : (addLicenseMutation.isPending ? 'Adding...' : 'Add License')}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminLicenses;
