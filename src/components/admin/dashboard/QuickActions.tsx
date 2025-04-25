
import React from 'react';
import { Link } from 'react-router-dom';
import { Cat, Calendar as CalendarIcon, FileText, Map } from 'lucide-react';

const QuickActions = () => {
  return (
    <div className="mb-6">
      <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Link to="/admin/cats/new" className="flex flex-col items-center justify-center p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
          <div className="p-3 rounded-full bg-meow-primary/10 mb-2">
            <Cat className="h-6 w-6 text-meow-primary" />
          </div>
          <span className="font-medium">Add New Cat</span>
        </Link>
        <Link to="/admin/events" className="flex flex-col items-center justify-center p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
          <div className="p-3 rounded-full bg-blue-500/10 mb-2">
            <CalendarIcon className="h-6 w-6 text-blue-500" />
          </div>
          <span className="font-medium">Schedule Event</span>
        </Link>
        <Link to="/admin/blog/new" className="flex flex-col items-center justify-center p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
          <div className="p-3 rounded-full bg-green-500/10 mb-2">
            <FileText className="h-6 w-6 text-green-500" />
          </div>
          <span className="font-medium">Create Blog Post</span>
        </Link>
        <Link to="/admin/lost-found" className="flex flex-col items-center justify-center p-4 rounded-lg border bg-white hover:bg-gray-50 transition-colors">
          <div className="p-3 rounded-full bg-amber-500/10 mb-2">
            <Map className="h-6 w-6 text-amber-500" />
          </div>
          <span className="font-medium">Lost & Found</span>
        </Link>
      </div>
    </div>
  );
};

export default QuickActions;
