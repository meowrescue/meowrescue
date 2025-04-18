
import React, { useEffect, useRef } from 'react';

interface ContactMapProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
}

const ContactMap: React.FC<ContactMapProps> = ({ 
  address = "1234 Meow Street, Kittyville, CA 90210",
  lat = 34.052235, 
  lng = -118.243683, 
  zoom = 15 
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<google.maps.Map | null>(null);

  useEffect(() => {
    // Check if Google Maps script is already loaded
    if (window.google && window.google.maps) {
      initMap();
    } else {
      // Log for debugging
      console.log('Google Maps API not loaded, initializing script');
      
      // Load Google Maps script dynamically
      const script = document.createElement('script');
      script.src = `https://maps.googleapis.com/maps/api/js?key=AIzaSyBLkQbdtq_eR3-jLjOYMYICN0NLaWO74jo&callback=initMap`;
      script.async = true;
      script.defer = true;
      script.onerror = () => {
        console.error('Google Maps script failed to load');
      };
      
      // Define the callback globally
      window.initMap = initMap;
      
      document.head.appendChild(script);

      // Cleanup
      return () => {
        window.initMap = undefined;
        if (script.parentNode) {
          document.head.removeChild(script);
        }
      };
    }
  }, [lat, lng, zoom]);

  const initMap = () => {
    if (!mapRef.current) return;
    
    console.log('Initializing Google Map');

    const position = { lat, lng };
    
    const mapOptions: google.maps.MapOptions = {
      center: position,
      zoom,
      mapTypeControl: false,
      fullscreenControl: false,
      streetViewControl: false,
      zoomControl: true,
      styles: [
        {
          featureType: "administrative",
          elementType: "all",
          stylers: [{ saturation: -100 }]
        },
        {
          featureType: "landscape",
          elementType: "all",
          stylers: [{ saturation: -100 }]
        },
        {
          featureType: "poi",
          elementType: "all",
          stylers: [{ saturation: -100 }]
        },
        {
          featureType: "road",
          elementType: "all",
          stylers: [{ saturation: -100 }]
        },
        {
          featureType: "transit",
          elementType: "all",
          stylers: [{ saturation: -100 }]
        },
        {
          featureType: "water",
          elementType: "all",
          stylers: [{ saturation: -100 }]
        }
      ]
    };

    try {
      // Create the map
      const map = new window.google.maps.Map(mapRef.current, mapOptions);
      mapInstanceRef.current = map;

      // Add a marker
      const marker = new window.google.maps.Marker({
        position,
        map,
        animation: window.google.maps.Animation.DROP,
        title: 'Meow Rescue'
      });

      // Add info window with address
      const infoWindow = new window.google.maps.InfoWindow({
        content: `
          <div style="padding: 8px; max-width: 200px;">
            <h3 style="margin: 0 0 8px; font-weight: bold; color: #f25c54;">Meow Rescue</h3>
            <p style="margin: 0; font-size: 14px;">${address}</p>
          </div>
        `
      });

      // Open info window when marker is clicked
      marker.addListener('click', () => {
        infoWindow.open(map, marker);
      });

      // Open by default
      infoWindow.open(map, marker);
      
      console.log('Google Map initialized successfully');
    } catch (err) {
      console.error('Error initializing Google Map:', err);
    }
  };

  return (
    <div ref={mapRef} className="w-full h-[400px] rounded-lg shadow-md overflow-hidden"></div>
  );
};

export default ContactMap;
