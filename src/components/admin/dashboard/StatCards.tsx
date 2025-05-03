
import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@integrations/supabase';
import { Card, CardContent } from '@/components/ui/card';
import { Cat, Heart, FileText, MessageSquare } from 'lucide-react';

const StatCards = () => {
  const { data: catsCount } = useQuery({
    queryKey: ['cats-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('cats')
        .select('*', { count: 'exact', head: true });
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: adoptionsCount } = useQuery({
    queryKey: ['adoptions-count'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'approved');
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: pendingApplications } = useQuery({
    queryKey: ['pending-applications'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('applications')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'pending');
      
      if (error) throw error;
      return count || 0;
    }
  });

  const { data: unreadMessages } = useQuery({
    queryKey: ['unread-messages'],
    queryFn: async () => {
      const { count, error } = await supabase
        .from('contact_messages')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'New');
      
      if (error) throw error;
      return count || 0;
    }
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      <Card className="border-l-4 border-l-meow-primary">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">Available Cats</p>
            <h3 className="text-3xl font-bold">{catsCount || 0}</h3>
          </div>
          <div className="p-3 rounded-full bg-meow-primary/10">
            <Cat className="h-6 w-6 text-meow-primary" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-green-500">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">Adoptions</p>
            <h3 className="text-3xl font-bold">{adoptionsCount || 0}</h3>
          </div>
          <div className="p-3 rounded-full bg-green-500/10">
            <Heart className="h-6 w-6 text-green-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-blue-500">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">Applications</p>
            <h3 className="text-3xl font-bold">{pendingApplications || 0}</h3>
          </div>
          <div className="p-3 rounded-full bg-blue-500/10">
            <FileText className="h-6 w-6 text-blue-500" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="border-l-4 border-l-amber-500">
        <CardContent className="p-4 flex justify-between items-center">
          <div>
            <p className="text-sm font-medium text-gray-500">Messages</p>
            <h3 className="text-3xl font-bold">{unreadMessages || 0}</h3>
          </div>
          <div className="p-3 rounded-full bg-amber-500/10">
            <MessageSquare className="h-6 w-6 text-amber-500" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StatCards;
