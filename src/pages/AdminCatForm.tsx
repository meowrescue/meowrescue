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
import { ArrowLeft, Upload, Loader2, Edit, ImageIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import ImageUploader from '@/components/ImageUploader';
import CatMedicalRecords from '@/components/admin/CatMedicalRecords';
import SectionHeading from '@/components/ui/SectionHeading';
import PhotoSelector from '@/components/admin/PhotoSelector';

const AdminCatForm: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const isEditing = !!id;
  const [editMode, setEditMode] = useState(!id); // Start in edit mode for new cats, view mode for existing
  
  // Form state
  const [name, setName] = useState('');
  const [ageEstimate, setAgeEstimate] = useState('');
  const [breed, setBreed] = useState('');
  const [gender, setGender] = useState('');
  const [description, setDescription] = useState('');
  const [medicalNotes, setMedicalNotes] = useState('');
  const [status, setStatus] = useState('Available');
  const [internalStatus, setInternalStatus] = useState('Alive');
  const [photoUrls, setPhotoUrls] = useState<string[]>([]);
  const [tempPhotoUrls, setTempPhotoUrls] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showOnAdoptablePage, setShowOnAdoptablePage] = useState(true);
  
  // New state for photo viewing
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string | null>(null);
  const [primaryPhotoIndex, setPrimaryPhotoIndex] = useState(0);
  const [birthday, setBirthday] = useState<string>('');
  
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
      
      const { data, error } = await supabase
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
      setInternalStatus(cat.internal_status || 'Alive');
      setPhotoUrls(cat.photos_urls || []);
      setTempPhotoUrls(cat.photos_urls || []);
      // The showOnAdoptablePage checkbox is tied to the status
      setShowOnAdoptablePage(cat.status === 'Available');
      setBirthday(cat.birthday ? new Date(cat.birthday).toISOString().split('T')[0] : '');
      setPrimaryPhotoIndex(0); // Set to first photo by default
      setColor(cat.color || '');
      setPattern(cat.pattern || '');
      setEyeColor(cat.eye_color || '');
      setCoatType(cat.coat_type || '');
      setWeight(cat.weight || '');
    }
  }, [cat]);
  
  // Create cat mutation
  const createCatMutation = useMutation({
    mutationFn: async (catData: any) => {
      const { data, error } = await supabase
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
        internal_status: internalStatus,
        photos_urls: reorderedPhotos,
        birthday: birthday || null,
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
    "Mixed Breed"
  ];

  // Add handler for primary photo selection
  const handlePrimaryPhotoSelect = (index: number) => {
    setPrimaryPhotoIndex(index);
  };
  
  return (
    <AdminLayout title={isEditing ? (editMode ? "Edit Cat" : "View Cat") : "Add Cat"}>
      <SEO title={`${isEditing ? (editMode ? "Edit" : "View") : "Add"} Cat | Meow Rescue Admin`} />
      
      <div className="w-full mx-auto py-4 sm:py-6 pt-24 sm:pt-24"> {/* Increased top padding to fix navbar overlap */}
        <Button 
          variant="outline" 
          onClick={() => navigate('/admin/cats')} 
          className="mb-4 sm:mb-6 flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Cats
        </Button>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-xl sm:text-2xl font-bold">
              {isEditing ? `${editMode ? 'Edit' : 'View'} ${cat?.name || 'Cat'}` : 'Add New Cat'}
            </CardTitle>
            {isEditing && (
              <Button 
                variant={editMode ? "outline" : "default"} 
                onClick={() => setEditMode(!editMode)}
                className="flex items-center gap-2"
              >
                {editMode ? "Cancel Editing" : <><Edit className="h-4 w-4" /> Edit</>}
              </Button>
            )}
          </CardHeader>
          <CardContent>
            {isCatLoading ? (
              <div className="flex justify-center py-8 sm:py-12">
                <Loader2 className="animate-spin h-8 sm:h-12 w-8 sm:w-12 text-meow-primary" />
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Name *</Label>
                      <Input 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Cat's name"
                        disabled={!editMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ageEstimate">Age Estimate</Label>
                      <Input 
                        id="ageEstimate"
                        value={ageEstimate}
                        onChange={(e) => setAgeEstimate(e.target.value)}
                        placeholder="e.g. 2 years, 6 months"
                        disabled={!editMode}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="birthday">Birthday (if known)</Label>
                      <Input
                        type="date"
                        id="birthday"
                        value={birthday}
                        onChange={(e) => setBirthday(e.target.value)}
                        disabled={!editMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="breed">Breed</Label>
                      <Select 
                        value={breed} 
                        onValueChange={setBreed}
                        disabled={!editMode}
                      >
                        <SelectTrigger>
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
                    
                    <div className="space-y-2">
                      <Label htmlFor="gender">Gender</Label>
                      <Select value={gender} onValueChange={setGender} disabled={!editMode}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select gender" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Male">Male</SelectItem>
                          <SelectItem value="Female">Female</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="internalStatus">Internal Status (Not Public)</Label>
                      <Select value={internalStatus} onValueChange={setInternalStatus} disabled={!editMode}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select internal status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Alive">Alive</SelectItem>
                          <SelectItem value="Deceased">Deceased</SelectItem>
                          <SelectItem value="Missing">Missing</SelectItem>
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
                  </div>
                  
                  <div className="space-y-3 sm:space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="description">Description</Label>
                      <Textarea 
                        id="description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Cat's personality, preferences, etc."
                        rows={4}
                        disabled={!editMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="medicalNotes">Special Care Notes</Label>
                      <Textarea 
                        id="medicalNotes"
                        value={medicalNotes}
                        onChange={(e) => setMedicalNotes(e.target.value)}
                        placeholder="Any special care requirements or notes"
                        rows={4}
                        disabled={!editMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="weight">Weight</Label>
                      <Input
                        id="weight"
                        value={weight}
                        onChange={(e) => setWeight(e.target.value)}
                        placeholder="e.g. 8 lbs"
                        disabled={!editMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="color">Color</Label>
                      <Input
                        id="color"
                        value={color}
                        onChange={(e) => setColor(e.target.value)}
                        placeholder="e.g. Black and White"
                        disabled={!editMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="pattern">Pattern</Label>
                      <Input
                        id="pattern"
                        value={pattern}
                        onChange={(e) => setPattern(e.target.value)}
                        placeholder="e.g. Tabby, Solid, Tuxedo"
                        disabled={!editMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="eyeColor">Eye Color</Label>
                      <Input
                        id="eyeColor"
                        value={eyeColor}
                        onChange={(e) => setEyeColor(e.target.value)}
                        placeholder="e.g. Green, Blue, Gold"
                        disabled={!editMode}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="coatType">Coat Type</Label>
                      <Input
                        id="coatType"
                        value={coatType}
                        onChange={(e) => setCoatType(e.target.value)}
                        placeholder="e.g. Short, Medium, Long"
                        disabled={!editMode}
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3 sm:space-y-4">
                  <SectionHeading 
                    title="Photos" 
                    centered={false} 
                    className="flex items-center pt-2 text-3xl text-meow-primary font-bold"
                  />
                  
                  {editMode && (
                    <div className="mt-2">
                      <ImageUploader 
                        onImageUploaded={handleImageUploaded}
                        bucketName="cat-photos" 
                        folderPath="cat-photos"
                      />
                    </div>
                  )}
                  
                  {/* Replace existing photo preview with PhotoSelector */}
                  {tempPhotoUrls.length > 0 && (
                    <PhotoSelector
                      photos={tempPhotoUrls}
                      onSelectPrimary={handlePrimaryPhotoSelect}
                      primaryIndex={primaryPhotoIndex}
                      onRemovePhoto={handleRemovePhoto}
                      editMode={editMode}
                    />
                  )}
                </div>
                
                {editMode && (
                  <CardFooter className="flex flex-col sm:flex-row sm:justify-end gap-3 sm:gap-4 px-0 pt-4 pb-0">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleCancelEdit}
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      Cancel
                    </Button>
                    <Button 
                      type="submit" 
                      disabled={isLoading}
                      className="w-full sm:w-auto"
                    >
                      {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                      {isEditing ? 'Update Cat' : 'Add Cat'}
                    </Button>
                  </CardFooter>
                )}
              </form>
            )}
          
            {isEditing && id && (
              <div className="mt-8">
                <CatMedicalRecords catId={id} editMode={editMode} />
              </div>
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
