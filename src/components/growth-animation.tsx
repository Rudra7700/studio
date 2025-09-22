
'use client';
import { useEffect, useState } from 'react';

export function GrowthAnimation({ quote }: { quote: string }) {
  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-4 text-center">
      <div 
        className="h-32 w-32 flex items-center justify-center mx-auto animate-in fade-in slide-in-from-bottom-5 duration-500" 
        style={{ animationDelay: '500ms' }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full">
          {/* Soil line */}
          <line x1="10" y1="95" x2="90" y2="95" stroke="hsl(var(--primary))" strokeWidth="2" className="soil-line" />
          
          {/* Roots */}
          <g className="roots">
              <path d="M 50 50 Q 45 60, 40 70" stroke="#A1887F" fill="none" strokeWidth="1.5" />
              <path d="M 50 50 Q 50 65, 55 75" stroke="#A1887F" fill="none" strokeWidth="1.5" />
              <path d="M 50 50 Q 55 60, 60 70" stroke="#A1887F" fill="none" strokeWidth="1.5" />
          </g>

          {/* Stem */}
          <path d="M 50 95 V 50" stroke="#4CAF50" fill="none" strokeWidth="2" className="stem" />
          
          {/* Leaves */}
          <g className="leaves">
            <path d="M 50 65 C 40 60, 40 50, 50 45" fill="#2E7D32" />
            <path d="M 50 65 C 60 60, 60 50, 50 45" fill="#4CAF50" />
            <path d="M 50 55 C 45 50, 45 40, 50 35" fill="#2E7D32" />
            <path d="M 50 55 C 55 50, 55 40, 50 35" fill="#4CAF50" />
          </g>
          
          {/* Seed */}
          <g className="seed">
            <path d="M 40 90 A 10 10 0 0 1 60 90 L 50 98 Z" fill="#D2B48C" className="seed-left"/>
            <path d="M 60 90 A 10 10 0 0 0 40 90 L 50 98 Z" fill="#C0A070" className="seed-right"/>
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
        className="text-sm text-muted-foreground mt-4 h-10 overflow-hidden whitespace-nowrap animate-in fade-in duration-300"
        style={{ animationDelay: '2000ms' }}
      >
        <span 
            className="inline-block"
        >
            "{quote}"
        </span>
      </p>
    </div>
  );
}
