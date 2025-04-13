import React from "react";
import Layout from "../components/Layout";
import SectionHeading from "@/components/ui/SectionHeading";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SEO from "@/components/SEO";

const Volunteer = () => {
  return (
    <Layout>
      <SEO 
        title="Volunteer & Foster" 
        description="Discover how you can make a difference by volunteering or fostering with Meow Rescue. Join our team of passionate cat advocates."
      />
      
      <div className="container mx-auto px-4 py-12">
        {/* Hero Section */}
        <div className="bg-meow-secondary/10 rounded-xl p-8 md:p-16 mb-16">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-meow-primary mb-6">
              Make a Difference in Their Lives
            </h1>
            <p className="text-lg text-gray-700 mb-8">
              Our volunteers and foster families are the heart of Meow Rescue. Join our community of cat lovers and help us save more lives!
            </p>
            <Button asChild variant="meow" size="lg">
              <Link to="/contact">Apply Now</Link>
            </Button>
          </div>
        </div>

        {/* Volunteer Opportunities */}
        <SectionHeading 
          title="Volunteer Opportunities" 
          subtitle="Share your time and talents"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 mb-20">
          
          <VolunteerCard 
            title="Cat Care & Socialization"
            description="Help care for our rescue cats by providing daily care, playtime, and socialization to prepare them for adoption."
            commitment="2-4 hours weekly"
            imageUrl="https://images.unsplash.com/photo-1495360010541-f48722b34f7d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          />
          
          <VolunteerCard 
            title="Transportation Team"
            description="Transport cats to/from veterinary appointments, rescue partners, adoption events, and new foster homes."
            commitment="Flexible schedule"
            imageUrl="https://images.unsplash.com/photo-1548366086-7f1b76106622?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          />
          
          <VolunteerCard 
            title="Adoption Events"
            description="Help showcase our cats at adoption events, assist potential adopters, and process adoption paperwork."
            commitment="1-2 events monthly"
            imageUrl="https://images.unsplash.com/photo-1526336024174-e58f5cdd8e13?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          />
          
          <VolunteerCard 
            title="Photography & Social Media"
            description="Take quality photos/videos of our cats and help manage our social media presence to increase adoptions."
            commitment="2-3 hours weekly"
            imageUrl="https://images.unsplash.com/photo-1574144113084-b6f450cc5e0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          />
          
          <VolunteerCard 
            title="Fundraising & Events"
            description="Help plan and execute fundraising campaigns and special events to support our rescue mission."
            commitment="Variable"
            imageUrl="https://images.unsplash.com/photo-1488740304459-45c4277e7daf?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          />
          
          <VolunteerCard 
            title="Administrative Support"
            description="Assist with paperwork, data entry, phone calls, and other administrative tasks to keep our rescue running smoothly."
            commitment="2-4 hours weekly"
            imageUrl="https://images.unsplash.com/photo-1533738363-b7f9aef128ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
          />
        </div>
        
        {/* Foster Program */}
        <SectionHeading 
          title="Foster Program" 
          subtitle="Open your home and heart"
          centered
        />
        
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mt-12 mb-16">
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-meow-primary mb-4">Why Foster?</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="bg-meow-primary/10 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-meow-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Save more lives by increasing our capacity to help cats in need</span>
              </li>
              <li className="flex items-start">
                <div className="bg-meow-primary/10 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-meow-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Help cats recover from illness, surgery, or trauma in a comfortable home environment</span>
              </li>
              <li className="flex items-start">
                <div className="bg-meow-primary/10 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-meow-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Socialize cats and kittens, helping them develop into well-adjusted pets</span>
              </li>
              <li className="flex items-start">
                <div className="bg-meow-primary/10 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-meow-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Experience the joy of having a cat companion without the long-term commitment</span>
              </li>
              <li className="flex items-start">
                <div className="bg-meow-primary/10 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-meow-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Learn more about cats and gain experience in animal care</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-lg shadow-md">
            <h3 className="text-2xl font-bold text-meow-primary mb-4">What We Provide</h3>
            <ul className="space-y-4 text-gray-700">
              <li className="flex items-start">
                <div className="bg-meow-primary/10 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-meow-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>All necessary supplies (food, litter, bedding, toys, etc.)</span>
              </li>
              <li className="flex items-start">
                <div className="bg-meow-primary/10 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-meow-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Complete veterinary care for your foster cats</span>
              </li>
              <li className="flex items-start">
                <div className="bg-meow-primary/10 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-meow-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Training and ongoing support from our experienced team</span>
              </li>
              <li className="flex items-start">
                <div className="bg-meow-primary/10 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-meow-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>24/7 emergency contact for urgent situations</span>
              </li>
              <li className="flex items-start">
                <div className="bg-meow-primary/10 rounded-full p-1 mr-3 mt-1">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-meow-primary" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                <span>Flexibility to choose foster assignments that fit your lifestyle</span>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Apply Now - Update the link to point to contact page */}
        <div id="application" className="bg-meow-primary/10 rounded-xl p-8 md:p-16 text-center">
          <h2 className="text-3xl font-bold text-meow-primary mb-4">Ready to Join Our Team?</h2>
          <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
            Whether you're interested in volunteering, fostering, or both, we'd love to have you join our team. Complete our quick application to get started!
          </p>
          <Button asChild variant="meow" size="lg">
            <Link to="/contact">Apply Now</Link>
          </Button>
        </div>
      </div>
    </Layout>
  );
};

interface VolunteerCardProps {
  title: string;
  description: string;
  commitment: string;
  imageUrl: string;
}

const VolunteerCard: React.FC<VolunteerCardProps> = ({ title, description, commitment, imageUrl }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden">
      <div className="h-48 overflow-hidden">
        <img src={imageUrl} alt={title} className="w-full h-full object-cover transition-transform duration-300 hover:scale-105" />
      </div>
      <div className="p-6">
        <h3 className="text-xl font-bold text-meow-primary mb-2">{title}</h3>
        <p className="text-gray-700 mb-4">{description}</p>
        <div className="bg-meow-primary/10 text-meow-primary text-sm font-medium py-1 px-3 rounded-full inline-block">
          Time Commitment: {commitment}
        </div>
      </div>
    </div>
  );
};

export default Volunteer;
