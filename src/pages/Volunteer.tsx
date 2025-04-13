
import React from 'react';
import { Helmet } from 'react-helmet-async';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from 'react-router-dom';
import { 
  Check, 
  Heart, 
  Home, 
  Calendar, 
  Camera, 
  Car, 
  ShoppingBag, 
  Paintbrush, 
  Wrench, 
  Users
} from 'lucide-react';

const Volunteer: React.FC = () => {
  const scrollToForm = () => {
    const formElement = document.getElementById('volunteer-form');
    if (formElement) {
      formElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <Layout>
      <Helmet>
        <title>Volunteer with Meow Rescue | Help Cats in Need</title>
        <meta name="description" content="Volunteer with Meow Rescue and make a difference in the lives of cats. Foster, transport, help at events, or contribute your skills to support our mission." />
      </Helmet>

      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Volunteer with Meow Rescue" 
          subtitle="Share your time and talents to help cats in need"
          centered
        />
        
        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-center text-lg mb-8">
            Volunteers are the backbone of Meow Rescue. There are many ways to get involved, whether you have a little time or a lot. Every contribution makes a difference in the lives of the cats in our care.
          </p>
          
          <div className="flex justify-center">
            <Button 
              variant="meow" 
              size="lg" 
              onClick={scrollToForm}
              className="mr-4"
            >
              Apply to Volunteer
            </Button>
            
            <Button 
              variant="meowOutline" 
              size="lg" 
              onClick={scrollToForm}
            >
              Become a Foster
            </Button>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-2">
                <Home className="h-6 w-6 text-meow-primary" />
              </div>
              <CardTitle className="text-meow-primary">Foster</CardTitle>
              <CardDescription>Provide temporary care in your home</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Open your home and heart to a cat in need. Fostering saves lives by giving cats a safe place to stay until they find their forever home.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Care for mothers with kittens</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Help socialize shy cats</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Provide medical recovery care</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-2">
                <Calendar className="h-6 w-6 text-meow-primary" />
              </div>
              <CardTitle className="text-meow-primary">Events</CardTitle>
              <CardDescription>Help at adoption events & fundraisers</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Assist at our adoption events, fundraisers, and community outreach activities to help connect cats with potential adopters.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Set up and manage adoption booths</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Help with fundraising activities</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Educate the public about cat care</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-2">
                <Car className="h-6 w-6 text-meow-primary" />
              </div>
              <CardTitle className="text-meow-primary">Transport</CardTitle>
              <CardDescription>Help with cat transportation needs</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Provide crucial transportation for cats to veterinary appointments, adoption events, or between foster homes.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Drive cats to vet appointments</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Transport to/from adoption events</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Help with rescue pickups</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-2">
                <Camera className="h-6 w-6 text-meow-primary" />
              </div>
              <CardTitle className="text-meow-primary">Photography</CardTitle>
              <CardDescription>Capture compelling photos of our cats</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Help our cats find homes by taking beautiful photos that showcase their personalities and charm for adoption listings.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Take adoption profile photos</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Document events and activities</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Create content for social media</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-2">
                <ShoppingBag className="h-6 w-6 text-meow-primary" />
              </div>
              <CardTitle className="text-meow-primary">Supply Collection</CardTitle>
              <CardDescription>Gather donations of food and supplies</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                Help collect and organize donations of food, litter, and other supplies needed to care for our cats.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Organize donation drives</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Coordinate with local businesses</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Deliver supplies to foster homes</span>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-2">
                <Heart className="h-6 w-6 text-meow-primary" />
              </div>
              <CardTitle className="text-meow-primary">Special Skills</CardTitle>
              <CardDescription>Share your unique talents</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-700 mb-4">
                We welcome volunteers with special skills in areas like web design, grant writing, marketing, social media, or fundraising.
              </p>
              <ul className="space-y-2">
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Help with website maintenance</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Assist with social media & marketing</span>
                </li>
                <li className="flex items-start">
                  <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                  <span>Write grants or fundraising materials</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-meow-primary mb-4">Foster Program</h2>
            <p className="text-gray-700 max-w-4xl mx-auto">
              Our foster program is the heart of Meow Rescue. As a foster-based rescue without a facility, we rely entirely on volunteers who open their homes to cats in need. Fostering is flexible - you can foster for a few weeks or months depending on your availability.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-meow-primary">What Fostering Involves</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Providing a safe, indoor home environment</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Basic daily care (feeding, cleaning)</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Socializing and playing with cats</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Transporting to vet appointments when needed</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Helping with adoption by providing updates and photos</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-meow-primary">We Provide</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Food, litter, and basic supplies</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>All veterinary care expenses</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Training and ongoing support</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Assistance with finding adopters</span>
                  </li>
                  <li className="flex items-start">
                    <Check className="h-5 w-5 text-green-500 mr-2 shrink-0 mt-0.5" />
                    <span>Emergency support when needed</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div id="volunteer-form" className="max-w-3xl mx-auto bg-white p-8 rounded-lg shadow-md scroll-mt-24">
          <SectionHeading 
            title="Volunteer & Foster Application" 
            subtitle="Share your information and interests"
            centered
          />
          
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700">First Name</label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                  required
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
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                required
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
              <input
                type="text"
                id="address"
                name="address"
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                required
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="space-y-2">
                <label htmlFor="city" className="block text-sm font-medium text-gray-700">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="state" className="block text-sm font-medium text-gray-700">State</label>
                <input
                  type="text"
                  id="state"
                  name="state"
                  defaultValue="Florida"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                  required
                />
              </div>
              
              <div className="space-y-2">
                <label htmlFor="zip" className="block text-sm font-medium text-gray-700">ZIP</label>
                <input
                  type="text"
                  id="zip"
                  name="zip"
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">I'm interested in (select all that apply):</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="interests" value="fostering" className="rounded text-meow-primary focus:ring-meow-primary" />
                  <span>Fostering</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="interests" value="events" className="rounded text-meow-primary focus:ring-meow-primary" />
                  <span>Events</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="interests" value="transport" className="rounded text-meow-primary focus:ring-meow-primary" />
                  <span>Transport</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="interests" value="photography" className="rounded text-meow-primary focus:ring-meow-primary" />
                  <span>Photography</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="interests" value="supplies" className="rounded text-meow-primary focus:ring-meow-primary" />
                  <span>Supply Collection</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" name="interests" value="specialSkills" className="rounded text-meow-primary focus:ring-meow-primary" />
                  <span>Special Skills</span>
                </label>
              </div>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Please share any relevant experience with cats:</label>
              <textarea
                id="experience"
                name="experience"
                rows={4}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
              ></textarea>
            </div>
            
            <div className="space-y-2">
              <label htmlFor="availability" className="block text-sm font-medium text-gray-700">Please share your general availability:</label>
              <textarea
                id="availability"
                name="availability"
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
              ></textarea>
            </div>
            
            <div className="pt-4">
              <Button type="submit" variant="meow" size="lg" className="w-full">
                Submit Application
              </Button>
              <p className="text-center text-sm text-gray-500 mt-4">
                Thank you for your interest in volunteering with Meow Rescue. We'll contact you within 3-5 business days.
              </p>
            </div>
          </form>
        </div>
      </div>
    </Layout>
  );
};

export default Volunteer;
