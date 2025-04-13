
import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Switch } from '@/components/ui/switch';
import { Heart, DollarSign, CreditCard, Calendar, Gift, ArrowRight } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

const DonationAmounts = [25, 50, 100, 250, 500];

const DonatePage: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [isRecurring, setIsRecurring] = useState(false);
  const [amount, setAmount] = useState(50);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustomAmount, setIsCustomAmount] = useState(false);
  const [donationFrequency, setDonationFrequency] = useState('monthly');
  const [designation, setDesignation] = useState('general');
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleAmountClick = (value: number) => {
    setAmount(value);
    setIsCustomAmount(false);
    setCustomAmount('');
  };
  
  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    setCustomAmount(value);
    setIsCustomAmount(true);
    
    if (parseFloat(value) > 0) {
      setAmount(parseFloat(value));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (amount <= 0) {
      toast({
        title: "Invalid Amount",
        description: "Please enter a valid donation amount.",
        variant: "destructive",
      });
      return;
    }
    
    setIsProcessing(true);
    
    try {
      // For now, just record the donation intent
      const donationData = {
        amount,
        is_recurring: isRecurring,
        donation_date: new Date().toISOString(),
        donor_profile_id: user?.id,
        status: 'pending',
        designation: designation,
        payment_method: 'credit_card',
      };
      
      const { data, error } = await supabase
        .from('donations')
        .insert([donationData])
        .select();
      
      if (error) throw error;
      
      // Simulate payment processing
      setTimeout(() => {
        toast({
          title: "Donation Successful",
          description: "Thank you for your generous donation!",
          variant: "default",
        });
        setIsProcessing(false);
        // Reset form
        setAmount(50);
        setCustomAmount('');
        setIsCustomAmount(false);
        setIsRecurring(false);
      }, 2000);
      
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "There was an error processing your donation. Please try again.",
        variant: "destructive",
      });
      setIsProcessing(false);
    }
  };
  
  return (
    <Layout>
      <SEO 
        title="Donate | Meow Rescue"
        description="Your donation helps us care for homeless cats and kittens. Every dollar makes a difference in the lives of our feline friends."
      />
      
      <div className="container mx-auto py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-meow-primary mb-4">Make a Difference Today</h1>
            <p className="text-lg text-gray-600 mb-8">
              Your donation helps us provide food, shelter, medical care, and love for cats in need. 
              It costs approximately $1,000 to rescue, care for, and find a home for each cat.
            </p>
            <div className="flex justify-center">
              <Heart className="text-red-500 h-12 w-12" />
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-12">
            <Card className="md:col-span-3">
              <CardHeader>
                <CardTitle className="text-2xl">Your Donation</CardTitle>
                <CardDescription>
                  Choose an amount and payment frequency
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit}>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-base font-medium mb-4 block">
                        Select an amount:
                      </Label>
                      <div className="grid grid-cols-3 gap-3 mb-3">
                        {DonationAmounts.map((value) => (
                          <Button
                            key={value}
                            type="button"
                            variant={amount === value && !isCustomAmount ? "meow" : "outline"}
                            onClick={() => handleAmountClick(value)}
                            className="h-12"
                          >
                            ${value}
                          </Button>
                        ))}
                      </div>
                      <div className="flex gap-3 items-center">
                        <DollarSign className="h-5 w-5 text-gray-500" />
                        <Input
                          placeholder="Other amount"
                          className={isCustomAmount ? "border-meow-primary" : ""}
                          value={customAmount}
                          onChange={handleCustomAmountChange}
                        />
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="recurring"
                        checked={isRecurring}
                        onCheckedChange={setIsRecurring}
                      />
                      <Label htmlFor="recurring">Make this a recurring donation</Label>
                    </div>
                    
                    {isRecurring && (
                      <div>
                        <Label className="text-base font-medium mb-2 block">
                          Donation frequency:
                        </Label>
                        <RadioGroup
                          defaultValue="monthly"
                          value={donationFrequency}
                          onValueChange={setDonationFrequency}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="monthly" id="monthly" />
                            <Label htmlFor="monthly">Monthly</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="quarterly" id="quarterly" />
                            <Label htmlFor="quarterly">Quarterly</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="yearly" id="yearly" />
                            <Label htmlFor="yearly">Yearly</Label>
                          </div>
                        </RadioGroup>
                      </div>
                    )}
                    
                    <div>
                      <Label className="text-base font-medium mb-2 block">
                        Designation (optional):
                      </Label>
                      <RadioGroup
                        defaultValue="general"
                        value={designation}
                        onValueChange={setDesignation}
                        className="grid grid-cols-1 md:grid-cols-2 gap-2"
                      >
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="general" id="general" />
                          <Label htmlFor="general">General Fund</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="medical" id="medical" />
                          <Label htmlFor="medical">Medical Care</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="food" id="food" />
                          <Label htmlFor="food">Food & Supplies</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <RadioGroupItem value="foster" id="foster" />
                          <Label htmlFor="foster">Foster Program</Label>
                        </div>
                      </RadioGroup>
                    </div>
                    
                    {/* Simple payment information form (placeholder for Stripe integration) */}
                    <div className="border-t pt-6 mt-6">
                      <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="cardHolder">Cardholder Name</Label>
                          <Input id="cardHolder" placeholder="Name on card" />
                        </div>
                        <div>
                          <Label htmlFor="cardNumber">Card Number</Label>
                          <div className="relative">
                            <Input 
                              id="cardNumber" 
                              placeholder="1234 5678 9012 3456" 
                              className="pl-10"
                            />
                            <CreditCard className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="expiry">Expiry Date</Label>
                            <div className="relative">
                              <Input 
                                id="expiry" 
                                placeholder="MM/YY" 
                                className="pl-10"
                              />
                              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                            </div>
                          </div>
                          <div>
                            <Label htmlFor="cvc">CVC</Label>
                            <Input id="cvc" placeholder="123" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8">
                    <Button
                      type="submit"
                      variant="meow"
                      className="w-full py-6 text-lg"
                      disabled={isProcessing || amount <= 0}
                    >
                      {isProcessing ? (
                        <>
                          <span className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mr-2"></span>
                          Processing...
                        </>
                      ) : (
                        <>
                          Donate {isCustomAmount || !DonationAmounts.includes(amount) ? `$${amount}` : `$${amount}`}
                          {isRecurring ? ` ${donationFrequency}` : ''}
                        </>
                      )}
                    </Button>
                    <p className="text-sm text-center mt-3 text-gray-500">
                      Your donation is tax-deductible to the extent allowed by law.
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>
            
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-xl">Why Your Support Matters</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex gap-3">
                  <div className="bg-meow-secondary/10 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                    <DollarSign className="h-5 w-5 text-meow-secondary" />
                  </div>
                  <div>
                    <h3 className="font-medium">$1,000</h3>
                    <p className="text-sm text-gray-600">Average cost to rescue, care for, and find a home for one cat</p>
                  </div>
                </div>
                
                <div className="flex gap-3">
                  <div className="bg-meow-primary/10 p-2 rounded-full h-10 w-10 flex items-center justify-center">
                    <Gift className="h-5 w-5 text-meow-primary" />
                  </div>
                  <div>
                    <h3 className="font-medium">100%</h3>
                    <p className="text-sm text-gray-600">Of your donation goes directly to helping cats in need</p>
                  </div>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <p className="text-sm text-gray-600 mb-4">
                    Your donation helps provide:
                  </p>
                  <ul className="text-sm space-y-2">
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-meow-primary" />
                      Medical care and vaccinations
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-meow-primary" />
                      Food and shelter
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-meow-primary" />
                      Spay/neuter surgeries
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-meow-primary" />
                      Foster care supplies
                    </li>
                    <li className="flex items-center gap-2">
                      <ArrowRight className="h-3 w-3 text-meow-primary" />
                      Rescue operations
                    </li>
                  </ul>
                </div>
                
                <div className="border-t pt-4 mt-4">
                  <blockquote className="italic text-sm text-gray-600">
                    "Every dollar makes a difference in the life of a cat in need. Thank you for your compassion and generosity."
                  </blockquote>
                  <p className="text-sm font-medium mt-2">— The Meow Rescue Team</p>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-8 text-center mb-12">
            <h2 className="text-2xl font-bold mb-4">Other Ways to Support</h2>
            <p className="mb-6">In addition to monetary donations, there are many other ways you can help.</p>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Volunteer</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Share your time and skills to help our organization and the cats in our care.</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="meowOutline" className="w-full">
                    <a href="/volunteer">Learn More</a>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Foster</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Provide a temporary home for cats and kittens waiting for their forever homes.</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="meowOutline" className="w-full">
                    <a href="/volunteer">Apply to Foster</a>
                  </Button>
                </CardFooter>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Supplies</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm">Donate food, litter, toys, and other supplies from our wishlist.</p>
                </CardContent>
                <CardFooter>
                  <Button asChild variant="meowOutline" className="w-full">
                    <a href="/contact">Contact Us</a>
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
          
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Donation FAQs</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-medium mb-1">Is my donation tax-deductible?</h3>
                <p className="text-sm text-gray-600">
                  Yes, Meow Rescue is a registered nonprofit organization. Your donation is tax-deductible to the extent allowed by law.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Can I make a donation in memory or honor of someone?</h3>
                <p className="text-sm text-gray-600">
                  Yes, you can make a tribute donation. Please contact us directly to arrange this.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">How is my donation used?</h3>
                <p className="text-sm text-gray-600">
                  Your donation directly supports our rescue operations, medical care, food, shelter, and adoption programs for cats in need.
                </p>
              </div>
              
              <div>
                <h3 className="font-medium mb-1">Can I cancel my recurring donation?</h3>
                <p className="text-sm text-gray-600">
                  Yes, you can cancel or modify your recurring donation at any time by contacting us or logging into your account.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default DonatePage;
