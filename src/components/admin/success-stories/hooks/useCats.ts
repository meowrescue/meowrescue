
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface Cat {
  id: string;
  name: string;
  status: string;
}

export const useCats = () => {
  const { data: cats } = useQuery({
    queryKey: ['cats-for-stories'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('cats')
        .select('id, name, status');
      
      if (error) throw error;
      return data as Cat[];
    }
  });

  return { cats };
};
