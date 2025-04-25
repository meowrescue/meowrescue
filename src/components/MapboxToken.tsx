
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

const MapboxToken: React.FC = () => {
  const [token, setToken] = useState('');
  const [showForm, setShowForm] = useState(false);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check if token already exists in localStorage
    const existingToken = localStorage.getItem('mapbox_token');
    if (existingToken) {
      // Set the token to the environment variable
      (window as any).VITE_MAPBOX_TOKEN = existingToken;
      // We're showing it's been set already
      toast({
        title: "Mapbox token loaded",
        description: "Your previously saved Mapbox token has been loaded.",
      });
    } else {
      // Show the form if no token exists
      setShowForm(true);
    }
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!token.trim()) {
      toast({
        title: "Please enter a token",
        description: "The Mapbox token field cannot be empty.",
        variant: "destructive",
      });
      return;
    }
    
    // Save token to localStorage
    localStorage.setItem('mapbox_token', token);
    
    // Set token to be available for the current session
    (window as any).VITE_MAPBOX_TOKEN = token;
    
    // Hide the form
    setShowForm(false);
    
    toast({
      title: "Mapbox token saved",
      description: "Your map should now display correctly.",
    });
    
    // Reload the page to apply the token
    window.location.reload();
  };

  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <form onSubmit={handleSubmit}>
          <CardHeader>
            <CardTitle>Mapbox API Key Required</CardTitle>
            <CardDescription>
              To display the map, please enter your Mapbox access token.
              You can get this from your <a href="https://account.mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-primary underline">Mapbox account dashboard</a>.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <Input
                type="text"
                placeholder="pk.eyJ1Ijoic2FtcGxldXNlciIsImEiOiJjbCI6..."
                value={token}
                onChange={(e) => setToken(e.target.value)}
                className="w-full"
              />
              <div className="text-sm text-muted-foreground">
                This will be stored locally in your browser. No data is sent to our servers.
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2">
            <Button type="submit">Save Token</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
};

export default MapboxToken;
