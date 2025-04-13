
import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Home, HeartHandshake, CalendarClock, Sparkles, ChevronRight } from 'lucide-react';
import { scrollToTop } from '@/utils/scrollUtils';

const Foster = () => {
  return (
    <Layout>
      <SEO 
        title="Foster | Meow Rescue" 
        description="Foster a cat with Meow Rescue. Provide temporary care for cats until they find their forever homes." 
      />
      
      <div className="bg-gradient-to-r from-meow-primary/10 to-meow-secondary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Foster a Cat</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Fostering saves lives by providing cats with a temporary loving home until they find their forever family.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-meow-primary text-white hover:bg-meow-primary/90">
              <Link to="/foster/apply" onClick={scrollToTop}>Apply to Foster</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-meow-primary mb-8">Why Foster?</h2>
          <p className="text-lg text-gray-600 mb-6">
            By opening your home to a foster cat, you're providing a safe, temporary home where they can thrive until they find their forever family. Fostering is a rewarding experience that directly saves lives and helps more cats find loving homes.
          </p>
          <p className="text-lg text-gray-600">
            Our foster program provides all the necessary supplies, medical care, and ongoing support to ensure both you and your foster cat have a positive experience.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow h-full hover-card-effect">
            <CardHeader className="pb-4">
              <div className="mb-4 text-meow-primary">
                <Home className="h-10 w-10" />
              </div>
              <CardTitle>Safe Space</CardTitle>
              <CardDescription>
                Provide a calm, quiet environment away from the stress of shelter life.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your home offers a peaceful setting where cats can relax, decompress, and show their true personalities.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow h-full hover-card-effect">
            <CardHeader className="pb-4">
              <div className="mb-4 text-meow-primary">
                <HeartHandshake className="h-10 w-10" />
              </div>
              <CardTitle>Direct Impact</CardTitle>
              <CardDescription>
                Know that you're making a real difference in a cat's life.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                You'll see firsthand how your care transforms a shy or stressed cat into a confident, adoptable companion.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow h-full hover-card-effect">
            <CardHeader className="pb-4">
              <div className="mb-4 text-meow-primary">
                <CalendarClock className="h-10 w-10" />
              </div>
              <CardTitle>Flexible Commitment</CardTitle>
              <CardDescription>
                Choose fostering opportunities that fit your lifestyle and schedule.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                From short-term care for cats awaiting adoption to longer-term rehabilitation for special needs cats.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow h-full hover-card-effect">
            <CardHeader className="pb-4">
              <div className="mb-4 text-meow-primary">
                <Sparkles className="h-10 w-10" />
              </div>
              <CardTitle>Try Before Adopting</CardTitle>
              <CardDescription>
                Experience the joy of having a cat without the lifetime commitment.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Fostering is a great way to see if a cat fits into your life and home environment.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-meow-primary mb-10">What We Provide</h2>
          <div className="bg-gray-50 rounded-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-meow-primary font-bold mr-2">•</span>
                  <span><span className="font-semibold">Food and Litter</span> - All basic supplies for your foster cat</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary font-bold mr-2">•</span>
                  <span><span className="font-semibold">Medical Care</span> - Routine and emergency veterinary services</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary font-bold mr-2">•</span>
                  <span><span className="font-semibold">Medications</span> - Any needed treatments or prescriptions</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary font-bold mr-2">•</span>
                  <span><span className="font-semibold">Enrichment Items</span> - Toys, beds, and scratching posts</span>
                </li>
              </ul>
              
              <ul className="space-y-4 text-gray-600">
                <li className="flex items-start">
                  <span className="text-meow-primary font-bold mr-2">•</span>
                  <span><span className="font-semibold">Training</span> - Guidance on cat care and behavior</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary font-bold mr-2">•</span>
                  <span><span className="font-semibold">24/7 Support</span> - Always available for questions or concerns</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary font-bold mr-2">•</span>
                  <span><span className="font-semibold">Transportation</span> - Help getting to vet appointments</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary font-bold mr-2">•</span>
                  <span><span className="font-semibold">Foster Community</span> - Connect with other foster caregivers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-meow-primary mb-6">Our Foster Process</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
              <div className="text-center">
                <div className="rounded-full bg-meow-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-meow-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Apply</h3>
                <p className="text-gray-600">
                  Fill out our foster application form with information about your home and experience.
                </p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-meow-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-meow-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Home Check & Training</h3>
                <p className="text-gray-600">
                  We'll visit your home and provide foster orientation to ensure you're ready.
                </p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-meow-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-meow-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Welcome Your Foster</h3>
                <p className="text-gray-600">
                  We'll match you with a cat that fits your home and experience level.
                </p>
              </div>
            </div>
            
            <Button asChild className="bg-meow-primary text-white hover:bg-meow-primary/90" size="lg">
              <Link to="/foster/apply" onClick={scrollToTop} className="flex items-center">
                Apply Now <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-meow-primary/5 rounded-lg p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-meow-primary mb-4">Have Questions?</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about fostering with Meow Rescue, please don't hesitate to reach out to us.
            </p>
            <Button asChild variant="outline" className="border-meow-primary text-meow-primary hover:bg-meow-primary/10">
              <Link to="/contact" onClick={scrollToTop}>Contact Us</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Foster;
