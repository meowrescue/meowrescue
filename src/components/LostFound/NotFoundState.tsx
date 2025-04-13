
import React from "react";
import { Link } from "react-router-dom";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFoundState: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 text-center">
      <h2 className="text-2xl font-bold mb-4">Post Not Found</h2>
      <p className="mb-6">The post you are looking for does not exist or has been removed.</p>
      <Button asChild variant="outline">
        <Link to="/lost-found">
          <ChevronLeft className="mr-1" size={16} /> Back to Lost & Found
        </Link>
      </Button>
    </div>
  );
};

export default NotFoundState;
