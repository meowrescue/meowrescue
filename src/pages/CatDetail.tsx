
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import { useCatData } from '@/hooks/use-cat-data';
import { formatAge } from '@/utils/formatAge';
import CatDetailsHeader from '@/components/cat/CatDetails/CatDetailsHeader';
import CatPhotosSection from '@/components/cat/CatDetails/CatPhotosSection';
import CatInfoSection from '@/components/cat/CatDetails/CatInfoSection';
import AdoptionProcessSection from '@/components/cat/CatDetails/AdoptionProcessSection';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';

const CatDetail = () => {
  const { id: catId } = useParams<{ id: string }>();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const { cat, medicalRecords, isLoading, isError, error } = useCatData(catId!);

  const handleImageClick = (image: string) => {
    setSelectedImage(image);
  };

  useEffect(() => {
    if (!catId) return;
    const subscription = getSupabaseClient()
      .channel(`cat-${catId}-updates`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cats', filter: `id=eq.${catId}` }, (payload) => {
        console.log('Cat update received:', payload);
        // Temporary workaround to refresh the page since refetch function is not available
        window.location.reload();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [catId]);

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

      <CatDetailsHeader
        name={cat.name}
        age={formatAge(cat.age_estimate, cat.birthday)}
        gender={cat.gender}
      />

      <div className="container mx-auto px-4 py-8 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <CatPhotosSection
            photos={cat.photos_urls}
            status={cat.status}
            name={cat.name}
            onImageClick={handleImageClick}
          />
          <CatInfoSection cat={cat} medicalRecords={medicalRecords || []} />
        </div>
      </div>

      <AdoptionProcessSection />

      {/* Image Dialog */}
      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-4xl w-[90vw] p-1 bg-transparent border-0">
          <div className="relative bg-black/80 p-1 rounded-lg">
            <img 
              src={selectedImage || ''}
              alt={`${cat.name} enlarged photo`}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
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
