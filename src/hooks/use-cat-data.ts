
import { useQuery } from '@tanstack/react-query';
import getSupabaseClient from '@/integrations/getSupabaseClient()/client';
import { Cat, MedicalRecord } from '@/types/cat';
import { usePageData } from '@/contexts/PageDataContext';

export function useCatData(id: string) {
  const pageData = usePageData();
  const preloadedCat = pageData?.pageType === 'catDetail' ? pageData.cat : null;
  const preloadedMedicalRecords = pageData?.pageType === 'catDetail' ? pageData.medicalRecords : null;

  const { data: cat, isLoading: isLoadingCat, isError: isCatError, error: catError } = useQuery({
    queryKey: ['cat', id],
    queryFn: async () => {
      if (!id) throw new Error("Cat ID is required");
      
      if (preloadedCat) {
        console.log('Using preloaded cat data from SSR');
        return preloadedCat;
      }
      
      const { data, error } = await getSupabaseClient()
        .from('cats')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      return data as Cat;
    },
    enabled: !!id && !preloadedCat,
    initialData: preloadedCat
  });

  const { data: medicalRecords } = useQuery({
    queryKey: ['cat-medical-records', id],
    queryFn: async () => {
      if (!id) return [];
      
      if (preloadedMedicalRecords) {
        console.log('Using preloaded medical records from SSR');
        return preloadedMedicalRecords;
      }
      
      const { data, error } = await getSupabaseClient()
        .from('cat_medical_records')
        .select('*')
        .eq('cat_id', id)
        .order('record_date', { ascending: false });

      if (error) throw error;
      return data as MedicalRecord[];
    },
    enabled: !!id && !preloadedMedicalRecords,
    initialData: preloadedMedicalRecords
  });

  return {
    cat,
    medicalRecords,
    isLoading: isLoadingCat,
    isError: isCatError,
    error: catError
  };
}
