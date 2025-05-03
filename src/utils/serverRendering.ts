import { QueryClient } from '@tanstack/react-query';
import { matchRoutes } from 'react-router-dom';
import * as React from 'react';
import { routes } from '../routes';

export const createQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
      refetchOnWindowFocus: true,
      gcTime: 30 * 1000, // 30 seconds
      staleTime: 10 * 1000, // 10 seconds
    },
  },
});

export async function loadRouteData(url: string, queryClient: QueryClient) {
  const matches = matchRoutes(routes, url);
  console.log(`[SSR] Route matches:`, matches ? matches.length : 0);
  
  if (!matches?.length) return;

  for (const match of matches) {
    const route = match.route;
    const params = match.params;
    
    console.log(`[SSR] Processing route: ${route.path} with params:`, params);
    
    let Component;
    if (route.element) {
      Component = React.isValidElement(route.element) 
        ? route.element.type 
        : route.element;
    }
    
    if (Component?.getStaticProps) {
      console.log(`[SSR] Found getStaticProps for route ${route.path}, fetching data...`);
      try {
        const data = await Component.getStaticProps({ params });
        queryClient.setQueryData(['staticProps', route.path], data);
      } catch (error) {
        console.error(`[SSR] Error loading data for ${route.path}:`, error);
      }
    }
  }
}
