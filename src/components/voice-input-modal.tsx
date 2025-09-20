
'use client';
import { Mic, X } from 'lucide-react';
import { Button } from './ui/button';
import { cn } from '@/lib/utils';

interface VoiceInputModalProps {
  show: boolean;
  onClose: () => void;
}

export function VoiceInputModal({ show, onClose }: VoiceInputModalProps) {
  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-background/90 backdrop-blur-sm">
      <Button
        variant="ghost"
        size="icon"
        className="absolute top-4 right-4 h-10 w-10 text-muted-foreground"
        onClick={onClose}
      >
        <X className="h-6 w-6" />
        <span className="sr-only">Close</span>
      </Button>

      <div className="text-center space-y-6">
        <p className="text-2xl font-medium text-foreground">Listening...</p>
        <div className="relative w-48 h-48 mx-auto">
          <div className="absolute inset-0 bg-primary/20 rounded-full animate-ping"></div>
          <div className="relative flex items-center justify-center w-full h-full bg-primary/10 rounded-full">
            <Mic className="h-24 w-24 text-primary" />
          </div>
        </div>
        <p className="text-muted-foreground">
          You can say things like "Scan North Corn Field" or "What's the weather?"
        </p>
      </div>
    </div>
  );
}
