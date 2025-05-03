import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Filter } from 'lucide-react';
import getSupabaseClient from '@/integrations/supabase/client';
import SEO from '@/components/SEO';
import PageHeader from '@/components/ui/PageHeader';
import { scrollToTop } from '@/utils/scrollUtils';
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
}

const Cats: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  
  // Fetch cats from Supabase
  const { data: cats = [], isLoading, isError, error, refetch } = useQuery({
    queryKey: ['adoptable-cats'],
    queryFn: async () => {
      try {
        const { data, error } = await supabase
          .from('cats')
          .select('*')
          .eq('status', 'Available')
          .order('name');
        
        if (error) throw error;
        
        return data as Cat[];
      } catch (err) {
        console.error('Error fetching cats:', err);
        return [];
      }
    },
    retry: 2,
    retryDelay: 1000
  });

  // Subscribe to real-time updates for adoptable cats
  useEffect(() => {
    const subscription = supabase
      .channel('adoptable-cats-updates')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'cats' }, (payload) => {
        console.log('Cat update received:', payload);
        refetch();
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [refetch]);

  // Apply filters
  const filteredCats = cats.filter(cat => {
    // Search filter
    const matchesSearch = 
      cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.breed?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      cat.description?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Age filter
    const matchesAge = 
      ageFilter === 'all' || 
      (ageFilter === 'kitten' && cat.age_estimate?.toLowerCase().includes('month')) ||
      (ageFilter === 'young' && cat.age_estimate?.toLowerCase().includes('year') && parseInt(cat.age_estimate) <= 3) ||
      (ageFilter === 'adult' && cat.age_estimate?.toLowerCase().includes('year') && parseInt(cat.age_estimate) > 3);
    
    // Gender filter
    const matchesGender = genderFilter === 'all' || cat.gender?.toLowerCase() === genderFilter.toLowerCase();
    
    return matchesSearch && matchesAge && matchesGender;
  });

  return (
    <Layout>
      <SEO 
        title="Adoptable Cats | Meow Rescue" 
        description="Meet our adorable cats available for adoption. Find your perfect feline companion today!"
      />
      
      {/* Updated Hero Section with PageHeader */}
      <PageHeader
        title="Adoptable Cats"
        subtitle="Find your perfect feline companion"
      />
      
      {/* Content Section */}
      <div className="container mx-auto px-4 py-8">
        <p className="mt-6 max-w-2xl mx-auto text-gray-600 text-center">
          All of our cats are spayed/neutered, vaccinated, and microchipped before adoption.
          Adoption fees help cover these medical costs and support our rescue efforts.
        </p>
        
        {/* Filters Section */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-8 mt-8 backdrop-blur-sm hover:shadow-lg transition-all">
          <div className="flex flex-col md:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-grow">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                type="text"
                placeholder="Search by name, breed, or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-full border-gray-200 focus:border-meow-primary focus:ring focus:ring-meow-primary/20"
              />
            </div>
            
            {/* Age Filter */}
            <div className="flex-shrink-0">
              <select
                value={ageFilter}
                onChange={(e) => setAgeFilter(e.target.value)}
                className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-meow-primary/20 focus:border-meow-primary"
              >
                <option value="all">All Ages</option>
                <option value="kitten">Kittens (&lt; 1 year)</option>
                <option value="young">Young (1-3 years)</option>
                <option value="adult">Adult (3+ years)</option>
              </select>
            </div>
            
            {/* Gender Filter */}
            <div className="flex-shrink-0">
              <select
                value={genderFilter}
                onChange={(e) => setGenderFilter(e.target.value)}
                className="w-full md:w-auto px-3 py-2 border border-gray-200 rounded-md shadow-sm focus:outline-none focus:ring focus:ring-meow-primary/20 focus:border-meow-primary"
              >
                <option value="all">All Genders</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>
        </div>
        
        {/* Cats Grid */}
        {isLoading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-meow-primary"></div>
          </div>
        ) : isError ? (
          <div className="text-center py-12">
            <p className="text-lg text-red-500 mb-4">
              We encountered an error loading our adoptable cats.
            </p>
            <Button onClick={() => refetch()} variant="outline" className="border-2 border-meow-primary">
              Try Again
            </Button>
          </div>
        ) : filteredCats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCats.map((cat) => (
              <Link 
                to={`/cats/${cat.id}`} 
                key={cat.id}
                className="group"
              >
                <div className="bg-white rounded-lg shadow-md overflow-hidden transition-all duration-300 hover:shadow-lg hover:translate-y-[-5px] h-full flex flex-col">
                  <div className="h-64 overflow-hidden">
                    <img 
                      src={cat.photos_urls?.[0] || '/placeholder-cat.jpg'} 
                      alt={`${cat.name} - ${cat.age_estimate} ${cat.gender} cat available for adoption`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                      width="400"
                      height="300"
                    />
                  </div>
                  <div className="p-4 flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-xl font-semibold text-meow-primary">{cat.name}</h3>
                      <Badge className="bg-green-500 text-white">
                        {cat.status}
                      </Badge>
                    </div>
                    <div className="flex gap-2 mb-3 text-sm text-gray-600">
                      <span>{cat.age_estimate}</span>
                      <span>•</span>
                      <span>{cat.gender}</span>
                      {cat.breed && (
                        <>
                          <span>•</span>
                          <span>{cat.breed}</span>
                        </>
                      )}
                    </div>
                    <p className="text-gray-600 line-clamp-3">{cat.description}</p>
                  </div>
                  <div className="p-4 pt-0">
                    <Button className="w-full" variant="meow">
                      Meet {cat.name}
                    </Button>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-lg text-gray-500 mb-4">
              {searchTerm || ageFilter !== 'all' || genderFilter !== 'all'
                ? "No cats match your current filters. Try adjusting your search criteria."
                : "No cats are currently available for adoption. Please check back soon!"}
            </p>
            {(searchTerm || ageFilter !== 'all' || genderFilter !== 'all') && (
              <Button 
                onClick={() => {
                  setSearchTerm('');
                  setAgeFilter('all');
                  setGenderFilter('all');
                }}
                variant="outline"
                className="border-2 border-meow-primary"
              >
                Clear Filters
              </Button>
            )}
          </div>
        )}
      </div>
      
      {/* Adoption Process Section */}
      <div className="bg-gray-50 py-16">
        <div className="container mx-auto px-4">
          <SectionHeading
            title="Adoption Process"
            subtitle="How to bring your new feline friend home"
            centered
          />
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg hover:translate-y-[-5px] transition-all">
              <div className="w-16 h-16 bg-meow-primary/10 rounded-full flex items-center justify-center text-meow-primary text-2xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-semibold mb-3">Apply</h3>
              <p className="text-gray-600">
                Fill out our adoption application to start the process. We'll review your application and contact you within 48 hours.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg hover:translate-y-[-5px] transition-all">
              <div className="w-16 h-16 bg-meow-primary/10 rounded-full flex items-center justify-center text-meow-primary text-2xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-semibold mb-3">Meet</h3>
              <p className="text-gray-600">
                Schedule a meet and greet with your potential new family member. Spend time getting to know each other.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md text-center hover:shadow-lg hover:translate-y-[-5px] transition-all">
              <div className="w-16 h-16 bg-meow-primary/10 rounded-full flex items-center justify-center text-meow-primary text-2xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-semibold mb-3">Adopt</h3>
              <p className="text-gray-600">
                Complete the adoption contract, pay the adoption fee, and welcome your new cat home!
              </p>
            </div>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              asChild 
              size="lg" 
              variant="meow"
              className="hover:translate-y-[-2px] transition-all"
              onClick={scrollToTop}
            >
              <Link to="/adopt">Start Adoption Process</Link>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Cats;
