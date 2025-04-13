import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  whyFoster: z.string().min(10, { message: 'Please tell us why you want to foster.' }),
  catCareExperience: z.string().min(10, { message: 'Please describe your cat care experience.' }),
  otherPets: z.string().optional(),
  housingType: z.string().min(2, { message: 'Please specify your housing type.' }),
  fosterAgreement: z.boolean().refine((value) => value === true, {
    message: 'You must agree to the foster agreement.',
  }),
  timeCommitment: z.string().min(2, { message: 'Please specify your time commitment.' }),
  fosterTypePreference: z.enum(['kittens', 'adults', 'both'], {
    required_error: 'Please select your foster type preference.',
  }),
});

const FosterForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      whyFoster: '',
      catCareExperience: '',
      otherPets: '',
      housingType: '',
      fosterAgreement: false,
      timeCommitment: '',
      fosterTypePreference: 'both',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    // Here you would typically handle the form submission, e.g., sending the data to a server.
    console.log('Form values:', values);
    // Simulate a submission delay
    await new Promise((resolve) => setTimeout(resolve, 1500));
    setIsSubmitting(false);
    alert('Form submitted successfully!');
  };

  return (
    <Layout>
      <SEO title="Foster Application | Meow Rescue" description="Apply to become a foster parent for cats in need. Provide a temporary loving home until they find their forever families." />
      
      <div className="bg-gradient-to-r from-meow-primary/10 to-meow-secondary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Foster Application</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Help us save more lives by becoming a foster parent. Please complete the form below to apply.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-16">
        <Card className="bg-white shadow-lg border-none max-w-3xl mx-auto">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-meow-primary">Foster Application</CardTitle>
            <CardDescription className="text-base">
              Fostering saves lives by providing temporary homes for cats until they find their forever families.
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
                        <Input placeholder="Your full name" {...field} className="h-12" />
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
                        <Input placeholder="Your email address" {...field} className="h-12" />
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
                        <Input placeholder="Your phone number" {...field} className="h-12" />
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
                        <Input placeholder="Your street address" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="whyFoster"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Why Do You Want to Foster a Cat?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please tell us why you would like to foster a cat from Meow Rescue." className="min-h-40" {...field} />
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
                        <Textarea placeholder="Please describe your previous experience caring for cats." className="min-h-40" {...field} />
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
                        <Textarea placeholder="Do you have any other pets? If so, please list them and their ages." className="min-h-40" {...field} />
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
                        <Input placeholder="House, Apartment, etc." {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="timeCommitment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Time Commitment</FormLabel>
                      <FormControl>
                        <Input placeholder="How much time can you commit to fostering?" {...field} className="h-12" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="fosterTypePreference"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Foster Type Preference</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex flex-col space-y-1"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="kittens" id="kittens" />
                            </FormControl>
                            <FormLabel htmlFor="kittens">Kittens</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="adults" id="adults" />
                            </FormControl>
                            <FormLabel htmlFor="adults">Adults</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="both" id="both" />
                            </FormControl>
                            <FormLabel htmlFor="both">Both</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fosterAgreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I agree to abide by the Meow Rescue foster guidelines and policies.</FormLabel>
                        <FormMessage />
                      </div>
                    </FormItem>
                  )}
                />
                
                <Button 
                  type="submit" 
                  disabled={isSubmitting}
                  className="w-full h-12 text-base bg-meow-primary hover:bg-meow-primary/90 text-white"
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
