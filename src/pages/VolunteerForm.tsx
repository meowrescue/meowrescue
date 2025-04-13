import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/contexts/AuthContext';
import { ArrowLeft } from 'lucide-react';

const VolunteerForm: React.FC = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zip: '',
    availability: '',
    interests: '',
    skills: '',
    experience: '',
    references: '',
    agreement: false,
  });
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const goBack = () => {
    navigate(-1);
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.agreement) {
      toast({
        title: "Agreement Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      });
      return;
    }

    // Simulate form submission
    toast({
      title: "Application Submitted",
      description: "Thank you for your application! We will be in touch soon.",
    });
  };
  
  return (
    <Layout>
      <SEO title="Volunteer Application | Meow Rescue" description="Apply to become a volunteer at Meow Rescue and help make a difference in the lives of cats in need." />
      
      <div className="container mx-auto py-16 px-4">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={goBack} 
            className="mb-4 flex items-center text-gray-600 hover:text-meow-primary"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <h1 className="text-3xl font-bold text-meow-primary">Volunteer Application</h1>
          <p className="text-gray-600 mt-2">
            Thank you for your interest in volunteering with Meow Rescue! Please complete the form below.
          </p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
            <input
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="lastName" className="block text-sm font-medium text-gray-700">Last Name</label>
            <input
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
            <input
              type="text"
              id="address"
              name="address"
              value={formData.address}
              onChange={handleChange}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
              required
            />
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
              <input
                type="text"
                id="city"
                name="city"
                value={formData.city}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
              <input
                type="text"
                id="state"
                name="state"
                value={formData.state}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
                required
              />
            </div>
            
            <div>
              <label htmlFor="zip" className="block text-sm font-medium text-gray-700">Zip</label>
              <input
                type="text"
                id="zip"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
                required
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Availability</label>
            <textarea
              id="availability"
              name="availability"
              value={formData.availability}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="interests" className="block text-sm font-medium text-gray-700">Interests</label>
            <textarea
              id="interests"
              name="interests"
              value={formData.interests}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="skills" className="block text-sm font-medium text-gray-700">Skills</label>
            <textarea
              id="skills"
              name="skills"
              value={formData.skills}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Experience</label>
            <textarea
              id="experience"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
              required
            />
          </div>
          
          <div>
            <label htmlFor="references" className="block text-sm font-medium text-gray-700">References</label>
            <textarea
              id="references"
              name="references"
              value={formData.references}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-meow-primary focus:ring-meow-primary sm:text-sm"
              required
            />
          </div>
          
          <div className="flex items-start">
            <div className="flex items-center h-5">
              <input
                id="agreement"
                name="agreement"
                type="checkbox"
                checked={formData.agreement}
                onChange={handleChange}
                className="focus:ring-meow-primary h-4 w-4 text-meow-primary border-gray-300 rounded"
                required
              />
            </div>
            <div className="ml-3 text-sm">
              <label htmlFor="agreement" className="font-medium text-gray-700">
                I agree to the terms and conditions
              </label>
              <p className="text-gray-500">
                Please read our <a href="/terms-of-service" className="text-meow-primary hover:underline">terms of service</a> and <a href="/privacy-policy" className="text-meow-primary hover:underline">privacy policy</a>.
              </p>
            </div>
          </div>
          
          <div>
            <Button type="submit" className="w-full">Submit Application</Button>
          </div>
        </form>
      </div>
    </Layout>
  );
};

export default VolunteerForm;
