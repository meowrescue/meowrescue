
import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

const TaxTab: React.FC = () => (
  <Card>
    <CardHeader>
      <CardTitle>Tax Documents</CardTitle>
      <CardDescription>
        Manage and prepare tax documents for your nonprofit organization
      </CardDescription>
    </CardHeader>
    <CardContent>
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-semibold mb-2">Current Year Forms</h3>
          <p className="text-sm text-muted-foreground">
            Fiscal year {new Date().getFullYear()} forms and schedules
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="font-medium">Form 990-EZ</p>
                  <p className="text-xs text-muted-foreground">Due: May 15, {new Date().getFullYear()}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Prepare</Button>
            </div>
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-muted-foreground mr-3" />
                <div>
                  <p className="font-medium">Schedule A</p>
                  <p className="text-xs text-muted-foreground">Public Charity Status</p>
                </div>
              </div>
              <Button variant="outline" size="sm">Prepare</Button>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-2">Previous Years</h3>
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between p-3 bg-muted rounded-lg">
              <div className="flex items-center">
                <FileText className="h-5 w-5 text-green-500 mr-3" />
                <div>
                  <p className="font-medium">{new Date().getFullYear() - 1} Form 990-EZ</p>
                  <p className="text-xs text-muted-foreground">Filed: April 12, {new Date().getFullYear() - 1}</p>
                </div>
              </div>
              <Button variant="outline" size="sm">View</Button>
            </div>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

export default TaxTab;
