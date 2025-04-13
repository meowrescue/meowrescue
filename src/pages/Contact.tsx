
import React, { useState } from 'react';
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
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import NetlifyFormHiddenInput from '@/components/NetlifyFormHiddenInput';
import { MapPin, Phone, Mail, Clock } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const formSchema = z.object({
  name: z.string().min(2, {
    message: "Name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  subject: z.string().min(2, {
    message: "Subject must be at least 2 characters.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      subject: "",
      message: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true);
    
    try {
      // Submit to Supabase
      const { error } = await supabase
        .from('contact_messages')
        .insert([
          {
            name: values.name,
            email: values.email,
            message: values.message,
            status: 'New',
          },
        ]);
        
      if (error) throw error;
      
      // Submit to Netlify Forms as a backup
      const formData = new FormData();
      formData.append('form-name', 'contact');
      Object.entries(values).forEach(([key, value]) => {
        formData.append(key, value);
      });
      
      try {
        const response = await fetch('/', {
          method: 'POST',
          body: formData,
        });
        
        if (!response.ok) {
          console.log('Netlify form submission failed, but Supabase succeeded');
        }
      } catch (netlifyError) {
        console.log('Netlify form submission error, but Supabase succeeded', netlifyError);
      }
      
      // Reset form and show success message
      form.reset();
      setIsSubmitted(true);
      toast({
        title: "Message Sent",
        description: "We've received your message and will respond soon. Thank you!",
        duration: 5000,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
        duration: 5000,
      });
      console.error('Form submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto">
      {isSubmitted ? (
        <div className="text-center bg-green-50 rounded-lg p-6 border border-green-200">
          <h3 className="text-lg font-medium text-green-800 mb-2">Message Sent!</h3>
          <p className="text-green-700 mb-4">
            We've received your message and will respond soon. Thank you!
          </p>
          <Button
            onClick={() => setIsSubmitted(false)}
            variant="outline"
          >
            Send Another Message
          </Button>
        </div>
      ) : (
        <Form {...form}>
          <form 
            name="contact" 
            method="POST" 
            data-netlify="true"
            onSubmit={form.handleSubmit(onSubmit)} 
            className="space-y-6"
          >
            <NetlifyFormHiddenInput />
            
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Your name" {...field} />
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
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Your email address" type="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Subject</FormLabel>
                  <FormControl>
                    <Input placeholder="Message subject" {...field} />
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
                  <FormLabel>Message</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="How can we help you?" 
                      className="resize-none min-h-[150px]" 
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button 
              type="submit" 
              variant="meow" 
              size="lg" 
              className="w-full"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                  Sending...
                </>
              ) : (
                'Send Message'
              )}
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
};

const Contact = () => {
  return (
    <Layout>
      <SEO 
        title="Contact Us"
        description="Get in touch with Meow Rescue. We're here to answer your questions about cat adoption, volunteering, or donations."
      />
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Contact Us</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Have questions about adopting a cat, volunteering, or making a donation? 
              We're here to help. Reach out to us using the form below or contact us directly.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
            <div>
              <h2 className="text-xl font-semibold mb-6">Send Us a Message</h2>
              <ContactForm />
            </div>
            
            <div>
              <h2 className="text-xl font-semibold mb-6">Contact Information</h2>
              <div className="space-y-6">
                <div className="flex items-start space-x-4">
                  <MapPin className="h-6 w-6 text-meow-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Address</h3>
                    <p className="text-gray-600">
                      123 Whisker Lane<br />
                      Cattown, FL 33701
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Phone className="h-6 w-6 text-meow-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Phone</h3>
                    <p className="text-gray-600">
                      <a href="tel:7272570037" className="hover:text-meow-primary">
                        (727) 257-0037
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Mail className="h-6 w-6 text-meow-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Email</h3>
                    <p className="text-gray-600">
                      <a href="mailto:info@meowrescue.org" className="hover:text-meow-primary">
                        info@meowrescue.org
                      </a>
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <Clock className="h-6 w-6 text-meow-primary mt-1" />
                  <div>
                    <h3 className="font-medium">Hours</h3>
                    <p className="text-gray-600">
                      Monday - Friday: 9:00 AM - 5:00 PM<br />
                      Saturday: 10:00 AM - 4:00 PM<br />
                      Sunday: Closed
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Adoption visits by appointment only
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-4 bg-meow-primary/10 rounded-lg">
                <h3 className="font-medium mb-2">Emergency Cat Rescue</h3>
                <p className="text-sm">
                  For emergency situations involving cats in immediate danger, 
                  please call our emergency hotline at <a href="tel:7272570037" className="font-bold">(727) 257-0037</a>.
                </p>
              </div>
            </div>
          </div>
          
          <div className="rounded-lg overflow-hidden h-[400px] shadow-lg">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d224444.50887977478!2d-82.7584404681641!3d27.871543699999996!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88c2e5d9110d44df%3A0x93e15bff11a35ce4!2sSt.%20Petersburg%2C%20FL!5e0!3m2!1sen!2sus!4v1649375539278!5m2!1sen!2sus" 
              width="100%" 
              height="100%" 
              style={{ border: 0 }} 
              allowFullScreen 
              loading="lazy" 
              referrerPolicy="no-referrer-when-downgrade"
              title="Meow Rescue Location"
            />
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
