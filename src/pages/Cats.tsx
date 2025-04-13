
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import Layout from '@/components/Layout';
import SEO from '@/components/SEO';
import CatCard from '@/components/CatCard';

interface Cat {
  id: string;
  name: string;
  age_estimate: string | null;
  breed: string | null;
  gender: string | null;
  status: "Available" | "Pending" | "Adopted";
  photos_urls: string[] | null;
  description: string | null;
}

const Cats: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<"Available" | "Pending" | "Adopted" | null>("Available");
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCats();
  }, [selectedStatus]);

  const fetchCats = async () => {
    setLoading(true);
    setError(null);

    let query = supabase
      .from('cats')
      .select('*')
      .order('name', { ascending: true });

    if (selectedStatus) {
      query = query.eq('status', selectedStatus);
    }

    try {
      const { data, error } = await query;

      if (error) {
        throw error;
      }

      // Only use data from database, no mock data fallback
      setCats(data || []);
    } catch (error: any) {
      setError(error.message);
      console.error("Error fetching cats:", error);
      // No fallback to mock data on error
      setCats([]);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    // Cast to the correct type when setting the status
    setSelectedStatus(status as "Available" | "Pending" | "Adopted" | null);
  };

  const filteredCats = cats.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Layout>
      <SEO title="Adoptable Cats | Meow Rescue" description="Browse our available cats for adoption. Find your perfect feline companion!" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary mb-4 md:mb-0">Adoptable Cats</h1>
          <div className="w-full md:w-auto flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-auto">
              <Input
                type="text"
                placeholder="Search cats..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="w-full md:w-auto">
              <Select value={selectedStatus || ''} onValueChange={handleStatusChange}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="All Statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="Pending">Pending</SelectItem>
                  <SelectItem value="Adopted">Adopted</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-meow-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500 mb-4">There was an issue loading the cats.</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
              {filteredCats.map(cat => (
                <CatCard
                  key={cat.id}
                  id={cat.id}
                  name={cat.name}
                  imageUrl={cat.photos_urls && cat.photos_urls.length > 0 ? cat.photos_urls[0] : '/placeholder.svg'}
                  age={cat.age_estimate || 'Unknown age'}
                  gender={cat.gender || 'Unknown'}
                  description={cat.description || 'No description available'}
                  status={cat.status}
                />
              ))}
            </div>
          </div>
        ) : filteredCats.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-600">No cats found matching your search criteria.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {filteredCats.map(cat => (
              <CatCard
                key={cat.id}
                id={cat.id}
                name={cat.name}
                imageUrl={cat.photos_urls && cat.photos_urls.length > 0 ? cat.photos_urls[0] : '/placeholder.svg'}
                age={cat.age_estimate || 'Unknown age'}
                gender={cat.gender || 'Unknown'}
                description={cat.description || 'No description available'}
                status={cat.status}
              />
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default Cats;
