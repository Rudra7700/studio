
'use client';
import { Progress } from "./ui/progress";
import { Camera, Map, Timer } from "lucide-react";
import { format } from "date-fns";

const MISSION_DURATION_S = 30;

interface MissionProgressProps {
    progress: number;
    photosTaken: number;
    areaCovered: number;
}

export function MissionProgress({ progress, photosTaken, areaCovered }: MissionProgressProps) {
    const elapsedTime = (progress / 100) * MISSION_DURATION_S;

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    };

    return (
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white space-y-3">
            <div className="flex justify-between items-center text-sm">
                <span className="font-bold">Mission Progress</span>
                <span className="font-mono">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2"/>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/10 p-2 rounded-md">
                    <Timer className="mx-auto h-4 w-4 mb-1 text-primary"/>
                    <p className="font-semibold">{formatTime(elapsedTime)}</p>
                    <p className="text-muted-foreground">Elapsed Time</p>
                </div>
                <div className="bg-white/10 p-2 rounded-md">
                    <Map className="mx-auto h-4 w-4 mb-1 text-primary"/>
                    <p className="font-semibold">{areaCovered} ha</p>
                    <p className="text-muted-foreground">Area Scanned</p>
                </div>
                 <div className="bg-white/10 p-2 rounded-md">
                    <Camera className="mx-auto h-4 w-4 mb-1 text-primary"/>
                    <p className="font-semibold">{photosTaken}</p>
                    <p className="text-muted-foreground">Images Taken</p>
                </div>
            </div>
        </div>
    );
}
