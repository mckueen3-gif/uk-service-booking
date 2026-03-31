'use strict';
'use client';

import React, { useState, useEffect } from 'react';

interface DynamicGreetingProps {
  name: string;
}

export default function DynamicGreeting({ name }: DynamicGreetingProps) {
  const [greeting, setGreeting] = useState('');
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
    const updateGreeting = () => {
      const hour = new Date().getHours();
      if (hour >= 5 && hour < 12) {
        setGreeting('早安');
      } else if (hour >= 12 && hour < 18) {
        setGreeting('午安');
      } else {
        setGreeting('晚安');
      }
    };

    updateGreeting();
    // Update every minute to handle time transitions
    const interval = setInterval(updateGreeting, 60000);
    return () => clearInterval(interval);
  }, []);

  // Avoid hydration mismatch by rendering a generic greeting or nothing on server
  if (!hasMounted) {
    return (
      <span style={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>
        您好，{name || '貴賓'} 👋
      </span>
    );
  }

  return (
    <span style={{ fontSize: 'inherit', fontWeight: 'inherit', color: 'inherit' }}>
      {greeting}，{name || '貴賓'} 👋
    </span>
  );
}
