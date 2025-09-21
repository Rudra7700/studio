
'use client';
import { Progress } from "./ui/progress";
import { Camera, Gauge, Battery } from "lucide-react";

interface MissionProgressProps {
    progress: number;
    photosTaken: number;
    speed: number;
    battery: number;
}

export function MissionProgress({ progress, photosTaken, speed, battery }: MissionProgressProps) {
    return (
        <div className="bg-black/50 backdrop-blur-sm rounded-lg p-3 text-white space-y-3">
            <div className="flex justify-between items-center text-sm">
                <span className="font-bold">Mission Progress</span>
                <span className="font-mono">{progress.toFixed(0)}%</span>
            </div>
            <Progress value={progress} className="h-2"/>
            <div className="grid grid-cols-3 gap-2 text-center text-xs">
                <div className="bg-white/10 p-2 rounded-md">
                    <Battery className="mx-auto h-4 w-4 mb-1 text-primary"/>
                    <p className="font-semibold">{battery.toFixed(1)}%</p>
                    <p className="text-muted-foreground">Battery</p>
                </div>
                <div className="bg-white/10 p-2 rounded-md">
                    <Gauge className="mx-auto h-4 w-4 mb-1 text-primary"/>
                    <p className="font-semibold">{speed.toFixed(1)} km/h</p>
                    <p className="text-muted-foreground">Speed</p>
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
