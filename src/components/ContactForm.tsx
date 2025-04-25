
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  subject: z.string().min(2, { message: 'Subject must be at least 2 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });

  const onSubmit = async (values: ContactFormValues) => {
    setIsSubmitting(true);
    
    try {
      console.log("Submitting contact form with values:", values);
      
      // Insert the contact message into the database - using the correct enum case (New)
      const { data, error } = await supabase
        .from('contact_messages')
        .insert([{
          name: values.name,
          email: values.email,
          subject: values.subject,
          message: values.message,
          status: 'New', // Correctly use 'New' to match the enum type in the database
          received_at: new Date().toISOString()
        }]);
      
      if (error) {
        console.error('Error submitting contact form:', error);
        throw error;
      }
      
      console.log("Contact form submitted successfully:", data);
      
      toast({
        title: "Message Sent",
        description: "Thank you for your message. We'll get back to you soon!",
      });
      
      // Reset the form
      form.reset({
        name: '',
        email: '',
        subject: '',
        message: '',
      });
      
    } catch (error: any) {
      console.error('Error submitting contact form:', error);
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6" aria-label="Contact form">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-meow-dark">Name</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your name" 
                    {...field} 
                    className="h-12" 
                    aria-required="true"
                    aria-invalid={!!form.formState.errors.name}
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
                <FormLabel className="text-meow-dark">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="Your email address" 
                    {...field} 
                    className="h-12"
                    type="email"
                    aria-required="true" 
                    aria-invalid={!!form.formState.errors.email}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="subject"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-meow-dark">Subject</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Message subject" 
                  {...field} 
                  className="h-12"
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.subject}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-meow-dark">Message</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="How can we help you?"
                  {...field}
                  rows={6}
                  className="resize-none"
                  aria-required="true"
                  aria-invalid={!!form.formState.errors.message}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full md:w-auto px-8 py-3 text-base font-medium bg-meow-primary hover:bg-meow-primary/90 text-white"
          aria-label={isSubmitting ? 'Sending message...' : 'Send message'}
        >
          {isSubmitting ? 'Sending...' : 'Send Message'}
        </Button>
      </form>
    </Form>
  );
}
