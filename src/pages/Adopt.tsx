
import React from 'react';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { Button } from "@/components/ui/button";
import CtaSection from '../components/CtaSection';

const Adopt: React.FC = () => {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Adoption Process" 
          subtitle="Find your purr-fect match"
          centered
        />
        
        <div className="max-w-3xl mx-auto mb-16">
          <p className="text-gray-700 text-lg text-center mb-8">
            At Meow Rescue, we're committed to finding the best possible homes for our cats and ensuring successful, lifelong matches between adopters and their new companions.
          </p>
          
          <div className="space-y-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-meow-primary">1. Browse Available Cats</h3>
              <p className="text-gray-700 mb-4">
                Start by browsing our <a href="/cats" className="text-meow-primary hover:underline">Adoptable Cats</a> page to see which cats are currently available. Each profile includes information about the cat's personality, history, and specific needs.
              </p>
              <p className="text-gray-700">
                If you're not sure what type of cat would be the best fit for your home, please contact us—we're happy to help you find a good match based on your lifestyle and preferences.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-meow-primary">2. Submit an Adoption Application</h3>
              <p className="text-gray-700 mb-4">
                Once you've found a cat (or cats) you're interested in, complete our adoption application. The application helps us understand your home environment, experience with pets, and expectations for a new cat.
              </p>
              <p className="text-gray-700 mb-4">
                We review applications thoroughly to ensure each cat goes to a home where they will thrive. Our application process includes:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 pl-4">
                <li>Verification of housing situation (rental pet policies, if applicable)</li>
                <li>Veterinary references (if you have or have had other pets)</li>
                <li>Discussion about your expectations and lifestyle</li>
              </ul>
              <div className="text-center mt-6">
                <Button className="bg-meow-primary hover:bg-meow-primary/90">
                  Adoption Application
                </Button>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-meow-primary">3. Meet & Greet</h3>
              <p className="text-gray-700 mb-4">
                After your application is reviewed, we'll arrange for you to meet the cat(s) you're interested in adopting. This gives you a chance to interact with the cat and see if it's a good mutual fit.
              </p>
              <p className="text-gray-700">
                For cats in foster homes, the meet and greet will typically take place at the foster home. This helps the cat remain comfortable in familiar surroundings during the introduction.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-meow-primary">4. Home Check</h3>
              <p className="text-gray-700">
                For some adoptions, we may conduct a brief home check to ensure the environment is safe and suitable for the cat. This is especially important for cats with specific needs or requirements.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-meow-primary">5. Finalize the Adoption</h3>
              <p className="text-gray-700 mb-4">
                Once approved, you'll complete an adoption contract and pay the adoption fee. The adoption fee helps cover a portion of the medical care each cat receives, including:
              </p>
              <ul className="list-disc list-inside text-gray-700 space-y-2 mb-4 pl-4">
                <li>Spay/neuter surgery</li>
                <li>Vaccinations appropriate for age</li>
                <li>Deworming</li>
                <li>Flea treatment</li>
                <li>FIV/FeLV testing</li>
                <li>Microchipping</li>
              </ul>
              <p className="text-gray-700">
                Adoption fees vary depending on the age and special needs of the cat, typically ranging from $75-150. The exact fee will be discussed during the adoption process.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-bold mb-4 text-meow-primary">6. Welcome Home!</h3>
              <p className="text-gray-700 mb-4">
                Take your new family member home! We'll provide guidance on helping your new cat adjust to your home and integrate with any existing pets.
              </p>
              <p className="text-gray-700">
                Meow Rescue remains available for post-adoption support and guidance throughout your cat's life. We're committed to the long-term success of every adoption.
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-bold text-meow-primary mb-6 text-center">Adoption Requirements</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-3 text-meow-primary">Basic Requirements</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                  <span>Must be 21 years of age or older</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                  <span>Valid ID with current address</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                  <span>Proof of residence (if not on ID)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                  <span>Landlord approval (for renters)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                  <span>All household members must be in agreement about adopting</span>
                </li>
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-3 text-meow-primary">Commitment to Care</h3>
              <ul className="space-y-2 text-gray-700">
                <li className="flex items-start">
                  <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                  <span>Ability to provide proper nutrition, shelter, and veterinary care</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                  <span>Commitment to keeping the cat indoors only or with supervised outdoor access</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                  <span>Understanding that a cat is a lifelong commitment (potentially 15-20 years)</span>
                </li>
                <li className="flex items-start">
                  <span className="bg-meow-primary/10 p-1 rounded text-meow-primary mr-3 mt-1">•</span>
                  <span>Willingness to work through adjustment periods and behavior challenges</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center">
          <h2 className="text-2xl font-bold text-meow-primary mb-6">Ready to Adopt?</h2>
          <p className="text-gray-700 max-w-3xl mx-auto mb-8">
            Browse our available cats and submit an adoption application today. If you have any questions about the adoption process, please don't hesitate to contact us.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Button 
              className="bg-meow-primary hover:bg-meow-primary/90"
              asChild
            >
              <a href="/cats">View Available Cats</a>
            </Button>
            <Button 
              variant="outline" 
              className="border-meow-primary text-meow-primary hover:bg-meow-primary/10"
            >
              Adoption Application
            </Button>
          </div>
        </div>
      </div>
      
      <CtaSection 
        title="Can't Adopt But Want to Help?"
        description="Consider fostering, volunteering, or making a donation to support our rescue efforts."
        buttonText="Other Ways to Help"
        buttonLink="/volunteer"
        bgColor="bg-meow-secondary"
      />
    </Layout>
  );
};

export default Adopt;
