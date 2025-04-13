
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import CustomNavbar from '@/components/CustomNavbar';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';

const formSchema = z.object({
  firstName: z.string().min(2, { message: "First name must be at least 2 characters." }),
  lastName: z.string().min(2, { message: "Last name must be at least 2 characters." }),
  email: z.string().email({ message: "Please enter a valid email address." }),
  phone: z.string().min(10, { message: "Please enter a valid phone number." }),
  address: z.string().min(5, { message: "Please enter your full address." }),
  city: z.string().min(2, { message: "Please enter your city." }),
  state: z.string().min(2, { message: "Please enter your state." }),
  zip: z.string().min(5, { message: "Please enter a valid ZIP code." }),
  housingType: z.string().min(1, { message: "Please select your housing type." }),
  isRenting: z.boolean(),
  hasPermission: z.boolean().optional(),
  hasChildren: z.boolean(),
  childrenAges: z.string().optional(),
  hasPets: z.boolean(),
  petsDescription: z.string().optional(),
  catPreferences: z.string(),
  activityLevel: z.string(),
  whyAdopt: z.string().min(10, { message: "Please tell us why you want to adopt." }),
  otherInfo: z.string().optional(),
  agreeTerms: z.boolean().refine(val => val === true, {
    message: "You must agree to the terms and conditions."
  }),
});

type FormValues = z.infer<typeof formSchema>;

const AdoptionForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: user?.email || "",
      phone: "",
      address: "",
      city: "",
      state: "",
      zip: "",
      housingType: "",
      isRenting: false,
      hasPermission: false,
      hasChildren: false,
      childrenAges: "",
      hasPets: false,
      petsDescription: "",
      catPreferences: "",
      activityLevel: "",
      whyAdopt: "",
      otherInfo: "",
      agreeTerms: false,
    },
  });

  const watchIsRenting = form.watch("isRenting");
  const watchHasChildren = form.watch("hasChildren");
  const watchHasPets = form.watch("hasPets");

  const onSubmit = async (data: FormValues) => {
    if (!user) {
      toast({
        title: "Authentication required",
        description: "Please sign in to submit an application.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }

    setIsSubmitting(true);

    try {
      // Save the application to Supabase
      const { error } = await supabase.from('applications').insert({
        applicant_id: user.id,
        application_type: 'adoption',
        status: 'submitted',
        form_data: data,
      });

      if (error) throw error;

      toast({
        title: "Application submitted",
        description: "Thank you for your adoption application! We'll review it soon.",
      });

      navigate('/adopt');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission error",
        description: error.message || "Failed to submit your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <SEO title="Adoption Application | Meow Rescue" description="Apply to adopt a cat from Meow Rescue" />
      <CustomNavbar />
      <div className="bg-gray-50 min-h-screen pt-24 pb-12">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-3xl font-bold text-center text-meow-primary mb-8">Adoption Application</h1>
            
            <Card>
              <CardHeader>
                <CardTitle>Cat Adoption Application</CardTitle>
                <CardDescription>
                  Thank you for your interest in adopting a cat from Meow Rescue. Please fill out this application completely so we can find the perfect match for you.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Personal Information</h3>
                      
                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="firstName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>First Name</FormLabel>
                              <FormControl>
                                <Input placeholder="John" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="lastName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Last Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Doe" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input placeholder="email@example.com" type="email" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="phone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Phone Number</FormLabel>
                              <FormControl>
                                <Input placeholder="(123) 456-7890" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Residence Information</h3>
                      
                      <FormField
                        control={form.control}
                        name="address"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Address</FormLabel>
                            <FormControl>
                              <Input placeholder="123 Main St" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
                        <FormField
                          control={form.control}
                          name="city"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>City</FormLabel>
                              <FormControl>
                                <Input placeholder="Anytown" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="state"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>State</FormLabel>
                              <FormControl>
                                <Input placeholder="CA" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="zip"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>ZIP Code</FormLabel>
                              <FormControl>
                                <Input placeholder="12345" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>

                      <FormField
                        control={form.control}
                        name="housingType"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Housing Type</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="house" />
                                  </FormControl>
                                  <FormLabel className="font-normal">House</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="apartment" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Apartment</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="condo" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Condo</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="other" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Other</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="isRenting"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I am renting my home
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      {watchIsRenting && (
                        <FormField
                          control={form.control}
                          name="hasPermission"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I have permission from my landlord to have pets
                                </FormLabel>
                              </div>
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Household Information</h3>
                      
                      <FormField
                        control={form.control}
                        name="hasChildren"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                There are children in my household
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      {watchHasChildren && (
                        <FormField
                          control={form.control}
                          name="childrenAges"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Ages of children</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., 5, 8, 12" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}

                      <FormField
                        control={form.control}
                        name="hasPets"
                        render={({ field }) => (
                          <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                            <FormControl>
                              <Checkbox
                                checked={field.value}
                                onCheckedChange={field.onChange}
                              />
                            </FormControl>
                            <div className="space-y-1 leading-none">
                              <FormLabel>
                                I currently have other pets
                              </FormLabel>
                            </div>
                          </FormItem>
                        )}
                      />

                      {watchHasPets && (
                        <FormField
                          control={form.control}
                          name="petsDescription"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Describe your current pets</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Types of pets, ages, temperament, etc." 
                                  className="min-h-[80px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      )}
                    </div>

                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold">Cat Preferences</h3>
                      
                      <FormField
                        control={form.control}
                        name="catPreferences"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>What kind of cat are you looking for?</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Age preference, personality, etc." 
                                className="min-h-[80px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="activityLevel"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Preferred Activity Level</FormLabel>
                            <FormControl>
                              <RadioGroup
                                onValueChange={field.onChange}
                                defaultValue={field.value}
                                className="flex flex-col space-y-1"
                              >
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="very-active" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Very Active</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="moderately-active" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Moderately Active</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="calm" />
                                  </FormControl>
                                  <FormLabel className="font-normal">Calm/Laid Back</FormLabel>
                                </FormItem>
                                <FormItem className="flex items-center space-x-3 space-y-0">
                                  <FormControl>
                                    <RadioGroupItem value="no-preference" />
                                  </FormControl>
                                  <FormLabel className="font-normal">No Preference</FormLabel>
                                </FormItem>
                              </RadioGroup>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="whyAdopt"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Why do you want to adopt a cat?</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Tell us why you're interested in adopting" 
                                className="min-h-[120px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={form.control}
                        name="otherInfo"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Additional Information</FormLabel>
                            <FormControl>
                              <Textarea 
                                placeholder="Anything else you'd like us to know?" 
                                className="min-h-[100px]"
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I affirm that all information provided is accurate and complete. I understand 
                              that providing false information may result in my application being denied.
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default AdoptionForm;
