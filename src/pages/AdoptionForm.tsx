
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import ApplicationHeader from '@/components/ui/ApplicationHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import getSupabaseClient from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useScrollToElement } from '@/hooks/use-scroll';
import { useAuth } from '@/contexts/AuthContext';

const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters.' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  city: z.string().min(2, { message: 'City is required' }),
  state: z.string().min(2, { message: 'State is required' }),
  zipCode: z.string().min(5, { message: 'ZIP code must be at least 5 characters' }),
  dateOfBirth: z.string().min(1, { message: 'Date of birth is required for verification purposes' }),
  
  // Living Situation
  homeType: z.string().min(2, { message: 'Please specify your housing type.' }),
  ownOrRent: z.enum(['own', 'rent']),
  landlordPermission: z.enum(['yes', 'no', 'n/a']).optional(),
  landlordName: z.string().optional(),
  landlordPhone: z.string().optional(),
  
  // Household Information
  adultsInHome: z.string().min(1, 'Required'),
  childrenInHome: z.string().min(1, 'Required'),
  childrenAges: z.string().optional(),
  allHouseholdAgree: z.enum(['yes', 'no']),
  
  // Cat Experience and Preferences
  whyAdopt: z.string().min(10, { message: 'Please tell us why you want to adopt.' }),
  catCareExperience: z.string().min(10, { message: 'Please describe your cat care experience.' }),
  previousPets: z.string().min(1, { message: 'Please tell us about your previous pets.' }),
  otherPets: z.string().optional(),
  specificCat: z.string().optional(),
  preferences: z.string().optional(),
  
  // Veterinary Information
  veterinarianName: z.string().optional(),
  veterinarianPhone: z.string().optional(),
  
  // Legal Requirements
  isOver18: z.boolean().refine(value => value === true, {
    message: 'You must be at least 18 years old to adopt.',
  }),
  homeVisitPermission: z.boolean().refine(value => value === true, {
    message: 'You must agree to a home visit.',
  }),
  animalControlDisclosure: z.boolean().refine(value => value === true, {
    message: 'You must answer truthfully about animal control confiscations.',
  }),
  felonyDisclosure: z.boolean().refine(value => value === true, {
    message: 'You must answer truthfully about felony convictions.',
  }),
  permissionToAdopt: z.boolean().refine(value => value === true, {
    message: 'You must confirm that you have permission to adopt.',
  }),
  agreesToTerms: z.boolean().refine(value => value === true, {
    message: 'You must agree to our adoption terms and conditions.',
  }),
  
  // References
  reference1Name: z.string().min(2, { message: 'Reference name is required' }),
  reference1Relation: z.string().min(2, { message: 'Please specify your relation to this reference' }),
  reference1Phone: z.string().min(10, { message: 'Reference phone number is required' }),
  reference2Name: z.string().optional(),
  reference2Relation: z.string().optional(),
  reference2Phone: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

const AdoptionForm: React.FC = () => {
  // Add the scroll hook to ensure page scrolls to top on load
  useScrollToElement();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user } = useAuth();
  
  // Get cat info from URL params if available
  const catId = searchParams.get('catId');
  const catName = searchParams.get('catName');

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: user?.email || '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zipCode: '',
      dateOfBirth: '',
      homeType: '',
      ownOrRent: 'rent',
      landlordPermission: 'n/a',
      landlordName: '',
      landlordPhone: '',
      adultsInHome: '',
      childrenInHome: '',
      childrenAges: '',
      allHouseholdAgree: 'yes',
      whyAdopt: '',
      catCareExperience: '',
      previousPets: '',
      otherPets: '',
      specificCat: catName || '',
      preferences: '',
      veterinarianName: '',
      veterinarianPhone: '',
      isOver18: false,
      homeVisitPermission: false,
      animalControlDisclosure: false,
      felonyDisclosure: false,
      permissionToAdopt: false,
      agreesToTerms: false,
      reference1Name: '',
      reference1Relation: '',
      reference1Phone: '',
      reference2Name: '',
      reference2Relation: '',
      reference2Phone: '',
    },
  });

  // Set specificCat field when catName changes
  useEffect(() => {
    if (catName) {
      form.setValue('specificCat', catName);
      
      // If the cat has a name, prefill the whyAdopt field with a starter sentence
      const currentWhyAdopt = form.getValues('whyAdopt');
      if (!currentWhyAdopt) {
        form.setValue('whyAdopt', `I'm interested in adopting ${catName}...`);
      }
    }
  }, [catName, form]);

  const onSubmit = async (values: FormData) => {
    setIsSubmitting(true);
    try {
      // Submit to Supabase
      const getSupabaseClient() = getSupabaseClient();
      const { error } = await getSupabaseClient().from('applications').insert({
        applicant_id: user?.id,
        application_type: 'adoption',
        status: 'pending',
        form_data: {
          ...values,
          catId: catId || null // Add catId to the form data if it exists
        },
      });

      if (error) throw error;
      
      toast({
        title: "Application Submitted",
        description: "Your adoption application has been received. We will contact you soon!",
      });
      
      // Redirect to home page or a thank you page
      navigate('/');
    } catch (error: any) {
      console.error('Error submitting form:', error);
      toast({
        title: "Submission Failed",
        description: "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO title="Adoption Application | Meow Rescue" description="Apply to adopt a cat from Meow Rescue. Our application helps us find the perfect match for both you and the cat." />
      
      <ApplicationHeader
        title="Adoption Application"
        subtitle="Please complete the form below to apply to adopt a cat from Meow Rescue."
      />
      
      <div className="container mx-auto py-16">
        <Card className="bg-white shadow-lg border-none max-w-3xl mx-auto hover:shadow-xl transition-all">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-meow-primary">Personal Information</CardTitle>
            <CardDescription className="text-base">
              We want to ensure our cats find the best homes. Please provide as much detail as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">First Name*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your first name" 
                            {...field} 
                            className="h-12 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          />
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
                        <FormLabel className="text-base">Last Name*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your last name" 
                            {...field} 
                            className="h-12 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Email Address*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your email address" 
                            {...field} 
                            className="h-12 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          />
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
                        <FormLabel className="text-base">Phone Number*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Your phone number" 
                            {...field} 
                            className="h-12 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Street Address*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your street address" 
                          {...field} 
                          className="h-12 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name="city"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">City*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="City" 
                            {...field} 
                            className="h-12 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          />
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
                        <FormLabel className="text-base">State*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="State" 
                            {...field} 
                            className="h-12 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="zipCode"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-base">ZIP Code*</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="ZIP Code" 
                            {...field} 
                            className="h-12 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Date of Birth* (Required for verification)</FormLabel>
                      <FormControl>
                        <Input 
                          type="date"
                          {...field}
                          className="h-12 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardHeader className="px-0">
                  <CardTitle className="text-2xl text-meow-primary">Living Situation</CardTitle>
                  <CardDescription className="text-base">
                    Information about your home helps us match you with the right cat.
                  </CardDescription>
                </CardHeader>
                
                <FormField
                  control={form.control}
                  name="homeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Housing Type*</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="House, Apartment, etc." 
                          {...field} 
                          className="h-12 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="ownOrRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Do you own or rent your home?*</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="own" />
                            </FormControl>
                            <FormLabel className="font-normal">Own</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="rent" />
                            </FormControl>
                            <FormLabel className="font-normal">Rent</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                {form.watch('ownOrRent') === 'rent' && (
                  <>
                    <FormField
                      control={form.control}
                      name="landlordPermission"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">If you rent, do you have permission to have cats?*</FormLabel>
                          <FormControl>
                            <RadioGroup
                              onValueChange={field.onChange}
                              defaultValue={field.value}
                              className="flex flex-col space-y-1"
                            >
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="yes" />
                                </FormControl>
                                <FormLabel className="font-normal">Yes</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="no" />
                                </FormControl>
                                <FormLabel className="font-normal">No</FormLabel>
                              </FormItem>
                              <FormItem className="flex items-center space-x-3 space-y-0">
                                <FormControl>
                                  <RadioGroupItem value="n/a" />
                                </FormControl>
                                <FormLabel className="font-normal">Not Applicable</FormLabel>
                              </FormItem>
                            </RadioGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    {form.watch('landlordPermission') === 'yes' && (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="landlordName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base">Landlord's Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Landlord's name" {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="landlordPhone"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel className="text-base">Landlord's Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Landlord's phone number" {...field} className="h-12" />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </>
                )}
                
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl text-meow-primary">Household Information</CardTitle>
                  <CardDescription className="text-base">
                    Tell us about the people living in your home.
                  </CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="adultsInHome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Number of adults in household*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" min="1" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="childrenInHome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Number of children in household*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" min="0" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch('childrenInHome') && form.watch('childrenInHome') !== '0' && (
                  <FormField
                    control={form.control}
                    name="childrenAges"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Ages of children</FormLabel>
                        <FormControl>
                          <Input placeholder="e.g., 5, 8, 12" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="allHouseholdAgree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Do all household members agree to adopting a cat?*</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="yes" />
                            </FormControl>
                            <FormLabel className="font-normal">Yes</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="no" />
                            </FormControl>
                            <FormLabel className="font-normal">No</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl text-meow-primary">Cat Preferences & Experience</CardTitle>
                  <CardDescription className="text-base">
                    Tell us about your experience with cats and preferences for adoption.
                  </CardDescription>
                </CardHeader>
                
                {/* Field to specify a cat */}
                <FormField
                  control={form.control}
                  name="specificCat"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Specific Cat You're Interested In</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Leave blank if you're not applying for a specific cat" 
                          {...field} 
                          className="h-12 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="preferences"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Cat Preferences</FormLabel>
                      <FormDescription>
                        If you don't have a specific cat in mind, please describe what you're looking for (age, temperament, etc.)
                      </FormDescription>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe what you're looking for in a cat." 
                          className="min-h-20 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          {...field} 
                        />
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
                      <FormLabel className="text-base">Why Do You Want to Adopt a Cat?*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please tell us why you would like to adopt a cat from Meow Rescue." 
                          className="min-h-40 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="catCareExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Cat Care Experience*</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your previous experience caring for cats." 
                          className="min-h-40 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="previousPets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Previous Pets*</FormLabel>
                      <FormDescription>
                        Please tell us about pets you've owned in the past, what happened to them, and their lifespan.
                      </FormDescription>
                      <FormControl>
                        <Textarea 
                          placeholder="Please describe your history with pet ownership." 
                          className="min-h-40 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="otherPets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Current Pets</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Do you have any other pets? If so, please list them and their ages." 
                          className="min-h-20 focus:border-meow-primary focus:ring focus:ring-meow-primary/20" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl text-meow-primary">Veterinary Reference</CardTitle>
                  <CardDescription className="text-base">
                    If you have a regular veterinarian, please provide their contact information.
                  </CardDescription>
                </CardHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="veterinarianName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Veterinarian's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Smith" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="veterinarianPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Veterinarian's Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} className="h-12" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl text-meow-primary">Personal References</CardTitle>
                  <CardDescription className="text-base">
                    Please provide at least one personal reference who can speak to your character and responsibility.
                  </CardDescription>
                </CardHeader>
                
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">Reference 1*</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="reference1Name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Name*</FormLabel>
                            <FormControl>
                              <Input placeholder="Full name" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="reference1Relation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Relationship*</FormLabel>
                            <FormControl>
                              <Input placeholder="Friend, coworker, etc." {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="reference1Phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Phone Number*</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h4 className="font-medium text-lg">Reference 2 (Optional)</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="reference2Name"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Full name" {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      
                      <FormField
                        control={form.control}
                        name="reference2Relation"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel className="text-base">Relationship</FormLabel>
                            <FormControl>
                              <Input placeholder="Friend, coworker, etc." {...field} className="h-12" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    
                    <FormField
                      control={form.control}
                      name="reference2Phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base">Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(123) 456-7890" {...field} className="h-12" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <CardHeader className="px-0">
                  <CardTitle className="text-2xl text-meow-primary">Legal Agreements</CardTitle>
                  <CardDescription className="text-base">
                    Please review and agree to the following terms.
                  </CardDescription>
                </CardHeader>
                
                <FormField
                  control={form.control}
                  name="isOver18"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-meow-primary data-[state=checked]:border-meow-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I confirm that I am 18 years of age or older.*</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="homeVisitPermission"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-meow-primary data-[state=checked]:border-meow-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I agree to a home visit by a Meow Rescue representative.*</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="animalControlDisclosure"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-meow-primary data-[state=checked]:border-meow-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I confirm that I have never had an animal removed from my care by animal control.*</FormLabel>
                        <FormDescription>If you have, please explain the circumstances in the "Why Adopt" section.</FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="felonyDisclosure"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-meow-primary data-[state=checked]:border-meow-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I confirm that I have never been convicted of a felony for animal cruelty.*</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="permissionToAdopt"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-meow-primary data-[state=checked]:border-meow-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I confirm that I have permission from my landlord or homeowner's association to adopt a cat.*</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreesToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 hover:bg-gray-50 transition-colors">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-meow-primary data-[state=checked]:border-meow-primary"
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I agree to the terms and conditions of adoption.*</FormLabel>
                        <FormDescription>
                          By checking this box, I agree to provide proper care, including food, water, shelter, exercise, and veterinary care; never declaw; return the cat to Meow Rescue if I can no longer keep it; and update contact information if it changes.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 text-lg hover:translate-y-[-2px] transition-all"
                  variant="meow"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default AdoptionForm;
