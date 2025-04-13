
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Loader2, Filter } from 'lucide-react';
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
  const [selectedAge, setSelectedAge] = useState<string | null>(null);
  const [selectedGender, setSelectedGender] = useState<string | null>(null);
  const [cats, setCats] = useState<Cat[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);

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

  const handleAgeChange = (age: string) => {
    setSelectedAge(age === "all" ? null : age);
  };

  const handleGenderChange = (gender: string) => {
    setSelectedGender(gender === "all" ? null : gender);
  };

  const toggleFilters = () => {
    setShowFilters(!showFilters);
  };

  const resetFilters = () => {
    setSelectedAge(null);
    setSelectedGender(null);
    setSelectedStatus("Available");
    setSearchQuery('');
  };

  // Filter cats based on all criteria
  const filteredCats = cats.filter(cat => {
    // Name search filter
    const nameMatch = cat.name.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Age filter
    const ageMatch = !selectedAge || (cat.age_estimate && cat.age_estimate.toLowerCase().includes(selectedAge.toLowerCase()));
    
    // Gender filter
    const genderMatch = !selectedGender || (cat.gender && cat.gender.toLowerCase() === selectedGender.toLowerCase());
    
    return nameMatch && ageMatch && genderMatch;
  });

  return (
    <Layout>
      <SEO title="Adoptable Cats | Meow Rescue" description="Browse our available cats for adoption. Find your perfect feline companion!" />
      
      <div className="container mx-auto py-10">
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary mb-4 md:mb-0 text-center w-full">Adoptable Cats</h1>
          <div className="w-full md:w-auto">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="w-full">
                <Input
                  type="text"
                  placeholder="Search cats..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full"
                />
              </div>
              <Button 
                variant="outline" 
                onClick={toggleFilters}
                className="whitespace-nowrap"
              >
                <Filter className="h-4 w-4 mr-2" />
                {showFilters ? "Hide Filters" : "Show Filters"}
              </Button>
            </div>
          </div>
        </div>

        {showFilters && (
          <div className="bg-gray-50 p-4 rounded-lg mb-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="status-filter">Status</Label>
                <Select value={selectedStatus || ''} onValueChange={handleStatusChange}>
                  <SelectTrigger id="status-filter" className="w-full">
                    <SelectValue placeholder="All Statuses" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Available">Available</SelectItem>
                    <SelectItem value="Pending">Pending</SelectItem>
                    <SelectItem value="Adopted">Adopted</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="age-filter">Age</Label>
                <Select value={selectedAge || 'all'} onValueChange={handleAgeChange}>
                  <SelectTrigger id="age-filter" className="w-full">
                    <SelectValue placeholder="All Ages" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Ages</SelectItem>
                    <SelectItem value="kitten">Kitten</SelectItem>
                    <SelectItem value="young">Young</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                    <SelectItem value="senior">Senior</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label htmlFor="gender-filter">Gender</Label>
                <Select value={selectedGender || 'all'} onValueChange={handleGenderChange}>
                  <SelectTrigger id="gender-filter" className="w-full">
                    <SelectValue placeholder="All Genders" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Genders</SelectItem>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4 flex justify-end">
              <Button variant="outline" onClick={resetFilters} size="sm">
                Reset Filters
              </Button>
            </div>
          </div>
        )}

        <div className="text-center mb-6">
          <p className="text-gray-600 max-w-3xl mx-auto">
            Our adoptable cats are looking for loving forever homes. Browse through our available cats and find your perfect companion.
          </p>
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
