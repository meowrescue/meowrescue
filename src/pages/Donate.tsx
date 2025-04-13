import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, ShoppingBag, Briefcase, Calendar, DollarSign, Gift, Truck, HandHeart, Users, PawPrint } from 'lucide-react';

// This is a new component to ensure that no matter the height of the content above,
// the buttons will align horizontally at the bottom
const OtherWaysCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}> = ({ icon, title, description, buttonText, buttonLink }) => {
  return (
    <Card className="bg-white shadow-md border-none overflow-hidden h-full flex flex-col">
      <CardHeader className="pb-2">
        <div className="mb-4">
          {icon}
        </div>
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent className="flex-grow">
        <p className="text-gray-600">{description}</p>
      </CardContent>
      <CardFooter className="pt-2">
        <Button asChild variant="outline" className="w-full">
          <Link to={buttonLink}>{buttonText}</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

const DonatePage: React.FC = () => {
  return (
    <Layout>
      <SEO title="Donate | Meow Rescue" description="Support our mission to rescue and care for cats in need. Your donations make a difference in the lives of homeless cats." />
      
      <div className="container mx-auto py-16 px-4">
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Donate to Meow Rescue</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your donation helps us provide food, shelter, medical care, and love to cats in need.
            Every dollar makes a difference in the lives of our feline friends.
          </p>
        </div>
        
        {/* Donation Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
          <Card className="bg-white shadow-lg border-none overflow-hidden">
            <CardHeader className="bg-meow-primary text-white text-center py-8">
              <Heart className="h-12 w-12 mx-auto mb-4" />
              <CardTitle className="text-2xl">One-Time</CardTitle>
              <CardDescription className="text-white/80">Make a single donation</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button className="rounded-full h-16 w-16">$25</Button>
                  <Button className="rounded-full h-16 w-16">$50</Button>
                  <Button className="rounded-full h-16 w-16 bg-meow-secondary">$100</Button>
                  <Button className="rounded-full h-16 w-16">$250</Button>
                  <Button className="rounded-full h-16 w-16">$500</Button>
                </div>
                <div className="text-center text-sm text-gray-500 pt-4">
                  <p>Or enter a custom amount</p>
                  <div className="relative mt-2 max-w-xs mx-auto">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                      placeholder="Other amount"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full py-6 text-lg">Donate Now</Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white shadow-lg border-none overflow-hidden relative md:transform md:-translate-y-4 md:scale-105 z-10">
            <div className="absolute top-0 right-0 bg-meow-secondary text-white px-4 py-1 text-sm font-medium">
              Popular
            </div>
            <CardHeader className="bg-meow-secondary text-white text-center py-8">
              <Gift className="h-12 w-12 mx-auto mb-4" />
              <CardTitle className="text-2xl">Monthly</CardTitle>
              <CardDescription className="text-white/80">Become a sustaining supporter</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <div className="space-y-6">
                <div className="flex flex-wrap gap-3 justify-center">
                  <Button variant="outline" className="rounded-full h-16 w-16">$10</Button>
                  <Button variant="outline" className="rounded-full h-16 w-16">$15</Button>
                  <Button className="rounded-full h-16 w-16 bg-meow-secondary">$25</Button>
                  <Button variant="outline" className="rounded-full h-16 w-16">$50</Button>
                  <Button variant="outline" className="rounded-full h-16 w-16">$100</Button>
                </div>
                <div className="text-center text-sm text-gray-500 pt-4">
                  <p>Or enter a custom monthly amount</p>
                  <div className="relative mt-2 max-w-xs mx-auto">
                    <DollarSign className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input 
                      type="text" 
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                      placeholder="Other amount"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full py-6 text-lg bg-meow-secondary hover:bg-meow-secondary/90">
                Become a Monthly Donor
              </Button>
            </CardFooter>
          </Card>
          
          <Card className="bg-white shadow-lg border-none overflow-hidden">
            <CardHeader className="bg-meow-primary text-white text-center py-8">
              <Briefcase className="h-12 w-12 mx-auto mb-4" />
              <CardTitle className="text-2xl">Corporate</CardTitle>
              <CardDescription className="text-white/80">Partner with us</CardDescription>
            </CardHeader>
            <CardContent className="p-6">
              <p className="text-center text-gray-600 mb-8">
                Partner your business with Meow Rescue. Sponsorship opportunities, 
                matching gifts, and workplace giving programs available.
              </p>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="bg-meow-primary/10 p-2 rounded-full mr-4">
                    <ShoppingBag className="h-5 w-5 text-meow-primary" />
                  </div>
                  <span className="text-gray-700">Sponsorship opportunities</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-meow-primary/10 p-2 rounded-full mr-4">
                    <HandHeart className="h-5 w-5 text-meow-primary" />
                  </div>
                  <span className="text-gray-700">Employee matching gifts</span>
                </div>
                <div className="flex items-center">
                  <div className="bg-meow-primary/10 p-2 rounded-full mr-4">
                    <Calendar className="h-5 w-5 text-meow-primary" />
                  </div>
                  <span className="text-gray-700">Event partnerships</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-6 pt-0">
              <Button className="w-full py-6 text-lg" variant="outline" asChild>
                <Link to="/contact">Contact Us</Link>
              </Button>
            </CardFooter>
          </Card>
        </div>
        
        {/* Impact Section */}
        <div className="bg-gray-50 rounded-lg p-8 mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-meow-primary mb-4">Your Donation Makes an Impact</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Here's how your contribution helps cats in need
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-white rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4 shadow-md">
                <DollarSign className="h-10 w-10 text-meow-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">$25</h3>
              <p className="text-gray-600">
                Provides food and litter for one cat for two weeks
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4 shadow-md">
                <DollarSign className="h-10 w-10 text-meow-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">$50</h3>
              <p className="text-gray-600">
                Covers basic vaccinations for a rescued cat
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4 shadow-md">
                <DollarSign className="h-10 w-10 text-meow-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">$100</h3>
              <p className="text-gray-600">
                Helps cover the cost of spay/neuter surgery
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-white rounded-full h-24 w-24 flex items-center justify-center mx-auto mb-4 shadow-md">
                <DollarSign className="h-10 w-10 text-meow-primary" />
              </div>
              <h3 className="text-xl font-bold mb-2">$250</h3>
              <p className="text-gray-600">
                Provides emergency medical care for an injured cat
              </p>
            </div>
          </div>
        </div>
        
        {/* Other Ways to Help Section */}
        <div className="mb-20">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-meow-primary mb-4">Other Ways to Support</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Financial donations are just one way to help. Here are other meaningful ways you can support our mission.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <OtherWaysCard
              icon={<PawPrint className="h-8 w-8 text-meow-primary" />}
              title="Foster a Cat"
              description="Open your home temporarily to a cat in need. We provide all supplies and support."
              buttonText="Learn About Fostering"
              buttonLink="/foster"
            />
            
            <OtherWaysCard
              icon={<Users className="h-8 w-8 text-meow-primary" />}
              title="Volunteer With Us"
              description="Share your time and talents. We have opportunities for all skill sets and schedules."
              buttonText="Volunteer Opportunities"
              buttonLink="/volunteer"
            />
            
            <OtherWaysCard
              icon={<Truck className="h-8 w-8 text-meow-primary" />}
              title="Donate Supplies"
              description="We always need food, litter, toys, bedding, and other cat care supplies."
              buttonText="View Our Wishlist"
              buttonLink="/contact"
            />
          </div>
        </div>
        
        {/* FAQ Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-meow-primary mb-8 text-center">Donation FAQs</h2>
          
          <div className="space-y-6 max-w-4xl mx-auto">
            <div>
              <h3 className="text-lg font-semibold mb-2">Is my donation tax-deductible?</h3>
              <p className="text-gray-600">
                Yes! Meow Rescue is a registered 501(c)(3) non-profit organization, and all donations are tax-deductible to the extent allowed by law.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I make a donation in memory or honor of someone?</h3>
              <p className="text-gray-600">
                Absolutely. Memorial and tribute gifts are a wonderful way to honor a loved one while helping cats in need. Please include the honoree's information in the notes section of your donation.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">How can my company match my donation?</h3>
              <p className="text-gray-600">
                Many employers offer matching gift programs that can double or even triple your contribution. Check with your HR department to see if your company offers this benefit and how to submit a matching gift request.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">Can I donate to a specific program?</h3>
              <p className="text-gray-600">
                Yes, you can designate your gift to support a specific program such as our medical fund, spay/neuter initiatives, or foster program. Simply note your preference when making your donation.
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default DonatePage;
