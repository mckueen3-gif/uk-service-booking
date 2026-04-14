"use client";

import React from 'react';

/**
 * 簡易 SVG 條碼生成器 (Code 128 模擬)
 * 專門用於呈現電子現金券代碼，無須額外依賴庫
 */
export default function Barcode({ code }: { code: string }) {
  if (!code) return null;

  // 簡單的條碼模擬渲染 (用於視覺呈現，具備珍珠金點綴)
  // 在生產環境中，若需極高精準度掃描，可未來整合 bwip-js
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', gap: '0.5rem' }}>
      <div 
        style={{ 
          width: '100%', 
          height: '60px', 
          background: `linear-gradient(90deg, 
            #000 0%, #000 2%, transparent 2%, transparent 4%,
            #000 4%, #000 5%, transparent 5%, transparent 8%,
            #000 8%, #000 12%, transparent 12%, transparent 14%,
            #000 14%, #000 15%, transparent 15%, transparent 18%,
            #000 18%, #000 22%, transparent 22%, transparent 24%,
            #000 24%, #000 25%, transparent 25%, transparent 28%,
            #000 28%, #000 32%, transparent 32%, transparent 34%,
            #000 34%, #000 35%, transparent 35%, transparent 38%,
            #000 38%, #000 42%, transparent 42%, transparent 44%,
            #000 44%, #000 45%, transparent 45%, transparent 48%,
            #000 48%, #000 52%, transparent 52%, transparent 54%,
            #000 54%, #000 55%, transparent 55%, transparent 58%,
            #000 58%, #000 62%, transparent 62%, transparent 64%,
            #000 64%, #000 65%, transparent 65%, transparent 68%,
            #000 68%, #000 72%, transparent 72%, transparent 74%,
            #000 74%, #000 75%, transparent 75%, transparent 78%,
            #000 78%, #000 82%, transparent 82%, transparent 84%,
            #000 84%, #000 85%, transparent 85%, transparent 88%,
            #000 88%, #000 92%, transparent 92%, transparent 94%,
            #000 94%, #000 95%, transparent 95%, transparent 98%,
            #000 98%, #000 100%)`,
          opacity: 0.9,
          borderRadius: '4px'
        }} 
      />
      <div style={{ fontSize: '0.9rem', fontWeight: 900, letterSpacing: '0.4em', color: '#666', fontFamily: 'monospace' }}>
        {code.toUpperCase()}
      </div>
    </div>
  );
}
