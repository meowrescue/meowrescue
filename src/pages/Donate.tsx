import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { Button } from "@/components/ui/button";
import { Heart, DollarSign, Gift, ShoppingBag } from 'lucide-react';
import { useToast } from "@/hooks/use-toast";

const Donate: React.FC = () => {
  const { toast } = useToast();
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [customAmount, setCustomAmount] = useState<string>('');
  const [isMonthly, setIsMonthly] = useState(false);

  // This effect ensures the Donate button is not incorrectly disabled
  useEffect(() => {
    // Check if there's a valid amount selected or entered
    const hasValidAmount = (selectedAmount && selectedAmount > 0) || 
                          (customAmount && parseFloat(customAmount) > 0);
    
    // Log to console for debugging
    console.log("Donation state:", { 
      selectedAmount, 
      customAmount, 
      hasCustomAmount: customAmount !== '',
      hasValidAmount,
      isMonthly 
    });
  }, [selectedAmount, customAmount, isMonthly]);

  // Handler for selecting a predefined amount
  const handleAmountSelection = (amount: number) => {
    setSelectedAmount(amount);
    setCustomAmount('');
  };

  // Handler for custom amount input
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    // Only allow numbers and decimal point
    if (value === '' || /^\d*\.?\d{0,2}$/.test(value)) {
      setCustomAmount(value);
      setSelectedAmount(null);
    }
  };

  // Handler for donation button click
  const handleDonateClick = () => {
    const amount = selectedAmount || (customAmount ? parseFloat(customAmount) : null);
    
    if (!amount || amount <= 0) {
      toast({
        title: "Please select an amount",
        description: "Please select or enter a valid donation amount.",
        variant: "destructive"
      });
      return;
    }

    // For now, just show a toast with the donation details
    // This will be replaced with actual Stripe integration later
    toast({
      title: "Thank you for your donation!",
      description: `You have selected to donate $${amount}${isMonthly ? ' monthly' : ''}. Stripe integration coming soon.`,
      variant: "default"
    });
    
    console.log("Donation details:", { amount, isMonthly });
  };

  // Handler for donation to specific cause
  const handleSpecificDonation = (amount: number, cause: string) => {
    toast({
      title: "Thank you for your donation!",
      description: `You have selected to donate $${amount} to ${cause}. Stripe integration coming soon.`,
      variant: "default"
    });
    
    console.log("Specific donation:", { amount, cause, isMonthly: false });
  };

  // Determine if the donate button should be enabled
  const isDonateButtonEnabled = () => {
    return (selectedAmount !== null && selectedAmount > 0) || 
           (customAmount !== '' && parseFloat(customAmount) > 0);
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Make a Difference" 
          subtitle="Your support helps us save more lives"
          centered
        />
        
        <div className="max-w-3xl mx-auto text-center mb-12">
          <p className="text-gray-700 text-lg mb-6">
            Meow Rescue relies entirely on donations to continue our life-saving work. Your contribution directly supports the cats in our care, providing food, shelter, medical care, and love until they find their forever homes.
          </p>
          <p className="text-gray-700 text-lg">
            As a home-based rescue caring for approximately 24 cats at any given time, every dollar makes a difference. We appreciate your support in any amount.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-16">
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-meow-primary/10 rounded-full">
                <Heart size={32} className="text-meow-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">One-Time Donation</h2>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[25, 50, 100, 250].map((amount) => (
                <Button 
                  key={amount}
                  variant={selectedAmount === amount && !isMonthly ? "meow" : "outline"} 
                  className={`${selectedAmount === amount && !isMonthly ? 'text-white' : 'text-meow-primary border-meow-primary hover:bg-meow-primary/10'}`}
                  onClick={() => {
                    handleAmountSelection(amount);
                    setIsMonthly(false);
                  }}
                >
                  ${amount}
                </Button>
              ))}
            </div>
            
            <div className="mb-6">
              <label htmlFor="custom-amount" className="block text-sm font-medium text-gray-700 mb-1">
                Or enter a custom amount
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span className="text-gray-500">$</span>
                </div>
                <input
                  type="text"
                  id="custom-amount"
                  value={customAmount}
                  onChange={handleCustomAmountChange}
                  className="w-full pl-7 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-meow-primary focus:border-transparent"
                  placeholder="Other amount"
                />
              </div>
            </div>
            
            <Button 
              className="w-full bg-meow-secondary hover:bg-meow-secondary/90" 
              onClick={handleDonateClick}
              disabled={!isDonateButtonEnabled() || isMonthly}
            >
              Donate Now
            </Button>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-8">
            <div className="flex justify-center mb-6">
              <div className="p-3 bg-meow-primary/10 rounded-full">
                <DollarSign size={32} className="text-meow-primary" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-center mb-6">Monthly Donation</h2>
            <p className="text-gray-700 mb-6 text-center">
              Become a sustaining supporter with a monthly donation that provides reliable, ongoing support for our cats.
            </p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              {[10, 20, 50, 100].map((amount) => (
                <Button 
                  key={amount}
                  variant={selectedAmount === amount && isMonthly ? "meow" : "outline"} 
                  className={`${selectedAmount === amount && isMonthly ? 'text-white' : 'text-meow-primary border-meow-primary hover:bg-meow-primary/10'}`}
                  onClick={() => {
                    handleAmountSelection(amount);
                    setIsMonthly(true);
                  }}
                >
                  ${amount}/mo
                </Button>
              ))}
            </div>
            
            <Button 
              className="w-full bg-meow-secondary hover:bg-meow-secondary/90"
              onClick={handleDonateClick}
              disabled={!selectedAmount || !isMonthly}
            >
              Become a Monthly Supporter
            </Button>
          </div>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-bold text-meow-primary mb-8 text-center">Your Donation in Action</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-meow-secondary font-bold text-3xl mb-2">$15</div>
              <p className="text-gray-700">Feeds a cat for one week</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-meow-secondary font-bold text-3xl mb-2">$50</div>
              <p className="text-gray-700">Provides vaccinations for one cat</p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="text-meow-secondary font-bold text-3xl mb-2">$150</div>
              <p className="text-gray-700">Covers spay/neuter surgery</p>
            </div>
          </div>
          
          <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
            <h3 className="text-xl font-bold text-meow-primary mb-4">Help Fluffy Heal</h3>
            <div className="md:flex items-center">
              <div className="md:w-1/3 mb-4 md:mb-0 md:mr-6">
                <img 
                  src="https://images.unsplash.com/photo-1573865526739-10659fec78a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1915&q=80" 
                  alt="Fluffy the cat" 
                  className="rounded-lg w-full h-auto"
                />
              </div>
              <div className="md:w-2/3">
                <p className="text-gray-700 mb-4">
                  Fluffy was rescued after a suspected coyote attack with severe injuries. He needs veterinary assessment, 
                  treatment for a skin condition, neutering, and flea treatment. Your donation can help Fluffy get the medical care he needs.
                </p>
                <div className="flex justify-center md:justify-start">
                  <Button 
                    className="bg-meow-secondary hover:bg-meow-secondary/90"
                    onClick={() => handleSpecificDonation(250, "Fluffy's Care")}
                  >
                    Help Fluffy - Donate $250
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <div>
            <div className="flex items-center mb-4">
              <div className="p-2 bg-meow-primary/10 rounded-full mr-3">
                <Gift size={24} className="text-meow-primary" />
              </div>
              <h2 className="text-2xl font-bold text-meow-primary">Other Ways to Give</h2>
            </div>
            
            <div className="space-y-6">
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-meow-primary mb-2">Memorial Gifts</h3>
                <p className="text-gray-700">
                  Honor the memory of a loved one or beloved pet with a donation in their name. 
                  We'll send a personalized acknowledgment card to the designated recipient.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-meow-primary mb-2">Workplace Giving</h3>
                <p className="text-gray-700">
                  Many employers offer matching gift programs that can double or even triple your donation. 
                  Check with your HR department to see if your company participates.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-meow-primary mb-2">Legacy Giving</h3>
                <p className="text-gray-700">
                  Include Meow Rescue in your estate planning to create a lasting legacy that will help cats in need for years to come. 
                  Contact us for more information.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <div className="flex items-center mb-4">
              <div className="p-2 bg-meow-primary/10 rounded-full mr-3">
                <ShoppingBag size={24} className="text-meow-primary" />
              </div>
              <h2 className="text-2xl font-bold text-meow-primary">Wish List</h2>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <p className="text-gray-700 mb-4">
                In addition to monetary donations, we're always in need of supplies. Here are some items that help us care for our cats:
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-meow-primary mb-2">Food & Nutrition</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Purina ONE chicken dry food</li>
                    <li>Fancy Feast canned food</li>
                    <li>Kitten food (wet and dry)</li>
                    <li>KMR kitten formula</li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="font-semibold text-meow-primary mb-2">Supplies</h3>
                  <ul className="list-disc list-inside text-gray-700 space-y-1">
                    <li>Clumping cat litter</li>
                    <li>Disposable litter boxes</li>
                    <li>Paper towels</li>
                    <li>Bleach and cleaning supplies</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-6">
                <h3 className="font-semibold text-meow-primary mb-2">Comfort Items</h3>
                <ul className="list-disc list-inside text-gray-700 space-y-1">
                  <li>Cat beds</li>
                  <li>Clean towels and blankets</li>
                  <li>Cat toys</li>
                  <li>Scratching posts</li>
                </ul>
              </div>
              
              <div className="mt-6 text-center">
                <Button 
                  className="bg-meow-primary hover:bg-meow-primary/90"
                  onClick={() => {
                    toast({
                      title: "Amazon Wish List",
                      description: "You'll be redirected to our Amazon Wish List",
                      variant: "default"
                    });
                    // In a real implementation, this would open the Amazon wish list in a new tab
                    window.open('https://www.amazon.com/hz/wishlist/ls/example', '_blank');
                  }}
                >
                  View Our Amazon Wish List
                </Button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-lg shadow-md max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-meow-primary mb-4">Thank You for Your Support!</h2>
          <p className="text-gray-700 mb-6">
            Meow Rescue is a home-based cat rescue. Your donations help cover the costs of food, medical care, and supplies for our cats in need.
          </p>
          <p className="text-gray-700">
            If you have any questions about donating or would like to discuss other ways to support our mission, please <a href="/contact" className="text-meow-primary hover:underline">contact us</a>.
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Donate;
