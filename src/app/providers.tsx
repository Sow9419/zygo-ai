"use client";

import React, { ReactNode } from 'react';
import { AuthProvider } from '@/contexts/auth-context';
import { LocationProvider } from '@/contexts/location-context';
import { SearchStateProvider } from '@/contexts/search-state-context';
// Import other global providers if you have them

interface AppProvidersProps {
  children: ReactNode;
}

export function AppProviders({ children }: AppProvidersProps) {
  return (
    <AuthProvider>
      <LocationProvider>
        <SearchStateProvider>
          {/* You can add other global providers here if needed */}
          {children}
        </SearchStateProvider>
      </LocationProvider>
    </AuthProvider>
  );
}
