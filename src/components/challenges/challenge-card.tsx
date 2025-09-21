
'use client';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import type { Challenge } from '@/lib/types';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

export function ChallengeCard({ challenge }: { challenge: Challenge }) {
    const [isCompleted, setIsCompleted] = useState(challenge.isCompleted);

    const handleToggle = () => {
        // In a real app, this would be a server action
        setIsCompleted(!isCompleted);
    }
    
    return (
        <div 
            className={cn(
                "p-4 rounded-lg flex items-start gap-4 transition-all",
                isCompleted ? 'bg-green-500/10 border-green-500/30 border' : 'bg-card'
            )}
            onClick={handleToggle}
        >
            <div className="mt-1">
                {isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="flex-grow">
                <p className={cn("font-semibold", isCompleted && "line-through text-muted-foreground")}>{challenge.title}</p>
                <p className={cn("text-sm text-muted-foreground", isCompleted && "line-through")}>{challenge.description}</p>
            </div>
            <div className="text-right">
                <p className={cn("font-bold text-lg text-primary", isCompleted && "text-green-600")}>+{challenge.points}</p>
                <p className="text-xs text-muted-foreground">Points</p>
            </div>
        </div>
    );
}
