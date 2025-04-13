
import React from 'react';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { Button } from '@/components/ui/button';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  HandHeart, 
  CalendarClock, 
  HeartHandshake, 
  ChevronRight 
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { scrollToTop } from '@/utils/scrollUtils';

const Volunteer = () => {
  return (
    <Layout>
      <SEO 
        title="Volunteer | Meow Rescue" 
        description="Volunteer opportunities at Meow Rescue. Make a difference in the lives of cats in need." 
      />
      
      <div className="bg-gradient-to-r from-meow-primary/10 to-meow-secondary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-meow-primary mb-6">Volunteer With Us</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Join our dedicated team of volunteers and make a real difference in the lives of cats in need.
          </p>
          <div className="mt-8">
            <Button asChild size="lg" className="bg-meow-primary text-white hover:bg-meow-primary/90">
              <Link to="/volunteer/apply" onClick={scrollToTop}>Apply to Volunteer</Link>
            </Button>
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto mb-16">
          <h2 className="text-3xl font-bold text-center text-meow-primary mb-8">Why Volunteer?</h2>
          <p className="text-lg text-gray-600 mb-6">
            Volunteering with Meow Rescue is a rewarding experience that allows you to make a direct impact on the welfare of cats in our community. Our volunteers are the backbone of our organization, helping us save and improve the lives of cats and kittens every day.
          </p>
          <p className="text-lg text-gray-600">
            Whether you can spare a few hours a week or a few hours a month, your contribution is valuable and appreciated. We have a variety of roles to match your interests, skills, and availability.
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow h-full hover-card-effect">
            <CardHeader className="pb-4">
              <div className="mb-4 text-meow-primary">
                <HandHeart className="h-10 w-10" />
              </div>
              <CardTitle>Flexible Scheduling</CardTitle>
              <CardDescription>
                Find opportunities that fit your schedule, whether it's weekdays, evenings, or weekends.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                We understand that everyone has different commitments and time constraints. That's why we offer flexible volunteer opportunities to accommodate various schedules.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow h-full hover-card-effect">
            <CardHeader className="pb-4">
              <div className="mb-4 text-meow-primary">
                <HeartHandshake className="h-10 w-10" />
              </div>
              <CardTitle>Make a Difference</CardTitle>
              <CardDescription>
                Know that your time directly improves the lives of cats in need.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Your efforts help socialize cats, maintain clean living environments, assist with adoptions, and ultimately help more cats find their forever homes.
              </p>
            </CardContent>
          </Card>
          
          <Card className="bg-white shadow-md hover:shadow-lg transition-shadow h-full hover-card-effect">
            <CardHeader className="pb-4">
              <div className="mb-4 text-meow-primary">
                <CalendarClock className="h-10 w-10" />
              </div>
              <CardTitle>Gain Experience</CardTitle>
              <CardDescription>
                Learn new skills and gain valuable experience while helping our cause.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600">
                Volunteering provides opportunities to develop skills in animal care, customer service, event planning, marketing, and more.
              </p>
            </CardContent>
          </Card>
        </div>
        
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center text-meow-primary mb-10">Volunteer Opportunities</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-meow-primary mb-4">At the Rescue Center</h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Greet visitors and assist with adoption counseling</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Help with daily feeding, cleaning, and care routines</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Provide socialization and enrichment for our cats</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Assist with administrative tasks and record keeping</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Help with facility maintenance and cleaning</span>
                </li>
              </ul>
            </div>
            
            <div className="bg-gray-50 rounded-lg p-6">
              <h3 className="text-xl font-bold text-meow-primary mb-4">Remote Opportunities</h3>
              <ul className="space-y-3 text-gray-600 mb-6">
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Assist with social media management and content creation</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Help with fundraising campaigns and grant writing</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Design graphics for marketing materials</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Write content for our website and newsletters</span>
                </li>
                <li className="flex items-start">
                  <span className="text-meow-primary mr-2">•</span>
                  <span>Coordinate community outreach and education programs</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        
        <div className="text-center mb-16">
          <h2 className="text-3xl font-bold text-meow-primary mb-6">Our Volunteer Process</h2>
          <div className="max-w-3xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
              <div className="text-center">
                <div className="rounded-full bg-meow-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-meow-primary">1</span>
                </div>
                <h3 className="font-semibold mb-2">Apply Online</h3>
                <p className="text-gray-600 text-sm">
                  Fill out our volunteer application form with your information and interests.
                </p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-meow-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-meow-primary">2</span>
                </div>
                <h3 className="font-semibold mb-2">Orientation</h3>
                <p className="text-gray-600 text-sm">
                  Attend a volunteer orientation to learn about our mission and procedures.
                </p>
              </div>
              
              <div className="text-center">
                <div className="rounded-full bg-meow-primary/10 h-16 w-16 flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl font-bold text-meow-primary">3</span>
                </div>
                <h3 className="font-semibold mb-2">Start Volunteering</h3>
                <p className="text-gray-600 text-sm">
                  Begin with training shifts and find your perfect role in our organization.
                </p>
              </div>
            </div>
            
            <Button asChild size="lg" className="bg-meow-primary text-white hover:bg-meow-primary/90">
              <Link to="/volunteer/apply" onClick={scrollToTop} className="flex items-center">
                Apply Now <ChevronRight className="ml-1 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        
        <div className="bg-meow-primary/5 rounded-lg p-8 text-center">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-2xl font-bold text-meow-primary mb-4">Have Questions?</h2>
            <p className="text-gray-600 mb-6">
              If you have any questions about volunteering with Meow Rescue, please don't hesitate to reach out to us.
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

export default Volunteer;
