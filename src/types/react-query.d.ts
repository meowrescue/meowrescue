
import '@tanstack/react-query';

declare module '@tanstack/react-query' {
  interface QueryClient {
    getQueryState(): any;
  }
}
