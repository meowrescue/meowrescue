
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { PawPrint, Calendar, Home, Heart } from 'lucide-react';

const CatAdoptionProcess: React.FC = () => {
  const steps = [
    {
      icon: <PawPrint className="h-6 w-6" />,
      title: 'Application',
      description: 'Fill out our adoption application form to start the process.'
    },
    {
      icon: <Calendar className="h-6 w-6" />,
      title: 'Meet & Greet',
      description: 'Schedule a time to meet your potential new family member.'
    },
    {
      icon: <Home className="h-6 w-6" />,
      title: 'Home Check',
      description: 'We\'ll ensure your home is ready for your new cat.'
    }
  ];

  return (
    <div className="py-12 bg-gray-50 backdrop-blur-sm rounded-lg shadow-sm mt-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-meow-primary mb-2">Adoption Process</h2>
        <p className="text-gray-600">Here's what you need to know about adopting from us</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 px-6">
        {steps.map((step, index) => (
          <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-all duration-300">
            <CardContent className="pt-6 text-center">
              <div className="mb-4 inline-flex p-3 rounded-full bg-meow-primary/10 text-meow-primary">
                {step.icon}
              </div>
              <h3 className="text-lg font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button asChild size="lg" variant="meow">
          <Link to="/adopt" className="inline-flex items-center">
            <Heart className="mr-2 h-5 w-5" />
            Start Adoption Process
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default CatAdoptionProcess;
