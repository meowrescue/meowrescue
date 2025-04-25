
import React from 'react';
import { Button } from "@/components/ui/button";

interface CtaSectionProps {
  title: string;
  description: string;
  buttonText: string;
  buttonLink: string;
  bgColor?: string;
}

const CtaSection: React.FC<CtaSectionProps> = ({ 
  title, 
  description, 
  buttonText, 
  buttonLink,
  bgColor = 'bg-meow-primary' 
}) => {
  return (
    <section className={`py-16 ${bgColor} text-white`}>
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
        <p className="text-lg md:text-xl mb-8 max-w-3xl mx-auto">{description}</p>
        <Button 
          className="bg-white text-meow-primary hover:bg-gray-100 px-8 py-6 text-lg"
          asChild
        >
          <a href={buttonLink}>{buttonText}</a>
        </Button>
      </div>
    </section>
  );
};

export default CtaSection;
