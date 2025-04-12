
import React from 'react';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { Button } from "@/components/ui/button";
import { HelpingHand, Heart, Home, Car, Clipboard, Camera } from 'lucide-react';
import CtaSection from '../components/CtaSection';

const Volunteer: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Get Involved" 
          subtitle="Volunteer and fostering opportunities"
          centered
        />
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-gray-700 text-lg">
            Volunteers and foster homes are the backbone of our rescue operation. Whether you have a lot of time to give or just a few hours, 
            your help makes a tremendous difference in the lives of cats in need.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="flex items-center mb-6">
              <div className="p-2 bg-meow-primary/10 rounded-full mr-3">
                <HelpingHand size={24} className="text-meow-primary" />
              </div>
              <h2 className="text-2xl font-bold text-meow-primary">Volunteer Opportunities</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-meow-primary mb-3">Rescue Center Helpers</h3>
                <p className="text-gray-700 mb-3">
                  Help with daily care tasks at our home-based rescue center:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4">
                  <li>Feeding and providing fresh water</li>
                  <li>Cleaning litter boxes</li>
                  <li>Cleaning and sanitizing cat areas</li>
                  <li>Socializing cats with playtime and cuddles</li>
                  <li>Grooming and basic care</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-meow-primary mb-3">Transport Volunteers</h3>
                <p className="text-gray-700 mb-3">
                  Help transport cats to and from:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4">
                  <li>Veterinary appointments</li>
                  <li>Adoption events</li>
                  <li>New foster or forever homes</li>
                </ul>
                <p className="text-gray-700 mt-3">
                  This role requires a reliable vehicle and a clean driving record.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-meow-primary mb-3">Administrative Support</h3>
                <p className="text-gray-700 mb-3">
                  Help with behind-the-scenes tasks that keep our rescue running:
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4">
                  <li>Processing adoption applications</li>
                  <li>Answering emails and phone calls</li>
                  <li>Coordinating volunteers and fosters</li>
                  <li>Social media management</li>
                  <li>Fundraising assistance</li>
                </ul>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-meow-primary mb-3">Special Skills</h3>
                <p className="text-gray-700 mb-3">
                  Do you have professional skills that could help our rescue?
                </p>
                <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4">
                  <li>Photography/Videography</li>
                  <li>Graphic Design</li>
                  <li>Web Development</li>
                  <li>Grant Writing</li>
                  <li>Event Planning</li>
                  <li>Veterinary/Medical background</li>
                </ul>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-6">
              <div className="p-2 bg-meow-primary/10 rounded-full mr-3">
                <Heart size={24} className="text-meow-primary" />
              </div>
              <h2 className="text-2xl font-bold text-meow-primary">Foster Program</h2>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold text-meow-primary mb-3">Why Fostering is Vital</h3>
              <p className="text-gray-700 mb-3">
                Our foster program is <span className="font-semibold">urgently needed</span> to help us:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4 mb-3">
                <li>Create space to rescue more cats in need</li>
                <li>Provide specialized care to cats with medical or behavioral needs</li>
                <li>Give kittens a safe place to grow until they're ready for adoption</li>
                <li>Help shy or undersocialized cats learn to trust humans</li>
              </ul>
              <p className="text-gray-700">
                Fostering is one of the most impactful ways to help save lives. Even short-term or "vacation" fosters make a huge difference!
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md mb-6">
              <h3 className="text-lg font-semibold text-meow-primary mb-3">Types of Foster Opportunities</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <Home size={18} className="text-meow-secondary mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Kittens:</span>
                    <p className="text-sm text-gray-700">Care for kittens until they reach adoption age (8-10 weeks). May include bottle feeding for very young kittens.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Home size={18} className="text-meow-secondary mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Medical Cases:</span>
                    <p className="text-sm text-gray-700">Provide TLC and administer medications to cats recovering from illness, injury, or surgery.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Home size={18} className="text-meow-secondary mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Socialization:</span>
                    <p className="text-sm text-gray-700">Help shy or undersocialized cats learn to trust and interact with humans.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Home size={18} className="text-meow-secondary mt-1 mr-2 flex-shrink-0" />
                  <div>
                    <span className="font-medium">Short-Term/Emergency:</span>
                    <p className="text-sm text-gray-700">Provide temporary housing for cats during emergencies or space constraints.</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold text-meow-primary mb-3">We Provide Everything You Need</h3>
              <p className="text-gray-700 mb-3">
                Meow Rescue provides foster families with:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-1 pl-4 mb-3">
                <li>Food and litter</li>
                <li>Medications and medical care</li>
                <li>Supplies like beds, carriers, and toys</li>
                <li>24/7 support and guidance</li>
                <li>Covering all veterinary expenses</li>
              </ul>
              <p className="text-gray-700">
                You provide the love, care, and temporary home!
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-bold text-meow-primary mb-6 text-center">How to Get Started</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-meow-primary/10 rounded-full flex items-center justify-center">
                  <Clipboard size={24} className="text-meow-primary" />
                </div>
              </div>
              <h3 className="font-semibold mb-3">1. Complete an Application</h3>
              <p className="text-gray-700 text-sm">
                Fill out our volunteer/foster application form so we can learn about your interests, availability, and experience.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-meow-primary/10 rounded-full flex items-center justify-center">
                  <Camera size={24} className="text-meow-primary" />
                </div>
              </div>
              <h3 className="font-semibold mb-3">2. Virtual Orientation</h3>
              <p className="text-gray-700 text-sm">
                Attend a brief virtual orientation to learn about our rescue, policies, and procedures for volunteers and fosters.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="flex justify-center mb-4">
                <div className="w-12 h-12 bg-meow-primary/10 rounded-full flex items-center justify-center">
                  <Car size={24} className="text-meow-primary" />
                </div>
              </div>
              <h3 className="font-semibold mb-3">3. Start Making a Difference</h3>
              <p className="text-gray-700 text-sm">
                Get matched with volunteer opportunities or foster cats based on your preferences, schedule, and our current needs.
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <Button className="bg-meow-primary hover:bg-meow-primary/90 px-8">
              Volunteer/Foster Application
            </Button>
          </div>
        </div>
        
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold text-meow-primary mb-6 text-center">Our Volunteers Share Their Experiences</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "Fostering for Meow Rescue has been one of the most rewarding experiences of my life. Watching shy, scared cats blossom into confident, loving companions ready for their forever homes brings me so much joy."
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Sarah T.</p>
                  <p className="text-sm text-gray-600">Foster Volunteer since 2023</p>
                </div>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "I help transport cats to vet appointments a few hours each week. It's a small commitment of time that makes a huge difference, and I love getting to know all the different cat personalities along the way!"
              </p>
              <div className="flex items-center">
                <div className="w-10 h-10 bg-gray-200 rounded-full mr-3"></div>
                <div>
                  <p className="font-medium">Michael R.</p>
                  <p className="text-sm text-gray-600">Transport Volunteer since 2024</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <CtaSection 
        title="Ready to Make a Difference?"
        description="Whether you have a little time or a lot, your help can save lives. Join our team of dedicated volunteers and fosters today."
        buttonText="Apply Now"
        buttonLink="#"
      />
    </Layout>
  );
};

export default Volunteer;
