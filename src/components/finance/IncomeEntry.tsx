import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Calendar, FileText, DollarSign, Info } from 'lucide-react';
import { format } from 'date-fns';
import { supabase } from '@/integrations/supabase/client';
import { restrictToTwoDecimals, formatCurrency, enforceCurrencyInput } from '@/lib/utils';

// Top 25 most common income sources for cat rescues
const INCOME_TYPES = [
  'Individual Donation',
  'Corporate Donation',
  'Grant',
  'Adoption Fee',
  'Event Revenue',
  'Monthly Sponsorship',
  'Merchandise Sales',
  'Facebook Fundraiser',
  'GoFundMe',
  'Membership Dues',
  'In-Kind Donation',
  'Veterinary Sponsorship',
  'Corporate Matching',
  'Bequest/Legacy Gift',
  'Amazon Smile',
  'eBay for Charity',
  'Kroger Community Rewards',
  'Scrip Program',
  'Chewy Affiliate',
  'PetSmart Charity Partnership',
  'Thrift Store Proceeds',
  'Cat Cafe Revenue',
  'Calendar Sales',
  'Workplace Giving',
  'Other'
];

const IncomeEntry: React.FC = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [incomeData, setIncomeData] = useState({
    amount: '',
    income_date: format(new Date(), 'yyyy-MM-dd'),
    description: '',
    income_type: '',
    receipt_url: '',
    notes: ''
  });

  // Only allow 2 decimals, auto add .00 if not present, and restrict on input!
  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = enforceCurrencyInput(e.target.value);
    setIncomeData(prev => ({
      ...prev,
      amount: value
    }));
  };

  const handleAmountBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    const value = restrictToTwoDecimals(e.target.value);
    setIncomeData(prev => ({
      ...prev,
      amount: value
    }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setIncomeData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Insert the income as a donation
      const parsedAmount = parseFloat(restrictToTwoDecimals(incomeData.amount));
      const { data, error } = await supabase.from('donations').insert({
        amount: Number(parsedAmount.toFixed(2)),
        donation_date: new Date(incomeData.income_date).toISOString(),
        notes: incomeData.description + (incomeData.notes ? '\n\n' + incomeData.notes : ''),
        income_type: incomeData.income_type,
        status: 'completed',
        is_recurring: false,
        donor_profile_id: supabase.auth.getUser() ? (await supabase.auth.getUser()).data.user?.id : null
      });

      if (error) throw error;

      toast({
        title: "Income Recorded",
        description: `${formatCurrency(parsedAmount)} income has been recorded successfully.`,
      });

      // Reset form
      setIncomeData({
        amount: '',
        income_date: format(new Date(), 'yyyy-MM-dd'),
        description: '',
        income_type: '',
        receipt_url: '',
        notes: ''
      });

    } catch (error) {
      console.error("Error submitting income:", error);
      toast({
        title: "Error",
        description: "There was a problem recording the income.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <DollarSign className="h-5 w-5 text-green-600" />
          Record New Income
        </CardTitle>
        <CardDescription>
          Enter details of a new donation or income
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="amount" className="flex items-center gap-1">
                <DollarSign className="h-4 w-4" /> Amount
              </Label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2">$</span>
                <Input
                  id="amount"
                  name="amount"
                  type="text"
                  inputMode="decimal"
                  pattern="\d*(\.\d{0,2})?"
                  step="0.01"
                  min="0"
                  placeholder="0.00"
                  value={incomeData.amount}
                  onChange={handleAmountChange}
                  onBlur={handleAmountBlur}
                  className="pl-8"
                  required
                  autoComplete="off"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="income_date" className="flex items-center gap-1">
                <Calendar className="h-4 w-4" /> Date
              </Label>
              <Input
                id="income_date"
                name="income_date"
                type="date"
                value={incomeData.income_date}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="income_type" className="flex items-center gap-1">
              <Info className="h-4 w-4" /> Income Type
            </Label>
            <select
              id="income_type"
              name="income_type"
              value={incomeData.income_type}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              required
            >
              <option value="">Select income type</option>
              {INCOME_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description" className="flex items-center gap-1">
              <FileText className="h-4 w-4" /> Description
            </Label>
            <textarea
              id="description"
              name="description"
              value={incomeData.description}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Brief description of the income"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Additional Notes (optional)</Label>
            <textarea
              id="notes"
              name="notes"
              value={incomeData.notes}
              onChange={handleChange}
              rows={2}
              className="w-full px-3 py-2 border border-gray-300 rounded-md"
              placeholder="Any additional information"
            />
          </div>
          <div className="pt-2">
            <Button 
              type="submit" 
              className="w-full" 
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Recording Income...' : 'Record Income'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
export default IncomeEntry;
