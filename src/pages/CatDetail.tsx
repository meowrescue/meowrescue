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

      {/* Hero Section */}
      <div className="bg-meow-primary/10 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            title={cat.name}
            subtitle={`Meet ${cat.name}, a ${cat.age_estimate} ${cat.gender} looking for a loving home.`}
          />
        </div>
      </div>

      {/* Cat Details Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image */}
          <div className="md:order-1">
            <img
              src={cat.photos_urls?.[0] || '/placeholder-cat.jpg'}
              alt={cat.name}
              className="w-full rounded-lg shadow-md object-cover h-96"
            />
            <div className="mt-4 flex justify-between items-center">
              <p className="text-gray-600">
                <Calendar className="inline-block mr-2 h-4 w-4" />
                Posted on {cat.created_at ? format(new Date(cat.created_at), 'MMMM d, yyyy') : 'Unknown Date'}
              </p>
              <Badge className={`text-white ${cat.status === 'Available' ? 'bg-green-500' : cat.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                {cat.status}
              </Badge>
            </div>
          </div>

          {/* Details */}
          <div className="md:order-2">
            <div className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Description</h4>
                <p className="text-gray-600">{cat.description}</p>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-600">
                  <div>
                    <p>
                      <strong>Age:</strong> {cat.age_estimate}
                    </p>
                    <p>
                      <strong>Gender:</strong> {cat.gender}
                    </p>
                    <p>
                      <strong>Breed:</strong> {cat.breed || 'Unknown'}
                    </p>
                    <p>
                      <strong>Weight:</strong> {cat.weight || 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p>
                      <strong>Color:</strong> {cat.color || 'Unknown'}
                    </p>
                    <p>
                      <strong>Pattern:</strong> {cat.pattern || 'Unknown'}
                    </p>
                    <p>
                      <strong>Eye Color:</strong> {cat.eye_color || 'Unknown'}
                    </p>
                    <p>
                      <strong>Coat Type:</strong> {cat.coat_type || 'Unknown'}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-semibold mb-2">Special Care Notes</h4>
                <p className="text-gray-600">
                  {cat.special_care_notes || 'None'}
                </p>
              </div>

              <Button asChild size="lg">
                {/* Ensure this link navigates to the top of the page */}
                <a href="/adopt">Start Adoption Process</a>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Foster and Medical Info Section */}
      <div className="bg-gray-50 py-8 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Foster & Medical Information"
            subtitle="Important dates and details"
            centered
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 text-gray-600">
            <div>
              <h4 className="font-semibold mb-2">Foster Details</h4>
              <p>
                <strong>Foster Start Date:</strong>{' '}
                {cat.foster_start_date ? format(new Date(cat.foster_start_date), 'MMMM d, yyyy') : 'N/A'}
              </p>
              <p>
                <strong>Foster End Date:</strong>{' '}
                {cat.foster_end_date ? format(new Date(cat.foster_end_date), 'MMMM d, yyyy') : 'N/A'}
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Medical Details</h4>
              <p>
                <strong>Vaccination Date:</strong>{' '}
                {cat.vaccination_date ? format(new Date(cat.vaccination_date), 'MMMM d, yyyy') : 'N/A'}
              </p>
              <p>
                <strong>Deworming Date:</strong>{' '}
                {cat.deworming_date ? format(new Date(cat.deworming_date), 'MMMM d, yyyy') : 'N/A'}
              </p>
              <p>
                <strong>Flea Treatment Date:</strong>{' '}
                {cat.flea_treatment_date ? format(new Date(cat.flea_treatment_date), 'MMMM d, yyyy') : 'N/A'}
              </p>
              <p>
                <strong>Spay/Neuter Date:</strong>{' '}
                {cat.spay_neuter_date ? format(new Date(cat.spay_neuter_date), 'MMMM d, yyyy') : 'N/A'}
              </p>
              <p>
                <strong>Microchip Number:</strong> {cat.microchip_number || 'N/A'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CatDetail;
