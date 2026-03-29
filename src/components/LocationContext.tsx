'use client';

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface LocationContextType {
  city: string;
  setCity: (city: string) => void;
  isLocating: boolean;
  detectLocation: () => Promise<void>;
  supportedCities: string[];
}

const UK_CITIES = [
  "London", "Birmingham", "Manchester", "Glasgow", "Liverpool", 
  "Edinburgh", "Bristol", "Leeds", "Sheffield", "Newcastle",
  "Nottingham", "Southampton", "Portsmouth", "Brighton", "Cambridge", 
  "Oxford", "Cardiff", "Belfast", "Leicester", "Aberdeen", "Plymouth",
  "Milton Keynes", "Reading", "Northampton", "Luton", "Swindon",
  "York", "Gloucester", "Derby", "Preston", "Bath", "Chester"
];

export const ALL_UK = "All UK";

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState<string>(ALL_UK);
  const [isLocating, setIsLocating] = useState(false);

  // Initialize from localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem('user-city');
    if (savedCity) {
      setCityState(savedCity);
    } else {
      // Auto-detect on first visit
      detectLocation();
    }
  }, []);

  const setCity = (newCity: string) => {
    setCityState(newCity);
    localStorage.setItem('user-city', newCity);
  };

  const detectLocation = useCallback(async () => {
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      setIsLocating(true);
      return new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
                const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
                const data = await res.json();
                const detectedCity = data.city || data.locality;
                if (detectedCity && UK_CITIES.includes(detectedCity)) {
                  setCity(detectedCity);
                } else {
                  setCity(ALL_UK);
                }
            } catch (error) {
              console.error("Location detection error:", error);
              setCity(ALL_UK);
            } finally {
              setIsLocating(false);
              resolve();
            }
          },
          (error) => {
            console.warn("Geolocation denied or failed:", error);
            setIsLocating(false);
            resolve();
          },
          { timeout: 10000 }
        );
      });
    }
  }, []);

  const value = {
    city,
    setCity,
    isLocating,
    detectLocation,
    supportedCities: UK_CITIES
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
}
