
'use client';
import { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Progress } from './ui/progress';
import { Label } from './ui/label';
import { ShowerHead, Waves, Play, CircleStop, Timer } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

type IrrigationStatus = 'Idle' | 'Watering' | 'Stopping';

const statusInfo = {
  Idle: { text: 'Idle', color: 'text-muted-foreground' },
  Watering: { text: 'Watering', color: 'text-blue-500' },
  Stopping: { text: 'Stopping...', color: 'text-yellow-500' },
};

export function IrrigationControl() {
  const [status, setStatus] = useState<IrrigationStatus>('Idle');
  const [waterStorage, setWaterStorage] = useState(85);
  const [timerMinutes, setTimerMinutes] = useState('15');
  const [remainingTime, setRemainingTime] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (status === 'Watering' && remainingTime > 0) {
      timerRef.current = setTimeout(() => {
        setRemainingTime(prev => prev - 1);
        setWaterStorage(prev => Math.max(0, prev - 0.1));
      }, 1000);
    } else if (remainingTime === 0 && status === 'Watering') {
      handleStop();
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [status, remainingTime]);

  const handleStart = () => {
    const durationSeconds = parseInt(timerMinutes, 10) * 60;
    if (isNaN(durationSeconds) || durationSeconds <= 0) {
      toast({
        variant: 'destructive',
        title: 'Invalid Timer',
        description: 'Please enter a valid number of minutes.',
      });
      return;
    }
    if (waterStorage < 10) {
        toast({
            variant: 'destructive',
            title: 'Low Water Storage',
            description: 'Refill the water tank before starting irrigation.',
        });
        return;
    }

    setStatus('Watering');
    setRemainingTime(durationSeconds);
    toast({
      title: 'Irrigation Started',
      description: `Sprinklers will run for ${timerMinutes} minutes.`,
    });
  };

  const handleStop = () => {
    setStatus('Stopping');
    if (timerRef.current) clearTimeout(timerRef.current);
    toast({
      title: 'Irrigation Stopping',
      description: 'Sprinklers are shutting down.',
    });
    setTimeout(() => {
      setStatus('Idle');
      setRemainingTime(0);
    }, 2000);
  };
  
  const isBusy = status !== 'Idle';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2"><ShowerHead/> Irrigation Control</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
            <div className="flex justify-between text-sm">
                <span className="font-medium flex items-center gap-1"><Waves className="w-4 h-4"/> Water Storage</span>
                <span>{waterStorage.toFixed(0)}%</span>
            </div>
            <Progress value={waterStorage} />
        </div>
        <div className="flex justify-between items-center bg-card-foreground/5 p-3 rounded-lg">
          <span className="font-semibold">Status</span>
          <div className={cn("flex items-center gap-2 font-medium", statusInfo[status].color)}>
            <span>{statusInfo[status].text}</span>
            {status === 'Watering' && (
                <span className="text-xs font-mono">({Math.floor(remainingTime / 60)}:{(remainingTime % 60).toString().padStart(2, '0')})</span>
            )}
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="irrigation-timer" className="flex items-center gap-1"><Timer className="w-4 h-4"/> Set Timer (minutes)</Label>
          <Input 
            id="irrigation-timer"
            type="number"
            value={timerMinutes}
            onChange={(e) => setTimerMinutes(e.target.value)}
            placeholder="e.g., 15"
            disabled={isBusy}
          />
        </div>
      </CardContent>
      <CardFooter className="grid grid-cols-2 gap-2">
        <Button onClick={handleStart} disabled={isBusy}>
            <Play className="mr-2 h-4 w-4"/> Start Sprinklers
        </Button>
        <Button onClick={handleStop} disabled={!isBusy || status === 'Stopping'} variant="destructive">
            <CircleStop className="mr-2 h-4 w-4"/> Stop Now
        </Button>
      </CardFooter>
    </Card>
  );
}
