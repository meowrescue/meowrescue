
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import AdminLayout from './Admin';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Search, Trash2, RefreshCw, Edit, UploadCloud, X, CheckCircle, AlertCircle } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';

// Define the type for a cat
interface Cat {
  id: string;
  name: string;
  age_estimate: string | null;
  breed: string | null;
  gender: string | null;
  description: string | null;
  bio: string | null;
  status: 'Available' | 'Pending' | 'Adopted';
  intake_date: string;
  medical_notes: string | null;
  photos_urls: string[] | null;
  created_at: string;
  updated_at: string;
  foster_profile_id: string | null;
  vaccination_status: string | null;
  spay_neuter_status: string | null;
  fiv_status: string | null;
  felv_status: string | null;
  special_needs: string | null;
  intake_source: string | null;
  outcome_date: string | null;
  outcome_type: string | null;
}

// Create schema for form validation
const catFormSchema = z.object({
  name: z.string().min(1, { message: "Name is required" }),
  age_estimate: z.string().nullable().optional(),
  breed: z.string().nullable().optional(),
  gender: z.string().nullable().optional(),
  description: z.string().nullable().optional(),
  bio: z.string().nullable().optional(),
  status: z.enum(["Available", "Pending", "Adopted"]),
  medical_notes: z.string().nullable().optional(),
  photos_urls: z.array(z.string()).nullable().optional(),
  vaccination_status: z.string().nullable().optional(),
  spay_neuter_status: z.string().nullable().optional(),
  fiv_status: z.string().nullable().optional(),
  felv_status: z.string().nullable().optional(),
  special_needs: z.string().nullable().optional(),
  intake_source: z.string().nullable().optional(),
  outcome_type: z.string().nullable().optional(),
});

const AdminCats: React.FC = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [status, setStatus] = useState<'all' | 'Available' | 'Pending' | 'Adopted'>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [currentCat, setCurrentCat] = useState<Cat | null>(null);
  const [photoInput, setPhotoInput] = useState('');
  const [photos, setPhotos] = useState<string[]>([]);
  const [deleting, setDeleting] = useState<string | null>(null);

  // Set up react-hook-form
  const form = useForm<z.infer<typeof catFormSchema>>({
    resolver: zodResolver(catFormSchema),
    defaultValues: {
      name: '',
      age_estimate: '',
      breed: '',
      gender: '',
      description: '',
      bio: '',
      status: 'Available',
      medical_notes: '',
      photos_urls: [],
      vaccination_status: '',
      spay_neuter_status: '',
      fiv_status: '',
      felv_status: '',
      special_needs: '',
      intake_source: '',
      outcome_type: '',
    },
  });

  // Query cats from Supabase
  const { data: cats, isLoading, error, refetch } = useQuery({
    queryKey: ['cats'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .order('intake_date', { ascending: false });
      
      if (error) throw error;
      return data as Cat[];
    }
  });

  // Create cat mutation
  const createCatMutation = useMutation({
    mutationFn: async (values: z.infer<typeof catFormSchema>) => {
      // Add current date for intake_date if not provided
      const catData = {
        ...values,
        intake_date: new Date().toISOString(),
      };
      
      const { data, error } = await supabase
        .from('cats')
        .insert([catData])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Cat added successfully!",
      });
      setIsAddModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['cats'] });
      form.reset();
      setPhotos([]);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to add cat. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Update cat mutation
  const updateCatMutation = useMutation({
    mutationFn: async (values: z.infer<typeof catFormSchema> & { id: string }) => {
      const { id, ...catData } = values;
      
      const { data, error } = await supabase
        .from('cats')
        .update(catData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "Cat updated successfully!",
      });
      setIsEditModalOpen(false);
      queryClient.invalidateQueries({ queryKey: ['cats'] });
      form.reset();
      setPhotos([]);
      setCurrentCat(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to update cat. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Delete cat mutation
  const deleteCatMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('cats')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      toast({
        title: "Success",
        description: "Cat deleted successfully!",
      });
      queryClient.invalidateQueries({ queryKey: ['cats'] });
      setDeleting(null);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "Failed to delete cat. Please try again.",
        variant: "destructive",
      });
      setDeleting(null);
    }
  });

  // Filter cats based on search query and status
  const filteredCats = cats?.filter(cat => {
    const matchesSearch = 
      cat.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (cat.breed && cat.breed.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (cat.description && cat.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    const matchesStatus = status === 'all' || cat.status === status;
    
    return matchesSearch && matchesStatus;
  });

  // Handle form submission for adding/editing a cat
  const onSubmit = (values: z.infer<typeof catFormSchema>) => {
    values.photos_urls = photos;
    
    if (currentCat) {
      updateCatMutation.mutate({ ...values, id: currentCat.id });
    } else {
      createCatMutation.mutate(values);
    }
  };

  // Add a photo URL to the list
  const addPhotoUrl = () => {
    if (photoInput && !photos.includes(photoInput)) {
      setPhotos([...photos, photoInput]);
      setPhotoInput('');
    }
  };

  // Remove a photo URL from the list
  const removePhotoUrl = (indexToRemove: number) => {
    setPhotos(photos.filter((_, index) => index !== indexToRemove));
  };

  // Open edit modal with cat data
  const handleEditCat = (cat: Cat) => {
    setCurrentCat(cat);
    form.reset({
      name: cat.name,
      age_estimate: cat.age_estimate || '',
      breed: cat.breed || '',
      gender: cat.gender || '',
      description: cat.description || '',
      bio: cat.bio || '',
      status: cat.status,
      medical_notes: cat.medical_notes || '',
      vaccination_status: cat.vaccination_status || '',
      spay_neuter_status: cat.spay_neuter_status || '',
      fiv_status: cat.fiv_status || '',
      felv_status: cat.felv_status || '',
      special_needs: cat.special_needs || '',
      intake_source: cat.intake_source || '',
      outcome_type: cat.outcome_type || '',
    });
    setPhotos(cat.photos_urls || []);
    setIsEditModalOpen(true);
  };

  // Get status badge color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Available':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'Pending':
        return 'bg-amber-100 text-amber-800 border-amber-200';
      case 'Adopted':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <AdminLayout title="Cats Management">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Cats Management</h1>
        <Button onClick={() => {
          form.reset();
          setPhotos([]);
          setCurrentCat(null);
          setIsAddModalOpen(true);
        }} className="flex items-center gap-2" variant="meow">
          <Plus size={16} />
          Add New Cat
        </Button>
      </div>
      
      <Card className="mb-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Filters</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <Input
                placeholder="Search by name, breed, description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
                icon={<Search className="h-4 w-4" />}
              />
            </div>
            <div className="md:w-48">
              <Tabs defaultValue="all" value={status} onValueChange={(value) => setStatus(value as any)} className="w-full">
                <TabsList className="grid grid-cols-4">
                  <TabsTrigger value="all">All</TabsTrigger>
                  <TabsTrigger value="Available">Available</TabsTrigger>
                  <TabsTrigger value="Pending">Pending</TabsTrigger>
                  <TabsTrigger value="Adopted">Adopted</TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
            <div>
              <Button variant="outline" onClick={() => refetch()} className="flex items-center gap-2">
                <RefreshCw size={16} />
                Refresh
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
        </div>
      ) : error ? (
        <Card className="bg-red-50 border-red-200">
          <CardContent className="text-center py-8">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Error Loading Cats</h3>
            <p className="text-red-600 mb-4">{(error as Error).message || "Failed to load cats data. Please try again."}</p>
            <Button onClick={() => refetch()} variant="outline" className="bg-white">
              Try Again
            </Button>
          </CardContent>
        </Card>
      ) : filteredCats && filteredCats.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCats.map((cat) => (
            <Card key={cat.id} className="overflow-hidden flex flex-col h-full">
              <div className="aspect-video overflow-hidden bg-gray-100">
                {cat.photos_urls && cat.photos_urls.length > 0 ? (
                  <img 
                    src={cat.photos_urls[0]} 
                    alt={cat.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder.svg';
                    }}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gray-200">
                    <span className="text-gray-400">No Image</span>
                  </div>
                )}
              </div>
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div>
                    <Badge className={getStatusColor(cat.status)}>{cat.status}</Badge>
                    <CardTitle className="mt-2">{cat.name}</CardTitle>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" onClick={() => handleEditCat(cat)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50">
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This will permanently delete {cat.name}'s record and cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction 
                            onClick={() => {
                              setDeleting(cat.id);
                              deleteCatMutation.mutate(cat.id);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white"
                            disabled={deleting === cat.id}
                          >
                            {deleting === cat.id ? (
                              <>
                                <span className="animate-spin rounded-full h-4 w-4 border-2 border-b-0 border-r-0 border-white mr-2"></span>
                                Deleting...
                              </>
                            ) : (
                              'Delete Cat'
                            )}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pb-2 flex-grow">
                <div className="space-y-2">
                  <div className="flex gap-2 text-sm">
                    <span className="text-gray-500">Age:</span>
                    <span>{cat.age_estimate || 'Unknown'}</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="text-gray-500">Breed:</span>
                    <span>{cat.breed || 'Unknown'}</span>
                  </div>
                  <div className="flex gap-2 text-sm">
                    <span className="text-gray-500">Gender:</span>
                    <span>{cat.gender || 'Unknown'}</span>
                  </div>
                  {cat.description && (
                    <p className="text-sm mt-2 line-clamp-3">{cat.description}</p>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="bg-gray-50">
          <CardContent className="text-center py-12">
            <div className="mx-auto w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mb-4">
              <Search className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium mb-2">No cats found</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery
                ? `No cats match "${searchQuery}" in the selected category.`
                : "No cats available in the selected category."}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" onClick={() => {
                setSearchQuery('');
                setStatus('all');
              }}>
                Clear Filters
              </Button>
              <Button variant="meow" onClick={() => {
                form.reset();
                setPhotos([]);
                setCurrentCat(null);
                setIsAddModalOpen(true);
              }} className="flex items-center gap-2">
                <Plus size={16} />
                Add New Cat
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
      
      {/* Add Cat Modal */}
      <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Add New Cat</DialogTitle>
            <DialogDescription>
              Fill in the details to add a new cat to the database.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Cat's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Adopted">Adopted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="age_estimate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Estimate</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 years" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breed</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Domestic Shorthair" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="intake_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intake Source</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Shelter, Stray, Owner Surrender" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Short Description</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Brief description for listings" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="md:col-span-2">
                  <FormField
                    control={form.control}
                    name="bio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Full Bio</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Detailed biography" {...field} value={field.value || ''} className="min-h-[100px]" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="vaccination_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vaccination Status</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Up to date, Partial" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="spay_neuter_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spay/Neuter Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Spayed">Spayed</SelectItem>
                            <SelectItem value="Neutered">Neutered</SelectItem>
                            <SelectItem value="Not Altered">Not Altered</SelectItem>
                            <SelectItem value="Unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fiv_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FIV Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Positive">Positive</SelectItem>
                            <SelectItem value="Negative">Negative</SelectItem>
                            <SelectItem value="Not Tested">Not Tested</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="felv_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>FeLV Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Positive">Positive</SelectItem>
                            <SelectItem value="Negative">Negative</SelectItem>
                            <SelectItem value="Not Tested">Not Tested</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="special_needs"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Special Needs</FormLabel>
                        <FormControl>
                          <Input placeholder="Any special needs or requirements" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <div className="md:col-span-2">
                    <FormField
                      control={form.control}
                      name="medical_notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Medical Notes</FormLabel>
                          <FormControl>
                            <Textarea placeholder="Additional medical information" {...field} value={field.value || ''} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Photos</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {photos.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="w-16 h-16 border rounded overflow-hidden">
                          <img 
                            src={url} 
                            alt={`Preview ${index}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhotoUrl(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter photo URL"
                      value={photoInput}
                      onChange={(e) => setPhotoInput(e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      onClick={addPhotoUrl}
                      variant="outline"
                      className="flex items-center gap-2"
                      disabled={!photoInput}
                    >
                      <UploadCloud size={16} />
                      Add URL
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Add URLs for cat photos. For best results, use square images with a minimum size of 500x500 pixels.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    form.reset();
                    setPhotos([]);
                    setIsAddModalOpen(false);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="meow"
                  disabled={createCatMutation.isPending}
                  className="gap-2"
                >
                  {createCatMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Save Cat
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Edit Cat Modal */}
      <Dialog open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Cat: {currentCat?.name}</DialogTitle>
            <DialogDescription>
              Update information for this cat.
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              {/* Same form fields as Add Cat Modal */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name*</FormLabel>
                      <FormControl>
                        <Input placeholder="Cat's name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="status"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Status*</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select status" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Available">Available</SelectItem>
                          <SelectItem value="Pending">Pending</SelectItem>
                          <SelectItem value="Adopted">Adopted</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {/* Repeat other form fields from Add Cat Modal */}
                <FormField
                  control={form.control}
                  name="age_estimate"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Age Estimate</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2 years" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="breed"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Breed</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Domestic Shorthair" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Gender</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ''}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select gender" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="intake_source"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Intake Source</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Shelter, Stray, Owner Surrender" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Short Description</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Brief description for listings" {...field} value={field.value || ''} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="md:col-span-2">
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Full Bio</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Detailed biography" {...field} value={field.value || ''} className="min-h-[100px]" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {/* Medical Information Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Medical Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Repeat medical fields from Add Cat Modal */}
                  <FormField
                    control={form.control}
                    name="vaccination_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vaccination Status</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., Up to date, Partial" {...field} value={field.value || ''} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="spay_neuter_status"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Spay/Neuter Status</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value || ''}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="Spayed">Spayed</SelectItem>
                            <SelectItem value="Neutered">Neutered</SelectItem>
                            <SelectItem value="Not Altered">Not Altered</SelectItem>
                            <SelectItem value="Unknown">Unknown</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>
              
              {/* Photos Section */}
              <div className="border-t pt-6">
                <h3 className="text-lg font-medium mb-4">Photos</h3>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {photos.map((url, index) => (
                      <div key={index} className="relative group">
                        <div className="w-16 h-16 border rounded overflow-hidden">
                          <img 
                            src={url} 
                            alt={`Preview ${index}`} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              (e.target as HTMLImageElement).src = '/placeholder.svg';
                            }}
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => removePhotoUrl(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X size={12} />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="flex gap-2">
                    <Input
                      placeholder="Enter photo URL"
                      value={photoInput}
                      onChange={(e) => setPhotoInput(e.target.value)}
                      className="flex-grow"
                    />
                    <Button
                      type="button"
                      onClick={addPhotoUrl}
                      variant="outline"
                      className="flex items-center gap-2"
                      disabled={!photoInput}
                    >
                      <UploadCloud size={16} />
                      Add URL
                    </Button>
                  </div>
                  
                  <p className="text-sm text-gray-500">
                    Add URLs for cat photos. For best results, use square images with a minimum size of 500x500 pixels.
                  </p>
                </div>
              </div>
              
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditModalOpen(false);
                    setCurrentCat(null);
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="meow"
                  disabled={updateCatMutation.isPending}
                  className="gap-2"
                >
                  {updateCatMutation.isPending ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-current border-t-transparent"></div>
                      Updating...
                    </>
                  ) : (
                    <>
                      <CheckCircle size={16} />
                      Update Cat
                    </>
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCats;
