
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';

const DonationForm = () => {
  const [amount, setAmount] = useState<string>('25');
  const [isRecurring, setIsRecurring] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Donation submitted:', { amount, isRecurring });
    window.open(`https://example.com/donate?amount=${amount}&recurring=${isRecurring}`, '_blank');
  };

  const predefinedAmounts = ['10', '25', '50', '100', '250', '500'];

  return (
    <Card className="border-0 shadow-lg overflow-hidden">
      <CardHeader className="bg-meow-primary text-white border-b border-meow-primary/20">
        <CardTitle className="text-2xl">Make a Donation</CardTitle>
        <CardDescription className="text-white/90">
          Your support makes our work possible
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <Label className="text-lg font-medium text-meow-primary">Select Amount</Label>
            <div className="grid grid-cols-3 gap-3">
              {predefinedAmounts.map((value) => (
                <button
                  key={value}
                  type="button"
                  onClick={() => setAmount(value)}
                  className={`py-3 rounded-md transition-all ${
                    amount === value 
                      ? 'bg-meow-primary text-white shadow-md' 
                      : 'bg-gray-50 border border-gray-200 text-gray-700 hover:border-meow-primary/50'
                  }`}
                >
                  ${value}
                </button>
              ))}
            </div>
            
            <div className="pt-2">
              <Label htmlFor="custom-amount" className="text-sm text-gray-600">Custom Amount</Label>
              <div className="relative mt-1">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500 font-medium">$</span>
                <Input 
                  id="custom-amount" 
                  type="number" 
                  min="1" 
                  step="1" 
                  className="pl-8 border-gray-300 focus:border-meow-primary focus:ring focus:ring-meow-primary/20"
                  placeholder="Enter amount" 
                  value={amount} 
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>
          </div>
          
          <div className="pt-2">
            <RadioGroup defaultValue="one-time" className="flex flex-col space-y-3">
              <div className="flex items-center space-x-2 bg-white p-3 border border-gray-200 rounded-md">
                <RadioGroupItem value="one-time" id="one-time" onClick={() => setIsRecurring(false)} />
                <Label htmlFor="one-time" className="cursor-pointer flex flex-col">
                  <span className="font-medium">One-time donation</span>
                  <span className="text-xs text-gray-500">Make a single donation today</span>
                </Label>
              </div>
              <div className="flex items-center space-x-2 bg-white p-3 border border-gray-200 rounded-md">
                <RadioGroupItem value="monthly" id="monthly" onClick={() => setIsRecurring(true)} />
                <Label htmlFor="monthly" className="cursor-pointer flex flex-col">
                  <span className="font-medium">Monthly donation</span>
                  <span className="text-xs text-gray-500">Support our mission with a recurring donation</span>
                </Label>
              </div>
            </RadioGroup>
          </div>
          
          <Button type="submit" className="w-full bg-meow-primary hover:bg-meow-primary/90 text-white font-semibold py-4 rounded-md">
            {isRecurring ? 'Donate Monthly' : 'Donate Now'}
          </Button>
        </form>
      </CardContent>
      
      <CardFooter className="bg-gray-50 border-t p-4 text-sm text-center text-gray-500">
        Meow Rescue is a 501(c)(3) nonprofit organization. All donations are tax-deductible.
      </CardFooter>
    </Card>
  );
};

export default DonationForm;
