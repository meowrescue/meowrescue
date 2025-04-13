
import React, { useState } from 'react';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Instagram, Facebook, Twitter } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Contact: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Create FormData object for Netlify
      const formDataObj = new FormData();
      formDataObj.append('form-name', 'contact');
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value);
      });

      // Submit the form data to Netlify
      const response = await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams(formDataObj as any).toString()
      });

      if (response.ok) {
        // Reset form
        setFormData({
          name: '',
          email: '',
          subject: '',
          message: ''
        });
        
        toast({
          title: "Message Sent!",
          description: "We'll get back to you as soon as possible.",
          variant: "default",
        });
      } else {
        throw new Error('Form submission failed');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Something went wrong",
        description: "Please try again or contact us directly via email.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Contact Us" 
          subtitle="We'd love to hear from you"
          centered
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
          <div>
            <h2 className="text-2xl font-bold text-meow-primary mb-6">Get In Touch</h2>
            <p className="text-gray-700 mb-8">
              Have questions about our cats, adoption process, or how you can help? We're here to assist you. 
              Fill out the form and we'll get back to you as soon as possible.
            </p>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <MapPin size={20} className="text-meow-primary mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-gray-700">New Port Richey, Pasco County, Florida (Moon Lake vicinity)</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Mail size={20} className="text-meow-primary mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Email</h3>
                  <a href="mailto:info@meowrescue.org" className="text-gray-700 hover:text-meow-primary">
                    info@meowrescue.org
                  </a>
                </div>
              </div>
              
              <div className="flex items-start">
                <Phone size={20} className="text-meow-primary mt-1 mr-3 flex-shrink-0" />
                <div>
                  <h3 className="font-medium">Phone</h3>
                  <a href="tel:7272570037" className="text-gray-700 hover:text-meow-primary">
                    (727) 257-0037
                  </a>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="font-medium mb-3">Follow Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="bg-meow-primary/10 p-2 rounded-full text-meow-primary hover:bg-meow-primary hover:text-white transition-colors">
                  <Facebook size={20} />
                </a>
                <a href="#" className="bg-meow-primary/10 p-2 rounded-full text-meow-primary hover:bg-meow-primary hover:text-white transition-colors">
                  <Instagram size={20} />
                </a>
                <a href="#" className="bg-meow-primary/10 p-2 rounded-full text-meow-primary hover:bg-meow-primary hover:text-white transition-colors">
                  <Twitter size={20} />
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <form 
              name="contact" 
              method="POST" 
              data-netlify="true"
              onSubmit={handleSubmit}
              className="bg-white p-8 rounded-lg shadow-md"
            >
              {/* Hidden Netlify form input */}
              <input type="hidden" name="form-name" value="contact" />
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                    placeholder="John Smith"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                    placeholder="john@example.com"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                    placeholder="Adoption Inquiry"
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={5}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                    placeholder="Your message here..."
                    required
                  ></textarea>
                </div>
                
                <Button 
                  type="submit" 
                  variant="meow" 
                  size="full"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-2xl font-bold text-meow-primary mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-meow-primary mb-2">How can I adopt a cat from Meow Rescue?</h3>
              <p className="text-gray-700">
                Visit our <a href="/cats" className="text-meow-primary hover:underline">Adoptable Cats</a> page to see our current cats available for adoption. 
                Then check out our <a href="/adopt" className="text-meow-primary hover:underline">Adoption Process</a> page for details on next steps.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-meow-primary mb-2">Do you accept stray or surrendered cats?</h3>
              <p className="text-gray-700">
                Our intake capacity is limited as we are a home-based rescue. We prioritize local cats in urgent need, 
                but our ability to take in new cats depends on available space, resources, and foster homes. 
                Please contact us to discuss your specific situation.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-meow-primary mb-2">How can I help besides adopting?</h3>
              <p className="text-gray-700">
                There are many ways to help! You can donate, volunteer, foster, or spread the word about our rescue. 
                Visit our <a href="/volunteer" className="text-meow-primary hover:underline">Get Involved</a> page to learn more.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
