import React from 'react';
import { Container } from './ui/Container.js';
import { SectionHeading } from './ui/SectionHeading.js';

interface Testimonial {
  id: number;
  name: string;
  title: string;
  quote: string;
  image: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Samantha Jones',
    title: 'Happy Cat Owner',
    quote: 'Meow Rescue helped us find the purrfect addition to our family. We are forever grateful!',
    image: 'https://placekitten.com/150/150',
  },
  {
    id: 2,
    name: 'Michael Smith',
    title: 'Delighted Adopter',
    quote: 'The care and dedication of Meow Rescue is truly commendable. They go above and beyond for every cat.',
    image: 'https://placekitten.com/151/151',
  },
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <Container>
        <SectionHeading
          title="What People Are Saying"
          subtitle="Kind words from our adopters"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {testimonials.map((testimonial) => (
            <div key={testimonial.id} className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start mb-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-16 h-16 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-xl font-semibold text-meow-primary">{testimonial.name}</h3>
                  <p className="text-gray-600">{testimonial.title}</p>
                </div>
              </div>
              <blockquote className="text-gray-700 italic">
                "{testimonial.quote}"
              </blockquote>
            </div>
          ))}
        </div>
      </Container>
    </section>
  );
};

export default TestimonialsSection;
