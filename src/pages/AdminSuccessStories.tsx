
import React from 'react';
import AdminLayout from '@/pages/Admin';
import SEO from '@/components/SEO';
import SuccessStoriesContainer from '@/components/admin/success-stories/SuccessStoriesContainer';

const AdminSuccessStories = () => {
  return (
    <AdminLayout title="Success Stories">
      <SEO title="Success Stories | Meow Rescue Admin" />
      <SuccessStoriesContainer />
    </AdminLayout>
  );
};

export default AdminSuccessStories;
