
'use client';
import { useEffect, useState } from 'react';

export function GrowthAnimation({ quote }: { quote: string }) {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-4 text-center">
      <div 
        className="h-32 w-32 flex items-end justify-center mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500" 
        style={{ animationDelay: '500ms' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
            {/* Pot */}
            <path d="M 20 95 L 25 40 H 75 L 80 95 H 20 Z" fill="#D2B48C" stroke="#A1887F" strokeWidth="2" />
            <path d="M 18 40 H 82" stroke="#A1887F" strokeWidth="3" strokeLinecap="round" />

            {/* Water filling */}
            <defs>
              <clipPath id="pot-clip">
                <path d="M 25 40 H 75 L 80 95 H 20 Z" />
              </clipPath>
            </defs>
            <g clipPath="url(#pot-clip)">
                <rect x="20" y="40" width="60" height="55" fill="rgba(69, 162, 218, 0.5)" className="pot-water" />
            </g>

            {/* Plant */}
            <g className="plant" style={{ transformOrigin: '50px 85px' }}>
              <path d="M 50 85 V 50" stroke="#4CAF50" strokeWidth="3" strokeLinecap="round" />
              <path d="M 50 65 C 40 60, 40 50, 50 50" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 50 65 C 60 60, 60 50, 50 50" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 50 55 C 45 50, 45 45, 50 45" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" />
              <path d="M 50 55 C 55 50, 55 45, 50 45" stroke="#4CAF50" strokeWidth="3" fill="none" strokeLinecap="round" />
            </g>


            {/* Water Drops */}
            <g fill="#45A2DA">
                <path d="M 50 10 C 45 20, 55 20, 50 10 Z" transform="translate(0, 20)" className="drop-1">
                    <animateTransform attributeName="transform" type="translate" values="0 0; 0 25" dur="0.5s" begin="0.5s" fill="freeze" />
                </path>
                 <path d="M 50 10 C 45 20, 55 20, 50 10 Z" transform="translate(5, 20)" className="drop-2">
                    <animateTransform attributeName="transform" type="translate" values="5 0; 5 25" dur="0.5s" begin="1s" fill="freeze" />
                </path>
                 <path d="M 50 10 C 45 20, 55 20, 50 10 Z" transform="translate(-5, 20)" className="drop-3">
                    <animateTransform attributeName="transform" type="translate" values="-5 0; -5 25" dur="0.5s" begin="1.5s" fill="freeze" />
                </path>
            </g>
        </svg>
      </div>
      
      <div className="w-full h-1 bg-yellow-900/20 rounded-full mt-4 overflow-hidden">
        <div 
            className="h-full bg-primary/50" 
            style={{ 
                animation: 'fill-progress 1.5s linear 1.5s forwards',
                width: '0%',
            }}
        />
      </div>

      <p 
        className="text-sm text-muted-foreground mt-4 h-10 animate-in fade-in duration-300"
        style={{ animationDelay: '2000ms' }}
      >
        "{quote}"
      </p>
    </div>
  );
}
