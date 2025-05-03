
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import getSupabaseClient from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/contexts/AuthContext';
import ApplicationHeader from '@/components/ui/ApplicationHeader';

// Define form schema with Zod
const formSchema = z.object({
  // Personal Information
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  dateOfBirth: z.string().min(1, 'Date of birth is required for insurance purposes'),
  
  // Housing Information
  homeType: z.enum(['apartment', 'house', 'condo', 'other']),
  ownOrRent: z.enum(['own', 'rent']),
  landlordPermission: z.enum(['yes', 'no', 'n/a']),
  landlordName: z.string().optional(),
  landlordPhone: z.string().optional(),
  hasYard: z.enum(['yes', 'no']),
  yardFenced: z.enum(['yes', 'no', 'n/a']),
  
  // Household Information
  adultsInHome: z.string().min(1, 'Required'),
  childrenInHome: z.string().min(1, 'Required'),
  childrenAges: z.string().optional(),
  allHouseholdAgree: z.enum(['yes', 'no']),
  
  // Experience & Current Pets
  hasExperience: z.enum(['yes', 'no']),
  experienceDetails: z.string().optional(),
  hasOtherPets: z.enum(['yes', 'no']),
  otherPetsDetails: z.string().optional(),
  otherPetsSterilized: z.enum(['yes', 'no', 'n/a']),
  otherPetsVaccinated: z.enum(['yes', 'no', 'n/a']),
  
  // Foster Preferences
  fosterPreference: z.string(),
  hoursAtHome: z.string(),
  commitment: z.enum(['short', 'medium', 'long']),
  
  // Veterinary Information
  veterinarianName: z.string().optional(),
  veterinarianPhone: z.string().optional(),
  canAffordVetCare: z.enum(['yes', 'no']),
  
  // Emergency Contact
  emergencyContactName: z.string().min(2, 'Emergency contact name is required'),
  emergencyContactPhone: z.string().min(10, 'Emergency contact phone is required'),
  emergencyContactRelation: z.string().min(2, 'Please specify your relation to emergency contact'),

  // Additional Information
  additionalInfo: z.string().optional(),
  
  // Legal Requirements
  isOver18: z.boolean().refine(value => value === true, {
    message: 'You must be at least 18 years old to foster.',
  }),
  homeVisit: z.boolean().refine(value => value === true, {
    message: 'You must agree to a home visit.',
  }),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: 'You must agree to the terms and conditions',
  }),
  agreeToUpdates: z.boolean().refine(value => value === true, {
    message: 'You must agree to provide regular updates.',
  }),
  agreeToPhotos: z.boolean().refine(value => value === true, {
    message: 'You must agree to our photo release policy.',
  }),
  agreesToWaiver: z.boolean().refine(value => value === true, {
    message: 'You must agree to the liability waiver.',
  }),
});

type FormData = z.infer<typeof formSchema>;

const FosterForm = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with default values
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
      zip: '',
      dateOfBirth: '',
      homeType: 'apartment',
      ownOrRent: 'rent',
      landlordPermission: 'n/a',
      landlordName: '',
      landlordPhone: '',
      hasYard: 'no',
      yardFenced: 'n/a',
      adultsInHome: '',
      childrenInHome: '',
      childrenAges: '',
      allHouseholdAgree: 'yes',
      hasExperience: 'no',
      experienceDetails: '',
      hasOtherPets: 'no',
      otherPetsDetails: '',
      otherPetsSterilized: 'n/a',
      otherPetsVaccinated: 'n/a',
      fosterPreference: '',
      hoursAtHome: '',
      commitment: 'medium',
      veterinarianName: '',
      veterinarianPhone: '',
      canAffordVetCare: 'yes',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: '',
      additionalInfo: '',
      isOver18: false,
      homeVisit: false,
      agreeToTerms: false,
      agreeToUpdates: false,
      agreeToPhotos: false,
      agreesToWaiver: false,
    },
  });

  // Handle form submission
  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Submit to Supabase
      const { error } = await getSupabaseClient().from('applications').insert({
        applicant_id: user?.id,
        application_type: 'foster',
        status: 'pending',
        form_data: data,
      });

      if (error) throw error;

      // Show success toast
      toast({
        title: "Application Submitted",
        description: "Your foster application has been submitted successfully. We'll contact you soon.",
      });

      // Navigate to thank you or profile page
      navigate('/profile');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Error",
        description: error.message || "Failed to submit application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO title="Foster Application | Meow Rescue" />
      <ApplicationHeader
        title="Foster Application"
        subtitle="Thank you for your interest in fostering a cat! Please fill out this form so we can find the perfect match."
      />

      <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>
              Please provide your contact information so we can reach out to you.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>First Name*</FormLabel>
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
                        <FormLabel>Last Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Doe" {...field} />
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
                        <FormLabel>Email*</FormLabel>
                        <FormControl>
                          <Input placeholder="john.doe@example.com" {...field} />
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
                        <FormLabel>Phone Number*</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
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
                      <FormLabel>Date of Birth* (Required for insurance purposes)</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Address*</FormLabel>
                      <FormControl>
                        <Input placeholder="123 Main St" {...field} />
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
                        <FormLabel>City*</FormLabel>
                        <FormControl>
                          <Input placeholder="New York" {...field} />
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
                        <FormLabel>State*</FormLabel>
                        <FormControl>
                          <Input placeholder="NY" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="zip"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel>ZIP Code*</FormLabel>
                        <FormControl>
                          <Input placeholder="10001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <CardHeader className="px-0">
                  <CardTitle>Housing Information</CardTitle>
                  <CardDescription>Tell us about your living situation.</CardDescription>
                </CardHeader>

                <FormField
                  control={form.control}
                  name="homeType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>What type of home do you live in?*</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="apartment" />
                            </FormControl>
                            <FormLabel className="font-normal">Apartment</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="house" />
                            </FormControl>
                            <FormLabel className="font-normal">House</FormLabel>
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
                  name="ownOrRent"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do you own or rent your home?*</FormLabel>
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
                          <FormLabel>If you rent, do you have permission to have cats?*</FormLabel>
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
                              <FormLabel>Landlord's Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Landlord's name" {...field} />
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
                              <FormLabel>Landlord's Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Landlord's phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}
                  </>
                )}

                <FormField
                  control={form.control}
                  name="hasYard"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do you have a yard?*</FormLabel>
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

                {form.watch('hasYard') === 'yes' && (
                  <FormField
                    control={form.control}
                    name="yardFenced"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Is your yard fenced?*</FormLabel>
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
                )}

                <CardHeader className="px-0">
                  <CardTitle>Household Information</CardTitle>
                  <CardDescription>Tell us about the people living in your home.</CardDescription>
                </CardHeader>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="adultsInHome"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Number of adults in household*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="1" min="1" {...field} />
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
                        <FormLabel>Number of children in household*</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0" min="0" {...field} />
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
                  name="allHouseholdAgree"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do all household members agree to fostering a cat?*</FormLabel>
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
                  <CardTitle>Foster Information</CardTitle>
                  <CardDescription>Tell us more about your fostering capabilities.</CardDescription>
                </CardHeader>

                <FormField
                  control={form.control}
                  name="hasExperience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do you have experience fostering cats?*</FormLabel>
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

                {form.watch('hasExperience') === 'yes' && (
                  <FormField
                    control={form.control}
                    name="experienceDetails"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Please describe your experience</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Tell us about your previous fostering experience..."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="hasOtherPets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do you have other pets at home?*</FormLabel>
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

                {form.watch('hasOtherPets') === 'yes' && (
                  <>
                    <FormField
                      control={form.control}
                      name="otherPetsDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please describe your other pets</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us about your other pets, including their species, breed, age, and temperament..."
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="otherPetsSterilized"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Are your current pets spayed/neutered?*</FormLabel>
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
                    
                    <FormField
                      control={form.control}
                      name="otherPetsVaccinated"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Are your current pets up-to-date on vaccinations?*</FormLabel>
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
                  </>
                )}

                <FormField
                  control={form.control}
                  name="fosterPreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Do you have any preferences for the type of cat you'd like to foster?*</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="e.g., kittens, adult cats, pregnant cats, nursing mothers, special needs, etc."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="hoursAtHome"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How many hours per day are you typically at home?*</FormLabel>
                      <FormControl>
                        <Input placeholder="8" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="commitment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>How long are you willing to foster?*</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="short" />
                            </FormControl>
                            <FormLabel className="font-normal">Short-term (1-4 weeks)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="medium" />
                            </FormControl>
                            <FormLabel className="font-normal">Medium-term (1-3 months)</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="long" />
                            </FormControl>
                            <FormLabel className="font-normal">Long-term (3+ months)</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardHeader className="px-0">
                  <CardTitle>Veterinary Information</CardTitle>
                  <CardDescription>
                    Please provide information about your veterinarian.
                  </CardDescription>
                </CardHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="veterinarianName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Veterinarian's Name</FormLabel>
                        <FormControl>
                          <Input placeholder="Dr. Smith" {...field} />
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
                        <FormLabel>Veterinarian's Phone Number</FormLabel>
                        <FormControl>
                          <Input placeholder="(123) 456-7890" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="canAffordVetCare"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Are you financially prepared to provide emergency veterinary care if needed?*</FormLabel>
                      <FormDescription>
                        While Meow Rescue typically covers approved medical expenses, foster parents should be prepared for potential emergency situations.
                      </FormDescription>
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
                  <CardTitle>Emergency Contact</CardTitle>
                  <CardDescription>
                    Please provide information for someone we can contact in case of emergency.
                  </CardDescription>
                </CardHeader>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="emergencyContactName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Name*</FormLabel>
                        <FormControl>
                          <Input placeholder="Full name" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="emergencyContactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Emergency Contact Phone*</FormLabel>
                        <FormControl>
                          <Input placeholder="Phone number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="emergencyContactRelation"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Relationship to Emergency Contact*</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., Spouse, Parent, Friend" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="additionalInfo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Additional Information</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Is there anything else you'd like us to know about your fostering interest?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <CardHeader className="px-0">
                  <CardTitle>Agreements & Legal Requirements</CardTitle>
                  <CardDescription>
                    Please review and agree to the following terms.
                  </CardDescription>
                </CardHeader>
                
                <FormField
                  control={form.control}
                  name="isOver18"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I confirm that I am 18 years of age or older.*</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="homeVisit"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I agree to a home visit by a Meow Rescue representative.*</FormLabel>
                        <FormDescription>
                          This is required to ensure the foster home is safe and suitable for cats.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="agreeToTerms"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I agree to the terms and conditions of fostering*</FormLabel>
                        <FormDescription>
                          By checking this box, I acknowledge that the cat(s) I foster remain the property of Meow Rescue, and I will provide proper care for any cats placed in my foster home.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreeToUpdates"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>I agree to provide regular updates on the cats in my care.*</FormLabel>
                        <FormDescription>
                          This includes providing photos, health updates, and behavioral observations to help with potential adoption matches.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreeToPhotos"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Photo Release: I grant Meow Rescue permission to use photos of fostered cats for promotional purposes.*</FormLabel>
                        <FormDescription>
                          Photos and stories help our cats find forever homes.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreesToWaiver"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>Liability Waiver: I understand and accept the risks associated with fostering.*</FormLabel>
                        <FormDescription>
                          I understand that working with animals carries inherent risks. I willingly assume these risks and release Meow Rescue, its directors, officers, employees, and volunteers from all liability for any injury, loss, or damage connected with my fostering activities.
                        </FormDescription>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />

                <Button
                  type="submit"
                  className="w-full"
                  disabled={isSubmitting}
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

export default FosterForm;
