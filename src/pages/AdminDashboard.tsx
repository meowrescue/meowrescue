
import React from 'react';
import AdminLayout from './Admin';
import StatCards from '@/components/admin/dashboard/StatCards';
import QuickActions from '@/components/admin/dashboard/QuickActions';
import ActivityFeed from '@/components/admin/dashboard/ActivityFeed';
import EventsOverview from '@/components/admin/dashboard/EventsOverview';
import FinanceOverview from '@/components/admin/dashboard/FinanceOverview';

const AdminDashboard = () => {
  return (
    <AdminLayout title="Dashboard">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-6 text-meow-primary">Admin Dashboard</h1>

        <StatCards />
        <QuickActions />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ActivityFeed />
          <EventsOverview />
        </div>

        <div className="mt-6">
          <FinanceOverview />
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
