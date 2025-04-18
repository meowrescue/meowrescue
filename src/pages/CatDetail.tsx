import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, Heart, Clock, Info, Medal, Syringe, PawPrint, Clipboard, User } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import { Dialog, DialogContent } from "@/components/ui/dialog";
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
  intake_date: string;
  medical_notes: string | null;
  birthday: string | null;
  internal_status: string;
}

const CatDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

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

  // Add query for medical records
  const { data: medicalRecords } = useQuery({
    queryKey: ['cat-medical-records', id],
    queryFn: async () => {
      if (!id) return [];
      const { data, error } = await supabase
        .from('cat_medical_records')
        .select('*')
        .eq('cat_id', id)
        .order('record_date', { ascending: false });

      if (error) throw error;
      return data;
    },
    enabled: !!id
  });

  const formatAge = (ageEstimate: string | null, birthday: string | null): string => {
    if (birthday) {
      const years = Math.floor((new Date().getTime() - new Date(birthday).getTime()) / (365.25 * 24 * 60 * 60 * 1000));
      const months = Math.floor((new Date().getTime() - new Date(birthday).getTime()) / (30.44 * 24 * 60 * 60 * 1000));
    
      if (years === 0) {
        return `${months} month${months === 1 ? '' : 's'} old`;
      }
      return `${years} year${years === 1 ? '' : 's'} old`;
    }
  
    // If no birthday, use age estimate with more descriptive text
    if (ageEstimate) {
      const ageText = ageEstimate.toLowerCase();
      if (ageText.includes('month')) return `${ageEstimate} old`;
      if (ageText.includes('year')) return `${ageEstimate} old`;
    }
  
    return 'Unknown age';
  };

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
      <div className="bg-gradient-to-b from-meow-primary/10 to-transparent py-16 md:py-24">
        <div className="container mx-auto px-4">
          <SectionHeading
            title={cat.name}
            subtitle={`Meet ${cat.name}, a ${formatAge(cat.age_estimate, cat.birthday)} ${cat.gender.toLowerCase()} looking for a loving home.`}
          />
        </div>
      </div>

      {/* Cat Details Section */}
      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Image and Status */}
          <div className="space-y-6">
            <div className="relative overflow-hidden rounded-lg shadow-lg cursor-pointer group" 
                 onClick={() => setSelectedImage(cat.photos_urls?.[0] || '/placeholder-cat.jpg')}>
              <img
                src={cat.photos_urls?.[0] || '/placeholder-cat.jpg'}
                alt={cat.name}
                className="w-full h-[400px] object-cover transition-transform duration-300 group-hover:scale-105"
              />
              <div className="absolute top-4 right-4">
                <Badge className={`text-white ${cat.status === 'Available' ? 'bg-green-500' : cat.status === 'Pending' ? 'bg-yellow-500' : 'bg-blue-500'}`}>
                  {cat.status}
                </Badge>
              </div>
              <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <div className="text-white text-lg font-medium">Click to enlarge</div>
              </div>
            </div>

            {/* Intake Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-meow-primary" />
                Intake Information
              </h3>
              <div className="space-y-2 text-gray-600">
                <p className="flex items-center">
                  <Clock className="mr-2 h-4 w-4" />
                  Intake Date: {format(new Date(cat.intake_date), 'MMMM d, yyyy')}
                </p>
              </div>
            </div>
          </div>

          {/* Details and Medical Info */}
          <div className="space-y-6">
            {/* Basic Details */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <Info className="mr-2 h-5 w-5 text-meow-primary" />
                About {cat.name}
              </h3>
              <p className="text-gray-600 mb-6">{cat.description}</p>
              <div className="grid grid-cols-2 gap-4 text-gray-600">
                <div className="space-y-2">
                  <p><strong>Age:</strong> {cat.age_estimate}</p>
                  <p><strong>Gender:</strong> {cat.gender}</p>
                  <p><strong>Breed:</strong> {cat.breed || 'Unknown'}</p>
                  <p><strong>Weight:</strong> {cat.weight || 'Unknown'}</p>
                </div>
                <div className="space-y-2">
                  <p><strong>Color:</strong> {cat.color || 'Unknown'}</p>
                  <p><strong>Pattern:</strong> {cat.pattern || 'Unknown'}</p>
                  <p><strong>Eye Color:</strong> {cat.eye_color || 'Unknown'}</p>
                  <p><strong>Coat Type:</strong> {cat.coat_type || 'Unknown'}</p>
                </div>
              </div>
            </div>

            {/* Special Care Notes - Only show if there are notes */}
            {cat.medical_notes && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Heart className="mr-2 h-5 w-5 text-meow-primary" />
                  Special Care Notes
                </h3>
                <p className="text-gray-600">{cat.medical_notes}</p>
              </div>
            )}

            {/* Medical Records from Admin Dashboard */}
            {medicalRecords && medicalRecords.length > 0 && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <Medal className="mr-2 h-5 w-5 text-meow-primary" />
                  Medical History
                </h3>
                <div className="space-y-4">
                  {medicalRecords.map((record) => (
                    <div key={record.id} className="border-b last:border-b-0 pb-4 last:pb-0">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">{record.procedure_type}</h4>
                        <span className="text-sm text-gray-500">
                          {format(new Date(record.record_date), 'MMM d, yyyy')}
                        </span>
                      </div>
                      <p className="text-gray-600 mb-2">{record.description}</p>
                      {record.veterinarian && (
                        <p className="text-sm text-gray-500">Veterinarian: {record.veterinarian}</p>
                      )}
                      {record.notes && (
                        <p className="text-sm text-gray-500 mt-1">Notes: {record.notes}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Adoption Process Section */}
      <div className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Adoption Process"
            subtitle="Here's what you need to know about adopting from us"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-xl font-semibold mb-3">1. Application</div>
              <p className="text-gray-600">Fill out our adoption application form. We'll review your information and get back to you within 48 hours.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-xl font-semibold mb-3">2. Meet & Greet</div>
              <p className="text-gray-600">Schedule a time to meet your potential new family member. This helps ensure it's a perfect match.</p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="text-xl font-semibold mb-3">3. Welcome Home</div>
              <p className="text-gray-600">Complete the adoption fee and paperwork. We'll provide you with all necessary medical records and care instructions.</p>
            </div>
          </div>

          {/* Moved Adoption CTA here */}
          <div className="flex justify-center mt-8">
            <Button asChild size="lg" className="bg-meow-primary hover:bg-meow-primary/90">
              <a href="/adopt">Start Adoption Process</a>
            </Button>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-[90vw] p-1 bg-transparent border-0">
          <div className="relative bg-black/80 p-1 rounded-lg">
            <img 
              src={selectedImage || ''} 
              alt={cat.name}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
              onClick={() => setSelectedImage(null)}
            />
            <button 
              className="absolute top-2 right-2 h-8 w-8 flex items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/70"
              onClick={() => setSelectedImage(null)}
            >
              ×
            </button>
          </div>
        </DialogContent>
      </Dialog>

    </Layout>
  );
};

export default CatDetail;
