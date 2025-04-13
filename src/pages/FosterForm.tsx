import React, { useState } from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

// Define the form schema
const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  phone: z.string().min(10, { message: 'Phone number must be at least 10 characters.' }),
  address: z.string().min(5, { message: 'Address must be at least 5 characters.' }),
  experience: z.string().min(10, { message: 'Experience must be at least 10 characters.' }),
  availability: z.string().min(10, { message: 'Availability must be at least 10 characters.' }),
  reason: z.string().min(10, { message: 'Reason must be at least 10 characters.' })
});

const FosterForm: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      address: '',
      experience: '',
      availability: '',
      reason: ''
    }
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('foster_applications')
        .insert([
          {
            name: values.name,
            email: values.email,
            phone: values.phone,
            address: values.address,
            experience: values.experience,
            availability: values.availability,
            reason: values.reason,
            status: 'New',
            submitted_at: new Date().toISOString()
          }
        ]);
        
      if (error) throw error;

      // Success - show toast and reset form
      toast({
        title: 'Application Submitted',
        description: 'We have received your application and will get back to you soon.',
      });
      
      form.reset();
      setIsSubmitted(true);
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: 'Application Not Submitted',
        description: 'There was a problem submitting your application. Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO title="Foster Application | Meow Rescue" description="Apply to foster cats for Meow Rescue. Help us by providing a temporary home for cats in need until they find their forever homes." />
      
      <div className="bg-gradient-to-r from-meow-primary/10 to-meow-secondary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Foster Application</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Please complete the form below to apply to become a foster for Meow Rescue.
          </p>
        </div>
      </div>
      
      <div className="container mx-auto py-16">
        <Card className="bg-white shadow-lg border-none max-w-3xl mx-auto hover-card-effect">
          <CardHeader className="pb-6">
            <CardTitle className="text-2xl text-meow-primary">Foster Application</CardTitle>
            <CardDescription className="text-base">
              Fill out the form below to apply to become a foster for Meow Rescue.
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
                      <FormLabel className="text-base">Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your name" {...field} className="h-12" />
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
                      <FormLabel className="text-base">Email</FormLabel>
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
                      <FormLabel className="text-base">Phone</FormLabel>
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
                  name="experience"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Experience</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Please describe your experience with cats" className="min-h-40" {...field} />
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
                        <Textarea placeholder="When are you available to foster?" className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reason"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-base">Reason</FormLabel>
                      <FormControl>
                        <Textarea placeholder="Why do you want to foster cats?" className="min-h-40" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </form>
            </Form>
          </CardContent>
          <CardFooter>
            <Button 
              type="submit" 
              form="foster-form"
              disabled={isSubmitting || isSubmitted}
              className="w-full h-12 text-base bg-meow-primary hover:bg-meow-primary/90 text-white"
            >
              {isSubmitting ? 'Submitting...' : isSubmitted ? 'Application Submitted' : 'Submit Application'}
            </Button>
          </CardFooter>
        </Card>
      </div>
    </Layout>
  );
};

export default FosterForm;
