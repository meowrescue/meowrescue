
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
      title: "Foster Parent",
      icon: <Heart className="h-12 w-12 text-meow-primary mb-4" />,
      description: "Provide a temporary home for cats or kittens who need special care, socialization, or just a break from the shelter environment."
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
    }
  ];

  return (
    <Layout>
      <SEO
        title="Volunteer & Foster | Meow Rescue"
        description="Volunteer or foster with Meow Rescue. Help us make a difference in the lives of cats in need in Pasco County, Florida."
      />
      
      <div className="container mx-auto px-4 py-12 pt-24" id="volunteer-content">
        <SectionHeading
          title="Volunteer & Foster"
          subtitle="Make a difference in the lives of cats in need"
          centered
        />
        
        <div className="max-w-4xl mx-auto mt-8">
          <div className="bg-meow-primary/10 p-6 rounded-lg mb-12">
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
          
          <div className="bg-gray-50 p-8 rounded-lg mb-12">
            <h2 className="text-2xl font-bold text-meow-primary mb-4">Fostering Saves Lives</h2>
            <p className="text-gray-700 mb-4">
              Fostering is one of the most rewarding ways to help cats in need. By opening your 
              home to a foster cat or kitten, you're providing them with the care, socialization, 
              and love they need until they find their forever home.
            </p>
            <p className="text-gray-700 mb-4">
              As a foster parent, you'll be supported by our team every step of the way. We provide 
              all necessary supplies, cover medical expenses, and offer guidance and support throughout 
              your fostering journey.
            </p>
            <p className="text-gray-700 mb-6">
              Fostering is especially critical during kitten season (spring through fall), when we 
              receive many pregnant cats and orphaned kittens who need specialized care.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="meow" size="lg">
                <Link to="/volunteer/apply">Apply to Foster</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="#fostering-faq">Fostering FAQ</a>
              </Button>
            </div>
          </div>
          
          <div id="fostering-faq" className="scroll-mt-24">
            <h2 className="text-2xl font-bold text-center mb-8">Fostering FAQ</h2>
            
            <div className="space-y-6">
              <div>
                <h3 className="text-xl font-bold text-meow-primary mb-2">What does fostering involve?</h3>
                <p className="text-gray-700">
                  Fostering involves providing temporary care for cats or kittens in your home until they're 
                  ready for adoption. This includes feeding, cleaning, socialization, and sometimes 
                  administering medications or other special care.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-meow-primary mb-2">Do I need experience to foster?</h3>
                <p className="text-gray-700">
                  No prior experience is necessary! We'll provide training and ongoing support. We do have 
                  foster opportunities that require more experience, but we'll match you with cats that 
                  fit your comfort level.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-meow-primary mb-2">What supplies do I need?</h3>
                <p className="text-gray-700">
                  We provide all necessary supplies including food, litter, bedding, toys, and medications. 
                  You just need to provide the space and love!
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-meow-primary mb-2">How long will I foster a cat?</h3>
                <p className="text-gray-700">
                  The fostering period varies depending on the cat's needs. It could be as short as two weeks 
                  for healthy adult cats, or several months for kittens or cats with medical issues. We'll 
                  always discuss the expected timeframe with you beforehand.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-meow-primary mb-2">Can I adopt my foster cat?</h3>
                <p className="text-gray-700">
                  Yes! Many of our foster parents end up falling in love with their foster cats and adopting 
                  them. We call this a "foster fail" – but it's actually a success!
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-bold text-meow-primary mb-2">What if I already have pets?</h3>
                <p className="text-gray-700">
                  Many of our foster parents have resident pets. We'll help you introduce your foster cat 
                  properly and can also match you with cats that are known to get along well with other animals.
                </p>
              </div>
            </div>
          </div>
          
          <div className="text-center mt-16">
            <h2 className="text-2xl font-bold text-meow-primary mb-4">Ready to Make a Difference?</h2>
            <p className="text-gray-700 mb-6">
              Fill out our volunteer/foster application form, and we'll be in touch to discuss how your 
              skills and interests can best help the cats in our care.
            </p>
            <Button asChild variant="meow" size="xl">
              <Link to="/volunteer/apply">Apply to Volunteer or Foster</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Volunteer;
