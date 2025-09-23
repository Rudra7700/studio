
'use client';
import { Mic, X } from 'lucide-react';
import { Button } from './ui/button';
import { useEffect, useRef, useState } from 'react';
import { useToast } from '@/hooks/use-toast';

interface VoiceInputProps {
  show: boolean;
  onClose: () => void;
  onResult: (transcript: string) => void;
}

declare global {
    interface Window {
        SpeechRecognition: any;
        webkitSpeechRecognition: any;
    }
}


export function VoiceInput({ show, onClose, onResult }: VoiceInputProps) {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef<any>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (show) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      if (!SpeechRecognition) {
        toast({
          variant: 'destructive',
          title: 'Speech Recognition Not Supported',
          description: 'Your browser does not support voice input. Please try Chrome or Safari.',
        });
        onClose();
        return;
      }

      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.lang = 'en-IN'; // Set to Indian English
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };

      recognition.onend = () => {
        setIsListening(false);
        onClose();
      };

      recognition.onerror = (event: any) => {
        console.error('Speech recognition error', event.error);
        onResult('');
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        onResult(transcript);
      };

      recognition.start();
      recognitionRef.current = recognition;
    } else {
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [show]);
  
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
