
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Cat as CatIcon, Loader2 } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from '@/components/ui/badge';
import { supabase } from '@/integrations/supabase/client';
import SEO from '@/components/SEO';

interface Cat {
  id: string;
  name: string;
  age_estimate: string | null;
  breed: string | null;
  gender: string | null;
  status: "Available" | "Pending" | "Adopted";
  photos_urls: string[] | null;
}

const Cats: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<"Available" | "Pending" | "Adopted" | null>(null);
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

      setCats(data as Cat[]);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = (status: string) => {
    // Cast to the correct type when setting the status
    setSelectedStatus(status as "Available" | "Pending" | "Adopted");
  };

  const filteredCats = cats.filter(cat =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <SEO title="Cats | Meow Rescue" />
      
      <div className="container mx-auto py-10">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-meow-primary">Our Cats</h1>
          <Input
            type="text"
            placeholder="Search cats..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="max-w-sm"
          />
        </div>

        <div className="mb-6">
          <Label htmlFor="status">Filter by Status</Label>
          <Select onValueChange={handleStatusChange}>
            <SelectTrigger className="w-auto">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Available">Available</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Adopted">Adopted</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-6 w-6 animate-spin text-meow-primary" />
          </div>
        ) : error ? (
          <div className="text-center py-12">
            <p className="text-red-500">Error: {error}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCats.map(cat => (
              <Link key={cat.id} to={`/cats/${cat.id}`}>
                <Card className="hover:shadow-md transition-shadow duration-300">
                  <CardHeader>
                    {cat.photos_urls && cat.photos_urls.length > 0 ? (
                      <Avatar className="w-full h-48 rounded-md">
                        <AvatarImage src={cat.photos_urls[0]} alt={cat.name} className="object-cover" />
                        <AvatarFallback>{cat.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    ) : (
                      <Avatar className="w-full h-48 rounded-md">
                        <AvatarFallback>{cat.name.charAt(0)}</AvatarFallback>
                      </Avatar>
                    )}
                    <CardTitle className="mt-2">{cat.name}</CardTitle>
                    <CardDescription>
                      {cat.age_estimate ? `${cat.age_estimate} years old` : 'Age unknown'}
                      {cat.breed ? ` - ${cat.breed}` : ''}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <Badge variant="secondary">{cat.gender || 'Unknown'}</Badge>
                      <Badge>
                        {cat.status === 'Available' && <span className="text-green-500">{cat.status}</span>}
                        {cat.status === 'Pending' && <span className="text-yellow-500">{cat.status}</span>}
                        {cat.status === 'Adopted' && <span className="text-blue-500">{cat.status}</span>}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Cats;
