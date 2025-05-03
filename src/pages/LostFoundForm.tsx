
import React, { useState, useEffect } from "react";
import { useNavigate, Link, useParams } from "react-router-dom";
import Layout from "../components/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/contexts/AuthContext";
import getSupabaseClient from '@/integrations/supabase/client';
import { useToast } from "@/hooks/use-toast";
import { ChevronLeft, Upload, X, Loader2 } from "lucide-react";
import { LostFoundPost } from "@/types/supabase";

type FormData = {
  title: string;
  description: string;
  location: string;
  status: "lost" | "found" | "reunited" | "archived";
  pet_type: string;
  pet_name: string;
  date_occurred: string;
  contact_info: string;
};

const LostFoundForm = () => {
  const { id } = useParams<{ id: string }>();
  const isEditMode = Boolean(id);
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setFormData] = useState<FormData>({
    title: "",
    description: "",
    location: "",
    status: "lost",
    pet_type: "",
    pet_name: "",
    date_occurred: new Date().toISOString().split("T")[0],
    contact_info: "",
  });

  const [photosToUpload, setPhotosToUpload] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>([]);
  const [photosToDelete, setPhotosToDelete] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditMode);

  useEffect(() => {
    // Redirect to login if not authenticated
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create or edit posts.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Load post data if in edit mode
    if (isEditMode && id) {
      fetchPostData();
    }
  }, [user, id]);

  const fetchPostData = async () => {
    try {
      const { data, error } = await getSupabaseClient()
        .from("lost_found_posts")
        .select("*")
        .eq("id", id)
        .single();

      if (error) {
        throw error;
      }

      const postData = data as unknown as LostFoundPost;
      
      if (postData.profile_id !== user?.id) {
        toast({
          title: "Unauthorized",
          description: "You can only edit your own posts.",
          variant: "destructive",
        });
        navigate("/lost-found");
        return;
      }

      // Format the date from ISO to yyyy-mm-dd for input
      const formattedDate = postData.date_occurred ? new Date(postData.date_occurred).toISOString().split("T")[0] : "";

      setFormData({
        title: postData.title || "",
        description: postData.description || "",
        location: postData.location || "",
        status: postData.status || "lost",
        pet_type: postData.pet_type || "",
        pet_name: postData.pet_name || "",
        date_occurred: formattedDate,
        contact_info: postData.contact_info || "",
      });

      if (postData.photos_urls) {
        setExistingPhotos(postData.photos_urls);
      }
    } catch (error) {
      console.error("Error fetching post:", error);
      toast({
        title: "Error",
        description: "Failed to load post data. Please try again.",
        variant: "destructive",
      });
      navigate("/lost-found");
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { id, value } = e.target;
    setFormData((prev) => ({ ...prev, [id]: value }));
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newPhotos = Array.from(e.target.files);
      // Limit to 5 photos total (existing + new - to be deleted)
      const totalPhotos = existingPhotos.length + photosToUpload.length - photosToDelete.length;
      
      if (totalPhotos + newPhotos.length > 5) {
        toast({
          title: "Too many photos",
          description: "You can upload a maximum of 5 photos per post.",
          variant: "destructive",
        });
        return;
      }
      
      setPhotosToUpload((prev) => [...prev, ...newPhotos]);
    }
  };

  const removeNewPhoto = (index: number) => {
    setPhotosToUpload((prev) => prev.filter((_, i) => i !== index));
  };

  const removeExistingPhoto = (url: string) => {
    setExistingPhotos((prev) => prev.filter((p) => p !== url));
    setPhotosToDelete((prev) => [...prev, url]);
  };

  const uploadPhotos = async (): Promise<string[]> => {
    if (photosToUpload.length === 0) return [];

    const uploadedUrls: string[] = [];
    
    for (const photo of photosToUpload) {
      const fileExt = photo.name.split(".").pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}_${Date.now()}.${fileExt}`;
      const filePath = `${user!.id}/${fileName}`;

      const { data, error } = await getSupabaseClient().storage
        .from("lost_found_photos")
        .upload(filePath, photo);

      if (error) {
        console.error("Error uploading photo:", error);
        throw new Error("Failed to upload one or more photos.");
      }

      const { data: urlData } = getSupabaseClient().storage
        .from("lost_found_photos")
        .getPublicUrl(filePath);

      uploadedUrls.push(urlData.publicUrl);
    }

    return uploadedUrls;
  };

  const deletePhotos = async () => {
    if (photosToDelete.length === 0) return;

    for (const url of photosToDelete) {
      // Extract the file path from the URL
      const urlObj = new URL(url);
      const pathParts = urlObj.pathname.split("/");
      const bucketName = pathParts[2]; // Adjust based on your Supabase URL structure
      const filePath = pathParts.slice(3).join("/");

      if (bucketName && filePath) {
        await getSupabaseClient().storage.from("lost_found_photos").remove([filePath]);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please log in to create or edit posts.",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    // Validate form
    if (!formData.title || !formData.description || !formData.location || !formData.pet_type || !formData.date_occurred) {
      toast({
        title: "Missing information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // Upload new photos if any
      let photoUrls: string[] = [];
      if (photosToUpload.length > 0) {
        photoUrls = await uploadPhotos();
      }

      // Combine with existing photos that weren't removed
      const allPhotoUrls = [...existingPhotos, ...photoUrls];

      if (isEditMode && id) {
        // Delete removed photos if any
        if (photosToDelete.length > 0) {
          await deletePhotos();
        }

        // Update post
        const { error } = await getSupabaseClient()
          .from("lost_found_posts")
          .update({
            title: formData.title,
            description: formData.description,
            location: formData.location,
            status: formData.status,
            pet_type: formData.pet_type,
            pet_name: formData.pet_name || null,
            date_occurred: formData.date_occurred,
            contact_info: formData.contact_info,
            photos_urls: allPhotoUrls,
          })
          .eq("id", id);

        if (error) {
          throw error;
        }

        toast({
          title: "Post updated",
          description: "Your post has been updated successfully.",
        });
      } else {
        // Create new post
        const { data, error } = await getSupabaseClient()
          .from("lost_found_posts")
          .insert({
            profile_id: user.id,
            title: formData.title,
            description: formData.description,
            location: formData.location,
            status: formData.status,
            pet_type: formData.pet_type,
            pet_name: formData.pet_name || null,
            date_occurred: formData.date_occurred,
            contact_info: formData.contact_info,
            photos_urls: allPhotoUrls,
          })
          .select();

        if (error) {
          throw error;
        }

        toast({
          title: "Post created",
          description: "Your post has been created successfully.",
        });
      }

      // Navigate back to the post or list
      navigate(isEditMode ? `/lost-found/${id}` : "/lost-found");
    } catch (error: any) {
      console.error("Error saving post:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to save your post. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse max-w-2xl mx-auto">
            <div className="h-10 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-10 bg-gray-200 rounded w-full"></div>
                </div>
              ))}
              <div className="h-10 bg-gray-200 rounded w-32 mt-6"></div>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        <Button
          asChild
          variant="outline"
          className="mb-6"
          size="sm"
        >
          <Link to="/lost-found">
            <ChevronLeft className="mr-1" size={16} /> Back to Lost & Found
          </Link>
        </Button>

        <SectionHeading
          title={isEditMode ? "Edit Post" : "Create New Post"}
          subtitle={isEditMode ? "Update your lost or found pet information" : "Share information about a lost or found pet"}
          centered
        />

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
          <div className="grid grid-cols-1 gap-6">
            <div>
              <Label htmlFor="title" className="block mb-1">Title*</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={handleChange}
                placeholder="E.g., Lost black cat in Forest Hills"
                required
              />
            </div>

            <div>
              <Label htmlFor="status" className="block mb-1">Status*</Label>
              <select
                id="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full h-10 rounded-md border border-input bg-background px-3 py-2"
                required
              >
                <option value="lost">Lost Pet</option>
                <option value="found">Found Pet</option>
                <option value="reunited">Reunited</option>
              </select>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="pet_type" className="block mb-1">Pet Type*</Label>
                <Input
                  id="pet_type"
                  value={formData.pet_type}
                  onChange={handleChange}
                  placeholder="E.g., Cat, Dog, Bird, etc."
                  required
                />
              </div>

              <div>
                <Label htmlFor="pet_name" className="block mb-1">Pet Name (if known)</Label>
                <Input
                  id="pet_name"
                  value={formData.pet_name}
                  onChange={handleChange}
                  placeholder="Pet's name"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="block mb-1">Description*</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={handleChange}
                placeholder="Please provide a detailed description of the pet, including color, breed, size, distinctive features, etc."
                rows={5}
                required
              />
            </div>

            <div>
              <Label htmlFor="location" className="block mb-1">Location*</Label>
              <Input
                id="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="E.g., Near Central Park, Main St & 5th Ave, etc."
                required
              />
            </div>

            <div>
              <Label htmlFor="date_occurred" className="block mb-1">Date*</Label>
              <Input
                type="date"
                id="date_occurred"
                value={formData.date_occurred}
                onChange={handleChange}
                max={new Date().toISOString().split("T")[0]}
                required
              />
            </div>

            <div>
              <Label htmlFor="contact_info" className="block mb-1">Contact Information</Label>
              <Input
                id="contact_info"
                value={formData.contact_info}
                onChange={handleChange}
                placeholder="Your phone number or email (if different from account)"
              />
              <div className="text-sm text-gray-500 mt-1">
                If left blank, your account email will be used as contact information.
              </div>
            </div>

            <div>
              <Label className="block mb-1">Photos (Max 5)</Label>
              <div className="mt-2 mb-4">
                <Label
                  htmlFor="photo-upload"
                  className="cursor-pointer inline-flex items-center gap-2 border border-dashed border-gray-300 rounded-lg p-4 w-full justify-center text-gray-600 hover:bg-gray-50"
                >
                  <Upload size={20} />
                  <span>Click to upload photos</span>
                  <Input
                    id="photo-upload"
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </Label>
              </div>

              {/* Display existing photos */}
              {existingPhotos.length > 0 && (
                <div className="mb-4">
                  <h3 className="text-sm font-medium mb-2">Current Photos:</h3>
                  <div className="flex flex-wrap gap-3">
                    {existingPhotos.map((url, index) => (
                      <div key={`existing-${index}`} className="relative w-20 h-20">
                        <img
                          src={url}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeExistingPhoto(url)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Display new photos to be uploaded */}
              {photosToUpload.length > 0 && (
                <div>
                  <h3 className="text-sm font-medium mb-2">New Photos to Upload:</h3>
                  <div className="flex flex-wrap gap-3">
                    {photosToUpload.map((file, index) => (
                      <div key={`new-${index}`} className="relative w-20 h-20">
                        <img
                          src={URL.createObjectURL(file)}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover rounded"
                        />
                        <button
                          type="button"
                          onClick={() => removeNewPhoto(index)}
                          className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <Button
              type="submit"
              variant="meow"
              size="lg"
              disabled={isSubmitting}
              className="mt-4"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />{" "}
                  {isEditMode ? "Updating..." : "Submitting..."}
                </>
              ) : (
                isEditMode ? "Update Post" : "Create Post"
              )}
            </Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default LostFoundForm;
