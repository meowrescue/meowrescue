
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Package } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const CatFoodTracker = () => {
  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center">
          <Package className="mr-2 h-5 w-5" />
          Cat Food Management
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="mb-4">
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
      </CardContent>
    </Card>
  );
};

export default CatFoodTracker;
