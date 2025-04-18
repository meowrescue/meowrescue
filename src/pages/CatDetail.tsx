import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Heart, ArrowLeft, Calendar, MapPin, Users, FileCheck, Star, Stethoscope } from 'lucide-react';
import { format } from 'date-fns';
import Layout from '@/components/Layout';
import SectionHeading from '@/components/ui/SectionHeading';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import SEO from '@/components/SEO';

interface CatDetails {
  id: string;
  name: string;
  age_estimate: string;
  gender: string;
  breed: string;
  description: string;
  bio: string;
  medical_notes: string;
  photos_urls: string[];
  status: 'Available' | 'Pending' | 'Adopted';
  intake_date: string;
}

interface MedicalRecord {
  id: string;
  cat_id: string;
  procedure_type: string;
  description: string;
  veterinarian: string | null;
  cost: number | null;
  notes: string | null;
  record_date: string;
  created_at: string;
}

const CatDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [cat, setCat] = useState<CatDetails | null>(null);
  const [medicalRecords, setMedicalRecords] = useState<MedicalRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const fetchCatDetails = async () => {
      setIsLoading(true);
      try {
        // For now, we'll use the mock data if Supabase isn't fully set up
        const { data: catData, error } = await supabase
          .from('cats')
          .select('*')
          .eq('id', id)
          .single();

        if (error) {
          console.error('Error fetching cat details:', error);
          // Fallback to mock data from the cats.ts file
          const { cats } = await import('@/data/cats');
          const mockCat = cats.find(c => c.id === id);
          
          if (mockCat) {
            // Convert mock data format to match our CatDetails interface
            setCat({
              id: mockCat.id,
              name: mockCat.name,
              age_estimate: mockCat.age,
              gender: mockCat.gender,
              breed: 'Domestic Shorthair',
              description: mockCat.description,
              bio: mockCat.description,
              medical_notes: 'All vaccines up to date. Spayed/neutered.',
              photos_urls: [mockCat.imageUrl],
              status: mockCat.status as 'Available' | 'Pending' | 'Adopted',
              intake_date: new Date().toISOString(),
            });
          } else {
            toast({
              title: "Cat not found",
              description: "We couldn't find the cat you're looking for.",
              variant: "destructive",
            });
          }
        } else {
          setCat(catData);
          
          // Fetch medical records
          const { data: medicalData, error: medicalError } = await supabase
            .from('cat_medical_records')
            .select('*')
            .eq('cat_id', id)
            .order('record_date', { ascending: false });
            
          if (medicalError) {
            console.error('Error fetching medical records:', medicalError);
          } else {
            setMedicalRecords(medicalData || []);
          }
        }
      } catch (error) {
        console.error('Error:', error);
        toast({
          title: "Error",
          description: "There was a problem fetching the cat details.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchCatDetails();
    }
  }, [id, toast]);

  // Handle adoption button click - navigates to adoption form with cat info prefilled
  const handleAdoptClick = () => {
    if (cat) {
      navigate(`/adopt?catId=${cat.id}&catName=${encodeURIComponent(cat.name)}`);
    } else {
      navigate('/adopt');
    }
  };

  if (isLoading) {
    return (
      <Layout>
        <SEO title="Loading Cat Details" />
        <div className="container mx-auto px-4 py-16 flex justify-center items-center min-h-[60vh]">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
        </div>
      </Layout>
    );
  }

  if (!cat) {
    return (
      <Layout>
        <SEO title="Cat Not Found" />
        <div className="container mx-auto px-4 py-16 text-center min-h-[60vh]">
          <h1 className="text-3xl font-bold text-gray-800 mb-4">Cat Not Found</h1>
          <p className="text-gray-600 mb-8">
            We couldn't find the cat you're looking for. It may have been adopted or removed.
          </p>
          <Button asChild className="bg-meow-primary hover:bg-meow-primary/90">
            <Link to="/cats">Back to All Cats</Link>
          </Button>
        </div>
      </Layout>
    );
  }

  // Format intake date
  const formattedIntakeDate = new Date(cat.intake_date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });

  const statusColors = {
    Available: 'bg-green-100 text-green-800',
    Pending: 'bg-yellow-100 text-yellow-800',
    Adopted: 'bg-blue-100 text-blue-800'
  };

  const metaDescription = `Meet ${cat.name}, a ${cat.age_estimate} ${cat.gender} cat available for adoption at Meow Rescue. ${cat.description.substring(0, 100)}...`;

  return (
    <Layout>
      <SEO 
        title={`Meet ${cat?.name || 'Cat'} - Adoptable Cat`} 
        description={metaDescription}
        type="profile"
        image={cat?.photos_urls[0] || '/placeholder.svg'}
      />

      <div className="container mx-auto px-4 py-12">
        <Link 
          to="/cats" 
          className="inline-flex items-center text-meow-primary hover:underline mb-8"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to All Cats
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
              <img 
                src={cat?.photos_urls[activeImageIndex] || '/placeholder.svg'} 
                alt={cat?.name} 
                className="w-full h-full object-cover cursor-pointer"
                onClick={() => setSelectedImage(cat?.photos_urls[activeImageIndex])}
              />
            </div>
            
            {cat?.photos_urls.length > 1 && (
              <div className="flex gap-2 overflow-x-auto py-2">
                {cat.photos_urls.map((photo, index) => (
                  <button 
                    key={index}
                    onClick={() => setActiveImageIndex(index)}
                    className={`
                      h-20 w-20 rounded-md overflow-hidden border-2 
                      ${activeImageIndex === index ? 'border-meow-primary' : 'border-transparent'}
                    `}
                  >
                    <img 
                      src={photo} 
                      alt={`${cat.name} thumbnail ${index+1}`} 
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>
          
          {/* Cat Details */}
          <div>
            <div className="bg-white rounded-lg shadow-sm p-8">
              <div className="flex justify-between items-start mb-6">
                <h1 className="text-4xl font-bold text-meow-primary">{cat?.name}</h1>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[cat?.status || 'Available']}`}>
                  {cat?.status}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500">Age</span>
                  <p className="font-medium">{cat?.age_estimate || 'Unknown'}</p>
                </div>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <span className="text-sm text-gray-500">Gender</span>
                  <p className="font-medium">{cat?.gender || 'Unknown'}</p>
                </div>
                {cat?.breed && (
                  <div className="bg-gray-50 p-4 rounded-lg col-span-2">
                    <span className="text-sm text-gray-500">Breed</span>
                    <p className="font-medium">{cat.breed}</p>
                  </div>
                )}
              </div>
              
              <div className="space-y-6">
                <div>
                  <h2 className="text-xl font-semibold mb-3">About {cat?.name}</h2>
                  <p className="text-gray-600 leading-relaxed">{cat?.bio || cat?.description}</p>
                </div>

                {/* Special Care Notes */}
                {cat?.medical_notes && (
                  <div className="bg-meow-primary/5 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-3 flex items-center">
                      <Star className="mr-2 h-5 w-5 text-meow-primary" />
                      Special Care Notes
                    </h2>
                    <p className="text-gray-600">{cat.medical_notes}</p>
                  </div>
                )}

                {/* Medical History Section */}
                {medicalRecords && medicalRecords.length > 0 && (
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h2 className="text-xl font-semibold mb-4 flex items-center">
                      <Stethoscope className="mr-2 h-5 w-5 text-meow-primary" />
                      Medical History
                    </h2>
                    <div className="space-y-4">
                      {medicalRecords.map((record) => (
                        <div key={record.id} className="flex items-start gap-4 border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                          <div className="bg-meow-primary/10 p-2 rounded-full">
                            <FileCheck className="h-4 w-4 text-meow-primary" />
                          </div>
                          <div>
                            <div className="font-medium">{record.procedure_type}</div>
                            <div className="text-sm text-gray-600">{record.description}</div>
                            <div className="text-xs text-gray-500 mt-1">
                              {format(new Date(record.record_date), 'MMM d, yyyy')}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="mt-8">
                <Button 
                  onClick={handleAdoptClick}
                  className="w-full bg-meow-secondary hover:bg-meow-secondary/90 text-white py-3 px-8 rounded-md text-lg"
                >
                  Adopt {cat?.name}
                </Button>
              </div>
            </div>
          </div>
        </div>

        <SectionHeading 
          title="Adoption Process" 
          subtitle="Here's how you can make this sweet kitty part of your family"
          centered
        />
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12 mb-16">
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-meow-primary/10 rounded-full flex items-center justify-center text-meow-primary font-bold text-2xl mb-4 mx-auto">
              1
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center">Submit Application</h3>
            <p className="text-gray-700 text-center">
              Complete our online adoption application. We'll review it and contact you within 2-3 days.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-meow-primary/10 rounded-full flex items-center justify-center text-meow-primary font-bold text-2xl mb-4 mx-auto">
              2
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center">Meet & Greet</h3>
            <p className="text-gray-700 text-center">
              Schedule a time to meet {cat.name}. Spend time getting to know each other.
            </p>
          </div>
          
          <div className="bg-white p-6 rounded-lg shadow-md">
            <div className="w-12 h-12 bg-meow-primary/10 rounded-full flex items-center justify-center text-meow-primary font-bold text-2xl mb-4 mx-auto">
              3
            </div>
            <h3 className="text-lg font-semibold mb-2 text-center">Finalize Adoption</h3>
            <p className="text-gray-700 text-center">
              Complete the adoption contract, pay the adoption fee, and welcome {cat.name} to your family!
            </p>
          </div>
        </div>
        
        <div className="text-center mt-12">
          <Button 
            onClick={handleAdoptClick}
            className="bg-meow-primary hover:bg-meow-primary/90 px-8"
          >
            Start Adoption Process
          </Button>
        </div>

        {/* Image view modal */}
        <Dialog open={!!selectedImage} onOpenChange={(open) => !open && setSelectedImage(null)}>
          <DialogContent className="max-w-4xl w-[90vw] p-0 overflow-hidden bg-transparent border-0">
            <div className="relative bg-black/80 p-1 rounded-lg">
              <img 
                src={selectedImage || ''} 
                alt="Full size" 
                className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
                onClick={() => setSelectedImage(null)}
              />
              <Button 
                className="absolute top-2 right-2 h-8 w-8 p-0 rounded-full bg-black/50 hover:bg-black/70 text-white"
                variant="ghost"
                size="sm"
                onClick={() => setSelectedImage(null)}
              >
                &times;
              </Button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Schema.org PetAnimal markup */}
        <script type="application/ld+json" dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "PetAnimal",
            "name": cat.name,
            "gender": cat.gender,
            "description": cat.description,
            "image": cat.photos_urls[0] || '/placeholder.svg',
            "healthCondition": cat.medical_notes || "Good health, vaccinated and spayed/neutered",
            "availabilityStarts": cat.intake_date,
            "availabilityEnds": cat.status === 'Available' ? null : new Date().toISOString(),
            "petType": "Cat",
            "breed": cat.breed || "Mixed",
            "offers": {
              "@type": "Offer",
              "availability": cat.status === 'Available' ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
              "price": "0",
              "priceCurrency": "USD",
              "validFrom": cat.intake_date
            },
            "provider": {
              "@type": "Organization",
              "name": "Meow Rescue",
              "telephone": "7272570037",
              "email": "info@meowrescue.org",
              "address": {
                "@type": "PostalAddress",
                "addressLocality": "New Port Richey",
                "addressRegion": "FL",
                "addressCountry": "US"
              }
            }
          })
        }} />
      </div>
    </Layout>
  );
};

export default CatDetail;
