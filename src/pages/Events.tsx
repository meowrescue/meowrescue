
import React from 'react';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import { Calendar, MapPin, Clock } from 'lucide-react';

const Events: React.FC = () => {
  // Sample events data - in a real app, this would come from a database
  const events = [
    {
      id: 1,
      title: "Adoption Event at PetSmart",
      date: "April 20, 2025",
      time: "11:00 AM - 3:00 PM",
      location: "PetSmart, US-19, New Port Richey",
      description: "Meet some of our adorable adoptable cats and kittens! Our volunteers will be on hand to answer questions about specific cats or the adoption process.",
      imageUrl: "https://images.unsplash.com/photo-1570304816841-906a17d7b067?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 2,
      title: "Kitten Season Fundraiser",
      date: "May 15, 2025",
      time: "6:00 PM - 9:00 PM",
      location: "Sip Wine Bar, Downtown New Port Richey",
      description: "Join us for a special evening fundraiser to help prepare for kitten season! Enjoy wine tastings, appetizers, a silent auction, and learn about fostering opportunities.",
      imageUrl: "https://images.unsplash.com/photo-1570824104453-508955ab713e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
    },
    {
      id: 3,
      title: "Volunteer Orientation",
      date: "May 5, 2025",
      time: "10:00 AM - 11:30 AM",
      location: "Virtual via Zoom",
      description: "Interested in volunteering with Meow Rescue? Join our virtual orientation to learn about volunteer opportunities, requirements, and how you can help make a difference in the lives of cats in need.",
      imageUrl: "https://images.unsplash.com/photo-1545529468-42764ef8c85f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1173&q=80"
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Upcoming Events" 
          subtitle="Join us at our upcoming events and help support our mission"
          centered
        />
        
        <div className="max-w-4xl mx-auto">
          {events.map((event) => (
            <div key={event.id} className="bg-white shadow-md rounded-lg overflow-hidden mb-8">
              <div className="md:flex">
                <div className="md:w-1/3">
                  <img 
                    src={event.imageUrl} 
                    alt={event.title} 
                    className="h-full w-full object-cover"
                  />
                </div>
                <div className="p-6 md:w-2/3">
                  <h3 className="text-xl font-bold text-meow-primary mb-2">{event.title}</h3>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <Calendar size={16} className="mr-2 text-meow-secondary" />
                    <span>{event.date}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-2">
                    <Clock size={16} className="mr-2 text-meow-secondary" />
                    <span>{event.time}</span>
                  </div>
                  
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin size={16} className="mr-2 text-meow-secondary" />
                    <span>{event.location}</span>
                  </div>
                  
                  <p className="text-gray-700 mb-4">{event.description}</p>
                  
                  <a 
                    href={`/events/${event.id}`} 
                    className="inline-block bg-meow-secondary hover:bg-meow-secondary/90 text-white px-4 py-2 rounded transition-colors"
                  >
                    Event Details
                  </a>
                </div>
              </div>
            </div>
          ))}
          
          {events.length === 0 && (
            <div className="text-center py-12">
              <p className="text-xl text-gray-700">
                No upcoming events at the moment. Check back soon!
              </p>
            </div>
          )}
        </div>
        
        <div className="mt-16 max-w-3xl mx-auto text-center">
          <h2 className="text-2xl font-bold text-meow-primary mb-4">Host an Event for Meow Rescue</h2>
          <p className="text-gray-700 mb-6">
            Interested in hosting a fundraiser, adoption event, or awareness event for Meow Rescue? We appreciate community support and would love to work with you!
          </p>
          <a 
            href="/contact" 
            className="inline-block bg-meow-primary hover:bg-meow-primary/90 text-white px-6 py-3 rounded transition-colors"
          >
            Contact Us to Discuss
          </a>
        </div>
      </div>
    </Layout>
  );
};

export default Events;
