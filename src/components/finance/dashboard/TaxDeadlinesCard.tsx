
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Calendar } from 'lucide-react';

const TaxDeadlinesCard = () => (
  <Card>
    <CardHeader className="pb-2">
      <CardTitle className="flex items-center">
        <Calendar className="h-4 w-4 text-blue-500 mr-2" /> 
        Upcoming Tax Deadlines
      </CardTitle>
    </CardHeader>
    <CardContent>
      <div className="text-sm text-muted-foreground">
        Form 990-EZ due in <span className="font-semibold">32 days</span>
      </div>
    </CardContent>
  </Card>
);

export default TaxDeadlinesCard;
