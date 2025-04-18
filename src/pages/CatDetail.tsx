import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import SectionHeading from '@/components/ui/SectionHeading';

interface Cat {
  id: string;
  name: string;
  age_estimate: string;
  gender: string;
  breed: string;
  description: string;
  photos_urls: string[];
  status: 'Available' | 'Pending' | 'Adopted';
  weight: string | null;
  color: string | null;
  pattern: string | null;
  eye_color: string | null;
  coat_type: string | null;
  special_care_notes: string | null;
  foster_start_date: string | null;
  foster_end_date: string | null;
  vaccination_date: string | null;
  deworming_date: string | null;
  flea_treatment_date: string | null;
  spay_neuter_date: string | null;
  microchip_number: string | null;
  created_at: string; // Added this field to the interface
}

const CatDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: cat, isLoading, isError, error } = useQuery({
    queryKey: ['cat', id],
    queryFn: async () => {
      if (!id) throw new Error("Cat ID is required");
      const { data, error } = await supabase
        .from('cats')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Cat;
    },
    enabled: !!id,
    retry: 2,
    retryDelay: 1000
  });

  if (isLoading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
        </div>
      </Layout>
    );
  }

  if (isError || !cat) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-screen">
          <p className="text-red-500">Error: {error?.message || 'Cat not found'}</p>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEO
        title={`${cat.name} | Meow Rescue`}
        description={`Learn more about ${cat.name} and our adoption process.`}
      />

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="relative h-96">
              <img
                src={cat.photos_urls?.[0] || '/placeholder.svg'}
                alt={cat.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <Badge className={`${cat.status === 'Available' ? 'bg-green-100 text-green-800' : cat.status === 'Pending' ? 'bg-yellow-100 text-yellow-800' : 'bg-blue-100 text-blue-800'}`}>
                  {cat.status}
                </Badge>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex justify-between items-start mb-4">
                <h1 className="text-3xl font-bold text-gray-900">{cat.name}</h1>
                <div className="text-sm text-gray-500">
                  <Calendar className="inline-block mr-2 h-4 w-4" />
                  {cat.created_at ? format(new Date(cat.created_at), 'MMMM d, yyyy') : 'Date unknown'}
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">About {cat.name}</h2>
                    <p className="text-gray-600">{cat.description}</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <h3 className="font-semibold mb-1">Age</h3>
                      <p className="text-gray-600">{cat.age_estimate}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Gender</h3>
                      <p className="text-gray-600">{cat.gender}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Breed</h3>
                      <p className="text-gray-600">{cat.breed || 'Unknown'}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">Color</h3>
                      <p className="text-gray-600">{cat.color || 'Unknown'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Special Care Notes</h2>
                    <p className="text-gray-600">
                      {cat.special_care_notes || 'None'}
                    </p>
                  </div>

                  <div className="mb-6">
                    <h2 className="text-xl font-semibold mb-2">Medical Information</h2>
                    <div className="space-y-2">
                      <p className="text-gray-600">
                        <strong>Weight:</strong> {cat.weight || 'Unknown'}
                      </p>
                      {cat.microchip_number && (
                        <p className="text-gray-600">
                          <strong>Microchip:</strong> {cat.microchip_number}
                        </p>
                      )}
                    </div>
                  </div>

                  <Button 
                    asChild 
                    size="lg" 
                    className="w-full"
                    onClick={() => window.scrollTo(0, 0)}
                  >
                    <a href="/adopt">Start Adoption Process</a>
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CatDetail;
