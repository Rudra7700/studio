
'use client';

import React from 'react';

interface GrowthAnimationProps {
  progress: number;
}

export function GrowthAnimation({ progress }: GrowthAnimationProps) {
  const tractorPosition = progress; 

  return (
    <div className="w-full max-w-sm mx-auto p-4">
      <svg
        viewBox="0 0 400 150"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-auto"
      >
        {/* Sun */}
        <circle cx="350" cy="40" r="20" fill="hsl(var(--accent) / 0.8)" />

        {/* Ground */}
        <path d="M0 130 H400" stroke="hsl(var(--primary) / 0.3)" strokeWidth="4" strokeLinecap="round" />

        {/* Progress Bar Background */}
        <rect x="20" y="110" width="360" height="10" rx="5" fill="hsl(var(--primary) / 0.1)" />
        
        {/* Progress Bar Fill */}
        <rect x="20" y="110" width={(360 * progress) / 100} height="10" rx="5" fill="hsl(var(--primary) / 0.5)" />

        {/* Tractor Group */}
        <g style={{ transform: `translateX(${tractorPosition * 3.4}px)` }} className="transition-transform duration-100 ease-linear">
          {/* Exhaust */}
          <g className="animate-exhaust">
            <circle cx="35" cy="50" r="3" fill="hsl(var(--muted) / 0.5)" />
            <circle cx="38" cy="45" r="5" fill="hsl(var(--muted) / 0.4)" />
          </g>
          
          {/* Tractor Body */}
          <path d="M10 80 H30 V60 H50 V80 H70 L75 95 H5 V80" fill="hsl(var(--primary))" />
          <path d="M30 60 V50 H35 V60" fill="hsl(var(--primary) / 0.7)" /> {/* Exhaust Pipe */}
          <rect x="50" y="65" width="15" height="10" fill="hsl(var(--accent))" /> {/* Window */}

          {/* Wheels */}
          <g style={{ transformOrigin: '20px 95px' }} className="animate-wheel-spin">
             <circle cx="20" cy="95" r="12" fill="#333" stroke="hsl(var(--foreground))" strokeWidth="2" />
             <circle cx="20" cy="95" r="4" fill="hsl(var(--muted))" />
          </g>
           <g style={{ transformOrigin: '60px 95px' }} className="animate-wheel-spin">
             <circle cx="60" cy="95" r="18" fill="#333" stroke="hsl(var(--foreground))" strokeWidth="2" />
             <circle cx="60" cy="95" r="6" fill="hsl(var(--muted))" />
          </g>
        </g>
        
        <text
            x="50%"
            y="25"
            textAnchor="middle"
            dy=".3em"
            className="text-2xl font-bold fill-primary"
        >
            {`${Math.round(progress)}%`}
        </text>

      </svg>
    </div>
  );
}
