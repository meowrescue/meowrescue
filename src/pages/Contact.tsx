
import React from 'react';
import Layout from '@/components/Layout';
import ContactForm from '@/components/ContactForm';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import ContactMap from '@/components/ContactMap';
import SEO from '@/components/SEO';

const Contact = () => {
  return (
    <Layout>
      <SEO 
        title="Contact Us | Meow Rescue"
        description="Get in touch with Meow Rescue. We're here to answer your questions about cat adoption, fostering, volunteering, and more."
      />
      
      <div className="container mx-auto py-16 px-4 mt-16">
        <div className="text-center mb-12">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Contact Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We'd love to hear from you! Whether you have questions about adoption, 
            fostering, or ways to support our mission, we're here to help.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-6 text-meow-primary">Send Us a Message</h2>
            <ContactForm />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold mb-6 text-meow-primary">Find Us</h2>
            <ContactMap />
            
            <div className="mt-8 space-y-6">
              <div className="flex items-start">
                <div className="mr-4 bg-meow-primary/10 p-3 rounded-full">
                  <MapPin className="h-6 w-6 text-meow-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Address</h3>
                  <p className="text-gray-600 mt-1">1234 Meow Street, Kittyville, CA 90210</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 bg-meow-primary/10 p-3 rounded-full">
                  <Phone className="h-6 w-6 text-meow-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Phone</h3>
                  <p className="text-gray-600 mt-1">(123) 456-7890</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 bg-meow-primary/10 p-3 rounded-full">
                  <Mail className="h-6 w-6 text-meow-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Email</h3>
                  <p className="text-gray-600 mt-1">info@meowrescue.org</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <div className="mr-4 bg-meow-primary/10 p-3 rounded-full">
                  <Clock className="h-6 w-6 text-meow-primary" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">Hours</h3>
                  <div className="text-gray-600 mt-1">
                    <p>Monday - Friday: 9AM - 5PM</p>
                    <p>Saturday: 10AM - 4PM</p>
                    <p>Sunday: Closed</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
