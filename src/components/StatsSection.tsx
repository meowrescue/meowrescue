import React, { useState, useEffect } from 'react';
import { Container } from './ui/Container.js';
import { SectionHeading } from './ui/SectionHeading.js';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { supabase } from '@/integrations/supabase/client';
import { CountUp } from './CountUp.js';
import { useToast } from '@/hooks/use-toast';

interface Stats {
  catsRescued: number;
  catsAdopted: number;
  volunteersCount: number;
  donationsReceived: number;
}

const StatsSection: React.FC = () => {
  const [stats, setStats] = useState<Stats>({
    catsRescued: 0,
    catsAdopted: 0,
    volunteersCount: 0,
    donationsReceived: 0,
  });
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('site_stats')
          .select('*')
          .single();

        if (error) {
          console.error("Error fetching stats:", error);
          toast({
            title: "Error",
            description: "Failed to load site statistics.",
            variant: "destructive",
          });
        }

        if (data) {
          setStats({
            catsRescued: data.cats_rescued || 0,
            catsAdopted: data.cats_adopted || 0,
            volunteersCount: data.active_volunteers || 0,
            donationsReceived: data.total_donations || 0,
          });
        }
      } catch (error) {
        console.error("Unexpected error fetching stats:", error);
        toast({
          title: "Unexpected Error",
          description: "An unexpected error occurred while loading site statistics.",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [toast]);

  return (
    <section className="bg-gray-50 py-16">
      <Container>
        <SectionHeading
          title="Our Impact"
          subtitle="Numbers that speak volumes"
          centered
        />

        <Tabs defaultValue="rescues" className="w-full max-w-3xl mx-auto">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="rescues">Rescues & Adoptions</TabsTrigger>
            <TabsTrigger value="community">Community Support</TabsTrigger>
          </TabsList>
          <TabsContent value="rescues" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-meow-primary mb-2">
                  Cats Rescued
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  The total number of cats we've saved from the streets.
                </p>
                <div className="text-4xl font-extrabold text-gray-800">
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <CountUp end={stats.catsRescued} duration={2} />
                  )}
                </div>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-meow-primary mb-2">
                  Cats Adopted
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  The total number of cats that found their forever homes.
                </p>
                <div className="text-4xl font-extrabold text-gray-800">
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <CountUp end={stats.catsAdopted} duration={2} />
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="community" className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-meow-primary mb-2">
                  Active Volunteers
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  The number of dedicated volunteers helping us daily.
                </p>
                <div className="text-4xl font-extrabold text-gray-800">
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <CountUp end={stats.volunteersCount} duration={2} />
                  )}
                </div>
              </div>

              <div className="text-center p-6 bg-white rounded-lg shadow-md">
                <h3 className="text-2xl font-bold text-meow-primary mb-2">
                  Donations Received
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  The total amount of donations we've received to support our
                  cause.
                </p>
                <div className="text-4xl font-extrabold text-gray-800">
                  {isLoading ? (
                    "Loading..."
                  ) : (
                    <>
                      $<CountUp end={stats.donationsReceived} duration={2} />
                    </>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </Container>
    </section>
  );
};

export default StatsSection;
