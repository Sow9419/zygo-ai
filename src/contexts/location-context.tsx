"use client";

import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";

export interface LocationData {
  country: string;
  city: string;
  location?: {
    lat: number;
    lon: number;
  };
  isFallback?: boolean;
}

interface LocationContextType {
  locationData: LocationData | null;
  setLocationData: (data: LocationData | null) => void;
  isEnabled: boolean;
  setIsEnabled: (enabled: boolean) => void;
  isLoading: boolean;
  setIsLoading: (loading: boolean) => void;
}

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function useLocationContext() {
  const ctx = useContext(LocationContext);
  if (!ctx) throw new Error("useLocationContext must be used within a LocationProvider");
  return ctx;
}

export function LocationProvider({ children }: { children: ReactNode }) {
  const [locationData, setLocationData] = useState<LocationData | null>(null);
  const [isEnabled, setIsEnabled] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  // Initialisation depuis localStorage (optionnel)
  useEffect(() => {
    const storedPreference = localStorage.getItem("locationEnabled");
    if (storedPreference !== null) {
      setIsEnabled(storedPreference === "true");
    }
    const data = localStorage.getItem("locationData");
    if (data) {
      try {
        setLocationData(JSON.parse(data));
      } catch {}
    }
  }, []);

  return (
    <LocationContext.Provider value={{ locationData, setLocationData, isEnabled, setIsEnabled, isLoading, setIsLoading }}>
      {children}
    </LocationContext.Provider>
  );
}
