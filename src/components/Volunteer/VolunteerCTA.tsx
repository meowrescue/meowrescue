
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { Home } from 'lucide-react';
import { scrollToTop } from '@/utils/scrollUtils';

const VolunteerCTA = () => {
  return (
    <div className="mt-20 text-center">
      <div className="bg-meow-primary/10 rounded-lg px-8 py-12">
        <div className="max-w-3xl mx-auto">
          <Home className="h-16 w-16 text-meow-primary mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Ready to Join Our Team?</h2>
          <p className="text-lg text-gray-700 mb-8">
            Take the first step toward making a difference in the lives of cats in need. Fill out our volunteer application today, and we'll contact you about upcoming orientation sessions.
          </p>
          <Link to="/volunteer/apply" onClick={scrollToTop}>
            <Button className="bg-meow-primary hover:bg-meow-primary/90 text-white px-8 py-6 text-lg">
              Apply to Volunteer
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default VolunteerCTA;
