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
  "York", "Gloucester", "Derby", "Preston", "Bath", "Chester",
  "Coventry", "Hull", "Stoke-on-Trent", "Wolverhampton", "Swansea",
  "Sunderland", "Bradford", "Bournemouth", "Middlesbrough", "Peterborough"
];

export const ALL_UK = "All UK";

const LocationContext = createContext<LocationContextType | undefined>(undefined);

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [city, setCityState] = useState<string>(ALL_UK);
  const [isLocating, setIsLocating] = useState(false);

  const setCity = (newCity: string) => {
    setCityState(newCity);
    if (typeof window !== 'undefined') {
      localStorage.setItem('user-city', newCity);
    }
  };

  const detectLocation = useCallback(async () => {
    setIsLocating(true);
    let detectedSuccessfully = false;

    const processDetectedCity = (detected: string, isLondon: boolean) => {
      if (!detected) return false;
      
      let normalized = detected.replace(/City of |Greater /g, "").trim();
      
      // London borough handling
      const isBorough = ["Westminster", "Camden", "Greenwich", "Hackney", "Islington", "Kensington", "Lambeth", "Lewisham", "Southwark", "Tower Hamlets", "Wandsworth", "Hammersmith", "Fulham"].some(b => normalized.includes(b));
      
      if (isBorough || isLondon || normalized === "London") {
        setCity("London");
        return true;
      }

      const matchedCity = UK_CITIES.find(c => 
        normalized.toLowerCase() === c.toLowerCase() || 
        normalized.toLowerCase().includes(c.toLowerCase()) ||
        c.toLowerCase().includes(normalized.toLowerCase())
      );

      if (matchedCity) {
        setCity(matchedCity);
        return true;
      } else if (normalized) {
        setCity(normalized);
        return true;
      }
      return false;
    };

    // Step 1: Try Browser Geolocation (GPS)
    if (typeof window !== 'undefined' && 'geolocation' in navigator) {
      await new Promise<void>((resolve) => {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            try {
              const { latitude, longitude } = position.coords;
              const res = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
              const data = await res.json();
              const rawCity = data.city || data.locality || data.principalSubdivision || "";
              detectedSuccessfully = processDetectedCity(rawCity, data.principalSubdivision === "Greater London");
            } catch (error) {
              console.error("Location detection error:", error);
            } finally {
              resolve();
            }
          },
          (error) => {
            console.warn("Geolocation denied or failed:", error);
            resolve();
          },
          { timeout: 5000, enableHighAccuracy: false }
        );
      });
    }

    // Step 2: Try IP-based Fallback if GPS failed or was denied
    if (!detectedSuccessfully) {
      try {
        const res = await fetch('https://ipapi.co/json/');
        const data = await res.json();
        if (data.country === 'GB' && data.city) {
          processDetectedCity(data.city, data.region === "Greater London");
        }
      } catch (e) {
        console.error("IP Geolocation fallback failed:", e);
      }
    }

    setIsLocating(false);
  }, []);

  // Initialize from localStorage
  useEffect(() => {
    const savedCity = localStorage.getItem('user-city');
    if (savedCity) {
      setCityState(savedCity);
    } else {
      detectLocation();
    }
  }, [detectLocation]);

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
