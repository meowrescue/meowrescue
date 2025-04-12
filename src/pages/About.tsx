
import React from 'react';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { Button } from "@/components/ui/button";
import CtaSection from '../components/CtaSection';

const About: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="About Meow Rescue" 
          subtitle="Our mission, our story, and our vision"
          centered
        />
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1595433707802-6b2626ef1c91?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1180&q=80" 
              alt="Founder with rescued cat" 
              className="rounded-lg shadow-xl w-full h-auto object-cover"
            />
          </div>
          
          <div>
            <h2 className="text-2xl font-bold text-meow-primary mb-4">Our Founder's Story</h2>
            <p className="text-gray-700 mb-4">
              Patrick has had a deep connection with animals since childhood, often feeling a special ability to understand them when others couldn't. After years in IT, he decided to follow his true passion for animal welfare—realizing this brings genuine happiness and allows him to use his unique gift.
            </p>
            <p className="text-gray-700 mb-4">
              His long-term dream is to open a dedicated animal sanctuary for all kinds of animals in need. While skilled in IT, Patrick acknowledges the learning curve in running a rescue operation but is committed to his dream despite the challenges.
            </p>
            <p className="text-gray-700 mb-4">
              The catalyst for Meow Rescue came when Patrick moved to Pasco County (near Moon Lake) about three years ago and observed a significant stray cat population. Cats in distress—injured, starving—began appearing at his home, seemingly sensing it was a safe place.
            </p>
            <p className="text-gray-700">
              What started as personally funding vet care and feeding for these animals has now formalized into "Meow Rescue," as Patrick seeks community support to continue and expand this vital work.
            </p>
          </div>
        </div>
        
        <div className="mb-16">
          <SectionHeading 
            title="Our Mission" 
            subtitle="Saving local lives, one paw at a time"
            centered
          />
          
          <p className="text-gray-700 text-lg text-center max-w-4xl mx-auto mb-8">
            Meow Rescue is a home-based cat rescue founded and operated by Patrick in the New Port Richey / Pasco County area of Florida. Our mission is to rescue, rehabilitate, and rehome cats and kittens in need from our local community.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-center mb-4 text-meow-primary">Rescue</h3>
              <p className="text-gray-700">
                We rescue abandoned, stray, and injured cats from the local community, providing them with immediate care, safety, and comfort during what is often a traumatic time in their lives.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-center mb-4 text-meow-primary">Rehabilitate</h3>
              <p className="text-gray-700">
                We provide medical treatment, proper nutrition, socialization, and love to help each cat recover physically and emotionally, preparing them for their forever homes.
              </p>
            </div>
            
            <div className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow">
              <h3 className="text-xl font-bold text-center mb-4 text-meow-primary">Rehome</h3>
              <p className="text-gray-700">
                We carefully match cats with loving adopters, ensuring each cat finds a home where they will be cherished and cared for throughout their lives.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <SectionHeading 
            title="Our Current Situation" 
            subtitle="The challenges we face and the support we need"
            centered
          />
          
          <div className="bg-gray-50 p-8 rounded-lg mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-bold mb-4 text-meow-primary">Home-Based Operation</h3>
                <p className="text-gray-700 mb-6">
                  Meow Rescue is entirely home-based, operated solely by Patrick. We're currently caring for approximately 24 cats and kittens within a single-family home, which presents significant space and resource challenges.
                </p>
                
                <h3 className="text-xl font-bold mb-4 text-meow-primary">Financial Strain</h3>
                <p className="text-gray-700">
                  Running the rescue requires substantial personal expense—close to $1000 per month just for quality cat food, plus ongoing veterinary costs for intake, medical emergencies, and routine care. This financial burden is currently shouldered primarily by Patrick.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold mb-4 text-meow-primary">Primary Needs</h3>
                <ul className="space-y-3 text-gray-700">
                  <li className="flex items-start">
                    <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                    <span><strong>Financial Donations:</strong> Crucial for covering food, vet bills, medications, and supplies.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                    <span><strong>Foster Homes:</strong> Urgently needed to alleviate space constraints, provide individual attention to cats with special needs, and allow us to help more animals.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                    <span><strong>Volunteers:</strong> Helping with daily care, socialization, transportation to vet appointments, and more.</span>
                  </li>
                  <li className="flex items-start">
                    <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                    <span><strong>Supplies:</strong> Donations of food, litter, cleaning supplies, and other necessities help reduce our operating costs.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-gray-700 text-lg max-w-4xl mx-auto mb-8">
              Despite these challenges, we remain committed to our mission and vision. With your support, we can continue to make a difference in the lives of cats in need in our community.
            </p>
            
            <div className="flex flex-wrap justify-center gap-4">
              <Button 
                className="bg-meow-primary hover:bg-meow-primary/90"
                asChild
              >
                <a href="/donate">Make a Donation</a>
              </Button>
              
              <Button 
                variant="outline" 
                className="border-meow-primary text-meow-primary hover:bg-meow-primary/10"
                asChild
              >
                <a href="/volunteer">Get Involved</a>
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      <CtaSection 
        title="Help Us Save More Lives"
        description="Your support makes a direct impact on the cats in our care. Join us in our mission to rescue, rehabilitate, and rehome cats in need."
        buttonText="Donate Now"
        buttonLink="/donate"
      />
    </Layout>
  );
};

export default About;
