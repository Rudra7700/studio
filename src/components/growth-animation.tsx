
'use client';
import { useEffect, useState } from 'react';

const SeedIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-yellow-800">
    <path d="M12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="currentColor" />
  </svg>
);

const SproutIcon = () => (
  <svg width="64" height="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-600">
    <path d="M7 20h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 20V4a2 2 0 0 1 2-2h0a2 2 0 0 1 2 2v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M12 4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v1" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SaplingIcon = () => (
  <svg width="64" height-="64" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-green-700">
      <path d="M12 20V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 12h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 8h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
      <path d="M6 16h12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

export function GrowthAnimation({ quote }: { quote: string }) {
  const [growthStage, setGrowthStage] = useState(0);

  useEffect(() => {
    const stage1 = setTimeout(() => setGrowthStage(1), 1500); // Start sprouting
    const stage2 = setTimeout(() => setGrowthStage(2), 2200); // Grow to sapling
    return () => {
      clearTimeout(stage1);
      clearTimeout(stage2);
    };
  }, []);

  return (
    <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-full max-w-md px-4 text-center">
      <div 
        className="min-h-24 flex items-end justify-center animate-in fade-in slide-in-from-bottom-5 duration-500" 
        style={{ animationDelay: '1500ms' }}
      >
        {growthStage === 0 && <SeedIcon />}
        {growthStage === 1 && <SproutIcon />}
        {growthStage === 2 && <SaplingIcon />}
      </div>
      
      {/* Soil line progress bar */}
      <div className="w-full h-1 bg-yellow-900/20 rounded-full mt-4 overflow-hidden">
        <div 
            className="h-full bg-yellow-800" 
            style={{ 
                animation: 'fill-progress 1.5s linear 1.5s forwards',
                width: '0%',
            }}
        />
      </div>

      <style jsx>{`
        @keyframes fill-progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        @keyframes typing {
          from { width: 0; }
          to { width: 100%; }
        }
      `}</style>
      
      <p 
        className="text-sm text-muted-foreground mt-4 h-10 overflow-hidden whitespace-nowrap animate-in fade-in duration-300"
        style={{ animationDelay: '500ms' }}
      >
        <span 
            className="inline-block"
            style={{ 
                animation: 'typing 1s steps(40, end) .5s forwards',
                width: '0%',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                borderRight: '.15em solid hsl(var(--primary))'
            }}
        >
            "{quote}"
        </span>
      </p>
    </div>
  );
}
