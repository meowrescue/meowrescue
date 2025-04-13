
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Heart, PawPrint, Users, Package, Clock, HandHeart, Handshake } from 'lucide-react';
import SEO from '@/components/SEO';

const DonateCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}> = ({ icon, title, description, buttonText, buttonLink }) => (
  <Card className="h-full flex flex-col">
    <CardHeader>
      <div className="mb-2">{icon}</div>
      <CardTitle>{title}</CardTitle>
      <CardDescription className="min-h-[80px]">{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow"></CardContent>
    <CardFooter className="pt-0">
      <Button asChild variant="outline" className="w-full">
        <a href={buttonLink}>{buttonText}</a>
      </Button>
    </CardFooter>
  </Card>
);

const Donate: React.FC = () => {
  const [amount, setAmount] = React.useState<string>('25');
  const [isRecurring, setIsRecurring] = React.useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Donation submitted:', { amount, isRecurring });
    // In a real implementation, this would connect to a payment processor
    window.open(`https://example.com/donate?amount=${amount}&recurring=${isRecurring}`, '_blank');
  };

  return (
    <Layout>
      <SEO 
        title="Donate | Meow Rescue" 
        description="Support our mission to help cats in need by making a donation to Meow Rescue." 
      />
      
      <div className="container mx-auto py-12">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-meow-primary mb-4">Support Our Mission</h1>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto">
            Your donation helps us rescue, rehabilitate, and rehome cats in need. Every contribution makes a difference in the lives of these animals.
          </p>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          <div>
            <h2 className="text-2xl font-bold mb-4 text-meow-secondary">Why Donate?</h2>
            <div className="space-y-6">
              <div className="flex items-start">
                <PawPrint className="h-6 w-6 text-meow-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-lg">Medical Care</h3>
                  <p className="text-gray-600">Your donations help cover veterinary expenses, medications, surgeries, and preventative care.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Package className="h-6 w-6 text-meow-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-lg">Food and Supplies</h3>
                  <p className="text-gray-600">We need quality food, litter, bedding, toys, and other essential supplies to care for our cats.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Users className="h-6 w-6 text-meow-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-lg">Staff and Facilities</h3>
                  <p className="text-gray-600">Your donations help maintain our facility and support our dedicated staff and volunteers.</p>
                </div>
              </div>
              
              <div className="flex items-start">
                <Clock className="h-6 w-6 text-meow-primary mr-3 mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-medium text-lg">Sustained Support</h3>
                  <p className="text-gray-600">Regular monthly donations help us plan and budget for the future, ensuring we can always be there for cats in need.</p>
                </div>
              </div>
            </div>
            
            <div className="mt-8">
              <h3 className="text-lg font-medium mb-2">Tax Information</h3>
              <p className="text-gray-600">
                Meow Rescue is a 501(c)(3) nonprofit organization. Your donation is tax-deductible to the extent allowed by law.
              </p>
            </div>
          </div>
          
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="text-2xl flex items-center">
                  <Heart className="h-5 w-5 text-red-500 mr-2" />
                  Make a Donation
                </CardTitle>
                <CardDescription>Support our mission with a financial contribution</CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <Tabs defaultValue="amount" className="mb-6">
                    <TabsList className="grid grid-cols-2">
                      <TabsTrigger value="amount">Amount</TabsTrigger>
                      <TabsTrigger value="custom">Custom</TabsTrigger>
                    </TabsList>
                    <TabsContent value="amount" className="space-y-4">
                      <RadioGroup 
                        value={amount} 
                        onValueChange={setAmount}
                        className="grid grid-cols-3 gap-4 pt-3"
                      >
                        {['25', '50', '100', '250', '500', '1000'].map((value) => (
                          <div key={value} className="flex items-center space-x-2">
                            <RadioGroupItem value={value} id={`amount-${value}`} />
                            <Label htmlFor={`amount-${value}`} className="cursor-pointer">${value}</Label>
                          </div>
                        ))}
                      </RadioGroup>
                    </TabsContent>
                    <TabsContent value="custom">
                      <div className="space-y-2">
                        <Label htmlFor="custom-amount">Custom Amount</Label>
                        <div className="relative">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                          <Input 
                            id="custom-amount" 
                            type="number" 
                            min="1" 
                            step="1" 
                            className="pl-8" 
                            placeholder="Enter amount" 
                            value={amount} 
                            onChange={(e) => setAmount(e.target.value)}
                          />
                        </div>
                      </div>
                    </TabsContent>
                  </Tabs>
                  
                  <div className="mb-6">
                    <div className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id="recurring"
                        checked={isRecurring}
                        onChange={() => setIsRecurring(!isRecurring)}
                        className="rounded border-gray-300 text-meow-primary focus:ring-meow-primary"
                      />
                      <Label htmlFor="recurring">Make this a monthly donation</Label>
                    </div>
                    {isRecurring && (
                      <p className="text-sm text-gray-500 mt-1">
                        You can cancel your monthly donation at any time.
                      </p>
                    )}
                  </div>
                  
                  <Button type="submit" className="w-full">
                    {isRecurring ? 'Donate Monthly' : 'Donate Now'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <h2 className="text-2xl font-bold mb-6 text-center text-meow-primary">Other Ways to Support</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <DonateCard
            icon={<HandHeart className="h-10 w-10 text-meow-primary" />}
            title="Foster a Cat"
            description="Open your home to a cat in need. Fostering saves lives and helps cats prepare for their forever homes."
            buttonText="Become a Foster"
            buttonLink="/foster"
          />
          
          <DonateCard
            icon={<Handshake className="h-10 w-10 text-meow-primary" />}
            title="Volunteer"
            description="Share your time and skills. We have volunteer opportunities for everyone, from cat care to administration."
            buttonText="Volunteer With Us"
            buttonLink="/volunteer"
          />
          
          <DonateCard
            icon={<Package className="h-10 w-10 text-meow-primary" />}
            title="Donate Supplies"
            description="We always need cat food, litter, toys, and other supplies. Check our wishlist for our current needs."
            buttonText="View Wishlist"
            buttonLink="/wishlist"
          />
        </div>
      </div>
    </Layout>
  );
};

export default Donate;
