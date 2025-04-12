
import React from 'react';
import SectionHeading from './ui/SectionHeading';

interface Testimonial {
  id: number;
  name: string;
  image: string;
  catName: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: 'Sarah Johnson',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80',
    catName: 'Whiskers',
    quote: 'Adopting Whiskers from Meow Rescue was the best decision we ever made. The adoption process was smooth, and the care they gave him before he came to us was exceptional. He was already well-socialized and in perfect health!'
  },
  {
    id: 2,
    name: 'Michael Rodriguez',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    catName: 'Luna',
    quote: 'We were looking for a companion for our older cat, and Patrick at Meow Rescue helped us find the perfect match. Luna integrated perfectly into our home, and the follow-up support we received was amazing.'
  },
  {
    id: 3,
    name: 'Emily Chen',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=687&q=80',
    catName: 'Oliver',
    quote: 'When we met Oliver at a Meow Rescue adoption event, it was love at first sight. He had been through so much, but the care he received made him the confident, loving cat he is today. We\'re so grateful to Patrick for his dedication.'
  }
];

const TestimonialsSection: React.FC = () => {
  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <SectionHeading 
          title="Success Stories" 
          subtitle="Hear from our happy adopters"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {testimonials.map(testimonial => (
            <div 
              key={testimonial.id} 
              className="bg-white rounded-lg shadow-md p-6 hover-grow"
            >
              <div className="flex flex-col items-center mb-4">
                <img 
                  src={testimonial.image} 
                  alt={testimonial.name} 
                  className="w-20 h-20 rounded-full object-cover border-4 border-meow-primary"
                />
                <h3 className="mt-4 text-lg font-bold">{testimonial.name}</h3>
                <p className="text-sm text-gray-600">Adopted {testimonial.catName}</p>
              </div>
              
              <blockquote>
                <p className="text-gray-700 italic">"{testimonial.quote}"</p>
              </blockquote>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;
