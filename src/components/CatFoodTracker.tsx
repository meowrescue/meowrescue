
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';

const CatFoodTracker = () => {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-semibold">Cat Food Management</h2>
      <p>
        We've moved cat food management to our comprehensive Supplies section.
        Please use the Supplies Management page in the admin section to manage
        all supplies including cat food.
      </p>
      <Link to="/admin/supplies">
        <Button className="mt-2 flex items-center gap-2">
          <Package size={16} />
          <span>Go to Supplies Management</span>
        </Button>
      </Link>
    </div>
  );
};

export default CatFoodTracker;
