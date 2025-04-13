
import React, { useState } from 'react';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useScrollToElement } from '@/hooks/use-scroll';
import NetlifyFormHiddenInput from '@/components/NetlifyFormHiddenInput';
import SEO from '@/components/SEO';

const Contact: React.FC = () => {
  // Use the custom hook to handle scrolling
  useScrollToElement();
  
  const { toast } = useToast();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Netlify forms will handle the submission automatically
      // We just need to show a success message
      toast({
        title: "Message Sent!",
        description: "Thanks for contacting us. We'll get back to you soon.",
      });
      
      // Reset the form
      setName('');
      setEmail('');
      setSubject('');
      setMessage('');
    } catch (error) {
      toast({
        title: "Submission Error",
        description: "There was a problem sending your message. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Layout>
      <SEO
        title="Contact Us | Meow Rescue"
        description="Get in touch with Meow Rescue. We'd love to hear from you whether you have questions about adoption, volunteering, or other inquiries."
      />
      
      <div className="container mx-auto px-4 py-12 pt-24" id="contact-content">
        <SectionHeading
          title="Contact Us"
          subtitle="We'd love to hear from you"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto mt-8">
          <div>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
              <h3 className="text-xl font-bold text-meow-primary mb-4">General Information</h3>
              
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium">Email</h4>
                  <p className="text-gray-600">rescue@meowrescue.org</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Phone</h4>
                  <p className="text-gray-600">(727) 555-MEOW (6369)</p>
                </div>
                
                <div>
                  <h4 className="font-medium">Location</h4>
                  <p className="text-gray-600">
                    Pasco County, Florida<br />
                    (Home-based rescue, no physical facility)
                  </p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-xl font-bold text-meow-primary mb-4">Follow Us</h3>
              
              <div className="flex space-x-4 mb-6">
                <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="text-blue-600 hover:text-blue-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z" />
                  </svg>
                </a>
                
                <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" aria-label="Instagram" className="text-pink-600 hover:text-pink-800">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153.509.5.902 1.105 1.153 1.772.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 01-1.153 1.772c-.5.508-1.105.902-1.772 1.153-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 01-1.772-1.153 4.904 4.904 0 01-1.153-1.772c-.247-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428.247-.669.6-1.276 1.153-1.772a4.91 4.91 0 011.772-1.153c.637-.247 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 1.802c-2.67 0-2.986.01-4.04.059-.976.045-1.505.207-1.858.344-.466.18-.8.398-1.15.748-.35.35-.568.684-.748 1.15-.137.353-.3.882-.344 1.857-.048 1.055-.058 1.37-.058 4.041 0 2.67.01 2.986.058 4.04.045.977.207 1.505.344 1.858.18.466.399.8.748 1.15.35.35.684.568 1.15.747.353.138.882.3 1.857.345 1.054.048 1.37.058 4.041.058 2.67 0 2.987-.01 4.04-.058.977-.045 1.505-.207 1.858-.345.466-.18.8-.398 1.15-.748.35-.35.568-.683.748-1.15.138-.352.3-.88.345-1.857.048-1.054.058-1.37.058-4.04 0-2.67-.01-2.986-.058-4.041-.045-.976-.207-1.504-.345-1.857-.18-.466-.399-.8-.748-1.15-.35-.35-.684-.568-1.15-.747-.353-.138-.882-.3-1.857-.345-1.054-.048-1.37-.058-4.04-.058zm0 12.198c-2.153 0-3.894-1.74-3.894-3.894 0-2.152 1.742-3.894 3.894-3.894 2.152 0 3.894 1.742 3.894 3.894 0 2.153-1.742 3.894-3.894 3.894zm0-9.985c-3.37 0-6.092 2.723-6.092 6.09S8.63 18.192 12 18.192s6.09-2.723 6.09-6.09c0-3.368-2.722-6.09-6.09-6.09zm7.54-.136c0 .787-.64 1.427-1.428 1.427-.787 0-1.428-.64-1.428-1.428 0-.787.64-1.428 1.428-1.428.788 0 1.428.64 1.428 1.428z" />
                  </svg>
                </a>
                
                <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" aria-label="Twitter" className="text-blue-400 hover:text-blue-600">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                    <path d="M22.162 5.656a8.384 8.384 0 01-2.402.658A4.196 4.196 0 0021.6 4c-.82.488-1.719.83-2.656 1.015a4.182 4.182 0 00-7.126 3.814 11.874 11.874 0 01-8.62-4.37 4.168 4.168 0 00-.566 2.103c0 1.45.738 2.73 1.86 3.48a4.168 4.168 0 01-1.894-.523v.052a4.185 4.185 0 003.355 4.101 4.21 4.21 0 01-1.89.072A4.185 4.185 0 007.97 16.65a8.394 8.394 0 01-6.191 1.732 11.83 11.83 0 006.41 1.88c7.693 0 11.9-6.373 11.9-11.9 0-.18-.005-.362-.013-.54a8.496 8.496 0 002.087-2.165z" />
                  </svg>
                </a>
              </div>
              
              <h4 className="font-medium mb-2">Hours</h4>
              <p className="text-gray-600 mb-4">
                As a home-based rescue, we don't have set business hours. Please email us for appointments
                or to arrange a meeting with our adoptable cats.
              </p>
              
              <h4 className="font-medium mb-2">Adoptions</h4>
              <p className="text-gray-600">
                Adoptions are by appointment only. Please submit an adoption application online first.
              </p>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-xl font-bold text-meow-primary mb-6">Send Us a Message</h3>
            
            <form 
              name="contact"
              method="POST"
              data-netlify="true"
              data-netlify-honeypot="bot-field"
              onSubmit={handleSubmit}
            >
              <NetlifyFormHiddenInput formName="contact" />
              
              <div className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Name
                  </label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address
                  </label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                    Subject
                  </label>
                  <Input
                    type="text"
                    id="subject"
                    name="subject"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    required
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                    Message
                  </label>
                  <Textarea
                    id="message"
                    name="message"
                    rows={5}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    required
                  />
                </div>
                
                <Button 
                  type="submit" 
                  variant="meow" 
                  disabled={isSubmitting}
                  className="w-full"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    "Send Message"
                  )}
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Contact;
