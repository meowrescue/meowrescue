
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { useScrollToElement } from '@/hooks/use-scroll';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  whyAdopt: z.string().min(10, { message: 'Please tell us why you want to adopt.' }),
  catCareExperience: z.string().min(10, { message: 'Please describe your cat care experience.' }),
  otherPets: z.string().optional(),
  housingType: z.string().min(2, { message: 'Please specify your housing type.' }),
  permissionToAdopt: z.boolean().refine((value) => value === true, {
    message: 'You must confirm that you have permission to adopt.',
  }),
  specificCat: z.string().optional(),
});

const AdoptionForm: React.FC = () => {
  // Add the scroll hook to ensure page scrolls to top on load
  useScrollToElement();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // Get cat info from URL params if available
  const catId = searchParams.get('catId');
  const catName = searchParams.get('catName');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      whyAdopt: '',
      catCareExperience: '',
      otherPets: '',
      housingType: '',
      permissionToAdopt: false,
      specificCat: catName || '',
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    try {
      // Add catId to the form values if it exists
      const submissionData = {
        ...values,
        ...(catId && { catId }),
      };
      
      // Here you would typically handle the form submission to Supabase
      console.log('Form values:', submissionData);
      
      // Simulate a submission delay
      await new Promise((resolve) => setTimeout(resolve, 1500));
      
      toast({
        title: "Application Submitted",
        description: "Your adoption application has been received. We will contact you soon!",
      });
      
      // Redirect to home page or a thank you page
      navigate('/');
    } catch (error) {
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
      
      <div className="bg-gradient-to-r from-meow-primary/10 to-meow-secondary/10 py-16 md:py-24 text-center animate-fade-in">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Adoption Application</h1>
          <div className="h-1 w-20 bg-meow-secondary mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please complete the form below to apply to adopt a cat from Meow Rescue.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-16">
        <Card className="bg-white shadow-lg border-none max-w-3xl mx-auto hover:shadow-xl transition-all">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-meow-primary">Adoption Application</CardTitle>
            <CardDescription className="text-base">
              We want to ensure our cats find the best homes. Please provide as much detail as possible.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Full Name</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Your full name" 
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
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Email Address</FormLabel>
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
                      <FormLabel className="text-base">Phone Number</FormLabel>
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
                
                <FormField
                  control={form.control}
                  name="address"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Address</FormLabel>
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
                  name="whyAdopt"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Why Do You Want to Adopt a Cat?</FormLabel>
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
                      <FormLabel className="text-base">Cat Care Experience</FormLabel>
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
                  name="otherPets"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Other Pets</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Do you have any other pets? If so, please list them and their ages." 
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
                  name="housingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Housing Type</FormLabel>
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
                        <FormLabel className="text-base">I confirm that I have permission from my landlord or homeowner's association to adopt a cat.</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 text-base hover:translate-y-[-2px] transition-all"
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
