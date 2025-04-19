/* -------------------------------------------------------------
   src/components/ui/toaster.tsx
   Simple wrapper around Sonner’s <Toaster> so it can be used
   from anywhere via  import { Toaster } from '@/components/ui/toaster'
   ------------------------------------------------------------- */

'use client';

import { Toaster as SonnerToaster } from 'sonner';

/** Global toast container — include once at app‑root level */
export function Toaster() {
  return <SonnerToaster richColors closeButton />;
}

export default Toaster;
