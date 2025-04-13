
import React from 'react';
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { Heart, Users, HandHeart, Calendar, Award, Clock } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

const About = () => {
  return (
    <Layout>
      <SEO 
        title="About Us | Meow Rescue" 
        description="Learn about Meow Rescue's mission to save and improve the lives of cats in need." 
      />
      
      <section className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-meow-primary mb-4">About Meow Rescue</h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We are dedicated to rescuing, rehabilitating, and rehoming cats in need. Our goal is to ensure every cat finds a loving forever home.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-20">
            <div className="text-center">
              <div className="bg-meow-primary/10 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4">
                <Clock className="h-10 w-10 text-meow-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Founded in 2015</h3>
              <p className="text-gray-600">
                Started with a mission to help the growing population of stray and abandoned cats.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-meow-primary/10 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4">
                <Award className="h-10 w-10 text-meow-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Non-Profit Organization</h3>
              <p className="text-gray-600">
                501(c)(3) organization dedicated to cat welfare and community education.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-meow-primary/10 rounded-full p-4 mx-auto w-20 h-20 flex items-center justify-center mb-4">
                <Heart className="h-10 w-10 text-meow-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-2">1000+ Cats Rescued</h3>
              <p className="text-gray-600">
                Rescued, rehabilitated, and rehomed over a thousand cats since our founding.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <section className="py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            <div>
              <img 
                src="/placeholder.svg" 
                alt="Founders of Meow Rescue" 
                className="rounded-lg shadow-md w-full h-auto"
              />
            </div>
            
            <div>
              <h2 className="text-3xl font-bold text-meow-primary mb-4">Our Founder's Story</h2>
              <p className="text-gray-600 mb-4">
                Meow Rescue was founded by Sarah Thompson, a lifelong cat lover and animal welfare advocate. After rescuing a pregnant stray cat and helping find homes for her kittens, Sarah realized the need for dedicated cat rescue services in the community.
              </p>
              <p className="text-gray-600 mb-4">
                Starting with just a small network of fosters, Meow Rescue grew into a respected organization with a dedicated facility and team of volunteers. Sarah's vision was to create more than just a shelter – she wanted to build a community resource that educates the public about responsible pet ownership and the importance of spay/neuter programs.
              </p>
              <p className="text-gray-600">
                Today, Meow Rescue continues Sarah's mission, working tirelessly to help cats in need and place them in loving forever homes. Her compassion and dedication live on in every cat we save.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <Separator className="my-16" />
      
      <section className="py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-meow-primary mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              We believe every cat deserves a chance at a happy, healthy life in a loving home.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HandHeart className="h-5 w-5 text-meow-primary mr-2" />
                  Rescue
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We rescue abandoned, stray, and surrendered cats from dangerous situations, providing immediate medical care and safe shelter.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 text-meow-primary mr-2" />
                  Rehabilitate
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Our dedicated team provides medical treatment, socialization, and behavioral support to prepare cats for their forever homes.
                </p>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 text-meow-primary mr-2" />
                  Rehome
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Through a thorough adoption process, we match cats with loving families who will provide lifetime care and companionship.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
      
      <Separator className="my-16" />
      
      <section className="py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-meow-primary mb-4">Our Current Situation</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              The need for our services continues to grow as more cats need our help.
            </p>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-6 md:p-8 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold mb-4">The Challenge We Face</h3>
                <p className="text-gray-600 mb-4">
                  Every day, we receive calls about stray, abandoned, and surrendered cats needing help. Our intake has increased by 30% in the last year alone, stretching our resources to capacity.
                </p>
                <p className="text-gray-600">
                  We are currently operating at full capacity, with 45 cats in our care and a waiting list for intake. Our foster network is overextended, and we need more support to continue our mission effectively.
                </p>
              </div>
              
              <div>
                <h3 className="text-xl font-semibold mb-4">How We're Responding</h3>
                <ul className="space-y-2 text-gray-600">
                  <li className="flex items-start">
                    <span className="text-meow-primary mr-2">•</span>
                    <span>Expanding our foster network through recruitment and training</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-meow-primary mr-2">•</span>
                    <span>Increasing our community education programs about responsible pet ownership</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-meow-primary mr-2">•</span>
                    <span>Partnering with local veterinarians to provide affordable spay/neuter services</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-meow-primary mr-2">•</span>
                    <span>Working with other rescues to coordinate efforts and maximize resources</span>
                  </li>
                  <li className="flex items-start">
                    <span className="text-meow-primary mr-2">•</span>
                    <span>Fundraising to expand our shelter capacity and medical resources</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          <div className="text-center">
            <p className="text-lg text-gray-600 mb-6">
              We need your support now more than ever. Together, we can continue to make a difference in the lives of cats in need.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild variant="meow" size="lg">
                <a href="/donate">Donate Today</a>
              </Button>
              <Button asChild variant="outline" size="lg">
                <a href="/volunteer">Volunteer With Us</a>
              </Button>
            </div>
          </div>
        </div>
      </section>
      
      <Separator className="my-16" />
      
      <section className="py-12 mb-8">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-meow-primary mb-4">Meet Our Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our dedicated staff and volunteers work tirelessly to support our mission.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { name: "Sarah Thompson", role: "Founder & Director", image: "/placeholder.svg" },
              { name: "Michael Rodriguez", role: "Shelter Manager", image: "/placeholder.svg" },
              { name: "Jennifer Wu", role: "Adoption Coordinator", image: "/placeholder.svg" },
              { name: "David Park", role: "Veterinary Coordinator", image: "/placeholder.svg" }
            ].map((person, index) => (
              <div key={index} className="text-center">
                <Avatar className="h-32 w-32 mx-auto mb-4">
                  <AvatarImage src={person.image} alt={person.name} />
                  <AvatarFallback>{person.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <h3 className="font-semibold text-lg">{person.name}</h3>
                <p className="text-gray-600">{person.role}</p>
              </div>
            ))}
          </div>
          
          <div className="mt-16 text-center">
            <h3 className="text-xl font-semibold mb-4">Our Volunteers</h3>
            <p className="text-gray-600 mb-6 max-w-3xl mx-auto">
              Behind our success is a team of over 50 dedicated volunteers who contribute their time, 
              energy, and expertise to our cause. From socializing cats to administrative support, 
              event planning to facility maintenance, our volunteers make our work possible.
            </p>
            <Button asChild variant="outline">
              <a href="/volunteer">Join Our Volunteer Team</a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
