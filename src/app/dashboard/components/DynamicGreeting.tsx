"use client";

import { useEffect, useState } from 'react';

export default function DynamicGreeting({ userName }: { userName: string }) {
  const [greeting, setGreeting] = useState("早安");
  const [icon, setIcon] = useState("👋");

  useEffect(() => {
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting("早安");
        setIcon("🌅");
      } else if (hour >= 12 && hour < 18) {
        setGreeting("午安");
        setIcon("☀️");
      } else {
        setGreeting("晚安");
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
      color: '#2d2d2d'
    }}>
      {greeting}，<span style={{ color: '#b8860b' }}>{userName}</span> {icon}
    </h1>
  );
}
