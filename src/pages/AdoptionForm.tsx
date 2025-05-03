import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import PageHeader from '@/components/ui/PageHeader';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import getSupabaseClient from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { useScrollToElement } from '@/hooks/use-scroll';

// Define form schema with Zod
const formSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Please enter a valid email'),
  phone: z.string().min(10, 'Please enter a valid phone number'),
  address: z.string().min(5, 'Address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  zip: z.string().min(5, 'ZIP code is required'),
  homeType: z.enum(['apartment', 'house', 'condo', 'other']),
  rentOrOwn: z.enum(['rent', 'own']),
  landlordPermission: z.boolean().optional().default(false),
  landlordName: z.string().optional(),
  landlordPhone: z.string().optional(),
  adultsInHome: z.string(),
  childrenInHome: z.string(),
  hasOtherPets: z.enum(['yes', 'no']),
  otherPetsDetails: z.string().optional(),
  previousPetExperience: z.string(),
  veterinarianInfo: z.string().optional(),
  whyAdopt: z.string().min(10, 'Please tell us why you want to adopt'),
  primaryCaregiver: z.string(),
  hoursAlone: z.string(),
  willingToTrain: z.boolean(),
  keepUpdated: z.boolean(),
  returnPolicy: z.boolean().refine(value => value === true, {
    message: 'You must agree to the return policy',
  }),
  agreeToTerms: z.boolean().refine(value => value === true, {
    message: 'You must agree to the terms and conditions',
  }),
  specificCat: z.string().optional(),
  catId: z.string().optional(),
}).refine((data) => {
  // If renting, landlord information is required
  if (data.rentOrOwn === 'rent' && !data.landlordPermission) {
    return false;
  }
  return true;
}, {
  message: "If you're renting, you must confirm landlord permission",
  path: ["landlordPermission"],
});

type FormData = z.infer<typeof formSchema>;

const AdoptionForm = () => {
  // Add the scroll hook to ensure page scrolls to top on load
  useScrollToElement();
  
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get cat info from URL params if available
  const catId = searchParams.get('catId');
  const catName = searchParams.get('catName');

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
      homeType: 'house',
      rentOrOwn: 'own',
      landlordPermission: false,
      landlordName: '',
      landlordPhone: '',
      adultsInHome: '1',
      childrenInHome: '0',
      hasOtherPets: 'no',
      otherPetsDetails: '',
      previousPetExperience: '',
      veterinarianInfo: '',
      whyAdopt: '',
      primaryCaregiver: '',
      hoursAlone: '',
      willingToTrain: true,
      keepUpdated: true,
      returnPolicy: false,
      agreeToTerms: false,
      specificCat: catName || '',
      catId: catId || '',
    },
  });

  // Show/hide landlord fields based on rent/own selection
  const rentOrOwn = form.watch('rentOrOwn');
  const hasOtherPets = form.watch('hasOtherPets');

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
    
    if (catId) {
      form.setValue('catId', catId);
    }
  }, [catName, catId, form]);

  const onSubmit = async (data: FormData) => {
    setIsSubmitting(true);
    try {
      // Submit to Supabase
      const { error } = await getSupabaseClient().from('applications').insert({
        applicant_id: user?.id,
        application_type: 'adoption',
        status: 'pending',
        form_data: data,
        cat_id: data.catId || null,
      });

      if (error) throw error;

      // Show success toast
      toast({
        title: "Application Submitted",
        description: "Your adoption application has been received. We will contact you soon!",
      });
      
      // Redirect to thank you page
      navigate('/thank-you-adoption');
    } catch (error: any) {
      console.error('Error submitting application:', error);
      toast({
        title: "Submission Failed",
        description: error.message || "There was a problem submitting your application. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO title="Adoption Application | Meow Rescue" 
           description="Apply to adopt a cat from Meow Rescue. Complete our application form to begin the adoption process." />
      
      <PageHeader
        title="Adoption Application"
        subtitle="Find your perfect feline companion"
      />
      
      <div className="container mx-auto py-8 px-4 md:px-6 max-w-4xl">
        <Card className="border shadow-sm">
          <CardHeader>
            <CardTitle>Adoption Application</CardTitle>
            <CardDescription>
              Please complete all fields below. This information helps us find the perfect match for both you and our cats.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Personal Information Section */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="firstName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>First Name*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your first name" {...field} />
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
                            <Input placeholder="Enter your last name" {...field} />
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
                            <Input placeholder="Enter your email address" {...field} />
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
                            <Input placeholder="Enter your phone number" {...field} />
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
                        <FormLabel>Street Address*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter your street address" {...field} />
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
                            <Input placeholder="City" {...field} />
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
                            <Input placeholder="State" {...field} />
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
                            <Input placeholder="ZIP Code" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Housing Information Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Housing Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="homeType"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Type of Home*</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
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
                    name="rentOrOwn"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you rent or own your home?*</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
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

                  {/* Conditionally show landlord information if renting */}
                  {rentOrOwn === 'rent' && (
                    <div className="space-y-4 pl-4 border-l-2 border-gray-200">
                      <FormField
                        control={form.control}
                        name="landlordPermission"
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
                                I confirm I have permission from my landlord to have a cat*
                              </FormLabel>
                            </div>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <FormField
                          control={form.control}
                          name="landlordName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Landlord/Property Manager Name</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter name" {...field} />
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
                              <FormLabel>Landlord/Property Manager Phone</FormLabel>
                              <FormControl>
                                <Input placeholder="Enter phone number" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="adultsInHome"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Number of Adults in Home*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter number" type="number" min="1" {...field} />
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
                          <FormLabel>Number of Children in Home*</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter number" type="number" min="0" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                {/* Pet Experience Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Pet Experience</h3>
                  
                  <FormField
                    control={form.control}
                    name="hasOtherPets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you have other pets?*</FormLabel>
                        <FormControl>
                          <RadioGroup
                            onValueChange={field.onChange}
                            defaultValue={field.value}
                            className="flex flex-col space-y-1 sm:flex-row sm:space-x-4 sm:space-y-0"
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

                  {/* Conditionally show other pets details */}
                  {hasOtherPets === 'yes' && (
                    <FormField
                      control={form.control}
                      name="otherPetsDetails"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Please list all other pets in your home*</FormLabel>
                          <FormDescription>
                            Include species, breed, age, gender, and if they are spayed/neutered
                          </FormDescription>
                          <FormControl>
                            <Textarea
                              placeholder="Example: Dog, Lab mix, 5 years, female, spayed"
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
                    name="previousPetExperience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous Pet Experience*</FormLabel>
                        <FormDescription>
                          Tell us about your experience with cats or other pets
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="Describe any past experiences with pets, including how long you've had them and what happened to them."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="veterinarianInfo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Current Veterinarian Information</FormLabel>
                        <FormDescription>
                          Name, clinic, and phone number
                        </FormDescription>
                        <FormControl>
                          <Textarea
                            placeholder="If you have a current veterinarian, please provide their information."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Adoption Details Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Adoption Details</h3>
                  
                  {/* Show specific cat field if provided in URL params */}
                  {catName && (
                    <FormField
                      control={form.control}
                      name="specificCat"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cat You're Interested In</FormLabel>
                          <FormControl>
                            <Input {...field} readOnly className="bg-gray-50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  )}

                  <FormField
                    control={form.control}
                    name="whyAdopt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Why do you want to adopt a cat?*</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Please tell us why you want to adopt a cat and what you're looking for in a feline companion."
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="primaryCaregiver"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Who will be the primary caregiver for the cat?*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter name(s)" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="hoursAlone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How many hours will the cat be left alone each day?*</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter number of hours" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="willingToTrain"
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
                            I'm willing to invest time in training if needed
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="keepUpdated"
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
                            I'm willing to provide updates on my adopted cat
                          </FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Agreements Section */}
                <div className="space-y-4 pt-4 border-t">
                  <h3 className="text-lg font-medium">Agreements</h3>
                  
                  <FormField
                    control={form.control}
                    name="returnPolicy"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md bg-gray-50">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree that if I can no longer keep the cat, I will return it to Meow Rescue*
                          </FormLabel>
                          <FormDescription>
                            We require that all adopted cats be returned to us if you can no longer keep them, rather than being rehomed elsewhere or surrendered to another shelter.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="agreeToTerms"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 p-4 border rounded-md">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>
                            I agree to the terms and conditions of adoption*
                          </FormLabel>
                          <FormDescription>
                            By checking this box, I certify that the information provided is true and accurate. I understand that Meow Rescue has the right to deny any application. I agree to provide proper care, including veterinary care, food, water, shelter, and companionship for any cat I adopt.
                          </FormDescription>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

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

export default AdoptionForm;
