
import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription 
} from '@/components/ui/card';
import { 
  HeartHandshake, 
  Home, 
  CalendarRange, 
  ShieldCheck, 
  PawPrint,
  ChevronRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const Foster = () => {
  return (
    <Layout>
      <SEO 
        title="Foster | Meow Rescue" 
        description="Learn about fostering cats with Meow Rescue and how you can make a difference by opening your home to a cat in need." 
      />
      
      <div className="bg-meow-primary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Become a Foster</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Open your heart and home to a cat in need. Fostering saves lives and provides cats with a safe, loving environment until they find their forever homes.
          </p>
          <div className="mt-8">
            <Button asChild variant="meow" size="lg">
              <Link to="/foster/apply">Apply to Foster</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-meow-primary mb-8">Why Foster?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Fostering is one of the most rewarding ways to help cats in need. By providing temporary care in your home, you're giving cats the time, space, and love they need to thrive until they find their permanent homes.
          </p>
          <p className="text-lg text-gray-600">
            When you foster, you're not just helping one cat – you're helping our entire rescue operation by creating space for us to save more lives. It's a direct and meaningful way to make a difference.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white shadow-md h-full">
            <CardHeader className="pb-4">
              <div className="mb-4 text-meow-primary">
                <Home className="h-10 w-10" />
              </div>
              <CardTitle>Flexible Commitment</CardTitle>
              <CardDescription>
                Foster for as little as two weeks or as long as several months.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We have foster opportunities that fit your lifestyle and schedule, whether you can commit to short-term or long-term care.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md h-full">
            <CardHeader className="pb-4">
              <div className="mb-4 text-meow-primary">
                <HeartHandshake className="h-10 w-10" />
              </div>
              <CardTitle>All Supplies Provided</CardTitle>
              <CardDescription>
                We provide food, litter, and medical care for your foster cat.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You provide the love and care, we provide all the necessary supplies, including food, litter, bedding, toys, and medical treatment.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md h-full">
            <CardHeader className="pb-4">
              <div className="mb-4 text-meow-primary">
                <ShieldCheck className="h-10 w-10" />
              </div>
              <CardTitle>Ongoing Support</CardTitle>
              <CardDescription>
                Our team is always available to answer questions and provide guidance.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You'll never be alone in your fostering journey. Our experienced team provides training, resources, and 24/7 support for all foster families.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-meow-primary mb-10">Foster Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-meow-primary/20 p-3 rounded-full mr-4">
                  <PawPrint className="h-6 w-6 text-meow-primary" />
                </div>
                <h3 className="text-xl font-bold text-meow-primary">Kittens</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Kittens need special care and socialization during their crucial developmental weeks. Fostering kittens is perfect for those who can provide frequent monitoring and enjoy watching these little ones grow and develop.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Bottle babies (0-4 weeks)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Weaned kittens (4-8 weeks)</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Mother cats with nursing kittens</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <div className="flex items-center mb-4">
                <div className="bg-meow-primary/20 p-3 rounded-full mr-4">
                  <CalendarRange className="h-6 w-6 text-meow-primary" />
                </div>
                <h3 className="text-xl font-bold text-meow-primary">Adult Cats</h3>
              </div>
              <p className="text-gray-600 mb-4">
                Adult cats often make ideal foster pets for busy households. They need less intensive care than kittens but still benefit greatly from the comfort and socialization of a foster home.
              </p>
              <ul className="space-y-2 text-gray-600 mb-6">
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Cats recovering from illness or surgery</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Shy or under-socialized cats</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Senior cats needing a calm environment</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-meow-primary mb-6">How to Become a Foster</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="text-center">
                <div className="rounded-full bg-meow-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-meow-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Apply</h3>
                <p className="text-gray-600 text-sm">
                  Complete our foster application form with information about your home environment.
                </p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-meow-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-meow-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Home Check</h3>
                <p className="text-gray-600 text-sm">
                  We'll conduct a brief virtual home check to ensure a safe environment for our cats.
                </p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-meow-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-meow-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Welcome Home</h3>
                <p className="text-gray-600 text-sm">
                  Once approved, we'll match you with a cat that fits your household and preferences.
                </p>
              </div>
            </div>
            
            <Button asChild variant="meow" size="lg">
              <Link to="/foster/apply" className="flex items-center">
                Apply Now <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-meow-primary/5 rounded-lg p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-meow-primary mb-4">Foster FAQ</h2>
            <div className="text-left mb-6 space-y-6">
              <div>
                <h3 className="font-semibold mb-1 text-lg">How long will I foster a cat?</h3>
                <p className="text-gray-600">
                  Foster periods typically range from 2-8 weeks, but can vary based on the cat's specific needs and your availability.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg">What if I already have pets?</h3>
                <p className="text-gray-600">
                  Many of our foster families have resident pets. We'll help match you with a foster cat that's compatible with your current pets.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-1 text-lg">What if I fall in love with my foster cat?</h3>
                <p className="text-gray-600">
                  Foster families often have first choice to adopt their foster cats, which we call "foster fails" (in the best possible way)!
                </p>
              </div>
            </div>
            <Button asChild variant="outline">
              <Link to="/contact">Contact Us With Questions</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Foster;
