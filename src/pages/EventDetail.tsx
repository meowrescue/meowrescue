
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, Clock, ArrowLeft } from 'lucide-react';
import SEO from '@/components/SEO';

const EventDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  // This would normally come from a database or API call
  const event = {
    id: parseInt(id || '1'),
    title: "Adoption Event at PetSmart",
    date: "April 20, 2025",
    time: "11:00 AM - 3:00 PM",
    location: "PetSmart, US-19, New Port Richey",
    description: "Meet some of our adorable adoptable cats and kittens! Our volunteers will be on hand to answer questions about specific cats or the adoption process.",
    imageUrl: "https://images.unsplash.com/photo-1570304816841-906a17d7b067?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80",
    longDescription: "Join us for a special adoption event at PetSmart in New Port Richey. Our team will be bringing several adoptable cats and kittens who are looking for their forever homes. This is a great opportunity to meet our cats in person and learn more about our adoption process. Our knowledgeable volunteers will be available to answer any questions you might have about specific cats or the adoption process in general. If you're thinking about adding a feline friend to your family, this is the perfect event to attend!"
  };

  return (
    <Layout>
      <SEO 
        title={`${event.title} | Meow Rescue Events`}
        description={event.description}
      />
      
      <div className="container mx-auto px-4 pt-24 pb-12">
        <Link to="/events" className="inline-flex items-center text-meow-primary hover:underline mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to all events
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <img 
              src={event.imageUrl} 
              alt={event.title} 
              className="w-full h-[300px] md:h-[400px] object-cover rounded-lg mb-6"
            />
            
            <h1 className="text-3xl font-bold text-meow-primary mb-4">{event.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <div className="flex items-center text-gray-600">
                <Calendar className="h-5 w-5 mr-2 text-meow-primary" />
                <span>{event.date}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <Clock className="h-5 w-5 mr-2 text-meow-primary" />
                <span>{event.time}</span>
              </div>
              <div className="flex items-center text-gray-600">
                <MapPin className="h-5 w-5 mr-2 text-meow-primary" />
                <span>{event.location}</span>
              </div>
            </div>
            
            <div className="prose max-w-none">
              <p className="text-lg mb-4">{event.description}</p>
              <p>{event.longDescription}</p>
            </div>
          </div>
          
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h3 className="text-xl font-bold mb-4">Event Information</h3>
              
              <div className="space-y-4 mb-6">
                <div>
                  <p className="font-medium">Date:</p>
                  <p>{event.date}</p>
                </div>
                <div>
                  <p className="font-medium">Time:</p>
                  <p>{event.time}</p>
                </div>
                <div>
                  <p className="font-medium">Location:</p>
                  <p>{event.location}</p>
                </div>
              </div>
              
              <div className="space-y-3">
                <Button variant="meow" className="w-full">
                  Add to Calendar
                </Button>
                <Button variant="outline" className="w-full">
                  Share Event
                </Button>
                <Button asChild variant="meowOutline" className="w-full">
                  <Link to="/contact">Contact Organizer</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default EventDetail;
