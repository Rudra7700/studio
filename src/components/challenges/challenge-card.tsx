
'use client';
import { CheckCircle2, Circle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Challenge } from '@/lib/types';

interface ChallengeCardProps {
  challenge: Challenge;
  onToggle: (id: string) => void;
}

export function ChallengeCard({ challenge, onToggle }: ChallengeCardProps) {
    return (
        <div 
            className={cn(
                "p-4 rounded-lg flex items-start gap-4 transition-all cursor-pointer",
                challenge.isCompleted ? 'bg-green-500/10 border-green-500/30 border' : 'bg-card hover:bg-card-foreground/5'
            )}
            onClick={() => onToggle(challenge.id)}
        >
            <div className="mt-1">
                {challenge.isCompleted ? <CheckCircle2 className="h-5 w-5 text-green-600" /> : <Circle className="h-5 w-5 text-muted-foreground" />}
            </div>
            <div className="flex-grow">
                <p className={cn("font-semibold", challenge.isCompleted && "line-through text-muted-foreground")}>{challenge.title}</p>
                <p className={cn("text-sm text-muted-foreground", challenge.isCompleted && "line-through")}>{challenge.description}</p>
            </div>
            <div className="text-right">
                <p className={cn("font-bold text-lg text-primary", challenge.isCompleted && "text-green-600")}>+{challenge.points}</p>
                <p className="text-xs text-muted-foreground">Points</p>
            </div>
        </div>
    );
}
