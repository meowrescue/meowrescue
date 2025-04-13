
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import SectionHeading from '@/components/ui/SectionHeading';
import { Home, Heart, CalendarDays, ShieldCheck, Clock, Camera, Users, Brush, Store, PawPrint } from 'lucide-react';
import { scrollToTop } from '@/utils/scrollUtils';

const Volunteer: React.FC = () => {
  return (
    <Layout>
      <SEO title="Volunteer Opportunities | Meow Rescue" description="Make a difference in the lives of cats in need by volunteering with Meow Rescue. Find various volunteer opportunities that match your skills and interests." />
      
      <div className="bg-meow-light py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            title="Volunteer With Us"
            subtitle="Help us save more feline lives"
          />
          
          <div className="prose lg:prose-lg mx-auto mb-10 text-center max-w-3xl">
            <p className="text-lg text-gray-700">
              Volunteers are the heart of our organization. Whether you can give a few hours a week or a few hours a month, your time and talents can make a meaningful difference in the lives of cats in need.
            </p>
          </div>
          
          {/* Volunteer Opportunities Section */}
          <div className="mt-16">
            <SectionHeading
              title="Volunteer Opportunities"
              subtitle="Find the perfect role for your skills and interests"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 mt-8">
              <Card className="hover-card-effect bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-4">
                    <PawPrint className="h-6 w-6 text-meow-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Cat Care</h3>
                  <p className="text-gray-600 mb-4">
                    Help with feeding, grooming, socialization, and enrichment activities for our resident cats.
                  </p>
                  <div className="text-sm text-gray-500 italic">
                    Time Commitment: 2-4 hours weekly
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-card-effect bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-4">
                    <Store className="h-6 w-6 text-meow-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Adoption Events</h3>
                  <p className="text-gray-600 mb-4">
                    Assist with setting up, managing, and promoting our cats at adoption events throughout the community.
                  </p>
                  <div className="text-sm text-gray-500 italic">
                    Time Commitment: 4-6 hours monthly
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-card-effect bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-4">
                    <Camera className="h-6 w-6 text-meow-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Photography</h3>
                  <p className="text-gray-600 mb-4">
                    Take high-quality photos of our cats for adoption profiles and social media promotion.
                  </p>
                  <div className="text-sm text-gray-500 italic">
                    Time Commitment: 2-3 hours bi-weekly
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-card-effect bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-4">
                    <Users className="h-6 w-6 text-meow-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Social Media</h3>
                  <p className="text-gray-600 mb-4">
                    Help manage our social media accounts, create engaging content, and respond to inquiries.
                  </p>
                  <div className="text-sm text-gray-500 italic">
                    Time Commitment: 2-5 hours weekly
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-card-effect bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-4">
                    <Brush className="h-6 w-6 text-meow-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Facility Maintenance</h3>
                  <p className="text-gray-600 mb-4">
                    Help with cleaning, organizing, laundry, and maintenance tasks at our adoption center.
                  </p>
                  <div className="text-sm text-gray-500 italic">
                    Time Commitment: 2-4 hours weekly
                  </div>
                </CardContent>
              </Card>
              
              <Card className="hover-card-effect bg-white">
                <CardContent className="p-6">
                  <div className="w-12 h-12 rounded-full bg-meow-primary/10 flex items-center justify-center mb-4">
                    <Heart className="h-6 w-6 text-meow-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Fundraising</h3>
                  <p className="text-gray-600 mb-4">
                    Assist with planning and executing fundraising events and campaigns to support our mission.
                  </p>
                  <div className="text-sm text-gray-500 italic">
                    Time Commitment: Varies by project
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* Volunteer Benefits */}
          <div className="mt-20 bg-white rounded-lg shadow-md p-8">
            <SectionHeading
              title="Benefits of Volunteering"
              subtitle="Why join our volunteer team?"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="flex items-start space-x-4">
                <div className="bg-meow-primary/10 p-3 rounded-full flex-shrink-0">
                  <Heart className="h-6 w-6 text-meow-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Make a Real Impact</h3>
                  <p className="text-gray-600">Your time directly helps save and improve the lives of cats in need. Each hour you volunteer makes a difference.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-meow-primary/10 p-3 rounded-full flex-shrink-0">
                  <Users className="h-6 w-6 text-meow-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Join a Community</h3>
                  <p className="text-gray-600">Connect with fellow animal lovers and make friends who share your passion for helping cats.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-meow-primary/10 p-3 rounded-full flex-shrink-0">
                  <Clock className="h-6 w-6 text-meow-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
                  <p className="text-gray-600">We work with your availability and understand that life gets busy. Volunteer when it works for you.</p>
                </div>
              </div>
              
              <div className="flex items-start space-x-4">
                <div className="bg-meow-primary/10 p-3 rounded-full flex-shrink-0">
                  <CalendarDays className="h-6 w-6 text-meow-primary" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold mb-2">Special Events</h3>
                  <p className="text-gray-600">Volunteers are invited to exclusive events, training opportunities, and appreciation gatherings.</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Volunteer Requirements */}
          <div className="mt-20">
            <SectionHeading
              title="Volunteer Requirements"
              subtitle="What we ask of our volunteers"
            />
            
            <div className="bg-white rounded-lg shadow-md p-8 mt-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Be at least 18 years of age (youth volunteers 14-17 may participate with parental supervision)</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Complete a volunteer orientation and required training for your specific role</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Commit to at least 4 hours per month for a minimum of six months</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Follow all shelter protocols and guidelines for animal handling and safety</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Represent Meow Rescue professionally in the community</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-meow-primary/10 rounded-lg px-8 py-12">
              <div className="max-w-3xl mx-auto">
                <Home className="h-16 w-16 text-meow-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Join Our Team?</h2>
                <p className="text-lg text-gray-700 mb-8">
                  Take the first step toward making a difference in the lives of cats in need. Fill out our volunteer application today, and we'll contact you about upcoming orientation sessions.
                </p>
                <Link to="/volunteer/apply" onClick={scrollToTop}>
                  <Button className="bg-meow-primary hover:bg-meow-primary/90 text-white px-8 py-6 text-lg">
                    Apply to Volunteer
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Volunteer FAQ */}
          <div className="mt-20">
            <SectionHeading
              title="Frequently Asked Questions"
              subtitle="Common questions about volunteering"
            />
            
            <div className="space-y-6 mt-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">How much time do I need to commit?</h3>
                <p className="text-gray-700">
                  We ask for a minimum commitment of 4 hours per month for at least six months. Many volunteers choose to give more time, but we understand that everyone has different availability.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Do I need prior experience with cats?</h3>
                <p className="text-gray-700">
                  While experience with cats is helpful, it's not required for all volunteer positions. We provide training for each role, and we can match you with tasks that suit your comfort level and experience.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Can I volunteer if I have allergies to cats?</h3>
                <p className="text-gray-700">
                  If you have mild allergies, there are still ways to help! We have roles that involve minimal direct contact with cats, such as administrative tasks, social media management, or fundraising.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Is there a minimum age requirement?</h3>
                <p className="text-gray-700">
                  Volunteers must be at least 18 years old to volunteer independently. Youth volunteers aged 14-17 can participate with a parent or guardian who is also a registered volunteer.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Volunteer;
