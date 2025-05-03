import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import AdminLayout from '@/pages/Admin';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Checkbox } from '@/components/ui/checkbox';
import { 
  ArrowLeft, 
  Upload, 
  Loader2, 
  Edit, 
  ImageIcon, 
  Save, 
  X, 
  Calendar as CalendarIcon,
  FileText,
  Stethoscope
} from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import getSupabaseClient from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import ImageUploader from '@/components/ImageUploader';
import CatMedicalRecords from '@/components/admin/CatMedicalRecords';
import SectionHeading from '@/components/ui/SectionHeading';
import PhotoSelector from '@/components/admin/PhotoSelector';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useScrollToElement } from '@/hooks/use-scroll';
import { 
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format, differenceInYears, differenceInMonths } from 'date-fns';
import { cn } from "@/lib/utils";
import { DatePicker } from "@/components/ui/date-picker";

const AdminCatForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const [editMode, setEditMode] = useState(!id);
  useScrollToElement(); // This will scroll to top on page load

  // Form state
  const [name, setName] = useState('');
  const [ageEstimate, setAgeEstimate] = useState('');
  const [calculatedAge, setCalculatedAge] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [status, setStatus] = useState('Available');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [tempPhotoUrls, setTempPhotoUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnAdoptablePage, setShowOnAdoptablePage] = useState(true);
  
  // New state for photo viewing
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [primaryPhotoIndex, setPrimaryPhotoIndex] = useState(0);
  const [birthday, setBirthday] = useState<Date | undefined>(undefined);
  
  // Add new state for additional fields
  const [color, setColor] = useState('');
  const [pattern, setPattern] = useState('');
  const [eyeColor, setEyeColor] = useState('');
  const [coatType, setCoatType] = useState('');
  const [weight, setWeight] = useState('');
  
  // Fetch cat data when editing
  const { data: cat, isLoading: isCatLoading } = useQuery({
    queryKey: ['cat', id],
    queryFn: async () => {
      if (!id) return null;
      
      const { data, error } = await getSupabaseClient()
        .from('cats')
        .select('*')
        .eq('id', id)
        .single();
      
      if (error) throw error;
      return data;
    },
    enabled: isEditing
  });
  
  // Set form values when cat data is loaded
  useEffect(() => {
    if (cat) {
      setName(cat.name || '');
      setAgeEstimate(cat.age_estimate || '');
      setBreed(cat.breed || '');
      setGender(cat.gender || '');
      setDescription(cat.description || '');
      setMedicalNotes(cat.medical_notes || '');
      setStatus(cat.status || 'Available');
      setPhotoUrls(cat.photos_urls || []);
      setTempPhotoUrls(cat.photos_urls || []);
      // The showOnAdoptablePage checkbox is tied to the status
      setShowOnAdoptablePage(cat.status === 'Available');
      setBirthday(cat.birthday ? new Date(cat.birthday) : undefined);
      setPrimaryPhotoIndex(0); // Set to first photo by default
      setColor(cat.color || '');
      setPattern(cat.pattern || '');
      setEyeColor(cat.eye_color || '');
      setCoatType(cat.coat_type || '');
      setWeight(cat.weight || '');
    }
  }, [cat]);
  
  // Calculate age based on birthday
  useEffect(() => {
    if (birthday) {
      const years = differenceInYears(new Date(), birthday);
      const months = differenceInMonths(new Date(), birthday) % 12;
      let age = '';
      
      if (years > 0) {
        age += `${years} ${years === 1 ? 'year' : 'years'}`;
      }
      
      if (months > 0) {
        age += `${years > 0 ? ', ' : ''}${months} ${months === 1 ? 'month' : 'months'}`;
      }
      
      if (!age) age = 'Less than 1 month';
      
      setCalculatedAge(age);
      setAgeEstimate(age);
    }
  }, [birthday]);
  
  // Create cat mutation
  const createCatMutation = useMutation({
    mutationFn: async (catData: any) => {
      const { data, error } = await getSupabaseClient()
        .from('cats')
        .insert([catData])
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "Cat Added",
        description: "The cat has been successfully added."
      });
      navigate('/admin/cats');
    },
    onError: (error: any) => {
      toast({
        title: "Error Adding Cat",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Update cat mutation
  const updateCatMutation = useMutation({
    mutationFn: async ({ id, catData }: { id: string; catData: any }) => {
      const { data, error } = await getSupabaseClient()
        .from('cats')
        .update(catData)
        .eq('id', id)
        .select();
      
      if (error) throw error;
      return data[0];
    },
    onSuccess: () => {
      toast({
        title: "Cat Updated",
        description: "The cat has been successfully updated."
      });
      setEditMode(false);
    },
    onError: (error: any) => {
      toast({
        title: "Error Updating Cat",
        description: error.message,
        variant: "destructive"
      });
    }
  });
  
  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Set status based on checkbox
      const finalStatus = showOnAdoptablePage ? 'Available' : 'NotListed';
      
      // Reorder photos array to put primary photo first
      const reorderedPhotos = [...tempPhotoUrls];
      if (reorderedPhotos.length > 0) {
        const primaryPhoto = reorderedPhotos.splice(primaryPhotoIndex, 1)[0];
        reorderedPhotos.unshift(primaryPhoto);
      }
      
      const catData = {
        name,
        age_estimate: ageEstimate,
        breed,
        gender,
        description,
        medical_notes: medicalNotes,
        status: finalStatus,
        photos_urls: reorderedPhotos,
        birthday: birthday ? birthday.toISOString().split('T')[0] : null,
        color,
        pattern,
        eye_color: eyeColor,
        coat_type: coatType,
        weight
      };
      
      if (isEditing && id) {
        updateCatMutation.mutate({ id, catData });
      } else {
        createCatMutation.mutate(catData);
      }
    } catch (error: any) {
      console.error("Error:", error);
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // Handle photo upload completed
  const handleImageUploaded = (url: string) => {
    if (url) {
      setTempPhotoUrls(prev => [...prev, url]);
    }
  };
  
  // Handle photo removal
  const handleRemovePhoto = (index: number) => {
    setTempPhotoUrls(prev => prev.filter((_, i) => i !== index));
  };
  
  // Handle photo selection for viewing in a modal
  const handleViewPhoto = (url: string) => {
    setSelectedPhotoUrl(url);
  };

  // Handle cancel editing
  const handleCancelEdit = () => {
    if (isEditing) {
      // Reset to original values
      setTempPhotoUrls(photoUrls);
      setEditMode(false);
    } else {
      navigate('/admin/cats');
    }
  };

  // Common dropdown options
  const catBreeds = [
    "Domestic Shorthair",
    "Domestic Longhair",
    "Siamese",
    "Persian",
    "Maine Coon",
    "American Shorthair",
    "Ragdoll",
    "British Shorthair",
    "Bengal",
    "Sphynx",
    "Scottish Fold",
    "Abyssinian",
    "Norwegian Forest Cat",
    "Oriental Shorthair",
    "Burmese",
    "Russian Blue",
    "Siberian",
    "Devon Rex",
    "Cornish Rex",
    "Turkish Van",
    "Manx",
    "Bombay",
    "Himalayan",
    "Egyptian Mau",
    "Mixed Breed"
  ];
  
  const colorOptions = [
    "Black",
    "White",
    "Gray",
    "Orange",
    "Brown",
    "Cream",
    "Black & White",
    "Gray & White",
    "Orange & White",
    "Calico",
    "Tortoiseshell",
    "Tabby",
    "Tuxedo",
    "Blue",
    "Lilac",
    "Chocolate",
    "Cinnamon",
    "Fawn",
    "Colorpoint",
    "Silver",
    "Red",
    "Cream & White",
    "Tricolor",
    "Bicolor",
    "Spotted"
  ];
  
  const patternOptions = [
    "Solid",
    "Tabby",
    "Striped",
    "Spotted",
    "Tortoiseshell",
    "Calico",
    "Bicolor",
    "Tuxedo",
    "Pointed",
    "Colorpoint",
    "Tricolor",
    "Harlequin",
    "Van",
    "Mackerel Tabby",
    "Classic Tabby",
    "Spotted Tabby",
    "Ticked Tabby",
    "Patched Tabby",
    "Smoke",
    "Shaded",
    "Chinchilla",
    "Mink",
    "Lynx Point",
    "Marble",
    "Tortie"
  ];
  
  const eyeColorOptions = [
    "Green",
    "Blue",
    "Yellow",
    "Gold",
    "Amber",
    "Copper",
    "Orange",
    "Hazel",
    "Brown",
    "Odd-eyed (Different Colors)",
    "Aqua",
    "Green-Yellow",
    "Blue-Green",
    "Yellow-Green",
    "Copper-Green",
    "Amber-Green",
    "Gold-Green",
    "Pale Blue",
    "Deep Blue",
    "Sapphire",
    "Pale Gold",
    "Deep Gold",
    "Light Copper",
    "Dark Copper",
    "Amber-Gold"
  ];
  
  const coatTypeOptions = [
    "Short",
    "Medium",
    "Long",
    "Hairless",
    "Curly",
    "Wavy",
    "Wire",
    "Rex",
    "Silky",
    "Smooth",
    "Dense",
    "Double-coat",
    "Sparse",
    "Plush",
    "Woolly",
    "Crimped",
    "Fine",
    "Coarse",
    "Fluffy",
    "Soft",
    "Downy",
    "Sleek",
    "Flat-lying",
    "Thick",
    "Thin"
  ];

  // Add handler for primary photo selection
  const handlePrimaryPhotoSelect = (index: number) => {
    setPrimaryPhotoIndex(index);
  };

  // Status options
  const statusOptions = [
    "Available",
    "Pending",
    "Adopted",
    "NotListed",
    "Deceased",
    "Missing"
  ];
  
  return (
    <AdminLayout title={isEditing ? (editMode ? "Edit Cat" : "View Cat") : "Add Cat"}>
      <SEO title={`${isEditing ? (editMode ? "Edit" : "View") : "Add"} Cat | Meow Rescue Admin`} />
      
      <div className="max-w-5xl mx-auto py-4">
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/cats')} 
          className="mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cats
        </Button>
        
        <Card className="shadow-md border border-gray-200/50">
          <CardHeader className="flex flex-row items-center justify-between bg-gradient-to-r from-meow-primary/10 to-transparent">
            <CardTitle className="text-2xl font-bold text-meow-primary">
              {isEditing ? `${editMode ? 'Edit' : 'View'} ${cat?.name || 'Cat'}` : 'Add New Cat'}
            </CardTitle>
            {isEditing && (
              <Button 
                variant={editMode ? "outline" : "default"} 
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2"
              >
                {editMode ? (
                  <>
                    <X className="h-4 w-4" />
                    Cancel
                  </>
                ) : (
                  <>
                    <Edit className="h-4 w-4" />
                    Edit
                  </>
                )}
              </Button>
            )}
          </CardHeader>
          <CardContent className="p-6">
            {isCatLoading ? (
              <div className="flex justify-center py-12">
                <Loader2 className="animate-spin h-12 w-12 text-meow-primary" />
              </div>
            ) : (
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="mb-6 grid grid-cols-4 w-full">
                  <TabsTrigger value="details" className="flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Basic Information
                  </TabsTrigger>
                  <TabsTrigger value="appearance" className="flex items-center gap-2">
                    <Edit className="h-4 w-4" />
                    Appearance
                  </TabsTrigger>
                  <TabsTrigger value="photos" className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4" />
                    Photos
                  </TabsTrigger>
                  <TabsTrigger value="medical" className="flex items-center gap-2">
                    <Stethoscope className="h-4 w-4" />
                    Medical
                  </TabsTrigger>
                </TabsList>
                
                <form onSubmit={handleSubmit}>
                  <TabsContent value="details" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="name" className="text-sm font-medium">Name *</Label>
                          <Input 
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Cat's name"
                            disabled={!editMode}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="birthday" className="text-sm font-medium">Birthday (if known)</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="birthday"
                                variant={"outline"}
                                className={cn(
                                  "w-full justify-start text-left font-normal mt-1",
                                  !birthday && "text-muted-foreground"
                                )}
                                disabled={!editMode}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {birthday ? format(birthday, "PPP") : <span>Pick a date</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <DatePicker
                                mode="single"
                                selected={birthday}
                                onSelect={setBirthday}
                                initialFocus
                                disabled={!editMode}
                                className="pointer-events-auto"
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div>
                          <Label htmlFor="ageEstimate" className="text-sm font-medium">Age Estimate</Label>
                          <Input 
                            id="ageEstimate"
                            value={ageEstimate}
                            onChange={(e) => setAgeEstimate(e.target.value)}
                            placeholder="e.g. 2 years, 6 months"
                            disabled={!editMode || !!birthday}
                            className="mt-1"
                          />
                          {birthday && (
                            <p className="text-xs text-gray-500 mt-1">
                              Age calculated from birthday: {calculatedAge}
                            </p>
                          )}
                        </div>
                        
                        <div>
                          <Label htmlFor="breed" className="text-sm font-medium">Breed</Label>
                          <Select 
                            value={breed} 
                            onValueChange={setBreed}
                            disabled={!editMode}
                          >
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select breed" />
                            </SelectTrigger>
                            <SelectContent>
                              {catBreeds.map((breedOption) => (
                                <SelectItem key={breedOption} value={breedOption}>
                                  {breedOption}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="gender" className="text-sm font-medium">Gender</Label>
                          <Select value={gender} onValueChange={setGender} disabled={!editMode}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select gender" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Male">Male</SelectItem>
                              <SelectItem value="Female">Female</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                          <Textarea 
                            id="description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Cat's personality, preferences, etc."
                            rows={3}
                            disabled={!editMode}
                            className="mt-1"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                          <Select value={status} onValueChange={setStatus} disabled={!editMode}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map((option) => (
                                <SelectItem key={option} value={option}>
                                  {option === 'NotListed' ? 'Not Listed' : option}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="flex items-center space-x-2 pt-4">
                          <Checkbox 
                            id="showOnAdoptablePage" 
                            checked={showOnAdoptablePage}
                            onCheckedChange={(checked) => setShowOnAdoptablePage(checked as boolean)} 
                            disabled={!editMode}
                          />
                          <Label 
                            htmlFor="showOnAdoptablePage" 
                            className={`font-medium cursor-pointer ${!editMode ? 'opacity-70' : ''}`}
                          >
                            Show on Adoptable Cats page
                          </Label>
                        </div>
                        
                        <div>
                          <Label htmlFor="medicalNotes" className="text-sm font-medium">Special Care Notes</Label>
                          <Textarea 
                            id="medicalNotes"
                            value={medicalNotes}
                            onChange={(e) => setMedicalNotes(e.target.value)}
                            placeholder="Any special care requirements or notes"
                            rows={3}
                            disabled={!editMode}
                            className="mt-1"
                          />
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="appearance" className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="color" className="text-sm font-medium">Color</Label>
                          <Select value={color} onValueChange={setColor} disabled={!editMode}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select color" />
                            </SelectTrigger>
                            <SelectContent>
                              {colorOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="pattern" className="text-sm font-medium">Pattern</Label>
                          <Select value={pattern} onValueChange={setPattern} disabled={!editMode}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select pattern" />
                            </SelectTrigger>
                            <SelectContent>
                              {patternOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="eyeColor" className="text-sm font-medium">Eye Color</Label>
                          <Select value={eyeColor} onValueChange={setEyeColor} disabled={!editMode}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select eye color" />
                            </SelectTrigger>
                            <SelectContent>
                              {eyeColorOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="coatType" className="text-sm font-medium">Coat Type</Label>
                          <Select value={coatType} onValueChange={setCoatType} disabled={!editMode}>
                            <SelectTrigger className="mt-1">
                              <SelectValue placeholder="Select coat type" />
                            </SelectTrigger>
                            <SelectContent>
                              {coatTypeOptions.map((option) => (
                                <SelectItem key={option} value={option}>{option}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div>
                          <Label htmlFor="weight" className="text-sm font-medium">Weight</Label>
                          <div className="flex items-center mt-1">
                            <Input
                              id="weight"
                              type="number"
                              value={weight}
                              onChange={(e) => setWeight(e.target.value)}
                              placeholder="e.g. 8"
                              disabled={!editMode}
                              className="rounded-r-none"
                              step="0.1"
                            />
                            <div className="bg-gray-100 border border-l-0 border-input px-3 py-2 text-sm rounded-r-md text-gray-600">
                              lbs
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </TabsContent>
                  
                  <TabsContent value="photos" className="space-y-6">
                    {editMode && (
                      <Card className="border border-dashed border-gray-300 bg-gray-50/50">
                        <CardContent className="pt-6">
                          <ImageUploader 
                            onImageUploaded={handleImageUploaded}
                            bucketName="cat-photos" 
                            folderPath="cat-photos"
                          />
                        </CardContent>
                      </Card>
                    )}
                    
                    {tempPhotoUrls.length > 0 && (
                      <div className="mt-6">
                        <Label className="text-sm font-medium mb-2 block">Photo Gallery</Label>
                        <PhotoSelector
                          photos={tempPhotoUrls}
                          onSelectPrimary={handlePrimaryPhotoSelect}
                          primaryIndex={primaryPhotoIndex}
                          onRemovePhoto={handleRemovePhoto}
                          editMode={editMode}
                        />
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="medical">
                    {isEditing && id ? (
                      <CatMedicalRecords catId={id} editMode={editMode} />
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <Stethoscope className="mx-auto h-12 w-12 text-gray-300 mb-3" />
                        <p>Save the cat first to add medical records</p>
                      </div>
                    )}
                  </TabsContent>
                  
                  {editMode && (
                    <div className="flex justify-end gap-4 mt-8">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isLoading}
                      >
                        Cancel
                      </Button>
                      <Button 
                        type="submit" 
                        disabled={isLoading}
                        className="flex items-center gap-2"
                      >
                        {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                        <Save className="h-4 w-4" />
                        {isEditing ? 'Save Changes' : 'Add Cat'}
                      </Button>
                    </div>
                  )}
                </form>
              </Tabs>
            )}
          </CardContent>
        </Card>
      </div>
      
      {/* Photo viewing modal */}
      <Dialog 
        open={!!selectedPhotoUrl} 
        onOpenChange={(open) => {
          if (!open) setSelectedPhotoUrl(null);
        }}
      >
        <DialogContent className="max-w-4xl p-0 bg-transparent border-0">
          <div className="relative bg-black/80 p-1 rounded-lg">
            <div className="flex justify-center items-center">
              <img 
                src={selectedPhotoUrl || ''} 
                alt="Cat photo" 
                className="max-h-[80vh] max-w-[90vw] object-contain rounded"
              />
            </div>
            <Button 
              className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-black/50 hover:bg-black/70 text-white"
              variant="ghost"
              size="sm"
              onClick={() => setSelectedPhotoUrl(null)}
            >
              &times;
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
};

export default AdminCatForm;
