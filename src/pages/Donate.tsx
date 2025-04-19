import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import {
  Heart,
  PawPrint,
  Users,
  Package,
  Clock,
  HelpingHand,
  Handshake,
} from 'lucide-react';
import SEO from '@/components/SEO';

const Donate: React.FC = () => {
  return (
    <Layout>
      <SEO
        title="Donate | Meow Rescue"
        description="Support Meow Rescue’s lifesaving work for cats and kittens with a tax‑deductible donation."
        canonicalUrl="/donate"
      />

      <section className="container mx-auto max-w-3xl py-12 px-4 sm:px-6 lg:px-0">
        <h1 className="mb-6 text-3xl font-bold tracking-tight">Make a Donation</h1>

        <p className="mb-10 text-gray-600 dark:text-gray-400">
          Your contribution helps us rescue, rehabilitate, and re‑home cats and
          kittens throughout Florida. Every dollar makes a difference!
        </p>

        <Tabs defaultValue="one‑time" className="w-full">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="one‑time">One‑time</TabsTrigger>
            <TabsTrigger value="monthly">Monthly</TabsTrigger>
          </TabsList>

          {/* One‑time Donation */}
          <TabsContent value="one‑time">
            <RadioGroup defaultValue="25" className="grid gap-4">
              <DonationOption amount="10" icon={PawPrint} />
              <DonationOption amount="25" icon={Heart} />
              <DonationOption amount="50" icon={Users} />
              <DonationOption amount="100" icon={Package} />
            </RadioGroup>

            <Button className="mt-6 w-full">Donate Now</Button>
          </TabsContent>

          {/* Monthly Donation */}
          <TabsContent value="monthly">
            <RadioGroup defaultValue="15" className="grid gap-4">
              <DonationOption amount="15" icon={HelpingHand} />
              <DonationOption amount="30" icon={Clock} />
              <DonationOption amount="60" icon={Handshake} />
            </RadioGroup>

            <Button className="mt-6 w-full">Start Monthly Gift</Button>
          </TabsContent>
        </Tabs>
      </section>
    </Layout>
  );
};

interface DonationOptionProps {
  amount: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}

const DonationOption: React.FC<DonationOptionProps> = ({ amount, icon: Icon }) => (
  <label className="flex items-center gap-3 rounded-md border p-4 hover:bg-gray-50 dark:hover:bg-gray-800">
    <RadioGroupItem value={amount} id={`donate-${amount}`} />
    <Icon className="h-5 w-5 text-primary" />
    <span className="text-sm font-medium">${amount}</span>
  </label>
);

export default Donate;
