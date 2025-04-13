
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import SEO from '@/components/SEO';
import SectionHeading from '@/components/ui/SectionHeading';
import { Home, Heart, Calendar, ShieldCheck, PawPrint, Pill, Cat, Utensils, Clipboard } from 'lucide-react';
import { scrollToTop } from '@/utils/scrollUtils';

const Foster: React.FC = () => {
  return (
    <Layout>
      <SEO title="Foster Program | Meow Rescue" description="Become a foster parent for cats in need and help them find their forever homes. Learn about our foster program and apply today." />
      
      <div className="bg-meow-light py-20 px-4">
        <div className="container mx-auto max-w-5xl">
          <SectionHeading
            title="Become a Foster"
            subtitle="Open your heart and home to cats in need"
          />
          
          <div className="prose lg:prose-lg mx-auto mb-10 text-center max-w-3xl">
            <p className="text-lg text-gray-700">
              As a foster parent, you provide temporary care for cats until they find their forever homes. Fostering is a rewarding way to help save lives without a permanent commitment.
            </p>
          </div>
          
          {/* Why Foster Section */}
          <div className="mt-16">
            <SectionHeading
              title="Why Foster?"
              subtitle="Make a difference in a cat's life"
            />
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
              <Card className="hover-card-effect bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-meow-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Heart className="h-8 w-8 text-meow-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Save Lives</h3>
                  <p className="text-gray-600">
                    By fostering, you're directly helping to save cats' lives by giving them a safe place to stay until adoption.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-card-effect bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-meow-primary/10 flex items-center justify-center mx-auto mb-4">
                    <Home className="h-8 w-8 text-meow-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Temporary Commitment</h3>
                  <p className="text-gray-600">
                    Fostering allows you to help cats without the long-term commitment of adoption, perfect for those who travel or have busy schedules.
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover-card-effect bg-white">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 rounded-full bg-meow-primary/10 flex items-center justify-center mx-auto mb-4">
                    <PawPrint className="h-8 w-8 text-meow-primary" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">Rewarding Experience</h3>
                  <p className="text-gray-600">
                    Experience the joy of watching shy or injured cats blossom into confident, healthy companions ready for their forever homes.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
          
          {/* What We Provide Section - Redesigned */}
          <div className="mt-20 bg-white rounded-lg shadow-md overflow-hidden">
            <div className="p-8">
              <SectionHeading
                title="What We Provide"
                subtitle="We support our foster families every step of the way"
                centered={true}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
                <div className="flex items-start space-x-4">
                  <div className="bg-meow-primary/10 p-3 rounded-full">
                    <Utensils className="h-6 w-6 text-meow-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Food and Supplies</h3>
                    <p className="text-gray-600">We provide all necessary food, litter, beds, toys, and enrichment items your foster cats will need.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-meow-primary/10 p-3 rounded-full">
                    <Pill className="h-6 w-6 text-meow-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Medical Care</h3>
                    <p className="text-gray-600">All veterinary care is covered by our rescue. We ensure your foster cats get the medical attention they need.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-meow-primary/10 p-3 rounded-full">
                    <Clipboard className="h-6 w-6 text-meow-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Training and Support</h3>
                    <p className="text-gray-600">Our experienced team provides guidance on cat care, behavior, and health concerns.</p>
                  </div>
                </div>
                
                <div className="flex items-start space-x-4">
                  <div className="bg-meow-primary/10 p-3 rounded-full">
                    <Calendar className="h-6 w-6 text-meow-primary" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold mb-2">Flexible Scheduling</h3>
                    <p className="text-gray-600">Going on vacation? We can arrange temporary care for your foster cats while you're away.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Foster Requirements */}
          <div className="mt-20">
            <SectionHeading
              title="Foster Requirements"
              subtitle="What we look for in potential foster homes"
            />
            
            <div className="bg-white rounded-lg shadow-md p-8 mt-8">
              <ul className="space-y-4">
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Be at least 21 years of age and provide valid identification</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Have reliable transportation for vet appointments and adoption events</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Have a safe, secure indoor space for foster cats</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">If renting, provide landlord approval for having foster cats</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Be willing to keep foster cats separate from resident pets, at least initially</span>
                </li>
                <li className="flex items-start">
                  <ShieldCheck className="h-6 w-6 text-meow-primary mr-4 mt-1 flex-shrink-0" />
                  <span className="text-gray-700">Provide regular updates and photos of foster cats for adoption promotion</span>
                </li>
              </ul>
            </div>
          </div>
          
          {/* CTA Section */}
          <div className="mt-20 text-center">
            <div className="bg-meow-primary/10 rounded-lg px-8 py-12">
              <div className="max-w-3xl mx-auto">
                <Cat className="h-16 w-16 text-meow-primary mx-auto mb-4" />
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Make a Difference?</h2>
                <p className="text-lg text-gray-700 mb-8">
                  Join our amazing network of foster parents and help save more feline lives. The application process is simple, and our team is ready to answer any questions you may have.
                </p>
                <Link to="/foster/apply" onClick={scrollToTop}>
                  <Button className="bg-meow-primary hover:bg-meow-primary/90 text-white px-8 py-6 text-lg">
                    Apply to Foster
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
          {/* Foster FAQ */}
          <div className="mt-20">
            <SectionHeading
              title="Frequently Asked Questions"
              subtitle="Common questions about fostering"
            />
            
            <div className="space-y-6 mt-8">
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">How long do cats typically stay in foster care?</h3>
                <p className="text-gray-700">
                  Foster periods can range from a few weeks to a few months, depending on the cat's age, health, and adoptability. Kittens often stay until they reach adoption age (around 2 months), while adult cats may stay longer.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Can I foster if I have other pets?</h3>
                <p className="text-gray-700">
                  Yes! Many foster parents have resident pets. We recommend keeping foster cats separate initially and then gradually introducing them if appropriate. We can help match you with cats that are likely to do well with your existing pets.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">What if I want to adopt my foster cat?</h3>
                <p className="text-gray-700">
                  Foster parents often have first priority if they wish to adopt their foster cats. We call this "foster failing," though it's actually a success! Just let us know if you're interested in making your foster a permanent part of your family.
                </p>
              </div>
              
              <div className="bg-white rounded-lg shadow-sm p-6">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">What if I need to travel during my foster period?</h3>
                <p className="text-gray-700">
                  We understand life happens! With advance notice, we can arrange temporary care for your foster cats while you're away. Just let our foster coordinator know your travel dates as soon as possible.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Foster;
