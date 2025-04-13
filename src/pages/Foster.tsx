import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, Home, Calendar, ArrowRight } from 'lucide-react';

const Foster: React.FC = () => {
  return (
    <Layout>
      <SEO 
        title="Become a Foster | Meow Rescue" 
        description="Open your home and heart to a cat in need. Learn about our foster program and how you can help save lives." 
      />
      
      <div className="container mx-auto py-20 px-4">
        <div className="text-center mb-16 max-w-3xl mx-auto">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Become a Foster</h1>
          <p className="text-lg text-gray-600">
            Fostering is one of the most rewarding ways to help cats in need. By opening your home 
            to a cat temporarily, you're providing them with a safe, loving environment while they 
            wait for their forever home.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-none">
            <CardHeader className="pb-4">
              <div className="bg-meow-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Home className="text-meow-primary" />
              </div>
              <CardTitle className="text-xl">Provide a Temporary Home</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Give cats a break from the shelter environment and help them 
                adjust to life in a home. Foster periods typically range from 
                2-8 weeks depending on the cat's needs.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-none">
            <CardHeader className="pb-4">
              <div className="bg-meow-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Heart className="text-meow-primary" />
              </div>
              <CardTitle className="text-xl">Save More Lives</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Each cat in foster care opens up space in our shelter for another cat 
                in need. Foster homes allow us to help more cats than our physical 
                facility could accommodate alone.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow border-none">
            <CardHeader className="pb-4">
              <div className="bg-meow-primary/10 p-3 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                <Heart className="text-meow-primary" />
              </div>
              <CardTitle className="text-xl">Help Special Cases</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Kittens, senior cats, those recovering from illness or surgery, and 
                shy cats who need socialization all benefit tremendously from the 
                personalized care of a foster home.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="bg-gray-50 p-8 rounded-lg mb-16">
          <h2 className="text-2xl font-bold text-meow-primary mb-6">Foster Program FAQ</h2>
          
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-2">What does fostering involve?</h3>
              <p className="text-gray-600">
                As a foster, you provide temporary care for cats or kittens in your home. This includes 
                food, shelter, and lots of love. We provide all necessary supplies and cover medical expenses.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">How long do cats stay in foster care?</h3>
              <p className="text-gray-600">
                Foster periods vary depending on the cat's needs - anywhere from 2 weeks to 3 months. 
                We work with your schedule and preferences to find the right match.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">What if I already have pets?</h3>
              <p className="text-gray-600">
                Many foster parents have resident pets. We'll help you choose foster cats that are likely 
                to get along with your pets and guide you through safe introductions.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">What if I get attached?</h3>
              <p className="text-gray-600">
                "Foster fails" (when foster parents adopt their foster cats) happen! But remember that 
                each time you foster and let go, you're making room to help another cat in need.
              </p>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">What support will I receive?</h3>
              <p className="text-gray-600">
                We provide all necessary supplies (food, litter, toys, beds), cover all medical expenses, 
                and offer 24/7 support from our experienced foster coordinator.
              </p>
            </div>
          </div>
        </div>
        
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-meow-primary mb-6 text-center">Our Current Foster Needs</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-white shadow-md border-t-4 border-t-amber-400 border-r-0 border-l-0 border-b-0">
              <CardHeader>
                <CardTitle className="text-xl">Bottle Baby Kittens</CardTitle>
                <CardDescription>Urgent need</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Orphaned kittens under 4 weeks need feeding every 2-4 hours. 
                  This is a high commitment but incredibly rewarding role.
                </p>
                <div className="flex justify-center">
                  <Button asChild variant="outline">
                    <Link to="/volunteer/apply" className="inline-flex items-center">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md border-t-4 border-t-green-400 border-r-0 border-l-0 border-b-0">
              <CardHeader>
                <CardTitle className="text-xl">Shy/Fearful Cats</CardTitle>
                <CardDescription>High need</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cats needing socialization thrive in quiet home environments 
                  where they can build trust and confidence at their own pace.
                </p>
                <div className="flex justify-center">
                  <Button asChild variant="outline">
                    <Link to="/volunteer/apply" className="inline-flex items-center">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-white shadow-md border-t-4 border-t-blue-400 border-r-0 border-l-0 border-b-0">
              <CardHeader>
                <CardTitle className="text-xl">Medical Recovery</CardTitle>
                <CardDescription>Ongoing need</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 mb-4">
                  Cats recovering from illness or surgery need quiet, clean 
                  environments to heal. Medical experience is a plus but not required.
                </p>
                <div className="flex justify-center">
                  <Button asChild variant="outline">
                    <Link to="/volunteer/apply" className="inline-flex items-center">
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="bg-meow-primary rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Join our network of dedicated foster families and help us save more cat lives. 
            Complete our foster application today to get started on your fostering journey.
          </p>
          <div className="flex justify-center space-x-4 items-center">
            <Button asChild variant="secondary" size="lg">
              <Link to="/volunteer/apply">Apply to Foster</Link>
            </Button>
            <Button asChild variant="outline" className="bg-transparent border-white text-white hover:bg-white hover:text-meow-primary">
              <Link to="/contact">Contact Foster Coordinator</Link>
            </Button>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <p className="text-gray-600">
            Have questions? Contact our foster coordinator at <a href="mailto:foster@meowrescue.org" className="text-meow-primary hover:underline">foster@meowrescue.org</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Foster;
