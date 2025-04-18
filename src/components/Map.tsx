
import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = process.env.MAPBOX_PUBLIC_TOKEN || '';
    
    map.current = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/light-v11',
      center: [lng, lat],
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    // Add marker
    new mapboxgl.Marker()
      .setLngLat([lng, lat])
      .setPopup(new mapboxgl.Popup().setHTML(`<p class="p-2">${address}</p>`))
      .addTo(map.current);

    // Cleanup
    return () => {
      map.current?.remove();
    };
  }, [lat, lng, zoom, address]);

  return (
    <div ref={mapContainer} className="w-full h-[400px] rounded-lg shadow-lg overflow-hidden" />
  );
};

export default Map;
