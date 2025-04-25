
import React from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { HandHeart, Handshake, Package } from 'lucide-react';

interface SupportCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
}

const SupportCard: React.FC<SupportCardProps> = ({
  icon,
  title,
  description,
  buttonText,
  buttonLink,
}) => (
  <Card className="h-full flex flex-col">
    <CardHeader>
      <div className="mb-2">{icon}</div>
      <CardTitle>{title}</CardTitle>
      <CardDescription className="min-h-[80px]">{description}</CardDescription>
    </CardHeader>
    <CardContent className="flex-grow"></CardContent>
    <CardFooter className="pt-0">
      <Button asChild variant="meow" className="w-full">
        <a href={buttonLink}>{buttonText}</a>
      </Button>
    </CardFooter>
  </Card>
);

const OtherWaysToSupport = () => {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6 text-center text-meow-primary">Other Ways to Support</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SupportCard
          icon={<HandHeart className="h-10 w-10 text-meow-primary" />}
          title="Foster a Cat"
          description="Open your home to a cat in need. Fostering saves lives and helps cats prepare for their forever homes."
          buttonText="Become a Foster"
          buttonLink="/foster"
        />
        
        <SupportCard
          icon={<Handshake className="h-10 w-10 text-meow-primary" />}
          title="Volunteer"
          description="Share your time and skills. We have volunteer opportunities for everyone, from cat care to administration."
          buttonText="Volunteer With Us"
          buttonLink="/volunteer"
        />
        
        <SupportCard
          icon={<Package className="h-10 w-10 text-meow-primary" />}
          title="Donate Supplies"
          description="We always need cat food, litter, toys, and other supplies. Check our wishlist for our current needs."
          buttonText="View Wishlist"
          buttonLink="/wishlist"
        />
      </div>
    </>
  );
};

export default OtherWaysToSupport;
