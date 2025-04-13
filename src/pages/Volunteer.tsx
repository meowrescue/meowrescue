
import React from 'react';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useScrollToElement } from '@/hooks/use-scroll';
import SEO from '@/components/SEO';
import { PawPrint, Heart, Calendar, UserPlus, MessageSquare, ShieldCheck } from 'lucide-react';

const Volunteer: React.FC = () => {
  // Use the custom hook to handle scrolling
  useScrollToElement();
  
  const volunteerOptions = [
    {
      title: "Cat Socializer",
      icon: <PawPrint className="h-12 w-12 text-meow-primary mb-4" />,
      description: "Spend time with our cats, helping them become more comfortable with humans and ready for adoption."
    },
    {
      title: "Event Helper",
      icon: <Calendar className="h-12 w-12 text-meow-primary mb-4" />,
      description: "Assist at adoption events, fundraisers, and community outreach activities."
    },
    {
      title: "Volunteer Coordinator",
      icon: <UserPlus className="h-12 w-12 text-meow-primary mb-4" />,
      description: "Help recruit, train, and schedule other volunteers."
    },
    {
      title: "Social Media Assistant",
      icon: <MessageSquare className="h-12 w-12 text-meow-primary mb-4" />,
      description: "Create content and manage our social media accounts to help promote our cats and events."
    },
    {
      title: "Transport Volunteer",
      icon: <ShieldCheck className="h-12 w-12 text-meow-primary mb-4" />,
      description: "Help transport cats to and from vet appointments, adoption events, or new foster homes."
    },
    {
      title: "Administrative Support",
      icon: <Heart className="h-12 w-12 text-meow-primary mb-4" />,
      description: "Help with paperwork, data entry, phone calls, and other office tasks."
    }
  ];

  return (
    <Layout>
      <SEO
        title="Volunteer | Meow Rescue"
        description="Volunteer with Meow Rescue. Help us make a difference in the lives of cats in need in Pasco County, Florida."
      />
      
      <div className="bg-meow-primary/10 py-16 md:py-24 text-center">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Volunteer Opportunities"
            subtitle="Make a difference in the lives of cats in need"
            className="text-center"
          />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-16" id="volunteer-content">
        <div className="max-w-4xl mx-auto mb-12">
          <h2 className="text-2xl font-bold text-meow-primary mb-4">Why Volunteer with Us?</h2>
          <p className="text-gray-700 mb-4">
            As a small, home-based rescue, we rely entirely on volunteers to help us care for the cats 
            in our program and find them loving homes. Whether you can commit to a few hours a week 
            or want to be more deeply involved, we have volunteer opportunities that will fit your 
            schedule and interests.
          </p>
          <p className="text-gray-700">
            Volunteering with Meow Rescue is not just about helping cats—it's also a chance to 
            make friends, learn new skills, and be part of a community that shares your love for animals.
          </p>
        </div>
        
        <h2 className="text-2xl font-bold text-center mb-8">Volunteer Opportunities</h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {volunteerOptions.map((option, index) => (
            <Card key={index} className="text-center">
              <CardContent className="pt-6">
                <div className="flex justify-center">
                  {option.icon}
                </div>
                <h3 className="text-xl font-bold mb-2">{option.title}</h3>
                <p className="text-gray-600">{option.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
        
        <div className="bg-meow-primary rounded-lg p-8 text-white text-center">
          <h2 className="text-2xl font-bold mb-4">Ready to Make a Difference?</h2>
          <p className="max-w-2xl mx-auto mb-6">
            Fill out our volunteer application form, and we'll be in touch to discuss how your 
            skills and interests can best help the cats in our care.
          </p>
          <Button asChild variant="secondary" size="lg">
            <Link to="/volunteer/apply">Apply to Volunteer</Link>
          </Button>
        </div>
        
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Have questions? Contact our volunteer coordinator at <a href="mailto:volunteer@meowrescue.org" className="text-meow-primary hover:underline">volunteer@meowrescue.org</a>
          </p>
        </div>
      </div>
    </Layout>
  );
};

export default Volunteer;
