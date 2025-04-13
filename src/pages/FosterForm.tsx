
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { 
  Form, 
  FormControl, 
  FormDescription, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

// Form schema
const formSchema = z.object({
  firstName: z.string().min(2, { message: 'First name must be at least 2 characters' }),
  lastName: z.string().min(2, { message: 'Last name must be at least 2 characters' }),
  email: z.string().email({ message: 'Please enter a valid email address' }),
  phone: z.string().min(10, { message: 'Please enter a valid phone number' }),
  address: z.string().min(5, { message: 'Please enter your street address' }),
  city: z.string().min(2, { message: 'Please enter your city' }),
  state: z.string().min(2, { message: 'Please enter your state' }),
  zip: z.string().min(5, { message: 'Please enter a valid zip code' }),
  housingType: z.string().min(1, { message: 'Please select your housing type' }),
  ownRent: z.string().min(1, { message: 'Please select if you own or rent' }),
  landlordApproval: z.boolean().optional(),
  otherPets: z.string().min(1, { message: 'Please provide information about other pets' }),
  allergy: z.string().min(1, { message: 'Please answer if anyone has allergies' }),
  fosterLength: z.string().min(1, { message: 'Please select preferred foster duration' }),
  preferredAge: z.string().min(1, { message: 'Please select preferred age' }),
  isolation: z.string().min(1, { message: 'Please answer about isolation capabilities' }),
  experience: z.string(),
  additionalInfo: z.string().optional(),
  agree: z.boolean().refine(value => value === true, {
    message: 'You must agree to the terms',
  }),
});

const FosterForm = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      zip: '',
      housingType: '',
      ownRent: '',
      landlordApproval: false,
      otherPets: '',
      allergy: '',
      fosterLength: '',
      preferredAge: '',
      isolation: '',
      experience: '',
      additionalInfo: '',
      agree: false,
    },
  });

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('applications')
        .insert([
          {
            applicant_id: user?.id,
            application_type: 'foster',
            status: 'pending',
            form_data: {
              ...data,
              submission_date: new Date().toISOString(),
            },
          },
        ]);
      
      if (error) throw error;
      
      toast({
        title: 'Application Submitted',
        description: 'Thank you for your interest in fostering! We will review your application and get back to you soon.',
      });
      
      // Redirect to thank you page or home page
      navigate('/');
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Submission Failed',
        description: 'There was a problem submitting your application. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO 
        title="Foster Application | Meow Rescue" 
        description="Apply to become a foster parent for cats in need at Meow Rescue." 
      />

      <div className="bg-meow-primary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Foster Application</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thank you for your interest in fostering a cat with Meow Rescue. Please complete the form below to apply.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>Foster Application Form</CardTitle>
            <CardDescription>
              Please provide accurate information to help us match you with the right foster cat.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Personal Information</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
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
                            <Input placeholder="(555) 123-4567" {...field} />
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
                        <FormLabel>Street Address</FormLabel>
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
                        <FormItem className="col-span-2 md:col-span-2">
                          <FormLabel>City</FormLabel>
                          <FormControl>
                            <Input placeholder="New Port Richey" {...field} />
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
                            <Input placeholder="FL" {...field} />
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
                            <Input placeholder="34652" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Housing Information</h3>
                  
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
                    name="ownRent"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you own or rent your home?</FormLabel>
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
                  
                  {form.watch('ownRent') === 'rent' && (
                    <FormField
                      control={form.control}
                      name="landlordApproval"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I have approval from my landlord to have pets
                            </FormLabel>
                            <FormDescription>
                              We may request written proof of permission from your landlord.
                            </FormDescription>
                          </div>
                        </FormItem>
                      )}
                    />
                  )}
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Household Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="otherPets"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Do you have other pets in your home?</FormLabel>
                        <FormControl>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no_pets" />
                              </FormControl>
                              <FormLabel className="font-normal">No other pets</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cats_only" />
                              </FormControl>
                              <FormLabel className="font-normal">Cats only</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="dogs_only" />
                              </FormControl>
                              <FormLabel className="font-normal">Dogs only</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="cats_and_dogs" />
                              </FormControl>
                              <FormLabel className="font-normal">Both cats and dogs</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="other_pets" />
                              </FormControl>
                              <FormLabel className="font-normal">Other pets</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="allergy"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Does anyone in your household have allergies to cats?</FormLabel>
                        <FormControl>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="no" />
                              </FormControl>
                              <FormLabel className="font-normal">No</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes_mild" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes, but mild</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes_severe" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes, severe</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Fostering Preferences</h3>
                  
                  <FormField
                    control={form.control}
                    name="fosterLength"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>How long are you willing to foster?</FormLabel>
                        <FormControl>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="short_term" />
                              </FormControl>
                              <FormLabel className="font-normal">2-4 weeks</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="medium_term" />
                              </FormControl>
                              <FormLabel className="font-normal">1-3 months</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="long_term" />
                              </FormControl>
                              <FormLabel className="font-normal">3+ months</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="flexible" />
                              </FormControl>
                              <FormLabel className="font-normal">Flexible / as needed</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="preferredAge"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>What age of cats would you prefer to foster?</FormLabel>
                        <FormControl>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="bottle_babies" />
                              </FormControl>
                              <FormLabel className="font-normal">Bottle babies (0-4 weeks)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="kittens" />
                              </FormControl>
                              <FormLabel className="font-normal">Kittens (1-6 months)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="adults" />
                              </FormControl>
                              <FormLabel className="font-normal">Adults (6 months - 7 years)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="seniors" />
                              </FormControl>
                              <FormLabel className="font-normal">Seniors (7+ years)</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="any_age" />
                              </FormControl>
                              <FormLabel className="font-normal">Any age</FormLabel>
                            </FormItem>
                          </RadioGroup>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="isolation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Are you able to keep foster cats isolated from other pets if needed?</FormLabel>
                        <FormControl>
                          <RadioGroup 
                            onValueChange={field.onChange} 
                            defaultValue={field.value}
                            className="flex flex-col space-y-1"
                          >
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes_separate_room" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes, in a separate room</FormLabel>
                            </FormItem>
                            <FormItem className="flex items-center space-x-3 space-y-0">
                              <FormControl>
                                <RadioGroupItem value="yes_limited" />
                              </FormControl>
                              <FormLabel className="font-normal">Yes, but limited space</FormLabel>
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
                </div>
                
                <div className="space-y-6">
                  <h3 className="text-lg font-medium">Additional Information</h3>
                  
                  <FormField
                    control={form.control}
                    name="experience"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Previous cat experience</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please describe any previous experience you have with cats, including if you've fostered before."
                            className="min-h-[100px]"
                            {...field}
                          />
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
                        <FormLabel>Anything else you'd like to share?</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Any additional information that might help us match you with the right foster cat."
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
                  name="agree"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel>
                          I agree to care for the foster cat as instructed
                        </FormLabel>
                        <FormDescription>
                          By checking this box, I agree to provide care as instructed by Meow Rescue, including administering medications if needed, providing food and shelter, and keeping the cat indoors at all times.
                        </FormDescription>
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button type="submit" className="w-full" disabled={isSubmitting}>
                  {isSubmitting ? 'Submitting...' : 'Submit Application'}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex justify-center">
            <p className="text-sm text-gray-500">
              Thank you for your interest in fostering with Meow Rescue!
            </p>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default FosterForm;
