
'use client';

import React from 'react';
import { Tractor, Leaf, Sun } from 'lucide-react';

interface GrowthAnimationProps {
  progress: number;
}

const CIRCLE_CIRCUMFERENCE = 2 * Math.PI * 90; // 2 * pi * r

export function GrowthAnimation({ progress }: GrowthAnimationProps) {
  const offset = CIRCLE_CIRCUMFERENCE - (progress / 100) * CIRCLE_CIRCUMFERENCE;

  return (
    <div className="relative w-48 h-48">
      <svg
        className="w-full h-full"
        viewBox="0 0 200 200"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Background Circle */}
        <circle
          cx="100"
          cy="100"
          r="90"
          stroke="hsl(var(--primary) / 0.1)"
          strokeWidth="10"
        />
        {/* Progress Circle */}
        <circle
          className="transition-all duration-300 ease-linear"
          cx="100"
          cy="100"
          r="90"
          stroke="hsl(var(--primary))"
          strokeWidth="10"
          strokeLinecap="round"
          transform="rotate(-90 100 100)"
          strokeDasharray={CIRCLE_CIRCUMFERENCE}
          style={{ strokeDashoffset: offset }}
        />
        {/* Rotating Icons */}
        <g className="splash-icon-group origin-center">
            <g transform="translate(100, 10) rotate(0, 0, 0)">
                 <Sun className="text-yellow-500" width="24" height="24" />
            </g>
             <g transform="translate(178, 100) rotate(90, 0, 0)">
                <Tractor className="text-primary" width="24" height="24" />
            </g>
             <g transform="translate(22, 100) rotate(-90, 0, 0)">
                <Leaf className="text-green-600" width="24" height="24" />
            </g>
        </g>
        {/* Percentage Text */}
        <text
          x="100"
          y="100"
          textAnchor="middle"
          dy=".3em"
          className="text-4xl font-bold fill-primary"
        >
          {`${Math.round(progress)}%`}
        </text>
      </svg>
    </div>
  );
}
