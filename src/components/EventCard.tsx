
import React from 'react';
import { formatDate } from '../utils/dateUtils';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, MapPin } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { Event } from '../types/events';
import { Skeleton } from "@/components/ui/skeleton";

interface EventCardProps {
  event: Event;
  isLoading?: boolean;
}

const EventCard: React.FC<EventCardProps> = ({ event, isLoading }) => {
  if (isLoading) {
    return (
      <Card className="overflow-hidden">
        <CardHeader>
          <CardTitle>
            <Skeleton className="h-5 w-3/4" />
          </CardTitle>
          <CardDescription>
            <Skeleton className="h-4 w-1/2" />
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Skeleton className="h-32 w-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-5/6" />
          </div>
        </CardContent>
        <CardFooter>
          <Skeleton className="h-10 w-full" />
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader>
        <CardTitle>{event.title}</CardTitle>
        <CardDescription>{formatDate(event.date)}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <AspectRatio ratio={16 / 9}>
          <img
            src={event.imageUrl}
            alt={event.title}
            className="object-cover w-full h-full rounded-md"
          />
        </AspectRatio>
        <div className="space-y-2">
          <div className="flex items-center">
            <CalendarDays className="w-4 h-4 mr-2" />
            {event.date}
          </div>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2" />
            {event.location}
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button asChild>
          <a href={`/events/${event.id}`}>View Details</a>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default EventCard;
