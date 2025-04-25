import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import PageHeader from '@/components/ui/PageHeader';
import { Cat, ArrowRight, Heart, Home, Calendar, ClipboardCheck } from 'lucide-react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { scrollToTop } from '@/utils/scrollUtils';

const Adopt = () => {
  const navigate = useNavigate();

  const redirectToAdoptionForm = () => {
    scrollToTop();
    navigate('/adopt/apply');
  };
  
  const redirectToAvailableCats = () => {
    scrollToTop();
    navigate('/cats');
  };

  return (
    <Layout>
      <SEO 
        title="Adopt a Cat | Meow Rescue" 
        description="Learn about our adoption process and how you can adopt a loving cat into your home"
      />
      
      <PageHeader
        title="Adopt a Furry Friend"
        subtitle="Give a loving cat a forever home and change both your lives for the better."
      />
      
      <div className="bg-gray-50">
        {/* Process section with modern card design */}
        <div className="py-16 container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Adoption Process</h2>
            <div className="h-1 w-20 bg-meow-secondary mx-auto mb-4"></div>
            <p className="text-gray-600 max-w-2xl mx-auto">
              We want to ensure our cats find the perfect forever homes. Here's our straightforward adoption process.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <Card className="transition-all hover:shadow-lg hover:translate-y-[-5px]">
              <CardHeader>
                <div className="bg-meow-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <ClipboardCheck className="h-6 w-6 text-meow-primary" />
                </div>
                <CardTitle>1. Application</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Fill out our adoption application to tell us about yourself, your home, and what you're looking for in a cat.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  variant="ghost" 
                  className="text-meow-primary px-0 hover:bg-transparent hover:text-meow-secondary"
                  onClick={redirectToAdoptionForm}
                >
                  Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
            
            <Card className="transition-all hover:shadow-lg hover:translate-y-[-5px]">
              <CardHeader>
                <div className="bg-meow-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Calendar className="h-6 w-6 text-meow-primary" />
                </div>
                <CardTitle>2. Meet & Greet</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Once your application is approved, we'll schedule a time for you to meet the cat(s) you're interested in adopting.
                </p>
              </CardContent>
            </Card>
            
            <Card className="transition-all hover:shadow-lg hover:translate-y-[-5px]">
              <CardHeader>
                <div className="bg-meow-primary/10 w-12 h-12 rounded-full flex items-center justify-center mb-4">
                  <Home className="h-6 w-6 text-meow-primary" />
                </div>
                <CardTitle>3. Take Home</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  After a successful meet & greet, complete the adoption paperwork, pay the adoption fee, and welcome your new family member!
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
        
        {/* FAQ section with improved styling */}
        <div className="py-16 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">Frequently Asked Questions</h2>
              <div className="h-1 w-20 bg-meow-secondary mx-auto mb-4"></div>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Got questions about adopting from Meow Rescue? We've got answers.
              </p>
            </div>
            
            <div className="max-w-3xl mx-auto">
              <Tabs defaultValue="requirements" className="w-full">
                <TabsList className="grid w-full grid-cols-3 mb-2">
                  <TabsTrigger value="requirements">Requirements</TabsTrigger>
                  <TabsTrigger value="fees">Adoption Fees</TabsTrigger>
                  <TabsTrigger value="process">After Adoption</TabsTrigger>
                </TabsList>
                <TabsContent value="requirements" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Adoption Requirements</CardTitle>
                      <CardDescription>What you need to qualify for adoption</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Age Requirement</h4>
                        <p className="text-gray-600">Adopters must be at least 21 years old.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Housing Information</h4>
                        <p className="text-gray-600">If renting, we need landlord verification that pets are allowed.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Current Pets</h4>
                        <p className="text-gray-600">Information about current pets and their vaccination status.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Valid ID</h4>
                        <p className="text-gray-600">A valid government-issued photo ID is required.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="fees" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Adoption Fees</CardTitle>
                      <CardDescription>What's included in our adoption fees</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Kittens (under 1 year)</h4>
                        <p className="text-gray-600">$150 - Includes spay/neuter, vaccinations, microchip, and health check.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Adult Cats (1-7 years)</h4>
                        <p className="text-gray-600">$100 - Includes spay/neuter, vaccinations, microchip, and health check.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Senior Cats (8+ years)</h4>
                        <p className="text-gray-600">$50 - Includes spay/neuter, vaccinations, microchip, and health check.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Special Needs Cats</h4>
                        <p className="text-gray-600">Fee may be reduced or waived depending on medical needs.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
                <TabsContent value="process" className="mt-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>After You Adopt</CardTitle>
                      <CardDescription>What to expect after bringing your cat home</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-semibold">Follow-Up Support</h4>
                        <p className="text-gray-600">We're here to help with advice and support as your cat adjusts to their new home.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Check-Ins</h4>
                        <p className="text-gray-600">We'll check in with you after 2 weeks, 1 month, and 3 months to see how things are going.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Returns</h4>
                        <p className="text-gray-600">If for any reason the adoption doesn't work out, you must return the cat to Meow Rescue.</p>
                      </div>
                      <div>
                        <h4 className="font-semibold">Resources</h4>
                        <p className="text-gray-600">Access to our resource library for cat care, behavior tips, and recommended products.</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
        
        {/* CTA section with blue background as a distinct box (separated from footer) */}
        <div className="py-16 mb-16 container mx-auto px-4">
          <div className="bg-meow-primary py-12 px-6 rounded-lg shadow-lg">
            <div className="max-w-2xl mx-auto text-center">
              <h2 className="text-3xl font-bold text-white mb-4">Ready to Meet Your New Best Friend?</h2>
              <div className="h-1 w-16 bg-white mx-auto mb-4"></div>
              <p className="text-white mb-8">
                Browse our adoptable cats or start your adoption application today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  onClick={redirectToAvailableCats}
                  variant="default" 
                  size="lg"
                  className="bg-white text-meow-primary hover:bg-gray-100 hover:translate-y-[-2px] transition-all"
                >
                  <Cat className="mr-2 h-5 w-5" />
                  Browse Adoptable Cats
                </Button>
                <Button 
                  onClick={redirectToAdoptionForm}
                  variant="outline" 
                  size="lg"
                  className="border-2 border-white text-white hover:bg-white/10 hover:translate-y-[-2px] transition-all"
                >
                  <Heart className="mr-2 h-5 w-5" />
                  Start Adoption Process
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Adopt;
