"use client";

import { useEffect, useState } from 'react';
import { useTranslation } from '@/components/LanguageContext';

export default function DynamicGreeting({ userName }: { userName: string }) {
  const { t } = useTranslation();
  const [greeting, setGreeting] = useState("Greetings");
  const [icon, setIcon] = useState("👋");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      const morningStr = t?.common?.greetings?.morning || "Good Morning";
      const afternoonStr = t?.common?.greetings?.afternoon || "Good Afternoon";
      const eveningStr = t?.common?.greetings?.evening || "Good Evening";

      if (hour >= 5 && hour < 12) {
        setGreeting(morningStr);
        setIcon("🌅");
      } else if (hour >= 12 && hour < 18) {
        setGreeting(afternoonStr);
        setIcon("☀️");
      } else {
        setGreeting(eveningStr);
        setIcon("🌙");
      }
    };

    updateGreeting();
    // Update every minute just in case the period changes while tab is open
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <h1 style={{ 
      fontSize: '2.5rem', 
      fontWeight: 900, 
      marginBottom: '0.5rem', 
      color: 'var(--text-primary)'
    }}>
      {greeting}, <span style={{ color: '#b8860b' }}>{userName}</span> {icon}
    </h1>
  );
}
