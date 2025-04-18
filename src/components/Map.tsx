
import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import MapboxToken from './MapboxToken';

interface MapProps {
  address?: string;
  lat?: number;
  lng?: number;
  zoom?: number;
}

const Map: React.FC<MapProps> = ({ 
  address = "1234 Meow Street, Kittyville, CA 90210",
  lat = 34.052235, 
  lng = -118.243683, 
  zoom = 15 
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    // Get token from environment variable or localStorage
    const token = import.meta.env.VITE_MAPBOX_TOKEN || (window as any).VITE_MAPBOX_TOKEN || localStorage.getItem('mapbox_token') || '';
    mapboxgl.accessToken = token;
    
    // Skip map initialization if no token is available
    if (!mapboxgl.accessToken) {
      console.error('Mapbox token is missing');
      setMapError('Map could not be loaded. Please provide a Mapbox token.');
      return;
    }

    try {
      // Create map instance
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [lng, lat],
        zoom: zoom
      });

      // Add navigation controls
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

      // Add marker with popup
      const marker = new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(map.current);
      
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div class="p-2">
            <strong class="text-gray-900">Meow Rescue</strong>
            <p class="text-gray-700 text-sm mt-1">${address}</p>
          </div>
        `);
        
      marker.setPopup(popup);
      
      // Open popup by default
      marker.togglePopup();
      
      // Handle errors that might occur after initialization
      map.current.on('error', (e) => {
        console.error('Mapbox error:', e.error);
        setMapError('There was an error loading the map. Please check your Mapbox token.');
      });
      
    } catch (error) {
      console.error('Error initializing map:', error);
      setMapError('Map could not be loaded. Please check your Mapbox token.');
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove();
      }
    };
  }, [lat, lng, zoom, address]);

  return (
    <>
      <MapboxToken />
      <div className="relative w-full h-[400px] rounded-lg shadow-lg overflow-hidden">
        <div ref={mapContainer} className="w-full h-full" />
        {mapError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100 bg-opacity-80">
            <div className="bg-white p-4 rounded-lg shadow-md max-w-md text-center">
              <p className="text-red-600 mb-2">{mapError}</p>
              <button
                onClick={() => {
                  localStorage.removeItem('mapbox_token');
                  window.location.reload();
                }}
                className="text-blue-600 underline text-sm"
              >
                Reset Mapbox token
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Map;
