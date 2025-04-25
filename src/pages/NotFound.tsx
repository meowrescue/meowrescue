
import React, { useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from "@/components/ui/button";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <Layout>
      <div className="min-h-[70vh] flex flex-col items-center justify-center py-12 px-4">
        <div className="max-w-md w-full text-center">
          <div className="mb-6">
            <svg className="mx-auto h-24 w-24 text-meow-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-meow-primary mb-4">404</h1>
          <p className="text-xl text-gray-600 mb-8">
            Oops! We can't seem to find the page you're looking for.
          </p>
          <p className="text-gray-600 mb-8">
            The page might have been moved, deleted, or maybe never existed. Let's get you back on track.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              className="bg-meow-primary hover:bg-meow-primary/90"
              asChild
            >
              <Link to="/">Return Home</Link>
            </Button>
            <Button 
              variant="outline" 
              className="border-meow-primary text-meow-primary hover:bg-meow-primary/10"
              asChild
            >
              <Link to="/cats">See Our Cats</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default NotFound;
