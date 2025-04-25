import React from 'react';
import Layout from '@/components/Layout';
import ContactForm from '@/components/ContactForm';
import { Mail, Phone, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import SEO from '@/components/SEO';
import PageHeader from '@/components/ui/PageHeader';
import SectionHeading from '@/components/ui/SectionHeading';

const Contact = () => {
  // Create structured data for this page
  const contactPageStructuredData = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    "name": "Contact Meow Rescue",
    "description": "Get in touch with Meow Rescue. We're here to answer your questions about cat adoption, fostering, volunteering, and more.",
    "url": "https://meowrescue.org/contact",
    "mainEntity": {
      "@type": "Organization",
      "name": "Meow Rescue",
      "telephone": "(727) 257-0037",
      "email": "info@meowrescue.org",
      "openingHoursSpecification": [
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          "opens": "09:00",
          "closes": "17:00"
        },
        {
          "@type": "OpeningHoursSpecification",
          "dayOfWeek": ["Saturday"],
          "opens": "10:00",
          "closes": "16:00"
        }
      ]
    }
  };
  
  return (
    <Layout>
      <SEO 
        title="Contact Us | Meow Rescue"
        description="Get in touch with Meow Rescue. We're here to answer your questions about cat adoption, fostering, volunteering, and more."
        canonicalUrl="/contact"
        structuredData={contactPageStructuredData}
        keywords="contact meow rescue, cat rescue contact, animal shelter contact, pet adoption contact, florida cat rescue"
      />
      
      <PageHeader
        title="Get in Touch"
        subtitle="Have questions about adoption, fostering, or ways to help? We'd love to hear from you!"
      />
      
      <div className="relative">
        <div className="absolute inset-0 bg-gradient-to-b from-meow-primary/5 to-transparent h-[500px] -z-10" />
        
        {/* Remove mt-16 from container, reduce py-16 to py-8, and remove extra mt-16 on grid */}
        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-meow-primary mb-6">Send Us a Message</h2>
                <ContactForm />
              </div>
            </div>
            <div className="space-y-6 flex flex-col">
              <Card className="overflow-hidden border-none shadow-sm bg-gradient-to-br from-meow-primary/5 to-white flex-grow">
                <CardContent className="p-8">
                  <h3 className="text-2xl font-bold text-meow-primary mb-6">Contact Information</h3>
                  <div className="space-y-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-meow-primary/10">
                        <Phone className="h-6 w-6 text-meow-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Call Us</p>
                        <a href="tel:7272570037" className="text-gray-600 hover:text-meow-primary transition-colors">
                          (727) 257-0037
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-meow-primary/10">
                        <Mail className="h-6 w-6 text-meow-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Email Us</p>
                        <a href="mailto:info@meowrescue.org" className="text-gray-600 hover:text-meow-primary transition-colors">
                          info@meowrescue.org
                        </a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="p-3 rounded-xl bg-meow-primary/10">
                        <Clock className="h-6 w-6 text-meow-primary" />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Hours</p>
                        <div className="text-gray-600 mt-1 space-y-1">
                          <p>Monday - Friday: 9AM - 5PM</p>
                          <p>Saturday: 10AM - 4PM</p>
                          <p>Sunday: Closed</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="overflow-hidden border-none shadow-sm">
                <CardContent className="p-8 bg-gradient-to-br from-meow-secondary/5 to-white">
                  <h3 className="text-2xl font-bold text-meow-primary mb-4">Need Immediate Help?</h3>
                  <p className="text-gray-600">
                    For emergency situations or urgent inquiries, please call our hotline.
                    We're here to help!
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
