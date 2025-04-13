
import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { Button } from "@/components/ui/button";
import { MapPin, Phone, Mail, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

const Contact: React.FC = () => {
  const [formStatus, setFormStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [formMessage, setFormMessage] = useState('');
  
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setFormStatus('submitting');
    
    // Simulate form submission to Netlify
    setTimeout(() => {
      // 90% chance of success for demo purposes
      const success = Math.random() > 0.1;
      
      if (success) {
        setFormStatus('success');
        setFormMessage('Thank you for your message. We will get back to you as soon as possible.');
        (event.target as HTMLFormElement).reset();
      } else {
        setFormStatus('error');
        setFormMessage('There was an error sending your message. Please try again or contact us directly by phone or email.');
      }
    }, 1500);
  };
  
  return (
    <Layout>
      <Helmet>
        <title>Contact Meow Rescue | Get in Touch</title>
        <meta name="description" content="Contact Meow Rescue for questions about adoption, fostering, volunteering, or donating. We're a home-based cat rescue serving Pasco County, Florida." />
      </Helmet>
      
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Contact Us" 
          subtitle="We'd love to hear from you"
          centered
        />
        
        <div className="max-w-4xl mx-auto mb-16">
          <p className="text-center text-lg mb-8">
            Have questions about adoption, fostering, volunteering, or donating? 
            We're here to help! Choose the method that works best for you to get in touch.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex p-4 bg-meow-primary/10 rounded-full mb-6">
              <Phone className="h-8 w-8 text-meow-primary" />
            </div>
            <h3 className="text-xl font-bold text-meow-primary mb-4">Call Us</h3>
            <p className="text-gray-600 mb-4">
              For immediate assistance, give us a call.
            </p>
            <a 
              href="tel:7272570037" 
              className="text-xl font-medium text-meow-secondary hover:underline"
            >
              (727) 257-0037
            </a>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex p-4 bg-meow-primary/10 rounded-full mb-6">
              <Mail className="h-8 w-8 text-meow-primary" />
            </div>
            <h3 className="text-xl font-bold text-meow-primary mb-4">Email Us</h3>
            <p className="text-gray-600 mb-4">
              Send us an email and we'll get back to you within 1-2 business days.
            </p>
            <a 
              href="mailto:info@meowrescue.org" 
              className="text-xl font-medium text-meow-secondary hover:underline"
            >
              info@meowrescue.org
            </a>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md text-center">
            <div className="inline-flex p-4 bg-meow-primary/10 rounded-full mb-6">
              <MapPin className="h-8 w-8 text-meow-primary" />
            </div>
            <h3 className="text-xl font-bold text-meow-primary mb-4">Location</h3>
            <p className="text-gray-600 mb-4">
              We are a home-based rescue serving Pasco County, Florida.
            </p>
            <p className="text-lg font-medium">New Port Richey, FL</p>
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-6xl mx-auto mb-16">
          <div className="lg:col-span-2 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-meow-primary mb-6">Hours of Operation</h2>
            
            <div className="space-y-4">
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-meow-secondary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Phone Hours</h3>
                  <p className="text-gray-600">Monday - Friday: 10am - 6pm</p>
                  <p className="text-gray-600">Saturday: 10am - 4pm</p>
                  <p className="text-gray-600">Sunday: Closed</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-meow-secondary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Email Response</h3>
                  <p className="text-gray-600">1-2 business days</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-5 w-5 text-meow-secondary mr-3 mt-1" />
                <div>
                  <h3 className="font-medium">Adoption Visits</h3>
                  <p className="text-gray-600">By appointment only</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 p-4 bg-blue-50 rounded-md">
              <h3 className="font-medium flex items-center text-blue-800">
                <AlertCircle className="h-5 w-5 mr-2" />
                Please Note
              </h3>
              <p className="text-blue-700 mt-2">
                As a home-based rescue, we don't have a physical facility open to the public. All adoptable cats are in foster homes. Visits are arranged by appointment after your application has been approved.
              </p>
            </div>
          </div>
          
          <div className="lg:col-span-3 bg-white p-8 rounded-lg shadow-md">
            <h2 className="text-2xl font-bold text-meow-primary mb-6">Send Us a Message</h2>
            
            {formStatus === 'success' && (
              <Alert className="mb-6 bg-green-50 border-green-200">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle className="text-green-800">Success!</AlertTitle>
                <AlertDescription className="text-green-700">
                  {formMessage}
                </AlertDescription>
              </Alert>
            )}
            
            {formStatus === 'error' && (
              <Alert className="mb-6 bg-red-50 border-red-200">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <AlertTitle className="text-red-800">Error</AlertTitle>
                <AlertDescription className="text-red-700">
                  {formMessage}
                </AlertDescription>
              </Alert>
            )}
            
            <form 
              onSubmit={handleSubmit} 
              className="space-y-6"
              method="POST" 
              data-netlify="true" 
              name="contact"
              netlify-honeypot="bot-field"
            >
              <input type="hidden" name="form-name" value="contact" />
              <div className="hidden">
                <label>
                  Don't fill this out if you're human: <input name="bot-field" />
                </label>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                  <input
                    type="text"
                    id="firstName"
                    name="firstName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                    required
                    disabled={formStatus === 'submitting'}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
                  <input
                    type="text"
                    id="lastName"
                    name="lastName"
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                    required
                    disabled={formStatus === 'submitting'}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                  required
                  disabled={formStatus === 'submitting'}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone (optional)</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                  disabled={formStatus === 'submitting'}
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                <select
                  id="subject"
                  name="subject"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                  required
                  disabled={formStatus === 'submitting'}
                >
                  <option value="">Please select a subject</option>
                  <option value="Adoption Question">Adoption Question</option>
                  <option value="Fostering Interest">Fostering Interest</option>
                  <option value="Volunteering">Volunteering</option>
                  <option value="Donation Question">Donation Question</option>
                  <option value="General Inquiry">General Inquiry</option>
                  <option value="Other">Other</option>
                </select>
              </div>
              
              <div className="space-y-2">
                <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                <textarea
                  id="message"
                  name="message"
                  rows={5}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                  required
                  disabled={formStatus === 'submitting'}
                ></textarea>
              </div>
              
              <div>
                <Button
                  type="submit"
                  variant="meow"
                  className="w-full"
                  disabled={formStatus === 'submitting'}
                >
                  {formStatus === 'submitting' ? (
                    <div className="flex items-center justify-center">
                      <span className="animate-spin mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full"></span>
                      Sending...
                    </div>
                  ) : (
                    'Send Message'
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg max-w-6xl mx-auto mb-16">
          <h2 className="text-2xl font-bold text-meow-primary mb-6 text-center">Frequently Asked Questions</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-meow-primary mb-2">What are your adoption fees?</h3>
              <p className="text-gray-700">
                Adoption fees range from $100-150 for adult cats and $150-175 for kittens. All cats are spayed/neutered, vaccinated, dewormed, and tested for FIV/FeLV before adoption.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-meow-primary mb-2">How do I apply to adopt?</h3>
              <p className="text-gray-700">
                Visit our <a href="/adopt" className="text-meow-secondary hover:underline">Adopt</a> page to view available cats and submit an application. After your application is approved, we'll arrange a visit with your chosen cat.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-meow-primary mb-2">Do you accept surrendered cats?</h3>
              <p className="text-gray-700">
                We have limited capacity as a home-based rescue, but we do our best to help when space allows. Please contact us directly to discuss surrender options.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="font-bold text-meow-primary mb-2">Can I donate supplies instead of money?</h3>
              <p className="text-gray-700">
                Yes! Visit our <a href="/donate" className="text-meow-secondary hover:underline">Donate</a> page to see our wishlist of needed supplies and how to arrange a drop-off.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
