'use client';

import React from 'react';
import { User, MapPin, ShieldCheck, Star, Clock } from 'lucide-react';

interface LiveProfilePreviewProps {
  businessName: string;
  bio: string;
  city: string;
  sector: string;
  avatar?: string | null;
}

export default function LiveProfilePreview({ businessName, bio, city, sector, avatar }: LiveProfilePreviewProps) {
  return (
    <div className="preview-sticky">
      <div className="preview-label">
        <Clock size={14} />
        <span>實時預覽 Live Preview</span>
      </div>
      
      <div className="premium-card">
        <div className="card-top">
          <div className="avatar-placeholder">
            {avatar ? (
              <img src={avatar} alt="Business Profile" className="avatar-image-live" />
            ) : (
              <User size={32} color="#d4af37" />
            )}
            <div className="online-indicator" />
          </div>
          <div className="header-info">
            <div className="name-row">
              <h4 className="business-name">{businessName || "您的商號名稱"}</h4>
              <ShieldCheck size={18} color="#d4af37" />
            </div>
            <div className="meta-row">
              <span className="sector-tag">{sector || "專業領域"}</span>
              <div className="rating-pill">
                <Star size={12} fill="#d4af37" color="#d4af37" />
                <span>5.0</span>
              </div>
            </div>
          </div>
        </div>

        <div className="card-body">
          <p className="bio-text">
            {bio || "請填寫簡介，這將是客戶對您的第一印象。建議提及您的專業年資或核心優勢內容。"}
          </p>
          
          <div className="location-info">
            <MapPin size={14} color="#666" />
            <span>{city}, United Kingdom</span>
          </div>
        </div>

        <div className="card-footer">
          <div className="btn-mock">立即預約諮詢</div>
        </div>
        
        {/* Decorative corner */}
        <div className="corner-accent" />
      </div>

      <style jsx>{`
        .preview-sticky {
          position: sticky;
          top: 20px;
        }

        .preview-label {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #d4af37;
          font-size: 0.75rem;
          font-weight: 800;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          margin-bottom: 16px;
          opacity: 0.8;
          padding-left: 4px;
        }

        .premium-card {
          background-color: #0c0c0c;
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 24px;
          padding: 24px;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(212, 175, 55, 0.05);
          position: relative;
          overflow: hidden;
          transition: all 0.3s ease;
        }

        .card-top {
          display: flex;
          gap: 16px;
          margin-bottom: 20px;
          align-items: center;
        }

        .avatar-placeholder {
          width: 56px;
          height: 56px;
          background: rgba(212, 175, 55, 0.05);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
        }

        .avatar-image-live {
          width: 100%;
          height: 100%;
          object-fit: cover;
          animation: fade-in 0.5s ease-out;
        }

        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }

        .online-indicator {
          position: absolute;
          bottom: -2px;
          right: -2px;
          width: 12px;
          height: 12px;
          background: #10b981;
          border: 2px solid #0c0c0c;
          border-radius: 50%;
        }

        .header-info {
          flex: 1;
        }

        .name-row {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 4px;
        }

        .business-name {
          margin: 0;
          color: white;
          font-size: 1.15rem;
          font-weight: 900;
          letter-spacing: -0.01em;
        }

        .meta-row {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sector-tag {
          color: #d4af37;
          font-size: 0.75rem;
          font-weight: 700;
          text-transform: uppercase;
        }

        .rating-pill {
          display: flex;
          align-items: center;
          gap: 4px;
          background: rgba(255,255,255,0.05);
          padding: 2px 8px;
          border-radius: 8px;
          font-size: 0.7rem;
          font-weight: 800;
          color: white;
        }

        .card-body {
          margin-bottom: 24px;
        }

        .bio-text {
          color: #888;
          font-size: 0.9rem;
          line-height: 1.6;
          margin: 0 0 16px;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .location-info {
          display: flex;
          align-items: center;
          gap: 8px;
          color: #666;
          font-size: 0.8rem;
          font-weight: 600;
        }

        .card-footer {
          border-top: 1px solid rgba(255,255,255,0.05);
          padding-top: 20px;
        }

        .btn-mock {
          width: 100%;
          padding: 12px;
          background: #d4af37;
          color: black;
          border-radius: 12px;
          text-align: center;
          font-weight: 800;
          font-size: 0.9rem;
          opacity: 0.9;
        }

        .corner-accent {
          position: absolute;
          top: -20px;
          right: -20px;
          width: 40px;
          height: 40px;
          background: radial-gradient(circle, rgba(212, 175, 55, 0.2) 0%, transparent 70%);
          filter: blur(10px);
        }
      `}</style>
    </div>
  );
}
