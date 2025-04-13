import React, { useState } from 'react';
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

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  whyVolunteer: z.string().min(10, { message: 'Please tell us why you want to volunteer.' }),
  experience: z.string().optional(),
  availability: z.string().min(10, { message: 'Please describe your availability.' }),
  skills: z.string().optional(),
  agreement: z.boolean().refine((value) => value === true, {
    message: 'You must agree to our volunteer agreement.',
  }),
});

const VolunteerForm: React.FC = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      whyVolunteer: '',
      experience: '',
      availability: '',
      skills: '',
      agreement: false,
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
      <SEO title="Volunteer Application | Meow Rescue" description="Apply to become a volunteer at Meow Rescue. Join our team and help make a difference in the lives of cats." />
      
      <div className="bg-gradient-to-r from-meow-primary/10 to-meow-secondary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Volunteer Application</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Thank you for your interest in volunteering with Meow Rescue. Please complete the form below to apply.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-16">
        <Card className="bg-white shadow-lg border-none max-w-3xl mx-auto">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-meow-primary">Volunteer Application</CardTitle>
            <CardDescription className="text-base">
              Your time and dedication help us save more cats. Please tell us about yourself and how you'd like to help.
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
                  name="whyVolunteer"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Why Do You Want to Volunteer?</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please tell us why you would like to volunteer at Meow Rescue." className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Relevant Experience</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please describe any relevant experience you have, such as working with animals or in a rescue organization." className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="availability"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Availability</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please describe your availability, including days and times you are available to volunteer." className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Skills</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please list any skills you have that would be helpful to Meow Rescue, such as photography, writing, or social media management." className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="agreement"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <div className="space-y-1 leading-none">
                        <FormLabel className="text-base">I agree to abide by Meow Rescue's volunteer policies and procedures.</FormLabel>
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

export default VolunteerForm;
