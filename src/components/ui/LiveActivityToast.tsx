'use client';

import React, { useState, useEffect } from 'react';
import { useTranslation } from '../LanguageContext';
import { getPublicActivities } from '@/app/actions/public-activity';
import { Users, Calendar, Sparkles, CheckCircle2 } from 'lucide-react';

interface Activity {
  type: 'MERCHANT_JOIN' | 'BOOKING_DONE';
  name: string;
  city: string;
  category?: string;
  timestamp: Date | string;
}

export default function LiveActivityToast({ inline = false }: { inline?: boolean }) {
  const { t } = useTranslation();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);
  const [hasNewData, setHasNewData] = useState(false);

  useEffect(() => {
    async function loadData() {
      const res = await getPublicActivities();
      if (res.success && res.activities.length > 0) {
        setActivities(res.activities as any);
        setHasNewData(true);
      }
    }
    loadData();
    
    // Refresh every 5 minutes
    const refreshInterval = setInterval(loadData, 300000);
    return () => clearInterval(refreshInterval);
  }, []);

  useEffect(() => {
    if (activities.length === 0) return;

    // Cycle through activities every 8 seconds
    const cycleInterval = setInterval(() => {
      setIsVisible(false);
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % activities.length);
        setIsVisible(true);
      }, 500); // Wait for fade out
    }, 8000);

    // Initial show
    setIsVisible(true);

    return () => clearInterval(cycleInterval);
  }, [activities.length]);

  if (activities.length === 0 || !isVisible) return null;

  const current = activities[currentIndex];
  
  return (
    <div className={`live-activity-toast ${isVisible ? 'fade-in' : 'fade-out'} ${inline ? 'inline-toast' : ''}`}>
      <div className="activity-icon">
        {current.type === 'MERCHANT_JOIN' ? (
          <Users size={18} color="#d4af37" />
        ) : (
          <Calendar size={18} color="#ecc94b" />
        )}
      </div>
      <div className="activity-content">
        <p className="activity-text">
          {current.type === 'MERCHANT_JOIN' ? (
            <>
              <strong>{current.name}</strong> from <strong>{current.city}</strong> {t?.liveActivity?.joined || "just joined as an expert!"}
            </>
          ) : (
            <>
              <strong>{current.name}</strong> just booked {current.category ? <strong>{current.category}</strong> : "an expert"} in <strong>{current.city}</strong>
            </>
          )}
        </p>
        <div className="activity-meta">
          <CheckCircle2 size={10} color="#38a169" />
          <span>{t?.liveActivity?.verified || "Verified Activity"}</span>
        </div>
      </div>

      <style jsx>{`
        .live-activity-toast {
          position: fixed;
          bottom: 24px;
          left: 24px;
          z-index: 1000;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(15, 15, 15, 0.9);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(212, 175, 55, 0.3);
          border-radius: 12px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.5), 0 0 10px rgba(212, 175, 55, 0.1);
          max-width: 320px;
          pointer-events: none;
          transition: all 0.5s cubic-bezier(0.165, 0.84, 0.44, 1);
        }

        .live-activity-toast.inline-toast {
          position: relative;
          bottom: auto;
          left: auto;
          margin: 0 auto 30px;
          z-index: 10;
        }

        .activity-icon {
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(212, 175, 55, 0.1);
          border-radius: 50%;
          flex-shrink: 0;
        }

        .activity-content {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .activity-text {
          margin: 0;
          font-size: 0.85rem;
          color: #e2e8f0;
          line-height: 1.4;
        }

        .activity-meta {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 0.65rem;
          color: #718096;
          text-transform: uppercase;
          letter-spacing: 0.05em;
          font-weight: 700;
        }

        .fade-in {
          opacity: 1;
          transform: translateX(0);
        }

        .fade-out {
          opacity: 0;
          transform: translateX(-20px);
        }

        @media (max-width: 768px) {
          .live-activity-toast {
            left: 12px;
            bottom: 80px; /* Above bottom nav if any */
            max-width: calc(100% - 24px);
          }
        }
      `}</style>
    </div>
  );
}
