
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import SectionHeading from '../components/ui/SectionHeading';
import CatCard from '../components/CatCard';
import { cats } from '../data/cats';
import CtaSection from '../components/CtaSection';
import SEO from '../components/SEO';
import { Button } from '@/components/ui/button';
import { Filter } from 'lucide-react';

const Cats: React.FC = () => {
  // State for filters
  const [ageFilter, setAgeFilter] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('Available');
  const [showFilters, setShowFilters] = useState(false);
  
  // Function to determine age group based on age string
  const getAgeGroup = (age: string): string => {
    if (age.toLowerCase().includes('kitten')) return 'kitten';
    if (age.toLowerCase().includes('young')) return 'young';
    if (age.toLowerCase().includes('adult')) return 'adult';
    if (age.toLowerCase().includes('senior')) return 'senior';
    return 'unknown';
  };
  
  // Filter cats based on selected criteria
  const filteredCats = cats.filter(cat => {
    // Status filter
    if (statusFilter !== 'all' && cat.status !== statusFilter) {
      return false;
    }
    
    // Gender filter
    if (genderFilter !== 'all' && cat.gender !== genderFilter) {
      return false;
    }
    
    // Age filter
    if (ageFilter !== 'all') {
      const ageGroup = getAgeGroup(cat.age);
      if (ageFilter !== ageGroup) {
        return false;
      }
    }
    
    return true;
  });
  
  // Reset filters
  const resetFilters = () => {
    setAgeFilter('all');
    setGenderFilter('all');
    setStatusFilter('Available');
  };
  
  return (
    <Layout>
      <SEO 
        title="Adoptable Cats" 
        description="Find your perfect feline companion at Meow Rescue. Browse our adoptable cats and start your adoption journey today."
      />
      
      <div className="container mx-auto px-4 py-12">
        <SectionHeading 
          title="Adoptable Cats" 
          subtitle="Find your perfect feline companion"
          centered
        />
        
        <div className="mb-8 text-center">
          <p className="text-gray-700 max-w-4xl mx-auto">
            Each of our cats has been rescued, given medical care, and showered with love. They're now ready to find their forever homes. Get to know our adoptable cats below, and when you're ready, submit an adoption application.
          </p>
        </div>
        
        {/* Filter controls */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2"
            >
              <Filter size={16} />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </Button>
            
            {showFilters && (
              <Button 
                variant="ghost" 
                onClick={resetFilters}
                size="sm"
              >
                Reset Filters
              </Button>
            )}
          </div>
          
          {showFilters && (
            <div className="bg-gray-50 p-4 rounded-lg space-y-4 md:space-y-0 md:grid md:grid-cols-3 md:gap-4">
              {/* Age filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                <select 
                  value={ageFilter} 
                  onChange={(e) => setAgeFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-meow-primary focus:border-meow-primary"
                >
                  <option value="all">All Ages</option>
                  <option value="kitten">Kitten (0-1 year)</option>
                  <option value="young">Young (1-3 years)</option>
                  <option value="adult">Adult (3-7 years)</option>
                  <option value="senior">Senior (7+ years)</option>
                </select>
              </div>
              
              {/* Gender filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                <select 
                  value={genderFilter} 
                  onChange={(e) => setGenderFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-meow-primary focus:border-meow-primary"
                >
                  <option value="all">All Genders</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              
              {/* Status filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select 
                  value={statusFilter} 
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded-md focus:ring-meow-primary focus:border-meow-primary"
                >
                  <option value="all">All Statuses</option>
                  <option value="Available">Available</option>
                  <option value="Pending">Pending</option>
                  <option value="Adopted">Adopted</option>
                </select>
              </div>
            </div>
          )}
          
          {/* Filter results summary */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {filteredCats.length} {filteredCats.length === 1 ? 'cat' : 'cats'}
            {(ageFilter !== 'all' || genderFilter !== 'all' || statusFilter !== 'Available') && ' with applied filters'}
          </div>
        </div>
        
        {filteredCats.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
            {filteredCats.map(cat => (
              <CatCard 
                key={cat.id}
                id={cat.id}
                name={cat.name}
                imageUrl={cat.imageUrl}
                age={cat.age}
                gender={cat.gender}
                description={cat.description}
                status={cat.status}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-xl text-gray-700">
              No cats match your current filters. Please try different filter options or check back soon.
            </p>
            <Button 
              variant="meow" 
              onClick={resetFilters} 
              className="mt-4"
            >
              Reset Filters
            </Button>
          </div>
        )}
        
        <div className="mt-16 bg-gray-50 p-8 rounded-lg">
          <h2 className="text-2xl font-bold text-meow-primary mb-4 text-center">Adoption Process</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8">
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
                Schedule a time to meet the cat(s) you're interested in. Spend time getting to know each other.
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-md">
              <div className="w-12 h-12 bg-meow-primary/10 rounded-full flex items-center justify-center text-meow-primary font-bold text-2xl mb-4 mx-auto">
                3
              </div>
              <h3 className="text-lg font-semibold mb-2 text-center">Finalize Adoption</h3>
              <p className="text-gray-700 text-center">
                Complete the adoption contract, pay the adoption fee, and welcome your new family member home!
              </p>
            </div>
          </div>
          
          <div className="text-center mt-8">
            <a href="/adopt" className="text-meow-primary font-medium hover:underline">
              Learn more about our adoption process →
            </a>
          </div>
        </div>
      </div>
      
      <CtaSection 
        title="Can't Adopt Right Now?"
        description="You can still make a difference in the lives of our cats by fostering, volunteering, or donating."
        buttonText="Other Ways to Help"
        buttonLink="/volunteer"
        bgColor="bg-meow-secondary"
      />
    </Layout>
  );
};

export default Cats;
